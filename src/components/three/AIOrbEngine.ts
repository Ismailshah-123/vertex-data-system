import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────
   AIOrbEngine — the rotating core/rings/node-cloud visual on the services
   page hero.

   Reconstructed from a version that loaded a second, separate copy of
   Three.js from a CDN at runtime (r128, via a global `window.THREE`)
   instead of using the `three` npm package already bundled for the other
   two 3D systems on this site. That meant every visit downloaded and
   parsed an entire extra copy of the library, pinned to a much older
   version than the rest of the app. Real defects fixed in this pass:

     - Double Three.js: now imports the same npm package as everything
       else. Zero visual change — same geometry, colors, counts, and
       animation formulas, just no second library on the wire.
     - No disposal at all beyond the renderer: the core, wireframe shell,
       three rings, 28 orbiting nodes, their connection lines, and the
       600-point particle field each created their own geometry and
       material and none of it was ever freed. Every mount/unmount cycle
       (e.g. navigating to and from the services page) leaked all of it.
       Full destroy() added, matching the other two engines.
     - A real (not just theoretical) listener leak: the original returned
       a cleanup function from *inside* the `loadThree().then(...)`
       callback. A function returned from a Promise callback isn't a
       React effect cleanup — it's simply discarded — so the mousemove
       and resize listeners it was meant to remove were never actually
       removed on unmount. Both listeners now live in the one cleanup
       path that actually runs.
     - No WebGL detection, no reduced-motion handling, no page-visibility
       or off-screen pausing — same gaps as the other two engines, closed
       the same way here for consistency.

   The orb's own geometry, materials, counts, and animation formulas are
   left exactly as provided — that's the creative content, not a defect.
───────────────────────────────────────────────────────────────────────── */

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

interface OrbitalNode {
  mesh: THREE.Mesh;
  theta: number;
  phi: number;
  speed: number;
  radius: number;
}

export class AIOrbEngine {
  private container: HTMLElement;
  private reducedMotion: boolean;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private core!: THREE.Mesh;
  private coreMat!: THREE.MeshStandardMaterial;
  private wire!: THREE.Mesh;
  private ring1!: THREE.Mesh;
  private ring2!: THREE.Mesh;
  private ring3!: THREE.Mesh;
  private nodeGroup!: THREE.Group;
  private nodeData: OrbitalNode[] = [];
  private lineGroup!: THREE.Group;
  private lineMat!: THREE.LineBasicMaterial;
  private particles!: THREE.Points;

