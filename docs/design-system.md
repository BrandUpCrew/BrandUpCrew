# Design System Foundation

## Direction

Use a light editorial foundation with confident typography and a restrained evergreen accent. Brand colors and identity are centralized so the temporary identity can be replaced without editing route content. Prefer clear content hierarchy and whitespace over decorative effects.

## Tokens

`src/app/globals.css` defines semantic CSS custom properties and maps them to Tailwind v4 theme tokens. Components should use semantic utilities such as `bg-background`, `text-foreground`, `text-muted`, `border-border`, and `bg-accent`, rather than hard-coded palette values.

- Typography: `next/font` variables `--font-sans` (Manrope) and `--font-display` (Newsreader); use display type sparingly for editorial headings.
- Color: background, foreground, surface, muted, border, accent, and focus tokens; system dark preference maps the same semantic roles.
- Spacing: Tailwind spacing scale; align page content to the `max-w-content` container token.
- Breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem, and `xl` 80rem.
- Borders: semantic `border` token, small radii (4-6px) for controls, and no nested card surfaces.
- Focus: visible two-pixel focus outline with offset, using the semantic focus token.
- Motion: honor `prefers-reduced-motion`; add motion only when it conveys state or hierarchy.

## Components and accessibility

Add primitives to `src/components/ui` only when they establish a reusable interaction or visual convention. The Button primitive demonstrates CVA variants and Tailwind class merging. Use semantic HTML, accessible names, native keyboard behavior, adequate contrast, and stable control dimensions. Use Lucide icons for actions when an icon is needed, and provide an accessible name or tooltip for icon-only controls.

The default theme follows the operating-system color preference. Maintain both semantic token mappings as components are introduced; do not hard-code theme-specific colors in feature UI. Accessibility and visual quality still require real interface testing in Phase 3.
