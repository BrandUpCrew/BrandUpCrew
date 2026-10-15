import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="max-w-content mx-auto flex min-h-svh w-full items-center px-6 py-24 sm:px-10">
      <div className="border-accent max-w-3xl border-l-2 pl-6 sm:pl-10">
        <p className="text-muted mb-6 text-sm font-semibold tracking-[0.12em] uppercase">
          {siteConfig.name} / Phase 1
        </p>
        <h1 className="font-display text-foreground text-5xl leading-[1.04] sm:text-7xl">
          A clearer foundation for what&apos;s next.
        </h1>
        <p className="text-muted mt-7 max-w-xl text-lg leading-8">
          The platform foundation is ready for its next chapter.
        </p>
      </div>
    </main>
  );
}
