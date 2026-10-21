"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

import { scrollStore } from "@/lib/scroll";
import {
  getServerTheme,
  getTheme,
  subscribeToThemeChanges,
  type Theme,
} from "@/lib/theme";

type Quality = {
  tier: "high" | "medium" | "low";
  dpr: [number, number];
  antialias: boolean;
  envResolution: number;
  shadows: boolean;
};

type ModuleId = "product" | "identity" | "engineering" | "growth";

type ModuleConfig = {
  id: ModuleId;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  formationOffset: [number, number, number];
  delay: number;
};

const MODULES: ModuleConfig[] = [
  {
    id: "product",
    position: [1.18, 0.02, 0.48],
    rotation: [0.015, -0.13, 0.008],
    width: 3.7,
    height: 2.38,
    formationOffset: [0.1, -0.18, 1.7],
    delay: 0.08,
  },
  {
    id: "identity",
    position: [-0.92, 1.46, -0.78],
    rotation: [0.03, 0.2, -0.025],
    width: 1.7,
    height: 1.17,
    formationOffset: [-0.55, 0.28, 1.1],
    delay: 0.26,
  },
  {
    id: "engineering",
    position: [3.24, 1.23, -0.96],
    rotation: [-0.035, -0.18, 0.025],
    width: 1.78,
    height: 1.2,
    formationOffset: [0.45, 0.42, 1.2],
    delay: 0.44,
  },
  {
    id: "growth",
    position: [3.35, -1.32, -0.8],
    rotation: [0.035, -0.2, -0.025],
    width: 1.8,
    height: 1.2,
    formationOffset: [0.5, -0.38, 1.15],
    delay: 0.62,
  },
];

const COPY: Record<ModuleId, { label: string; title: string }> = {
  product: { label: "DIGITAL PRODUCT / 01", title: "Ideas into experiences." },
  identity: { label: "IDENTITY / 02", title: "A system with a point of view." },
  engineering: { label: "ENGINEERING / 03", title: "Built to move with you." },
  growth: { label: "GROWTH / 04", title: "Find the signal. Scale it." },
};

function getQuality(): Quality {
  if (typeof window === "undefined")
    return {
      tier: "high",
      dpr: [1, 1.5],
      antialias: true,
      envResolution: 128,
      shadows: true,
    };
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
  return {
    tier: "high",
    dpr: [1, dpr],
    antialias: true,
    envResolution: 128,
    shadows: true,
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }
}

const UI_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, Arial, sans-serif';
const MONO_FONT =
  '"JetBrains Mono", "SF Mono", Consolas, Menlo, Monaco, "Courier New", monospace';

