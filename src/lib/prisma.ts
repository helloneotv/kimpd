import { PrismaClient } from "@prisma/client";

/**
 * Vercel/Neon에서 `:5432` 명시로 인한 풀러·SSL 혼동을 피하기 위해
 * 연결 문자열에서 포트를 제거하고(클라이언트 기본 5432), Prisma+PgBouncer에 필요한 플래그를 고정합니다.
 */
export function normalizeDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return raw;

  try {
    const u = new URL(raw);
    u.port = "";
    u.searchParams.set("pgbouncer", "true");
    return u.toString();
  } catch {
    let s = raw.trim();
    s = s.replace(/:\d+(?=\/)/, "");
    s = s.replace(/:\d+(?=\?)/, "");
    if (!/[?&]pgbouncer=/i.test(s)) {
      s = `${s}${s.includes("?") ? "&" : "?"}pgbouncer=true`;
    } else {
      s = s.replace(/([?&]pgbouncer=)[^&]*/i, "$1true");
    }
    return s;
  }
}

/**
 * Neon 풀러 + Vercel 서버리스: 타임아웃·동시 연결 완화 파라미터 보강.
 */
export function resolveDatabaseUrl(raw: string | undefined): string | undefined {
  const base = normalizeDatabaseUrl(raw);
  if (!base) return base;

  const parts: string[] = [];
  if (!/[?&]connect_timeout=/i.test(base)) parts.push("connect_timeout=15");
  if (!/[?&]pool_timeout=/i.test(base)) parts.push("pool_timeout=15");
  if (/pooler/i.test(base) && !/[?&]connection_limit=/i.test(base)) parts.push("connection_limit=1");
  if (parts.length === 0) return base;

  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}${parts.join("&")}`;
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
