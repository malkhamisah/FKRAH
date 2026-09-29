import Link from "next/link";
import { getTranslations } from "@/lib/i18n";
import { Card, CardBody, Alert } from "@/components/ui";
import { ForgotForm } from "./ForgotForm";

export default async function ForgotPasswordPage() {
  const { t } = await getTranslations();

  return (
    <Card>
      <CardBody className="p-8">
        <h1 className="text-xl font-bold text-ink-900">{t("auth.forgot.title")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("auth.forgot.subtitle")}</p>

        <div className="mt-4">
          <Alert tone="warning">{t("auth.forgot.notConnected")}</Alert>
        </div>

        <div className="mt-6">
          <ForgotForm
            labels={{
              email: t("field.email"),
              submit: t("auth.forgot.submit"),
              done: t("auth.forgot.done"),
            }}
          />
        </div>

        <div className="mt-6 border-t border-ink-200 pt-4 text-center text-sm">
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            {t("auth.forgot.back")}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
