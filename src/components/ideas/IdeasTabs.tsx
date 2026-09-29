import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui";

/** Shared tab bar for the ideas area: All ideas / My ideas + New idea. */
export function IdeasTabs({
  active,
  labels,
}: {
  active: "all" | "mine";
  labels: { all: string; mine: string; newIdea: string };
}) {
  const tab = (href: string, label: string, isActive: boolean) => (
    <Link
      href={href}
      className={cn(
        "border-b-2 px-1 pb-2 text-sm font-medium transition-colors",
        isActive
          ? "border-brand-600 text-brand-700"
          : "border-transparent text-ink-500 hover:text-ink-800",
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex items-center justify-between border-b border-ink-200">
      <div className="flex gap-6">
        {tab("/ideas", labels.all, active === "all")}
        {tab("/ideas/mine", labels.mine, active === "mine")}
      </div>
      <Link href="/ideas/new" className="pb-1.5">
        <Button size="sm">+ {labels.newIdea}</Button>
      </Link>
    </div>
  );
}
