import Link from "next/link";
import type { Prisma, IdeaStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth/guards";
import { getTranslations, type DictKey } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { STATUS_TONE } from "@/lib/ideas/status";
import { EmptyState, Button } from "@/components/ui";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { IdeasTabs } from "@/components/ideas/IdeasTabs";
import { FilterBar } from "@/components/ideas/FilterBar";

const PAGE_SIZE = 9;

// Statuses that may appear in the repository (everything except DRAFT).
const REPO_STATUSES: IdeaStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "EVALUATION",
  "SHORTLISTED",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
  "ARCHIVED",
];

type Sort = "newest" | "oldest" | "updated" | "title";
const SORTS: Sort[] = ["newest", "oldest", "updated", "title"];

function orderBy(sort: Sort): Prisma.IdeaOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "updated":
      return { updatedAt: "desc" };
    case "title":
      return { title: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

export default async function IdeaRepositoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const { locale, t } = await getTranslations();
  const sp = await searchParams;

  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const q = get("q").trim();
  const categoryParam = get("category");
  const statusParam = get("status");
  const sort = (SORTS.includes(get("sort") as Sort) ? get("sort") : "newest") as Sort;
  const page = Math.max(1, parseInt(get("page") || "1", 10) || 1);

  const categoryRows = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  const validCategory = categoryRows.some((c) => c.id === categoryParam)
    ? categoryParam
    : "";
  const validStatus = REPO_STATUSES.includes(statusParam as IdeaStatus)
    ? (statusParam as IdeaStatus)
    : "";

  // Build the query. Drafts are always excluded from the repository.
  const where: Prisma.IdeaWhereInput = {
    status: validStatus ? validStatus : { not: "DRAFT" },
  };
  if (validCategory) where.categoryId = validCategory;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const total = await prisma.idea.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const ideas = await prisma.idea.findMany({
    where,
    orderBy: orderBy(sort),
    include: { author: true, category: true, tags: true },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const categoryOptions = categoryRows.map((c) => ({
    value: c.id,
    label: locale === "ar" ? c.nameAr : c.nameEn,
  }));
  const statusOptions = REPO_STATUSES.map((s) => ({
    value: s,
    label: t(`status.${s}` as DictKey),
  }));
  const sortOptions = SORTS.map((s) => ({
    value: s,
    label: t(`ideas.sort.${s}` as DictKey),
  }));

  // Preserve current filters when building pagination links.
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (validCategory) params.set("category", validCategory);
    if (validStatus) params.set("status", validStatus);
    if (sort !== "newest") params.set("sort", sort);
    params.set("page", String(p));
    return `/ideas?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{t("ideas.repo.title")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("ideas.repo.subtitle")}</p>
      </div>

      <IdeasTabs
        active="all"
        labels={{
          all: t("ideas.tab.all"),
          mine: t("ideas.tab.mine"),
          newIdea: t("ideas.new"),
        }}
      />

      <FilterBar
        current={{ q, category: validCategory, status: validStatus, sort }}
        categories={categoryOptions}
        statuses={statusOptions}
        sorts={sortOptions}
        labels={{
          searchPlaceholder: t("ideas.search.placeholder"),
          allCategories: t("ideas.filter.category.all"),
          allStatuses: t("ideas.filter.status.all"),
          sort: t("ideas.sort.label"),
          apply: t("ideas.apply"),
          clear: t("ideas.clearFilters"),
        }}
      />

      <p className="text-sm text-ink-500">
        {total} {t("ideas.results")}
      </p>

      {ideas.length === 0 ? (
        <EmptyState
          title={t("ideas.noResults.title")}
          description={t("ideas.noResults.desc")}
          action={
            <Link href="/ideas">
              <Button variant="outline">{t("ideas.clearFilters")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              title={idea.title}
              description={idea.description}
              statusLabel={t(`status.${idea.status}` as DictKey)}
              statusTone={STATUS_TONE[idea.status]}
              categoryLabel={
                idea.category
                  ? locale === "ar"
                    ? idea.category.nameAr
                    : idea.category.nameEn
                  : null
              }
              tags={idea.tags.map((tg) => tg.name)}
              authorName={idea.author.name}
              byLabel={t("ideas.by")}
              dateLabel={dateFmt.format(idea.submittedAt ?? idea.createdAt)}
              href={`/ideas/${idea.id}`}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {safePage > 1 ? (
            <Link href={pageHref(safePage - 1)}>
              <Button variant="outline" size="sm">
                {t("ideas.page.prev")}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              {t("ideas.page.prev")}
            </Button>
          )}
          <span className="text-sm text-ink-500">
            {safePage} / {totalPages}
          </span>
          {safePage < totalPages ? (
            <Link href={pageHref(safePage + 1)}>
              <Button variant="outline" size="sm">
                {t("ideas.page.next")}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              {t("ideas.page.next")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
