# Independent Studio Platform

A minimal foundation for an international digital growth and technology agency. The temporary identity is centralized in `src/config/site.ts`; this phase intentionally stops before implementing agency workflows or full marketing pages.

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

## Architecture

See [docs/architecture.md](docs/architecture.md) for ownership boundaries and [docs/design-system.md](docs/design-system.md) for tokens and UI conventions.

## Environment variables

`NEXT_PUBLIC_SITE_URL` is the public canonical origin used by metadata, canonical links, sitemap, and robots output. It is public configuration, not a secret. Validate any future private integrations in server-only modules; never prefix secret values with `NEXT_PUBLIC_`.