function drawProductModule(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  const blue = "#2563eb";
  const ink = "#0f172a";
  const muted = "#64748b";

  const rect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    radius = 0,
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (radius > 0) {
      drawRoundedRect(ctx, x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.fill();
  };

  const drawText = (
    val: string,
    x: number,
    y: number,
    size: number,
    color: string,
    weight: number | string = 500,
    mono = false,
  ) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${mono ? MONO_FONT : UI_FONT}`;
    ctx.fillText(val, x, y);
  };

  // Base background (pure crisp white / light slate)
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);

  // Top header bar
  rect(0, 0, w, 72, "#ffffff");
  rect(0, 71, w, 1, "#e2e8f0");

  // Logo mark with cobalt dot
  drawText("DIGITAL / STUDIO", 44, 44, 18, ink, 750);
  ctx.beginPath();
  ctx.arc(206, 38, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = blue;
  ctx.fill();

  // Address chip in center
  rect(420, 22, 230, 28, "#f1f5f9", 14);
  ctx.beginPath();
  ctx.arc(438, 36, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#10b981";
  ctx.fill();
  drawText("brandupcrew.com/studio", 452, 40, 11, "#64748b", 500);

  // Navigation tabs with smooth sliding capsule indicator
  const tabs = [
    { label: "Work", x: 746, w: 68 },
    { label: "Studio", x: 826, w: 76 },
    { label: "Journal", x: 914, w: 84 },
  ];

  const tabCycle = (time * 0.25) % 3;
  const curTabIdx = Math.floor(tabCycle);
  const nextTabIdx = (curTabIdx + 1) % 3;
  const rawTabT = tabCycle % 1;
  const transTabT = rawTabT < 0.72 ? 0 : (rawTabT - 0.72) / 0.28;
  const smoothTabT = transTabT * transTabT * (3 - 2 * transTabT);
  const tabPillX =
    tabs[curTabIdx].x -
    10 +
    (tabs[nextTabIdx].x - tabs[curTabIdx].x) * smoothTabT;
  const tabPillW =
    tabs[curTabIdx].w + (tabs[nextTabIdx].w - tabs[curTabIdx].w) * smoothTabT;

  rect(tabPillX, 22, tabPillW, 32, "rgba(37, 99, 235, 0.08)", 16);

  tabs.forEach((tab, i) => {
    const isAct = i === curTabIdx;
    drawText(
      tab.label,
      tab.x,
      43,
      13.5,
      isAct ? ink : muted,
      isAct ? 650 : 500,
    );
  });

  // "Let's talk" CTA button with continuous sheen sweep
  rect(1040, 18, 122, 38, blue, 19);
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, 1040, 18, 122, 38, 19);
  ctx.clip();
  const shimX = 1040 + ((time * 110) % 280) - 60;
  const shimGrad = ctx.createLinearGradient(shimX, 18, shimX + 50, 56);
  shimGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  shimGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.42)");
  shimGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = shimGrad;
  ctx.fillRect(shimX, 18, 60, 38);
  ctx.restore();
  drawText("Let's talk ↗", 1064, 42, 13, "#ffffff", 650);

  // Left Content Area
  // Radar beacon
  ctx.beginPath();
  ctx.arc(58, 172, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = blue;
  ctx.fill();
  const haloR = 4.5 + (Math.sin(time * 3.2) * 0.5 + 0.5) * 6;
  ctx.beginPath();
  ctx.arc(58, 172, haloR, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(37, 99, 235, ${1 - (haloR - 4.5) / 6})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  drawText("DIGITAL PRODUCT STUDIO", 74, 177, 12.5, blue, 750);
  drawText("Make space for", 54, 254, 52, ink, 650);
  drawText("what comes next.", 54, 316, 52, ink, 650);
  drawText(
    "A thoughtful digital home for ambitious ideas.",
    58,
    360,
    17.5,
    muted,
  );

  // Primary action button
  rect(58, 394, 152, 44, blue, 6);
  drawText("Explore the work ↗", 74, 421, 13.5, "#ffffff", 600);

  // Right Mockup Window
  rect(714, 148, 434, 282, "#ffffff", 8);
  ctx.strokeStyle = "#dce4ef";
  ctx.lineWidth = 1;
  ctx.beginPath();
  drawRoundedRect(ctx, 714, 148, 434, 282, 8);
  ctx.stroke();

  // Mockup top title bar
  rect(714, 148, 434, 34, "#f1f5f9", 8);
  rect(714, 176, 434, 6, "#f1f5f9");
  rect(714, 182, 434, 1, "#e2e8f0");
  [
    { c: "#ef4444", x: 732 },
    { c: "#f59e0b", x: 746 },
    { c: "#10b981", x: 760 },
  ].forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, 165, 4, 0, Math.PI * 2);
    ctx.fillStyle = dot.c;
    ctx.fill();
  });
  rect(782, 157, 210, 18, "#ffffff", 9);
  drawText("studio.digital/platform", 814, 170, 9.5, "#94a3b8");

  // Inside mockup window: Left skeleton media card with continuous light wave
  rect(734, 200, 140, 212, "#e2e8f0", 6);
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, 734, 200, 140, 212, 6);
  ctx.clip();
  const waveX = 734 + ((time * 125) % 360) - 80;
  const waveGrad = ctx.createLinearGradient(waveX, 200, waveX + 80, 412);
  waveGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  waveGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.48)");
  waveGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = waveGrad;
  ctx.fillRect(waveX, 200, 80, 212);
  ctx.restore();

  // Left card bottom label
  rect(744, 382, 84, 18, "rgba(15, 23, 42, 0.65)", 9);
  drawText("● PROD v2.4", 754, 394, 8.5, "#ffffff", 600);

  // Right column inside mockup window
  const barW1 = 180 + Math.sin(time * 1.5) * 10;
  const barW2 = 140 + Math.cos(time * 1.2) * 8;
  const barW3 = 160 + Math.sin(time * 1.8) * 9;
  rect(892, 206, barW1, 10, "#94a3b8", 5);
  rect(892, 228, barW2, 7, "#cbd5e1", 4);
  rect(892, 246, barW3, 7, "#cbd5e1", 4);

  // Active status tag
  rect(892, 272, 130, 24, "rgba(37, 99, 235, 0.08)", 12);
  drawText(
    `ACTIVE · ${Math.round(2420 + Math.sin(time * 2) * 80)}`,
    906,
    288,
    9.5,
    blue,
    700,
  );

  // Deploy button inside mockup
  rect(892, 312, 106, 36, blue, 5);
  drawText("Deploy now", 912, 335, 11, "#ffffff", 600);

  // Smooth parametric mouse pointer animation
  const curCycle = (time * 0.22) % 1;
  let curX = 1080;
  let curY = 400;
  let clickRadius = 0;
  let clickAlpha = 0;

  if (curCycle < 0.38) {
    // Glide to Deploy button
    const t = curCycle / 0.38;
    const ease = t * t * (3 - 2 * t);
    curX = 1080 + (945 - 1080) * ease;
    curY = 400 + (330 - 400) * ease;
  } else if (curCycle < 0.5) {
    // Click on Deploy button with expanding ripple
    curX = 945;
    curY = 330;
    const clickT = (curCycle - 0.38) / 0.12;
    clickRadius = clickT * 28;
    clickAlpha = 1 - clickT;
  } else if (curCycle < 0.76) {
    // Glide across to media card
    const t = (curCycle - 0.5) / 0.26;
    const ease = t * t * (3 - 2 * t);
    curX = 945 + (804 - 945) * ease;
    curY = 330 + (285 - 330) * ease;
  } else if (curCycle < 0.86) {
    // Hover on media card with gentle ripple
    curX = 804;
    curY = 285;
    const clickT = (curCycle - 0.76) / 0.1;
    clickRadius = clickT * 20;
    clickAlpha = (1 - clickT) * 0.7;
  } else {
    // Glide back to home position
    const t = (curCycle - 0.86) / 0.14;
    const ease = t * t * (3 - 2 * t);
    curX = 804 + (1080 - 804) * ease;
    curY = 285 + (400 - 285) * ease;
  }

  // Draw click ripple if active
  if (clickRadius > 0 && clickAlpha > 0) {
    ctx.beginPath();
    ctx.arc(curX, curY, clickRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(37, 99, 235, ${clickAlpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw razor-sharp vector mouse pointer
  ctx.save();
  ctx.translate(curX, curY);
  ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 17);
  ctx.lineTo(4.8, 12.8);
  ctx.lineTo(9.6, 22.4);
  ctx.lineTo(12.8, 20.8);
  ctx.lineTo(8, 11.2);
  ctx.lineTo(14.4, 11.2);
  ctx.closePath();
  ctx.fillStyle = "#0f172a";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();

  // Bottom Category Tabs with auto-progress fill
  rect(56, 480, 1086, 1, "#e2e8f0");
  const catCycle = (time * 0.28) % 4;
  const activeCat = Math.floor(catCycle);
  const catProgress = catCycle % 1;

  ["Strategy", "Design", "Technology", "Growth"].forEach((label, i) => {
    const x = 58 + i * 272;
    const isCatActive = i === activeCat;
    drawText(
      label,
      x,
      524,
      15,
      isCatActive ? ink : muted,
      isCatActive ? 650 : 500,
    );

    // Track
    rect(x, 548, 210, 4, "#e2e8f0", 2);
    if (isCatActive) {
      rect(x, 548, Math.max(12, 210 * catProgress), 4, blue, 2);
      drawText(
        `${Math.round(catProgress * 100)}%`,
        x + 178,
        524,
        12,
        blue,
        700,
      );
    }
  });
}

function drawIdentityModule(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  const ink = "#0f172a";
  const muted = "#64748b";
  const blue = "#2563eb";

  const rect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    radius = 0,
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (radius > 0) {
      drawRoundedRect(ctx, x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.fill();
  };

  const drawText = (
    val: string,
    x: number,
    y: number,
    size: number,
    color: string,
    weight: number | string = 500,
    mono = false,
  ) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${mono ? MONO_FONT : UI_FONT}`;
    ctx.fillText(val, x, y);
  };

  // Base card surface
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);

  drawText("BRAND SYSTEM", 36, 48, 20, ink, 750);
  drawText("IDENTITY SYSTEM", 36, 92, 11, muted, 700);

  // Top-right live token badge
  rect(608, 28, 156, 26, "rgba(16, 185, 129, 0.12)", 13);
  ctx.beginPath();
  ctx.arc(624, 41, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#10b981";
  ctx.fill();
  drawText("DESIGN TOKENS v3.4", 636, 45, 9.5, "#059669", 700);

  drawText("A clear voice,", 36, 144, 24, ink, 650);
  drawText("across every touchpoint", 36, 174, 24, ink, 650);
  rect(36, 198, 728, 1, "#e2e8f0");

  // 4 Color Swatches
  const swatches = [
    { name: "Cobalt Blue", hex: "#2563EB", bg: "#2563eb", x: 36, w: 164 },
    { name: "Pale Surface", hex: "#DFE6EE", bg: "#dfe6ee", x: 216, w: 164 },
    { name: "Warm Sand", hex: "#D1C4AE", bg: "#d1c4ae", x: 396, w: 164 },
    { name: "Obsidian Slate", hex: "#1E2430", bg: "#1e2430", x: 576, w: 188 },
  ];

  // Smoothly animated focus viewfinder gliding between swatches
  const cycle = (time * 0.38) % 4;
  const curIdx = Math.floor(cycle);
  const nextIdx = (curIdx + 1) % 4;
  const rawT = cycle % 1;
  const transT = rawT < 0.72 ? 0 : (rawT - 0.72) / 0.28;
  const easeT = transT * transT * (3 - 2 * transT);

  const focusX =
    swatches[curIdx].x + (swatches[nextIdx].x - swatches[curIdx].x) * easeT;
  const focusW =
    swatches[curIdx].w + (swatches[nextIdx].w - swatches[curIdx].w) * easeT;

  swatches.forEach((sw) => {
    rect(sw.x, 222, sw.w, 124, sw.bg, 6);
  });

  // Gliding Focus Viewfinder
  ctx.strokeStyle = blue;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  drawRoundedRect(ctx, focusX - 4, 218, focusW + 8, 132, 8);
  ctx.stroke();

  // Active checkmark badge
  rect(focusX + focusW - 24, 230, 16, 16, "#ffffff", 8);
  drawText("✓", focusX + focusW - 20, 242, 11, blue, 700);

  // Active Tooltip chip tracking viewfinder
  const activeHex = swatches[curIdx].hex;
  rect(focusX + 8, 356, focusW - 16, 22, "#0f172a", 4);
  drawText(`${activeHex} · ACTIVE`, focusX + 18, 371, 9.5, "#ffffff", 650);

  // Typography Section (Bottom half)
  const wght = Math.round(300 + (Math.sin(time * 1.8) * 0.5 + 0.5) * 500);
  ctx.fillStyle = ink;
  ctx.font = `${wght} 54px ${UI_FONT}`;
  ctx.fillText("Aa", 44, 442);

  // Slider track under Aa
  rect(144, 436, 110, 4, "#e2e8f0", 2);
  const sliderThumbX = 144 + ((wght - 300) / 500) * 110;
  rect(sliderThumbX - 5, 432, 10, 12, blue, 3);
  drawText(`wght: ${wght}`, 268, 441, 11, blue, 700);

  drawText("Montserrat / Variable", 144, 416, 16, ink, 650);
  drawText("KERNING: OPTICAL · TRACKING: -0.02EM", 144, 464, 11, muted, 600);

  // Contrast ratio pill
  rect(620, 424, 144, 26, "rgba(37, 99, 235, 0.08)", 13);
  drawText("AAA · 14.8:1 RATIO", 634, 441, 10, blue, 700);
}

