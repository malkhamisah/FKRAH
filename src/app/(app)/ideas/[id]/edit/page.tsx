import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { getIdeaFormProps } from "@/lib/ideas/form";
import { prisma } from "@/lib/db";
import { updateIdeaAction } from "@/app/actions/ideas";
import { IdeaForm } from "@/components/ideas/IdeaForm";

export default async function EditIdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireUser();
  const { id } = await params;

  const idea = await prisma.idea.findUnique({
    where: { id },
    include: { tags: true },
  });

  // Not found, or not the author's own idea → treat as not found (don't leak).
  if (!idea || idea.authorId !== session.userId) notFound();

  // Only drafts are editable in Phase 2; a submitted idea sends the author back.
  if (idea.status !== "DRAFT") redirect("/ideas/mine");

  const { t, categories, impactOptions, labels } = await getIdeaFormProps();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{t("ideas.form.editTitle")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("ideas.form.subtitle")}</p>
      </div>

      <IdeaForm
        action={updateIdeaAction}
        ideaId={idea.id}
        categories={categories}
        impactOptions={impactOptions}
        defaults={{
          title: idea.title,
          description: idea.description,
          categoryId: idea.categoryId ?? "",
          tags: idea.tags.map((tg) => tg.name).join(", "),
          businessProblem: idea.businessProblem ?? "",
          proposedSolution: idea.proposedSolution ?? "",
          expectedBenefits: idea.expectedBenefits ?? "",
          supportingInfo: idea.supportingInfo ?? "",
          estimatedImpact: idea.estimatedImpact ?? "",
        }}
        labels={labels}
        cancelHref="/ideas/mine"
      />
    </div>
  );
}
