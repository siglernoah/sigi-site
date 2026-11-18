/* Signet Works — 3D phone for the Start a project page.
   A real model (built in millimetres from the iPhone 17 Pro's proportions) that flies in showing its back,
   turns 180° to face the viewer, then sits still so the interactive call screen can sit exactly on its glass. */
import * as THREE from './vendor/three.module.min.js';

const MM = { W: 71.9, H: 150, T: 8.75 };
const TAU = Math.PI * 2;
const deg = d => d * Math.PI / 180;

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
// a slab of given outer size whose edges are rounded by bevel (bt through the thickness, bs across)
function slab(w, h, r, t, bt, bs, segs = 8) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * bs, h - 2 * bs, Math.max(.1, r - bs)), {
    depth: Math.max(.01, t - 2 * bt), bevelEnabled: bt > 0, bevelThickness: bt, bevelSize: bs, bevelSegments: segs, curveSegments: 28 });
  g.translate(0, 0, -(t - 2 * bt) / 2);
  return g;
}
// a turned part: profile of [radius, height] pairs, revolved; height points outward from the back (-z)
function turned(profile, segs = 64) {
  const g = new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), segs);
  g.rotateX(-Math.PI / 2);
  return g;
}
function disk(r, h, segs = 64) { const g = new THREE.CylinderGeometry(r, r, h, segs); g.rotateX(Math.PI / 2); return g; }

function studio() {
  const sc = new THREE.Scene();
  const g = new THREE.SphereGeometry(60, 64, 32), p = g.attributes.position, col = [], c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) / 60; const v = y > 0 ? .5 + .45 * y : .5 + .35 * y; c.setRGB(v, v, v * 1.01); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  sc.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
  const L = new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 4, 4) }), D = new THREE.MeshBasicMaterial({ color: 0x0c0c0e });
  const add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.lookAt(0, 0, 0); sc.add(o); };
  add(new THREE.PlaneGeometry(26, 6), L, 0, 24, 10);
  add(new THREE.PlaneGeometry(6, 22), L, -24, 4, 12);
  add(new THREE.PlaneGeometry(5, 18), L, 22, 2, -10);
  add(new THREE.PlaneGeometry(8, 30), D, 18, 0, 18);
  add(new THREE.PlaneGeometry(30, 5), D, 0, -12, 24);
  return sc;
}

