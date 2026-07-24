"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text3D, Center } from "@react-three/drei";
import { useRef, Suspense, useState } from "react";
import type { Group } from "three";

function AiHumanoidBust() {
  const outerRingRef = useRef<Group>(null!);
  const innerRingRef = useRef<Group>(null!);
  const headRef = useRef<Group>(null!);
  const coreRef = useRef<Group>(null!);

  const [scale, setScale] = useState(0.1);

  useFrame((_, delta) => {
    // 1. Smooth entrance scale pop-in
    if (scale < 0.78) {
      setScale((prev) => Math.min(0.78, prev + delta * 1.6));
    }

    // 2. Gyroscopic Tech Halo Animations
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.55;
      outerRingRef.current.rotation.x += delta * 0.25;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.85;
      innerRingRef.current.rotation.z += delta * 0.35;
    }

    // 3. Subtle pulsing rotation on the central neural brain core
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.25} floatIntensity={0.7}>
      <group scale={scale} position={[0, -0.65, 0]}>

        {/* ── 1. BRAND LOGO: CODM (BLURPLE MONOCHROME) ── */}
        <group position={[0, 2.7, 0]}>
          <Center>
            <Text3D
              font="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json"
              size={0.65}
              height={0.14}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.04}
              bevelSize={0.02}
            >
              CODM
              <meshStandardMaterial
                color="#ffffff"
                emissive="#7c5cfc"
                emissiveIntensity={2.2}
                metalness={0.9}
                roughness={0.1}
              />
            </Text3D>
          </Center>
        </group>

        {/* ── 2. AI HUMANOID FACE & CRANIUM FIGURE ── */}
        <group ref={headRef} position={[0, 0.3, 0]}>
          {/* Neural Brain Core (Internal Glowing Polyhedron) */}
          <group ref={coreRef} position={[0, 0.35, -0.05]}>
            <mesh>
              <icosahedronGeometry args={[0.42, 1]} />
              <meshStandardMaterial
                color="#7c5cfc"
                emissive="#7c5cfc"
                emissiveIntensity={2.5}
                wireframe
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial
                color="#a78bfa"
                emissive="#a78bfa"
                emissiveIntensity={2}
              />
            </mesh>
          </group>

          {/* Cranium Glass Shield (Blurple Wireframe Shell) */}
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.7, 24, 24]} />
            <meshStandardMaterial
              color="#7c5cfc"
              emissive="#7c5cfc"
              emissiveIntensity={1.2}
              wireframe
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Stylized Cyber Visor / Face Guard */}
          <mesh position={[0, 0.1, 0.28]} rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.48, 0.3, 0.55, 16, 1, true]} />
            <meshStandardMaterial
              color="#130d2a"
              emissive="#7c5cfc"
              emissiveIntensity={0.6}
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>

          {/* Glowing Optical Sensor Line */}
          <mesh position={[0, 0.2, 0.62]}>
            <boxGeometry args={[0.6, 0.05, 0.08]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#7c5cfc"
              emissiveIntensity={3}
            />
          </mesh>

          {/* Neck / Spine Collar Assembly */}
          <mesh position={[0, -0.45, -0.05]}>
            <cylinderGeometry args={[0.22, 0.38, 0.6, 16]} />
            <meshStandardMaterial
              color="#1e183a"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* ── 3. AI HUD / CYBERNETIC RINGS (PURE BLURPLE SCHEME) ── */}
        <group ref={innerRingRef} position={[0, 0.3, 0]}>
          <mesh>
            <torusGeometry args={[1.5, 0.03, 16, 100]} />
            <meshStandardMaterial
              color="#a78bfa"
              emissive="#7c5cfc"
              emissiveIntensity={1.5}
            />
          </mesh>
          {/* Orbital Node Data Chips */}
          {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}
            >
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#7c5cfc"
                emissiveIntensity={2.5}
              />
            </mesh>
          ))}
        </group>

        <group ref={outerRingRef} position={[0, 0.3, 0]}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.0, 0.02, 16, 100]} />
            <meshStandardMaterial
              color="#a78bfa"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* ── 4. SATELLITE DATA NODES ── */}
        <mesh position={[1.7, 1.4, -0.3]}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#7c5cfc"
            emissive="#7c5cfc"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[-1.6, -0.4, 0.5]}>
          <octahedronGeometry args={[0.16]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function ModelCanvas() {
  return (
    <div className="w-full h-full min-h-[460px] relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#7c5cfc" />
        <pointLight position={[-5, -5, -5]} intensity={2} color="#a78bfa" />

        <Suspense fallback={null}>
          <AiHumanoidBust />
        </Suspense>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}