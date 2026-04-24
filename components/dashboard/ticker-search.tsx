"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";

type Props = {
  onSearch: (ticker: string) => void;
  defaultValue?: string;
  isLoading?: boolean;
};

export function TickerSearch({
  onSearch,
  defaultValue = "AAPL",
  isLoading = false,
}: Props) {
  const [ticker, setTicker] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTicker(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeLoading = mounted ? isLoading : false;
  const showClear = mounted && ticker.length > 0 && !safeLoading;

  function submitSearch() {
    const normalized = ticker.trim().toUpperCase();
    if (!normalized || safeLoading) return;
    onSearch(normalized);
  }

  return (
    <section className="mb-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(18,24,33,0.88),rgba(11,16,24,0.94))] shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 p-4 md:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />

                <input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch();
                  }}
                  placeholder="Search ticker symbol..."
                  className="h-14 w-full rounded-[1.1rem] border border-white/6 bg-white/[0.03] pl-11 pr-12 text-[15px] font-medium text-[var(--text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:border-white/12 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.10)]"
                />

                {/* ONLY render dynamic UI after mount */}
                {mounted && (
                  <>
                    {showClear && (
                      <button
                        type="button"
                        onClick={() => setTicker("")}
                        className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-white/6 hover:text-[var(--text-primary)]"
                        aria-label="Clear ticker"
                      >
                        <X className="size-4" />
                      </button>
                    )}

                    {safeLoading && (
                      <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-[var(--text-muted)]" />
                    )}
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={submitSearch}
                disabled={!ticker.trim() || safeLoading}
                className="h-14 rounded-[1.1rem] px-6 font-semibold text-black transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-[linear-gradient(135deg,#22c55e,#34d399)] shadow-[0_8px_30px_rgba(34,197,94,0.25)] hover:brightness-105 lg:min-w-[140px]"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
