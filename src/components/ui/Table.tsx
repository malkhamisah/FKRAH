import { cn } from "@/lib/cn";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-ink-200">
      <table className="w-full text-start text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
      {children}
    </thead>
  );
}

export function TH({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-3 text-start font-medium", className)}>{children}</th>
  );
}

export function TD({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-t border-ink-100 px-4 py-3 text-ink-700", className)}>
      {children}
    </td>
  );
}
