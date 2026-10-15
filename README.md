# Independent Studio Platform

A full public-facing digital agency website built on the existing Next.js App Router foundation. The replaceable identity is centralized in `src/config/site.ts`; content for services, industries, concepts, articles, and FAQs is maintained as typed source data in `src/content/content.ts`.

## Requirements

- Node.js 20.9 or later (Node 24 LTS is recommended)
- npm 10 or later

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Change `NEXT_PUBLIC_SITE_URL` in `.env.local` to the canonical public origin before deployment. The example value is a placeholder, not a production domain. No credentials or third-party services are currently required.

## Contact delivery

The inquiry form validates in the browser and again on the server. To deliver inquiries by email, configure all three variables in `.env.local`:

```dotenv
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=inquiries@your-verified-domain.example
CONTACT_TO_EMAIL=you@your-domain.example
```

The sender domain must be verified with Resend. The API key is server-only and must never use a `NEXT_PUBLIC_` prefix. When the provider is not configured, or rejects a request, the form states that the inquiry was **not sent**; the application does not store submissions or report a false success.

Basic spam protection consists of a hidden honeypot and a five-request, 15-minute in-memory rate limit per request IP. The limiter is process-local and is not a distributed production rate limiter; for multi-instance or high-traffic deployment, replace it with a shared store and configure trusted proxy IP forwarding. Hosting providers may process request metadata under their own policies.

## Content and launch readiness

Content is maintained in typed TypeScript modules and rendered as server components. There is no database, admin panel, authentication system, or external CMS. Add a CMS only when editorial workflows require one. The portfolio entries are fictional demonstration concepts and make no client or performance claims. The articles are studio notes and do not imply named author credentials.

The privacy notice and terms are transparent launch templates, not legal advice. Replace the provisional brand identity, provide the actual legal entity, address, jurisdiction, contact and retention details, and obtain appropriate legal review before public launch. Configure a production URL and email delivery provider. No analytics, advertising pixels, consent cookies, CRM, booking, or social tracking is activated.

## Scripts

| Command                | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Start the local Next.js development server                       |
| `npm run build`        | Create a production build                                        |
| `npm run start`        | Serve the production build                                       |
| `npm run lint`         | Run ESLint with the Next.js Core Web Vitals and TypeScript rules |
| `npm run typecheck`    | Run strict TypeScript checking                                   |
| `npm run format`       | Format supported files with Prettier and Tailwind class sorting  |
| `npm run format:check` | Check formatting without changing files                          |
| `npm test`             | Run the Playwright end-to-end smoke tests                        |

Install a browser for Playwright when running the end-to-end test suite for the first time: `npx playwright install chromium`.

By default, Playwright reuses a local development server on port 3000. To run against the production build on a separate port (useful when another development server is already running), build first and run `PLAYWRIGHT_USE_PRODUCTION=1 PLAYWRIGHT_PORT=3001 npm test`.

## Routes and architecture

The site includes the home page, about, service overview and 12 service details, work index and three demonstration case studies, process, industries, insights index and three articles, contact, FAQs, privacy notice, terms, and a custom not-found and error state. Technical endpoints include `robots.txt`, an automatically generated sitemap, and `/feed.xml`.

See [docs/architecture.md](docs/architecture.md) for ownership boundaries and [docs/design-system.md](docs/design-system.md) for tokens and UI conventions.

## Environment variables

`NEXT_PUBLIC_SITE_URL` is the public canonical origin used by metadata, canonical links, sitemap, and robots output. `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` are optional, server-only contact delivery settings; configure them together. The Resend API key is secret. Never prefix secret values with `NEXT_PUBLIC_`.
