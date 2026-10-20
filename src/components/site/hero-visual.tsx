"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** The WebGL bundle is only fetched in the browser, after a capability check. */
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => null,
});

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
  const [inView, setInView] = useState(true);

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
    <div className="hero-visual" data-webgl={enabled} ref={host}>
      <div aria-hidden="true" className="hero-visual-fallback" />
      {enabled && <HeroScene active={inView} />}
    </div>
  );
}
