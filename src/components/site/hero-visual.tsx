"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/** The WebGL bundle is only fetched in the browser, after a capability check. */
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => null,
});

const SMALL_SCREEN_QUERY = "(max-width: 900px)";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

let webglSupport: boolean | null = null;

function getWebGLSupport() {
  webglSupport ??= supportsWebGL();
  return webglSupport;
}

/** Capability never changes after load, so there is nothing to subscribe to. */
function subscribeToWebGLSupport() {
  return () => {};
}

function getServerWebGLSupport() {
  return false;
}

function subscribeToSmallScreen(onChange: () => void) {
  const mediaQuery = window.matchMedia(SMALL_SCREEN_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function isSmallScreen() {
  return window.matchMedia(SMALL_SCREEN_QUERY).matches;
}

function getServerSmallScreen() {
  return true;
}

/**
 * Hosts the 3D hero.
 *
 * Keeps a lightweight CSS fallback underneath at all times so the composition
 * never looks broken while the scene loads, on devices without WebGL, or when
 * the visitor prefers reduced motion without GPU work. Rendering pauses
 * whenever the hero scrolls out of view so the page stays cheap afterwards.
 */
export function HeroVisual() {
  const host = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(
    subscribeToWebGLSupport,
    getWebGLSupport,
    getServerWebGLSupport,
  );
  const smallScreen = useSyncExternalStore(
    subscribeToSmallScreen,
    isSmallScreen,
    getServerSmallScreen,
  );
  const [inView, setInView] = useState(true);
  const [webglReady, setWebglReady] = useState(false);
  const markWebGLReady = useCallback(() => setWebglReady(true), []);

  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "180px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-visual" data-webgl-ready={webglReady} ref={host}>
      <div aria-hidden="true" className="hero-visual-fallback" />
      {enabled && !smallScreen && (
        <HeroScene active={inView} onReady={markWebGLReady} />
      )}
    </div>
  );
}
