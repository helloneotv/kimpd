import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** 배포·라우팅 진단용 (DB 없음). 200이면 Vercel에서 Next 라우트는 살아 있습니다. */
export function GET() {
  return NextResponse.json({ ok: true, service: "kimpd" }, { status: 200 });
}
