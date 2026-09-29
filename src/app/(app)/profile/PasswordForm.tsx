"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/profile";
import type { FormState } from "@/lib/auth/actions";
import { Button, Input, Alert } from "@/components/ui";

export function PasswordForm({
  labels,
}: {
  labels: {
    current: string;
    next: string;
    submit: string;
    changed: string;
  };
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    changePasswordAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.ok && <Alert tone="success">{labels.changed}</Alert>}
      <Input
        name="currentPassword"
        type="password"
        label={labels.current}
        autoComplete="current-password"
        required
      />
      <Input
        name="newPassword"
        type="password"
        label={labels.next}
        autoComplete="new-password"
        required
      />
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" disabled={pending}>
          {labels.submit}
        </Button>
      </div>
    </form>
  );
}
