# Architecture

## Application shape

The project uses the Next.js App Router and React Server Components by default. Route handlers, layouts, metadata, sitemap, and robots conventions belong in `src/app`. Add a Client Component only when browser state, event handlers, or a client-only API requires it; keep the client boundary as small as possible.

```text
src/
  app/                 Routes, root layout, global styles, metadata endpoints
  components/
    ui/                Reusable, accessible UI primitives
  config/              Brand and public site configuration
  features/            Feature-owned components, schemas, and services (as needed)
  hooks/               Shared client hooks (as needed)
  lib/                 Cross-cutting utilities and environment validation
  types/               Shared domain types (as needed)
tests/
  e2e/                 Playwright browser-level tests
docs/                  Architecture and design-system decisions
public/
  images/              Static, unoptimized assets only when appropriate
  icons/               Static icons and manifests
```

Create feature folders when a real feature is introduced; do not create empty layers or move route-specific code into shared modules prematurely.

## Ownership and dependency direction

- `app` composes route-level experiences and delegates; it should not become a home for reusable business logic.
- `components/ui` contains presentation primitives with accessible defaults, not agency-specific behavior.
- `features/<name>` owns feature-specific UI, validation, and server-side operations. Features may depend on shared `lib`, `types`, `config`, and `components/ui`, not on unrelated feature internals.
- `config` contains replaceable brand and site settings. `lib/env.ts` validates runtime configuration with Zod.
- `types` is for shared contracts only; colocate feature-only types with their owner.
- `tests` verifies user-visible behavior without coupling to implementation details.

Avoid global state until a cross-route client-state requirement exists. Keep secrets in server-only modules and server environment variables; expose only intentional public values with the `NEXT_PUBLIC_` prefix.

## Rendering, metadata, and assets

Prefer server rendering for content and metadata. Use `next/image` for content images and `next/font` for local or Google-hosted font files; keep decorative assets in CSS. Root metadata defines the title template, description, Open Graph defaults, and canonical origin. Route metadata should override only route-specific values. `src/app/sitemap.ts` and `src/app/robots.ts` are the central sitemap and crawler-policy entry points; review their entries and indexing rules before launch.

## Local workflow

Install dependencies with `npm install`, copy `.env.example` to `.env.local`, and start the dev server with `npm run dev`. Before a change is considered ready, run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Playwright requires a locally installed browser (`npx playwright install chromium`).

The project is currently in Phase 1. Do not add authentication, a database, payments, analytics, email, booking, CMS, or CRM integrations until their requirements are defined.