function drawEngineeringModule(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  // Deep dark IDE background
  ctx.fillStyle = "#0c101c";
  ctx.fillRect(0, 0, w, h);

  const rect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    radius = 0,
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (radius > 0) {
      drawRoundedRect(ctx, x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.fill();
  };

  const drawText = (
    val: string,
    x: number,
    y: number,
    size: number,
    color: string,
    weight: number | string = 500,
    mono = true,
  ) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${mono ? MONO_FONT : UI_FONT}`;
    ctx.fillText(val, x, y);
  };

  // Window top bar
  rect(0, 0, w, 52, "#131929");
  rect(0, 51, w, 1, "#1e293b");

  // Window control dots with soft glow
  [
    { c: "#ef4444", x: 730 },
    { c: "#f59e0b", x: 748 },
    { c: "#10b981", x: 766 },
  ].forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, 26, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = dot.c;
    ctx.fill();
  });

  // Breathing green halo on terminal green dot
  const halo = 4.5 + (Math.sin(time * 3) * 0.5 + 0.5) * 4;
  ctx.beginPath();
  ctx.arc(766, 26, halo, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.45)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  drawText("/ product-platform.tsx", 30, 32, 13.5, "#e2e8f0", 600, false);
  drawText("TS 5.4 · main", 620, 32, 11, "#64748b", 500, false);

  // Realistic code typing engine
  const CODE_LINES = [
    {
      num: "01",
      tokens: [
        { t: "export", c: "#c084fc" },
        { t: " function", c: "#c084fc" },
        { t: " Experience", c: "#38bdf8" },
        { t: "() {", c: "#e2e8f0" },
      ],
    },
    {
      num: "02",
      tokens: [
        { t: "  const", c: "#c084fc" },
        { t: " signal", c: "#f8fafc" },
        { t: " = ", c: "#38bdf8" },
        { t: "useProductState", c: "#60a5fa" },
        { t: '("live");', c: "#34d399" },
      ],
    },
    {
      num: "03",
      tokens: [
        { t: "  const", c: "#c084fc" },
        { t: " motion", c: "#f8fafc" },
        { t: " = ", c: "#38bdf8" },
        { t: "useSystemMotion", c: "#60a5fa" },
        { t: "({ fps: 60 });", c: "#fbbf24" },
      ],
    },
    {
      num: "04",
      tokens: [{ t: "  return (", c: "#e2e8f0" }],
    },
    {
      num: "05",
      tokens: [
        { t: "    <", c: "#e2e8f0" },
        { t: "Canvas", c: "#38bdf8" },
        { t: " surface", c: "#a5b4fc" },
        { t: "={signal.active}>", c: "#e2e8f0" },
      ],
    },
    {
      num: "06",
      tokens: [
        { t: "      <", c: "#e2e8f0" },
        { t: "Pipeline", c: "#38bdf8" },
        { t: " deploy", c: "#a5b4fc" },
        { t: '="instant"', c: "#34d399" },
        { t: " />", c: "#e2e8f0" },
      ],
    },
    {
      num: "07",
      tokens: [
        { t: "    </", c: "#e2e8f0" },
        { t: "Canvas", c: "#38bdf8" },
        { t: ">", c: "#e2e8f0" },
      ],
    },
    {
      num: "08",
      tokens: [{ t: "  );", c: "#e2e8f0" }],
    },
    {
      num: "09",
      tokens: [{ t: "}", c: "#e2e8f0" }],
    },
  ];

  let totalChars = 0;
  CODE_LINES.forEach((line) => {
    line.tokens.forEach((tok) => {
      totalChars += tok.t.length;
    });
  });

  const cycleTime = 14;
  const localTime = time % cycleTime;
  const charsTyped = Math.min(totalChars, Math.floor(localTime * 24));

  let charsAccounted = 0;
  let caretX = 78;
  let caretY = 105;

  CODE_LINES.forEach((line, lineIdx) => {
    const y = 98 + lineIdx * 37;
    // Line number
    drawText(line.num, 30, y, 12.5, "#475569", 500);

    let curX = 78;
    line.tokens.forEach((tok) => {
      if (charsAccounted >= charsTyped) return;
      const rem = charsTyped - charsAccounted;
      const str = tok.t.slice(0, rem);
      drawText(str, curX, y, 15, tok.c, 500);
      charsAccounted += str.length;

      ctx.font = `500 15px ${MONO_FONT}`;
      const strWidth = ctx.measureText(str).width;
      curX += strWidth;

      if (charsAccounted >= charsTyped) {
        caretX = curX;
        caretY = y;
      }
    });
  });

  // Glowing Blinking Caret
  if (Math.floor(time * 3.5) % 2 === 0) {
    rect(caretX + 2, caretY - 14, 2.5, 17, "#38bdf8");
  }

  // Active line highlight
  rect(72, caretY - 17, 700, 22, "rgba(56, 189, 248, 0.04)");

  // Compilation toast when snippet completes
  if (localTime > 10) {
    rect(30, 424, 268, 26, "rgba(16, 185, 129, 0.15)", 4);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    drawRoundedRect(ctx, 30, 424, 268, 26, 4);
    ctx.stroke();
    drawText("✓ COMPILED IN 18MS · 0 ERRORS", 44, 441, 10.5, "#34d399", 700);
  }

  // Footer status bar
  rect(30, 464, 740, 1, "#1e293b");
  ctx.beginPath();
  ctx.arc(38, 498, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#34d399";
  ctx.fill();
  drawText("SYSTEMS ONLINE", 50, 502, 11, "#34d399", 700, false);
  drawText(
    "EDGE COMPUTE: 14ms · 60 FPS",
    340,
    502,
    10.5,
    "#64748b",
    500,
    false,
  );
  drawText(
    "BRANCH: main · 100% TESTED",
    600,
    502,
    10.5,
    "#94a3b8",
    600,
    false,
  );
}

function drawGrowthModule(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  // Dark dashboard background
  ctx.fillStyle = "#0c121e";
  ctx.fillRect(0, 0, w, h);

  const rect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    radius = 0,
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (radius > 0) {
      drawRoundedRect(ctx, x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.fill();
  };

  const drawText = (
    val: string,
    x: number,
    y: number,
    size: number,
    color: string,
    weight: number | string = 500,
    mono = false,
  ) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${mono ? MONO_FONT : UI_FONT}`;
    ctx.fillText(val, x, y);
  };

  drawText("GROWTH SIGNALS", 36, 46, 12, "#818cf8", 750);
  drawText("A clearer picture of progress", 36, 86, 21, "#f8fafc", 650);

  // Live telemetry badge
  rect(590, 34, 174, 26, "rgba(56, 189, 248, 0.12)", 13);
  ctx.beginPath();
  ctx.arc(606, 47, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#38bdf8";
  ctx.fill();
  drawText("TELEMETRY · LIVE", 618, 51, 9.5, "#38bdf8", 700);

  drawText("CHANNEL PERFORMANCE", 36, 136, 11, "#64748b", 600);

  // Chart Grid Lines
  [180, 250, 320].forEach((gridY) => {
    rect(36, gridY, 728, 1, "rgba(255, 255, 255, 0.05)");
  });

  // Animated curve points with organic sine wave undulation
  const BASE_POINTS: [number, number][] = [
    [40, 360],
    [115, 320],
    [190, 335],
    [265, 255],
    [340, 280],
    [415, 205],
    [490, 230],
    [565, 165],
    [640, 185],
    [750, 125],
  ];

  const points: [number, number][] = BASE_POINTS.map(([x, y], i) => [
    x,
    y + Math.sin(time * 2.2 + i * 0.85) * 8 + Math.cos(time * 1.3 + i * 0.4) * 4,
  ]);

  // Area fill under curve
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(750, 370);
  ctx.lineTo(40, 370);
  ctx.closePath();
  const areaGrad = ctx.createLinearGradient(0, 120, 0, 370);
  areaGrad.addColorStop(0, "rgba(56, 189, 248, 0.24)");
  areaGrad.addColorStop(1, "rgba(56, 189, 248, 0.0)");
  ctx.fillStyle = areaGrad;
  ctx.fill();

  // Primary Curve Stroke
  ctx.beginPath();
  points.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  const strokeGrad = ctx.createLinearGradient(40, 0, 750, 0);
  strokeGrad.addColorStop(0, "#6366f1");
  strokeGrad.addColorStop(0.5, "#38bdf8");
  strokeGrad.addColorStop(1, "#818cf8");
  ctx.strokeStyle = strokeGrad;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Draw node rings
  points.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#0c121e";
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Moving Scrubber & Dynamic Tooltip
  const scrubX = 50 + ((time * 70) % 680);
  let interpY = 250;
  for (let i = 0; i < points.length - 1; i++) {
    if (scrubX >= points[i][0] && scrubX <= points[i + 1][0]) {
      const segT =
        (scrubX - points[i][0]) / (points[i + 1][0] - points[i][0]);
      interpY = points[i][1] + (points[i + 1][1] - points[i][1]) * segT;
      break;
    }
  }

  // Vertical dashed scrubber
  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(scrubX, 110);
  ctx.lineTo(scrubX, 375);
  ctx.stroke();
  ctx.setLineDash([]);

  // Expanding ripple at curve intersection
  const ripR = ((time * 2.5) % 1) * 14;
  ctx.beginPath();
  ctx.arc(scrubX, interpY, ripR, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(56, 189, 248, ${1 - ripR / 14})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Tooltip pill above cursor
  const tooltipX = Math.min(Math.max(scrubX - 65, 40), 620);
  rect(tooltipX, interpY - 48, 140, 32, "#131b2e", 6);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  drawRoundedRect(ctx, tooltipX, interpY - 48, 140, 32, 6);
  ctx.stroke();
  const metricVal = Math.round(28 + Math.sin(time * 1.5) * 12);
  const arrVal = Math.round(145 + Math.sin(time * 0.9) * 35);
  drawText(
    `+${metricVal}% · $${arrVal}k ARR`,
    tooltipX + 14,
    interpY - 28,
    11,
    "#ffffff",
    650,
  );

  // Bottom Channels progress bars
  rect(36, 420, 728, 1, "#1e293b");

  const channels = [
    { label: "DISCOVERY", basePct: 0.76, x: 36, speed: 1.0 },
    { label: "ENGAGEMENT", basePct: 0.91, x: 280, speed: 0.8 },
    { label: "CONVERSION", basePct: 0.83, x: 524, speed: 1.3 },
  ];

  channels.forEach((ch) => {
    const pct = Math.min(
      0.99,
      ch.basePct + Math.sin(time * ch.speed) * 0.05,
    );
    drawText(ch.label, ch.x, 458, 11, "#94a3b8", 600);
    drawText(
      `${Math.round(pct * 100)}%`,
      ch.x + 196,
      458,
      11,
      "#38bdf8",
      700,
    );

    // Track
    rect(ch.x, 474, 230, 4, "#1e293b", 2);
    // Fill
    rect(ch.x, 474, 230 * pct, 4, "#38bdf8", 2);
  });
}

function useAnimatedUiTexture(id: ModuleId, reduced: boolean) {
  const controller = useMemo(() => {
    const canvas = document.createElement("canvas");
    // Crisp native dimensions matching mesh aspect ratios perfectly:
    // Product is ~650px on screen; 1200px provides almost 2x Retina clarity
    // Secondary cards are ~310px on screen; 800px provides 2.6x Retina clarity
    const width = id === "product" ? 1200 : 800;
    const height = id === "product" ? 764 : 540;

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    // CRITICAL: Disable mipmaps and use direct linear filtering to eliminate all blur!
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 8;

    let lastUpdate = -1;

    // Staggered update cadence & phase offsets so no two modules ever upload on the same frame
    const interval =
      id === "product"
        ? 0.033 // ~30 FPS for central studio preview
        : id === "growth"
          ? 0.040 // ~25 FPS for analytics chart
          : id === "engineering"
            ? 0.042 // ~24 FPS for code typing
            : 0.048; // ~21 FPS for brand system

    const phaseOffset =
      id === "product"
        ? 0
        : id === "identity"
          ? 0.012
          : id === "engineering"
            ? 0.024
            : 0.036;

    const render = (time: number) => {
      if (!context) return;
      if (id === "product") {
        drawProductModule(context, width, height, time);
      } else if (id === "identity") {
        drawIdentityModule(context, width, height, time);
      } else if (id === "engineering") {
        drawEngineeringModule(context, width, height, time);
      } else {
        drawGrowthModule(context, width, height, time);
      }
      texture.needsUpdate = true;
    };

    // Render initial static frame immediately
    render(0);

    const update = (time: number) => {
      // Direct render every frame for maximum fluid animation as requested
      render(time);
    };

    return {
      texture,
      update,
      dispose: () => {
        texture.dispose();
      },
    };
  }, [id, reduced]);

  useEffect(() => () => controller.dispose(), [controller]);

  return controller;
}

function InterfaceModule({
  config,
  reduced,
  theme,
}: {
  config: ModuleConfig;
  reduced: boolean;
  theme: Theme;
}) {
  const ref = useRef<THREE.Group>(null);
  const controller = useAnimatedUiTexture(config.id, reduced);
  const [selected, setSelected] = useState(false);
  const hover = useRef(false);
  const touchSelected = useRef(false);
  const copy = COPY[config.id];
  const depth = config.id === "product" ? 0.12 : 0.095;

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    const time = state.clock.elapsedTime;
    const reveal = THREE.MathUtils.smoothstep(time - config.delay, 0, 1.1);
    const scroll = THREE.MathUtils.clamp(scrollStore.hero, 0, 1);
    const dt = Math.min(delta, 0.05);

    // Subtle organic levitation physics
    const floatY = Math.sin(time * 1.4 + config.delay * 3) * 0.028;
    const floatRot = Math.cos(time * 1.1 + config.delay * 2) * 0.006;

    // Scroll-driven dimensional transition
    const isLead = config.id === "product";
    const xSpread = isLead
      ? -scroll * 0.14
      : config.position[0] > 0
        ? scroll * 0.38
        : -scroll * 0.35;
    const yRecede = -scroll * 0.45;
    const zDepth = isLead ? scroll * 0.32 : -scroll * 0.55;

    group.position.x =
      config.position[0] + config.formationOffset[0] * (1 - reveal) + xSpread;
    group.position.y =
      config.position[1] +
      config.formationOffset[1] * (1 - reveal) +
      floatY +
      yRecede;
    group.position.z =
      config.position[2] + config.formationOffset[2] * (1 - reveal) + zDepth;

    group.rotation.x =
      config.rotation[0] +
      (hover.current ? -0.03 : 0) +
      floatRot -
      scroll * 0.1;
    group.rotation.y =
      config.rotation[1] +
      state.pointer.x * (reduced ? 0 : 0.022) +
      (isLead ? scroll * 0.06 : -scroll * 0.05);
    group.rotation.z =
      config.rotation[2] + (hover.current ? 0.015 : 0) + floatRot * 0.5;

    // Update continuous procedural living UI texture
    controller.update(time);

    const scale =
      (0.92 + reveal * 0.08) *
      (hover.current ? 1.025 : 1) *
      (1 - scroll * 0.03);
    const nextScale = THREE.MathUtils.damp(group.scale.x, scale, 5, dt);
    group.scale.setScalar(nextScale);
  });

  return (
    <group
      ref={ref}
      position={config.position}
      rotation={config.rotation}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (event.nativeEvent.pointerType === "touch") return;
        hover.current = true;
        setSelected(true);
      }}
      onPointerOut={() => {
        if (touchSelected.current) return;
        hover.current = false;
        setSelected(false);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (event.nativeEvent.pointerType === "touch") {
          touchSelected.current = !touchSelected.current;
          hover.current = touchSelected.current;
          setSelected(touchSelected.current);
        }
      }}
    >
      <RoundedBox
        args={[config.width, config.height, depth]}
        radius={0.05}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={
            config.id === "product"
              ? theme === "light"
                ? "#d6dde8"
                : "#182030"
              : theme === "light"
                ? "#8c99ad"
                : "#121724"
          }
          metalness={0.65}
          roughness={0.24}
          clearcoat={0.95}
          clearcoatRoughness={0.12}
          reflectivity={0.9}
          envMapIntensity={theme === "light" ? 1.5 : 1.3}
        />
      </RoundedBox>
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[config.width - 0.065, config.height - 0.065]} />
        <meshBasicMaterial map={controller.texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -depth / 2 - 0.012]}>
        <boxGeometry
          args={[config.width - 0.08, config.height - 0.08, 0.012]}
        />
        <meshStandardMaterial
          color="#080b12"
          metalness={0.65}
          roughness={0.26}
        />
      </mesh>
      {selected && (
        <Html
          position={[0, -config.height / 2 - 0.13, depth / 2]}
          center
          distanceFactor={8}
        >
          <span className="hero-module-detail">
            {copy.label} · {copy.title}
          </span>
        </Html>
      )}
    </group>
  );
}

