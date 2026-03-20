import { DashboardModule } from "./dashboard-module";
import { DashboardResponse } from "@/lib/types/stock";

export function PerformanceTable({ data }: { data: DashboardResponse }) {
  const rows = [
    { label: "Today", value: data.performance.today },
    { label: "Previous Day", value: data.performance.previousDay },
    { label: "5 Days", value: data.performance.fiveDays },
    { label: "30 Days", value: data.performance.thirtyDays },
    { label: "60 Days", value: data.performance.sixtyDays },
    { label: "1 Year", value: data.performance.oneYear },
  ];

  return (
    <DashboardModule eyebrow="Performance" title="Historical Change">
      <div className="space-y-2">
        {rows.map((row) => {
          const positive = row.value >= 0;

          return (
            <div
              key={row.label}
              className="group surface-low flex items-center justify-between rounded-[0.875rem] px-4 py-4 transition hover:bg-[var(--surface-container-high)]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-transparent transition group-hover:bg-[var(--primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {row.label}
                </span>
              </div>

              <span
                className={`tabular-nums text-sm font-medium ${
                  positive ? "text-[var(--primary)]" : "text-[var(--tertiary)]"
                }`}
              >
                {positive ? "+" : ""}
                {row.value.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </DashboardModule>
  );
}
