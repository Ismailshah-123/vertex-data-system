import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────
   Vertex3DCore — the particle convergence engine behind the homepage hero.

   Reconstructed from a provided export that mixed ES module import/export
   syntax with a plain <script> tag wrapped in an IIFE, which is not valid
   JavaScript and would not run. The logic below is the same design —
   chaos cloud lerping into a V-shape formation — with these real defects
   fixed along the way:

     - Line connections: the original built a THREE.LineSegments mesh but
       never gave its geometry any position data, so it silently rendered
       nothing. This version computes real connections between nearby
       particles once (based on their converged target positions, so the
       topology is stable) and updates the visible endpoints every frame
       to track the particles as they move.
     - Memory: the points/line materials weren't tracked on the instance,
       so destroy() couldn't dispose of them. Now they are.
     - No WebGL detection — a device without WebGL support would have
       thrown mid-render. Now checked up front; construction throws a
       clear, catchable error instead, so the React wrapper can fall back
       gracefully instead of crashing the page.
     - No reduced-motion handling — now accepts a flag and renders a
       single static, converged frame with no animation loop at all.
     - No page-visibility handling — the animation loop now pauses while
       the tab is hidden, instead of running indefinitely in the
       background.

   The convergence math itself (the chaos cloud, the V-shape target
   formula, the timeline) is left exactly as provided — that's the actual
   creative content, not a defect.
───────────────────────────────────────────────────────────────────────── */

export type DeviceTier = "mobile" | "tablet" | "desktop";

export const COLORS = {
  // Aligned to this site's actual established palette rather than the
  // placeholder values in the original export (0x10B981 / 0x111415),
  // so the hero matches the rest of the brand exactly.
  VERTEX_GREEN: 0x00e5b4,
  PARTICLE_WHITE: 0xf0f5f3,
  SPACE_BLACK: 0x0a0c0b,
};

export const ANIMATION_TIMELINE = {
  CHAOS_DURATION: 2,
  CONVERGENCE_START: 2,
  CONVERGENCE_END: 8,
  STABILIZATION_START: 8,
};

