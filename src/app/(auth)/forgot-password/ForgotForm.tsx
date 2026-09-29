"use client";

import { useActionState } from "react";
import { forgotPasswordAction, type FormState } from "@/lib/auth/actions";
import { Button, Input, Alert } from "@/components/ui";

export function ForgotForm({
  labels,
}: {
  labels: { email: string; submit: string; done: string };
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    forgotPasswordAction,
    {},
  );

  if (state.ok) {
    return <Alert tone="success">{labels.done}</Alert>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <Input
        name="email"
        type="email"
        label={labels.email}
        autoComplete="email"
        required
      />
      <Button type="submit" fullWidth size="lg" disabled={pending}>
        {labels.submit}
      </Button>
    </form>
  );
}
