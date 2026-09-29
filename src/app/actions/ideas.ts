"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/guards";
import type { FormState } from "@/lib/auth/actions";

const MAX_TAGS = 10;

/** Parse a comma-separated tag string into a clean, de-duplicated list. */
function parseTags(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  const seen = new Set<string>();
  for (const part of raw.split(",")) {
    const name = part.trim();
    if (name) seen.add(name);
  }
  return [...seen].slice(0, MAX_TAGS);
}

const ideaSchema = z.object({
  title: z.string().trim().min(3, "العنوان قصير جدًا / Title is too short").max(160),
  description: z
    .string()
    .trim()
    .min(10, "الوصف قصير جدًا / Description is too short")
    .max(5000),
  categoryId: z.string().min(1, "الفئة مطلوبة / Category is required"),
  businessProblem: z.string().trim().max(3000).optional().or(z.literal("")),
  proposedSolution: z.string().trim().max(3000).optional().or(z.literal("")),
  expectedBenefits: z.string().trim().max(3000).optional().or(z.literal("")),
  supportingInfo: z.string().trim().max(3000).optional().or(z.literal("")),
  estimatedImpact: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().or(z.literal("")),
});

function readIdeaFields(formData: FormData) {
  return ideaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    businessProblem: formData.get("businessProblem"),
    proposedSolution: formData.get("proposedSolution"),
    expectedBenefits: formData.get("expectedBenefits"),
    supportingInfo: formData.get("supportingInfo"),
    estimatedImpact: formData.get("estimatedImpact"),
  });
}

function toData(d: z.infer<typeof ideaSchema>) {
  return {
    title: d.title,
    description: d.description,
    categoryId: d.categoryId,
    businessProblem: d.businessProblem || null,
    proposedSolution: d.proposedSolution || null,
    expectedBenefits: d.expectedBenefits || null,
    supportingInfo: d.supportingInfo || null,
    estimatedImpact: d.estimatedImpact ? d.estimatedImpact : null,
  };
}

function tagConnect(names: string[]) {
  return names.map((name) => ({
    where: { name },
    create: { name },
  }));
}

export async function createIdeaAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireUser();

  const parsed = readIdeaFields(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  // Validate the category actually exists.
  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category) {
    return { error: "الفئة غير صالحة / Invalid category" };
  }

  const submit = formData.get("intent") === "submit";
  const tags = parseTags(formData.get("tags"));

  await prisma.idea.create({
    data: {
      ...toData(parsed.data),
      authorId: session.userId,
      status: submit ? "SUBMITTED" : "DRAFT",
      submittedAt: submit ? new Date() : null,
      tags: { connectOrCreate: tagConnect(tags) },
    },
  });

  revalidatePath("/ideas/mine");
  redirect("/ideas/mine");
}

export async function updateIdeaAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireUser();
  const ideaId = String(formData.get("ideaId"));

  const existing = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!existing || existing.authorId !== session.userId) {
    return { error: "الفكرة غير موجودة / Idea not found" };
  }
  // Only drafts can be edited in Phase 2.
  if (existing.status !== "DRAFT") {
    return { error: "لا يمكن تعديل فكرة بعد إرسالها / A submitted idea can't be edited" };
  }

  const parsed = readIdeaFields(formData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category) {
    return { error: "الفئة غير صالحة / Invalid category" };
  }

  const submit = formData.get("intent") === "submit";
  const tags = parseTags(formData.get("tags"));

  await prisma.idea.update({
    where: { id: ideaId },
    data: {
      ...toData(parsed.data),
      status: submit ? "SUBMITTED" : "DRAFT",
      submittedAt: submit ? new Date() : null,
      // Replace the tag set entirely.
      tags: { set: [], connectOrCreate: tagConnect(tags) },
    },
  });

  revalidatePath("/ideas/mine");
  redirect("/ideas/mine");
}

export async function deleteIdeaAction(formData: FormData): Promise<void> {
  const session = await requireUser();
  const ideaId = String(formData.get("ideaId"));

  const existing = await prisma.idea.findUnique({ where: { id: ideaId } });
  // Author may delete only their own draft.
  if (!existing || existing.authorId !== session.userId || existing.status !== "DRAFT") {
    return;
  }

  await prisma.idea.delete({ where: { id: ideaId } });
  revalidatePath("/ideas/mine");
}
