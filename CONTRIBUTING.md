<div align="center">

# Contributing to BrandUpCrew

**How to work in this codebase without breaking the standards it is built on.**

</div>

---

## Table of contents

- [Before you start](#before-you-start)
- [The non-negotiables](#the-non-negotiables)
- [Local setup](#local-setup)
- [Repository layout and ownership](#repository-layout-and-ownership)
- [How to make a change](#how-to-make-a-change)
- [Coding standards](#coding-standards)
- [Styling standards](#styling-standards)
- [Content standards](#content-standards)
- [Motion and 3D standards](#motion-and-3d-standards)
- [Accessibility standards](#accessibility-standards)
- [Forms, API, and security standards](#forms-api-and-security-standards)
- [Testing standards](#testing-standards)
- [Branch, commit, and pull request conventions](#branch-commit-and-pull-request-conventions)
- [Definition of done](#definition-of-done)
- [Common tasks](#common-tasks)
- [Things that will be rejected](#things-that-will-be-rejected)
- [Reporting a problem](#reporting-a-problem)

---

## Before you start

This repository is the public marketing website for **BrandUpCrew**, an independent digital studio. It is a production-facing product: visitors read it to decide whether to trust the studio with their business. That context drives every rule below.

Two documents are required reading before your first change:

| Document                                         | Why                                                        |
| ------------------------------------------------ | ---------------------------------------------------------- |
| [`docs/architecture.md`](docs/architecture.md)   | Application shape, ownership, and dependency direction.    |
| [`docs/design-system.md`](docs/design-system.md) | Design tokens, motion ownership, and the 3D hero contract. |

Also note [`AGENTS.md`](AGENTS.md): this project runs on a Next.js version whose APIs, conventions, and file structure can differ from older training data. Before writing route, layout, metadata, or configuration code, read the relevant guide in `node_modules/next/dist/docs/` and follow its current conventions instead of relying on memory.

---

## The non-negotiables

A change that breaks any of these is wrong, regardless of how good it looks.

1. **The site must work without WebGL and without heavy motion.** A CSS fallback, readable content, and usable navigation are required at all times.
2. **`prefers-reduced-motion` must be honoured.** Ambient animation, timelines, smooth scrolling, and the WebGL frameloop all have reduced-motion behaviour that must be preserved.
3. **Accessibility is a requirement.** Semantic HTML, accessible names, keyboard operability, adequate contrast, and WCAG 2.2 AA compliance on representative routes. Automated axe checks must stay green.
4. **Design tokens, not hard-coded values.** Components use semantic utilities (`bg-background`, `text-foreground`, `text-muted`, `border-border`, `bg-accent`) and CSS custom properties. Palette values do not get sprinkled into components.
5. **Honest content only.** No invented clients, results, ratings, reviews, certifications, or organization data. Demonstration concepts stay labelled as concepts.
6. **Server-side validation is mandatory.** Anything reaching the server is validated on the server, even when the client also validates it.
7. **No lead storage, no secrets in the client.** Inquiries are validated and forwarded, not persisted. Only intentional `NEXT_PUBLIC_` values may reach the browser.
8. **Server Components by default.** Client boundaries are created only when browser state, event handlers, or a client-only API requires them, and they stay as small as possible.

---

## Local setup

**Prerequisites**

- Node.js **20.9+** (required by Next.js 16)
- npm with the committed `package-lock.json`
- Playwright browsers for the full test matrix: `npx playwright install --with-deps chromium firefox webkit`

```bash
git clone <repository-url>
cd BrandUpCrew

npm install
cp .env.example .env.local

npm run dev          # http://localhost:3000
```

Contact delivery stays disabled until `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` are all present. This is intentional: the form must report honestly that an inquiry was not sent rather than pretend otherwise. `src/lib/env.ts` fails validation if only some of the three are set.

---

## Repository layout and ownership

```text
src/
  app/                  Routes, root layout, global styles, metadata endpoints
  components/ui/        Reusable, accessible presentation primitives
  components/site/      Shell, navigation, page patterns, forms, motion
  components/three/     WebGL hero scene
  config/               Brand and public site configuration
  content/              Typed editorial content (single source of truth)
  lib/                  Environment validation, theme, scroll bridge, utilities
tests/e2e/              Playwright specs
docs/                   Architecture and design-system decisions
public/                 Logo, favicon, and team portraits
```

Dependency direction matters:

- `app` composes route-level experiences and delegates. It is not a home for reusable business logic.
- `components/ui` holds presentation primitives with accessible defaults, not agency-specific behaviour.
- `components/site` holds shared site patterns. Route-specific composition stays in the route.
- `lib` holds cross-cutting utilities; `config` holds replaceable brand settings; `content` holds editorial data.
- Do not create empty layers, do not move route code into shared modules prematurely, and do not introduce global state without a real cross-route requirement.

---

## How to make a change

1. **Read before you write.** Open the files you intend to change and the documents that govern them. Never propose a change to code you have not read.
2. **Keep the change focused.** One concern per change. Do not fold unrelated refactors into a bug fix or a content edit.
3. **Prefer editing over creating.** Extend an existing module rather than adding a parallel one. New files need a reason.
4. **Respect the smallest viable solution.** No speculative abstractions, no feature flags, no backwards-compatibility shims, no error handling for states that cannot occur. Validate at boundaries (user input, external APIs), trust internal code.
5. **Delete cleanly.** If something becomes unused, remove it — including its styles, tests, and documentation. Do not leave `// removed` comments or re-export shims behind.
6. **Verify with the real commands.** Run the definition-of-done checks before you call the work finished.

---

## Coding standards

**TypeScript**

- `strict` mode is on and expected to stay on. Avoid `any`; if a third-party type forces it, keep it at the boundary.
- Prefer explicit, well-named types over inference for public shapes. Content types live with their content in `src/content/content.ts`.
- Discriminated unions and narrowing are preferred over optional-field guessing.

**React and Next.js**

- Server Components by default. Add `"use client"` only at the smallest component that needs it, and document the reason in a comment when it is not obvious.
- Dynamic route segments use `generateStaticParams` from typed content; pages validate the slug and call `notFound()` when it does not match. `params` is a promise and must be awaited.
- Every route that is publicly reachable gets explicit `metadata` with title, description, and canonical URL. Article-like routes also emit Open Graph data and JSON-LD.
- Absolute URLs are built from `siteConfig.url` (which comes from `NEXT_PUBLIC_SITE_URL`), never from a hard-coded domain.
- Long-lived third-party scripts and bundles are loaded after a capability check, not on first paint.

**Components and files**

- Files are `kebab-case`; components are `PascalCase` named exports (`export function SiteHeader()`), except route files, which use default exports.
- Props are typed inline for small components and with a named type when reused.
- Icons come from `lucide-react`; icon-only controls always carry an accessible name or label.
- Import groups follow the existing order: framework, third-party, then internal aliases (`@/…`), separated by a blank line. The `@/*` alias maps to `src/*`.

**Environment**

- Never read `process.env` directly in application code. Extend the Zod schema in `src/lib/env.ts` and consume the validated object.
- Server-only modules start with `import "server-only"`.

---

## Styling standards

- Tailwind CSS v4 runs through `@tailwindcss/postcss`; the token layer lives in `src/app/globals.css` and is mapped into Tailwind with `@theme inline`.
- Use semantic tokens and their utilities. Brand colour comes from `--color-brand` / `--accent`, surfaces from `--background` / `--surface` / `--card`, text from `--foreground` / `--muted`, lines from `--border`.
- Both themes must be checked. The system preference remaps the same roles, so a change that only looks correct in one theme is incomplete.
- Radii (`--radius-xs` … `--radius-xl`), elevation (`--shadow-*`, `--glow*`), and easing (`--ease-out-soft`, `--ease-out-expo`) come from tokens. Do not invent parallel values.
- Keep component styles in `globals.css` alongside the related block rather than adding ad-hoc inline styles, unless the value is genuinely one-off and dynamic.
- Focus states must remain visible: a two-pixel outline with offset using `--focus`.
- Layout must not overflow horizontally. The breakpoints to sanity-check are documented in `docs/design-system.md`, and the supported viewport widths are enforced by tests.

---

## Content standards

- All editorial content lives in `src/content/content.ts`. Adding there is what creates routes, sitemap entries, and contact-form options — keep it the single source of truth.
- Copy is written in the studio's voice: plain, specific, and free of hype. No guarantees of rankings, revenue, leads, or advertising returns.
- Never invent proof. Demonstration concepts keep their "not a client" labelling. Do not add client logos, testimonials, metrics, awards, or certifications that the studio cannot evidence.
- Placeholder text, lorem ipsum, and TODO copy do not ship.
- Content changes are behaviour changes: headings asserted by tests must be updated in the specs in the same change.

---

## Motion and 3D standards

Motion responsibilities are divided; keep them that way.

| Owner                    | Owns                                                                         |
| ------------------------ | ---------------------------------------------------------------------------- |
| **Lenis**                | Scrolling, driven by the GSAP ticker so there is one animation clock.        |
| **GSAP + ScrollTrigger** | Scroll- and pointer-linked timelines (masked headings, parallax, magnetics). |
| **Motion**               | Component transitions (reveals, staggered groups, counters, marquees).       |
| **React Three Fiber**    | The hero scene only.                                                         |
| **CSS**                  | Hover states, gradient/mask artwork, ambient keyframes.                      |

Rules:

- Do not duplicate motion logic across libraries. Reuse the existing primitives — `RevealSection`, `RevealItem`, `HeroBlock`, `StatCounter`, `Marquee`, `MaskedHeading`, `Parallax`, `Magnetic`, and the spatial section wrappers.
- Animation must never block clicks or scrolling.
- Any hover-only information needs a non-hover equivalent.
- Text revealed by animation must remain real, selectable text — a component that hides content until JavaScript runs is not acceptable.
- The 3D hero keeps its safeguards: dynamic import with `ssr: false`, WebGL capability check, small-screen exclusion, CSS fallback underneath, quality tiers, and an `IntersectionObserver` pause when off-screen. Never create geometry or materials per frame.
- Respect `prefers-reduced-motion` in every new motion path, and update the reduced-motion block in `globals.css` when you add an animation that needs neutralising.

---

## Accessibility standards

- Semantic landmarks and headings in order; one `<h1>` per page.
- Interactive elements are real `<button>`/`<a>` elements with accessible names. Focus is always visible and never trapped.
- The mobile navigation keeps its keyboard behaviour: `aria-expanded`, `aria-controls`, and Escape to close.
- Forms: every field has a label, errors are announced and associated with their field, and success or failure state is exposed to assistive technology.
- Images need meaningful `alt` text, or `alt=""` when decorative. A missing portrait renders the accessible "portrait pending" placeholder rather than a broken image.
- Automated checks run through `@axe-core/playwright` against WCAG 2.2 A/AA tags on representative routes. Do not weaken or exclude those checks to make a change pass.

---

## Forms, API, and security standards

The contact endpoint is the only server-side runtime behaviour. Treat it as production-critical.

- Validate every submitted value server-side against a strict Zod schema. Reject unknown keys.
- Enforce the transport rules already in place: `application/json` only, a 16 KB ceiling on the declared and streamed body, and an explicit 4xx/5xx response for every failure mode.
- Keep the honeypot check and the rate limiter healthy. The limiter is process-local; if the endpoint ever runs on more than one instance, replace it with a shared store rather than loosening it.
- Derive rate-limit identity from a trusted, verified client IP. Ingress must overwrite `X-Real-IP`; never trust `X-Forwarded-For`.
- Never report success for something that did not happen. Delivery failures return honest errors, including the "not configured" case.
- Do not persist submissions, and do not log submission contents.
- Keep the security headers in `next.config.ts` intact. HSTS and a nonce-based CSP are added at the production edge after the deployment domain and asset policy are confirmed — do not fake them in the repository.
- Secrets stay in server-only environment variables. Nothing that identifies a provider key may be exposed to the client.

---

## Testing standards

Tests live in `tests/e2e` and describe **user-visible behaviour** and the **API contract**, not implementation details.

- Add or update a spec whenever behaviour changes. A change that alters visible copy, a route, a form response, or a public metadata contract needs matching coverage.
- Prefer role- and name-based queries (`getByRole`, `getByLabel`) with stable class hooks where the design system already defines them.
- Keep tests deterministic: use route interception for provider failures instead of depending on external services.
- Accessibility, overflow, and theme coverage are part of the suite — extend those loops when you introduce a new publicly reachable route.
- Every new page belongs in the route-heading test and in the theme matrix so it cannot silently regress.

```bash
npm test                              # dev server, Chromium + Firefox + WebKit
PLAYWRIGHT_USE_PRODUCTION=1 npm test  # validate the production build instead
PLAYWRIGHT_PORT=3100 npm test         # when port 3000 is already taken
npx playwright test tests/e2e/home.spec.ts --project=chromium   # single spec
```

---

## Branch, commit, and pull request conventions

**Branches**

```text
feat/<short-description>      # new capability or page
fix/<short-description>       # bug fix
content/<short-description>   # editorial or copy change
docs/<short-description>      # documentation only
refactor/<short-description>  # internal change, no behaviour change
chore/<short-description>     # tooling, dependencies, configuration
```

**Commits** — short imperative subjects that explain _why_, not just _what_:

```text
feat(services): add AI automation service page
fix(contact): return an honest error when delivery is unconfigured
content(insights): rewrite the technical SEO article intro
docs(readme): document the inquiry pipeline
```

Keep commits scoped so a reviewer can understand one change at a time. Never commit `.env.local`, credentials, or generated build output.

**Pull requests** should state:

1. What changed and why.
2. Which routes, components, or APIs are affected.
3. Evidence it works: the exact commands run and their result.
4. Any new environment variable, accessibility consideration, or follow-up work.
5. Screenshots or recordings for visual changes, in **both** themes, plus a reduced-motion check where motion changed.

Reviewers specifically look for: token usage instead of hard-coded values, accessibility regressions, motion and reduced-motion correctness, honest content, server-side validation, and whether documentation or tests became stale.

---

## Definition of done

A change is complete when all of the following are true:

- [ ] `npm run lint` passes with no new warnings.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes (or the affected spec is documented as needing an environment you do not have).
- [ ] `npm run build` completes and the affected routes still prerender.
- [ ] `npm run format:check` passes.
- [ ] Light and dark themes both verified.
- [ ] Reduced-motion behaviour verified for any motion change.
- [ ] Keyboard-only navigation and focus states verified for any interactive change.
- [ ] No horizontal overflow at the supported widths.
- [ ] Accessibility checks still pass on representative routes.
- [ ] No hard-coded palette values, no hard-coded domains, no `process.env` reads outside `src/lib/env.ts`.
- [ ] No fabricated content, metrics, or claims.
- [ ] Documentation and tests updated when architecture, tokens, motion ownership, routes, or copy changed.

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

---

## Common tasks

**Add or edit a service**

Add an object to the `services` array in `src/content/content.ts` (`slug`, `title`, `shortTitle`, `summary`, `problem`, `outcome`, `deliverables`, `process`, `channels`, `faqs`). The service index, the `/services/[slug]` page, the sitemap entry, and the contact-form options follow automatically.

**Add an article**

Add an object to the `articles` array (`slug`, `title`, `summary`, `category`, `published`, `readingTime`, `sections`). The insights index, the article page, the RSS feed, the sitemap `lastModified`, and the JSON-LD block all derive from it.

**Add a demonstration concept**

Add an object to the `caseStudies` array. Keep the "demonstration concept · not a client" labelling intact.

**Add a team profile**

Add a member to `teamDisciplines`. The home team section, `/team/[slug]`, the sitemap entry, and the team-routing option in the contact form follow automatically. If there is no portrait, leave `portrait` as `null` — the accessible placeholder is the correct outcome.

**Add a page**

Create the route folder under `src/app`, export `metadata` (title, description, canonical), compose it from existing site components, add it to the routes list in `src/app/sitemap.ts`, and add it to the route-heading and theme test matrices.

**Replace the brand identity**

Drop the new mark at `public/Logo.png` — `siteConfig.logo` is the single reference used by the header, footer, and both loading states. Replace `public/favicon.png` for the browser icon; it is registered in the root metadata in `src/app/layout.tsx`.

**Change the brand colour**

Update the brand tokens in `src/app/globals.css`. Note that `tests/e2e/theme.spec.ts` asserts the accent token resolves to the current brand value, so the spec must be updated in the same change.

**Change a heading or key copy**

Search the specs first — `tests/e2e/home.spec.ts` and `tests/e2e/team-profile.spec.ts` assert specific headings, roles, and names. Update the tests with the copy.

---

## Things that will be rejected

- A visual effect that hides content until JavaScript runs, or that blocks clicks or scrolling.
- Hard-coded hex colours, domains, or spacing values where a token exists.
- Client components introduced for convenience rather than necessity.
- Copy that implies results, clients, or credentials the studio cannot evidence.
- Client-side-only validation on the contact endpoint, or any path that reports a false success.
- Weakened or removed accessibility, overflow, or theme assertions to make a change pass.
- Committing secrets, `.env.local`, build output, or editor artifacts.
- Documentation left contradicting the code.

---

## Reporting a problem

- **Bugs and content issues:** include the route, the browser, and the steps that reproduce it. For layout issues, include the viewport width and theme.
- **Accessibility issues:** describe the assistive technology or the WCAG criterion that is not met, and the element involved.
- **Security or privacy issues:** do not open a public issue. Report privately to the studio using the contact form so it can be triaged and fixed before disclosure. Include the affected endpoint, the request shape, and what you observed.

<div align="center">

**Quality here is not decoration — it is the product.**

</div>
