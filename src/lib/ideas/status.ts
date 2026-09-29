import type { IdeaStatus } from "@prisma/client";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

/** Badge tone for each lifecycle status. */
export const STATUS_TONE: Record<IdeaStatus, Tone> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  UNDER_REVIEW: "info",
  EVALUATION: "brand",
  SHORTLISTED: "brand",
  APPROVED: "success",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  REJECTED: "danger",
  ARCHIVED: "neutral",
};
