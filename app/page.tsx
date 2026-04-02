"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { HeroSignalPanel } from "@/components/dashboard/hero-signal-panel";
import { PriceChartCard } from "@/components/dashboard/price-chart-card";
import { MacdChartCard } from "@/components/dashboard/macd-chart-card";
import { VolumeChartCard } from "@/components/dashboard/volume-chart-card";
import { PerformanceTable } from "@/components/dashboard/performance-table";
import { PositionCalculatorCard } from "@/components/dashboard/position-calculator-card";
import { ScoreCard } from "@/components/dashboard/score-card";
import { KeyMetricsCard } from "@/components/dashboard/key-metrics-card";
import type { DashboardResponse } from "@/lib/types/stock";

async function fetchDashboard(
  ticker: string,
  range: string,
): Promise<DashboardResponse> {
  const res = await fetch(`/api/stock/dashboard?ticker=${ticker}&range=${range}`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return res.json();
}

export default function HomePage() {
  const [ticker] = useState("COST");
  const [range] = useState("1y");

  const { data, isLoading, error } = useQuery({
    queryKey: ["stock-dashboard", ticker, range],
    queryFn: () => fetchDashboard(ticker, range),
  });

  return (
    <AppShell>
      {isLoading && (
        <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-8 text-[var(--text-secondary)]">
          Loading dashboard...
        </div>
      )}

      {error && (
        <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-8 text-[var(--tertiary)]">
          Failed to load stock data.
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <HeroSignalPanel data={data} />
            <PriceChartCard data={data} />
            <MacdChartCard data={data} />
            <VolumeChartCard data={data} />
            <PerformanceTable data={data} />
          </div>

          <div className="space-y-6 xl:col-span-4">
            <PositionCalculatorCard data={data} />
            <KeyMetricsCard data={data} />
            <ScoreCard data={data} />
          </div>
        </div>
      )}
    </AppShell>
  );
}