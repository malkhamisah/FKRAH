import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { getTranslations } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { STATUS_TONE } from "@/lib/ideas/status";
import type { DictKey } from "@/lib/i18n";
import {
  Card,
  CardBody,
  Badge,
  Button,
  EmptyState,
} from "@/components/ui";
import { IconIdea } from "@/components/icons";
import { DeleteIdeaButton } from "@/components/ideas/DeleteIdeaButton";

export default async function MyIdeasPage() {
  const session = await requireUser();
  const { locale, t } = await getTranslations();

  const ideas = await prisma.idea.findMany({
    where: { authorId: session.userId },
    orderBy: { updatedAt: "desc" },
    include: { category: true, tags: true },
  });

  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{t("ideas.mine.title")}</h1>
          <p className="mt-1 text-sm text-ink-500">{t("ideas.mine.subtitle")}</p>
        </div>
        <Link href="/ideas/new">
          <Button>+ {t("ideas.new")}</Button>
        </Link>
      </div>

      {ideas.length === 0 ? (
        <EmptyState
          title={t("ideas.empty.title")}
          description={t("ideas.empty.desc")}
          action={
            <Link href="/ideas/new">
              <Button>+ {t("ideas.new")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => {
            const isDraft = idea.status === "DRAFT";
            const categoryLabel = idea.category
              ? locale === "ar"
                ? idea.category.nameAr
                : idea.category.nameEn
              : null;
            return (
              <Card key={idea.id} className="transition-shadow hover:shadow-card-hover">
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-brand-600">
                          <IconIdea />
                        </span>
                        <h2 className="truncate text-base font-semibold text-ink-900">
                          {idea.title}
                        </h2>
                        <Badge tone={STATUS_TONE[idea.status]}>
                          {t(`status.${idea.status}` as DictKey)}
                        </Badge>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">
                        {idea.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                        {categoryLabel && <Badge tone="brand">{categoryLabel}</Badge>}
                        {idea.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="rounded-full bg-ink-100 px-2 py-0.5 text-ink-600"
                          >
                            #{tag.name}
                          </span>
                        ))}
                        <span className="ms-auto">
                          {dateFmt.format(idea.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isDraft && (
                    <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-3">
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
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
