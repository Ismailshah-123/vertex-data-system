"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   DataGlobe
   Rotating 3D wireframe globe with glowing client office markers.
   Pure Three.js via CDN — same pattern as AIOrb.tsx, no npm required.
   Usage: <DataGlobe offices={OFFICES} className="w-full h-[500px]" />
───────────────────────────────────────────────────────────────────────── */

declare global {
  interface Window { THREE: typeof import("three"); }
}

export interface GlobeOffice {
  name: string;
  lat: number;   // -90 to 90
  lng: number;   // -180 to 180
  isHQ?: boolean;
}

const DEFAULT_OFFICES: GlobeOffice[] = [
  { name: "London",     lat: 51.5,  lng: -0.12,  isHQ: true },
  { name: "Manchester", lat: 53.48, lng: -2.24 },
  { name: "Singapore",  lat: 1.35,  lng: 103.82 },
  { name: "New York",   lat: 40.71, lng: -74.0 },
  { name: "Stuttgart",  lat: 48.78, lng: 9.18 },
  { name: "Sydney",     lat: -33.87,lng: 151.21 },
];

export default function DataGlobe({
  offices = DEFAULT_OFFICES,
  className = "",
}: {
  offices?: GlobeOffice[];
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

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
      const RADIUS = 1.6;

      /* ── Renderer / Scene / Camera ─────────────────────────────────── */
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
      camera.position.set(0, 0, 5);

      scene.add(new THREE.AmbientLight(0x004d3a, 0.8));
      const pLight = new THREE.PointLight(0x00e5b4, 2, 20);
      pLight.position.set(4, 3, 4);
      scene.add(pLight);

      /* ── Lat/Lng → 3D position ─────────────────────────────────────── */
      const latLngToVec3 = (lat: number, lng: number, r: number) => {
        const phi   = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
           r * Math.cos(phi),
           r * Math.sin(phi) * Math.sin(theta)
        );
      };

      /* ── Globe wireframe sphere ────────────────────────────────────── */
      const globeGeo = new THREE.SphereGeometry(RADIUS, 32, 32);
      const globeMat = new THREE.MeshBasicMaterial({
        color: 0x00e5b4,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      scene.add(globe);

      /* ── Solid inner sphere (subtle) ───────────────────────────────── */
      const innerGeo = new THREE.SphereGeometry(RADIUS * 0.985, 32, 32);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x001a14,
        transparent: true,
        opacity: 0.4,
      });
      scene.add(new THREE.Mesh(innerGeo, innerMat));

      /* ── Latitude rings (equator + tropics) ────────────────────────── */
      [-40, 0, 40].forEach(lat => {
        const points: any[] = [];
        for (let i = 0; i <= 64; i++) {
          const lng = (i / 64) * 360 - 180;
          points.push(latLngToVec3(lat, lng, RADIUS * 1.002));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0x00e5b4, transparent: true, opacity: lat === 0 ? 0.35 : 0.15 });
        scene.add(new THREE.Line(geo, mat));
      });

      /* ── Office markers ─────────────────────────────────────────────── */
      const markerGroup = new THREE.Group();
      const markers: { mesh: any; pulse: any; office: GlobeOffice }[] = [];

      offices.forEach(office => {
        const pos = latLngToVec3(office.lat, office.lng, RADIUS * 1.01);

        // Core dot
        const dotGeo = new THREE.SphereGeometry(office.isHQ ? 0.035 : 0.024, 12, 12);
        const dotMat = new THREE.MeshBasicMaterial({ color: office.isHQ ? 0x00ffd0 : 0x00e5b4 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pos);
        markerGroup.add(dot);

        // Pulsing ring around marker
        const ringGeo = new THREE.RingGeometry(0.04, 0.05, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: office.isHQ ? 0x00ffd0 : 0x00e5b4,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(0, 0, 0);
        markerGroup.add(ring);

        // Vertical beam (subtle)
        const beamGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.15, 6);
        const beamMat = new THREE.MeshBasicMaterial({ color: 0x00e5b4, transparent: true, opacity: 0.4 });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.copy(pos.clone().multiplyScalar(1.05));
        beam.lookAt(0, 0, 0);
        beam.rotateX(Math.PI / 2);
        markerGroup.add(beam);

        markers.push({ mesh: dot, pulse: ring, office });
      });
      scene.add(markerGroup);

      /* ── Arcs connecting HQ to other offices ───────────────────────── */
      const hq = offices.find(o => o.isHQ) ?? offices[0];
      const hqPos = latLngToVec3(hq.lat, hq.lng, RADIUS);

      offices.filter(o => o !== hq).forEach(office => {
        const p1 = latLngToVec3(hq.lat, hq.lng, RADIUS);
        const p2 = latLngToVec3(office.lat, office.lng, RADIUS);
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const dist = p1.distanceTo(p2);
        mid.normalize().multiplyScalar(RADIUS + dist * 0.5);

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(40);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0x00e5b4, transparent: true, opacity: 0.3 });
        scene.add(new THREE.Line(geo, mat));
      });

      /* ── Background particle field ─────────────────────────────────── */
      const starCount = 300;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const r = 4 + Math.random() * 3;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        starPositions[i*3]   = r * Math.sin(p) * Math.cos(t);
        starPositions[i*3+1] = r * Math.sin(p) * Math.sin(t);
        starPositions[i*3+2] = r * Math.cos(p);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({ color: 0x00e5b4, size: 0.012, transparent: true, opacity: 0.4 });
      scene.add(new THREE.Points(starGeo, starMat));

      /* ── Mouse interaction (drag to rotate, else auto-spin) ─────────── */
      let isDragging = false;
      let prevX = 0, prevY = 0;
      let rotY = 0, rotX = 0.3;
      let targetRotY = 0, targetRotX = 0.3;
      let autoRotate = true;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true; autoRotate = false;
        prevX = e.clientX; prevY = e.clientY;
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX, dy = e.clientY - prevY;
        targetRotY += dx * 0.005;
        targetRotX += dy * 0.005;
        targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX));
        prevX = e.clientX; prevY = e.clientY;
      };
      const onPointerUp = () => {
        isDragging = false;
        setTimeout(() => { autoRotate = true; }, 2000);
      };

      mount.style.cursor = "grab";
      mount.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      /* ── Resize ──────────────────────────────────────────────────────── */
      const onResize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      /* ── Animate ─────────────────────────────────────────────────────── */
      let t = 0;
      function animate() {
        animId = requestAnimationFrame(animate);
        t += 0.01;

        if (autoRotate) targetRotY += 0.0018;

        rotY += (targetRotY - rotY) * 0.08;
        rotX += (targetRotX - rotX) * 0.08;

        globe.rotation.y = rotY;
        globe.rotation.x = rotX;
        markerGroup.rotation.y = rotY;
        markerGroup.rotation.x = rotX;

        scene.children.forEach(child => {
          if (child.type === "Line") {
            (child as any).rotation.y = rotY;
            (child as any).rotation.x = rotX;
          }
        });

        // Pulse rings
        markers.forEach((m, i) => {
          const scale = 1 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 + i));
          m.pulse.scale.setScalar(scale);
          (m.pulse.material as any).opacity = 0.5 * (1 - (scale - 1) / 0.3) * 0.6;
        });

        renderer.render(scene, camera);
      }
      animate();

      return () => {
        mount.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
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
  }, [offices]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}
