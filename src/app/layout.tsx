import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KIMPD · 시나리오 대시보드",
  description: "무성 코미디 유튜브 자동화 시나리오 실시간 목록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <div className="min-h-full bg-[var(--background)] text-[var(--foreground)] transition-colors">
            <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-[var(--background)]/90 backdrop-blur-md dark:border-zinc-800/80">
              <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <Link href="/" className="group flex flex-col">
                  <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">KIMPD</span>
                  <span className="text-xs font-medium text-zinc-500 transition group-hover:text-amber-600 dark:text-zinc-400 dark:group-hover:text-amber-400">
                    무성 코미디 · 시나리오 보드
                  </span>
                </Link>
                <ThemeToggle />
              </div>
            </header>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
