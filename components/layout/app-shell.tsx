import { ReactNode } from "react";
import { TopNavbar } from "./top-navbar";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)]">
      <TopNavbar />

      <div className="flex min-h-[calc(100vh-72px)]">
        <Sidebar />

        <main className="flex-1 overflow-x-hidden">
          <div className="px-6 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
