import { DashboardModule } from "./dashboard-module";
import type { DashboardResponse } from "@/lib/types/stock";

export function HeroSignalPanel({ data }: { data: DashboardResponse }) {
  const signalStyles =
    data.signal === "BUY"
      ? "bg-[rgba(10,188,86,0.14)] text-[var(--primary)]"
      : data.signal === "SELL"
        ? "bg-red-500/15 text-red-400"
        : "bg-white/10 text-[var(--text-secondary)]";

  return (
    <DashboardModule className="rounded-[1.5rem] px-6 py-5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <div className="label-sm text-[var(--text-muted)]">Current Asset</div>
          <div className="mt-2 text-[2.1rem] font-bold tracking-[-0.05em]">
            {data.ticker}{" "}
            <span className="text-[var(--text-secondary)]">
              {data.companyName}
            </span>
          </div>
        </div>

        <div>
          <div className="label-sm text-[var(--text-muted)]">Market Signal</div>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${signalStyles}`}
            >
              {data.signal}
            </span>
            <span className="text-3xl font-bold tabular-nums">
              ${data.currentPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div>
            <div className="label-sm text-[var(--text-muted)]">Year High</div>
            <div className="mt-2 text-xl font-semibold tabular-nums">
              ${data.summary.yearHigh.value.toFixed(2)}
            </div>
            <div className="text-sm text-red-300">
              {data.summary.yearHigh.percentFromHigh.toFixed(2)}%
            </div>
          </div>

          <div className="rounded-[1rem] bg-[rgba(10,188,86,0.1)] px-4 py-3">
            <div className="label-sm text-[var(--primary)]">
              Best Day to Buy
            </div>
            <div className="mt-1 text-lg font-semibold text-[var(--primary)]">
              {data.summary.bestDayToBuy}
            </div>
          </div>
        </div>
      </div>
    </DashboardModule>
  );
}
