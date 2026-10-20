"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  PointMaterial,
  Points,
} from "@react-three/drei";
import * as THREE from "three";

import { scrollStore } from "@/lib/scroll";

const OBSIDIAN = "#05070f";
const TITANIUM = "#c7d0e3";
const TITANIUM_DARK = "#6d768a";
const COBALT = "#2547f0";
const COBALT_LIGHT = "#8dabff";
const CYAN = "#3dd7ec";
const ICE = "#dbe7ff";

type Quality = {
  tier: "high" | "medium" | "low";
  dpr: [number, number];
  antialias: boolean;
  particles: number;
  envResolution: number;
  shadows: boolean;
  glass: boolean;
  signalPoints: number;
};

type RibbonConfig = {
  key: string;
  points: Array<[number, number, number]>;
  radius: number;
  color: string;
  rotation: readonly [number, number, number];
  position: readonly [number, number, number];
  introLift: number;
  pointer: readonly [number, number];
  scrollOffset: readonly [number, number, number];
  scrollRotation: readonly [number, number];
  speed: number;
  roughness: number;
  signalColor: string;
};

type FinConfig = {
  key: string;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: readonly [number, number, number];
  drift: number;
};

type BraceConfig = {
  key: string;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: readonly [number, number, number];
};

const RIBBONS: RibbonConfig[] = [
  {
    key: "spine",
    points: [
      [-2.2, -1.25, 0.25],
      [-1.32, -0.62, 1.1],
      [-0.3, 0.42, 1.5],
      [0.62, 1.55, 0.92],
      [1.5, 1.86, -0.22],
      [2.32, 0.64, -1.1],
      [1.08, -0.68, -1.58],
      [-0.52, -1.28, -0.9],
    ],
    radius: 0.105,
    color: TITANIUM,
    rotation: [0.16, -0.42, 0.28],
    position: [0.2, 0.06, 0],
    introLift: 1.35,
    pointer: [0.18, 0.14],
    scrollOffset: [0.95, 0.3, -0.4],
    scrollRotation: [0.35, 0.55],
    speed: 0.18,
    roughness: 0.2,
    signalColor: COBALT_LIGHT,
  },
  {
    key: "veil",
    points: [
      [-1.68, 1.62, -0.82],
      [-0.56, 1.08, -1.4],
      [0.92, 0.22, -1.18],
      [1.86, -0.82, -0.18],
      [1.24, -1.66, 0.98],
      [-0.16, -1.22, 1.56],
      [-1.62, -0.12, 1.02],
      [-2.1, 0.88, 0.08],
    ],
    radius: 0.08,
    color: "#8d98ae",
    rotation: [-0.34, 0.58, -0.46],
    position: [0.3, -0.08, 0.06],
    introLift: 1.5,
    pointer: [0.16, 0.1],
    scrollOffset: [-0.42, 0.44, -0.72],
    scrollRotation: [-0.52, 0.32],
    speed: -0.14,
    roughness: 0.28,
    signalColor: CYAN,
  },
  {
    key: "bridge",
    points: [
      [-1.52, -1.56, -0.16],
      [-0.88, -0.7, -0.92],
      [0.24, -0.14, -1.34],
      [1.54, 0.28, -0.62],
      [2.08, 1.14, 0.52],
      [1.16, 1.52, 1.36],
      [-0.18, 1.08, 1.2],
      [-1.48, 0.12, 0.46],
    ],
    radius: 0.056,
    color: TITANIUM_DARK,
    rotation: [0.22, -0.08, 0.86],
    position: [0.06, 0.14, -0.24],
    introLift: 1.1,
    pointer: [0.12, 0.12],
    scrollOffset: [0.48, -0.42, -0.2],
    scrollRotation: [0.42, -0.38],
    speed: 0.22,
    roughness: 0.34,
    signalColor: COBALT,
  },
];

