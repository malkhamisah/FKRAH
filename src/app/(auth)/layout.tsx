import Link from "next/link";
import { getTranslations } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, t } = await getTranslations();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-ink-50 to-ink-100">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/">
          <Logo />
        </Link>
        <LanguageToggle locale={locale} label={t("lang.toggle")} />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="pb-6 text-center text-xs text-ink-400">
        {t("app.name")} — {t("app.tagline")}
      </footer>
    </div>
  );
}
