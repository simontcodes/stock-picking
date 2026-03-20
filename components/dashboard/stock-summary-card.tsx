import { DashboardModule } from "./dashboard-module";
import { DashboardResponse } from "@/lib/types/stock";

export function StockSummaryCard({ data }: { data: DashboardResponse }) {
  return (
    <DashboardModule eyebrow="Snapshot" title="Stock Summary">
      <div className="space-y-4 text-sm">
        <Row label="Ticker" value={data.ticker} />
        <Row label="Company" value={data.companyName} />
        <Row label="Current Price" value={`$${data.currentPrice.toFixed(2)}`} />
        <Row
          label="Moving Average"
          value={`$${data.movingAverage.toFixed(2)}`}
        />
      </div>
    </DashboardModule>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="tabular-nums text-right">{value}</span>
    </div>
  );
}
