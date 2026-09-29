import { prisma } from "@/lib/db";
import { getTranslations } from "@/lib/i18n";
import type { IdeaFormLabels } from "@/components/ideas/IdeaForm";

/**
 * Loads categories and builds the localized labels/options the IdeaForm needs.
 * Shared by the "new idea" and "edit draft" pages so they stay in sync.
 */
export async function getIdeaFormProps() {
  const { locale, t } = await getTranslations();

  const categoryRows = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const categories = categoryRows.map((c) => ({
    id: c.id,
    label: locale === "ar" ? c.nameAr : c.nameEn,
  }));

  const impactOptions = (["LOW", "MEDIUM", "HIGH"] as const).map((v) => ({
    value: v,
    label: t(`impact.${v}`),
  }));

  const labels: IdeaFormLabels = {
    sectionBasics: t("ideas.section.basics"),
    sectionDetails: t("ideas.section.details"),
    sectionClassification: t("ideas.section.classification"),
    title: t("ideas.field.title"),
    description: t("ideas.field.description"),
    category: t("ideas.field.category"),
    categoryPlaceholder: t("ideas.field.category.placeholder"),
    tags: t("ideas.field.tags"),
    tagsHint: t("ideas.field.tags.hint"),
    businessProblem: t("ideas.field.businessProblem"),
    proposedSolution: t("ideas.field.proposedSolution"),
    expectedBenefits: t("ideas.field.expectedBenefits"),
    estimatedImpact: t("ideas.field.estimatedImpact"),
    impactNone: t("impact.none"),
    supportingInfo: t("ideas.field.supportingInfo"),
    optional: t("field.optional"),
    saveDraft: t("ideas.action.saveDraft"),
    submit: t("ideas.action.submit"),
    cancel: t("common.cancel"),
    attachmentsNote: t("ideas.attachments.note"),
  };

  return { locale, t, categories, impactOptions, labels };
}
