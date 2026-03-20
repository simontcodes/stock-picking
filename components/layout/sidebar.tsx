import { Activity, BarChart3, Bolt, Clock3, CircleHelp } from "lucide-react";

const items = [
  { label: "Markets", icon: BarChart3, active: true },
  { label: "Signals", icon: Activity },
  { label: "Strategy", icon: Bolt },
  { label: "History", icon: Clock3 },
  { label: "Support", icon: CircleHelp },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[240px] shrink-0 border-r border-white/5 bg-[rgba(255,255,255,0.02)] lg:flex lg:flex-col">
      <div className="p-6">
        <div className="rounded-[1.25rem] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="mb-2 text-3xl font-bold tracking-[-0.04em]">
            Tiqer Pro
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Institutional Grade
          </div>
        </div>
      </div>

      <nav className="px-4">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-[1rem] px-4 py-3 text-left text-sm transition ${
                  item.active
                    ? "bg-[rgba(10,188,86,0.08)] text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(10,188,86,0.12),rgba(10,188,86,0.04))] p-4">
          <div className="label-sm text-[var(--primary)]">Premium Access</div>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Unlock Alpha Signals
          </p>
          <button className="mt-4 w-full rounded-[0.9rem] bg-[var(--primary)] px-4 py-3 text-sm font-medium text-black">
            Upgrade to Alpha
          </button>
        </div>
      </div>
    </aside>
  );
}
