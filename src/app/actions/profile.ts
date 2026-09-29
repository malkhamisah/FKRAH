"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/guards";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { FormState } from "@/lib/auth/actions";

const profileSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جدًا / Name is too short"),
  jobTitle: z.string().trim().max(120).optional().or(z.literal("")),
  department: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    jobTitle: formData.get("jobTitle"),
    department: formData.get("department"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const { name, jobTitle, department, bio } = parsed.data;

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name,
      jobTitle: jobTitle || null,
      department: department || null,
      bio: bio || null,
    },
  });

  // Refresh the session so the display name updates immediately.
  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  revalidatePath("/profile");
  return { ok: true, message: "profile.saved" };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل / Password must be at least 8 characters"),
  });

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireUser();

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return { error: "User not found" };

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "كلمة المرور الحالية غير صحيحة / Current password is incorrect" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  return { ok: true, message: "profile.passwordChanged" };
}
