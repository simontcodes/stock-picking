import { DashboardModule } from "./dashboard-module";
import { DashboardResponse } from "@/lib/types/stock";

export function PositionCalculatorCard({ data }: { data: DashboardResponse }) {
  return (
    <DashboardModule eyebrow="Risk" title="Position Calculator">
      <div className="space-y-4 text-sm">
        <Row label="Entry Price" value={`$${data.currentPrice.toFixed(2)}`} />
        <Row label="Stop Loss" value={`$${data.stopLoss.toFixed(2)}`} />
        <Row label="Position Size" value={`$${data.positionSize.toFixed(2)}`} />
        <Row label="Max Loss" value={`$${data.maxLoss.toFixed(2)}`} danger />
      </div>
    </DashboardModule>
  );
}

function Row({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span
        className={`tabular-nums ${danger ? "text-[var(--tertiary)]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
