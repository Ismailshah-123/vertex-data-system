import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────
   Vertex3DNetwork — the multi-mode particle/network engine shared across
   pages (About, Process, and potentially Services/AI/Data pages later).

   Reconstructed from a provided export with the same structural problem
   as the homepage hero asset: import/export syntax nested inside a
   <script> tag wrapped in an IIFE, which is not valid JavaScript.

   Real defects fixed in the reconstruction:
     - No cleanup of any kind in the original — no dispose of geometry,
       materials, textures, or the renderer; no removal of the resize
       listener; the animation loop was never cancelled. For a one-off
       static HTML file that's harmless. For a React component that
       mounts and unmounts as people navigate between pages, it's a
       real and growing memory leak — every visit to About or Process
       would leave the previous WebGL context and listener running
       forever. Full destroy() added.
     - Global `window.setVertexAnimationMode` for switching modes —
       works in a static HTML file, is a real anti-pattern in React
       (mutable global state outside the component tree). Replaced
       with an instance method.
     - No WebGL detection, no reduced-motion handling, no page-
       visibility pause, no device-tier awareness — same gaps as the
       hero asset, fixed the same way here for consistency.
     - `pSizes` was computed (a size value per particle) but never
       actually attached to the geometry or used anywhere — the
       PointsMaterial only supports one uniform size for all particles,
       so per-particle sizing would need a custom shader the original
       didn't have. Removed the dead computation rather than leave
       inert code or bolt on an unverified custom shader.

   The five mode formulas (about / services / process / ai / data) are
   preserved exactly as provided — that's the actual creative content,
   not a defect. Line-network rendering in the original genuinely did
   work correctly (unlike the hero asset's empty-geometry bug), so
   nothing needed fixing there beyond scaling the line budget by tier.
───────────────────────────────────────────────────────────────────────── */

export type VertexNetworkMode = "about" | "services" | "process" | "ai" | "data";
export type DeviceTier = "mobile" | "tablet" | "desktop";

const MODE_INDEX: Record<VertexNetworkMode, number> = {
  about: 0,
  services: 1,
  process: 2,
  ai: 3,
  data: 4,
};

const COLORS = {
  // Aligned to this site's established palette (0x00e5b4) rather than the
  // provided placeholder (0x10b981), matching the hero asset's treatment.
  EMERALD: 0x00e5b4,
  EMERALD_DIM: 0x00614d,
  OFF_WHITE: 0xf0f5f3,
  FOG: 0x0a0c0b,
};

const TIER_CONFIG: Record<DeviceTier, { particleCount: number; maxLines: number }> = {
  mobile:  { particleCount: 350, maxLines: 140 },
  tablet:  { particleCount: 600, maxLines: 240 },
  desktop: { particleCount: 950, maxLines: 380 },
};

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export class VertexNetworkSystem {
  private container: HTMLElement;
  private deviceType: DeviceTier;
  private reducedMotion: boolean;
  private particleCount: number;
  private maxLines: number;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private masterGroup!: THREE.Group;
  private pGeom!: THREE.BufferGeometry;
  private pMaterial!: THREE.PointsMaterial;
  private pointsMesh!: THREE.Points;
  private particleTexture!: THREE.Texture;
  private lineGeom!: THREE.BufferGeometry;
  private lineMaterial!: THREE.LineBasicMaterial;
  private linesMesh!: THREE.LineSegments;
  private orbitalRing!: THREE.Mesh;
  private ringGeom!: THREE.RingGeometry;
  private ringMat!: THREE.MeshBasicMaterial;

  private pTarget!: Float32Array;
  private pOrigin!: Float32Array;

  private currentMode = 0;
  private time = 0;
  private animationFrameId: number | null = null;
  private isVisible = true;
  private resizeObserver: ResizeObserver | null = null;

  private onVisibilityChange = () => {
    this.isVisible = document.visibilityState === "visible";
    if (this.isVisible && this.animationFrameId === null && !this.reducedMotion) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };

  constructor(
    container: HTMLElement,
    deviceType: DeviceTier = "desktop",
    reducedMotion = false,
    initialMode: VertexNetworkMode = "about"
  ) {
    if (!isWebGLAvailable()) {
      throw new Error("WebGL is not available in this browser/context.");
    }
    this.container = container;
    this.deviceType = deviceType;
    this.reducedMotion = reducedMotion;
    const cfg = TIER_CONFIG[deviceType];
    this.particleCount = cfg.particleCount;
    this.maxLines = cfg.maxLines;
    this.currentMode = MODE_INDEX[initialMode];
    this.init();
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(COLORS.FOG, 0.035);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.2, 16);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    this.scene.add(new THREE.AmbientLight(COLORS.EMERALD_DIM, 1.2));
    const dirLight = new THREE.DirectionalLight(COLORS.EMERALD, 2.5);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x34d399, 3, 25);
    pointLight.position.set(0, 2, 4);
    this.scene.add(pointLight);

    this.masterGroup = new THREE.Group();
    this.scene.add(this.masterGroup);

    this.setupParticles();
    this.setupLines();
    this.setupOrbitalRing();
    this.updateTargetsForMode(this.currentMode);

    document.addEventListener("visibilitychange", this.onVisibilityChange);

    if (this.reducedMotion) {
      this.renderStaticFrame();
    } else {
      this.animate();
    }
  }

  private createParticleTexture(): THREE.Texture {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.25, "rgba(0, 229, 180, 0.9)");
    gradient.addColorStop(0.6, "rgba(0, 97, 77, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private setupParticles() {
    this.particleTexture = this.createParticleTexture();
    this.pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(this.particleCount * 3);
    this.pOrigin = new Float32Array(this.particleCount * 3);
    this.pTarget = new Float32Array(this.particleCount * 3);
    const pColors = new Float32Array(this.particleCount * 3);

    const emeraldColor = new THREE.Color(COLORS.EMERALD);
    const offWhite = new THREE.Color(COLORS.OFF_WHITE);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      pPos[i3]     = (Math.random() - 0.5) * 16;
      pPos[i3 + 1] = (Math.random() - 0.5) * 12;
      pPos[i3 + 2] = (Math.random() - 0.5) * 10;

      this.pOrigin[i3] = pPos[i3];
      this.pOrigin[i3 + 1] = pPos[i3 + 1];
      this.pOrigin[i3 + 2] = pPos[i3 + 2];
      this.pTarget[i3] = pPos[i3];
      this.pTarget[i3 + 1] = pPos[i3 + 1];
      this.pTarget[i3 + 2] = pPos[i3 + 2];

      const col = Math.random() > 0.3 ? emeraldColor : offWhite;
      pColors[i3] = col.r;
      pColors[i3 + 1] = col.g;
      pColors[i3 + 2] = col.b;
    }

    this.pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    this.pGeom.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

    this.pMaterial = new THREE.PointsMaterial({
      size: 0.32,
      map: this.particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.pointsMesh = new THREE.Points(this.pGeom, this.pMaterial);
    this.masterGroup.add(this.pointsMesh);
  }

  private setupLines() {
    this.lineGeom = new THREE.BufferGeometry();
    const linePositions = new Float32Array(this.maxLines * 2 * 3);
    const lineColors = new Float32Array(this.maxLines * 2 * 3);
    this.lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    this.lineGeom.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    this.lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.linesMesh = new THREE.LineSegments(this.lineGeom, this.lineMaterial);
    this.masterGroup.add(this.linesMesh);
  }

  private setupOrbitalRing() {
    this.ringGeom = new THREE.RingGeometry(4.5, 4.54, 64);
    this.ringMat = new THREE.MeshBasicMaterial({ color: COLORS.EMERALD_DIM, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    this.orbitalRing = new THREE.Mesh(this.ringGeom, this.ringMat);
    this.orbitalRing.rotation.x = Math.PI / 2.3;
    this.masterGroup.add(this.orbitalRing);
  }

  /** Target-position formulas for each mode — preserved as provided. */
  private updateTargetsForMode(mode: number) {
    const R = 4.2;
    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      const normI = i / this.particleCount;

      if (mode === 0) {
        // ABOUT — global network sphere with a subtle V-convergence cluster
        const phi = Math.acos(-1 + (2 * i) / this.particleCount);
        const theta = Math.sqrt(this.particleCount * Math.PI) * phi;
        let x = R * Math.cos(theta) * Math.sin(phi);
        let y = R * Math.sin(theta) * Math.sin(phi);
        let z = R * Math.cos(phi);

        if (i < 160) {
          const t = i / 160;
          const side = i % 2 === 0 ? 1 : -1;
          x = side * (t * 2.5);
          y = t * 3.2 - 1.6;
          z = Math.sqrt(Math.max(0, R * R - x * x - y * y)) + 0.15;
        }
        this.pTarget[idx] = x;
        this.pTarget[idx + 1] = y;
        this.pTarget[idx + 2] = z;

      } else if (mode === 1) {
        // SERVICES — five system clusters merging into a V conduit
        const cluster = i % 5;
        const clusterCenters = [
          [-3.2, 2.5, -0.5],
          [3.2, 2.5, -0.5],
          [-1.8, -0.2, 0.8],
          [1.8, -0.2, 0.8],
          [0.0, -2.4, 1.2],
        ];
        const cc = clusterCenters[cluster];
        const spread = 1.1;
        if (i > this.particleCount - 200) {
          const frac = (i - (this.particleCount - 200)) / 200;
          const side = i % 2 === 0 ? -1 : 1;
          this.pTarget[idx] = side * frac * 3.6;
          this.pTarget[idx + 1] = frac * 4.8 - 2.4;
          this.pTarget[idx + 2] = Math.sin(frac * Math.PI) * 0.8;
        } else {
          this.pTarget[idx] = cc[0] + (Math.random() - 0.5) * spread;
          this.pTarget[idx + 1] = cc[1] + (Math.random() - 0.5) * spread;
          this.pTarget[idx + 2] = cc[2] + (Math.random() - 0.5) * spread;
        }

      } else if (mode === 2) {
        // PROCESS — seven pipeline stages funneling into a resolved V
        const stage = Math.floor(normI * 7);
        const stageY = 3.8 - stage * 1.15;
        const stageWidth = (7 - stage) * 0.65;
        const angle = ((i % 32) / 32) * Math.PI * 2;
        const radius = (Math.random() * 0.4 + 0.1) * stageWidth;

        if (stage >= 5) {
          const side = i % 2 === 0 ? 1 : -1;
          const progressInV = (i % 50) / 50;
          this.pTarget[idx] = side * (progressInV * 2.2);
          this.pTarget[idx + 1] = progressInV * 3.5 - 3.2;
          this.pTarget[idx + 2] = (Math.random() - 0.5) * 0.4;
        } else {
          this.pTarget[idx] = Math.cos(angle) * radius;
          this.pTarget[idx + 1] = stageY + (Math.random() - 0.5) * 0.25;
          this.pTarget[idx + 2] = Math.sin(angle) * radius;
        }

      } else if (mode === 3) {
        // AI — multi-layer decision nodes converging
        const t = (i % 70) / 70;
        const side = i % 2 === 0 ? -1 : 1;
        const vArmX = side * (t * 3.5 + 0.2);
        const vArmY = t * 4.5 - 2.2;
        const noise = (Math.random() - 0.5) * (1.8 - t * 1.5);

        this.pTarget[idx] = vArmX + noise;
        this.pTarget[idx + 1] = vArmY + (Math.random() - 0.5) * 0.5;
        this.pTarget[idx + 2] = (Math.random() - 0.5) * 2.5 * (1.1 - t * 0.8);

      } else {
        // DATA — chaos resolving into a pristine architectural lattice
        const side = i % 2 === 0 ? -1 : 1;
        const step = Math.floor(i / 2) / (this.particleCount / 2);
        this.pTarget[idx] = side * step * 3.8;
        this.pTarget[idx + 1] = step * 5.0 - 2.5;
        this.pTarget[idx + 2] = Math.cos(step * 12.0) * 0.5;
      }
    }
  }

  /** Switch mode at runtime — replaces the original's global window function. */
  public setMode(mode: VertexNetworkMode) {
    this.currentMode = MODE_INDEX[mode];
    this.updateTargetsForMode(this.currentMode);
    if (this.reducedMotion) this.renderStaticFrame();
  }

  private renderStaticFrame() {
    const positions = this.pGeom.attributes.position.array as Float32Array;
    positions.set(this.pTarget);
    this.pGeom.attributes.position.needsUpdate = true;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }

  public resize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    if (this.reducedMotion) this.renderStaticFrame();
  }

  private animate = () => {
    if (!this.isVisible) { this.animationFrameId = null; return; }

    this.time += 0.015;
    const positions = this.pGeom.attributes.position.array as Float32Array;
    const linePos = this.lineGeom.attributes.position.array as Float32Array;
    const lineCol = this.lineGeom.attributes.color.array as Float32Array;
    let lineIdx = 0;

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      const tx = this.pTarget[idx] + Math.sin(this.time * 1.5 + i * 0.1) * 0.04;
      const ty = this.pTarget[idx + 1] + Math.cos(this.time * 1.2 + i * 0.15) * 0.04;
      const tz = this.pTarget[idx + 2] + Math.sin(this.time * 0.9 + i * 0.08) * 0.04;

      positions[idx]     += (tx - positions[idx]) * 0.045;
      positions[idx + 1] += (ty - positions[idx + 1]) * 0.045;
      positions[idx + 2] += (tz - positions[idx + 2]) * 0.045;

      if (lineIdx < this.maxLines && i % 4 === 0) {
        const neighborIdx = ((i + 7) % this.particleCount) * 3;
        const dx = positions[idx] - positions[neighborIdx];
        const dy = positions[idx + 1] - positions[neighborIdx + 1];
        const dz = positions[idx + 2] - positions[neighborIdx + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 2.5) {
          const lPoint = lineIdx * 6;
          linePos[lPoint] = positions[idx];
          linePos[lPoint + 1] = positions[idx + 1];
          linePos[lPoint + 2] = positions[idx + 2];
          linePos[lPoint + 3] = positions[neighborIdx];
          linePos[lPoint + 4] = positions[neighborIdx + 1];
          linePos[lPoint + 5] = positions[neighborIdx + 2];

          const alpha = Math.max(0.1, 1.0 - Math.sqrt(distSq) / 1.6);
          lineCol[lPoint] = 0.06;
          lineCol[lPoint + 1] = 0.72 * alpha;
          lineCol[lPoint + 2] = 0.5 * alpha;
          lineCol[lPoint + 3] = 0.02;
          lineCol[lPoint + 4] = 0.58 * alpha;
          lineCol[lPoint + 5] = 0.4 * alpha;
          lineIdx++;
        }
      }
    }

    for (let j = lineIdx * 6; j < this.maxLines * 6; j++) {
      linePos[j] = 0;
      lineCol[j] = 0;
    }

    this.pGeom.attributes.position.needsUpdate = true;
    this.lineGeom.attributes.position.needsUpdate = true;
    this.lineGeom.attributes.color.needsUpdate = true;

    this.masterGroup.rotation.y = Math.sin(this.time * 0.18) * 0.35 + this.time * 0.04;
    this.masterGroup.rotation.x = Math.sin(this.time * 0.12) * 0.08;
    this.orbitalRing.rotation.z += 0.002;

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /** Full cleanup — entirely absent from the original. */
  public destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.resizeObserver?.disconnect();

    this.pGeom.dispose();
    this.pMaterial.dispose();
    this.particleTexture.dispose();
    this.lineGeom.dispose();
    this.lineMaterial.dispose();
    this.ringGeom.dispose();
    this.ringMat.dispose();
    this.renderer.dispose();

    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
