"use client";

import { Bell, LayoutPanelLeft, Search, Settings, User } from "lucide-react";
import Image from "next/image";
import type { DashboardLayoutMode } from "./app-shell";
import { LayoutSelector } from "./layout-selector";

type TopNavbarProps = {
  onToggleSidebar?: () => void;
  layout?: DashboardLayoutMode;
  onLayoutChange?: (layout: DashboardLayoutMode) => void;
};

export function TopNavbar({
  onToggleSidebar,
  layout = "default",
  onLayoutChange,
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-white/5 bg-[rgba(16,20,25,0.88)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-[var(--text-secondary)] transition hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
            aria-label="Toggle sidebar"
          >
            <LayoutPanelLeft className="size-5" />
          </button>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Tiqer"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>

            <nav className="hidden items-center gap-8 lg:flex">
              <a
                href="#"
                className="text-base font-medium text-[var(--primary)] transition"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-base text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Watchlist
              </a>
              <a
                href="#"
                className="text-base text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Analysis
              </a>
              <a
                href="#"
                className="text-base text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                Portfolio
              </a>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onLayoutChange && (
            <LayoutSelector value={layout} onChange={onLayoutChange} />
          )}

          <div className="hidden h-12 w-[360px] items-center rounded-full border border-white/6 bg-white/[0.03] px-4 lg:flex">
            <Search className="mr-3 size-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Enter ticker (e.g. AAPL)"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
            aria-label="Settings"
          >
            <Settings className="size-5" />
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[var(--text-secondary)] transition hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
            aria-label="Profile"
          >
            <User className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
