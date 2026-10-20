"use client";

import { useEffect } from "react";

import { BrandLoader } from "@/components/site/brand-loader";

const maximumWaitMs = 8_000;
const standardMinimumMs = 440;
const reducedMinimumMs = 120;

export function InitialPageLoader() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.initialLoader !== "pending") return;

    const startedAt = performance.now();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let leavingTimer = 0;
    let readyTimer = 0;
    let active = true;

    const leave = () => {
      if (!active) return;
      active = false;
      root.dataset.initialLoader = "leaving";
      leavingTimer = window.setTimeout(
        () => {
          delete root.dataset.initialLoader;
        },
        reduced ? 140 : 520,
      );
    };

    const timeout = window.setTimeout(leave, maximumWaitMs);
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const layoutPainted = new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    void Promise.all([fontsReady.catch(() => undefined), layoutPainted]).then(
      () => {
        if (!active) return;
        const minimum = reduced ? reducedMinimumMs : standardMinimumMs;
        const remaining = Math.max(
          0,
          minimum - (performance.now() - startedAt),
        );
        readyTimer = window.setTimeout(leave, remaining);
      },
    );

    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.clearTimeout(readyTimer);
      window.clearTimeout(leavingTimer);
    };
  }, []);

  return <BrandLoader mode="initial" />;
}
