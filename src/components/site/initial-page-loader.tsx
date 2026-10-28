"use client";

import { useEffect } from "react";

import { BrandLoader } from "@/components/site/brand-loader";
import { INITIAL_LOADER_EXIT_EVENT } from "@/lib/entrance";

const readinessTimeoutMs = 4000;
const exitTransitionMs = 420;

export function InitialPageLoader() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.initialLoader !== "pending") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let active = true;
    let readinessTimer = 0;
    let leavingTimer = 0;

    const leave = () => {
      if (!active) return;
      active = false;
      window.clearTimeout(readinessTimer);
      // Announce the lift before the attribute flips so hero entrances are
      // already running as the curtain fades out.
      window.dispatchEvent(new Event(INITIAL_LOADER_EXIT_EVENT));
      root.dataset.initialLoader = "leaving";
      if (reduced) {
        delete root.dataset.initialLoader;
        return;
      }
      leavingTimer = window.setTimeout(() => {
        delete root.dataset.initialLoader;
      }, exitTransitionMs);
    };

    const layoutPainted = new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    const hero = document.querySelector<HTMLElement>(".hero-visual");
    let onHeroReady: (() => void) | null = null;
    const heroReady = new Promise<void>((resolve) => {
      if (!hero || hero.dataset.initialReady === "true") {
        resolve();
        return;
      }

      onHeroReady = () => resolve();
      window.addEventListener("initial-hero-ready", onHeroReady, {
        once: true,
      });
    });

    const fontsReady = document.fonts.ready.catch((error: unknown) => {
      console.error(
        "The page font set failed to load; continuing with fallback fonts.",
        error,
      );
    });

    readinessTimer = window.setTimeout(() => {
      if (hero && hero.dataset.initialReady !== "true") {
        hero.dataset.initialReady = "fallback";
        console.error(
          "The hero did not report a rendered frame before the loading readiness timeout; continuing with the CSS fallback.",
        );
      }
      leave();
    }, readinessTimeoutMs);

    void Promise.all([layoutPainted, fontsReady, heroReady]).then(leave);

    return () => {
      active = false;
      if (onHeroReady) {
        window.removeEventListener("initial-hero-ready", onHeroReady);
      }
      window.clearTimeout(readinessTimer);
      window.clearTimeout(leavingTimer);
    };
  }, []);

  return <BrandLoader mode="initial" />;
}
