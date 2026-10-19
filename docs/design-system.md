# Design System Foundation

## Direction

Midnight navy meets electric violet. A deep navy-to-charcoal base carries an electric violet-blue accent with cyan highlights, giving the site a modern SaaS/technology feel at high contrast. Editorial typography still leads the hierarchy: confident display serif headlines over a clean geometric sans for body copy. Surfaces use layered cards, soft glows, and fine dividers instead of flat backgrounds. The brand name and public URL stay centralized so the provisional identity can be replaced without editing route content. Abstract artwork is made with CSS; portfolio art is explicitly presented as fictional demonstration concepts.

## Tokens

`src/app/globals.css` defines semantic CSS custom properties and maps them to Tailwind v4 theme tokens. Components should use semantic utilities such as `bg-background`, `text-foreground`, `text-muted`, `border-border`, and `bg-accent`, rather than hard-coded palette values.

- Typography: `next/font` variables `--font-manrope` (sans) and `--font-newsreader` (display serif); use display type for editorial hierarchy and body type for longer reading.
- Color roles: `--background` / `--background-2`, `--surface` / `--surface-hover`, `--card` / `--card-soft`, `--foreground`, `--muted`, `--border`, `--accent` / `--accent-hover` / `--accent-2`, `--accent-soft`, `--accent-line`, `--focus`, plus `--ink` / `--on-dark` pairs for dark bands. The system dark preference remaps the same roles.
- Legacy aliases (`--primary`, `--primary-soft`, `--green`, `--green-soft`, `--paper`, `--ink`) are retained so existing markup keeps resolving.
- Radius: `--radius-xs` 8px, `--radius-sm` 12px, `--radius` 16px, `--radius-lg` 22px, `--radius-xl` 30px.
- Elevation: `--shadow-sm` / `--shadow-md` / `--shadow-lg` plus `--glow` / `--glow-2` for accent halos.
- Easing: `--ease-out-soft` (`cubic-bezier(0.22, 1, 0.36, 1)`) is the shared motion curve.
- Spacing: Tailwind spacing scale plus responsive site-specific layout rules; align page content to a shared 80rem visual container.
- Breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem, and `xl` 80rem, with an additional 1080px step where 3-column grids drop to two columns to prevent overflow.
- Borders: fine semantic dividers and layered card surfaces; avoid nesting unnecessarily.
- Focus: visible two-pixel focus outline with offset, using the semantic focus token.

## Motion primitives

Animation lives in `src/components/site/animated.tsx` and is intentionally reused rather than re-implemented per page.

- `ScrollProgress` — fixed gradient bar that tracks reading progress via `useScroll` + `useSpring`.
- `RevealSection` — fades and lifts a whole section once it enters the viewport (supports a `delay`).
- `RevealItem` — the single-item variant, used for staggered groups (`delay`, `distance`).
- `HeroBlock` — animates on mount for above-the-fold content.
- `StatCounter` — counts up to a value the first time it is seen.
- `Marquee` — decorative continuous scrolling strip; marked `aria-hidden`.

Supporting CSS animations are `aurora-drift`, `rise-in`, `fade-up`, `dropdown-in`, `dot-ping`, `panel-sheen`, `orb-pulse`, `orbit-one` / `orbit-two` / `orbit-three`, `marquee`, `float-slow`, and `spin`.

Always honor `prefers-reduced-motion`: the global reduce block disables the ambient aurora, marquee, and orbit animations, and `StatCounter` above renders its final value without animating.

## Components and accessibility

Add primitives to `src/components/ui` only when they establish a reusable interaction or visual convention. The Button primitive demonstrates CVA variants and Tailwind class merging. Use semantic HTML, accessible names, native keyboard behavior, adequate contrast, and stable control dimensions. Use Lucide icons for actions when an icon is needed, and provide an accessible name or tooltip for icon-only controls.

The default theme follows the operating-system color preference. Maintain both semantic token mappings as components are introduced; do not hard-code theme-specific colors in feature UI. Verify contrast in both themes, in particular for the dark bands (`.page-intro-dark`, `.cta-section`, `.industry-band`) where accent-on-dark tokens apply. Accessibility and visual quality still require real interface testing in Phase 3.
