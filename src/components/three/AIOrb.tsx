"use client";

import { useEffect, useRef } from "react";

/* ─── Pure Three.js via CDN import — no npm needed ─────────────────────────
   Paste this component, then add to your layout.tsx <head>:
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" />
   OR install: npm install three @types/three  and change imports below.
──────────────────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    // Loaded at runtime from the CDN script below, not bundled — so this
    // intentionally isn't `typeof import("three")`, which would require
    // installing the full "three" package as a devDependency just to
    // resolve types for a global that's never actually imported.
    THREE: any;
  }
}

export default function AIOrb({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Inline Three.js bootstrap via dynamic script ──────────────────────
    const loadThree = () =>
      new Promise<void>((resolve) => {
        if (window.THREE) { resolve(); return; }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    let renderer: any, animId: number;

    loadThree().then(() => {
      const THREE = window.THREE;
      const W = mount.clientWidth;
      const H = mount.clientHeight;

      // ── Renderer ──────────────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // ── Scene & Camera ────────────────────────────────────────────────
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.set(0, 0, 4.5);

      // ── Ambient + point lights ────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x004d3a, 0.6));

      const lights = [
        { color: 0x00e5b4, intensity: 3, pos: [3, 3, 2]   },
        { color: 0x00a07a, intensity: 2, pos: [-3, -2, 1]  },
        { color: 0x00ffd0, intensity: 1.5, pos: [0, 4, -2] },
      ];
      lights.forEach(({ color, intensity, pos }) => {
        const light = new THREE.PointLight(color, intensity, 20);
        light.position.set(...(pos as [number, number, number]));
        scene.add(light);
      });

      // ── Core sphere (AI brain) ────────────────────────────────────────
      const coreGeo = new THREE.IcosahedronGeometry(1, 6);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x001a14,
        emissive: 0x00e5b4,
        emissiveIntensity: 0.08,
        metalness: 0.95,
        roughness: 0.05,
        wireframe: false,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      // ── Wireframe shell ───────────────────────────────────────────────
      const wireGeo = new THREE.IcosahedronGeometry(1.08, 2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x00e5b4,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wire);

      // ── Outer energy ring ─────────────────────────────────────────────
      const ringGeo = new THREE.TorusGeometry(1.5, 0.008, 6, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00e5b4,
        transparent: true,
        opacity: 0.4,
      });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.rotation.x = Math.PI / 2;
      scene.add(ring1);

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.004, 6, 100),
        new THREE.MeshBasicMaterial({ color: 0x00a07a, transparent: true, opacity: 0.25 })
      );
      ring2.rotation.x = Math.PI / 3;
      ring2.rotation.y = Math.PI / 4;
      scene.add(ring2);

      const ring3 = new THREE.Mesh(
        new THREE.TorusGeometry(1.3, 0.003, 6, 80),
        new THREE.MeshBasicMaterial({ color: 0x00ffd0, transparent: true, opacity: 0.15 })
      );
      ring3.rotation.x = -Math.PI / 5;
      ring3.rotation.z = Math.PI / 6;
      scene.add(ring3);

      // ── Floating nodes (data points) ──────────────────────────────────
      const nodeGroup = new THREE.Group();
      const nodeCount = 28;
      const nodeData: { mesh: any; theta: number; phi: number; speed: number; radius: number }[] = [];

      for (let i = 0; i < nodeCount; i++) {
        const size = Math.random() * 0.035 + 0.012;
        const geo  = Math.random() > 0.5
          ? new THREE.OctahedronGeometry(size)
          : new THREE.BoxGeometry(size, size, size);
        const mat  = new THREE.MeshStandardMaterial({
          color: [0x00e5b4, 0x00a07a, 0x00ffd0, 0x004d3a][Math.floor(Math.random() * 4)],
          emissive: 0x00e5b4,
          emissiveIntensity: Math.random() * 0.8 + 0.2,
          metalness: 0.9,
          roughness: 0.1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const radius = 1.4 + Math.random() * 0.6;
        const theta  = Math.random() * Math.PI * 2;
        const phi    = Math.acos(2 * Math.random() - 1);
        mesh.position.setFromSphericalCoords(radius, phi, theta);
        nodeGroup.add(mesh);
        nodeData.push({ mesh, theta, phi, speed: (Math.random() - 0.5) * 0.008, radius });
      }
      scene.add(nodeGroup);

      // ── Connection lines between nodes ────────────────────────────────
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00e5b4,
        transparent: true,
        opacity: 0.06,
      });
      for (let i = 0; i < nodeData.length; i++) {
        for (let j = i + 1; j < nodeData.length; j++) {
          const d = nodeData[i].mesh.position.distanceTo(nodeData[j].mesh.position);
          if (d < 0.9) {
            const pts = [nodeData[i].mesh.position, nodeData[j].mesh.position];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
            scene.add(new THREE.Line(lineGeo, lineMat));
          }
        }
      }

      // ── Particle field ────────────────────────────────────────────────
      const particleCount = 600;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const r = 2.2 + Math.random() * 2;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        positions[i * 3]     = r * Math.sin(p) * Math.cos(t);
        positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        positions[i * 3 + 2] = r * Math.cos(p);
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
      scene.add(new THREE.Points(pGeo, pMat));

      // ── Mouse parallax ────────────────────────────────────────────────
      let targetX = 0, targetY = 0;
      const onMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
        targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── Resize ────────────────────────────────────────────────────────
      const onResize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // ── Animate ───────────────────────────────────────────────────────
      let t = 0;
      function animate() {
        animId = requestAnimationFrame(animate);
        t += 0.006;

        // Core pulse
        const pulse = 1 + Math.sin(t * 1.2) * 0.018;
        core.scale.setScalar(pulse);

        // Wireframe counter-rotate
        wire.rotation.x = t * 0.08;
        wire.rotation.y = t * 0.12;

        // Rings
        ring1.rotation.z = t * 0.3;
        ring2.rotation.x = Math.PI / 3 + t * 0.2;
        ring2.rotation.y = t * 0.15;
        ring3.rotation.z = -t * 0.25;
        ring3.rotation.x = -Math.PI / 5 + t * 0.1;

        // Nodes orbit
        nodeData.forEach(n => {
          n.theta += n.speed;
          n.mesh.position.setFromSphericalCoords(n.radius, n.phi, n.theta);
          n.mesh.rotation.x += 0.02;
          n.mesh.rotation.y += 0.015;
        });

        // Mouse parallax
        scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
        scene.rotation.x += (-targetY - scene.rotation.x) * 0.05;

        // Emissive breathe
        coreMat.emissiveIntensity = 0.06 + Math.sin(t * 0.8) * 0.04;

        renderer.render(scene, camera);
      }
      animate();

      // Cleanup
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
      };
    });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      style={{ background: "transparent" }}
    />
  );
}
