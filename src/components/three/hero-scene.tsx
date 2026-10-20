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
      tier: "medium",
      dpr: [1, 1.5],
      antialias: true,
      envResolution: 128,
      shadows: false,
    };
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const compact = window.innerWidth < 720;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (compact || cores <= 4 || memory <= 4)
    return {
      tier: "low",
      dpr: [1, 1.2],
      antialias: false,
      envResolution: 64,
      shadows: false,
    };
  if (coarse || window.innerWidth < 1280 || cores <= 8)
    return {
      tier: "medium",
      dpr: [1, 1.5],
      antialias: true,
      envResolution: 128,
      shadows: false,
    };
  return {
    tier: "high",
    dpr: [1, 1.8],
    antialias: true,
    envResolution: 256,
    shadows: true,
  };
}

function makeUiTexture(id: ModuleId) {
  const canvas = document.createElement("canvas");
  const pixelRatio = 2;
  const width = id === "product" ? 1200 : 800;
  const height = id === "product" ? 760 : 540;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  context.scale(pixelRatio, pixelRatio);
  const w = width;
  const h = height;
  const blue = "#385cf4";
  const ink = "#171b24";
  const muted = "#78818f";
  const fontFamily = getComputedStyle(document.body).fontFamily;
  const light = id === "product" || id === "identity";
  context.fillStyle = light ? "#f3f5f7" : "#111722";
  context.fillRect(0, 0, w, h);
  const drawText = (
    value: string,
    x: number,
    y: number,
    size: number,
    color: string,
    weight = 500,
  ) => {
    context.fillStyle = color;
    context.font = `${weight} ${size}px ${fontFamily}`;
    context.fillText(value, x, y);
  };
  const rect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    radius = 0,
  ) => {
    context.fillStyle = color;
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.fill();
  };

  if (id === "product") {
    rect(0, 0, w, 72, "#ffffff");
    drawText("DIGITAL / STUDIO", 40, 44, 18, ink, 700);
    drawText("Work     Studio     Journal", 768, 43, 14, muted);
    rect(1050, 19, 110, 36, blue, 18);
    drawText("Let's talk", 1072, 42, 12, "#ffffff", 650);
    rect(46, 112, 1108, 1, "#dce0e6");
    drawText("DIGITAL PRODUCT STUDIO", 56, 178, 13, blue, 700);
    drawText("Make space for", 54, 256, 54, ink, 650);
    drawText("what comes next.", 54, 319, 54, ink, 650);
    drawText(
      "A thoughtful digital home for ambitious ideas.",
      58,
      360,
      18,
      muted,
    );
    rect(58, 395, 134, 42, blue, 4);
    drawText("Explore the work", 72, 421, 13, "#ffffff", 600);
    rect(714, 151, 424, 274, "#dce4ef", 5);
    rect(745, 178, 362, 220, "#eef2f5", 3);
    rect(766, 200, 128, 172, "#c7d1df", 2);
    rect(909, 200, 176, 10, "#8999ad", 5);
    rect(909, 226, 145, 7, "#b8c2cf", 4);
    rect(909, 248, 161, 7, "#b8c2cf", 4);
    rect(909, 295, 82, 40, blue, 3);
    rect(56, 474, 1086, 1, "#dce0e6");
    ["Strategy", "Design", "Technology", "Growth"].forEach((label, i) => {
      const x = 58 + i * 272;
      drawText(label, x, 520, 15, ink, 600);
      rect(x, 545, 210, 5, "#dfe3e8", 3);
    });
  } else if (id === "identity") {
    drawText("BRAND SYSTEM", 36, 49, 20, ink, 700);
    drawText("IDENTITY SYSTEM", 36, 94, 12, muted, 700);
    drawText("A clear voice,", 36, 151, 24, ink, 600);
    drawText("across every touchpoint", 36, 181, 24, ink, 600);
    rect(36, 207, 728, 1, "#d7dce4");
    rect(36, 232, 164, 124, blue, 3);
    rect(216, 232, 164, 124, "#dfe6ee", 3);
    rect(396, 232, 164, 124, "#d1c4ae", 3);
    rect(576, 232, 188, 124, "#222833", 3);
    drawText("Aa", 44, 427, 46, ink, 500);
    drawText("Montserrat / Variable", 151, 414, 16, ink, 600);
    drawText("TYPE, COLOR, MOTION", 151, 442, 11, muted, 600);
  } else if (id === "engineering") {
    rect(0, 0, w, 56, "#1b2431");
    drawText("/ product-platform", 30, 36, 15, "#eef1f6", 600);
    ["#e06d66", "#dfb663", "#64b88e"].forEach((color, i) => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(742 + i * 18, 28, 5, 0, Math.PI * 2);
      context.fill();
    });
    [
      "export function Experience() {",
      "  const signal = useProductState();",
      "  return (",
      "    <System surface={signal.surface}",
      '      motion="measured" />',
      "  );",
      "}",
    ].forEach((line, i) => {
      drawText(String(i + 1).padStart(2, "0"), 30, 105 + i * 43, 13, "#657286");
      drawText(
        line,
        78,
        105 + i * 43,
        17,
        i === 0 ? "#83a4ff" : "#d5dbe5",
        500,
      );
    });
    rect(30, 438, 740, 1, "#2b3543");
    drawText("SYSTEMS ONLINE", 32, 480, 12, "#7dcaa9", 700);
    drawText("SOFTWARE SYSTEMS", 620, 480, 12, "#8c98a8");
  } else {
    drawText("GROWTH SIGNALS", 34, 47, 13, "#9db1ff", 700);
    drawText("A clearer picture of progress", 34, 89, 21, "#edf1f8", 600);
    drawText("CHANNEL PERFORMANCE", 36, 139, 11, "#8a95a7", 600);
    const points: [number, number][] = [
      [40, 370],
      [110, 326],
      [185, 340],
      [260, 264],
      [335, 290],
      [410, 220],
      [485, 245],
      [560, 180],
      [635, 200],
      [760, 145],
    ];
    context.strokeStyle = "#7794ff";
    context.lineWidth = 4;
    context.beginPath();
    points.forEach(([x, y], i) =>
      i ? context.lineTo(x, y) : context.moveTo(x, y),
    );
    context.stroke();
    points.forEach(([x, y]) => {
      context.beginPath();
      context.arc(x, y, 6, 0, Math.PI * 2);
      context.fillStyle = "#111722";
      context.fill();
      context.strokeStyle = "#a9bcff";
      context.lineWidth = 2;
      context.stroke();
    });
    rect(34, 424, 732, 1, "#303b4a");
    ["DISCOVERY", "ENGAGEMENT", "CONVERSION"].forEach((label, i) =>
      drawText(label, 36 + i * 254, 468, 11, "#8a95a7", 600),
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

function useUiTexture(id: ModuleId) {
  const texture = useMemo(() => makeUiTexture(id), [id]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function InterfaceModule({
  config,
  reduced,
}: {
  config: ModuleConfig;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const texture = useUiTexture(config.id);
  const [selected, setSelected] = useState(false);
  const hover = useRef(false);
  const touchSelected = useRef(false);
  const copy = COPY[config.id];
  const depth = config.id === "product" ? 0.12 : 0.095;

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    const time = state.clock.elapsedTime;
    const reveal = reduced
      ? 1
      : THREE.MathUtils.smoothstep(time - config.delay, 0, 1.1);
    const scroll = THREE.MathUtils.clamp(scrollStore.hero, 0, 1);
    const dt = Math.min(delta, 0.05);
    group.position.x =
      config.position[0] +
      config.formationOffset[0] * (1 - reveal) -
      scroll * config.position[0] * 0.035;
    group.position.y =
      config.position[1] + config.formationOffset[1] * (1 - reveal);
    group.position.z =
      config.position[2] +
      config.formationOffset[2] * (1 - reveal) +
      scroll * 0.16;
    group.rotation.x = config.rotation[0] + (hover.current ? -0.025 : 0);
    group.rotation.y =
      config.rotation[1] + state.pointer.x * (reduced ? 0 : 0.018);
    group.rotation.z = config.rotation[2] + (hover.current ? 0.014 : 0);
    const scale =
      (0.92 + reveal * 0.08) *
      (hover.current ? 1.025 : 1) *
      (1 - scroll * 0.02);
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
          color={config.id === "product" ? "#d3d9e3" : "#8792a4"}
          metalness={0.5}
          roughness={0.32}
          clearcoat={0.42}
          clearcoatRoughness={0.24}
          envMapIntensity={1.3}
        />
      </RoundedBox>
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[config.width - 0.065, config.height - 0.065]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.025}
        />
      </mesh>
      <mesh position={[0, 0, -depth / 2 - 0.012]}>
        <boxGeometry
          args={[config.width - 0.08, config.height - 0.08, 0.012]}
        />
        <meshStandardMaterial
          color="#080b12"
          metalness={0.62}
          roughness={0.28}
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
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      1.14 + px * 0.18 + scroll * 0.16,
      2.1,
      dt,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.14 + py * 0.12 + scroll * 0.08,
      2.1,
      dt,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      (compact ? 13.1 : 8.35) - intro * (compact ? 0.45 : 0.58) - scroll * 0.55,
      1.8,
      dt,
    );
    target.set(
      (compact ? 0.78 : 1.08) + px * 0.08 + scroll * 0.22,
      0.08 + py * 0.04,
      -0.12 - scroll * 0.22,
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
          <InterfaceModule key={config.id} config={config} reduced={reduced} />
        ))}
        {quality.shadows && (
          <ContactShadows
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
  active = true,
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
      frameloop={active && !reduced ? "always" : "demand"}
      gl={{
        antialias: quality.antialias,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      performance={{ min: 0.65 }}
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
