"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/auth/actions";
import { Button, Input, Alert } from "@/components/ui";

export function LoginForm({
  labels,
}: {
  labels: { email: string; password: string; submit: string };
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <Input
        name="email"
        type="email"
        label={labels.email}
        autoComplete="email"
        required
      />
      <Input
        name="password"
        type="password"
        label={labels.password}
        autoComplete="current-password"
        required
      />
      <Button type="submit" fullWidth size="lg" disabled={pending}>
        {labels.submit}
      </Button>
    </form>
  );
}
