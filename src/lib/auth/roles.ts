import type { Role } from "@prisma/client";

/**
 * Central place for role/permission logic so features don't re-implement
 * authorization checks inconsistently.
 */

export const ROLE_LABELS: Record<Role, { en: string; ar: string }> = {
  ADMIN: { en: "Administrator", ar: "مدير النظام" },
  EVALUATOR: { en: "Evaluator", ar: "مُقيّم" },
  MEMBER: { en: "Member", ar: "عضو" },
};

export function isAdmin(role: Role | undefined | null): boolean {
  return role === "ADMIN";
}

export function canManageUsers(role: Role | undefined | null): boolean {
  return role === "ADMIN";
}
