"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/lib/watchlist/use-watchlist";

export function WatchlistCard() {
  const [ticker, setTicker] = useState("");

  const watchlistQuery = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const isSubmitting = addMutation.isPending || removeMutation.isPending;

  const items = useMemo(() => watchlistQuery.data?.items ?? [], [watchlistQuery.data]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTicker = ticker.trim().toUpperCase();

    if (!normalizedTicker) {
      return;
    }

    addMutation.mutate(
      { ticker: normalizedTicker },
      {
        onSuccess: () => {
          setTicker("");
        },
      },
    );
  }

  return (
    <section className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(16,20,25,0.96),rgba(13,17,23,0.94))] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
            Tracking
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">Watchlist</h3>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
          <Star className="h-4 w-4" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-2">
        <Input
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Add ticker"
          className="h-11 rounded-2xl border-white/8 bg-white/[0.04] text-sm text-white placeholder:text-white/30"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-2xl bg-emerald-400 px-4 font-semibold text-black hover:bg-emerald-300"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add
        </Button>
      </form>

      {watchlistQuery.isLoading ? (
        <p className="text-sm text-white/45">Loading watchlist...</p>
      ) : watchlistQuery.isError ? (
        <p className="text-sm text-red-400">Failed to load watchlist.</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/8 bg-white/[0.025] px-4 py-5 text-sm text-white/40">
          No tickers added yet.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between rounded-2xl border border-white/7 bg-white/[0.035] px-3 py-3 transition-colors hover:border-white/12 hover:bg-white/[0.055]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[0.08em] text-white">
                  {item.ticker}
                </p>
                <p className="mt-0.5 text-xs text-white/35">
                  {item.enabled ? "Alerts enabled" : "Disabled"}
                </p>
              </div>

              <button
                type="button"
                aria-label={`Remove ${item.ticker} from watchlist`}
                disabled={isSubmitting}
                onClick={() => removeMutation.mutate(item.ticker)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-white/45 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {addMutation.isError ? (
        <p className="mt-3 text-xs text-red-400">
          {addMutation.error instanceof Error
            ? addMutation.error.message
            : "Failed to add ticker."}
        </p>
      ) : null}

      {removeMutation.isError ? (
        <p className="mt-3 text-xs text-red-400">
          {removeMutation.error instanceof Error
            ? removeMutation.error.message
            : "Failed to remove ticker."}
        </p>
      ) : null}
    </section>
  );
}