import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Torus, Environment } from '@react-three/drei';

function AnimatedSphere() {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={sphereRef} scale={1.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingRing({ position, color, radius, speed }) {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * speed) * 0.5;
      ringRef.current.rotation.y = clock.getElapsedTime() * (speed * 0.8);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5} position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.08, 16, 100]} />
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function SmallGlassNodes() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  const nodes = [
    { pos: [-2.2, 1.4, -0.5], color: "#06b6d4", scale: 0.35 },
    { pos: [2.3, -1.2, 0.5], color: "#7c3aed", scale: 0.4 },
    { pos: [-1.8, -1.8, 0.2], color: "#3b82f6", scale: 0.3 },
    { pos: [2.0, 1.6, -0.8], color: "#10b981", scale: 0.3 },
  ];

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={2} floatIntensity={2} position={node.pos}>
          <mesh scale={node.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color={node.color}
              roughness={0.1}
              metalness={0.2}
              transmission={0.8}
              ior={1.5}
              thickness={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Hero3DScene() {
  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return (
      <div className="w-full h-full min-h-[380px] flex items-center justify-center relative rounded-3xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/10 to-purple-500/20 border border-indigo-500/20 backdrop-blur-xl">
        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 blur-3xl opacity-50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] sm:h-[480px] lg:h-[540px] relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
        <pointLight position={[5, -5, 5]} intensity={0.8} color="#7c3aed" />
        
        <AnimatedSphere />
        <FloatingRing position={[0, 0, 0]} color="#06b6d4" radius={2.5} speed={0.4} />
        <FloatingRing position={[0, 0, 0]} color="#8b5cf6" radius={3.1} speed={0.3} />
        <SmallGlassNodes />
      </Canvas>
    </div>
  );
}