function FloatingAtmosphere({
  reduced,
  theme,
}: {
  reduced: boolean;
  theme: Theme;
}) {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const list: {
      position: [number, number, number];
      scale: number;
      speed: number;
      offset: number;
      isTorus: boolean;
    }[] = [];
    const seed = [
      [-2.6, 1.8, 0.8],
      [-1.9, -1.3, 0.6],
      [2.3, 2.5, -1.2],
      [4.7, 0.3, 0.1],
      [0.3, 2.7, -0.5],
      [-3.3, 0.3, -1.0],
      [4.2, -2.2, 0.4],
      [-0.5, -2.1, 1.2],
      [2.7, -1.7, -0.3],
      [-2.7, 2.5, -0.6],
    ];
    seed.forEach((pos, i) => {
      list.push({
        position: pos as [number, number, number],
        scale: 0.09 + (i % 3) * 0.035,
        speed: 0.3 + (i % 4) * 0.12,
        offset: i * 0.65,
        isTorus: i % 2 === 0,
      });
    });
    return list;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    const scroll = THREE.MathUtils.clamp(scrollStore.hero, 0, 1);
    group.current.children.forEach((child, i) => {
      const it = items[i];
      if (!it) return;
      child.position.y =
        it.position[1] +
        Math.sin(time * it.speed + it.offset) * 0.12 -
        scroll * 0.6;
      child.rotation.x = time * 0.2 + it.offset;
      child.rotation.y = time * 0.3 + it.offset;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.position} scale={it.scale}>
          {it.isTorus ? (
            <torusGeometry args={[0.42, 0.07, 10, 20]} />
          ) : (
            <octahedronGeometry args={[0.46, 0]} />
          )}
          <meshPhysicalMaterial
            color={theme === "light" ? "#2547f0" : "#6f8dff"}
            metalness={0.6}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={theme === "light" ? 0.3 : 0.4}
            transmission={0.35}
            thickness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function Connector({
  from,
  to,
  index,
  reduced,
  theme,
}: {
  from: [number, number, number];
  to: [number, number, number];
  index: number;
  reduced: boolean;
  theme: Theme;
}) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const bend = start.clone().lerp(end, 0.5);
    bend.z += 0.16;
    return new THREE.CatmullRomCurve3([start, bend, end]);
  }, [from, to]);
  const tube = useMemo(
    () => new THREE.TubeGeometry(curve, 36, 0.008, 6, false),
    [curve],
  );
  const pulse = useMemo(
    () =>
      new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 10, 8),
        new THREE.MeshBasicMaterial({ color: "#a5b8ff" }),
      ),
    [],
  );

  useEffect(
    () => () => {
      tube.dispose();
      pulse.geometry.dispose();
      (pulse.material as THREE.Material).dispose();
    },
    [pulse, tube],
  );

  useFrame((state) => {
    const reveal = reduced
      ? 1
      : THREE.MathUtils.smoothstep(state.clock.elapsedTime - 0.5, 0, 1.05);
    const phase = (state.clock.elapsedTime * 0.12 + index * 0.28) % 1;
    pulse.position.copy(curve.getPointAt(phase));
    pulse.scale.setScalar(reduced ? 0 : reveal);
  });

  return (
    <group>
      <mesh geometry={tube}>
        <meshStandardMaterial
          color={theme === "light" ? "#385cf4" : "#7083bd"}
          metalness={0.5}
          roughness={0.42}
          transparent
          opacity={0.4}
        />
      </mesh>
      <primitive object={pulse} />
    </group>
  );
}