function buildPhone() {
  const { W, H, T } = MM;
  const alu = new THREE.MeshPhysicalMaterial({ color: 0xe8702c, metalness: .82, roughness: .33, clearcoat: .2, clearcoatRoughness: .45 });
  const aluDark = new THREE.MeshPhysicalMaterial({ color: 0xd9652a, metalness: .85, roughness: .28 });
  const backGlass = new THREE.MeshPhysicalMaterial({ color: 0xdc6a2e, metalness: .35, roughness: .42, clearcoat: .3, clearcoatRoughness: .5 });
  const frontGlass = new THREE.MeshPhysicalMaterial({ color: 0x050608, metalness: 0, roughness: .1, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: .7 });
  const black = new THREE.MeshStandardMaterial({ color: 0x0d0e11, metalness: .3, roughness: .55 });
  const lensGlass = new THREE.MeshPhysicalMaterial({ color: 0x06070b, metalness: 0, roughness: .32, envMapIntensity: .35 });
  const barrel = new THREE.MeshPhysicalMaterial({ color: 0xb8521c, metalness: .85, roughness: .3 });
  const lip = new THREE.MeshPhysicalMaterial({ color: 0xffa36a, metalness: .95, roughness: .16 });
  const lensInner = new THREE.MeshStandardMaterial({ color: 0x1f2128, metalness: .4, roughness: .45 });
  const lensCoat = new THREE.MeshStandardMaterial({ color: 0x1a2048, metalness: .2, roughness: .4, envMapIntensity: .4 });
  const flashMat = new THREE.MeshStandardMaterial({ color: 0xf1e3c4, metalness: 0, roughness: .45, emissive: 0x1a140c });
  const camCtl = new THREE.MeshPhysicalMaterial({ color: 0x3b2418, metalness: .2, roughness: .15, clearcoat: 1 });

  const phone = new THREE.Group();
  // body: aluminium unibody with rounded sides
  phone.add(new THREE.Mesh(slab(W, H, 11.8, T, 2.4, 1.15, 10), alu));
  // front: black glass with a thin metal rim (matches the HTML screen exactly)
  const rim = W * .023;
  const fg = new THREE.Mesh(slab(W - 2 * rim, H - 2 * rim, 10.1, .5, .15, .15, 3), frontGlass);
  fg.position.z = T / 2 - .12; phone.add(fg);

  // back, seen from behind: image-left (u) is model +x
  const bx = u => W / 2 - u * W, by = v => H / 2 - v * H, zb = -T / 2;
  // glass panel (the lighter lower area)
  const gp = new THREE.Mesh(slab(.92 * W, .683 * H, 6.3, .3, .1, .1, 3), backGlass);
  gp.position.set(bx(.5), by(.295 + .683 / 2), zb + .05); phone.add(gp);
  // camera plateau, raised from the back
  const PW = .907 * W, PH = .231 * H, PT = 1.15;
  const plate = new THREE.Mesh(slab(PW, PH, 8.6, PT, .45, .45, 6), aluDark);
  const pz = zb - PT / 2 + .1; plate.position.set(bx(.059 + .907 / 2), by(.03 + .231 / 2), pz); phone.add(plate);
  const top = pz - PT / 2;                      // plateau surface (z, outward is -z)
  const onPlate = (mesh, u, v, lift = 0) => { mesh.position.set(bx(u), by(v), top - lift); phone.add(mesh); return mesh; };

  // lenses: stepped orange barrel, chamfered lip, black well, layered glass
  for (const [u, v, d] of [[.183, .090, .178], [.415, .145, .192], [.183, .205, .185]]) {
    const R = d * W / 2;
    onPlate(new THREE.Mesh(new THREE.TorusGeometry(R * 1.02, .22, 10, 64), black), u, v, .02);                      // seam where the barrel meets the plateau
    onPlate(new THREE.Mesh(turned([[R * .97, 0], [R, .1], [R, 1.75]]), barrel), u, v);                                // barrel wall
    onPlate(new THREE.Mesh(turned([[R, 1.75], [R * .96, 2.05], [R * .88, 2.15], [R * .8, 2.1], [R * .78, 1.6]]), lip), u, v);  // chamfered lip
    onPlate(new THREE.Mesh(turned([[R * .55, .9], [R * .77, .95], [R * .78, 1.62]]), black), u, v);
    onPlate(new THREE.Mesh(disk(R * .74, .3), black), u, v, .65);
    onPlate(new THREE.Mesh(disk(R * .6, .12), lensGlass), u, v, .92);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R * .48, .16, 12, 64), lensInner); onPlate(ring, u, v, .98);
    const coat = new THREE.Mesh(new THREE.TorusGeometry(R * .33, .1, 10, 48), lensCoat); onPlate(coat, u, v, .96);
    onPlate(new THREE.Mesh(disk(R * .2, .1), black), u, v, .99);
  }
  // flash and LiDAR in raised rings, microphone hole
  const fr = .085 * W / 2;
  onPlate(new THREE.Mesh(turned([[fr * .82, .35], [fr * .86, .62], [fr, .55], [fr, 0]]), aluDark), .824, .083);
  onPlate(new THREE.Mesh(disk(fr * .83, .2), flashMat), .824, .083, .45);
  onPlate(new THREE.Mesh(turned([[fr * .82, .35], [fr * .86, .62], [fr, .55], [fr, 0]]), aluDark), .822, .209);
  onPlate(new THREE.Mesh(disk(fr * .83, .2), new THREE.MeshPhysicalMaterial({ color: 0x020203, roughness: .35, envMapIntensity: .3 })), .822, .209, .45);
  onPlate(new THREE.Mesh(disk(.45, .1), black), .822, .146, .02);

  // side buttons (front view: left is -x)
  const btn = (side, v, len, mat, flat = .55) => {
    const g = new THREE.CapsuleGeometry(1.05, Math.max(.1, len * H - 2.1), 6, 16);
    const m = new THREE.Mesh(g, mat); m.scale.x = flat;
    m.position.set(side * (W / 2 - .25), H / 2 - (v + len / 2) * H, 0); phone.add(m);
  };
  btn(-1, .175, .042, alu); btn(-1, .255, .075, alu); btn(-1, .345, .075, alu);
  btn(1, .27, .11, alu); btn(1, .64, .06, camCtl, .3);
  // bottom: USB-C port and speaker holes
  const port = new THREE.Mesh(new THREE.CapsuleGeometry(1.4, 6.2, 6, 16), black);
  port.rotation.z = Math.PI / 2; port.scale.y = .25; port.position.set(0, -H / 2 + .05, 0); phone.add(port);
  for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) {
    const h = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .4, 16), black);
    h.position.set(sx * (9 + i * 1.6), -H / 2 + .1, 0); phone.add(h);
  }
  return phone;
}

