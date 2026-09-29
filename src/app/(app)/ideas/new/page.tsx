import { requireUser } from "@/lib/auth/guards";
import { getIdeaFormProps } from "@/lib/ideas/form";
import { createIdeaAction } from "@/app/actions/ideas";
import { IdeaForm } from "@/components/ideas/IdeaForm";

const EMPTY = {
  title: "",
  description: "",
  categoryId: "",
  tags: "",
  businessProblem: "",
  proposedSolution: "",
  expectedBenefits: "",
  supportingInfo: "",
  estimatedImpact: "",
};

export default async function NewIdeaPage() {
  await requireUser();
  const { t, categories, impactOptions, labels } = await getIdeaFormProps();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{t("ideas.form.newTitle")}</h1>
        <p className="mt-1 text-sm text-ink-500">{t("ideas.form.subtitle")}</p>
      </div>

      <IdeaForm
        action={createIdeaAction}
        categories={categories}
        impactOptions={impactOptions}
        defaults={EMPTY}
        labels={labels}
        cancelHref="/ideas/mine"
      />
    </div>
  );
}
