# Design System Foundation

## Direction

Obsidian, electric cobalt, and ice. A deep obsidian-to-midnight base carries an
electric cobalt (ultramarine) primary accent, with soft icy blue and cool white
contrast, controlled violet and cyan highlights, and subtle metallic
reflections. Editorial typography still leads the hierarchy: a confident display
serif for headlines over a clean geometric sans for body copy. Surfaces use
layered panels, fine dividers, and restrained glows rather than flat blocks.

The home hero is deliberately darker than the rest of the site: it is an
immersive, genuinely rendered WebGL stage, and everything below hands off into
the lighter editorial page through a soft gradient fade.

The brand name and public URL stay centralized so the provisional identity can
be replaced without editing route content. Portfolio art is explicitly presented
as fictional demonstration concepts.

## Tokens

`src/app/globals.css` defines semantic CSS custom properties and maps them to
Tailwind v4 theme tokens. Components should use semantic utilities such as
`bg-background`, `text-foreground`, `text-muted`, `border-border`, and
`bg-accent`, rather than hard-coded palette values.

- Typography: `next/font` variables `--font-manrope` (sans) and
  `--font-newsreader` (display serif); use display type for editorial hierarchy
  and body type for longer reading.
- Color roles: `--background` / `--background-2`, `--surface` /
  `--surface-hover`, `--card` / `--card-soft`, `--foreground`, `--muted`,
  `--border`, `--accent` / `--accent-hover` / `--accent-2` / `--accent-violet`,
  `--accent-soft`, `--accent-line`, `--focus`, plus `--ink` / `--on-dark` /
  `--on-dark-muted` and `--line-dark` pairs for dark bands.
- Immersive (WebGL hero) tokens: `--obsidian`, `--obsidian-2`, `--ice`,
  `--cobalt`, `--cobalt-bright`.
- The system dark preference remaps the same roles.
- Legacy aliases (`--primary`, `--primary-soft`, `--green`, `--green-soft`,
  `--paper`) are retained so existing markup keeps resolving.
- Radius: `--radius-xs` 8px, `--radius-sm` 12px, `--radius` 16px, `--radius-lg`
  22px, `--radius-xl` 30px.
- Elevation: `--shadow-sm` / `--shadow-md` / `--shadow-lg` plus `--glow` /
  `--glow-2` for accent halos.
- Easing: `--ease-out-soft` (`cubic-bezier(0.22, 1, 0.36, 1)`) is the shared
  UI curve; `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) is used for
  mask reveals.
- Spacing: Tailwind spacing scale plus responsive site-specific layout rules;
  align page content to a shared 80rem visual container.
- Breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem, and `xl` 80rem, with
  additional 1080px, 900px, 760px, 680px, and 380px steps.
- Borders: fine semantic dividers and layered panel surfaces; avoid nesting
  unnecessarily.
- Focus: visible two-pixel focus outline with offset, using `--focus`.

## Framework split

Motion responsibilities are divided, not duplicated:

- **Lenis** (`src/components/site/smooth-scroll.tsx`) owns scrolling. GSAP's
  ticker drives Lenis, so the whole site runs on one animation clock and
  ScrollTrigger stays in sync. Progress is published to
  `src/lib/scroll.ts` for the WebGL layer.
- **GSAP + ScrollTrigger** (`src/components/site/motion.tsx`) owns scroll-linked
  and pointer-linked timelines: `MaskedHeading`, `Parallax`, `Magnetic`.
- **Motion** (`src/components/site/animated.tsx`) owns component transitions:
  `ScrollProgress`, `RevealSection`, `RevealItem`, `HeroBlock`, `StatCounter`,
  `Marquee`.
- **three.js + React Three Fiber + drei**
  (`src/components/three/hero-scene.tsx`) owns the hero scene.
- **CSS** owns hover states, gradient/mask artwork, and ambient keyframes.

## Motion primitives

- `ScrollProgress` — fixed gradient bar that tracks reading progress via
  `useScroll` + `useSpring`.
- `RevealSection` — fades and lifts a whole section once it enters the viewport
  (supports a `delay`).
- `RevealItem` — the single-item variant, used for staggered groups.
- `HeroBlock` — animates on mount for above-the-fold content (supports `delay`).
- `StatCounter` — counts up to a value the first time it is seen.
- `Marquee` — decorative continuous scrolling strip; marked `aria-hidden`.
- `MaskedHeading` — clipped line-by-line headline reveal. Renders plain,
  selectable, readable text; nothing is hidden until GSAP runs.
- `Parallax` — scrubbed vertical drift for layered sections.
- `Magnetic` — restrained pointer pull, desktop fine-pointer only.

Supporting CSS animations are `cue-slide`, `rise-in`, `fade-up`, `dropdown-in`,
`dot-ping`, `aurora-drift`, `float-slow`, `marquee`, and `spin`.

Always honor `prefers-reduced-motion`: the global reduce block neutralizes
ambient animation, the motion primitives bail out of their timelines, Lenis is
replaced by native scrolling, and the WebGL canvas switches to
`frameloop="demand"` with reduced-motion camera behaviour. `StatCounter`
renders its final value without animating.

## 3D hero

`src/components/three/hero-scene.tsx` renders an art-directed scene ("Cobalt
Monolith"): a faceted transmission-glass core inside tilted brushed-metal orbit
rings with emissive cobalt beads, a faint wireframe shell, drifting ice dust,
and an infinite cobalt grid above a `ContactShadows` catch. Lighting is a real
directional setup plus a procedural `Environment` built from `Lightformer`s —
no image textures. Tone mapping is ACES filmic.

- The scene is loaded with `next/dynamic` and `ssr: false`, only after a
  `WebGL` capability check, and only ever renders on the client.
- `detectQuality()` derives a low/medium/high tier from
  `hardwareConcurrency`, `deviceMemory`, pointer coarseness, and viewport width.
  The tier controls DPR, antialiasing, particle count, environment resolution,
  shadows, and whether the expensive transmission material is used.
- An `IntersectionObserver` pauses rendering whenever the hero scrolls away.
- A CSS fallback (`.hero-visual-fallback`) sits underneath at all times so the
  composition never looks broken before the bundle arrives or without WebGL.
- All WebGL geometry and materials are memoised and disposed by R3F; nothing is
  created per frame.

## Page composition

- The home page uses varied layouts rather than repeated card rows: an
  asymmetric 12-column concept spread (`.work-showcase`), a lead-capability
  panel plus supporting rail (`.service-feature-grid` / `.service-rail`), and a
  connected numbered process rail (`.process-rail`).
- Card-like primitives remain in `src/components/site/cards.tsx` for the
  routes that still need them.

## Components and accessibility

Add primitives to `src/components/ui` only when they establish a reusable
interaction or visual convention. The Button primitive demonstrates CVA
variants and Tailwind class merging. Use semantic HTML, accessible names,
native keyboard behavior, adequate contrast, and stable control dimensions. Use
Lucide icons for actions when an icon is needed, and provide an accessible name
or tooltip for icon-only controls.

No animation may block clicks or scrolling, hover-only information must have a
non-hover equivalent, and the site must remain useful and readable without
WebGL.
