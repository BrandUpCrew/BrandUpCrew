"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
} from "react";

import { useHeroEntrance } from "@/lib/entrance";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Reduced-motion preference reported through `useSyncExternalStore` so the
 * first client render still matches the prerendered markup. Reading
 * `matchMedia` during render instead would cause a hydration mismatch.
 */
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return false;
}

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
      viewport={{ once: false, amount: 0.15 }}
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
      viewport={{ once: false, amount: 0.2 }}
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
  delay = 0,
  ...props
}: ComponentProps<typeof motion.div> & { delay?: number }) {
  // Held back while the brand curtain is still up, so the entrance plays as the
  // overlay fades rather than finishing behind it.
  const ready = useHeroEntrance();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to a value every time it scrolls into view. */
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
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const entranceReady = useHeroEntrance();
  const reduce = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce || !inView || !entranceReady) return;
    const controls = animate(0, value, {
      duration: 1.2,
      delay,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => {
      controls.stop();
      setDisplay(0);
    };
  }, [inView, entranceReady, value, delay, reduce]);

  const activeDisplay = inView ? display : 0;

  return (
    <div className="stat-item">
      <span className="stat-value" ref={ref}>
        {String(reduce ? value : activeDisplay).padStart(2, "0")}
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

/** Staggers child items sequentially when scrolling into view. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.65, ease: EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Subtle continuous floating physics for decorative accents. */
export function FloatingElement({
  children,
  className,
  duration = 4.5,
  distance = 8,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={
        reduce
          ? undefined
          : {
              y: [-distance, distance, -distance],
              rotate: [-0.8, 0.8, -0.8],
            }
      }
      transition={
        reduce
          ? undefined
          : {
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      {children}
    </motion.div>
  );
}
