import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function HeartShape() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = 0, y = 0;
    s.moveTo(x, y + 0.5);
    s.bezierCurveTo(x, y + 0.5, x - 0.5, y, x, y - 0.5);
    s.bezierCurveTo(x, y - 1, x + 1, y - 1, x + 1, y - 0.5);
    s.bezierCurveTo(x + 1, y, x + 0.5, y + 0.5, x, y + 0.7);
    s.bezierCurveTo(x - 0.5, y + 0.5, x, y + 0.5, x, y + 0.5);
    return s;
  }, []);

  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
  }, [shape]);

  return geometry;
}

function FloatingHeart({ position, scale, speed, rotationOffset }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  rotationOffset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometry = HeartShape();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.3 + rotationOffset) * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.2 + rotationOffset) * 0.15;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
      <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
        <meshStandardMaterial
          color="#e8a0a0"
          transparent
          opacity={0.25}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingOrb({ position, scale, color, speed }: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  return (
    <Float speed={speed} rotationIntensity={0} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
      <mesh position={position}>
        <sphereGeometry args={[scale, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} roughness={0.8} />
      </mesh>
    </Float>
  );
}

const FloatingHearts3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.8 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.8} color="#fff5f0" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#e8a0a0" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#f0d0c0" />

        <FloatingHeart position={[-3.5, 2, -2]} scale={0.35} speed={1.2} rotationOffset={0} />
        <FloatingHeart position={[3.8, -1.5, -3]} scale={0.25} speed={0.8} rotationOffset={2} />
        <FloatingHeart position={[-2, -2.5, -1]} scale={0.2} speed={1.5} rotationOffset={4} />
        <FloatingHeart position={[2.5, 3, -2.5]} scale={0.3} speed={1} rotationOffset={1} />
        <FloatingHeart position={[0.5, -3.5, -1.5]} scale={0.18} speed={1.3} rotationOffset={3} />
        <FloatingHeart position={[-4, 0, -3]} scale={0.22} speed={0.9} rotationOffset={5} />

        <FloatingOrb position={[-2, 1, -1]} scale={0.08} color="#e8a0a0" speed={2} />
        <FloatingOrb position={[3, 2, -2]} scale={0.06} color="#f0c0b0" speed={1.5} />
        <FloatingOrb position={[1, -2, -1]} scale={0.1} color="#d4a0a0" speed={1.8} />
        <FloatingOrb position={[-3, -1, -2]} scale={0.07} color="#e0b0b0" speed={2.2} />
        <FloatingOrb position={[4, -3, -1.5]} scale={0.05} color="#f0d0c0" speed={1.2} />
      </Canvas>
    </div>
  );
};

export default FloatingHearts3D;
