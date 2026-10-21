"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Editorial mask reveal for headlines with subtle 3D perspective settling.
 *
 * Each entry in `lines` becomes a clipped line whose inner span slides up from
 * behind its own mask with a refined 3D rotational entry. The markup stays plain,
 * selectable and readable text, and nothing is hidden until GSAP runs, so it
 * degrades safely.
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
                  toggleActions: "play reset play reset",
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
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

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
    if (!container || !card || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

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
        glareRef.current.style.background = `radial-gradient(circle 380px at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.14), transparent 70%)`;
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
            toggleActions: "play reset play reset",
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
