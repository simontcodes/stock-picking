import { Bell, Settings, User, Search } from "lucide-react";
import Image from "next/image";

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-white/5 bg-[rgba(16,20,25,0.88)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* LOGO */}
          <div className="group relative flex h-12 items-center">
            <Image
              src="/logo.svg"
              alt="Tiqer"
              width={180}
              height={48}
              priority
              className="
      h-10 w-auto
      transition-all duration-300 ease-out
      brightness-110 contrast-125
      drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]
      group-hover:brightness-125
      group-hover:drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]
    "
            />

            {/* subtle glow layer */}
            <div
              className="
    pointer-events-none absolute inset-0
    opacity-0 blur-xl
    transition duration-300
    group-hover:opacity-100
    bg-[radial-gradient(circle_at_left,rgba(34,211,238,0.25),transparent_60%)]
  "
            />
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a className="text-sm font-medium text-[var(--primary)]" href="#">
              Dashboard
            </a>
            <a className="text-sm text-[var(--text-secondary)]" href="#">
              Watchlist
            </a>
            <a className="text-sm text-[var(--text-secondary)]" href="#">
              Analysis
            </a>
            <a className="text-sm text-[var(--text-secondary)]" href="#">
              Portfolio
            </a>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <div className="hidden w-[420px] items-center rounded-full bg-[rgba(255,255,255,0.04)] px-4 py-3 md:flex">
            <Search className="mr-3 size-4 text-[var(--text-muted)]" />
            <input
              placeholder="Enter ticker (e.g. AAPL)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>

          <button className="text-[var(--text-secondary)] hover:text-white">
            <Bell className="size-5" />
          </button>
          <button className="text-[var(--text-secondary)] hover:text-white">
            <Settings className="size-5" />
          </button>
          <button className="flex size-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)] text-[var(--text-primary)]">
            <User className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
