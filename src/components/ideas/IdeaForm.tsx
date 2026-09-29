"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/lib/auth/actions";
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardBody,
  Alert,
} from "@/components/ui";

export type IdeaFormLabels = {
  sectionBasics: string;
  sectionDetails: string;
  sectionClassification: string;
  title: string;
  description: string;
  category: string;
  categoryPlaceholder: string;
  tags: string;
  tagsHint: string;
  businessProblem: string;
  proposedSolution: string;
  expectedBenefits: string;
  estimatedImpact: string;
  impactNone: string;
  supportingInfo: string;
  optional: string;
  saveDraft: string;
  submit: string;
  cancel: string;
  attachmentsNote: string;
};

export type IdeaFormDefaults = {
  title: string;
  description: string;
  categoryId: string;
  tags: string;
  businessProblem: string;
  proposedSolution: string;
  expectedBenefits: string;
  supportingInfo: string;
  estimatedImpact: string;
};

export function IdeaForm({
  action,
  ideaId,
  categories,
  impactOptions,
  defaults,
  labels,
  cancelHref,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  ideaId?: string;
  categories: { id: string; label: string }[];
  impactOptions: { value: string; label: string }[];
  defaults: IdeaFormDefaults;
  labels: IdeaFormLabels;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {ideaId && <input type="hidden" name="ideaId" value={ideaId} />}

      <Card>
        <CardHeader title={labels.sectionBasics} />
        <CardBody className="space-y-4">
          <Input
            name="title"
            label={labels.title}
            defaultValue={defaults.title}
            required
            maxLength={160}
          />
          <Textarea
            name="description"
            label={labels.description}
            defaultValue={defaults.description}
            required
            rows={5}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={labels.sectionClassification} />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select name="categoryId" label={labels.category} defaultValue={defaults.categoryId} required>
              <option value="">{labels.categoryPlaceholder}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
            <Select
              name="estimatedImpact"
              label={labels.estimatedImpact}
              defaultValue={defaults.estimatedImpact}
            >
              <option value="">{labels.impactNone}</option>
              {impactOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <Input
            name="tags"
            label={labels.tags}
            hint={labels.tagsHint}
            defaultValue={defaults.tags}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={labels.sectionDetails} />
        <CardBody className="space-y-4">
          <Textarea
            name="businessProblem"
            label={labels.businessProblem}
            hint={labels.optional}
            defaultValue={defaults.businessProblem}
          />
          <Textarea
            name="proposedSolution"
            label={labels.proposedSolution}
            hint={labels.optional}
            defaultValue={defaults.proposedSolution}
          />
          <Textarea
            name="expectedBenefits"
            label={labels.expectedBenefits}
            hint={labels.optional}
            defaultValue={defaults.expectedBenefits}
          />
          <Textarea
            name="supportingInfo"
            label={labels.supportingInfo}
            hint={labels.optional}
            defaultValue={defaults.supportingInfo}
          />
          <Alert tone="info">{labels.attachmentsNote}</Alert>
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link href={cancelHref}>
          <Button type="button" variant="ghost">
            {labels.cancel}
          </Button>
        </Link>
        <Button
          type="submit"
          name="intent"
          value="draft"
          variant="secondary"
          disabled={pending}
        >
          {labels.saveDraft}
        </Button>
        <Button type="submit" name="intent" value="submit" disabled={pending}>
          {labels.submit}
        </Button>
      </div>
    </form>
  );
}
