import { redirect } from "next/navigation";

// Phase 2: /ideas shows the author's own ideas. The full browse-all
// repository (search/filters) replaces this in Phase 3.
export default function IdeasIndex() {
  redirect("/ideas/mine");
}
