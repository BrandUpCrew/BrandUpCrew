# Architecture

## Application shape

The project uses the Next.js App Router and React Server Components by default. Route handlers, layouts, metadata, sitemap, and robots conventions belong in `src/app`. Add a Client Component only when browser state, event handlers, or a client-only API requires it; keep the client boundary as small as possible.

```text
src/
  app/                 Routes, root layout, global styles, metadata endpoints
  components/
    ui/                Reusable, accessible UI primitives
    site/              Site shell, navigation, page content patterns, contact form
  config/              Brand and public site configuration
  content/             Typed static services, articles, case studies, and FAQs
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
- `content` owns the current static editorial data. It is not an admin CMS and contains only clearly labeled demonstration project work.
- `app/api/contact` validates all submissions server-side, bounds the request stream, applies a honeypot and process-local rate limit, and sends email through Resend only when all provider configuration is present. It never stores leads or returns success when delivery fails. The ingress must overwrite `X-Real-IP`; the in-memory limiter is not a distributed production control.
- `app/feed.xml` renders the public article feed from the same typed content used by the blog.
- `next.config.ts` adds basic clickjacking, MIME-sniffing, referrer, and browser-capability headers. HSTS and a nonce-based Content Security Policy must be configured at the production edge after verifying the deployment and font/asset policy.
- `types` is for shared contracts only; colocate feature-only types with their owner.
- `tests` verifies user-visible behavior without coupling to implementation details.

Avoid global state until a cross-route client-state requirement exists. Keep secrets in server-only modules and server environment variables; expose only intentional public values with the `NEXT_PUBLIC_` prefix.

## Rendering, metadata, and assets

Prefer server rendering for content and metadata. Use `next/image` for content images and `next/font` for local or Google-hosted font files; keep decorative assets in CSS. Root metadata defines the title template, description, Open Graph defaults, and canonical origin. Route metadata overrides route-specific values. `src/app/sitemap.ts` and `src/app/robots.ts` are the central sitemap and crawler-policy entry points; review their entries and indexing rules before launch. No organization identity, reviews, ratings, or local-business structured data is fabricated.

## Local workflow

Install dependencies with `npm install`, copy `.env.example` to `.env.local`, and start the dev server with `npm run dev`. Before a change is considered ready, run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Playwright's cross-browser suite requires the Chromium, Firefox, and WebKit engines (`npx playwright install --with-deps chromium firefox webkit`).

There is no database, authentication, admin panel, or CMS. These are intentionally omitted because the current static content and contact requirements do not justify them. Contact email uses optional server-side Resend integration; analytics, booking, consent, CRM, and conversion tracking remain inactive until provider, privacy, and account requirements are defined. Contact delivery with real credentials and a safe provider test account has not been verified in this environment.
