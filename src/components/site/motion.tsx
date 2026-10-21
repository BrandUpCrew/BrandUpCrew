"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scrollStore } from "@/lib/scroll";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Editorial mask reveal for headlines with subtle 3D perspective settling.
 * Degrades gracefully on reduced motion or initial SSR render.
 */
export function MaskedHeading({
  lines,
  tag: Tag = "h2",
  className,
  delay = 0,
  trigger = "scroll",
}: {
  lines: ReactNode[];
  tag?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  trigger?: "scroll" | "mount";
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const inners = el.querySelectorAll<HTMLElement>("[data-mask-inner]");
      if (!inners.length) return;

      gsap.fromTo(
        inners,
        {
          yPercent: 118,
          opacity: 0,
          rotateX: -14,
          transformPerspective: 800,
          transformOrigin: "bottom left",
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.08,
          delay,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger:
            trigger === "scroll"
              ? {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play reverse play reverse",
                }
              : undefined,
        },
      );
    },
    { scope: ref, dependencies: [trigger, delay] },
  );

  return (
    <Tag ref={ref} className={cn("masked-heading", className)}>
      {lines.map((line, index) => (
        <span className="mask-line" key={index}>
          <span className="mask-line-inner" data-mask-inner>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Scrubbed vertical drift that gives layered sections a sense of depth. */
export function Parallax({
  children,
  className,
  distance = 12,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.fromTo(
        el,
        { yPercent: distance },
        {
          yPercent: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: ref, dependencies: [distance] },
  );

  return (
    <div className={cn("parallax", className)} ref={ref}>
      {children}
    </div>
  );
}

/**
 * Restrained magnetic pull toward the pointer. Applied to a wrapper so it never
 * fights the element's own hover transitions.
 */
export function Magnetic({
  children,
  className,
  strength = 0.22,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || isTouchDevice()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <span className={cn("magnetic", className)} ref={ref}>
      {children}
    </span>
  );
}

/**
 * 3D perspective tilt container with cursor-following specular sheen.
 * Adds tactile physical depth to cards, portraits, and interactive panels.
 */
export function PerspectiveTilt({
  children,
  className,
  intensity = 12,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card || prefersReducedMotion() || isTouchDevice()) return;

    const rotX = gsap.quickTo(card, "rotateX", {
      duration: 0.45,
      ease: "power2.out",
    });
    const rotY = gsap.quickTo(card, "rotateY", {
      duration: 0.45,
      ease: "power2.out",
    });
    const zTo = gsap.quickTo(card, "z", {
      duration: 0.45,
      ease: "power2.out",
    });

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const tiltX = (py - 0.5) * -intensity;
      const tiltY = (px - 0.5) * intensity;
      rotX(tiltX);
      rotY(tiltY);
      zTo(14);

      if (glare && glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(circle 380px at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.16), transparent 70%)`;
      }
    };

    const onLeave = () => {
      rotX(0);
      rotY(0);
      zTo(0);
      if (glare && glareRef.current) {
        glareRef.current.style.opacity = "0";
      }
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(card);
    };
  }, [intensity, glare]);

  return (
    <div
      ref={containerRef}
      className={cn("perspective-tilt-wrap", className)}
      style={{ perspective: "1000px" }}
    >
      <div
        ref={cardRef}
        className="perspective-tilt-inner"
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
        {glare && (
          <div
            ref={glareRef}
            className="perspective-glare"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              opacity: 0,
              transition: "opacity 0.35s ease",
              mixBlendMode: "overlay",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Cinematic reveal using geometric or curtain clip-paths.
 * Clears clipPath completely upon completion to guarantee zero content clipping.
 */
export function ClipReveal({
  children,
  className,
  type = "polygon",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  type?: "polygon" | "curtain" | "diagonal";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const fromClip =
        type === "curtain"
          ? "inset(100% 0% 0% 0%)"
          : type === "diagonal"
            ? "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
            : "polygon(0% 15%, 100% 0%, 100% 100%, 0% 100%)";

      const toClip =
        type === "curtain"
          ? "inset(0% 0% 0% 0%)"
          : type === "diagonal"
            ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

      gsap.fromTo(
        el,
        { clipPath: fromClip, opacity: 0.2 },
        {
          clipPath: toClip,
          opacity: 1,
          duration: 1.15,
          delay,
          ease: "power3.inOut",
          onComplete: () => {
            if (el) el.style.clipPath = "none";
          },
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: ref, dependencies: [type, delay] },
  );

  return (
    <div ref={ref} className={cn("clip-reveal-wrap", className)}>
      {children}
    </div>
  );
}

/**
 * Section-to-section storytelling wrapper that introduces smooth dimensional depth
 * during scroll transitions.
 */
export function ScrollStorySection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.fromTo(
        el,
        { y: 32, opacity: 0.88 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 94%",
            end: "top 65%",
            scrub: 0.7,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("scroll-story-section", className)}>
      {children}
    </div>
  );
}

/**
 * Scroll-scrubbed interactive connector line that illuminates as the visitor progresses
 * through milestone or process steps.
 */
export function TimelineProgress({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const line = lineRef.current;
      if (!el || !line || prefersReducedMotion()) return;

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={cn("timeline-progress-track", className)}
      aria-hidden="true"
    >
      <div ref={lineRef} className="timeline-progress-fill" />
    </div>
  );
}

/* ==========================================================================
   LUSION-INSPIRED ADVANCED 3D MOTION SUITE
   ========================================================================== */

/**
 * Hero Spatial Exit Handoff:
 * As the visitor scrolls past the hero, the HTML typography and actions smoothly
 * recede along the Z-axis, perfectly mirroring the Three.js camera dive and creating
 * an immersive 3D spatial bridge into the services section.
 */
export function HeroSpatialExit({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.fromTo(
        el,
        {
          transformPerspective: 1200,
          z: 0,
          rotateX: 0,
          y: 0,
          opacity: 1,
        },
        {
          z: -120,
          rotateX: 6,
          y: 60,
          opacity: 0.18,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom 20%",
            scrub: 0.5,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("hero-spatial-exit", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/**
 * 3D entrance for hero statistics row with dimensional flip-in.
 */
export function HeroStatGrid3D({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const items = el.children;
      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 28,
          z: -40,
          rotateX: 25,
          transformPerspective: 800,
          transformOrigin: "bottom center",
        },
        {
          opacity: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          duration: 1.1,
          delay: 0.45,
          stagger: 0.12,
          ease: "power3.out",
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("hero-stats", "spatial-stat-grid", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/**
 * Velocity-Reactive 3D Ribbon Marquee:
 * Dynamically reacts to user scroll velocity, tilting along the X/Z axis
 * and flexing with organic physical momentum.
 */
export function SpatialMarquee({ items }: { items: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion() || isTouchDevice()) return;

    const rotX = gsap.quickTo(track, "rotateX", { duration: 0.35, ease: "power2.out" });
    const skewX = gsap.quickTo(track, "skewX", { duration: 0.35, ease: "power2.out" });

    let rafId: number;
    const update = () => {
      const vel = gsap.utils.clamp(-3500, 3500, scrollStore.velocity || 0);
      const intensity = vel / 3500;
      rotX(intensity * 5);
      skewX(intensity * -2);
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="capability-marquee spatial-marquee"
      aria-hidden="true"
      style={{ perspective: "1000px", overflow: "hidden" }}
    >
      <div
        ref={trackRef}
        className="marquee-track"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {[...items, ...items].map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Spatial Lead Service Card:
 * Features multi-layer spatial depth (background orb, text plane, deliverable tags, CTA)
 * with true 3D scroll entrance and cursor-following specular sheen.
 */
export function SpatialServiceLead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el || prefersReducedMotion()) return;

      gsap.fromTo(
        el,
        {
          opacity: 0,
          z: -85,
          rotateX: 14,
          rotateY: -8,
          y: 48,
          transformPerspective: 1200,
          transformOrigin: "bottom center",
        },
        {
          opacity: 1,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card || prefersReducedMotion() || isTouchDevice()) return;

    const rotX = gsap.quickTo(card, "rotateX", { duration: 0.45, ease: "power2.out" });
    const rotY = gsap.quickTo(card, "rotateY", { duration: 0.45, ease: "power2.out" });
    const zTo = gsap.quickTo(card, "z", { duration: 0.45, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotX((py - 0.5) * -12);
      rotY((px - 0.5) * 12);
      zTo(20);

      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(circle 420px at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.18), transparent 70%)`;
      }
    };

    const onLeave = () => {
      rotX(0);
      rotY(0);
      zTo(0);
      if (glareRef.current) {
        glareRef.current.style.opacity = "0";
      }
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(card);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("service-feature-slot", "spatial-service-lead-wrap", className)}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        className="spatial-service-lead-inner"
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
        <div
          ref={glareRef}
          className="perspective-glare"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            opacity: 0,
            transition: "opacity 0.35s ease",
            mixBlendMode: "overlay",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Supporting Service Rail:
 * Orchestrates the 5 service items with a synchronized 3D perspective cascade
 * where each card enters with deliberate dimensional rotation and settling.
 */
export function SpatialServiceRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const items = el.querySelectorAll("li");
      if (!items.length) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          rotateX: -18,
          z: -45,
          y: 35,
          transformPerspective: 1000,
          transformOrigin: "top center",
        },
        {
          opacity: 1,
          rotateX: 0,
          z: 0,
          y: 0,
          duration: 0.95,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <ul ref={ref} className={cn("service-rail", "spatial-service-rail", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </ul>
  );
}

/**
 * Spatial Process Rail:
 * Orchestrates the 4 process milestones with an architectural 3D unlock sequence
 * coordinated with scroll progress.
 */
export function SpatialProcessRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const items = el.querySelectorAll("li");
      if (!items.length) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          rotateX: -14,
          z: -35,
          x: -24,
          transformPerspective: 900,
          transformOrigin: "left center",
        },
        {
          opacity: 1,
          rotateX: 0,
          z: 0,
          x: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={cn("process-list", "process-rail", "spatial-process-rail", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </ol>
  );
}

/**
 * Spatial Industry Grid:
 * Alternating 3D perspective folding wall for industry categories.
 */
export function SpatialIndustryGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const items = el.querySelectorAll("li");
      if (!items.length) return;

      items.forEach((item, index) => {
        const isLeft = index % 2 === 0;
        gsap.fromTo(
          item,
          {
            opacity: 0,
            rotateY: isLeft ? -16 : 16,
            rotateX: 10,
            z: -40,
            y: 28,
            transformPerspective: 1000,
            transformOrigin: isLeft ? "right center" : "left center",
          },
          {
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            y: 0,
            duration: 0.95,
            delay: index * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });
    },
    { scope: ref },
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || isTouchDevice()) return;

    const items = el.querySelectorAll("li");
    const cleanups: (() => void)[] = [];

    items.forEach((item) => {
      const rotX = gsap.quickTo(item, "rotateX", { duration: 0.35, ease: "power2.out" });
      const rotY = gsap.quickTo(item, "rotateY", { duration: 0.35, ease: "power2.out" });
      const zTo = gsap.quickTo(item, "z", { duration: 0.35, ease: "power2.out" });

      const onMove = (e: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        rotX((py - 0.5) * -7);
        rotY((px - 0.5) * 7);
        zTo(14);
      };

      const onLeave = () => {
        rotX(0);
        rotY(0);
        zTo(0);
      };

      item.addEventListener("mousemove", onMove);
      item.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        item.removeEventListener("mousemove", onMove);
        item.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf(item);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <ul ref={ref} className={cn("industry-list", "spatial-industry-grid", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </ul>
  );
}

/**
 * Architectural 3D Team Card:
 * Multi-layer entrance with geometric portrait clip reveal, internal depth,
 * and specular sheen.
 */
export function SpatialTeamCard({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el || prefersReducedMotion()) return;

      const rotYInit = index % 2 === 0 ? -7 : 7;

      gsap.fromTo(
        el,
        {
          opacity: 0,
          z: -70,
          rotateX: 15,
          rotateY: rotYInit,
          y: 50,
          transformPerspective: 1200,
          transformOrigin: "bottom center",
        },
        {
          opacity: 1,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 1.15,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: containerRef, dependencies: [index] },
  );

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card || prefersReducedMotion() || isTouchDevice()) return;

    const rotX = gsap.quickTo(card, "rotateX", { duration: 0.45, ease: "power2.out" });
    const rotY = gsap.quickTo(card, "rotateY", { duration: 0.45, ease: "power2.out" });
    const zTo = gsap.quickTo(card, "z", { duration: 0.45, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotX((py - 0.5) * -11);
      rotY((px - 0.5) * 11);
      zTo(16);

      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(circle 380px at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.16), transparent 70%)`;
      }
    };

    const onLeave = () => {
      rotX(0);
      rotY(0);
      zTo(0);
      if (glareRef.current) {
        glareRef.current.style.opacity = "0";
      }
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(card);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("team-card-tilt", "spatial-team-card-wrap", className)}
      style={{ perspective: "1200px", height: "100%" }}
    >
      <div
        ref={cardRef}
        className="spatial-team-card-inner"
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
        <div
          ref={glareRef}
          className="perspective-glare"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            opacity: 0,
            transition: "opacity 0.35s ease",
            mixBlendMode: "overlay",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}

/**
 * Spatial Article Deck:
 * Staggered 3D deck arrival for insight cards.
 */
export function SpatialArticleGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const items = el.children;
      if (!items.length) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          rotateX: -14,
          z: -55,
          y: 42,
          transformPerspective: 1100,
          transformOrigin: "top center",
        },
        {
          opacity: 1,
          rotateX: 0,
          z: 0,
          y: 0,
          duration: 1.05,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("article-grid", "spatial-article-grid", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/**
 * 3D Accordion Cascade for FAQ section:
 * Introduces smooth physical folding entrance for FAQ questions.
 */
export function SpatialFaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const elements = el.querySelectorAll(".faq-item-wrap");
      if (!elements.length) return;

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          rotateX: -20,
          z: -35,
          y: 28,
          transformPerspective: 900,
          transformOrigin: "top center",
        },
        {
          opacity: 1,
          rotateX: 0,
          z: 0,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="faq-list spatial-faq-list" style={{ transformStyle: "preserve-3d" }}>
      {items.map((item, index) => (
        <div key={item.question} className="faq-item-wrap" style={{ transformStyle: "preserve-3d" }}>
          <details className="faq-item">
            <summary>
              <span className="faq-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.question}</span>
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{item.answer}</p>
          </details>
        </div>
      ))}
    </div>
  );
}

/**
 * Spatial Section Transition:
 * Elevates section-to-section storytelling with scroll-driven dimensional emergence.
 */
export function SpatialSectionTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.fromTo(
        el,
        {
          opacity: 0.86,
          y: 44,
          scale: 0.975,
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 68%",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("spatial-section-transition", className)}>
      {children}
    </div>
  );
}

/**
 * Spatial CTA Container:
 * Monolithic 3D arrival with parallax background watermark.
 */
export function SpatialCta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const mark = el.querySelector(".cta-mark");
      if (mark) {
        gsap.fromTo(
          mark,
          { yPercent: -35, z: -60, transformPerspective: 800 },
          {
            yPercent: 35,
            z: 20,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      }

      gsap.fromTo(
        el,
        {
          opacity: 0.4,
          scale: 0.95,
          rotateX: -6,
          transformPerspective: 1100,
          transformOrigin: "top center",
        },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={cn("cta-section", "spatial-cta-section", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </section>
  );
}
