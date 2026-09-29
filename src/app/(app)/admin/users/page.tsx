import { requireAdmin } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { toggleUserStatusAction } from "@/app/actions/admin";
import { ROLE_LABELS } from "@/lib/auth/roles";
import {
  Card,
  Table,
  THead,
  TH,
  TD,
  Badge,
  Button,
  EmptyState,
} from "@/components/ui";
import { RoleSelect } from "./RoleSelect";
import type { Role } from "@prisma/client";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const { locale, t } = await getTranslations();

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  const roleOptions = (["MEMBER", "EVALUATOR", "ADMIN"] as Role[]).map((r) => ({
    value: r,
    label: ROLE_LABELS[r][locale],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{t("users.title")}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("users.subtitle")}</p>
        </div>
        <Badge tone="neutral">
          {users.length} {t("users.count")}
        </Badge>
      </div>

      {users.length === 0 ? (
        <EmptyState title={t("users.empty")} />
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>{t("field.name")}</TH>
              <TH>{t("field.email")}</TH>
              <TH>{t("field.role")}</TH>
              <TH>{t("field.status")}</TH>
              <TH />
            </tr>
          </THead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === admin.userId;
              return (
                <tr key={u.id}>
                  <TD>
                    <span className="font-medium text-ink-900">{u.name}</span>
                    {isSelf && (
                      <Badge tone="info" className="ms-2">
                        {t("users.you")}
                      </Badge>
                    )}
                  </TD>
                  <TD className="text-ink-500">{u.email}</TD>
                  <TD>
                    <RoleSelect
                      userId={u.id}
                      role={u.role}
                      disabled={isSelf}
                      options={roleOptions}
                    />
                  </TD>
                  <TD>
                    {u.status === "ACTIVE" ? (
                      <Badge tone="success">{t("status.active")}</Badge>
                    ) : (
                      <Badge tone="danger">{t("status.disabled")}</Badge>
                    )}
                  </TD>
                  <TD>
                    {!isSelf && (
                      <form action={toggleUserStatusAction}>
                        <input type="hidden" name="userId" value={u.id} />
                        <Button
                          type="submit"
                          size="sm"
                          variant={u.status === "ACTIVE" ? "outline" : "secondary"}
                        >
                          {u.status === "ACTIVE"
                            ? t("users.deactivate")
                            : t("users.activate")}
                        </Button>
                      </form>
                    )}
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