const FINS: FinConfig[] = [
  {
    key: "north",
    position: [0.44, 0.92, -0.16],
    rotation: [0.38, -0.42, 0.26],
    scale: [0.96, 1.14, 0.9],
    drift: 0.46,
  },
  {
    key: "south",
    position: [-0.72, -0.48, 0.34],
    rotation: [-0.28, 0.82, -0.74],
    scale: [0.88, 1.02, 0.86],
    drift: 0.72,
  },
  {
    key: "east",
    position: [0.98, -0.06, 0.72],
    rotation: [0.12, 0.24, 0.96],
    scale: [0.74, 0.9, 0.72],
    drift: 0.58,
  },
];

const BRACES: BraceConfig[] = [
  {
    key: "brace-a",
    position: [0.28, 0.24, 0.74],
    rotation: [0.38, 0.18, 0.82],
    scale: [1, 1.1, 1],
  },
  {
    key: "brace-b",
    position: [-0.62, -0.12, -0.28],
    rotation: [-0.42, 0.96, -0.38],
    scale: [0.9, 0.96, 0.9],
  },
  {
    key: "brace-c",
    position: [0.06, -0.76, 0.08],
    rotation: [1.18, 0.34, 0.14],
    scale: [0.82, 0.88, 0.82],
  },
];

function detectQuality(): Quality {
  if (typeof window === "undefined") {
    return {
      tier: "medium",
      dpr: [1, 1.5],
      antialias: true,
      particles: 180,
      envResolution: 128,
      shadows: false,
      glass: true,
      signalPoints: 6,
    };
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const deviceMemory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const width = window.innerWidth;

  if (width < 720 || cores <= 4 || deviceMemory <= 4) {
    return {
      tier: "low",
      dpr: [1, 1.25],
      antialias: false,
      particles: 48,
      envResolution: 64,
      shadows: false,
      glass: false,
      signalPoints: 3,
    };
  }

  if (coarse || width < 1280 || cores <= 8) {
    return {
      tier: "medium",
      dpr: [1, 1.5],
      antialias: true,
      particles: 140,
      envResolution: 128,
      shadows: false,
      glass: true,
      signalPoints: 5,
    };
  }

  return {
    tier: "high",
    dpr: [1, 1.9],
    antialias: true,
    particles: 300,
    envResolution: 256,
    shadows: true,
    glass: true,
    signalPoints: 8,
  };
}

function createRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function getIntroProgress(reduced: boolean, elapsedTime: number) {
  if (reduced) return 1;
  return easeOutCubic(Math.min(elapsedTime / 2.2, 1));
}

function makeCurve(points: RibbonConfig["points"]) {
  return new THREE.CatmullRomCurve3(
    points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "centripetal",
    0.55,
  );
}

function makeFinGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -1.08);
  shape.bezierCurveTo(0.52, -0.8, 0.74, -0.22, 0.5, 0.34);
  shape.bezierCurveTo(0.3, 0.86, 0.12, 1.16, 0, 1.28);
  shape.bezierCurveTo(-0.18, 1.02, -0.54, 0.4, -0.62, -0.18);
  shape.bezierCurveTo(-0.72, -0.68, -0.32, -1, 0, -1.08);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: false,
    curveSegments: 28,
    steps: 1,
  });
  geometry.center();
  return geometry;
}

function makeLatheGeometry() {
  const profile = [
    new THREE.Vector2(0.06, -1.1),
    new THREE.Vector2(0.3, -0.92),
    new THREE.Vector2(0.52, -0.4),
    new THREE.Vector2(0.56, 0.08),
    new THREE.Vector2(0.34, 0.78),
    new THREE.Vector2(0.1, 1.08),
  ];
  return new THREE.LatheGeometry(profile, 48);
}

