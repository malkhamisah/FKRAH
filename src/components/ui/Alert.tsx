import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  info: "bg-info-50 text-info-700 border-info-500/30",
  success: "bg-success-50 text-success-700 border-success-500/30",
  warning: "bg-warning-50 text-warning-700 border-warning-500/30",
  danger: "bg-danger-50 text-danger-700 border-danger-500/30",
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
