import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScenarioMarkdown } from "@/components/scenario-markdown";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

function thumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

export default async function ScriptDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const row = await prisma.kimpdScript.findUnique({
    where: { id: BigInt(id) },
  });

  if (!row) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
      >
        ← 목록으로
      </Link>

      <article className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-[var(--card)] shadow-sm dark:border-zinc-800">
        <div className="relative aspect-video w-full max-h-[320px] bg-zinc-100 dark:bg-zinc-950">
          <Image
            src={thumbnailUrl(row.video_id)}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 720px"
            unoptimized
          />
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">{row.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">{row.video_id}</span>
              <time dateTime={row.created_at.toISOString()}>
                {row.created_at.toLocaleString("ko-KR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </time>
            </div>
          </header>

          <div className="border-t border-zinc-200/80 pt-6 dark:border-zinc-800">
            <ScenarioMarkdown content={row.scenario} />
          </div>
        </div>
      </article>
    </main>
  );
}
