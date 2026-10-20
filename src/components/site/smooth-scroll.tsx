"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { clamp, scrollStore } from "@/lib/scroll";

/**
 * Owns the page's scroll behaviour.
 *
 * Lenis drives smooth scrolling and GSAP's ticker drives Lenis, so there is a
 * single animation clock for the whole site and ScrollTrigger stays in sync.
 * The same loop publishes progress into `scrollStore` for the WebGL layer.
 * Visitors who prefer reduced motion get plain native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = document.documentElement;

    const sync = (y: number) => {
      const hero = document.getElementById("hero");
      const heroSpan = hero
        ? Math.max(hero.offsetHeight - window.innerHeight * 0.35, 1)
        : 1;
      const max = root.scrollHeight - window.innerHeight;

      scrollStore.y = y;
      scrollStore.hero = clamp(y / heroSpan, 0, 1);
      scrollStore.progress = max > 0 ? clamp(y / max, 0, 1) : 0;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onNativeScroll = () => sync(window.scrollY);
    const refresh = () => ScrollTrigger.refresh();

    if (reduced) {
      sync(window.scrollY);
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      window.addEventListener("resize", onNativeScroll);
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("scroll", onNativeScroll);
        window.removeEventListener("resize", onNativeScroll);
        window.removeEventListener("load", refresh);
      };
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.35,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });

    const onScroll = (instance: Lenis) => {
      sync(instance.scroll);
      ScrollTrigger.update();
    };

    // Drives Lenis from GSAP's ticker so both share one clock.
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    sync(window.scrollY);
    window.addEventListener("load", refresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
