import Image from "next/image";
import Link from "next/link";

import { SearchBar } from "@/components/search-bar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type HomeProps = {
  searchParams: Promise<{ q?: string }>;
};

function thumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let scripts: Awaited<ReturnType<typeof prisma.kimpdScript.findMany>> = [];
  let loadError: string | null = null;

  try {
    scripts = await prisma.kimpdScript.findMany({
      where: query
        ? {
            title: {
              contains: query,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { created_at: "desc" },
      take: 100,
    });
  } catch (err) {
    console.error("[KIMPD] kimpd_scripts 조회 실패:", err);
    loadError =
      err instanceof Error
        ? err.message
        : "데이터베이스에서 시나리오를 불러오지 못했습니다. Vercel의 DATABASE_URL과 Neon 연결을 확인하세요.";
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">최신 시나리오</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            n8n이 적재한 데이터를 캐시 없이 불러옵니다. 새 행이 보이지 않으면 새로고침해 보세요.
          </p>
        </div>
        <SearchBar defaultQuery={query} />
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 dark:border-red-900/50 dark:bg-red-950/40">
          <p className="font-medium text-red-800 dark:text-red-200">DB 연결 오류</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-red-700/90 dark:text-red-300/90">{loadError}</p>
          <p className="mt-4 text-xs text-red-600/80 dark:text-red-400/80">
            Vercel → Settings → Environment Variables에 Production용 <code className="rounded bg-red-100 px-1 dark:bg-red-900/60">DATABASE_URL</code>이
            있는지 확인하세요. Neon 풀러 URL 사용 시 일부 환경에서는 연결 문자열에서{" "}
            <code className="rounded bg-red-100 px-1 dark:bg-red-900/60">channel_binding=require</code>를 제거해야 할 수 있습니다.
          </p>
        </div>
      ) : scripts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 px-8 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
          <p className="text-zinc-600 dark:text-zinc-400">
            {query ? "검색 결과가 없습니다." : "아직 저장된 시나리오가 없습니다."}
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">Neon의 kimpd_scripts 테이블과 DATABASE_URL을 확인해 주세요.</p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scripts.map((row) => {
            const idStr = row.id.toString();
            return (
              <li key={idStr}>
                <Link
                  href={`/script/${idStr}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-[var(--card)] shadow-sm transition hover:border-amber-500/40 hover:shadow-md dark:border-zinc-800 dark:hover:border-amber-400/35"
                >
                  <div className="relative aspect-video w-full bg-zinc-900/5 dark:bg-zinc-950">
                    <Image
                      src={thumbnailUrl(row.video_id)}
                      alt=""
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{row.title}</h2>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{row.video_id}</p>
                    <time className="mt-auto text-xs text-zinc-500 dark:text-zinc-500" dateTime={row.created_at.toISOString()}>
                      {row.created_at.toLocaleString("ko-KR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
