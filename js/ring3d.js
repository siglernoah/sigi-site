/* Signet Works — 3D signet ring for the intro.
   Loaded on demand (first visit only). Builds a polished metal signet ring with an
   orange command-key seal, spins it for `spin` seconds, then rests in the logo's 3/4 pose. */
import * as THREE from './vendor/three.module.min.js';

const TAU = Math.PI * 2;

// The ⌘ outline (24-unit grid, centred on 0,0; outer contour plus five holes), traced from a geometric drawing.
const CMD_PATH = 'M-6.4400 9.9843C-7.0137 9.9165 -7.5160 9.7501 -8.0172 9.4617C-8.5992 9.1268 -9.1268 8.5992 -9.4617 8.0172C-9.7528 7.5113 -9.9195 7.0054 -9.9847 6.4300C-10.0055 6.2460 -10.0055 5.7543 -9.9847 5.5700C-9.9127 4.9326 -9.6975 4.3312 -9.3513 3.8000C-9.1176 3.4415 -8.7633 3.0654 -8.4100 2.8009C-8.2544 2.6843 -8.2374 2.6725 -8.1011 2.5849C-8.0117 2.5275 -7.7425 2.3875 -7.6050 2.3270C-7.3514 2.2153 -6.9910 2.1052 -6.7195 2.0565C-6.4060 2.0002 -6.4011 2.0000 -5.1525 2.0000L-4.0000 2.0000L-4.0000 0.0058L-4.0000 -1.9883L-5.1525 -1.9926C-6.4045 -1.9972 -6.3846 -1.9964 -6.7195 -2.0565C-6.9910 -2.1052 -7.3514 -2.2153 -7.6050 -2.3270C-7.7425 -2.3875 -8.0117 -2.5275 -8.1011 -2.5849C-8.2374 -2.6725 -8.2544 -2.6843 -8.4100 -2.8009C-8.7633 -3.0654 -9.1176 -3.4415 -9.3513 -3.8000C-9.6975 -4.3312 -9.9127 -4.9326 -9.9847 -5.5700C-10.0055 -5.7543 -10.0055 -6.2460 -9.9847 -6.4300C-9.9195 -7.0054 -9.7528 -7.5113 -9.4617 -8.0172C-9.1268 -8.5992 -8.5992 -9.1268 -8.0172 -9.4617C-7.5113 -9.7528 -7.0054 -9.9195 -6.4300 -9.9847C-6.2460 -10.0055 -5.7543 -10.0055 -5.5700 -9.9847C-4.9326 -9.9127 -4.3312 -9.6975 -3.8000 -9.3513C-3.4415 -9.1176 -3.0654 -8.7633 -2.8009 -8.4100C-2.6843 -8.2544 -2.6725 -8.2374 -2.5849 -8.1011C-2.5275 -8.0117 -2.3875 -7.7425 -2.3270 -7.6050C-2.2153 -7.3514 -2.1052 -6.9910 -2.0565 -6.7195C-1.9962 -6.3840 -1.9971 -6.4047 -1.9926 -5.1525L-1.9884 -4.0000L0.0058 -4.0000L2.0000 -4.0000L2.0000 -5.1525C2.0000 -6.4011 2.0002 -6.4060 2.0565 -6.7195C2.1052 -6.9910 2.2153 -7.3514 2.3270 -7.6050C2.3875 -7.7425 2.5275 -8.0117 2.5849 -8.1011C2.6725 -8.2374 2.6843 -8.2544 2.8009 -8.4100C3.0654 -8.7633 3.4415 -9.1176 3.8000 -9.3513C4.3312 -9.6975 4.9326 -9.9127 5.5700 -9.9847C5.7543 -10.0055 6.2460 -10.0055 6.4300 -9.9847C7.0054 -9.9195 7.5113 -9.7528 8.0172 -9.4617C8.5992 -9.1268 9.1268 -8.5992 9.4617 -8.0172C9.7528 -7.5113 9.9195 -7.0054 9.9847 -6.4300C10.0055 -6.2460 10.0055 -5.7543 9.9847 -5.5700C9.9127 -4.9326 9.6975 -4.3312 9.3513 -3.8000C9.1176 -3.4415 8.7633 -3.0654 8.4100 -2.8009C8.2544 -2.6843 8.2374 -2.6725 8.1011 -2.5849C8.0117 -2.5275 7.7425 -2.3875 7.6050 -2.3270C7.3514 -2.2153 6.9910 -2.1052 6.7195 -2.0565C6.3841 -1.9963 6.4042 -1.9971 5.1575 -1.9926L4.0100 -1.9884L4.0100 0.0058L4.0100 2.0000L5.1575 2.0000C6.4007 2.0000 6.4061 2.0002 6.7195 2.0565C6.9910 2.1052 7.3514 2.2153 7.6050 2.3270C7.7425 2.3875 8.0117 2.5275 8.1011 2.5849C8.2374 2.6725 8.2544 2.6843 8.4100 2.8009C8.7633 3.0654 9.1176 3.4415 9.3513 3.8000C9.6975 4.3312 9.9127 4.9326 9.9847 5.5700C10.0055 5.7543 10.0055 6.2460 9.9847 6.4300C9.9195 7.0054 9.7528 7.5113 9.4617 8.0172C9.1268 8.5992 8.5992 9.1268 8.0172 9.4617C7.5113 9.7528 7.0054 9.9195 6.4300 9.9847C6.2460 10.0055 5.7543 10.0055 5.5700 9.9847C4.9326 9.9127 4.3312 9.6975 3.8000 9.3513C3.4415 9.1176 3.0654 8.7633 2.8009 8.4100C2.6843 8.2544 2.6725 8.2374 2.5849 8.1011C2.5275 8.0117 2.3875 7.7425 2.3270 7.6050C2.2153 7.3514 2.1052 6.9910 2.0565 6.7195C2.0002 6.4061 2.0000 6.4007 2.0000 5.1575L2.0000 4.0100L0.0058 4.0100L-1.9884 4.0100L-1.9926 5.1575C-1.9971 6.4042 -1.9963 6.3841 -2.0565 6.7195C-2.1052 6.9910 -2.2153 7.3514 -2.3270 7.6050C-2.3875 7.7425 -2.5275 8.0117 -2.5849 8.1011C-2.6725 8.2374 -2.6843 8.2544 -2.8009 8.4100C-3.0654 8.7633 -3.4415 9.1176 -3.8000 9.3513C-4.3312 9.6975 -4.9326 9.9127 -5.5700 9.9847C-5.7430 10.0043 -6.2730 10.0040 -6.4400 9.9843ZM-5.6350 7.9555C-5.1590 7.8658 -4.7265 7.6047 -4.4334 7.2300C-4.2737 7.0259 -4.1475 6.7733 -4.0809 6.5250C-4.0066 6.2474 -4.0008 6.1326 -4.0003 4.9321L-4.0000 4.0093L-5.1175 4.0125C-6.3502 4.0161 -6.2678 4.0121 -6.5250 4.0810C-6.8986 4.1810 -7.2383 4.3922 -7.4925 4.6826C-8.2300 5.5249 -8.1325 6.8149 -7.2777 7.5276C-7.0346 7.7303 -6.7238 7.8811 -6.4181 7.9448C-6.2355 7.9828 -6.1640 7.9891 -5.9600 7.9853C-5.8129 7.9826 -5.7463 7.9764 -5.6350 7.9555ZM6.2079 7.9793C6.7267 7.9222 7.2002 7.6704 7.5276 7.2777C7.9055 6.8245 8.0638 6.2163 7.9552 5.6350C7.8666 5.1604 7.6048 4.7266 7.2300 4.4334C7.0259 4.2737 6.7732 4.1474 6.5250 4.0810C6.2679 4.0121 6.3497 4.0161 5.1221 4.0125L4.0093 4.0093L4.0125 5.1221C4.0161 6.3497 4.0121 6.2679 4.0810 6.5250C4.1810 6.8986 4.3922 7.2383 4.6826 7.4925C4.9886 7.7604 5.3758 7.9316 5.7827 7.9790C5.8891 7.9914 6.0969 7.9915 6.2079 7.9793ZM2.0000 0.0050L2.0000 -1.9900L0.0050 -1.9900L-1.9900 -1.9900L-1.9900 0.0050L-1.9900 2.0000L0.0050 2.0000L2.0000 2.0000L2.0000 0.0050ZM-4.0003 -4.9275C-4.0007 -5.8897 -4.0075 -6.1612 -4.0351 -6.3209C-4.1159 -6.7865 -4.3405 -7.1930 -4.6826 -7.4925C-5.5249 -8.2300 -6.8149 -8.1325 -7.5276 -7.2777C-8.0277 -6.6779 -8.1300 -5.8372 -7.7890 -5.1300C-7.5082 -4.5476 -6.9746 -4.1497 -6.3200 -4.0348C-6.1673 -4.0080 -5.9706 -4.0032 -4.9575 -4.0015L-4.0000 -4.0000L-4.0003 -4.9275ZM6.0409 -4.0097C6.1431 -4.0147 6.2691 -4.0262 6.3209 -4.0351C6.7865 -4.1159 7.1930 -4.3405 7.4925 -4.6826C8.0868 -5.3614 8.1539 -6.3536 7.6563 -7.1047C7.2769 -7.6776 6.6226 -8.0120 5.9300 -7.9870C5.3419 -7.9658 4.7909 -7.6871 4.4334 -7.2300C4.2737 -7.0259 4.1474 -6.7732 4.0810 -6.5250C4.0121 -6.2678 4.0161 -6.3502 4.0125 -5.1175L4.0093 -4.0000L4.9321 -4.0003C5.4397 -4.0005 5.9386 -4.0047 6.0409 -4.0097Z';

