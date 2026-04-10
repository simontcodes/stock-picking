"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Send, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { triggerWatchlistReport } from "@/lib/api/watchlist-alerts";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/lib/watchlist/use-watchlist";

export function WatchlistCard() {
  const [ticker, setTicker] = useState("");
  const [isTriggeringReport, setIsTriggeringReport] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const watchlistQuery = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const isSubmitting = addMutation.isPending || removeMutation.isPending;

  const items = useMemo(
    () => watchlistQuery.data?.items ?? [],
    [watchlistQuery.data],
  );
  const activeTicker = (searchParams.get("ticker") ?? "").trim().toUpperCase();

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

  function handleSelectTicker(nextTicker: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("ticker", nextTicker);
    router.push(`?${params.toString()}`);
  }

  async function handleTriggerReport() {
    setIsTriggeringReport(true);

    try {
      const result = await triggerWatchlistReport();
      const summaryLines = result.tickerResults.map((tickerResult) => {
        const currentSignal = tickerResult.currentSignal
          ? `${tickerResult.currentSignal.signal} (${tickerResult.currentSignal.signalDate})`
          : "none";

        return `${tickerResult.ticker}: current=${currentSignal}; status=${tickerResult.runStatus}; reason=${tickerResult.runReason}`;
      });

      window.alert(
        [
          `Watchlist report triggered.`,
          `Scanned: ${result.tickersScanned}`,
          `Alerts created: ${result.alertsCreated}`,
          `Alerts suppressed: ${result.alertsSuppressed}`,
          "",
          ...summaryLines,
        ].join("\n"),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to trigger watchlist report.",
      );
    } finally {
      setIsTriggeringReport(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(10,188,86,0.12),transparent_34%),linear-gradient(180deg,rgba(18,24,31,0.98),rgba(13,17,23,0.96))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-200/45">
            Watchtower
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Watchlist
          </h3>
          <p className="mt-1 text-sm text-white/45">
            Track long-term setups and trigger a report on demand.
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Star className="h-4 w-4" />
        </div>
      </div>

      <div className="mb-4 rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">
              Tracking
            </div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-2xl font-semibold tracking-[-0.04em] text-white tabular-nums">
                {items.length}
              </span>
              <span className="pb-1 text-xs text-white/40">
                {items.length === 1 ? "ticker saved" : "tickers saved"}
              </span>
            </div>
          </div>

          {activeTicker ? (
            <div className="rounded-2xl border border-emerald-400/18 bg-emerald-400/[0.08] px-3 py-2 text-right">
              <div className="text-[10px] uppercase tracking-[0.16em] text-emerald-200/45">
                Focus
              </div>
              <div className="mt-1 text-sm font-semibold tracking-[0.08em] text-emerald-100">
                {activeTicker}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex items-center gap-2">
        <Input
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Add ticker"
          className="h-11 rounded-2xl border-white/8 bg-white/[0.04] text-sm text-white placeholder:text-white/30 focus-visible:border-emerald-400/30 focus-visible:ring-emerald-400/15"
        />

        <Button
          type="submit"
          disabled={isSubmitting || isTriggeringReport}
          className="h-11 rounded-2xl bg-emerald-400 px-4 font-semibold text-black shadow-[0_8px_24px_rgba(10,188,86,0.22)] hover:bg-emerald-300"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add
        </Button>
      </form>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/8 bg-white/[0.025] px-3 py-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.16em] text-white/35">
            Daily Report
          </div>
          <p className="mt-1 text-sm text-white/55">
            Run the current watchlist summary now.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || isTriggeringReport}
          onClick={handleTriggerReport}
          className="h-10 shrink-0 rounded-2xl border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-4 text-white hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
        >
          <Send className="mr-1.5 h-4 w-4" />
          {isTriggeringReport ? "Running..." : "Run Report"}
        </Button>
      </div>

      {watchlistQuery.isLoading ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-5 text-sm text-white/45">
          Loading watchlist...
        </div>
      ) : watchlistQuery.isError ? (
        <div className="rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-5 text-sm text-red-300">
          Failed to load watchlist.
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[1.6rem] border border-dashed border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] px-4 py-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/12 bg-emerald-400/10 text-emerald-300">
            <Plus className="h-4 w-4" />
          </div>
          <p className="mt-3 text-sm font-medium text-white/80">
            No tickers added yet
          </p>
          <p className="mt-1 text-sm text-white/40">
            Add symbols above to start tracking signals and daily reports.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/35">
              Saved Tickers
            </p>
            <p className="text-xs text-white/35">
              Click a row to load it into the dashboard.
            </p>
          </div>

          <div className="space-y-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center justify-between rounded-[1.35rem] border px-3 py-3 transition-all ${
                  item.ticker === activeTicker
                    ? "border-emerald-400/25 bg-emerald-400/[0.10] shadow-[0_10px_25px_rgba(10,188,86,0.10)]"
                    : "border-white/7 bg-white/[0.035] hover:border-white/12 hover:bg-white/[0.055]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectTicker(item.ticker)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold tracking-[0.08em] text-white transition-colors group-hover:text-emerald-300">
                      {item.ticker}
                    </p>
                    {item.ticker === activeTicker ? (
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                        Active
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-white/38">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        item.enabled ? "bg-emerald-300" : "bg-white/25"
                      }`}
                    />
                    <span>{item.enabled ? "Alerts enabled" : "Disabled"}</span>
                  </div>
                </button>

                <button
                  type="button"
                  aria-label={`Remove ${item.ticker} from watchlist`}
                  disabled={isSubmitting || isTriggeringReport}
                  onClick={() => removeMutation.mutate(item.ticker)}
                  className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white/45 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
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