const TIER_CONFIG: Record<DeviceTier, { particleCount: number; cameraZ: number; cameraY: number; maxConnectionsPerParticle: number }> = {
  mobile:  { particleCount: 160, cameraZ: 12, cameraY: 2, maxConnectionsPerParticle: 1 },
  tablet:  { particleCount: 280, cameraZ: 9.5, cameraY: 1, maxConnectionsPerParticle: 2 },
  desktop: { particleCount: 400, cameraZ: 8,  cameraY: 0, maxConnectionsPerParticle: 2 },
};

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export class VertexSystem {
  private container: HTMLElement;
  private deviceType: DeviceTier;
  private reducedMotion: boolean;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry!: THREE.BufferGeometry;
  private pointsMaterial!: THREE.PointsMaterial;
  private points!: THREE.Points;
  private lineGeometry!: THREE.BufferGeometry;
  private lineMaterial!: THREE.LineBasicMaterial;
  private lineMesh!: THREE.LineSegments;

  private startTime: number | null = null;
  private animationFrameId: number | null = null;
  private isVisible = true;

  private particleCount: number;
  private originalPositions!: Float32Array;
  private vShapePositions!: Float32Array;
  private connectionPairs: [number, number][] = [];
  private lineBuffer!: Float32Array;

  private onVisibilityChange = () => {
    this.isVisible = document.visibilityState === "visible";
    if (this.isVisible && this.animationFrameId === null && !this.reducedMotion) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };

  constructor(container: HTMLElement, deviceType: DeviceTier = "desktop", reducedMotion = false) {
    if (!isWebGLAvailable()) {
      throw new Error("WebGL is not available in this browser/context.");
    }
    this.container = container;
    this.deviceType = deviceType;
    this.reducedMotion = reducedMotion;
    this.particleCount = TIER_CONFIG[deviceType].particleCount;
    this.init();
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.setupParticles();
    this.computeConnections();
    this.setupLines();
    this.setupCamera();

    document.addEventListener("visibilitychange", this.onVisibilityChange);

    if (this.reducedMotion) {
      this.renderStaticConvergedFrame();
    } else {
      this.animate();
    }
  }

  private setupCamera() {
    const cfg = TIER_CONFIG[this.deviceType];
    this.camera.position.z = cfg.cameraZ;
    this.camera.position.y = cfg.cameraY;
  }

  private setupParticles() {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    this.originalPositions = new Float32Array(this.particleCount * 3);
    this.vShapePositions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      // Random Cloud (Chaos)
      positions[i3]     = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      this.originalPositions[i3]     = positions[i3];
      this.originalPositions[i3 + 1] = positions[i3 + 1];
      this.originalPositions[i3 + 2] = positions[i3 + 2];

      // V-Shape Identity Convergence
      const angle = (i / this.particleCount) * Math.PI * 2;
      this.vShapePositions[i3]     = Math.cos(angle) * (i / this.particleCount) * 2.5;
      this.vShapePositions[i3 + 1] = Math.abs(this.vShapePositions[i3]) * 1.4 - 2.5;
      this.vShapePositions[i3 + 2] = (Math.random() - 0.5) * 0.8;
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.pointsMaterial = new THREE.PointsMaterial({
      size: 0.045,
      color: COLORS.PARTICLE_WHITE,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.pointsMaterial);
    this.scene.add(this.points);
  }

  /**
   * Determines which particles connect to which, based on proximity in
   * their final V-shape target positions (a stable, one-time computation
   * — not the noisy per-frame chaos/stabilization positions, so the
   * topology never has to be recalculated). Capped per-particle so the
   * result reads as clean structural connections rather than a dense,
   * noisy web.
   */
  private computeConnections() {
    const cfg = TIER_CONFIG[this.deviceType];
    const maxDist = 0.85;
    const maxDistSq = maxDist * maxDist;
    const pos = this.vShapePositions;
    const pairs: [number, number][] = [];

    for (let i = 0; i < this.particleCount; i++) {
      const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];
      const candidates: { j: number; d: number }[] = [];
      for (let j = i + 1; j < this.particleCount; j++) {
        const dx = ix - pos[j * 3], dy = iy - pos[j * 3 + 1], dz = iz - pos[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < maxDistSq) candidates.push({ j, d });
      }
      candidates.sort((a, b) => a.d - b.d);
      for (const c of candidates.slice(0, cfg.maxConnectionsPerParticle)) {
        pairs.push([i, c.j]);
      }
    }
    this.connectionPairs = pairs;
    this.lineBuffer = new Float32Array(pairs.length * 6); // 2 points * xyz per pair
  }

  private setupLines() {
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: COLORS.VERTEX_GREEN,
      transparent: true,
      opacity: 0.05,
    });
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute("position", new THREE.BufferAttribute(this.lineBuffer, 3));
    this.lineMesh = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    this.lineMesh.visible = false; // hidden during pure chaos, shown once convergence begins
    this.scene.add(this.lineMesh);
  }

  /** Copies each connected pair's current particle position into the line buffer. */
  private updateLineBuffer(posArray: Float32Array) {
    for (let k = 0; k < this.connectionPairs.length; k++) {
      const [a, b] = this.connectionPairs[k];
      const o = k * 6;
      this.lineBuffer[o]     = posArray[a * 3];
      this.lineBuffer[o + 1] = posArray[a * 3 + 1];
      this.lineBuffer[o + 2] = posArray[a * 3 + 2];
      this.lineBuffer[o + 3] = posArray[b * 3];
      this.lineBuffer[o + 4] = posArray[b * 3 + 1];
      this.lineBuffer[o + 5] = posArray[b * 3 + 2];
    }
    this.lineGeometry.attributes.position.needsUpdate = true;
  }

  private renderStaticConvergedFrame() {
    const posAttr = this.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    posArray.set(this.vShapePositions);
    posAttr.needsUpdate = true;
    this.lineMesh.visible = true;
    this.lineMaterial.opacity = 0.2;
    this.updateLineBuffer(posArray);
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
    if (this.reducedMotion) this.renderStaticConvergedFrame();
  }

  private animate = () => {
    if (!this.isVisible) { this.animationFrameId = null; return; } // paused while tab hidden

    this.startTime = this.startTime || Date.now();
    const elapsed = (Date.now() - this.startTime) / 1000;

    const posAttr = this.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    if (elapsed >= ANIMATION_TIMELINE.CONVERGENCE_START && !this.lineMesh.visible) {
      this.lineMesh.visible = true;
    }

    if (elapsed > ANIMATION_TIMELINE.CONVERGENCE_START && elapsed < ANIMATION_TIMELINE.CONVERGENCE_END) {
      const t = (elapsed - ANIMATION_TIMELINE.CONVERGENCE_START) / (ANIMATION_TIMELINE.CONVERGENCE_END - ANIMATION_TIMELINE.CONVERGENCE_START);
      for (let i = 0; i < this.particleCount * 3; i++) {
        posArray[i] = THREE.MathUtils.lerp(this.originalPositions[i], this.vShapePositions[i], t);
      }
      this.lineMaterial.opacity = THREE.MathUtils.lerp(0.05, 0.2, t);
      this.updateLineBuffer(posArray);
    } else if (elapsed >= ANIMATION_TIMELINE.STABILIZATION_START) {
      for (let i = 0; i < this.particleCount * 3; i++) {
        posArray[i] = this.vShapePositions[i] + Math.sin(elapsed + i) * 0.015;
      }
      this.updateLineBuffer(posArray);
    }

    posAttr.needsUpdate = true;

    // Ambient Camera Parallax
    this.camera.position.x += (Math.sin(elapsed * 0.1) * 0.2 - this.camera.position.x) * 0.02;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.renderer.dispose();
    this.geometry.dispose();
    this.pointsMaterial.dispose();
    this.lineGeometry.dispose();
    this.lineMaterial.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