function CameraRig({
  reduced,
  compact,
}: {
  reduced: boolean;
  compact: boolean;
}) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, delta) => {
    const { camera } = state;
    const dt = Math.min(delta, 0.05);
    const scroll = THREE.MathUtils.clamp(scrollStore.hero, 0, 1);
    const intro = reduced
      ? 1
      : THREE.MathUtils.smoothstep(state.clock.elapsedTime, 0, 1.4);
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    const vel = THREE.MathUtils.clamp(
      (scrollStore.velocity || 0) * 0.00008,
      -0.2,
      0.2,
    );

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      1.14 + px * 0.2 + scroll * 0.28,
      2.1,
      dt,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.14 + py * 0.14 - scroll * 0.38 + vel,
      2.1,
      dt,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      (compact ? 13.1 : 8.35) - intro * (compact ? 0.45 : 0.58) - scroll * 0.95,
      1.8,
      dt,
    );
    target.set(
      (compact ? 0.78 : 1.08) + px * 0.09 + scroll * 0.32,
      0.08 + py * 0.04 - scroll * 0.4,
      -0.12 - scroll * 0.45,
    );
    camera.lookAt(target);
  });
  return null;
}

function Scene({
  quality,
  reduced,
  theme,
  onReady,
}: {
  quality: Quality;
  reduced: boolean;
  theme: Theme;
  onReady: () => void;
}) {
  useEffect(() => onReady(), [onReady]);

  const product = MODULES[0];
  const routes = MODULES.slice(1).map((module) => ({
    from: [
      product.position[0],
      product.position[1],
      product.position[2] - 0.1,
    ] as [number, number, number],
    to: [module.position[0], module.position[1], module.position[2] - 0.04] as [
      number,
      number,
      number,
    ],
  }));

  return (
    <>
      <color
        attach="background"
        args={[theme === "light" ? "#ffffff" : "#080a10"]}
      />
      <fog
        attach="fog"
        args={[theme === "light" ? "#ffffff" : "#080a10", 13, 30]}
      />
      <ambientLight
        intensity={theme === "light" ? 0.7 : 0.4}
        color={theme === "light" ? "#ffffff" : "#b5bed4"}
      />
      <directionalLight
        position={[-3, 5, 6]}
        intensity={theme === "light" ? 2.7 : 2.3}
        color={theme === "light" ? "#ffffff" : "#eef2ff"}
        castShadow={quality.shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={24}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[5, -1, 3]}
        intensity={theme === "light" ? 1.05 : 0.78}
        color={theme === "light" ? "#385cf4" : "#91a9ff"}
      />
      <Environment resolution={quality.envResolution} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.1}
          color="#f5f6fb"
          position={[-4, 4, 4]}
          scale={[7, 4, 1]}
          target={[1, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#506bc5"
          position={[5, 1, -2]}
          scale={[5, 6, 1]}
          target={[1, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.25}
          color="#b9c8ff"
          position={[0, -4, 2]}
          scale={[6, 3, 1]}
          target={[1, 0, 0]}
        />
      </Environment>

      <group scale={quality.tier === "low" ? 0.68 : 1}>
        <FloatingAtmosphere reduced={reduced} theme={theme} />
        {routes.map((route, index) => (
          <Connector
            key={index}
            {...route}
            index={index}
            reduced={reduced}
            theme={theme}
          />
        ))}
        {MODULES.map((config) => (
          <InterfaceModule
            key={config.id}
            config={config}
            reduced={reduced}
            theme={theme}
          />
        ))}
        {quality.shadows && (
          <ContactShadows
            frames={1}
            position={[1.1, -2.1, -0.8]}
            opacity={0.3}
            scale={8}
            blur={2.8}
            far={5}
            resolution={256}
            color="#03050a"
          />
        )}
      </group>
      <CameraRig reduced={reduced} compact={quality.tier === "low"} />
    </>
  );
}

export default function HeroScene({
  active: _active = true,
  onReady,
}: {
  active?: boolean;
  onReady: () => void;
}) {
  const quality = useMemo(() => getQuality(), []);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getTheme,
    getServerTheme,
  );

  return (
    <Canvas
      className="hero-canvas"
      dpr={quality.dpr}
      shadows={quality.shadows}
      frameloop="always"
      gl={{
        antialias: quality.antialias,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{
        position: [
          quality.tier === "low" ? 0.78 : 1.14,
          0.14,
          quality.tier === "low" ? 13.1 : 8.35,
        ],
        fov: 39,
        near: 0.1,
        far: 45,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.04;
      }}
    >
      <Suspense fallback={null}>
        <Scene
          quality={quality}
          reduced={reduced}
          theme={theme}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}