function SignalTrail({
  curve,
  count,
  color,
  speed,
  reduced,
}: {
  curve: THREE.CatmullRomCurve3;
  count: number;
  color: string;
  speed: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.SphereGeometry(0.032, 10, 10), []);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;

    const intro = getIntroProgress(reduced, state.clock.elapsedTime);
    const travel = state.clock.elapsedTime * speed * (reduced ? 0.08 : 0.18);

    for (let index = 0; index < count; index += 1) {
      const offset = (((travel - index * 0.07) % 1) + 1) % 1;
      const point = curve.getPointAt(offset);
      const scale = Math.max((count - index) / count, 0.12) * intro;
      dummy.position.copy(point);
      dummy.scale.setScalar(scale * 0.8);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        metalness={0.25}
        roughness={0.2}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function RibbonBand({
  config,
  quality,
  reduced,
}: {
  config: RibbonConfig;
  quality: Quality;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const curve = useMemo(() => makeCurve(config.points), [config.points]);
  const segments =
    quality.tier === "high" ? 240 : quality.tier === "medium" ? 180 : 132;
  const radialSegments = quality.tier === "high" ? 18 : 12;
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        curve,
        segments,
        config.radius,
        radialSegments,
        false,
      ),
    [config.radius, curve, radialSegments, segments],
  );
  const channelGeometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        curve,
        Math.floor(segments * 0.72),
        config.radius * 0.18,
        8,
        false,
      ),
    [config.radius, curve, segments],
  );

  useFrame((state, delta) => {
    const mesh = group.current;
    if (!mesh) return;

    const dt = Math.min(delta, 0.05);
    const intro = getIntroProgress(reduced, state.clock.elapsedTime);
    const scroll = scrollStore.hero;
    const drift = reduced
      ? 0
      : Math.sin(state.clock.elapsedTime * config.speed) * 0.06;
    const offset = 1 - intro;

    mesh.position.x = THREE.MathUtils.damp(
      mesh.position.x,
      config.position[0] + scroll * config.scrollOffset[0],
      2.2,
      dt,
    );
    mesh.position.y = THREE.MathUtils.damp(
      mesh.position.y,
      config.position[1] +
        drift +
        scroll * config.scrollOffset[1] +
        offset * config.introLift,
      2.4,
      dt,
    );
    mesh.position.z = THREE.MathUtils.damp(
      mesh.position.z,
      config.position[2] + scroll * config.scrollOffset[2],
      2.2,
      dt,
    );

    mesh.rotation.x = THREE.MathUtils.damp(
      mesh.rotation.x,
      config.rotation[0] +
        state.pointer.y * config.pointer[1] +
        scroll * config.scrollRotation[0],
      2.2,
      dt,
    );
    mesh.rotation.y = THREE.MathUtils.damp(
      mesh.rotation.y,
      config.rotation[1] +
        state.pointer.x * config.pointer[0] +
        scroll * config.scrollRotation[1],
      2.2,
      dt,
    );
    mesh.rotation.z = THREE.MathUtils.damp(
      mesh.rotation.z,
      config.rotation[2] + drift * 0.45,
      2.4,
      dt,
    );

    const scale = 0.84 + intro * 0.16 - scroll * 0.05;
    mesh.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={config.color}
          metalness={1}
          roughness={config.roughness}
          clearcoat={0.8}
          clearcoatRoughness={0.16}
          envMapIntensity={2.3}
        />
      </mesh>
      <mesh geometry={channelGeometry}>
        <meshStandardMaterial
          color="#0a0f1e"
          emissive={config.signalColor}
          emissiveIntensity={0.35}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {quality.signalPoints > 0 && (
        <SignalTrail
          color={config.signalColor}
          count={quality.signalPoints}
          curve={curve}
          reduced={reduced}
          speed={Math.abs(config.speed) + 0.2}
        />
      )}
    </group>
  );
}

