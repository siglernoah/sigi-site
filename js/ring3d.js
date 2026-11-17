/* Signet Works — 3D signet ring for the intro.
   Loaded on demand (first visit only). Builds a polished metal signet ring with an
   orange command-key seal, spins it for `spin` seconds, then rests in the logo's 3/4 pose. */
import * as THREE from './vendor/three.module.min.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const TAU = Math.PI * 2;

function bandGeometry(R) {
  // A ring band whose width and thickness swell toward the top (the shoulders) and taper underneath.
  const U = 180, V = 36, pos = [], idx = [];
  for (let i = 0; i <= U; i++) {
    const u = (i / U) * TAU;                       // 0 = top of the ring (+Y)
    const s = (1 + Math.cos(u)) / 2;               // 1 at top, 0 at bottom
    const w = 0.15 + 0.31 * Math.pow(s, 3);        // half-width along the finger (Z)
    const t = 0.065 + 0.07 * Math.pow(s, 2.2);     // half-thickness, radial
    for (let j = 0; j <= V; j++) {
      const v = (j / V) * TAU, c = Math.cos(v), sn = Math.sin(v);
      const cz = w * Math.sign(c) * Math.pow(Math.abs(c), 0.5);   // rounded-rectangle profile
      const cr = t * Math.sign(sn) * Math.pow(Math.abs(sn), 0.5);
      const r = R + cr;
      pos.push(r * Math.sin(u), r * Math.cos(u), cz);
    }
  }
  for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) {
    const a = i * (V + 1) + j, b = a + V + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function octagon(w, d, cut) {
  const s = new THREE.Shape(), x = w / 2, z = d / 2;
  s.moveTo(-x + cut, -z); s.lineTo(x - cut, -z); s.lineTo(x, -z + cut); s.lineTo(x, z - cut);
  s.lineTo(x - cut, z); s.lineTo(-x + cut, z); s.lineTo(-x, z - cut); s.lineTo(-x, -z + cut); s.closePath();
  return s;
}

function buildRing() {
  const R = 1;
  const metal = new THREE.MeshStandardMaterial({ color: 0xe9e7e2, metalness: 1, roughness: 0.2 });
  const satin = new THREE.MeshStandardMaterial({ color: 0xd6d3cc, metalness: 1, roughness: 0.38 });
  const enamel = new THREE.MeshStandardMaterial({ color: 0xff5a1f, metalness: 0.15, roughness: 0.32, emissive: 0x401000 });

  const ring = new THREE.Group();
  ring.add(new THREE.Mesh(bandGeometry(R), metal));

  // Shoulder block that carries the face.
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.44, 0.26, 8, 1), metal);
  neck.rotation.y = Math.PI / 8;
  neck.position.y = R + 0.06;
  ring.add(neck);

  // The octagonal signet face, bevelled.
  const faceGeo = new THREE.ExtrudeGeometry(octagon(1.12, 1.04, 0.26), {
    depth: 0.12, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 5, curveSegments: 4
  });
  faceGeo.rotateX(-Math.PI / 2);                 // extrude upward (+Y)
  const face = new THREE.Mesh(faceGeo, metal);
  face.position.y = R + 0.17;
  ring.add(face);
  const top = R + 0.17 + 0.12 + 0.05;            // top surface height

  // Satin inset panel on the face.
  const panel = new THREE.Mesh(new THREE.ExtrudeGeometry(octagon(0.9, 0.84, 0.2), { depth: 0.012, bevelEnabled: false }), satin);
  panel.geometry.rotateX(-Math.PI / 2);
  panel.position.y = top - 0.004;
  ring.add(panel);

  // Command-key seal: four loops joined by a square.
  const seal = new THREE.Group();
  const k = 0.12, lr = 0.115, tube = 0.03;
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(lr, tube, 14, 48), enamel);
    loop.rotation.x = Math.PI / 2;
    loop.position.set(sx * (k + lr * 0.62), 0, sz * (k + lr * 0.62));
    seal.add(loop);
  }
  for (const [x, z, rot] of [[0, -k, 0], [0, k, 0], [-k, 0, 1], [k, 0, 1]]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(2 * k + tube * 2, tube * 1.4, tube * 2), enamel);
    bar.position.set(x, 0, z);
    if (rot) bar.rotation.y = Math.PI / 2;
    seal.add(bar);
  }
  seal.position.y = top + 0.012;
  ring.add(seal);

  // Centre the model on its visual middle.
  const box = new THREE.Box3().setFromObject(ring), c = box.getCenter(new THREE.Vector3());
  ring.children.forEach(m => m.position.sub(c));
  return ring;
}

export function mountRing(host, opts = {}) {
  const t0 = opts.t0 ?? performance.now();
  const spin = opts.spin ?? 3;

  const canvas = document.createElement('canvas');
  canvas.className = 'ring3d';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-3, 4, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2d2, 1.1); rim.position.set(5, -2, -3); scene.add(rim);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);

  const pivot = new THREE.Group();
  const ring = buildRing();
  pivot.add(ring);
  scene.add(pivot);

  // Resting pose: face to the right and turned toward the viewer, band opening to the left (like the logo).
  // Build the pose from directions: the signet face (+Y) looks toward the viewer and to the right,
  // the finger axis (+Z) tips up and away so the band opening shows as an ellipse sweeping left.
  const faceDir = new THREE.Vector3(0.62, 0.2, 0.76).normalize();
  const fingerDir = new THREE.Vector3(-0.15, 1, -0.45);
  fingerDir.sub(faceDir.clone().multiplyScalar(fingerDir.dot(faceDir))).normalize();
  const xDir = new THREE.Vector3().crossVectors(faceDir, fingerDir).normalize();
  const rest = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xDir, faceDir, fingerDir));
  const axis = new THREE.Vector3(-1, 1, 0.35).normalize();   // spin diagonally, to the left
  const q = new THREE.Quaternion();

  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  size();
  const ro = new ResizeObserver(size); ro.observe(canvas);

  let raf = 0, alive = true;
  function frame() {
    if (!alive) return;
    const t = (performance.now() - t0) / 1000;
    const p = Math.min(1, Math.max(0, t / spin));
    const e = 1 - Math.pow(1 - p, 3.2);                       // fast start, gentle stop
    q.setFromAxisAngle(axis, (1 - e) * 4 * TAU);
    pivot.quaternion.copy(rest).premultiply(q);
    const sc = 0.5 + 0.5 * e;
    pivot.scale.setScalar(sc);
    // a slow idle drift after it settles keeps the metal alive
    if (p >= 1) pivot.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.sin((t - spin) * 1.2) * 0.04);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return {
    canvas,
    stop() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); pmrem.dispose(); }
  };
}
