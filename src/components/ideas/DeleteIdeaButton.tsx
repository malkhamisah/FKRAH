"use client";

import { deleteIdeaAction } from "@/app/actions/ideas";
import { Button } from "@/components/ui";

export function DeleteIdeaButton({
  ideaId,
  label,
  confirmText,
}: {
  ideaId: string;
  label: string;
  confirmText: string;
}) {
  return (
    <form
      action={deleteIdeaAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="ideaId" value={ideaId} />
      <Button type="submit" size="sm" variant="ghost" className="text-danger-600 hover:bg-danger-50">
        {label}
      </Button>
    </form>
  );
}
