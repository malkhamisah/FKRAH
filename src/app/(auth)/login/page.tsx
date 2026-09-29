import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "@/lib/i18n";
import { getSession } from "@/lib/auth/session";
import { Card, CardBody } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  const { t } = await getTranslations();

  return (
    <Card>
      <CardBody className="p-8">
        <h1 className="text-xl font-bold text-ink-900">{t("auth.login.title")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("auth.login.subtitle")}</p>

        <div className="mt-6">
          <LoginForm
            labels={{
              email: t("field.email"),
              password: t("field.password"),
              submit: t("auth.login.submit"),
            }}
          />
        </div>

        <div className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="text-brand-600 hover:underline">
            {t("auth.login.forgot")}
          </Link>
        </div>

        <div className="mt-6 border-t border-ink-200 pt-4 text-center text-sm text-ink-500">
          {t("auth.login.noAccount")}{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:underline">
            {t("auth.login.registerLink")}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