function GlassFin({
  config,
  geometry,
  reduced,
}: {
  config: FinConfig;
  geometry: THREE.ExtrudeGeometry;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    const dt = Math.min(delta, 0.05);
    const intro = getIntroProgress(reduced, state.clock.elapsedTime);
    const scroll = scrollStore.hero;
    const wave = reduced
      ? 0
      : Math.sin(state.clock.elapsedTime * config.drift) * 0.08;

    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      config.position[0] + scroll * 0.18,
      2.4,
      dt,
    );
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      config.position[1] + wave + (1 - intro) * 0.6,
      2.6,
      dt,
    );
    group.position.z = THREE.MathUtils.damp(
      group.position.z,
      config.position[2] - scroll * 0.2,
      2.4,
      dt,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      config.rotation[0] - scroll * 0.22,
      2.4,
      dt,
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      config.rotation[1] + wave * 0.4,
      2.4,
      dt,
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      config.rotation[2] + wave * 0.3,
      2.4,
      dt,
    );
  });

  return (
    <group
      ref={ref}
      position={config.position}
      rotation={config.rotation as unknown as THREE.Euler}
      scale={config.scale}
    >
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#6f8cff"
          metalness={0.04}
          roughness={0.02}
          transmission={0.92}
          thickness={0.58}
          ior={1.32}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.7}
          attenuationColor="#2748ff"
          attenuationDistance={1.25}
          transparent
        />
      </mesh>
      <mesh geometry={geometry} scale={[0.88, 0.9, 0.88]}>
        <meshStandardMaterial
          color="#d9e7ff"
          emissive={CYAN}
          emissiveIntensity={0.12}
          metalness={0.56}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
}

function CoreAssembly({
  quality,
  reduced,
}: {
  quality: Quality;
  reduced: boolean;
}) {
  const core = useRef<THREE.Group>(null);
  const shell = useMemo(() => makeLatheGeometry(), []);
  const crystal = useMemo(() => new THREE.OctahedronGeometry(0.42, 2), []);
  const frame = useMemo(() => new THREE.OctahedronGeometry(0.68, 0), []);
  const braceGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.028, 0.04, 0.78, 10),
    [],
  );

  useFrame((state, delta) => {
    const group = core.current;
    if (!group) return;
    const dt = Math.min(delta, 0.05);
    const intro = getIntroProgress(reduced, state.clock.elapsedTime);
    const scroll = scrollStore.hero;
    const breathe = reduced
      ? 1
      : 1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.018;

    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      Math.sin(state.clock.elapsedTime * 0.56) * 0.08 +
        (1 - intro) * 0.42 -
        scroll * 0.22,
      2.8,
      dt,
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      state.clock.elapsedTime * 0.18 + scroll * 0.28,
      1.8,
      dt,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      Math.sin(state.clock.elapsedTime * 0.34) * 0.08 - scroll * 0.16,
      2.1,
      dt,
    );
    group.scale.setScalar((0.9 + intro * 0.1 - scroll * 0.04) * breathe);
  });

  return (
    <group ref={core}>
      <mesh geometry={shell} rotation={[0.08, 0, 0.28]}>
        {quality.glass ? (
          <meshPhysicalMaterial
            color="#09112b"
            metalness={0.08}
            roughness={0.04}
            transmission={0.96}
            thickness={1.18}
            ior={1.42}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={2.1}
            attenuationColor="#355bff"
            attenuationDistance={1.5}
            transparent
          />
        ) : (
          <meshStandardMaterial
            color="#0c1634"
            metalness={0.8}
            roughness={0.18}
            emissive={COBALT}
            emissiveIntensity={0.18}
          />
        )}
      </mesh>

      <mesh geometry={crystal}>
        <meshStandardMaterial
          color="#c4d4ff"
          emissive={COBALT_LIGHT}
          emissiveIntensity={1.45}
          metalness={0.1}
          roughness={0.14}
          toneMapped={false}
        />
      </mesh>

      <mesh
        geometry={frame}
        rotation={[0.32, 0.26, -0.12]}
        scale={[1.18, 1.08, 0.84]}
      >
        <meshBasicMaterial
          color={COBALT_LIGHT}
          transparent
          opacity={0.18}
          wireframe
          toneMapped={false}
        />
      </mesh>

      {BRACES.map((brace) => (
        <mesh
          key={brace.key}
          geometry={braceGeometry}
          position={brace.position}
          rotation={brace.rotation as unknown as THREE.Euler}
          scale={brace.scale}
        >
          <meshStandardMaterial
            color="#aeb9cf"
            metalness={1}
            roughness={0.26}
            envMapIntensity={1.8}
          />
        </mesh>
      ))}

      <pointLight
        color={COBALT_LIGHT}
        intensity={5.4}
        distance={4.8}
        decay={2}
      />
    </group>
  );
}

