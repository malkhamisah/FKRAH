"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

export type FormState = { error?: string; ok?: boolean; message?: string };

const emailSchema = z.string().trim().toLowerCase().email();

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "الاسم قصير جدًا / Name is too short"),
    email: emailSchema,
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل / Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين / Passwords do not match",
    path: ["confirmPassword"],
  });

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "البريد الإلكتروني مسجّل بالفعل / Email is already registered" };
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password), role: "MEMBER" },
  });

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const invalid = { error: "بيانات الدخول غير صحيحة / Invalid email or password" };
  if (!parsed.success) return invalid;

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return invalid;
  if (user.status === "DISABLED") {
    return { error: "الحساب معطّل / This account is disabled" };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return invalid;

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function forgotPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  // Always return a neutral response to avoid leaking which emails exist.
  const neutral = { ok: true };
  if (!parsed.success) return neutral;

  const user = await prisma.user.findUnique({ where: { email: parsed.data } });
  if (user) {
    // Token is generated and stored. NOTE: email delivery is NOT connected
    // in Phase 1 — no message is actually sent to the user.
    await prisma.passwordResetToken.create({
      data: {
        token: randomUUID(),
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    });
  }

  return neutral;
}
