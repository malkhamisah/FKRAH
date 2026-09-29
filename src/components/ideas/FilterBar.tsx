"use client";

import { useRef } from "react";
import Link from "next/link";
import { Input, Select, Button } from "@/components/ui";

export type Option = { value: string; label: string };

export function FilterBar({
  current,
  categories,
  statuses,
  sorts,
  labels,
}: {
  current: { q: string; category: string; status: string; sort: string };
  categories: Option[];
  statuses: Option[];
  sorts: Option[];
  labels: {
    searchPlaceholder: string;
    allCategories: string;
    allStatuses: string;
    sort: string;
    apply: string;
    clear: string;
  };
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = () => formRef.current?.requestSubmit();

  return (
    <form
      ref={formRef}
      method="get"
      action="/ideas"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Reset to page 1 whenever filters change. */}
      <input type="hidden" name="page" value="1" />

      <div className="sm:col-span-2 lg:col-span-1">
        <Input
          name="q"
          defaultValue={current.q}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchPlaceholder}
        />
      </div>

      <Select
        name="category"
        defaultValue={current.category}
        onChange={submit}
        aria-label={labels.allCategories}
      >
        <option value="">{labels.allCategories}</option>
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>

      <Select
        name="status"
        defaultValue={current.status}
        onChange={submit}
        aria-label={labels.allStatuses}
      >
        <option value="">{labels.allStatuses}</option>
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-2">
        <Select
          name="sort"
          defaultValue={current.sort}
          onChange={submit}
          aria-label={labels.sort}
          className="flex-1"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          {labels.apply}
        </Button>
        <Link href="/ideas">
          <Button type="button" variant="ghost">
            {labels.clear}
          </Button>
        </Link>
      </div>
    </form>
  );
}
