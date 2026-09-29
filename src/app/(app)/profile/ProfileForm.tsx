"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import type { FormState } from "@/lib/auth/actions";
import { Button, Input, Textarea, Alert } from "@/components/ui";

export function ProfileForm({
  defaults,
  labels,
}: {
  defaults: { name: string; jobTitle: string; department: string; bio: string };
  labels: {
    name: string;
    jobTitle: string;
    department: string;
    bio: string;
    optional: string;
    save: string;
    saved: string;
  };
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.ok && <Alert tone="success">{labels.saved}</Alert>}
      <Input name="name" label={labels.name} defaultValue={defaults.name} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="jobTitle"
          label={labels.jobTitle}
          hint={labels.optional}
          defaultValue={defaults.jobTitle}
        />
        <Input
          name="department"
          label={labels.department}
          hint={labels.optional}
          defaultValue={defaults.department}
        />
      </div>
      <Textarea
        name="bio"
        label={labels.bio}
        hint={labels.optional}
        defaultValue={defaults.bio}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {labels.save}
        </Button>
      </div>
    </form>
  );
}
