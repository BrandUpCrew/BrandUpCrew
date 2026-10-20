"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Grid,
  Lightformer,
  PointMaterial,
  Points,
} from "@react-three/drei";
import * as THREE from "three";

import { scrollStore } from "@/lib/scroll";

/* -------------------------------------------------------------------------- */
/*  Art direction — "Cobalt Monolith"                                          */
/*  A faceted obsidian-cobalt glass core suspended inside tilted brushed-steel  */
/*  orbit rings, wrapped in a faint wireframe shell, above an infinite cobalt   */
/*  grid with drifting ice dust. Everything is driven by real geometry, PBR     */
/*  materials and a procedural studio environment — no image textures.          */
/* -------------------------------------------------------------------------- */

const COBALT = "#2547f0";
const COBALT_LIGHT = "#6d90ff";
const ICE = "#dbe7ff";
const CYAN = "#3dd7ec";
const OBSIDIAN = "#05070f";

export type Quality = {
  tier: "high" | "medium" | "low";
  dpr: [number, number];
  antialias: boolean;
  particles: number;
  envResolution: number;
  shadows: boolean;
  glass: boolean;
};

/** Deterministic PRNG so generated geometry is identical on every render. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function detectQuality(): Quality {
  if (typeof window === "undefined") {
    return {
      tier: "medium",
      dpr: [1, 1.5],
      antialias: true,
      particles: 240,
      envResolution: 128,
      shadows: false,
      glass: true,
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
      particles: 0,
      envResolution: 64,
      shadows: false,
      glass: false,
    };
  }

  if (coarse || width < 1280 || cores <= 8) {
    return {
      tier: "medium",
      dpr: [1, 1.5],
      antialias: true,
      particles: 260,
      envResolution: 128,
      shadows: false,
      glass: true,
    };
  }

  return {
    tier: "high",
    dpr: [1, 1.9],
    antialias: true,
    particles: 720,
    envResolution: 256,
    shadows: true,
    glass: true,
  };
}

/* -------------------------------------------------------------------------- */
/*  Orbit rings + beads                                                        */
/* -------------------------------------------------------------------------- */

const RING_LAYOUT = [
  { radius: 1.86, tube: 0.016, tilt: [0.42, 0, 0.22] as const, speed: 0.17, beads: 9 },
  { radius: 2.34, tube: 0.013, tilt: [-0.3, 0.34, -0.46] as const, speed: -0.12, beads: 11 },
  { radius: 2.84, tube: 0.01, tilt: [0.92, -0.18, 0.38] as const, speed: 0.085, beads: 13 },
];

