"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/Logo";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  soonLabel?: string;
};

export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-ink-200 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-ink-200 px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          if (item.disabled) {
            return (
              <span
                key={item.href}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-ink-400"
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                {item.soonLabel && (
                  <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">
                    {item.soonLabel}
                  </span>
                )}
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-600 hover:bg-ink-100",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