  private t = 0;
  private targetX = 0;
  private targetY = 0;

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
    this.targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    this.targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  };

  constructor(container: HTMLElement, reducedMotion = false) {
    if (!isWebGLAvailable()) {
      throw new Error("WebGL is not available in this browser/context.");
    }
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.init();
  }

  private init() {
    const W = this.container.clientWidth || window.innerWidth;
    const H = this.container.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(W, H);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);

    this.scene.add(new THREE.AmbientLight(0x004d3a, 0.6));
    const lights: { color: number; intensity: number; pos: [number, number, number] }[] = [
      { color: 0x00e5b4, intensity: 3, pos: [3, 3, 2] },
      { color: 0x00a07a, intensity: 2, pos: [-3, -2, 1] },
      { color: 0x00ffd0, intensity: 1.5, pos: [0, 4, -2] },
    ];
    lights.forEach(({ color, intensity, pos }) => {
      const light = new THREE.PointLight(color, intensity, 20);
      light.position.set(...pos);
      this.scene.add(light);
    });

    // Core sphere
    const coreGeo = new THREE.IcosahedronGeometry(1, 6);
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x001a14,
      emissive: 0x00e5b4,
      emissiveIntensity: 0.08,
      metalness: 0.95,
      roughness: 0.05,
      wireframe: false,
    });
    this.core = new THREE.Mesh(coreGeo, this.coreMat);
    this.scene.add(this.core);

    // Wireframe shell
    const wireGeo = new THREE.IcosahedronGeometry(1.08, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5b4,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    this.wire = new THREE.Mesh(wireGeo, wireMat);
    this.scene.add(this.wire);

    // Outer energy rings
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.008, 6, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00e5b4, transparent: true, opacity: 0.4 });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI / 2;
    this.scene.add(this.ring1);

    const ring2Geo = new THREE.TorusGeometry(1.75, 0.004, 6, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00a07a, transparent: true, opacity: 0.25 });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.x = Math.PI / 3;
    this.ring2.rotation.y = Math.PI / 4;
    this.scene.add(this.ring2);

    const ring3Geo = new THREE.TorusGeometry(1.3, 0.003, 6, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x00ffd0, transparent: true, opacity: 0.15 });
    this.ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    this.ring3.rotation.x = -Math.PI / 5;
    this.ring3.rotation.z = Math.PI / 6;
    this.scene.add(this.ring3);

    // Floating nodes
    this.nodeGroup = new THREE.Group();
    const nodeCount = 28;
    for (let i = 0; i < nodeCount; i++) {
      const size = Math.random() * 0.035 + 0.012;
      const geo = Math.random() > 0.5
        ? new THREE.OctahedronGeometry(size)
        : new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshStandardMaterial({
        color: [0x00e5b4, 0x00a07a, 0x00ffd0, 0x004d3a][Math.floor(Math.random() * 4)],
        emissive: 0x00e5b4,
        emissiveIntensity: Math.random() * 0.8 + 0.2,
        metalness: 0.9,
        roughness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const radius = 1.4 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      mesh.position.setFromSphericalCoords(radius, phi, theta);
      this.nodeGroup.add(mesh);
      this.nodeData.push({ mesh, theta, phi, speed: (Math.random() - 0.5) * 0.008, radius });
    }
    this.scene.add(this.nodeGroup);

    // Connection lines between nearby nodes — one shared material, one
    // group so both are easy to find and dispose later.
    this.lineGroup = new THREE.Group();
    this.lineMat = new THREE.LineBasicMaterial({ color: 0x00e5b4, transparent: true, opacity: 0.06 });
    for (let i = 0; i < this.nodeData.length; i++) {
      for (let j = i + 1; j < this.nodeData.length; j++) {
        const d = this.nodeData[i].mesh.position.distanceTo(this.nodeData[j].mesh.position);
        if (d < 0.9) {
          const pts = [this.nodeData[i].mesh.position, this.nodeData[j].mesh.position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
          this.lineGroup.add(new THREE.Line(lineGeo, this.lineMat));
        }
      }
    }
    this.scene.add(this.lineGroup);

    // Particle field
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00e5b4,
      size: 0.018,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

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
        { threshold: 0 }
      );
      this.intersectionObserver.observe(this.container);
    }

    if (this.reducedMotion) {
      this.renderStaticFrame();
    } else {
      this.animate();
    }
  }

  private renderStaticFrame() {
    this.renderer.render(this.scene, this.camera);
  }

  public resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    if (this.reducedMotion) this.renderStaticFrame();
  }

  private animate = () => {
    if (!this.isRunnable) { this.animationFrameId = null; return; }

    this.t += 0.006;

    const pulse = 1 + Math.sin(this.t * 1.2) * 0.018;
    this.core.scale.setScalar(pulse);

    this.wire.rotation.x = this.t * 0.08;
    this.wire.rotation.y = this.t * 0.12;

    this.ring1.rotation.z = this.t * 0.3;
    this.ring2.rotation.x = Math.PI / 3 + this.t * 0.2;
    this.ring2.rotation.y = this.t * 0.15;
    this.ring3.rotation.z = -this.t * 0.25;
    this.ring3.rotation.x = -Math.PI / 5 + this.t * 0.1;

    this.nodeData.forEach((n) => {
      n.theta += n.speed;
      n.mesh.position.setFromSphericalCoords(n.radius, n.phi, n.theta);
      n.mesh.rotation.x += 0.02;
      n.mesh.rotation.y += 0.015;
    });

    this.scene.rotation.y += (this.targetX - this.scene.rotation.y) * 0.05;
    this.scene.rotation.x += (-this.targetY - this.scene.rotation.x) * 0.05;

    this.coreMat.emissiveIntensity = 0.06 + Math.sin(this.t * 0.8) * 0.04;

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  public destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.intersectionObserver?.disconnect();

    this.core.geometry.dispose();
    this.coreMat.dispose();
    this.wire.geometry.dispose();
    (this.wire.material as THREE.Material).dispose();
    for (const ring of [this.ring1, this.ring2, this.ring3]) {
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
    }
    for (const node of this.nodeData) {
      node.mesh.geometry.dispose();
      (node.mesh.material as THREE.Material).dispose();
    }
    for (const line of this.lineGroup.children as THREE.Line[]) {
      line.geometry.dispose();
    }
    this.lineMat.dispose();
    this.particles.geometry.dispose();
    (this.particles.material as THREE.Material).dispose();

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
