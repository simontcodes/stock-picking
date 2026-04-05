"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TickerSearch } from "@/components/dashboard/ticker-search";
import { HeroSignalPanel } from "@/components/dashboard/hero-signal-panel";
import { PriceChartCard } from "@/components/dashboard/price-chart-card";
import { MacdChartCard } from "@/components/dashboard/macd-chart-card";
import { VolumeChartCard } from "@/components/dashboard/volume-chart-card";
import { PerformanceTable } from "@/components/dashboard/performance-table";
import { PositionCalculatorCard } from "@/components/dashboard/position-calculator-card";
import { ScoreCard } from "@/components/dashboard/score-card";
import { KeyMetricsCard } from "@/components/dashboard/key-metrics-card";
import { WatchlistCard } from "@/components/dashboard/watchlist-card";
import type { DashboardResponse } from "@/lib/types/stock";

type DashboardLayoutMode = "default" | "wide";

async function fetchDashboard(
  ticker: string,
  range: string,
): Promise<DashboardResponse> {
  const res = await fetch(
    `/api/stock/dashboard?ticker=${encodeURIComponent(ticker)}&range=${encodeURIComponent(range)}`,
  );

  if (!res.ok) {
    let message = "Failed to fetch dashboard data";

    try {
      const errorData = await res.json();
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      // ignore json parse errors
    }

    throw new Error(message);
  }

  return res.json();
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ticker = useMemo(
    () => (searchParams.get("ticker") ?? "COST").trim().toUpperCase(),
    [searchParams],
  );

  const range = useMemo(() => searchParams.get("range") ?? "1y", [searchParams]);

  const layout = useMemo<DashboardLayoutMode>(() => {
    const value = searchParams.get("layout");
    return value === "wide" ? "wide" : "default";
  }, [searchParams]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["stock-dashboard", ticker, range],
    queryFn: () => fetchDashboard(ticker, range),
    enabled: !!ticker,
  });

  const isInitialLoading = isLoading && !data;
  const isRefreshing = isFetching && !!data;

  function updateSearchParams(
    updates: Record<string, string | null | undefined>,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`);
  }

  function handleSearch(nextTicker: string) {
    const normalizedTicker = nextTicker.trim().toUpperCase();
    if (!normalizedTicker) return;

    updateSearchParams({
      ticker: normalizedTicker,
    });
  }

  function handleLayoutChange(nextLayout: DashboardLayoutMode) {
    updateSearchParams({
      layout: nextLayout === "default" ? null : nextLayout,
    });
  }

  return (
    <AppShell layout={layout} onLayoutChange={handleLayoutChange}>
      <TickerSearch
        defaultValue={ticker}
        onSearch={handleSearch}
        isLoading={isRefreshing}
      />

      {isInitialLoading && (
        <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-8 text-[var(--text-secondary)]">
          Loading dashboard...
        </div>
      )}

      {error && !isInitialLoading && (
        <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-8 text-[var(--tertiary)]">
          {error instanceof Error
            ? error.message
            : "Failed to load stock data."}
        </div>
      )}

      {data && (
        <>
          <div className="mb-6">
            <HeroSignalPanel data={data} />
          </div>

          {layout === "default" ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-8">
                <PriceChartCard data={data} />
                <MacdChartCard data={data} />
                <VolumeChartCard data={data} />
                <PerformanceTable data={data} />
              </div>

              <div className="space-y-6 xl:col-span-4">
                <WatchlistCard />
                <PositionCalculatorCard data={data} />
                <KeyMetricsCard data={data} />
                <ScoreCard data={data} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <PriceChartCard data={data} />
              <MacdChartCard data={data} />
              <VolumeChartCard data={data} />

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="xl:col-span-8">
                  <PerformanceTable data={data} />
                </div>

                <div className="space-y-6 xl:col-span-4">
                  <PositionCalculatorCard data={data} />
                  <KeyMetricsCard data={data} />
                  <ScoreCard data={data} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}