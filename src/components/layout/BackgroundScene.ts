import * as THREE from "three/webgpu";
import {
  Fn,
  uniform,
  float,
  vec3,
  color,
  instancedArray,
  instanceIndex,
  hash,
  time,
  uv,
  sin,
  cos,
  smoothstep,
  fract,
} from "three/tsl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COUNT = 30_000;

export function startScene(canvas: HTMLCanvasElement): () => void {
  let disposed = false;
  const cleanupFns: Array<() => void> = [];

  // Shared uniforms created once so compute shaders can reference them
  const aspectUniform = uniform(window.innerWidth / window.innerHeight);
  const scrollUniform = uniform(0);

  // GPU storage buffers for particle state
  const pos2 = instancedArray(COUNT, "vec2");
  const phase2 = instancedArray(COUNT, "vec2");

  // Kick off async init — errors are swallowed so a bad GPU doesn't crash the page
  initAsync().catch((err) => console.warn("[bg]", err));

  async function initAsync() {
    const renderer = new THREE.WebGPURenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    await renderer.init();
    if (disposed) { renderer.dispose(); return; }

    const aspect = window.innerWidth / window.innerHeight;
    const cam = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
    cam.position.z = 1;
    const scene = new THREE.Scene();

    // ---------- Compute: init ----------
    const computeInit = Fn(() => {
      const p = pos2.element(instanceIndex);
      const ph = phase2.element(instanceIndex);
      p.x.assign(hash(instanceIndex).mul(aspectUniform.mul(2)).sub(aspectUniform));
      p.y.assign(hash(instanceIndex.add(1)).mul(2).sub(1));
      ph.x.assign(hash(instanceIndex.add(2)).mul(float(Math.PI * 2)));
      ph.y.assign(hash(instanceIndex.add(3)).mul(float(Math.PI * 2)));
    })().compute(COUNT);

    renderer.compute(computeInit);

    // ---------- Compute: update ----------
    const computeUpdate = Fn(() => {
      const p = pos2.element(instanceIndex);
      const ph = phase2.element(instanceIndex);
      const freq = hash(instanceIndex.add(4)).mul(0.4).add(0.1);
      const spd = hash(instanceIndex.add(5)).mul(0.0008).add(0.0003);

      // Gentle curl-like drift via per-particle sin/cos
      p.x.addAssign(sin(time.mul(freq).add(ph.x)).mul(spd));
      p.y.addAssign(cos(time.mul(freq).add(ph.y)).mul(spd));

      // Wrap X: map to [0,1], fract, map back to [-aspect, aspect]
      p.x.assign(fract(p.x.add(aspectUniform).div(aspectUniform.mul(2))).mul(aspectUniform.mul(2)).sub(aspectUniform));
      // Wrap Y: map to [0,1], fract, map back to [-1, 1]
      p.y.assign(fract(p.y.add(1).div(2)).mul(2).sub(1));
    })().compute(COUNT);

    // ---------- Particles ----------
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(COUNT * 3), 3),
    );

    const particleMat = new THREE.PointsNodeMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    particleMat.positionNode = vec3(pos2.element(instanceIndex), 0);
    const variation = hash(instanceIndex).mul(0.3).add(0.7);
    particleMat.colorNode = color(0xc8a55c).mul(variation).mul(0.6);
    particleMat.sizeNode = float(2.2);
    const pulse = sin(time.mul(0.5).add(hash(instanceIndex).mul(float(Math.PI * 2)))).mul(0.12).add(0.88);
    particleMat.opacityNode = float(0.28).mul(pulse);

    scene.add(new THREE.Points(particleGeo, particleMat));

    // ---------- Cursor glow ----------
    const glowGeo = new THREE.PlaneGeometry(0.45, 0.45);
    const glowMat = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const d = uv().mul(2).sub(1).length();
    glowMat.colorNode = vec3(0.28, 0.72, 0.62).mul(smoothstep(float(1.0), float(0.0), d).mul(0.2));
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.z = -0.1;
    scene.add(glowMesh);

    // ---------- Event handlers ----------
    const onResize = () => {
      const nW = window.innerWidth;
      const nH = window.innerHeight;
      const nA = nW / nH;
      aspectUniform.value = nA;
      cam.left = -nA;
      cam.right = nA;
      cam.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };

    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      glowMesh.position.x = nx * (window.innerWidth / window.innerHeight);
      glowMesh.position.y = ny;
    };

    const onVisibility = () => {
      if (document.hidden) renderer.setAnimationLoop(null);
      else renderer.setAnimationLoop(animate);
    };

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (st) => { scrollUniform.value = st.progress; },
    });

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    document.addEventListener("visibilitychange", onVisibility);

    // ---------- Animation loop ----------
    function animate() {
      renderer.compute(computeUpdate);
      renderer.render(scene, cam);
    }

    renderer.setAnimationLoop(animate);

    cleanupFns.push(() => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
    });
  }

  return () => {
    disposed = true;
    cleanupFns.forEach((fn) => fn());
  };
}
