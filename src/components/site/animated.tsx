"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState, type ComponentProps } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Thin gradient bar that tracks reading progress. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ scaleX: reduce ? scrollYProgress : smoothed }}
    />
  );
}

/** Reveals a whole section once it enters the viewport. */
export function RevealSection({
  children,
  className,
  delay = 0,
  ...props
}: ComponentProps<typeof motion.section> & { delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/** Reveals a single element, usually one item inside a staggered group. */
export function RevealItem({
  children,
  className,
  delay = 0,
  distance = 22,
  ...props
}: ComponentProps<typeof motion.div> & { delay?: number; distance?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HeroBlock({
  children,
  className,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to a value the first time it scrolls into view. */
export function StatCounter({
  value,
  label,
  delay = 0,
  suffix = "",
}: {
  value: number;
  label: string;
  delay?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.2,
      delay,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, delay, reduce]);

  return (
    <div className="stat-item">
      <span className="stat-value" ref={ref}>
        {String(reduce ? value : display).padStart(2, "0")}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/** Decorative continuously scrolling strip of short labels. */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="capability-marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
