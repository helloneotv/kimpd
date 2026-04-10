import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

/**
 * Vercel Node 런타임에서 WebSocket 기반 Neon 드라이버 사용 (TCP Query Engine 대신).
 * @see https://neon.tech/docs/guides/prisma
 */
neonConfig.webSocketConstructor = ws;

function neonConnectionString(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return raw;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return raw;
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma(): PrismaClient {
  const conn = neonConnectionString(process.env.NEW_DATABASE_URL);
  if (!conn) {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  const pool = new Pool({ connectionString: conn });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
