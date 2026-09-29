"use client";

import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions/locale";
import type { Locale } from "@/lib/i18n/config";

export function LanguageToggle({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const next: Locale = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setLocaleAction(next))}
      className={
        className ??
        "rounded-lg px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-100 disabled:opacity-50"
      }
    >
      {label}
    </button>
  );
}
