# فكرة — FKRAH

An enterprise **Digital Idea Management Platform** — from idea submission through
evaluation, prioritization, approval, implementation and impact measurement.

The platform is bilingual (Arabic-first, RTL, with an English/LTR toggle) and is
built **one feature at a time**. Each feature is specified, implemented, tested and
reviewed before the next begins.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling / design system | Tailwind CSS (design tokens in `tailwind.config.ts`) |
| Database | SQLite in development (no server needed); portable to PostgreSQL for production via Prisma |
| ORM | Prisma |
| Auth | Custom session: bcrypt password hashing + signed JWT in an httpOnly cookie (`jose`) |
| Validation | Zod |

> Switching to PostgreSQL later: change `provider` in `prisma/schema.prisma` to
> `postgresql` and set `DATABASE_URL`. No application code changes are required.

---

## Getting started

```bash
npm install                 # install dependencies (also generates the Prisma client)
cp .env.example .env        # create your local env file
npm run db:push             # create the SQLite database schema
npm run db:seed             # seed demo accounts (below)
npm run dev                 # start the dev server on http://localhost:3000
```

### Seeded accounts

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@fkrah.local` | `Admin@12345` |
| Evaluator | `evaluator@fkrah.local` | `Eval@12345` |
| Member | `member@fkrah.local` | `Member@12345` |

---

## Project structure

```
prisma/            Prisma schema + seed
src/
  app/
    (auth)/        Login, register, forgot-password (public)
    (app)/         Authenticated shell: dashboard, profile, admin/users
    actions/       Server actions (profile, admin, locale)
  components/
    ui/            Reusable design system (Button, Input, Card, Table, …)
    layout/        Sidebar, Topbar
  lib/
    auth/          Sessions, password hashing, guards, auth actions, roles
    i18n/          Locale config + Arabic/English dictionaries
    db.ts          Prisma client singleton
  middleware.ts    Route protection for the authenticated area
```

---

## Roadmap (build order)

Each feature is built and approved before the next starts.

| # | Feature | Status |
|---|---|---|
| 1 | **Foundation + Authentication & User Management** | ✅ Done |
| 2 | **Idea Submission** | ✅ Done |
| 3 | **Idea Repository (browse / search / filter)** | ✅ Done |
| 4 | **Idea Details** | ✅ Done |
| 5 | Voting & Engagement | Planned (completes MVP) |
| 6 | Dashboard | Planned |
| 7 | Challenges / Campaigns | Planned |
| 8 | Evaluation | Planned |
| 9 | Prioritization | Planned |
| 10 | Workflow Management | Planned |
| 11 | Analytics | Planned |
| 12 | Administration (categories, tags, settings) | Planned |

---

## Phase 1 — what works

- Arabic-first bilingual UI with full RTL/LTR support and a language toggle.
- Reusable design system (buttons, inputs, cards, tables, badges, alerts, empty states).
- Register, sign in, sign out, session management (httpOnly JWT cookie).
- Profile: edit name / job title / department / bio; change password.
- Roles: Member (default), Evaluator, Admin.
- Admin user management: view all users, change roles, activate/deactivate
  (with self-lockout protection).
- Route protection via middleware.

## Phase 2 — what works

- Submit an idea with structured fields: title, description, category (seeded,
  bilingual), tags, business problem, proposed solution, expected benefits,
  estimated impact, supporting information.
- Save as **Draft** (private to the author, editable) or **Submit** (enters the
  lifecycle; editing locked afterwards).
- **My Ideas** list showing the author's own ideas with status badges, category
  and tags; edit and delete available for drafts only.
- Ownership isolation: a user cannot open another user's idea (returns 404).
- Full idea lifecycle statuses defined in the schema (only Draft/Submitted
  reachable now; the rest arrive with later workflow/evaluation phases).

## Phase 3 — what works

- **Idea repository** at `/ideas`: browse all submitted ideas from everyone as
  cards, with author, category, tags, status and date.
- **Search** (title/description), **filters** (category, status) and **sort**
  (newest / oldest / recently updated / title) — all held in the URL so a
  filtered view is shareable and works without JavaScript.
- **Pagination** (9 per page).
- Tabs to switch between **All ideas** and **My ideas**.
- Drafts are excluded from the repository (they stay in My Ideas only).
- 10 sample submitted ideas are seeded for demonstration.

## Phase 4 — what works

- **Idea detail page** at `/ideas/[id]`: full description, structured detail
  fields (shown only when filled), status, category, tags, author card, an
  activity timeline (created / submitted), and related ideas from the same
  category.
- Repository and My Ideas cards/titles now link to the detail page.
- Access control: a **draft** detail is viewable only by its author; anyone
  else — and any unknown id — gets a 404. The author sees Edit/Delete on their
  own draft.

## Not connected yet (clearly mocked)

- **Password-reset email delivery.** The reset screen and token generation exist,
  but no email is actually sent — this needs an email provider, added in a later phase.
- **Idea attachments.** Deferred until the file-storage module is built; the
  submission form shows a note in place of an upload control (no fake button).
- **Voting & comments.** The detail page shows a labeled note where engagement
  will go; the actual voting/commenting is Phase 5.
- **Evaluation information** on the detail page is deferred to the evaluation
  module (Phase 8).