// Minimal parser for the absolute M/L/C/Z path above.
function svgPathToShapes(d) {
  const sp = new THREE.ShapePath();
  const tok = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g);
  let i = 0;
  const n = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    const c = tok[i++];
    if (c === 'M') sp.moveTo(n(), n());
    else if (c === 'L') sp.lineTo(n(), n());
    else if (c === 'C') sp.bezierCurveTo(n(), n(), n(), n(), n(), n());
  }
  return sp.toShapes(true);
}

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

function studioScene() {
  const sc = new THREE.Scene();
  const g = new THREE.SphereGeometry(40, 64, 32), col = [], p = g.attributes.position, c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / 40;                                   // -1 (floor) .. 1 (ceiling)
    const v = y > 0 ? 0.42 + 0.5 * y : 0.42 + 0.38 * y;        // bright ceiling, mid-grey walls, dark floor
    c.setRGB(v, v, v * 1.02); col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  sc.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
  const light = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 5, 5) });
  const dark = new THREE.MeshBasicMaterial({ color: 0x0b0b0c });
  const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m); };
  add(new THREE.PlaneGeometry(14, 3), light, 0, 14, 4);         // overhead softbox
  add(new THREE.PlaneGeometry(3, 12), light, -14, 2, 6);        // left strip light
  add(new THREE.PlaneGeometry(2.5, 10), light, 13, 3, -4);      // right kicker
  add(new THREE.PlaneGeometry(5, 18), dark, 10, 0, 10);         // dark flags for edge contrast
  add(new THREE.PlaneGeometry(4, 16), dark, -8, 0, -12);
  add(new THREE.PlaneGeometry(18, 3), dark, 0, -6, 14);         // dark horizon line
  return sc;
}

