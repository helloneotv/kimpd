"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">문제가 발생했습니다</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        다시 시도
      </button>
    </main>
  );
}
