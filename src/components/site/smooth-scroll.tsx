"use client";

import { useEffect } from "react";

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
    const root = document.documentElement;

    let lastY = window.scrollY;
    let lastTime = performance.now();
    let heroSpan = 1;
    let maxScroll = 0;

    const sync = (y: number) => {
      const now = performance.now();
      const dt = Math.max((now - lastTime) / 1000, 0.001);
      const deltaY = y - lastY;
      const currentVelocity = deltaY / dt;
      lastY = y;
      lastTime = now;

      scrollStore.y = y;
      scrollStore.hero = clamp(y / heroSpan, 0, 1);
      scrollStore.progress = maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0;
      scrollStore.velocity = currentVelocity;
      scrollStore.direction = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;
    };

    const refreshMetrics = () => {
      const hero = document.getElementById("hero");
      // Use a consistent span for the 3D transition to feel locked to the scroll
      heroSpan = hero
        ? Math.max(hero.offsetHeight, window.innerHeight)
        : window.innerHeight;
      maxScroll = Math.max(root.scrollHeight - window.innerHeight, 0);
      sync(window.scrollY);
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Both the resize event and the ResizeObserver can fire many times within a
    // single gesture. The metric pass is cheap enough to run once per frame,
    // but a full ScrollTrigger.refresh() re-measures every trigger on the page,
    // so it waits until the viewport has actually settled.
    let metricsFrame = 0;
    const scheduleMetrics = () => {
      if (metricsFrame) return;
      metricsFrame = requestAnimationFrame(() => {
        metricsFrame = 0;
        refreshMetrics();
      });
    };
    let refreshTimer = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        refreshTimer = 0;
        refreshMetrics();
        scrollTrigger?.refresh();
      }, 160);
    };

    const onNativeScroll = () => sync(window.scrollY);
    const onViewportChange = () => {
      scheduleMetrics();
      scheduleRefresh();
    };
    const onLoad = () => {
      refreshMetrics();
      scrollTrigger?.refresh();
    };
    let scrollTrigger:
      typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;
    let lenis: import("lenis").default | null = null;
    let gsap: typeof import("gsap").gsap | null = null;
    let tickerCallback: ((time: number) => void) | null = null;
    let tickerActive = false;
    let cancelled = false;
    let startupTimer = 0;
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleMetrics);

    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("load", onLoad);
    resizeObserver?.observe(root);
    if (document.body) resizeObserver?.observe(document.body);
    refreshMetrics();

    if (reduced) {
      return () => {
        window.removeEventListener("scroll", onNativeScroll);
        window.removeEventListener("resize", onViewportChange);
        window.removeEventListener("load", onLoad);
        resizeObserver?.disconnect();
        if (metricsFrame) cancelAnimationFrame(metricsFrame);
        window.clearTimeout(refreshTimer);
      };
    }

    const initializeSmoothScroll = async () => {
      try {
        const [lenisModule, gsapModule, scrollTriggerModule] =
          await Promise.all([
            import("lenis"),
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ]);
        if (cancelled) return;

        gsap = gsapModule.default;
        scrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(scrollTrigger);
        lenis = new lenisModule.default({
          duration: 1.05,
          smoothWheel: true,
          touchMultiplier: 1.35,
          easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        });

        const onScroll = (instance: import("lenis").default) => {
          sync(instance.scroll);
          scrollTrigger?.update();
        };
        const raf = (time: number) => lenis?.raf(time * 1000);
        tickerCallback = raf;

        window.removeEventListener("scroll", onNativeScroll);
        lenis.on("scroll", onScroll);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(500, 33);
        tickerActive = true;
        refreshMetrics();
        scrollTrigger.refresh();

        cleanupSmoothScroll = () => {
          gsap?.ticker.remove(raf);
          gsap?.ticker.lagSmoothing(500, 33);
          lenis?.destroy();
          tickerActive = false;
        };
      } catch (error) {
        console.error(
          "Smooth scrolling failed to initialize; native scrolling remains active.",
          error,
        );
        if (tickerCallback) gsap?.ticker.remove(tickerCallback);
        lenis?.destroy();
        window.addEventListener("scroll", onNativeScroll, { passive: true });
        sync(window.scrollY);
      }
    };

    let cleanupSmoothScroll: (() => void) | undefined;
    startupTimer = window.setTimeout(() => void initializeSmoothScroll(), 0);

    return () => {
      cancelled = true;
      window.clearTimeout(startupTimer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onViewportChange);
      resizeObserver?.disconnect();
      if (metricsFrame) cancelAnimationFrame(metricsFrame);
      window.clearTimeout(refreshTimer);
      cleanupSmoothScroll?.();
      if (tickerActive) {
        gsap?.ticker.lagSmoothing(500, 33);
      }
    };
  }, []);

  return null;
}
