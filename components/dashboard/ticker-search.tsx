"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Props = {
  onSearch: (ticker: string) => void;
  defaultValue?: string;
};

export function TickerSearch({ onSearch, defaultValue = "AAPL" }: Props) {
  const [ticker, setTicker] = useState(defaultValue);

  return (
    <div className="mb-12">
      <div className="surface-low mx-auto flex max-w-3xl items-center gap-3 rounded-[1rem] p-2 ghost-border">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && ticker.trim()) {
                onSearch(ticker.trim());
              }
            }}
            placeholder="Enter ticker (e.g. AAPL)"
            className="glass-input h-14 w-full rounded-[0.875rem] bg-transparent pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)] focus:scale-[1.01] focus:shadow-[0_0_0_4px_rgba(166,173,183,0.2)]"
          />
        </div>

        <button
          onClick={() => ticker.trim() && onSearch(ticker.trim())}
          className="h-14 rounded-[0.75rem] bg-[linear-gradient(15deg,var(--primary),var(--primary-container))] px-6 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