export function buildRing() {
  const R = 1;
  const metal = new THREE.MeshStandardMaterial({ color: 0xc4c7cc, metalness: 1, roughness: 0.24, envMapIntensity: 0.95 });   // satin silver
  const satin = new THREE.MeshStandardMaterial({ color: 0xb9bcc2, metalness: 1, roughness: 0.38, envMapIntensity: 0.9 });   // brushed silver panel
  const enamel = new THREE.MeshStandardMaterial({ color: 0x2a4596, metalness: 0.25, roughness: 0.3, emissive: 0x050c2a });

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

  // Command-key seal: an exact ⌘ outline (four loops around a centre square), raised and bevelled.
  const shapes = svgPathToShapes(CMD_PATH);
  const sealGeo = new THREE.ExtrudeGeometry(shapes, {
    depth: 0.7, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.28, bevelSegments: 4, curveSegments: 24
  });
  sealGeo.center();
  sealGeo.rotateX(-Math.PI / 2);
  const seal = new THREE.Mesh(sealGeo, enamel);
  const SEAL = 0.74 / 24;                        // ⌘ is drawn on a 24-unit grid; make it ~0.74 wide on the face
  seal.scale.setScalar(SEAL);
  seal.position.y = top + (0.7 / 2 + 0.35) * SEAL - 0.004;
  seal.rotation.y = -0.55;                       // square to the face in the resting pose (matches the 2D logo)
  seal.scale.multiplyScalar(0.86);
  ring.add(seal);

  // Centre the model on its visual middle.
  const box = new THREE.Box3().setFromObject(ring), c = box.getCenter(new THREE.Vector3());
  ring.children.forEach(m => m.position.sub(c));
  return ring;
}

// Resting pose: the signet face (+Y) looks toward the viewer and to the right, the finger axis (+Z)
// tips up and away so the band opening shows as an ellipse sweeping left (like the logo).
export function restPose() {
  const faceDir = new THREE.Vector3(0.72, 0, 0.69).normalize();
  const fingerDir = new THREE.Vector3(-0.05, 1, 0.75);
  fingerDir.sub(faceDir.clone().multiplyScalar(fingerDir.dot(faceDir))).normalize();
  const xDir = new THREE.Vector3().crossVectors(faceDir, fingerDir).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xDir, faceDir, fingerDir));
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
  // Bright photo-studio reflections (white above, light grey around, dark strips for contrast),
  // which is what makes polished silver read as silver rather than grey steel.
  scene.environment = pmrem.fromScene(studioScene(), 0.015).texture;
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-3, 4, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xf2f5ff, 1.4); rim.position.set(5, -2, -3); scene.add(rim);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);

  const pivot = new THREE.Group();
  const ring = buildRing();
  pivot.add(ring);
  scene.add(pivot);

  // Resting pose: face to the right and turned toward the viewer, band opening to the left (like the logo).
  // Build the pose from directions: the signet face (+Y) looks toward the viewer and to the right,
  // the finger axis (+Z) tips up and away so the band opening shows as an ellipse sweeping left.
  const rest = restPose();
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
