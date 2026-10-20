"use client";

import { useEffect } from "react";

import { BrandLoader } from "@/components/site/brand-loader";

const maximumWaitMs = 1_500;

export function InitialPageLoader() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.initialLoader !== "pending") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let leavingTimer = 0;
    let active = true;

    const leave = () => {
      if (!active) return;
      active = false;
      root.dataset.initialLoader = "leaving";
      if (reduced) {
        delete root.dataset.initialLoader;
        return;
      }
      leavingTimer = window.setTimeout(() => {
        delete root.dataset.initialLoader;
      }, 220);
    };

    const timeout = window.setTimeout(leave, maximumWaitMs);
    const layoutPainted = new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    void layoutPainted.then(() => {
      if (!active) return;
      leave();
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.clearTimeout(leavingTimer);
    };
  }, []);

  return <BrandLoader mode="initial" />;
}
