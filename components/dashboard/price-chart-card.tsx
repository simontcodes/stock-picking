import { DashboardModule } from "./dashboard-module";
import { DashboardResponse } from "@/lib/types/stock";

export function PriceChartCard({ data }: { data: DashboardResponse }) {
  return (
    <DashboardModule eyebrow="Trend" title="Price Action">
      <div className="mb-6 flex gap-2">
        {["1D", "5D", "1M", "6M", "1Y", "MAX"].map((range) => (
          <button
            key={range}
            className="rounded-full px-3 py-1.5 text-xs text-[var(--text-secondary)] transition hover:bg-[var(--surface-container-high)] hover:text-[var(--text-primary)]"
          >
            {range}
          </button>
        ))}
      </div>

      <div className="surface-low flex h-[360px] items-center justify-center rounded-[1rem] text-sm text-[var(--text-muted)]">
        Chart goes here
      </div>
    </DashboardModule>
  );
}