function Atmosphere({ count, reduced }: { count: number; reduced: boolean }) {
  const dust = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = createRandom(count * 2731 + 7);
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 3.1 + random() * 3.4;
      const theta = random() * Math.PI * 2;
      values[index * 3] = Math.cos(theta) * radius;
      values[index * 3 + 1] = (random() - 0.5) * 4.2;
      values[index * 3 + 2] = Math.sin(theta) * radius * 0.8;
    }
    return values;
  }, [count]);

  useFrame((state, delta) => {
    const points = dust.current;
    if (!points || reduced) return;
    points.rotation.y += Math.min(delta, 0.05) * 0.02;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.03;
  });

  return (
    <Points ref={dust} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ICE}
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.38}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function BackdropGlow({ reduced }: { reduced: boolean }) {
  const halo = useRef<THREE.Group>(null);
  const circleGeometry = useMemo(() => new THREE.CircleGeometry(1, 48), []);

  useFrame((state, delta) => {
    const group = halo.current;
    if (!group) return;
    const dt = Math.min(delta, 0.05);
    const intro = getIntroProgress(reduced, state.clock.elapsedTime);
    const scroll = scrollStore.hero;
    const wave = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.3) * 0.05;

    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      0.12 + scroll * 0.18,
      2.2,
      dt,
    );
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      0.06 + wave,
      2.2,
      dt,
    );
    group.scale.setScalar(1.2 + intro * 0.12 + scroll * 0.1);
  });

  return (
    <group ref={halo} position={[0.12, 0.06, -2.5]}>
      <mesh geometry={circleGeometry} scale={[3.8, 3.8, 1]}>
        <meshBasicMaterial
          color={COBALT}
          transparent
          opacity={0.11}
          toneMapped={false}
        />
      </mesh>
      <mesh
        geometry={circleGeometry}
        scale={[2.4, 2.4, 1]}
        position={[0.28, -0.12, 0.02]}
      >
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Rig({ reduced }: { reduced: boolean }) {
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const { camera } = state;
    const dt = Math.min(delta, 0.05);
    const scroll = scrollStore.hero;
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    const orbit = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.16) * 0.14;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      0.78 + px * 0.52 + orbit + scroll * 0.64,
      2.2,
      dt,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.2 + py * 0.24 + scroll * 0.52,
      2.2,
      dt,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      7.3 + scroll * 1.6,
      2.4,
      dt,
    );

    lookAt.set(0.18 + scroll * 0.18, scroll * 0.24, 0);
    camera.lookAt(lookAt);
  });

  return null;
}

function Sculpture({
  quality,
  reduced,
}: {
  quality: Quality;
  reduced: boolean;
}) {
  const finGeometry = useMemo(() => makeFinGeometry(), []);

  return (
    <>
      <BackdropGlow reduced={reduced} />
      {RIBBONS.map((config) => (
        <RibbonBand
          key={config.key}
          config={config}
          quality={quality}
          reduced={reduced}
        />
      ))}
      {FINS.map((config) => (
        <GlassFin
          key={config.key}
          config={config}
          geometry={finGeometry}
          reduced={reduced}
        />
      ))}
      <CoreAssembly quality={quality} reduced={reduced} />
      {quality.particles > 0 && (
        <Atmosphere count={quality.particles} reduced={reduced} />
      )}
    </>
  );
}

