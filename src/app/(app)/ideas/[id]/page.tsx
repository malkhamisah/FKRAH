import Link from "next/link";
import { notFound } from "next/navigation";
import type { DictKey } from "@/lib/i18n";
import { requireUser } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { STATUS_TONE } from "@/lib/ideas/status";
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Alert,
} from "@/components/ui";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { DeleteIdeaButton } from "@/components/ideas/DeleteIdeaButton";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;
  const { locale, t } = await getTranslations();

  const idea = await prisma.idea.findUnique({
    where: { id },
    include: { author: true, category: true, tags: true },
  });

  if (!idea) notFound();

  const isOwner = idea.authorId === session.userId;
  const isDraft = idea.status === "DRAFT";
  // A draft is visible only to its author.
  if (isDraft && !isOwner) notFound();

  const related = idea.categoryId
    ? await prisma.idea.findMany({
        where: {
          categoryId: idea.categoryId,
          id: { not: idea.id },
          status: { not: "DRAFT" },
        },
        include: { author: true, category: true, tags: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      })
    : [];

  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const categoryLabel = idea.category
    ? locale === "ar"
      ? idea.category.nameAr
      : idea.category.nameEn
    : null;

  // Optional structured fields, shown only when filled.
  const detailFields: { label: string; value: string }[] = [
    { label: t("ideas.field.businessProblem"), value: idea.businessProblem ?? "" },
    { label: t("ideas.field.proposedSolution"), value: idea.proposedSolution ?? "" },
    { label: t("ideas.field.expectedBenefits"), value: idea.expectedBenefits ?? "" },
    { label: t("ideas.field.supportingInfo"), value: idea.supportingInfo ?? "" },
  ].filter((f) => f.value.trim().length > 0);

  return (
    <div className="space-y-6">
      <Link
        href="/ideas"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700"
      >
        <span aria-hidden>{locale === "ar" ? "→" : "←"}</span>
        {t("ideas.detail.back")}
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={STATUS_TONE[idea.status]}>
            {t(`status.${idea.status}` as DictKey)}
          </Badge>
          {categoryLabel && <Badge tone="brand">{categoryLabel}</Badge>}
        </div>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">{idea.title}</h1>
        <p className="mt-1 text-sm text-ink-500">
          {t("ideas.by")}{" "}
          <span className="font-medium text-ink-700">{idea.author.name}</span>
          {" · "}
          {dateFmt.format(idea.submittedAt ?? idea.createdAt)}
        </p>

        {isOwner && isDraft && (
          <div className="mt-4 flex items-center gap-2">
            <Link href={`/ideas/${idea.id}/edit`}>
              <Button size="sm" variant="outline">
                {t("ideas.action.edit")}
              </Button>
            </Link>
            <DeleteIdeaButton
              ideaId={idea.id}
              label={t("ideas.action.delete")}
              confirmText={t("ideas.action.deleteConfirm")}
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title={t("ideas.detail.description")} />
            <CardBody>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
                {idea.description}
              </p>
            </CardBody>
          </Card>

          {detailFields.length > 0 && (
            <Card>
              <CardHeader title={t("ideas.detail.details")} />
              <CardBody className="space-y-4">
                {detailFields.map((f) => (
                  <div key={f.label}>
                    <h3 className="text-sm font-semibold text-ink-800">{f.label}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-600">
                      {f.value}
                    </p>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {/* Engagement (voting/comments) arrives in Phase 5 — clearly marked. */}
          <Alert tone="info">{t("ideas.detail.engagementNote")}</Alert>

          {related.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-ink-900">
                {t("ideas.detail.related")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <IdeaCard
                    key={r.id}
                    title={r.title}
                    description={r.description}
                    statusLabel={t(`status.${r.status}` as DictKey)}
                    statusTone={STATUS_TONE[r.status]}
                    categoryLabel={
                      r.category
                        ? locale === "ar"
                          ? r.category.nameAr
                          : r.category.nameEn
                        : null
                    }
                    tags={r.tags.map((tg) => tg.name)}
                    authorName={r.author.name}
                    byLabel={t("ideas.by")}
                    dateLabel={dateFmt.format(r.submittedAt ?? r.createdAt)}
                    href={`/ideas/${r.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader title={t("ideas.detail.author")} />
            <CardBody>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-base font-semibold text-brand-700">
                  {idea.author.name.trim().charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-900">{idea.author.name}</p>
                  {(idea.author.jobTitle || idea.author.department) && (
                    <p className="text-xs text-ink-500">
                      {[idea.author.jobTitle, idea.author.department]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t("ideas.field.estimatedImpact")} />
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-500">{t("ideas.field.estimatedImpact")}</span>
                <span className="font-medium text-ink-800">
                  {idea.estimatedImpact
                    ? t(`impact.${idea.estimatedImpact}` as DictKey)
                    : t("impact.none")}
                </span>
              </div>
              {idea.tags.length > 0 && (
                <div>
                  <p className="mb-1.5 text-ink-500">{t("ideas.field.tags")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.tags.map((tg) => (
                      <span
                        key={tg.id}
                        className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-600"
                      >
                        #{tg.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t("ideas.detail.activity")} />
            <CardBody className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-500">{t("ideas.detail.created")}</span>
                <span className="text-ink-700">{dateFmt.format(idea.createdAt)}</span>
              </div>
              {idea.submittedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">{t("ideas.detail.submitted")}</span>
                  <span className="text-ink-700">{dateFmt.format(idea.submittedAt)}</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
