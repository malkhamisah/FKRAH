import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "@/lib/i18n";
import { getSession } from "@/lib/auth/session";
import { Card, CardBody } from "@/components/ui";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  if (await getSession()) redirect("/dashboard");
  const { t } = await getTranslations();

  return (
    <Card>
      <CardBody className="p-8">
        <h1 className="text-xl font-bold text-ink-900">{t("auth.register.title")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("auth.register.subtitle")}</p>

        <div className="mt-6">
          <RegisterForm
            labels={{
              name: t("field.name"),
              email: t("field.email"),
              password: t("field.password"),
              confirmPassword: t("field.confirmPassword"),
              submit: t("auth.register.submit"),
            }}
          />
        </div>

        <div className="mt-6 border-t border-ink-200 pt-4 text-center text-sm text-ink-500">
          {t("auth.register.hasAccount")}{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            {t("auth.register.loginLink")}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
