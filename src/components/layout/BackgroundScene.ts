import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COUNT = 4_000;

export function startScene(canvas: HTMLCanvasElement): () => void {
  let disposed = false;
  let rafId: number | null = null;

  let aspect = window.innerWidth / window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x0d544c, 1); // --bg-primary

  const cam = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
  cam.position.z = 1;
  const scene = new THREE.Scene();

  // Per-particle state
  const positions = new Float32Array(COUNT * 3);
  const vx = new Float32Array(COUNT);
  const vy = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() * 2 - 1) * aspect;
    positions[i * 3 + 1] = Math.random() * 2 - 1;
    positions[i * 3 + 2] = 0;
    // tiny constant velocity per particle — varied directions
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.0009 + 0.0002;
    vx[i] = Math.cos(angle) * speed;
    vy[i] = Math.sin(angle) * speed;
  }

  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(positions, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute("position", posAttr);

  const mat = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: false,
    color: 0xc8a55c,
    transparent: true,
    opacity: 0.65,
  });

  scene.add(new THREE.Points(geo, mat));

  let t = 0;

  function animate() {
    if (disposed) return;
    rafId = requestAnimationFrame(animate);
    t += 0.016;

    // Two trig calls total — global wind that shifts slowly
    const windX = Math.sin(t * 0.09) * 0.00025;
    const windY = Math.cos(t * 0.07) * 0.00018;

    for (let i = 0; i < COUNT; i++) {
      const px = i * 3;
      positions[px]     += vx[i] + windX;
      positions[px + 1] += vy[i] + windY;

      // Wrap
      if (positions[px] > aspect)    positions[px]     -= aspect * 2;
      else if (positions[px] < -aspect) positions[px]  += aspect * 2;
      if (positions[px + 1] > 1)     positions[px + 1] -= 2;
      else if (positions[px + 1] < -1) positions[px + 1] += 2;
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, cam);
  }

  const onResize = () => {
    const nW = window.innerWidth;
    const nH = window.innerHeight;
    aspect = nW / nH;
    cam.left = -aspect;
    cam.right = aspect;
    cam.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  };

  const onVisibility = () => {
    if (document.hidden) {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (!disposed) {
      rafId = requestAnimationFrame(animate);
    }
  };

  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);

  rafId = requestAnimationFrame(animate);

  return () => {
    disposed = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.dispose();
  };
}
