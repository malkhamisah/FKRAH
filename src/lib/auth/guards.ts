import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "./session";

/** Require an authenticated user, or redirect to login. */
export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Require an admin user, or redirect. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireUser();
  if (session.role !== "ADMIN") redirect("/dashboard");
  return session;
}