function Scene({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  const stage = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const floorLight = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const root = stage.current;
    const dt = Math.min(delta, 0.05);
    const intro = getIntroProgress(reduced, state.clock.elapsedTime);
    const scroll = scrollStore.hero;
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;

    if (root) {
      root.position.x = THREE.MathUtils.damp(
        root.position.x,
        1.58 + scroll * 0.7 + px * 0.18,
        2.2,
        dt,
      );
      root.position.y = THREE.MathUtils.damp(
        root.position.y,
        0.08 + (1 - intro) * 0.7 - scroll * 0.52 + py * 0.08,
        2.4,
        dt,
      );
      root.position.z = THREE.MathUtils.damp(
        root.position.z,
        -0.18 - scroll * 0.22,
        2.2,
        dt,
      );
      root.rotation.x = THREE.MathUtils.damp(
        root.rotation.x,
        -0.18 - py * 0.18 + scroll * 0.18,
        2.2,
        dt,
      );
      root.rotation.y = THREE.MathUtils.damp(
        root.rotation.y,
        -0.44 + px * 0.42 + scroll * 0.64,
        2.2,
        dt,
      );
      root.rotation.z = THREE.MathUtils.damp(
        root.rotation.z,
        0.12 + Math.sin(state.clock.elapsedTime * 0.24) * 0.05 - scroll * 0.18,
        2.2,
        dt,
      );
      root.scale.setScalar(0.9 + intro * 0.14 - scroll * 0.06);
    }

    if (keyLight.current) {
      keyLight.current.intensity = 0.4 + intro * 2.3;
    }
    if (rimLight.current) {
      rimLight.current.intensity = 0.25 + intro * 2.8;
    }
    if (floorLight.current) {
      floorLight.current.intensity = 1.8 + intro * 4.4 - scroll * 0.8;
    }
  });

  return (
    <>
      <color attach="background" args={[OBSIDIAN]} />
      <fog attach="fog" args={[OBSIDIAN, 8, 20]} />

      <ambientLight intensity={0.2} color="#95a6d8" />
      <directionalLight
        ref={keyLight}
        position={[5.8, 4.4, 6]}
        intensity={2.3}
        color="#eef3ff"
      />
      <directionalLight
        ref={rimLight}
        position={[-6.2, 1.4, -4.4]}
        intensity={2.6}
        color={COBALT}
      />
      <pointLight
        ref={floorLight}
        position={[1.4, -2.4, 2]}
        intensity={4.8}
        distance={12}
        decay={2}
        color={CYAN}
      />

      <Environment resolution={quality.envResolution} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.3}
          color="#d9e7ff"
          position={[-5.4, 3.8, -3.8]}
          scale={[10, 7, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.8}
          color={COBALT}
          position={[6, 1.1, 4.8]}
          scale={[9, 10, 1]}
          target={[0.8, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color={CYAN}
          position={[2.2, -4.2, 3.2]}
          scale={[7, 4, 1]}
          target={[0.4, -0.4, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.5}
          color="#9bb7ff"
          position={[0.6, 5.5, 0]}
          scale={[6.5, 6.5, 1]}
          target={[0, 0, 0]}
        />
      </Environment>

      <group ref={stage} position={[1.58, 0.08, -0.18]}>
        <Sculpture quality={quality} reduced={reduced} />
      </group>

      {quality.shadows && (
        <ContactShadows
          position={[1.48, -2.48, 0]}
          opacity={0.42}
          scale={11}
          blur={3.2}
          far={5.8}
          resolution={256}
          color="#03050a"
        />
      )}

      <Rig reduced={reduced} />
    </>
  );
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  const quality = useMemo(() => detectQuality(), []);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <Canvas
      className="hero-canvas"
      dpr={quality.dpr}
      frameloop={active && !reduced ? "always" : "demand"}
      gl={{
        antialias: quality.antialias,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      performance={{ min: 0.65 }}
      camera={{ position: [0.78, 0.2, 7.3], fov: 34, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <Suspense fallback={null}>
        <Scene quality={quality} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
