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
 * Editorial mask reveal for headlines.
 *
 * Each entry in `lines` becomes a clipped line whose inner span slides up from
 * behind its own mask. The markup stays plain, selectable and readable text,
 * and nothing is hidden until GSAP runs, so it degrades safely.
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
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.05,
          delay,
          ease: "expo.out",
          stagger: 0.075,
          scrollTrigger:
            trigger === "scroll"
              ? { trigger: el, start: "top 88%", once: true }
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
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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
