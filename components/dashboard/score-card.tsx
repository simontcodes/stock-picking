import { DashboardModule } from "./dashboard-module";
import { DashboardResponse } from "@/lib/types/stock";

export function ScoreCard({ data }: { data: DashboardResponse }) {
  return (
    <DashboardModule eyebrow="Conviction" title="Stock Score">
      <div className="mb-6">
        <div className="display-lg tabular-nums">{data.score.total}</div>
        <div className="mt-2 text-sm text-[var(--text-secondary)]">
          Out of 100
        </div>
      </div>

      <div className="space-y-4">
        <Progress label="Growth" value={data.score.growth} />
        <Progress label="Quality" value={data.score.quality} />
        <Progress label="Valuation" value={data.score.valuation} />
        <Progress label="Momentum" value={data.score.momentum} />
      </div>
    </DashboardModule>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="surface-low h-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--primary)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
