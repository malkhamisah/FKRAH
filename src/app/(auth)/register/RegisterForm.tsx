"use client";

import { useActionState } from "react";
import { registerAction, type FormState } from "@/lib/auth/actions";
import { Button, Input, Alert } from "@/components/ui";

export function RegisterForm({
  labels,
}: {
  labels: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    submit: string;
  };
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    registerAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <Input name="name" label={labels.name} autoComplete="name" required />
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
        autoComplete="new-password"
        required
      />
      <Input
        name="confirmPassword"
        type="password"
        label={labels.confirmPassword}
        autoComplete="new-password"
        required
      />
      <Button type="submit" fullWidth size="lg" disabled={pending}>
        {labels.submit}
      </Button>
    </form>
  );
}
