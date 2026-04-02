"use client";

import { useState } from "react";
import { TopNavbar } from "./top-navbar";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--surface)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "w-0 overflow-hidden" : "w-[260px]"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <TopNavbar
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}