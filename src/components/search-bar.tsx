type SearchBarProps = {
  defaultQuery: string;
};

export function SearchBar({ defaultQuery }: SearchBarProps) {
  return (
    <form className="flex w-full max-w-xl gap-2" action="/" method="get" role="search">
      <label htmlFor="q" className="sr-only">
        제목 검색
      </label>
      <input
        id="q"
        name="q"
        type="search"
        placeholder="제목으로 검색…"
        defaultValue={defaultQuery}
        className="min-w-0 flex-1 rounded-xl border border-zinc-300/90 bg-white/90 px-4 py-2.5 text-sm text-zinc-900 shadow-inner outline-none ring-zinc-400/40 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:ring-zinc-500/40"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        검색
      </button>
    </form>
  );
}
