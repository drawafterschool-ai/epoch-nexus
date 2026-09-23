export type VoxelBlockType = 
  | 'AIR'
  | 'GRASS'
  | 'DIRT'
  | 'STONE'
  | 'MARBLE'
  | 'OAK_WOOD'
  | 'WATER'
  | 'RED_BRICK'
  | 'IRON'
  | 'GLOWSTONE'
  | 'GOLD'
  | 'CYBER_NEON';

export interface VoxelCoord {
  x: number;
  y: number;
  z: number;
  type: VoxelBlockType;
}

export interface BlockMaterialDef {
  color: number;
  roughness: number;
  metalness: number;
  emissive?: number;
  transparent?: boolean;
  opacity?: number;
}

export const BLOCK_PALETTE: Record<VoxelBlockType, BlockMaterialDef> = {
  AIR: { color: 0x000000, roughness: 1, metalness: 0, opacity: 0, transparent: true },
  GRASS: { color: 0x4d7c0f, roughness: 0.9, metalness: 0.1 },
  DIRT: { color: 0x78350f, roughness: 1.0, metalness: 0 },
  STONE: { color: 0x64748b, roughness: 0.8, metalness: 0.2 },
  MARBLE: { color: 0xf8fafc, roughness: 0.3, metalness: 0.1 },
  OAK_WOOD: { color: 0x92400e, roughness: 0.7, metalness: 0 },
  WATER: { color: 0x0284c7, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.75 },
  RED_BRICK: { color: 0x991b1b, roughness: 0.8, metalness: 0.1 },
  IRON: { color: 0x94a3b8, roughness: 0.4, metalness: 0.8 },
  GLOWSTONE: { color: 0xfef08a, roughness: 0.2, metalness: 0.1, emissive: 0xfacc15 },
  GOLD: { color: 0xf59e0b, roughness: 0.3, metalness: 0.9, emissive: 0xd97706 },
  CYBER_NEON: { color: 0x38bdf8, roughness: 0.1, metalness: 0.6, emissive: 0x0284c7 }
};

// Generates procedural historical voxel maps for each Era
export function generateEraVoxelMap(trackId: number): VoxelCoord[] {
  const blocks: VoxelCoord[] = [];
  const add = (x: number, y: number, z: number, type: VoxelBlockType) => {
    blocks.push({ x, y, z, type });
  };

  // 1. Shared Base Terrain (16x16 ground)
  const size = 16;
  const half = Math.floor(size / 2);

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      add(x, 0, z, 'DIRT');
      if (trackId === 2) {
        // Venice: Water canal in the center
        if (Math.abs(x) <= 2) {
          add(x, 1, z, 'WATER');
        } else {
          add(x, 1, z, 'STONE');
        }
      } else if (trackId === 3) {
        // Manchester: Cobblestone city ground
        add(x, 1, z, 'STONE');
      } else if (trackId === 4) {
        // UN Cyber chamber: Dark metallic floor
        add(x, 1, z, 'IRON');
      } else {
        // Athens: Grassy acropolis hill
        add(x, 1, z, 'GRASS');
      }
    }
  }

  // =========================================================================
  // ERA 1: ATHENIAN ACROPOLIS & MARBLE PARTHENON
  // =========================================================================
  if (trackId === 1) {
    // Marble Temple Platform (8x10 at y=2)
    for (let x = -4; x <= 4; x++) {
      for (let z = -5; z <= 5; z++) {
        add(x, 2, z, 'MARBLE');
      }
    }

    // 8 Classical Marble Pillars (height 5)
    const pillarCoords = [
      [-3, -4], [-1, -4], [1, -4], [3, -4],
      [-3, 4], [-1, 4], [1, 4], [3, 4]
    ];
    pillarCoords.forEach(([px, pz]) => {
      for (let h = 3; h <= 7; h++) {
        add(px, h, pz, 'MARBLE');
      }
    });

    // Roof Beams & Entablature
    for (let x = -3; x <= 3; x++) {
      for (let z = -4; z <= 4; z++) {
        if (x === -3 || x === 3 || z === -4 || z === 4) {
          add(x, 8, z, 'MARBLE');
        }
      }
    }

    // Golden Voting Urn in Center
    add(0, 3, 0, 'GOLD');
    add(0, 4, 0, 'GLOWSTONE');

    // Citizen Agora Bleacher Steps
    for (let s = 1; s <= 3; s++) {
      for (let z = -3; z <= 3; z++) {
        add(-6 - s, s + 1, z, 'STONE');
      }
    }
  }

  // =========================================================================
  // ERA 2: VENETIAN GRAND CANAL & GALLEON
  // =========================================================================
  else if (trackId === 2) {
    // Stone Bridge crossing the canal at z = 0
    for (let x = -3; x <= 3; x++) {
      add(x, 2, 0, 'STONE');
      add(x, 3, 0, 'STONE');
    }
    // Wooden Galleon Ship anchored in canal at z = 4
    for (let z = 3; z <= 7; z++) {
      add(0, 1, z, 'OAK_WOOD');
      add(0, 2, z, 'OAK_WOOD');
    }
    // Ship Mast
    for (let h = 3; h <= 7; h++) {
      add(0, h, 5, 'OAK_WOOD');
    }
    // Canvas Sail (Marble / White)
    for (let w = -1; w <= 1; w++) {
      add(w, 5, 5, 'MARBLE');
      add(w, 6, 5, 'MARBLE');
    }
    // Harbor Glowstone Lanterns
    add(-3, 3, 2, 'GLOWSTONE');
    add(3, 3, 2, 'GLOWSTONE');
  }

  // =========================================================================
  // ERA 3: VICTORIAN MANCHESTER TEXTILE MILLS
  // =========================================================================
  else if (trackId === 3) {
    // Red Brick Factory Walls
    for (let x = -5; x <= 2; x++) {
      for (let z = -5; z <= 5; z++) {
        if (x === -5 || x === 2 || z === -5 || z === 5) {
          for (let h = 2; h <= 6; h++) {
            // Windows
            if (h === 4 && (z === -2 || z === 2)) continue;
            add(x, h, z, 'RED_BRICK');
          }
        }
      }
    }

    // Tall Factory Smokestack Chimney
    for (let h = 2; h <= 10; h++) {
      add(4, h, 0, 'RED_BRICK');
      add(5, h, 0, 'RED_BRICK');
      add(4, h, 1, 'RED_BRICK');
      add(5, h, 1, 'RED_BRICK');
    }

    // Industrial Machinery & Smog Scrubber (Iron + Glowstone)
    add(-1, 2, 0, 'IRON');
    add(-1, 3, 0, 'IRON');
    add(-1, 4, 0, 'GLOWSTONE');
  }

  // =========================================================================
  // ERA 4: MODERN UN & WEB3 CYBER-CONSENSUS CHAMBER
  // =========================================================================
  else {
    // Circular Amphitheater (Radius 5)
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const x = Math.round(Math.cos(rad) * 5);
      const z = Math.round(Math.sin(rad) * 5);
      add(x, 2, z, 'CYBER_NEON');
      add(x, 3, z, 'IRON');
    }

    // Floating Central Consensus Core (Rotating Earth / Protocol Core)
    add(0, 3, 0, 'GOLD');
    add(0, 4, 0, 'CYBER_NEON');
    add(0, 5, 0, 'GLOWSTONE');

    // Holographic Perimeter Ring
    for (let x = -6; x <= 6; x++) {
      add(x, 1, -6, 'CYBER_NEON');
      add(x, 1, 6, 'CYBER_NEON');
    }
  }

  return blocks;
}
