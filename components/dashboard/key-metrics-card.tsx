import { DashboardModule } from "./dashboard-module";
import { DashboardResponse } from "@/lib/types/stock";

export function KeyMetricsCard({ data }: { data: DashboardResponse }) {
  return (
    <DashboardModule eyebrow="Indicators" title="Key Metrics">
      <div className="space-y-4 text-sm">
        <Row label="Volume" value={data.metrics.volume.toLocaleString()} />
        <Row
          label="Avg Volume"
          value={data.metrics.avgVolume?.toLocaleString() ?? "—"}
        />
        <Row label="RSI" value={data.metrics.rsi?.toFixed(2) ?? "—"} />
        <Row label="MACD" value={data.metrics.macd?.toFixed(2) ?? "—"} />
      </div>
    </DashboardModule>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
