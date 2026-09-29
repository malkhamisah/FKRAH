import { logoutAction } from "@/lib/auth/actions";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Badge } from "@/components/ui";
import { ROLE_LABELS } from "@/lib/auth/roles";
import type { Locale } from "@/lib/i18n/config";
import type { SessionPayload } from "@/lib/auth/session";

export function Topbar({
  session,
  locale,
  langLabel,
  logoutLabel,
}: {
  session: SessionPayload;
  locale: Locale;
  langLabel: string;
  logoutLabel: string;
}) {
  const roleLabel = ROLE_LABELS[session.role][locale];
  const initials = session.name.trim().charAt(0).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-6">
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-lg font-bold text-ink-900">فكرة</span>
      </div>

      <div className="ms-auto flex items-center gap-3">
        <LanguageToggle locale={locale} label={langLabel} />

        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials}
          </span>
          <div className="hidden text-start sm:block">
            <p className="text-sm font-medium leading-tight text-ink-900">
              {session.name}
            </p>
            <Badge tone="brand">{roleLabel}</Badge>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-100"
          >
            {logoutLabel}
          </button>
        </form>
      </div>
    </header>
  );
}
