import ReactMarkdown from "react-markdown";

type ScenarioMarkdownProps = {
  content: string;
};

export function ScenarioMarkdown({ content }: ScenarioMarkdownProps) {
  return (
    <div className="scenario-md space-y-4 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
      <ReactMarkdown
        components={{
          h1: (p) => <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50" {...p} />,
          h2: (p) => <h2 className="mt-5 text-xl font-semibold text-zinc-900 dark:text-zinc-50" {...p} />,
          h3: (p) => <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50" {...p} />,
          p: (p) => <p className="whitespace-pre-wrap" {...p} />,
          ul: (p) => <ul className="list-inside list-disc space-y-1" {...p} />,
          ol: (p) => <ol className="list-inside list-decimal space-y-1" {...p} />,
          li: (p) => <li className="pl-1" {...p} />,
          a: (p) => (
            <a className="font-medium text-amber-700 underline decoration-amber-500/40 underline-offset-2 hover:decoration-amber-500 dark:text-amber-400 dark:decoration-amber-400/40" {...p} />
          ),
          code: (p) => (
            <code
              className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              {...p}
            />
          ),
          pre: (p) => (
            <pre
              className="overflow-x-auto rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900/60"
              {...p}
            />
          ),
          blockquote: (p) => (
            <blockquote className="border-l-4 border-amber-500/60 pl-4 italic text-zinc-600 dark:text-zinc-400" {...p} />
          ),
          hr: () => <hr className="my-8 border-zinc-200 dark:border-zinc-700" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
