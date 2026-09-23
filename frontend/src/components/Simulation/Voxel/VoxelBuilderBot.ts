import { VoxelBlockType, VoxelCoord } from './voxelTypes';

export interface BuildInstruction {
  type: VoxelBlockType;
  x: number;
  y: number;
  z: number;
  description?: string;
}

export class VoxelBuilderBot {
  private queue: BuildInstruction[] = [];
  public currentPos: { x: number; y: number; z: number } = { x: 0, y: 5, z: 0 };
  public isBuilding: boolean = false;
  private onBlockPlacedCallback?: (block: VoxelCoord) => void;

  constructor(onBlockPlaced?: (block: VoxelCoord) => void) {
    this.onBlockPlacedCallback = onBlockPlaced;
  }

  // Turtle API: Place single block
  public place(type: VoxelBlockType, x: number, y: number, z: number, desc?: string): this {
    this.queue.push({ type, x, y, z, description: desc });
    return this;
  }

  // Turtle API: Build vertical column
  public buildColumn(type: VoxelBlockType, x: number, z: number, height: number, startY: number = 2): this {
    for (let y = startY; y < startY + height; y++) {
      this.place(type, x, y, z, `Pillar at (${x}, ${y}, ${z})`);
    }
    return this;
  }

  // Turtle API: Build straight wall
  public buildWall(type: VoxelBlockType, x1: number, z1: number, x2: number, z2: number, height: number, startY: number = 2): this {
    const dx = Math.sign(x2 - x1);
    const dz = Math.sign(z2 - z1);
    let cx = x1;
    let cz = z1;

    while (true) {
      this.buildColumn(type, cx, cz, height, startY);
      if (cx === x2 && cz === z2) break;
      if (cx !== x2) cx += dx;
      if (cz !== z2) cz += dz;
    }
    return this;
  }

  // Turtle API: Build triumphal arch
  public buildArch(type: VoxelBlockType, x: number, z: number, height: number = 5): this {
    this.buildColumn(type, x - 2, z, height);
    this.buildColumn(type, x + 2, z, height);
    for (let bx = x - 2; bx <= x + 2; bx++) {
      this.place(type, bx, height + 2, z, 'Arch Keystone');
    }
    return this;
  }

  // Era-specific Turtle Programs
  public loadEraProgram(trackId: number): void {
    this.queue = [];
    if (trackId === 1) {
      // Athens: Build Marble Portico & Oracle Altar
      this.buildArch('MARBLE', 0, -2, 4);
      this.place('GOLD', 0, 3, -2, 'Delphi Oracle Altar');
      this.place('GLOWSTONE', 0, 4, -2, 'Sacred Flame');
    } else if (trackId === 2) {
      // Venice: Build Canal Beacon Lighthouse
      this.buildColumn('STONE', -4, 4, 6);
      this.place('GLOWSTONE', -4, 8, 4, 'Navigation Beacon Light');
    } else if (trackId === 3) {
      // Manchester: Install Smog Scrubber Tower
      this.buildColumn('IRON', 2, -2, 5);
      this.place('GLOWSTONE', 2, 7, -2, 'Filtration Core');
    } else {
      // UN: Construct Holographic Consensus Core
      for (let i = 0; i < 4; i++) {
        const rad = (i * Math.PI) / 2;
        const x = Math.round(Math.cos(rad) * 3);
        const z = Math.round(Math.sin(rad) * 3);
        this.place('CYBER_NEON', x, 3, z, 'Delegate Node');
      }
      this.place('GOLD', 0, 5, 0, 'Treaty Pillar');
    }
  }

  // Execute queue step-by-step
  public tickNextBlock(): VoxelCoord | null {
    if (this.queue.length === 0) {
      this.isBuilding = false;
      return null;
    }
    this.isBuilding = true;
    const inst = this.queue.shift()!;
    this.currentPos = { x: inst.x, y: inst.y + 1, z: inst.z };

    const coord: VoxelCoord = { x: inst.x, y: inst.y, z: inst.z, type: inst.type };
    if (this.onBlockPlacedCallback) {
      this.onBlockPlacedCallback(coord);
    }
    return coord;
  }

  public getRemainingBlocksCount(): number {
    return this.queue.length;
  }
}
