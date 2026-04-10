import { PrismaClient } from "@prisma/client";

/**
 * Neon + Vercel/Prisma에서 흔한 두 가지만 처리합니다 (나머지 URL은 그대로).
 * @see https://neon.tech/docs/guides/prisma — cold start 시 connect_timeout 권장
 * @see UI 안내 — channel_binding=require 제거가 필요한 환경이 있음
 */
function prismaDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return raw;

  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    if (!u.searchParams.has("connect_timeout")) {
      u.searchParams.set("connect_timeout", "15");
    }
    return u.toString();
  } catch {
    return raw;
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const url = prismaDatabaseUrl(process.env.NEW_DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: url ?? process.env.NEW_DATABASE_URL } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