const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

export function mountPhone(phoneEl) {
  const host = document.createElement('div'); host.className = 'ph3d'; host.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas'); host.appendChild(canvas);
  phoneEl.insertBefore(host, phoneEl.firstChild);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(studio(), .02).texture;
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-.6, .8, 1); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe7d6, .9); fill.position.set(1, -.3, .6); scene.add(fill);
  const back = new THREE.DirectionalLight(0xffffff, 1.4); back.position.set(.3, .6, -1); scene.add(back);

  const FOV = 18, camera = new THREE.PerspectiveCamera(FOV, 1, 1, 20000);
  const pivot = new THREE.Group(), model = buildPhone(); pivot.add(model); scene.add(pivot);
  let s = 1, Tpx = 0;
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false);
    s = phoneEl.offsetWidth / MM.W; model.scale.setScalar(s); Tpx = MM.T * s;
    camera.aspect = w / h;
    camera.position.set(0, 0, (h / 2) / Math.tan(deg(FOV / 2)) + Tpx / 2);   // 1 unit = 1 css px on the front glass
    camera.near = 10; camera.far = camera.position.z * 4; camera.updateProjectionMatrix();
    render();
  }
  function pose(ry, rx, rz) { pivot.rotation.set(deg(rx), deg(ry), deg(rz), 'YXZ'); }
  function render() { renderer.render(scene, camera); }
  pose(196, 9, -7);
  const ro = new ResizeObserver(size); ro.observe(canvas); size();

  let raf = 0;
  return {
    play(duration = 3000, done) {
      const t0 = performance.now(), vw = window.innerWidth;
      cancelAnimationFrame(raf);
      (function frame(now) {
        const t = Math.min(1, (now - t0) / duration);
        let ry, rx, rz, x, y;
        if (t < .48) { const p = easeOut(t / .48); ry = lerp(196, 176, p); rx = lerp(9, 6, p); rz = lerp(-7, -2, p); x = lerp(.58 * vw, .03 * vw, p); y = lerp(-26, -12, p); }
        else { const p = easeInOut((t - .48) / .52); ry = lerp(176, 0, p); rx = lerp(6, 0, p); rz = lerp(-2, 0, p); x = lerp(.03 * vw, 0, p); y = lerp(-12, 0, p); }
        pose(ry, rx, rz); phoneEl.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; render();
        if (t < 1) raf = requestAnimationFrame(frame);
        else { phoneEl.style.transform = ''; pose(0, 0, 0); render(); if (done) done(); }
      })(t0);
    },
    at(ry, rx = 0, rz = 0) { pose(ry, rx, rz); render(); },
    stop() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); pmrem.dispose(); }
  };
}
