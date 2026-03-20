type DashboardHeaderProps = {
  lastUpdated?: string;
};

export function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
  return (
    <section className="mb-10 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="label-sm text-[var(--text-muted)]">
            Market Analysis
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em]">
            Stock Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
            Search a ticker to evaluate trend, risk, and conviction through a
            premium analysis dashboard.
          </p>
        </div>

        <div className="text-right">
          <div className="label-sm text-[var(--text-muted)]">Last Updated</div>
          <div className="mt-2 text-sm text-[var(--text-secondary)]">
            {lastUpdated ?? "—"}
          </div>
        </div>
      </div>
    </section>
  );
}
