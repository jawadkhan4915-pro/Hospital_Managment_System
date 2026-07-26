import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Hero3DScene() {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setWebglSupported(false);
      return;
    }

    // WebGL Availability check
    try {
      const canvasTest = document.createElement('canvas');
      const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let animationFrameId;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.2);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // 4. Central Glowing Mesh (Icosahedron / Medical Orb)
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const mainGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const mainMat = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: 0x312e81,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const mainOrb = new THREE.Mesh(mainGeo, mainMat);
    orbGroup.add(mainOrb);

    // Inner Core Solid Sphere
    const coreGeo = new THREE.SphereGeometry(0.75, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.2,
      metalness: 0.8,
    });
    const coreOrb = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreOrb);

    // 5. Outer Rotating Torus Rings
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.1 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.6, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.9, roughness: 0.1 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 6. Floating Node Crystals
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodeColors = [0x06b6d4, 0x7c3aed, 0x3b82f6, 0x10b981];
    const nodePositions = [
      [-2.2, 1.4, -0.5],
      [2.3, -1.2, 0.5],
      [-1.8, -1.8, 0.2],
      [2.0, 1.6, -0.8],
    ];

    nodePositions.forEach((pos, idx) => {
      const geo = new THREE.OctahedronGeometry(0.35, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: nodeColors[idx],
        roughness: 0.2,
        metalness: 0.8,
      });
      const node = new THREE.Mesh(geo, mat);
      node.position.set(...pos);
      nodeGroup.add(node);
    });

    // 7. Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 0.8;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotations
      orbGroup.rotation.y = elapsedTime * 0.25;
      orbGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;

      ring1.rotation.z = elapsedTime * 0.3;
      ring1.rotation.y = elapsedTime * 0.15;

      ring2.rotation.x = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.25;

      nodeGroup.rotation.y = -elapsedTime * 0.15;

      // Mouse Parallax Smooth Interpolation
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 500;
      const newH = container.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
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
  }

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[400px] sm:h-[480px] lg:h-[540px] relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center" 
    />
  );
}
