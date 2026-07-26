import React, { Component, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Torus } from '@react-three/drei';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL / R3F Canvas render notice:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.35}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
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
        <torusGeometry args={[radius, 0.08, 16, 64]} />
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
            <meshStandardMaterial
              color={node.color}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

const CSSVisualFallback = () => (
  <div className="w-full h-full min-h-[360px] flex items-center justify-center relative rounded-3xl bg-gradient-to-br from-indigo-900/30 via-slate-900/40 to-cyan-900/30 border border-indigo-500/20 backdrop-blur-xl overflow-hidden">
    <div className="relative flex items-center justify-center">
      <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 blur-2xl opacity-60 animate-pulse" />
      <div className="absolute w-36 h-36 rounded-full border-2 border-indigo-400/40 border-t-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
      <div className="absolute w-48 h-48 rounded-full border border-purple-500/30 border-b-indigo-500 animate-spin" style={{ animationDuration: '14s' }} />
      <div className="absolute text-center p-4 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div className="text-xl font-bold font-outfit text-white">HMS 3D Core</div>
        <div className="text-xs text-cyan-400 font-semibold mt-1">Clinical Intelligence Mesh</div>
      </div>
    </div>
  </div>
);

export default function Hero3DScene() {
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <CSSVisualFallback />;
  }

  return (
    <div className="w-full h-[400px] sm:h-[480px] lg:h-[540px] relative cursor-grab active:cursor-grabbing">
      <WebGLErrorBoundary fallback={<CSSVisualFallback />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          fallback={<CSSVisualFallback />}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#06b6d4" />
          <pointLight position={[5, -5, 5]} intensity={0.8} color="#7c3aed" />
          
          <Suspense fallback={null}>
            <AnimatedSphere />
            <FloatingRing position={[0, 0, 0]} color="#06b6d4" radius={2.5} speed={0.4} />
            <FloatingRing position={[0, 0, 0]} color="#8b5cf6" radius={3.1} speed={0.3} />
            <SmallGlassNodes />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
