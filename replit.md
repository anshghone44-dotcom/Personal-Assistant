# Personal AI Assistant

Phase 1 foundation for a multilingual conversational calendar and reminder assistant. This phase provides Supabase email authentication, a protected app shell, and the PostgreSQL data model/RLS foundation for later AI, voice, calendar, reminder, and memory work.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required app secrets: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/assistant-foundation` — Phase 1 web app
- `artifacts/assistant-foundation/supabase/migrations` — reproducible Supabase schema and RLS
- `artifacts/assistant-foundation/src/types/domain.ts` — shared domain contracts
- `artifacts/assistant-foundation/src/lib` — Supabase access and future service boundaries

## Architecture decisions

- Supabase Auth owns identity; the browser only receives the public URL and anon key.
- A database trigger creates one profile per auth user, while the client updates timezone metadata after sign-in.
- RLS policies use `auth.uid()` for every user-owned table and validate cross-table ownership for related records.
- Future AI, voice, calendar, reminder, context, memory, and time responsibilities are separated behind interfaces before implementation.

## Product

- Phase 1: account creation, login/logout, session persistence, protected `/app`, and secure foundation schema.
- Later phases: conversational AI, voice, calendar, reminders, multilingual context, and memory.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
