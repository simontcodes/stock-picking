"use client";

import { LayoutGrid, Rows3 } from "lucide-react";
import type { DashboardLayoutMode } from "./app-shell";

type LayoutSelectorProps = {
  value: DashboardLayoutMode;
  onChange: (layout: DashboardLayoutMode) => void;
};

const options: Array<{
  value: DashboardLayoutMode;
  label: string;
  icon: typeof LayoutGrid;
}> = [
  {
    value: "default",
    label: "Split view",
    icon: LayoutGrid,
  },
  {
    value: "wide",
    label: "Wide charts",
    icon: Rows3,
  },
];

export function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  return (
    <div className="hidden items-center rounded-[1rem] border border-white/8 bg-white/[0.03] p-1 md:flex">
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-label={option.label}
            title={option.label}
            className={`flex h-10 w-10 items-center justify-center rounded-[0.8rem] transition ${
              active
                ? "bg-[rgba(34,197,94,0.10)] text-[rgb(134,239,172)] border border-[rgba(34,197,94,0.18)]"
                : "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon className="size-4.5" />
          </button>
        );
      })}
    </div>
  );
}
