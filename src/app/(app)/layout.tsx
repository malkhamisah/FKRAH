import { requireUser } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n";
import { Sidebar, type NavItem } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import {
  IconDashboard,
  IconIdea,
  IconChallenge,
  IconProfile,
  IconUsers,
} from "@/components/icons";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  const { locale, t } = await getTranslations();

  const items: NavItem[] = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: <IconDashboard /> },
    { href: "/ideas", label: t("nav.ideas"), icon: <IconIdea /> },
    // Challenges is a future phase — shown disabled for context.
    {
      href: "/challenges",
      label: t("nav.challenges"),
      icon: <IconChallenge />,
      disabled: true,
      soonLabel: t("nav.comingSoon"),
    },
    { href: "/profile", label: t("nav.profile"), icon: <IconProfile /> },
  ];

  if (session.role === "ADMIN") {
    items.push({ href: "/admin/users", label: t("nav.users"), icon: <IconUsers /> });
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar items={items} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          session={session}
          locale={locale}
          langLabel={t("lang.toggle")}
          logoutLabel={t("nav.logout")}
        />
        <main className="flex-1 p-6">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
