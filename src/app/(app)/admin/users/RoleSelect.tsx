"use client";

import { useRef } from "react";
import { updateUserRoleAction } from "@/app/actions/admin";
import { Select } from "@/components/ui";
import type { Role } from "@prisma/client";

export function RoleSelect({
  userId,
  role,
  disabled,
  options,
}: {
  userId: string;
  role: Role;
  disabled?: boolean;
  options: { value: Role; label: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form action={updateUserRoleAction} ref={formRef}>
      <input type="hidden" name="userId" value={userId} />
      <Select
        name="role"
        defaultValue={role}
        disabled={disabled}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-9 py-1"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </form>
  );
}
