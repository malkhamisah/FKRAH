import { requireUser } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n";
import { Card, CardBody, Alert, Badge } from "@/components/ui";
import { ROLE_LABELS } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const session = await requireUser();
  const { locale, t } = await getTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">
          {t("home.welcome")} {t("app.name")}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {t("home.signedInAs")}{" "}
          <span className="font-medium text-ink-700">{session.name}</span>{" "}
          <Badge tone="brand">{ROLE_LABELS[session.role][locale]}</Badge>
        </p>
      </div>

      <Card>
        <CardBody>
          <Alert tone="info">{t("home.placeholder")}</Alert>
        </CardBody>
      </Card>
    </div>
  );
}
