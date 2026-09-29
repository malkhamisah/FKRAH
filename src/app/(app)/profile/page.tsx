import { requireUser } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardBody } from "@/components/ui";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export default async function ProfilePage() {
  const session = await requireUser();
  const { t } = await getTranslations();

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{t("profile.title")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("profile.subtitle")}</p>
      </div>

      <Card>
        <CardHeader title={t("profile.accountInfo")} />
        <CardBody>
          <ProfileForm
            defaults={{
              name: user.name,
              jobTitle: user.jobTitle ?? "",
              department: user.department ?? "",
              bio: user.bio ?? "",
            }}
            labels={{
              name: t("field.name"),
              jobTitle: t("field.jobTitle"),
              department: t("field.department"),
              bio: t("field.bio"),
              optional: t("field.optional"),
              save: t("profile.save"),
              saved: t("profile.saved"),
            }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t("profile.security")} description={t("profile.changePassword")} />
        <CardBody>
          <PasswordForm
            labels={{
              current: t("profile.currentPassword"),
              next: t("profile.newPassword"),
              submit: t("profile.changePassword"),
              changed: t("profile.passwordChanged"),
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
