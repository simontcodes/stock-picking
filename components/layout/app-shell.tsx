"use client";

import { useState } from "react";
import { TopNavbar } from "./top-navbar";
import { Sidebar } from "./sidebar";
import type { AuthUser } from "@/lib/auth/session";

export type DashboardLayoutMode = "default" | "wide";

type AppShellProps = {
  children: React.ReactNode;
  user: AuthUser;
  layout?: DashboardLayoutMode;
  onLayoutChange?: (layout: DashboardLayoutMode) => void;
};

export function AppShell({
  children,
  user,
  layout = "default",
  onLayoutChange,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen bg-[var(--surface)] text-[var(--text-primary)]">
      <div
        className={`transition-all duration-300 ${
          collapsed ? "w-0 overflow-hidden" : "w-[260px]"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar
          user={user}
          layout={layout}
          onLayoutChange={onLayoutChange}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
