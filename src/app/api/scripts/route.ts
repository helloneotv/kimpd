import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const rows = await prisma.kimpdScript.findMany({
    where: q
      ? {
          title: {
            contains: q,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: { created_at: "desc" },
  });

  const body = rows.map((row) => ({
    id: row.id.toString(),
    title: row.title,
    video_id: row.video_id,
    scenario: row.scenario,
    created_at: row.created_at.toISOString(),
  }));

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
