import { Card, CardBody, Badge } from "@/components/ui";
import { IconIdea } from "@/components/icons";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

/**
 * Presentational idea card used in the repository list.
 * Not yet a link — the idea detail page arrives in Phase 4.
 */
export function IdeaCard({
  title,
  description,
  statusLabel,
  statusTone,
  categoryLabel,
  tags,
  authorName,
  byLabel,
  dateLabel,
}: {
  title: string;
  description: string;
  statusLabel: string;
  statusTone: Tone;
  categoryLabel: string | null;
  tags: string[];
  authorName: string;
  byLabel: string;
  dateLabel: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardBody className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <span className="mt-0.5 text-brand-600">
            <IconIdea />
          </span>
          <Badge tone={statusTone}>{statusLabel}</Badge>
        </div>

        <h2 className="mt-2 line-clamp-2 text-base font-semibold text-ink-900">
          {title}
        </h2>
        <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-ink-500">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {categoryLabel && <Badge tone="brand">{categoryLabel}</Badge>}
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-500">
          <span>
            {byLabel} <span className="font-medium text-ink-700">{authorName}</span>
          </span>
          <span>{dateLabel}</span>
        </div>
      </CardBody>
    </Card>
  );
}
