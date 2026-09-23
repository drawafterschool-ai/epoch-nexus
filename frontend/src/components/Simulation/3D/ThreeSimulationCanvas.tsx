import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Box } from 'lucide-react';

interface ThreeSimulationCanvasProps {
  trackId: number;
  isRunning: boolean;
  testPassed?: boolean;
  onToggleClassicMode?: () => void;
  crisisActive?: boolean;
}

export const ThreeSimulationCanvas: React.FC<ThreeSimulationCanvasProps> = ({
  trackId,
  isRunning,
  testPassed = false,
  onToggleClassicMode,
  crisisActive = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number>(0);

  // References to animated elements
  const gearsRef = useRef<THREE.Group[]>([]);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const shipRef = useRef<THREE.Group | null>(null);
  const urnGlowRef = useRef<THREE.PointLight | null>(null);

  // Mouse Orbit State
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    radius: 18
  });

  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 350;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(crisisActive ? 0x140508 : 0x090d18);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(crisisActive ? 0xff4444 : 0xffffff, 1.2);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Reset animated refs
    gearsRef.current = [];
    smokeParticlesRef.current = null;
    globeRef.current = null;
    shipRef.current = null;
    urnGlowRef.current = null;

    // 3. Build Era-Specific Procedural 3D Environment
    build3DEnvironment(scene, trackId, testPassed, crisisActive);

    // 4. Update Camera Position based on Spherical Coordinates
    const updateCameraPos = () => {
      const { theta, phi, radius } = cameraAngleRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 1.5, 0);
    };
    updateCameraPos();

    // 5. Interactive Mouse Orbit Controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      cameraAngleRef.current.theta -= dx * 0.008;
      cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi - dy * 0.008));
      updateCameraPos();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAngleRef.current.radius = Math.max(8, Math.min(35, cameraAngleRef.current.radius + e.deltaY * 0.02));
      updateCameraPos();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Track-specific 3D animations
      if (trackId === 1 && urnGlowRef.current) {
        urnGlowRef.current.intensity = (testPassed ? 3.5 : 1.5) + Math.sin(elapsed * 4) * 0.5;
      }

      if (trackId === 2 && shipRef.current) {
        shipRef.current.position.y = Math.sin(elapsed * 2) * 0.2;
        shipRef.current.rotation.z = Math.sin(elapsed * 1.5) * 0.05;
        shipRef.current.rotation.x = Math.cos(elapsed * 1.8) * 0.03;
      }

      if (trackId === 3) {
        gearsRef.current.forEach((g, i) => {
          g.rotation.z += (i % 2 === 0 ? 0.02 : -0.02) * (isRunning ? 2.5 : 1.0);
        });
        if (smokeParticlesRef.current) {
          const positions = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 1; i < positions.length; i += 3) {
            positions[i] += 0.04;
            if (positions[i] > 8) positions[i] = 2.5;
          }
          smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      if (trackId === 4 && globeRef.current) {
        globeRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);

      // FPS counter
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFpsTime = now;
      }
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [trackId, testPassed, isRunning, crisisActive]);

  // Procedural 3D Scene Builder
  const build3DEnvironment = (scene: THREE.Scene, id: number, passed: boolean, crisis: boolean) => {
    // Shared Floor Grid
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: id === 4 ? 0x050812 : id === 2 ? 0x0a1c33 : 0x111625,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // =========================================================================
    // ERA 1: 3D ATHENIAN AGORA & MARBLE TEMPLE
    // =========================================================================
    if (id === 1) {
      // Marble Steps Foundation
      const stepsGroup = new THREE.Group();
      for (let s = 0; s < 3; s++) {
        const step = new THREE.Mesh(
          new THREE.BoxGeometry(14 - s * 1.5, 0.4, 10 - s * 1.5),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
        );
        step.position.y = s * 0.4;
        step.receiveShadow = true;
        step.castShadow = true;
        stepsGroup.add(step);
      }
      scene.add(stepsGroup);

      // Marble Columns
      const colMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const columnPositions = [
        [-5, -3], [-2.5, -3], [0, -3], [2.5, -3], [5, -3],
        [-5, 3], [-2.5, 3], [0, 3], [2.5, 3], [5, 3]
      ];
      columnPositions.forEach(([x, z]) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.5, 16), colMat);
        col.position.set(x, 3.4, z);
        col.castShadow = true;
        scene.add(col);
      });

      // Temple Entablature & Pediment (Roof)
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(8, 2.2, 4),
        new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.5 })
      );
      roof.rotation.y = Math.PI / 4;
      roof.position.set(0, 6.7, 0);
      roof.castShadow = true;
      scene.add(roof);

      // Central Golden Voting Urn
      const urnGroup = new THREE.Group();
      const urnMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.8, 1.4, 24),
        new THREE.MeshStandardMaterial({
          color: passed ? 0x10b981 : crisis ? 0xf43f5e : 0xf59e0b,
          metalness: 0.8,
          roughness: 0.2
        })
      );
      urnMesh.position.y = 1.9;
      urnMesh.castShadow = true;
      urnGroup.add(urnMesh);

      // Glowing light from urn
      const urnLight = new THREE.PointLight(passed ? 0x10b981 : 0xf59e0b, 2.5, 8);
      urnLight.position.set(0, 2.8, 0);
      urnGlowRef.current = urnLight;
      urnGroup.add(urnLight);
      scene.add(urnGroup);
    }

    // =========================================================================
    // ERA 2: 3D MEDITERRANEAN OCEAN & VENETIAN GALLEON
    // =========================================================================
    else if (id === 2) {
      // 3D Water Surface
      const waterMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(28, 28, 20, 20),
        new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.1,
          metalness: 0.6,
          transparent: true,
          opacity: 0.85
        })
      );
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.y = 0.2;
      scene.add(waterMesh);

      // Venetian Galleon 3D Ship
      const ship = new THREE.Group();
      shipRef.current = ship;

      // Wooden Hull
      const hullMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 });
      const hull = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 1.8), hullMat);
      hull.position.y = 0.7;
      hull.castShadow = true;
      ship.add(hull);

      // Ship Bow & Stern Wedges
      const bow = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.8, 3), hullMat);
      bow.rotation.z = -Math.PI / 2;
      bow.position.set(2.8, 0.7, 0);
      ship.add(bow);

      // 3 Masts and Billowing Canvas Sails
      const sailMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      const mastPositions = [-1.2, 0.4, 1.8];
      mastPositions.forEach((mx, idx) => {
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.5 - idx * 0.4, 8), hullMat);
        mast.position.set(mx, 2.8, 0);
        ship.add(mast);

        // Curved Sail
        const sail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8 - idx * 0.2, 1.6 - idx * 0.2), sailMat);
        sail.position.set(mx + 0.1, 3.0, 0);
        sail.castShadow = true;
        ship.add(sail);
      });

      scene.add(ship);

      // Trade Route Beacon Light
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706 })
      );
      beacon.position.set(6, 0.8, -4);
      scene.add(beacon);
    }

    // =========================================================================
    // ERA 3: 3D VICTORIAN INDUSTRIAL MANCHESTER FACTORY
    // =========================================================================
    else if (id === 3) {
      // Brick Factory Hall
      const factoryMat = new THREE.MeshStandardMaterial({ color: 0x451a1a, roughness: 0.8 });
      const factory = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 6), factoryMat);
      factory.position.set(-2, 2.25, 0);
      factory.castShadow = true;
      scene.add(factory);

      // Tall Brick Chimneys
      const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
      [-4.5, 3.5].forEach((cx) => {
        const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 7, 16), chimneyMat);
        chimney.position.set(cx, 3.5, -2);
        chimney.castShadow = true;
        scene.add(chimney);
      });

      // Animated Brass Gears
      const gearMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.3 });
      const gear1 = new THREE.Group();
      const wheel1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 16), gearMat);
      wheel1.rotation.x = Math.PI / 2;
      gear1.add(wheel1);
      gear1.position.set(4, 2.5, 1);
      scene.add(gear1);
      gearsRef.current.push(gear1);

      const gear2 = new THREE.Group();
      const wheel2 = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.3, 12), gearMat);
      wheel2.rotation.x = Math.PI / 2;
      gear2.add(wheel2);
      gear2.position.set(6.2, 3.2, 1);
      scene.add(gear2);
      gearsRef.current.push(gear2);

      // Smoke Particle System
      const particleCount = 40;
      const smokeGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = -4.5 + (Math.random() - 0.5) * 0.8;
        positions[i + 1] = 7.0 + Math.random() * 3.5;
        positions[i + 2] = -2.0 + (Math.random() - 0.5) * 0.8;
      }
      smokeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const smokeMat = new THREE.PointsMaterial({
        color: passed ? 0x94a3b8 : 0x3f3f46,
        size: 0.6,
        transparent: true,
        opacity: passed ? 0.3 : 0.8
      });
      const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
      smokeParticlesRef.current = smokeParticles;
      scene.add(smokeParticles);
    }

    // =========================================================================
    // ERA 4: 3D FUTURISTIC UN & WEB3 MULTILATERAL CHAMBER
    // =========================================================================
    else {
      // Circular Chamber Assembly Ring
      const ringGeo = new THREE.TorusGeometry(6, 0.3, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.5;
      scene.add(ring);

      // Rotating Holographic 3D Earth Globe
      const globeGeo = new THREE.SphereGeometry(2.4, 32, 32);
      const globeMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        emissive: 0x1d4ed8,
        wireframe: true
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      globe.position.set(0, 3.5, 0);
      globeRef.current = globe;
      scene.add(globe);

      // Orbital Satellite Ring
      const orbitRing = new THREE.Mesh(
        new THREE.RingGeometry(3.2, 3.4, 64),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide })
      );
      orbitRing.rotation.x = Math.PI / 3;
      orbitRing.position.set(0, 3.5, 0);
      scene.add(orbitRing);

      // Delegate Podiums
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const podium = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.5, 1.2, 12),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 })
        );
        podium.position.set(Math.cos(angle) * 7.5, 0.6, Math.sin(angle) * 7.5);
        scene.add(podium);
      }
    }
  };

  const handleResetCamera = () => {
    cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 18 };
    if (cameraRef.current) {
      const { theta, phi, radius } = cameraAngleRef.current;
      cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
      cameraRef.current.position.y = radius * Math.cos(phi);
      cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
      cameraRef.current.lookAt(0, 1.5, 0);
    }
  };

  const handleZoom = (delta: number) => {
    cameraAngleRef.current.radius = Math.max(8, Math.min(35, cameraAngleRef.current.radius + delta));
    if (cameraRef.current) {
      const { theta, phi, radius } = cameraAngleRef.current;
      cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
      cameraRef.current.position.y = radius * Math.cos(phi);
      cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
      cameraRef.current.lookAt(0, 1.5, 0);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#080c16] rounded-xl border border-slate-800 overflow-hidden select-none flex flex-col">
      {/* Top Overlay Bar */}
      <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow">
            <Box className="w-3 h-3 text-cyan-400" />
            <span>3D WebGL Engine (Three.js)</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
            {fps} FPS
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {onToggleClassicMode && (
            <button
              onClick={onToggleClassicMode}
              className="px-2 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition shadow"
              title="Switch to 2D Vector Canvas"
            >
              Classic 2D
            </button>
          )}

          <button
            onClick={() => handleZoom(-3)}
            className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(3)}
            className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title="Reset Camera Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex-1" />

      {/* Bottom Controls / Status Bar */}
      <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-none text-[10px] font-mono">
        <span className="text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          💡 Click & Drag to Orbit • Scroll to Zoom
        </span>

        <span className={`px-2 py-0.5 rounded font-bold border ${
          testPassed 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
            : crisisActive 
            ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse' 
            : 'bg-slate-900/80 text-slate-400 border-slate-800'
        }`}>
          {testPassed ? '✓ 3D Simulation Equilibrium Verified' : crisisActive ? '⚠️ Crisis Shock Active' : '● Simulation Ready'}
        </span>
      </div>
    </div>
  );
};
