import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  VoxelCoord, 
  VoxelBlockType, 
  BLOCK_PALETTE, 
  generateEraVoxelMap 
} from './voxelTypes';
import { VoxelBuilderBot } from './VoxelBuilderBot';
import { 
  RotateCcw, 
  Zap, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Compass
} from 'lucide-react';

interface ThreeVoxelSandboxProps {
  trackId: number;
  isRunning?: boolean;
  testPassed?: boolean;
  onToggle3DMode?: () => void;
  onToggleClassicMode?: () => void;
}

export const ThreeVoxelSandbox: React.FC<ThreeVoxelSandboxProps> = ({
  trackId,
  isRunning = false,
  testPassed = false,
  onToggle3DMode,
  onToggleClassicMode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Three.js State
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Instanced Meshes by Block Type
  const instancedMeshesRef = useRef<Map<VoxelBlockType, THREE.InstancedMesh>>(new Map());
  const voxelDataRef = useRef<VoxelCoord[]>([]);

  // Avatar Player State
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 8));
  const playerVelYRef = useRef<number>(0);
  const playerAngleRef = useRef<number>(Math.PI); // Facing north
  const isJumpingRef = useRef<boolean>(false);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const leftLegRef = useRef<THREE.Mesh | null>(null);
  const rightLegRef = useRef<THREE.Mesh | null>(null);

  // Builder Bot State
  const botRef = useRef<VoxelBuilderBot>(new VoxelBuilderBot());
  const botMeshRef = useRef<THREE.Group | null>(null);
  const [buildingBlocksRemaining, setBuildingBlocksRemaining] = useState<number>(0);

  // View Mode: 1st Person, 3rd Person, Orbit
  const [cameraMode, setCameraMode] = useState<'3rd' | '1st' | 'orbit'>('3rd');
  const [playerCoord, setPlayerCoord] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 2, z: 8 });

  // Key state
  const keysRef = useRef<{ forward: boolean; backward: boolean; left: boolean; right: boolean }>({
    forward: false,
    backward: false,
    left: false,
    right: false
  });

  // Mouse drag look
  const isDraggingRef = useRef<boolean>(false);
  const prevMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. Rebuild Instanced Meshes from Voxel Data
  const rebuildVoxelMeshes = useCallback((scene: THREE.Scene, voxels: VoxelCoord[]) => {
    // Remove existing instanced meshes
    instancedMeshesRef.current.forEach((mesh) => scene.remove(mesh));
    instancedMeshesRef.current.clear();

    // Group by type
    const groups = new Map<VoxelBlockType, VoxelCoord[]>();
    voxels.forEach((v) => {
      if (v.type === 'AIR') return;
      if (!groups.has(v.type)) groups.set(v.type, []);
      groups.get(v.type)!.push(v);
    });

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const dummy = new THREE.Object3D();

    groups.forEach((coords, type) => {
      const def = BLOCK_PALETTE[type];
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: def.roughness,
        metalness: def.metalness,
        emissive: def.emissive || 0x000000,
        transparent: !!def.transparent,
        opacity: def.opacity ?? 1.0
      });

      const maxCount = Math.max(coords.length + 120, 200); // Leave headroom for builder bot
      const mesh = new THREE.InstancedMesh(boxGeo, mat, maxCount);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      coords.forEach((c, idx) => {
        dummy.position.set(c.x, c.y, c.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
      });

      mesh.count = coords.length;
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
      instancedMeshesRef.current.set(type, mesh);
    });
  }, []);

  // 2. Add New Block dynamically into Instanced Mesh
  const addBlockToMesh = useCallback((coord: VoxelCoord) => {
    const scene = sceneRef.current;
    if (!scene) return;

    voxelDataRef.current.push(coord);
    const mesh = instancedMeshesRef.current.get(coord.type);
    const dummy = new THREE.Object3D();
    dummy.position.set(coord.x, coord.y, coord.z);
    dummy.updateMatrix();

    if (mesh && mesh.count < mesh.instanceMatrix.count) {
      mesh.setMatrixAt(mesh.count, dummy.matrix);
      mesh.count++;
      mesh.instanceMatrix.needsUpdate = true;
    } else {
      rebuildVoxelMeshes(scene, voxelDataRef.current);
    }
  }, [rebuildVoxelMeshes]);

  // 3. Initialize Three.js Scene, Avatar, and Lighting
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 350;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(trackId === 4 ? 0x050814 : 0x7dd3fc); // Blue sky or cyber sky

    // Sky fog
    scene.fog = new THREE.FogExp2(trackId === 4 ? 0x050814 : 0x7dd3fc, 0.025);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Sunlight
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    sunLight.position.set(15, 30, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Procedural Voxel Map
    const initialVoxels = generateEraVoxelMap(trackId);
    voxelDataRef.current = [...initialVoxels];
    rebuildVoxelMeshes(scene, initialVoxels);

    // =========================================================================
    // MINECRAFT STEVE-STYLE AVATAR
    // =========================================================================
    const avatar = new THREE.Group();
    avatarGroupRef.current = avatar;

    // Head
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.8 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), headMat);
    head.position.y = 1.6;
    head.castShadow = true;
    avatar.add(head);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.05), eyeMat);
    eyeL.position.set(-0.15, 1.65, 0.31);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.05), eyeMat);
    eyeR.position.set(0.15, 1.65, 0.31);
    avatar.add(eyeL);
    avatar.add(eyeR);

    // Torso (Tunic)
    const torsoMat = new THREE.MeshStandardMaterial({ 
      color: trackId === 1 ? 0x2563eb : trackId === 2 ? 0xd97706 : trackId === 3 ? 0x991b1b : 0x0284c7, 
      roughness: 0.7 
    });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.4), torsoMat);
    torso.position.y = 0.95;
    torso.castShadow = true;
    avatar.add(torso);

    // Arms
    const armMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), armMat);
    armL.position.set(-0.5, 0.9, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.75, 0.25), armMat);
    armR.position.set(0.5, 0.9, 0);
    avatar.add(armL);
    avatar.add(armR);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.28), legMat);
    legL.position.set(-0.18, 0.32, 0);
    legL.castShadow = true;
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.28), legMat);
    legR.position.set(0.18, 0.32, 0);
    legR.castShadow = true;
    leftLegRef.current = legL;
    rightLegRef.current = legR;
    avatar.add(legL);
    avatar.add(legR);

    avatar.position.copy(playerPosRef.current);
    scene.add(avatar);

    // =========================================================================
    // GOLDEN TURTLE BUILDER BOT MESH
    // =========================================================================
    const botDrone = new THREE.Group();
    const botBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.5, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2, emissive: 0xb45309 })
    );
    botBody.castShadow = true;
    botDrone.add(botBody);

    // Glowing eye
    const botEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    botEye.position.set(0, 0, 0.42);
    botDrone.add(botEye);

    botDrone.position.set(0, 5, 0);
    botMeshRef.current = botDrone;
    scene.add(botDrone);

    // Initialize Bot Engine callback
    botRef.current = new VoxelBuilderBot((newCoord) => {
      addBlockToMesh(newCoord);
    });

    // Keyboard Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keysRef.current.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keysRef.current.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keysRef.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keysRef.current.right = true;
      if (e.key === ' ' && !isJumpingRef.current) {
        playerVelYRef.current = 6.0;
        isJumpingRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keysRef.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keysRef.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse drag rotation
    const dom = renderer.domElement;
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      playerAngleRef.current -= dx * 0.006;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 4. Animation Loop
    let clock = new THREE.Clock();
    let botTickTimer = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Avatar Movement Physics
      const moveSpeed = 5.0 * delta;
      const angle = playerAngleRef.current;
      let isMoving = false;

      const forwardVec = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
      const rightVec = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));

      if (keysRef.current.forward) {
        playerPosRef.current.addScaledVector(forwardVec, -moveSpeed);
        isMoving = true;
      }
      if (keysRef.current.backward) {
        playerPosRef.current.addScaledVector(forwardVec, moveSpeed);
        isMoving = true;
      }
      if (keysRef.current.left) {
        playerPosRef.current.addScaledVector(rightVec, -moveSpeed);
        isMoving = true;
      }
      if (keysRef.current.right) {
        playerPosRef.current.addScaledVector(rightVec, moveSpeed);
        isMoving = true;
      }

      // Vertical Gravity & Ground Collision
      playerVelYRef.current -= 14.0 * delta;
      playerPosRef.current.y += playerVelYRef.current * delta;

      // Ground height clamp
      const groundY = 2.0;
      if (playerPosRef.current.y <= groundY) {
        playerPosRef.current.y = groundY;
        playerVelYRef.current = 0;
        isJumpingRef.current = false;
      }

      // Leg swing animation when walking
      if (avatarGroupRef.current) {
        avatarGroupRef.current.position.copy(playerPosRef.current);
        avatarGroupRef.current.rotation.y = angle;

        if (leftLegRef.current && rightLegRef.current) {
          if (isMoving) {
            leftLegRef.current.rotation.x = Math.sin(elapsed * 12) * 0.6;
            rightLegRef.current.rotation.x = -Math.sin(elapsed * 12) * 0.6;
          } else {
            leftLegRef.current.rotation.x = 0;
            rightLegRef.current.rotation.x = 0;
          }
        }
      }

      // Update Camera based on Camera Mode
      if (cameraMode === '1st') {
        camera.position.set(playerPosRef.current.x, playerPosRef.current.y + 1.6, playerPosRef.current.z);
        camera.lookAt(
          playerPosRef.current.x - Math.sin(angle) * 10,
          playerPosRef.current.y + 1.5,
          playerPosRef.current.z - Math.cos(angle) * 10
        );
        if (avatarGroupRef.current) avatarGroupRef.current.visible = false;
      } else if (cameraMode === '3rd') {
        if (avatarGroupRef.current) avatarGroupRef.current.visible = true;
        const camDistance = 4.5;
        camera.position.set(
          playerPosRef.current.x + Math.sin(angle) * camDistance,
          playerPosRef.current.y + 2.5,
          playerPosRef.current.z + Math.cos(angle) * camDistance
        );
        camera.lookAt(playerPosRef.current.x, playerPosRef.current.y + 1.2, playerPosRef.current.z);
      } else {
        // Orbit overview
        if (avatarGroupRef.current) avatarGroupRef.current.visible = true;
        camera.position.set(0, 16, 18);
        camera.lookAt(0, 2, 0);
      }

      // Builder Bot Tick Execution
      botTickTimer += delta;
      if (botTickTimer > 0.15) {
        botTickTimer = 0;
        const placed = botRef.current.tickNextBlock();
        if (placed && botMeshRef.current) {
          botMeshRef.current.position.set(placed.x, placed.y + 1.2, placed.z);
        }
        setBuildingBlocksRemaining(botRef.current.getRemainingBlocksCount());
      }

      // Bot float bobbing
      if (botMeshRef.current) {
        botMeshRef.current.position.y += Math.sin(elapsed * 4) * 0.008;
      }

      renderer.render(scene, camera);

      // Telemetry update
      setPlayerCoord({
        x: Math.round(playerPosRef.current.x),
        y: Math.round(playerPosRef.current.y),
        z: Math.round(playerPosRef.current.z)
      });
    };
    animate();

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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [trackId, cameraMode, rebuildVoxelMeshes, addBlockToMesh]);

  // Execute Code to Build Turtle Script
  const handleDeployTurtleBuilder = () => {
    botRef.current.loadEraProgram(trackId);
    setBuildingBlocksRemaining(botRef.current.getRemainingBlocksCount());
  };

  const handleResetWorld = () => {
    if (sceneRef.current) {
      const initial = generateEraVoxelMap(trackId);
      voxelDataRef.current = [...initial];
      rebuildVoxelMeshes(sceneRef.current, initial);
      playerPosRef.current.set(0, 2.5, 8);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#040812] rounded-xl border border-slate-800 overflow-hidden select-none flex flex-col font-sans">
      {/* Top HUD Bar */}
      <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-600 text-[11px] font-mono font-bold text-emerald-300 flex items-center gap-1.5 shadow">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Minecraft Voxel Engine</span>
          </span>

          <span className="px-2 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[10.5px] font-mono text-cyan-300 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>X:{playerCoord.x} Y:{playerCoord.y} Z:{playerCoord.z}</span>
          </span>

          {buildingBlocksRemaining > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500 text-[10px] font-mono text-amber-300 animate-pulse">
              ⚡ Turtle Placing {buildingBlocksRemaining} Blocks...
            </span>
          )}

          {testPassed && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500 text-[10px] font-mono text-emerald-300 font-bold">
              ✓ State Consensus Reached
            </span>
          )}

          {isRunning && (
            <span className="px-2 py-0.5 rounded-full bg-blue-950/90 border border-blue-500 text-[10px] font-mono text-blue-300 animate-pulse">
              ● Code Sandbox Active
            </span>
          )}
        </div>

        {/* View Controls & Perspective Switcher */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center bg-slate-900/90 border border-slate-700 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setCameraMode('1st')}
              className={`px-2 py-1 rounded transition ${cameraMode === '1st' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              1st Person
            </button>
            <button
              onClick={() => setCameraMode('3rd')}
              className={`px-2 py-1 rounded transition ${cameraMode === '3rd' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              3rd Person
            </button>
            <button
              onClick={() => setCameraMode('orbit')}
              className={`px-2 py-1 rounded transition ${cameraMode === 'orbit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Drone View
            </button>
          </div>

          {onToggle3DMode && (
            <button
              onClick={onToggle3DMode}
              className="px-2 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition"
              title="Switch to 3D WebGL Smooth View"
            >
              3D Smooth
            </button>
          )}

          {onToggleClassicMode && (
            <button
              onClick={onToggleClassicMode}
              className="px-2 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition"
              title="Switch to 2D Vector Canvas"
            >
              2D View
            </button>
          )}

          <button
            onClick={handleResetWorld}
            className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title="Reset Voxel World"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Mount */}
      <div ref={mountRef} className="w-full h-full cursor-crosshair flex-1" />

      {/* Bottom HUD: Controls & "Code to Build" Turtle Trigger */}
      <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* On-Screen D-Pad for easy mobile/trackpad navigation */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-slate-300">
            <button
              onClick={() => {
                playerPosRef.current.add(new THREE.Vector3(0, 0, -1));
              }}
              className="p-1 bg-slate-800 rounded hover:bg-slate-700"
              title="Walk Forward (W)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playerPosRef.current.add(new THREE.Vector3(0, 0, 1));
              }}
              className="p-1 bg-slate-800 rounded hover:bg-slate-700"
              title="Walk Backward (S)"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playerAngleRef.current += 0.2;
              }}
              className="p-1 bg-slate-800 rounded hover:bg-slate-700"
              title="Turn Left"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playerAngleRef.current -= 0.2;
              }}
              className="p-1 bg-slate-800 rounded hover:bg-slate-700"
              title="Turn Right"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (!isJumpingRef.current) {
                  playerVelYRef.current = 6.0;
                  isJumpingRef.current = true;
                }
              }}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded ml-1"
            >
              JUMP
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 hidden sm:inline-block">
            🎮 Keys: WASD to Walk • SPACE to Jump • Drag to Look
          </span>
        </div>

        {/* Code to Build Turtle Trigger Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleDeployTurtleBuilder}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
            title="Deploy autonomous turtle to construct historical structures block-by-block"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Deploy Turtle Builder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
