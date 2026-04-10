import { PrismaClient } from "@prisma/client";

/**
 * Neon 풀러 + Vercel 서버리스에서 타임아웃·연결 고갈을 줄이기 위한 쿼리스트링 보강.
 * 비밀번호에 `?`/`&`가 들어가는 경우를 피하려고 전체 URL 문자열로만 다룹니다.
 */
export function resolveDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return raw;

  const parts: string[] = [];
  if (!/[?&]connect_timeout=/i.test(raw)) parts.push("connect_timeout=15");
  if (!/[?&]pool_timeout=/i.test(raw)) parts.push("pool_timeout=15");
  if (/pooler/i.test(raw)) {
    if (!/[?&]pgbouncer=/i.test(raw)) parts.push("pgbouncer=true");
    if (!/[?&]connection_limit=/i.test(raw)) parts.push("connection_limit=1");
  }
  if (parts.length === 0) return raw;

  const joiner = raw.includes("?") ? "&" : "?";
  return `${raw}${joiner}${parts.join("&")}`;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
