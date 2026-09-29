"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";

const roleSchema = z.enum(["MEMBER", "EVALUATOR", "ADMIN"]);

export async function updateUserRoleAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const userId = String(formData.get("userId"));
  const parsed = roleSchema.safeParse(formData.get("role"));
  if (!parsed.success) return;

  // Guard: an admin cannot demote themselves (avoids locking out the last admin).
  if (userId === admin.userId) return;

  await prisma.user.update({ where: { id: userId }, data: { role: parsed.data } });
  revalidatePath("/admin/users");
}

export async function toggleUserStatusAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const userId = String(formData.get("userId"));
  if (userId === admin.userId) return; // cannot disable self

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await prisma.user.update({
    where: { id: userId },
    data: { status: user.status === "ACTIVE" ? "DISABLED" : "ACTIVE" },
  });
  revalidatePath("/admin/users");
}
