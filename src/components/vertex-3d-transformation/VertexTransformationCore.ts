import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────
   VertexTransformationCore — the case-studies page background animation.

   Kinetic narrative: FRAGMENTED (disconnected clusters) → ANALYZE (scanning
   pulse) → RECONSTRUCT (vector snapping) → INTEGRATE (data streams) →
   OPTIMIZE (noise pruning) → SYSTEM (hardened architecture), looped.

   Reconstructed from a provided standalone HTML export (a <script> tag
   loading Three.js r125 from a CDN, not a module) into the same
   class-based, disposable pattern as this site's other two 3D systems.
   Real defects fixed along the way:

     - Colors were the same generic placeholder palette already caught and
       corrected once before in this codebase (0x10B981 / 0x34D399 /
       0xF1F5F9 / near-black fog) rather than this site's actual bespoke
       brand values. Remapped to the established constants: 0x00e5b4
       (this site's emerald, not Tailwind's), 0x00614d (the same "deep
       emerald" already used for Vertex3DNetwork's ambient light), 0x00c99a
       (this brand's own secondary teal from tailwind.config.ts, used here
       as the distinct glow/telemetry accent instead of an invented shade),
       0xf0f5f3 (this site's off-white), 0x0a0c0b (this site's charcoal).
     - No disposal of any kind — the particle system, line mesh, 5 wireframe
       module frames, angular truss, and packet system each own geometry,
       material, or a texture, and none of it was freed. Full destroy()
       added, matching the other two engines.
     - The IntersectionObserver only called `clock.stop()`, which freezes
       elapsed-time bookkeeping but not the render loop itself — the
       original's requestAnimationFrame call was unconditional at the top
       of animate(), so it kept scheduling itself and re-rendering the same
       frame indefinitely while off-screen. Now the loop itself stops, and
       a document-visibility check (tab hidden) was added alongside it —
       the original had no tab-visibility handling at all.
     - No WebGL detection and no reduced-motion handling — same gaps as
       the other two engines, closed the same way here.
     - 1200 particles, 450 connection-line slots, and 16 telemetry packets
       is desktop-appropriate but heavy for low-end mobile GPUs. Counts now
       scale by device tier; the foreground/background node ratios and the
       background dust grid's aspect scale with them so the composition
       reads the same at every tier rather than just getting sparser.
     - A `scrollProgress` value was computed on every scroll event but never
       actually read anywhere in the render loop — dead code, removed.
     - `window.setVertexTransformationPhase`, a global scrubber hook, is a
       mutable-global anti-pattern in React (the same issue already
       identified and removed from the network engine) and every default
       viewing of this page never called it anyway (manualProgressOverride
       stayed null). Removed rather than reintroduced.

   The five-tier node allocation (foreground / background / spine / data
   plane / satellite modules / arterial highways), the phase timeline, the
   camera dolly, and the morph-weight easing are left exactly as provided —
   that's the actual creative content, not a defect.
───────────────────────────────────────────────────────────────────────── */

export type DeviceTier = "mobile" | "tablet" | "desktop";

const COLORS = {
  EMERALD: 0x00e5b4,
  DEEP_GREEN: 0x00614d,
  GLOW_EMERALD: 0x00c99a,
  OFF_WHITE: 0xf0f5f3,
  FOG: 0x0a0c0b,
};

// Ratios preserved from the original 1200-node desktop composition
// (80 foreground / 250 background out of 1200) so every tier keeps the
// same foreground-depth / midground-core / background-dust proportions.
const FOREGROUND_RATIO = 80 / 1200;
const BACKGROUND_RATIO = 250 / 1200;
// Original background dust formed a 25-wide grid over 250 nodes (~10 rows) —
// a 2.5:1 width:height aspect, reproduced here for any background count.
const BG_GRID_ASPECT = 2.5;

const TIER_CONFIG: Record<DeviceTier, { totalNodes: number; maxConnectLines: number; packetCount: number }> = {
  mobile:  { totalNodes: 380,  maxConnectLines: 140, packetCount: 8 },
  tablet:  { totalNodes: 700,  maxConnectLines: 260, packetCount: 12 },
  desktop: { totalNodes: 1200, maxConnectLines: 450, packetCount: 16 },
};

const TOTAL_CYCLE_DURATION = 13.0; // seconds, one full loop through all 6 phases

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export class VertexTransformationSystem {
  private container: HTMLElement;
  private deviceType: DeviceTier;
  private reducedMotion: boolean;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private masterGroup!: THREE.Group;

  private particleTex!: THREE.Texture;
  private pGeom!: THREE.BufferGeometry;
  private pMaterial!: THREE.PointsMaterial;
  private particleSystem!: THREE.Points;

  private lineGeom!: THREE.BufferGeometry;
  private lineMat!: THREE.LineBasicMaterial;
  private lineMesh!: THREE.LineSegments;

  private frameGroup!: THREE.Group;
  private moduleFrames: THREE.LineSegments[] = [];

  private trussGeom!: THREE.BufferGeometry;
  private trussMat!: THREE.LineBasicMaterial;
  private trussMesh!: THREE.LineSegments;

  private packetGeom!: THREE.BufferGeometry;
  private packetMat!: THREE.PointsMaterial;
  private packetSystem!: THREE.Points;

  private totalNodes: number;
  private maxConnectLines: number;
  private packetCount: number;
  private foregroundCount: number;
  private backgroundCount: number;

  private fragPos!: Float32Array;
  private structPos!: Float32Array;
  private tierArray!: Float32Array;

  private clock = new THREE.Clock();
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  private animationFrameId: number | null = null;
  private isTabVisible = true;
  private isInViewport = true;
  private intersectionObserver: IntersectionObserver | null = null;

  private get isRunnable(): boolean {
    return this.isTabVisible && this.isInViewport;
  }

  private resumeIfNeeded = () => {
    if (this.isRunnable && this.animationFrameId === null && !this.reducedMotion) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };

  private onVisibilityChange = () => {
    this.isTabVisible = document.visibilityState === "visible";
    this.resumeIfNeeded();
  };

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    if (rect.width && rect.height) {
      this.mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      this.mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
  };

  constructor(container: HTMLElement, deviceType: DeviceTier = "desktop", reducedMotion = false) {
    if (!isWebGLAvailable()) {
      throw new Error("WebGL is not available in this browser/context.");
    }
    this.container = container;
    this.deviceType = deviceType;
    this.reducedMotion = reducedMotion;

    const cfg = TIER_CONFIG[deviceType];
    this.totalNodes = cfg.totalNodes;
    this.maxConnectLines = cfg.maxConnectLines;
    this.packetCount = cfg.packetCount;
    this.foregroundCount = Math.round(this.totalNodes * FOREGROUND_RATIO);
    this.backgroundCount = Math.round(this.totalNodes * BACKGROUND_RATIO);

    this.init();
  }

  private createCircularNodeTexture(): THREE.Texture {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    g.addColorStop(0.25, "rgba(0, 201, 154, 0.95)");
    g.addColorStop(0.55, "rgba(0, 229, 180, 0.4)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.Texture(c);
    tex.needsUpdate = true;
    return tex;
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(COLORS.FOG, 0.028);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.6, 18);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Lighting — directional technical lighting, no neon wash
    this.scene.add(new THREE.AmbientLight(COLORS.DEEP_GREEN, 1.2));
    const keyLight = new THREE.DirectionalLight(COLORS.EMERALD, 2.4);
    keyLight.position.set(6, 12, 10);
    this.scene.add(keyLight);
    const fillLight = new THREE.PointLight(COLORS.GLOW_EMERALD, 2.8, 30);
    fillLight.position.set(-8, -4, 6);
    this.scene.add(fillLight);

    this.masterGroup = new THREE.Group();
    this.scene.add(this.masterGroup);

    this.setupParticles();
    this.setupLines();
    this.setupModuleFrames();
    this.setupTruss();
    this.setupPackets();

    window.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("visibilitychange", this.onVisibilityChange);

    if ("IntersectionObserver" in window) {
      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          this.isInViewport = entry.isIntersecting;
          if (!this.isInViewport && this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          } else {
            this.resumeIfNeeded();
          }
        },
        { threshold: 0.1 }
      );
      this.intersectionObserver.observe(this.container);
    }

    if (this.reducedMotion) {
      this.renderStaticSystemFrame();
    } else {
      this.animate();
    }
  }

  private setupParticles() {
    const N = this.totalNodes;
    const fg = this.foregroundCount;
    const bg = this.backgroundCount;
    const mid = N - fg - bg;

    this.particleTex = this.createCircularNodeTexture();
    this.pGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(N * 3);
    this.fragPos = new Float32Array(N * 3);
    this.structPos = new Float32Array(N * 3);
    const colArray = new Float32Array(N * 3);
    const sizeArray = new Float32Array(N);
    this.tierArray = new Float32Array(N);

    // 5 discrete functional subsystems for the fragmented state:
    // CRM/Events, Core Data & Pipelines, AI & Inference, APIs & Automation,
    // Legacy Databases (dispersed).
    const clusterCenters = [
      [-6.5, 4.2, -3.0],
      [7.0, 3.8, -2.5],
      [-5.8, -3.8, 1.5],
      [6.2, -4.2, 0.5],
      [0.0, 1.0, -4.5],
    ];

    // Background dust reproduces the original's 25-wide/10-tall grid
    // aspect at whatever count this tier uses.
    const bgCols = Math.max(1, Math.round(Math.sqrt(bg * BG_GRID_ASPECT)));
    const bgRows = Math.max(1, Math.ceil(bg / bgCols));

    for (let i = 0; i < N; i++) {
      const idx = i * 3;
      let tier = 1; // default midground

      if (i < fg) tier = 0;
      else if (i > N - bg) tier = 2;
      this.tierArray[i] = tier;

      // 1. Fragmented positions (chaotic clusters, broken modules)
      if (tier === 0) {
        this.fragPos[idx] = (Math.random() - 0.5) * 18;
        this.fragPos[idx + 1] = (Math.random() - 0.5) * 12;
        this.fragPos[idx + 2] = Math.random() * 8 + 4;
        sizeArray[i] = Math.random() * 0.45 + 0.35;
      } else if (tier === 2) {
        this.fragPos[idx] = (Math.random() - 0.5) * 32;
        this.fragPos[idx + 1] = (Math.random() - 0.5) * 22;
        this.fragPos[idx + 2] = -(Math.random() * 14 + 10);
        sizeArray[i] = Math.random() * 0.18 + 0.08;
      } else {
        const cIndex = i % 5;
        const cc = clusterCenters[cIndex];
        const spread = cIndex === 4 ? 3.5 : 2.0;
        this.fragPos[idx] = cc[0] + (Math.random() - 0.5) * spread;
        this.fragPos[idx + 1] = cc[1] + (Math.random() - 0.5) * spread;
        this.fragPos[idx + 2] = cc[2] + (Math.random() - 0.5) * (spread * 0.8);
        sizeArray[i] = Math.random() * 0.28 + 0.16;
      }

      posArray[idx] = this.fragPos[idx];
      posArray[idx + 1] = this.fragPos[idx + 1];
      posArray[idx + 2] = this.fragPos[idx + 2];

      // 2. Target structured positions (engineered reconstructed architecture)
      if (tier === 0) {
        const angle = (i / fg) * Math.PI * 2;
        this.structPos[idx] = Math.cos(angle) * 8.5;
        this.structPos[idx + 1] = Math.sin(angle) * 5.2;
        this.structPos[idx + 2] = 2.0 + Math.sin(angle * 3) * 0.5;
      } else if (tier === 2) {
        const bgIdx = i - (N - bg);
        const col = (bgIdx % bgCols) - bgCols / 2;
        const row = Math.floor(bgIdx / bgCols) - bgRows / 2;
        this.structPos[idx] = col * 1.2;
        this.structPos[idx + 1] = row * 1.2;
        this.structPos[idx + 2] = -12.0;
      } else {
        const midIdx = i - fg;
        const normalized = midIdx / mid;

        if (midIdx % 6 === 0) {
          // Spine / angular central truss (subtle 58° Vertex angular DNA)
          const side = midIdx % 12 === 0 ? -1 : 1;
          const armT = (midIdx % 120) / 120;
          this.structPos[idx] = side * (armT * 4.2 + 0.1);
          this.structPos[idx + 1] = armT * 6.0 - 3.0;
          this.structPos[idx + 2] = -0.5 + Math.cos(armT * Math.PI) * 0.4;
        } else if (midIdx % 6 === 1 || midIdx % 6 === 2) {
          // High-volume data plane / tier-1 integrated core base
          const layer = Math.floor(normalized * 5);
          const yLevel = layer * 1.4 - 2.8;
          const xSpan = 5.5 - Math.abs(yLevel) * 0.6;
          this.structPos[idx] = (Math.random() - 0.5) * 2 * xSpan;
          this.structPos[idx + 1] = yLevel;
          this.structPos[idx + 2] = (Math.random() - 0.5) * 1.6;
        } else if (midIdx % 6 === 3 || midIdx % 6 === 4) {
          // Integrated micro-modules: 4 satellite nodes locked onto rails
          const rail = midIdx % 4;
          const railCoords = [
            [-3.5, 2.0, 0.5],
            [3.5, 2.0, 0.5],
            [-2.8, -1.8, 0.8],
            [2.8, -1.8, 0.8],
          ];
          const rc = railCoords[rail];
          const offsetR = Math.random() * 0.85;
          const theta = Math.random() * Math.PI * 2;
          this.structPos[idx] = rc[0] + Math.cos(theta) * offsetR;
          this.structPos[idx + 1] = rc[1] + Math.sin(theta) * offsetR;
          this.structPos[idx + 2] = rc[2] + (Math.random() - 0.5) * 0.6;
        } else {
          // Inter-system highway connectors (arterial channels)
          const prog = (midIdx % 50) / 50;
          const pathSel = midIdx % 3;
          if (pathSel === 0) {
            this.structPos[idx] = (prog - 0.5) * 7.0;
            this.structPos[idx + 1] = 0.0;
            this.structPos[idx + 2] = 0.0;
          } else if (pathSel === 1) {
            this.structPos[idx] = -1.8;
            this.structPos[idx + 1] = (prog - 0.5) * 5.6;
            this.structPos[idx + 2] = 0.4;
          } else {
            this.structPos[idx] = 1.8;
            this.structPos[idx + 1] = (prog - 0.5) * 5.6;
            this.structPos[idx + 2] = 0.4;
          }
        }
      }

      // Color distribution: emerald gradient with off-white telemetry highlights
      const isHighlight = Math.random() > 0.82;
      const isDeep = Math.random() > 0.65;
      const col = isHighlight ? COLORS.OFF_WHITE : isDeep ? COLORS.DEEP_GREEN : COLORS.EMERALD;
      const c = new THREE.Color(col);
      colArray[idx] = c.r;
      colArray[idx + 1] = c.g;
      colArray[idx + 2] = c.b;
    }

    this.pGeom.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    this.pGeom.setAttribute("color", new THREE.BufferAttribute(colArray, 3));
    this.pGeom.setAttribute("size", new THREE.BufferAttribute(sizeArray, 1));

    this.pMaterial = new THREE.PointsMaterial({
      size: 0.38,
      map: this.particleTex,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.particleSystem = new THREE.Points(this.pGeom, this.pMaterial);
    this.masterGroup.add(this.particleSystem);
  }

  private setupLines() {
    this.lineGeom = new THREE.BufferGeometry();
    const linePos = new Float32Array(this.maxConnectLines * 2 * 3);
    const lineCol = new Float32Array(this.maxConnectLines * 2 * 3);
    this.lineGeom.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    this.lineGeom.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));

    this.lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.lineMesh = new THREE.LineSegments(this.lineGeom, this.lineMat);
    this.masterGroup.add(this.lineMesh);
  }

  private setupModuleFrames() {
    this.frameGroup = new THREE.Group();
    this.masterGroup.add(this.frameGroup);

    const create = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const bGeom = new THREE.BoxGeometry(w, h, d);
      const edges = new THREE.EdgesGeometry(bGeom);
      bGeom.dispose(); // only needed transiently to derive the edges geometry
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: COLORS.DEEP_GREEN, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending })
      );
      line.position.set(x, y, z);
      this.frameGroup.add(line);
      this.moduleFrames.push(line);
    };

    // 4 enterprise subsystem frameworks + 1 central bus frame, fading in
    // during reconstruction/integration.
    create(2.2, 1.8, 1.2, -3.5, 2.0, 0.5);
    create(2.2, 1.8, 1.2, 3.5, 2.0, 0.5);
    create(2.4, 1.6, 1.2, -2.8, -1.8, 0.8);
    create(2.4, 1.6, 1.2, 2.8, -1.8, 0.8);
    create(4.8, 0.25, 2.0, 0.0, 0.0, 0.0);
  }

  private setupTruss() {
    // Precision 58° apex truss — subtle Vertex brand reference, illuminates
    // once the architecture is fully stabilized.
    this.trussGeom = new THREE.BufferGeometry();
    const verts = new Float32Array([
      -4.2, 3.0, -0.5, 0.0, -3.0, 0.2,
      4.2, 3.0, -0.5, 0.0, -3.0, 0.2,
      -4.2, 3.0, -0.5, 4.2, 3.0, -0.5,
    ]);
    this.trussGeom.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    this.trussMat = new THREE.LineBasicMaterial({ color: COLORS.EMERALD, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
    this.trussMesh = new THREE.LineSegments(this.trussGeom, this.trussMat);
    this.masterGroup.add(this.trussMesh);
  }

  private setupPackets() {
    this.packetGeom = new THREE.BufferGeometry();
    const packetPos = new Float32Array(this.packetCount * 3);
    const packetColors = new Float32Array(this.packetCount * 3);
    const glow = new THREE.Color(COLORS.GLOW_EMERALD);
    for (let p = 0; p < this.packetCount; p++) {
      packetColors[p * 3] = glow.r;
      packetColors[p * 3 + 1] = glow.g;
      packetColors[p * 3 + 2] = glow.b;
    }
    this.packetGeom.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
    this.packetGeom.setAttribute("color", new THREE.BufferAttribute(packetColors, 3));
    this.packetMat = new THREE.PointsMaterial({
      size: 0.55,
      map: this.particleTex,
      transparent: true,
      opacity: 0.0,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.packetSystem = new THREE.Points(this.packetGeom, this.packetMat);
    this.masterGroup.add(this.packetSystem);
  }

  /** Phase progress (0–1) at a given point in the 13s loop. */
  private phaseProgressAt(elapsedTime: number): number {
    return (elapsedTime % TOTAL_CYCLE_DURATION) / TOTAL_CYCLE_DURATION;
  }

  /** Morph weight (0 = fully fragmented, 1 = fully reconstructed) for a phase progress value. */
  private morphWeightAt(phaseProgress: number): number {
    if (phaseProgress < 0.15) return 0.0;
    if (phaseProgress < 0.3) {
      const t = (phaseProgress - 0.15) / 0.15;
      return t * 0.18;
    }
    if (phaseProgress < 0.55) {
      const t = (phaseProgress - 0.3) / 0.25;
      return 0.18 + t * t * (3.0 - 2.0 * t) * 0.72;
    }
    if (phaseProgress < 0.75) {
      const t = (phaseProgress - 0.55) / 0.2;
      return 0.9 + t * 0.1;
    }
    return 1.0;
  }

  /** Renders one fully-settled "SYSTEM" frame for prefers-reduced-motion, with no loop. */
  private renderStaticSystemFrame() {
    const N = this.totalNodes;
    const posArr = this.pGeom.attributes.position.array as Float32Array;
    posArr.set(this.structPos);
    this.pGeom.attributes.position.needsUpdate = true;

    const lPos = this.lineGeom.attributes.position.array as Float32Array;
    const lCol = this.lineGeom.attributes.color.array as Float32Array;
    let lineIdx = 0;
    const stepSample = 3;
    const midStart = this.foregroundCount;
    const midEnd = N - this.backgroundCount;
    for (let i = midStart; i < midEnd; i += stepSample) {
      if (lineIdx >= this.maxConnectLines) break;
      const idxA = i * 3;
      const neighbor = midStart + ((i - midStart + 13) % (midEnd - midStart));
      const idxB = neighbor * 3;
      const dx = posArr[idxA] - posArr[idxB];
      const dy = posArr[idxA + 1] - posArr[idxB + 1];
      const dz = posArr[idxA + 2] - posArr[idxB + 2];
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < 3.6) {
        const lp = lineIdx * 6;
        lPos[lp] = posArr[idxA]; lPos[lp + 1] = posArr[idxA + 1]; lPos[lp + 2] = posArr[idxA + 2];
        lPos[lp + 3] = posArr[idxB]; lPos[lp + 4] = posArr[idxB + 1]; lPos[lp + 5] = posArr[idxB + 2];
        const alpha = Math.max(0.1, 1.0 - Math.sqrt(distSq) / Math.sqrt(3.6)) * 0.9;
        const deep = new THREE.Color(COLORS.DEEP_GREEN);
        const emerald = new THREE.Color(COLORS.EMERALD);
        const glow = new THREE.Color(COLORS.GLOW_EMERALD);
        lCol[lp] = deep.r * alpha; lCol[lp + 1] = emerald.g * alpha; lCol[lp + 2] = emerald.b * alpha;
        lCol[lp + 3] = emerald.r * alpha * 0.7; lCol[lp + 4] = glow.g * alpha; lCol[lp + 5] = glow.b * alpha;
        lineIdx++;
      }
    }
    for (let j = lineIdx * 6; j < this.maxConnectLines * 6; j++) { lPos[j] = 0; lCol[j] = 0; }
    this.lineGeom.attributes.position.needsUpdate = true;
    this.lineGeom.attributes.color.needsUpdate = true;

    this.moduleFrames.forEach((frame) => { (frame.material as THREE.LineBasicMaterial).opacity = 0.55; });
    this.trussMat.opacity = 0.75;
    this.packetMat.opacity = 0.0; // no in-flight packets in a single still frame

    this.camera.position.set(0, 1.6, 14.5);
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }

  public resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (this.reducedMotion) this.renderStaticSystemFrame();
  }

  private animate = () => {
    if (!this.isRunnable) { this.animationFrameId = null; return; }

    const elapsedTime = this.clock.getElapsedTime();
    const phaseProgress = this.phaseProgressAt(elapsedTime);

    // Documentary-style camera: restrained mouse-driven yaw/pitch plus a
    // slow dolly that pushes in during reconstruction and eases back out.
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    let targetCamZ: number;
    if (phaseProgress < 0.25) {
      targetCamZ = 18.0 - (phaseProgress / 0.25) * 1.5;
    } else if (phaseProgress < 0.65) {
      targetCamZ = 16.5 - ((phaseProgress - 0.25) / 0.4) * 2.5;
    } else {
      targetCamZ = 14.0 + ((phaseProgress - 0.65) / 0.35) * 1.5;
    }
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.04;
    this.camera.position.x = this.mouse.x * 0.9;
    this.camera.position.y = 1.6 + this.mouse.y * 0.6;
    this.camera.lookAt(0, 0, 0);

    const morphWeight = this.morphWeightAt(phaseProgress);

    const posArr = this.pGeom.attributes.position.array as Float32Array;
    const colArr = this.pGeom.attributes.color.array as Float32Array;
    const noiseAmp = (1.0 - morphWeight) * 0.08 + 0.015;
    const N = this.totalNodes;

    for (let i = 0; i < N; i++) {
      const idx = i * 3;
      const fx = this.fragPos[idx], fy = this.fragPos[idx + 1], fz = this.fragPos[idx + 2];
      const sx = this.structPos[idx], sy = this.structPos[idx + 1], sz = this.structPos[idx + 2];

      const targetX = fx + (sx - fx) * morphWeight;
      const targetY = fy + (sy - fy) * morphWeight;
      const targetZ = fz + (sz - fz) * morphWeight;

      const timeOffset = elapsedTime * 1.2 + i * 0.25;
      const floatX = Math.sin(timeOffset) * noiseAmp;
      const floatY = Math.cos(timeOffset * 0.8) * noiseAmp;
      const floatZ = Math.sin(timeOffset * 0.6) * (noiseAmp * 0.8);

      posArr[idx] += (targetX + floatX - posArr[idx]) * 0.065;
      posArr[idx + 1] += (targetY + floatY - posArr[idx + 1]) * 0.065;
      posArr[idx + 2] += (targetZ + floatZ - posArr[idx + 2]) * 0.065;

      // Phase 2: analysis scan wave sweeping along the x-axis
      if (phaseProgress >= 0.15 && phaseProgress < 0.35) {
        const scanX = -9.0 + ((phaseProgress - 0.15) / 0.2) * 18.0;
        const distFromScan = Math.abs(posArr[idx] - scanX);
        if (distFromScan < 1.4) {
          const scanPulse = 1.0 - distFromScan / 1.4;
          const glow = COLORS.GLOW_EMERALD;
          const gr = ((glow >> 16) & 255) / 255, gg = ((glow >> 8) & 255) / 255, gb = (glow & 255) / 255;
          colArr[idx] = Math.min(1.0, gr + scanPulse * 0.6);
          colArr[idx + 1] = Math.min(1.0, gg + scanPulse * 0.6);
          colArr[idx + 2] = Math.min(1.0, gb + scanPulse * 0.6);
        }
      }
    }
    this.pGeom.attributes.position.needsUpdate = true;
    this.pGeom.attributes.color.needsUpdate = true;

    // Telemetry connections between synchronized midground nodes —
    // threshold shrinks as the architecture hardens for crisp clean lines.
    let lineIdx = 0;
    const lPos = this.lineGeom.attributes.position.array as Float32Array;
    const lCol = this.lineGeom.attributes.color.array as Float32Array;
    const maxDistSq = morphWeight > 0.6 ? 3.6 : morphWeight > 0.2 ? 2.4 : 1.6;
    const stepSample = morphWeight > 0.6 ? 3 : 5;
    const midStart = this.foregroundCount;
    const midEnd = N - this.backgroundCount;
    const midSpan = midEnd - midStart;

    const deep = new THREE.Color(COLORS.DEEP_GREEN);
    const emerald = new THREE.Color(COLORS.EMERALD);
    const glowC = new THREE.Color(COLORS.GLOW_EMERALD);

    for (let i = midStart; i < midEnd; i += stepSample) {
      if (lineIdx >= this.maxConnectLines) break;
      const idxA = i * 3;
      const neighbor = midStart + ((i - midStart + 13) % midSpan);
      const idxB = neighbor * 3;

      const dx = posArr[idxA] - posArr[idxB];
      const dy = posArr[idxA + 1] - posArr[idxB + 1];
      const dz = posArr[idxA + 2] - posArr[idxB + 2];
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < maxDistSq) {
        const lp = lineIdx * 6;
        lPos[lp] = posArr[idxA]; lPos[lp + 1] = posArr[idxA + 1]; lPos[lp + 2] = posArr[idxA + 2];
        lPos[lp + 3] = posArr[idxB]; lPos[lp + 4] = posArr[idxB + 1]; lPos[lp + 5] = posArr[idxB + 2];

        const alpha = Math.max(0.1, 1.0 - Math.sqrt(distSq) / Math.sqrt(maxDistSq)) * (0.2 + morphWeight * 0.7);
        lCol[lp] = deep.r * alpha; lCol[lp + 1] = emerald.g * alpha; lCol[lp + 2] = emerald.b * alpha;
        lCol[lp + 3] = emerald.r * alpha * 0.7; lCol[lp + 4] = glowC.g * alpha; lCol[lp + 5] = glowC.b * alpha;
        lineIdx++;
      }
    }
    for (let j = lineIdx * 6; j < this.maxConnectLines * 6; j++) { lPos[j] = 0; lCol[j] = 0; }
    this.lineGeom.attributes.position.needsUpdate = true;
    this.lineGeom.attributes.color.needsUpdate = true;

    // Subsystem wireframes fade in during reconstruction/integration
    const frameOpacity = Math.max(0.0, Math.min(0.55, (morphWeight - 0.4) * 1.2));
    this.moduleFrames.forEach((frame) => { (frame.material as THREE.LineBasicMaterial).opacity = frameOpacity; });

    // Vertex angular truss illuminates once stabilized
    this.trussMat.opacity = Math.max(0.0, Math.min(0.75, (morphWeight - 0.7) * 2.5));

    // Telemetry packet pulses along arterial conduits during integration/final state
    if (phaseProgress > 0.45) {
      this.packetMat.opacity = Math.min(0.95, (phaseProgress - 0.45) * 3.0);
      const packArr = this.packetGeom.attributes.position.array as Float32Array;
      for (let p = 0; p < this.packetCount; p++) {
        const pIdx = p * 3;
        const speed = 0.8 + (p % 4) * 0.2;
        const progress = (elapsedTime * speed + p * 0.3) % 1.0;
        const route = p % 3;
        if (route === 0) {
          packArr[pIdx] = -3.5 + progress * 7.0;
          packArr[pIdx + 1] = 0.0;
          packArr[pIdx + 2] = 0.1;
        } else if (route === 1) {
          packArr[pIdx] = -3.5 + progress * 3.5;
          packArr[pIdx + 1] = 2.0 - progress * 5.0;
          packArr[pIdx + 2] = 0.5 - progress * 0.3;
        } else {
          packArr[pIdx] = 3.5 - progress * 3.5;
          packArr[pIdx + 1] = 2.0 - progress * 5.0;
          packArr[pIdx + 2] = 0.5 - progress * 0.3;
        }
      }
      this.packetGeom.attributes.position.needsUpdate = true;
    } else {
      this.packetMat.opacity = 0.0;
    }

    // Slow ambient yaw
    this.masterGroup.rotation.y = Math.sin(elapsedTime * 0.14) * 0.12;
    this.masterGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.04;

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.intersectionObserver?.disconnect();

    this.pGeom.dispose();
    this.pMaterial.dispose();
    this.particleTex.dispose();

    this.lineGeom.dispose();
    this.lineMat.dispose();

    this.moduleFrames.forEach((frame) => {
      frame.geometry.dispose();
      (frame.material as THREE.Material).dispose();
    });

    this.trussGeom.dispose();
    this.trussMat.dispose();

    this.packetGeom.dispose();
    this.packetMat.dispose();

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
