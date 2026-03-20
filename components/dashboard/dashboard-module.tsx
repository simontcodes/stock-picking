import { ReactNode } from "react";
import clsx from "clsx";

type DashboardModuleProps = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function DashboardModule({
  title,
  eyebrow,
  children,
  className,
}: DashboardModuleProps) {
  return (
    <section
      className={clsx(
        "rounded-[1.5rem] bg-[linear-gradient(180deg,#141a22,#10161d)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      {(eyebrow || title) && (
        <div className="mb-5">
          {eyebrow && (
            <div className="label-sm text-[var(--text-muted)]">{eyebrow}</div>
          )}
          {title && (
            <h2 className="mt-2 text-[1.1rem] font-semibold tracking-[-0.02em]">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
