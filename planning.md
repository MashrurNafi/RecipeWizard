# AI Recipe Generator — Project Plan

**Timeline:** 1 day (~10-12 working hours)
**Goal:** 5-7 page functional website, AI-powered recipe generation, persisted storage.

---

## 1. Tech Stack (Locked)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | Not plain React — need server-side API routes for Groq calls and Prisma queries without exposing API keys or DB access to the client. Also gives file-based routing for the 6-7 pages and zero-config Vercel deploy. |
| Styling | Tailwind CSS | Fast to scaffold, no context-switching to separate CSS files. |
| AI | Groq API (via `groq-sdk` or raw fetch) | Use a fast model (e.g. Llama 3.x on Groq) for low-latency generation. |
| ORM | Prisma | Schema-first, generates type-safe client. |
| Database | **Postgres via Vercel Postgres or Neon** (free tier) | Prisma needs a real DB connection string — pick one now, don't leave it undecided. Neon is a solid free choice and pairs well with Vercel. |
| Deploy | Vercel | Connect GitHub repo, auto-deploy on push. |
| Auth | **None (v1)** | Use a browser-generated anonymous `userId` (UUID in a cookie/localStorage) to scope "saved recipes" per visitor without building real auth. Cut for time; not in original spec unless required. |

---

## 2. Site Map (6 pages)

1. **`/` — Home/Landing**
   Hero, value prop, CTA → `/generate`. Static, low effort.
2. **`/generate` — Generator**
   Form: ingredients (tags/comma input), dietary preference, cuisine, time constraint. Submits to `/api/generate`.
3. **`/recipe/[id]` — Recipe Result**
   Renders a generated recipe (title, servings, time, ingredients[], steps[]). "Save" button. Fetched from DB by id (recipe is saved immediately on generation — see §4).
4. **`/saved` — Saved Recipes**
   Grid of recipes tied to the anonymous `userId`. Query via Prisma. Delete option.
5. **`/browse` — Explore**
   Grid of all/public recipes (or a seeded set) for a non-empty first impression. Reuses the recipe card component from `/saved`.
6. **`/about` — How it works**
   Static content, minimal effort, pads page count credibly.

*(Optional 7th page if time allows: `/recipe/[id]/edit` for regenerating/tweaking, or a simple `/profile` showing generation history.)*

---

## 3. Database Schema (Prisma)

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Recipe {
  id          String   @id @default(cuid())
  title       String
  servings    Int
  timeMinutes Int
  ingredients Json     // array of { name, quantity, unit }
  steps       Json      // array of strings
  cuisine     String?
  dietary     String[] // e.g. ["vegan", "gluten-free"]
  createdAt   DateTime @default(now())
  userId      String   // anonymous UUID from cookie, scopes "saved"
  isPublic    Boolean  @default(true) // controls appearance on /browse
}
```

Keep `ingredients` and `steps` as JSON — avoids extra join tables under time pressure, still structured enough to render cleanly.

---

## 4. Core Data Flow

1. User submits form on `/generate`.
2. `POST /api/generate`:
   - Build a structured prompt for Groq, force **JSON output only** matching the schema below.
   - Call Groq, parse response (wrap in try/catch — LLMs occasionally emit malformed JSON, have a retry-once fallback).
   - Immediately `prisma.recipe.create()` with the result and the anonymous `userId` (so `/recipe/[id]` has something to fetch and it's persisted, not just client state).
   - Return the new recipe's `id`.
3. Client redirects to `/recipe/[id]`.
4. `/recipe/[id]` fetches from DB via Prisma (server component) and renders.
5. "Save" on that page just flips a flag or is implicit (already saved on creation) — decide: **simplify by auto-saving every generation**, and let "Saved Recipes" page just be "my generation history." Removes a whole feature (explicit save/unsave state) for free.

### Required Groq JSON schema (put this directly in the system prompt)
```json
{
  "title": "string",
  "servings": "number",
  "timeMinutes": "number",
  "cuisine": "string",
  "dietary": ["string"],
  "ingredients": [{ "name": "string", "quantity": "string" }],
  "steps": ["string"]
}
```
Instruct the model explicitly: "Respond with ONLY valid JSON, no markdown fences, no commentary."

---

## 5. Anonymous User Identity

- On first visit, generate a UUID client-side, store in a cookie (`recipe_uid`) with a long expiry.
- Pass it to API routes; use it as `userId` in Prisma queries.
- No login, no password, no session table. This satisfies "storage/backend required" without building auth.

---

## 6. Build Order (hour-by-hour)

| Time | Task |
|---|---|
| Hr 1 | `npx create-next-app` (App Router, Tailwind, TS optional but recommended). Init Prisma, connect Neon/Vercel Postgres, run first migration. Deploy empty shell to Vercel immediately. |
| Hr 2 | Build `/api/generate` route: Groq call with hardcoded test input → confirm JSON parses correctly. |
| Hr 3 | Wire Prisma: save generated recipe to DB, return id. Test end-to-end via Postman/curl before touching UI. |
| Hr 4 | Build `/generate` page UI (form) + connect to API + redirect on success. Add loading state. |
| Hr 5 | Build `/recipe/[id]` page — fetch and render recipe from DB. |
| Hr 6 | Build `/saved` page — list recipes by `userId` cookie, delete button (`DELETE /api/recipe/[id]`). |
| Hr 7 | Build `/browse` page — list `isPublic` recipes, reuse recipe card component. Seed 4-6 recipes directly via Prisma Studio or a seed script so it's not empty. |
| Hr 8 | Build `/` home and `/about` — static, fast. |
| Hr 9 | Polish pass: consistent spacing/typography, mobile responsiveness, empty states, error states (Groq failure, DB failure). |
| Hr 10 | Bug bash: every button, every page, mobile width, refresh mid-flow, slow network simulation. |
| Hr 11-12 | Final deploy, set env vars on Vercel (`DATABASE_URL`, `GROQ_API_KEY`), buffer time for last fixes, write a short README. |

---

## 7. Environment Variables

```
DATABASE_URL=       # from Neon or Vercel Postgres
GROQ_API_KEY=
```
Set these locally in `.env` AND in Vercel project settings before first deploy of the connected features — a common last-hour bug is forgetting to mirror env vars to Vercel.

---

## 8. Cut List (only add back if ahead of schedule)

- Real authentication
- Explicit save/unsave toggle (auto-save covers the requirement)
- Recipe editing/regeneration
- Nutrition facts (unless trivial to add to the JSON schema — if so, add it in Hr 2, not later)
- Image generation for recipes (skip — expensive in time and tokens; use a static placeholder or emoji per cuisine type instead)

---

## 9. Instructions for OpenCode

When implementing, follow this file's page list and schema exactly. Build and verify one API route before building the UI that depends on it. Commit after every working feature. Always add loading and error states to any component that calls `/api/generate` or Prisma — do not skip this even under time pressure.