function OrbitRing({
  radius,
  tube,
  tilt,
  speed,
  beads,
  reduced,
}: {
  radius: number;
  tube: number;
  tilt: readonly [number, number, number];
  speed: number;
  beads: number;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const beadsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const ringGeometry = useMemo(
    () => new THREE.TorusGeometry(radius, tube, 12, 168),
    [radius, tube],
  );
  const beadGeometry = useMemo(() => new THREE.SphereGeometry(0.036, 10, 10), []);

  useLayoutEffect(() => {
    const mesh = beadsRef.current;
    if (!mesh) return;
    for (let i = 0; i < beads; i += 1) {
      const angle = (i / beads) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [beads, radius, dummy]);

  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.z += Math.min(delta, 0.05) * speed;
  });

  return (
    <group ref={group} rotation={tilt as unknown as THREE.Euler}>
      <mesh geometry={ringGeometry}>
        <meshStandardMaterial
          color="#c4d3f8"
          metalness={1}
          roughness={0.24}
          envMapIntensity={1.35}
        />
      </mesh>
      <instancedMesh ref={beadsRef} args={[beadGeometry, undefined, beads]}>
        <meshStandardMaterial
          color={COBALT_LIGHT}
          metalness={0.55}
          roughness={0.28}
          emissive={COBALT}
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Monolith                                                                   */
/* -------------------------------------------------------------------------- */

function Monolith({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  const core = useRef<THREE.Group>(null);

  const geometry = useMemo(
    () => ({
      core: new THREE.IcosahedronGeometry(1.06, 1),
      inner: new THREE.IcosahedronGeometry(0.4, 2),
      shell: new THREE.IcosahedronGeometry(1.76, 1),
    }),
    [],
  );

  useFrame((state, delta) => {
    if (reduced || !core.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    core.current.rotation.y += dt * 0.14;
    core.current.position.y = Math.sin(t * 0.6) * 0.07;
    const breathe = 1 + Math.sin(t * 0.9) * 0.012;
    core.current.scale.setScalar(breathe);
  });

  return (
    <group>
      <group ref={core}>
        <mesh geometry={geometry.core}>
          {quality.glass ? (
            <meshPhysicalMaterial
              color="#0a1230"
              metalness={0.22}
              roughness={0.06}
              transmission={0.92}
              thickness={1.45}
              ior={1.45}
              clearcoat={1}
              clearcoatRoughness={0.08}
              envMapIntensity={1.6}
              attenuationColor="#2a49d8"
              attenuationDistance={1.7}
              transparent
            />
          ) : (
            <meshStandardMaterial
              color="#0a1230"
              metalness={0.85}
              roughness={0.16}
              emissive={COBALT}
              emissiveIntensity={0.35}
              envMapIntensity={1.2}
            />
          )}
        </mesh>
        <mesh geometry={geometry.inner}>
          <meshBasicMaterial color="#87aaff" toneMapped={false} />
        </mesh>
        <pointLight color={COBALT_LIGHT} intensity={6} distance={4.6} decay={2} />
      </group>

      <mesh geometry={geometry.shell}>
        <meshBasicMaterial
          color={COBALT_LIGHT}
          wireframe
          transparent
          opacity={0.13}
          toneMapped={false}
        />
      </mesh>

      {RING_LAYOUT.map((ring) => (
        <OrbitRing key={ring.radius} {...ring} reduced={reduced} />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ice dust                                                                   */
/* -------------------------------------------------------------------------- */

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    // Seeded generator keeps the field stable across renders and re-mounts.
    const random = createRandom(count * 7919 + 13);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 3.6 + random() * 5.4;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (random() - 0.5) * 7;
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.62;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * 0.035;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={ICE}
        size={0.034}
        sizeAttenuation
        depthWrite={false}
        opacity={0.72}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Camera rig — pointer parallax + scroll narrative                           */
/* -------------------------------------------------------------------------- */

function Rig({ reduced }: { reduced: boolean }) {
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const { camera } = state;
    const dt = Math.min(delta, 0.05);
    const progress = scrollStore.hero;
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;

    const targetX = px * 0.55;
    const targetY = 0.2 + progress * 0.9 + py * 0.32;
    const targetZ = 6.9 + progress * 2.5;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.6, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.6, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.6, dt);

    lookAt.set(0, progress * 0.5, 0);
    camera.lookAt(lookAt);
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                      */
/* -------------------------------------------------------------------------- */

function Scene({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  const stage = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reduced || !stage.current) return;
    const dt = Math.min(delta, 0.05);
    const progress = scrollStore.hero;
    const { x, y } = state.pointer;

    stage.current.rotation.y = THREE.MathUtils.damp(
      stage.current.rotation.y,
      x * 0.42 + progress * 0.55,
      2.1,
      dt,
    );
    stage.current.rotation.x = THREE.MathUtils.damp(
      stage.current.rotation.x,
      -y * 0.24 + progress * 0.16,
      2.1,
      dt,
    );
    stage.current.position.y = THREE.MathUtils.damp(
      stage.current.position.y,
      -progress * 0.55,
      2.1,
      dt,
    );
  });

  return (
    <>
      <fog attach="fog" args={[OBSIDIAN, 10, 26]} />

      <ambientLight intensity={0.35} color="#8fabff" />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#dce7ff" />
      <directionalLight position={[-6, -2.4, -4]} intensity={2.2} color={COBALT} />
      <pointLight position={[0, -3.4, 2.6]} intensity={7} distance={13} decay={2} color={CYAN} />

      <Environment resolution={quality.envResolution} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#cfe0ff"
          position={[-5, 3, -6]}
          scale={[12, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3.4}
          color={COBALT}
          position={[6, -1, 5]}
          scale={[9, 9, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.9}
          color="#9fe9f7"
          position={[0, 6, 1]}
          scale={[7, 7, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#0a1224"
          position={[0, -6.5, 0]}
          scale={[13, 13, 1]}
          target={[0, 0, 0]}
        />
      </Environment>

      <group ref={stage} position={[0, 0.1, 0]}>
        <Monolith quality={quality} reduced={reduced} />
        {quality.particles > 0 && <Dust count={quality.particles} />}
      </group>

      {quality.shadows && (
        <ContactShadows
          position={[0, -2.62, 0]}
          opacity={0.5}
          scale={17}
          blur={3.4}
          far={6}
          resolution={256}
          color="#01030a"
        />
      )}

      <Grid
        position={[0, -2.9, 0]}
        args={[46, 46]}
        cellSize={0.55}
        cellThickness={0.5}
        cellColor="#16244d"
        sectionSize={2.75}
        sectionThickness={1}
        sectionColor="#2f52e0"
        fadeDistance={30}
        fadeStrength={1.4}
        infiniteGrid
      />

      <Rig reduced={reduced} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Canvas                                                                     */
/* -------------------------------------------------------------------------- */

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
      camera={{ position: [0, 0.25, 6.9], fov: 38, near: 0.1, far: 80 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Suspense fallback={null}>
        <Scene quality={quality} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
