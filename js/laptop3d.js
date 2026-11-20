/* Signet Works — home hero: after the ring intro, the page sits inside a cloud bank. The clouds sink away,
   a laptop rises up through them and settles in mid air on the right, then the headline appears. */
import * as THREE from './vendor/three.module.min.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';

const root = document.documentElement, hero = document.querySelector('.hero'), box = document.querySelector('.lapbox'), canvas = document.getElementById('lap');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const span = (t, a, b) => clamp((t - a) / (b - a));
const out = t => 1 - (1 - t) ** 3;
const inOut = t => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const dark = () => root.getAttribute('data-theme') !== 'light';
const release = () => { if (window.swShowHero) window.swShowHero(); };

/* ---------- renderer ---------- */
let renderer;
try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true}); }
catch (e) { release(); throw e; }   // no WebGL: just show the headline
renderer.setClearColor(0, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(renderer), .04).texture;
const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-4, 6, 8); scene.add(key);
const rimL = new THREE.DirectionalLight(0x9fb4ff, 1.4); rimL.position.set(6, 2, -6); scene.add(rimL);
const CAM_Z = 20, FOV = 30, camera = new THREE.PerspectiveCamera(FOV, 1, .1, 100); camera.position.set(0, 0, CAM_Z);

/* ---------- laptop ---------- */
const LW = 3.0, LD = 2.06, LH = .085, SH = 1.92;
const shell = new THREE.MeshStandardMaterial({color:0x1b1c1f, metalness:.6, roughness:.42, envMapIntensity:.45});
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const laptop = new THREE.Group(), pivot = new THREE.Group();
// base
const base = new THREE.Mesh(new RoundedBoxGeometry(LW, LH, LD, 4, .05), shell); laptop.add(base);
const keys = canvasTex(1024, 400, (g, w, h) => {
  g.fillStyle = '#121214'; g.fillRect(0, 0, w, h);
  const rows = [14, 14, 14, 13, 12], kh = h / 6.2;
  rows.forEach((n, r) => { const kw = w / 14.6; for (let i = 0; i < n; i++) { const x = 10 + i * (w - 20) / n, y = 12 + r * (kh + 8); g.fillStyle = '#060607'; g.beginPath(); g.roundRect(x, y, (w - 20) / n - 8, kh, 6); g.fill(); } });
  g.fillStyle = '#060607'; g.beginPath(); g.roundRect(w * .3, 12 + 5 * (kh + 8), w * .4, kh * .8, 6); g.fill();
});
const kb = new THREE.Mesh(new THREE.PlaneGeometry(2.62, 1.0), new THREE.MeshStandardMaterial({map:keys, roughness:.7, metalness:.1}));
kb.rotation.x = -Math.PI / 2; kb.position.set(0, LH / 2 + .002, -.38); laptop.add(kb);
const pad = new THREE.Mesh(new THREE.PlaneGeometry(1.15, .66), new THREE.MeshStandardMaterial({color:0x232428, metalness:.5, roughness:.35, envMapIntensity:.4}));
pad.rotation.x = -Math.PI / 2; pad.position.set(0, LH / 2 + .002, .55); laptop.add(pad);
// lid, hinged at the back edge
pivot.position.set(0, LH / 2, -LD / 2 + .03); laptop.add(pivot);
const lidG = new THREE.Group(); pivot.add(lidG);
const lid = new THREE.Mesh(new RoundedBoxGeometry(LW, SH, .055, 4, .05), shell); lid.position.set(0, SH / 2, 0); lidG.add(lid);
const bezel = new THREE.Mesh(new THREE.PlaneGeometry(LW - .06, SH - .06), new THREE.MeshStandardMaterial({color:0x050506, roughness:.25, metalness:.2}));
bezel.position.set(0, SH / 2, .029); lidG.add(bezel);
// the screen shows a real project, scrolling slowly
const shot = new THREE.TextureLoader().load('img/medixis-full.jpg?v=1');
shot.colorSpace = THREE.SRGBColorSpace; shot.anisotropy = 8; shot.wrapT = THREE.ClampToEdgeWrapping;
const SW = LW - .2, SHH = SH - .22, VIEW = (SHH / SW) * 1440 / 3600;   // visible share of the full-page screenshot
shot.repeat.set(1, VIEW); shot.offset.y = 1 - VIEW;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(SW, SHH), new THREE.MeshBasicMaterial({map:shot, toneMapped:false}));
screen.position.set(0, SH / 2 - .02, .031); lidG.add(screen);
const notch = new THREE.Mesh(new THREE.PlaneGeometry(.34, .07), new THREE.MeshBasicMaterial({color:0x050506}));
notch.position.set(0, SH - .1, .032); lidG.add(notch);
// soft glass sheen over the display
const sheen = new THREE.Mesh(new THREE.PlaneGeometry(SW, SHH), new THREE.MeshPhysicalMaterial({color:0xffffff, transparent:true, opacity:.06, roughness:.05, metalness:0}));
sheen.position.set(0, SH / 2 - .02, .033); lidG.add(sheen);
lidG.rotation.x = -.26;           // opened a little past upright
laptop.position.y = -.5;
const rig = new THREE.Group(); rig.add(laptop); scene.add(rig);

/* ---------- clouds ---------- */
function puff(seed) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return canvasTex(512, 512, (g, w, h) => {
    const blobs = [];
    for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, d = rnd() * .24; blobs.push([w * (.5 + Math.cos(a) * d * 1.35), h * (.56 + Math.sin(a) * d * .6 - (rnd() * .08)), w * (.09 + rnd() * .12)]); }
    // 1. the cloud's shape: soft white puffs
    for (const [x, y, r] of blobs) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.55, 'rgba(255,255,255,.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    // 2. light from above: shade only where there is cloud, darker towards the base
    g.globalCompositeOperation = 'source-atop';
    const v = g.createLinearGradient(0, h * .3, 0, h * .8); v.addColorStop(0, 'rgba(120,135,165,0)'); v.addColorStop(1, 'rgba(96,112,146,.6)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
    // 3. a soft shadow under each billow so the puffs read as volume
    for (const [x, y, r] of blobs) { const gr = g.createRadialGradient(x + r * .2, y + r * .45, 0, x + r * .2, y + r * .45, r * .8); gr.addColorStop(0, 'rgba(100,116,150,.28)'); gr.addColorStop(1, 'rgba(100,116,150,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x + r * .2, y + r * .45, r * .8, 0, 7); g.fill(); }
    g.globalCompositeOperation = 'source-over';
  });
}
const puffs = [puff(7), puff(31), puff(101), puff(977)];
const clouds = [];
let s = 12345; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < 46; i++) {
  const z = -4 + rnd() * 14, mat = new THREE.SpriteMaterial({map:puffs[i % 4], transparent:true, depthWrite:false, opacity:0});
  const sp = new THREE.Sprite(mat), sc = 5 + rnd() * 7 - z * .15;
  sp.scale.set(sc * 1.5, sc, 1);
  const c = {sp, x0:(rnd() - .5) * 26, y0:(rnd() - .5) * 13, z, sc, spin:(rnd() - .5) * .3, drift:(rnd() - .5) * .4, speed:.8 + rnd() * .6};
  sp.position.set(c.x0, c.y0, z); scene.add(sp); clouds.push(c);
}
// one soft veil behind the puffs so no gaps show while the page is covered
const veil = new THREE.Mesh(new THREE.PlaneGeometry(80, 50), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:1, depthWrite:false, toneMapped:false}));
veil.position.z = -5; scene.add(veil);
function tint() {
  const d = dark();
  // night sky in the dark theme, a pale day sky in the light one; navy either way
  for (const c of clouds) c.sp.material.color.set(d ? 0xc9d0dc : 0xffffff);
  veil.material.color.set(d ? 0x0c1428 : 0xdbe5f3);
  rimL.intensity = d ? 1.8 : 1.1;
}
tint(); new MutationObserver(tint).observe(root, {attributes:true, attributeFilter:['data-theme']});

/* ---------- layout: the laptop sits in the .lapbox, the canvas covers the hero ---------- */
let W = 1, H = 1, target = new THREE.Vector3(), scale = 1;
function layout() {
  const hr = hero.getBoundingClientRect(), br = box.getBoundingClientRect();
  W = hr.width; H = hr.height;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
  camera.aspect = W / H; camera.updateProjectionMatrix();
  const visH = 2 * CAM_Z * Math.tan(FOV * Math.PI / 360), visW = visH * camera.aspect, px = visH / H;
  target.set((br.left - hr.left + br.width * (W > 860 ? .6 : .52) - W / 2) * px, -(br.top - hr.top + br.height / 2 - H / 2) * px, 0);
  scale = Math.min(br.width * px / (LW * 1.12), br.height * px / 2.6);
}
addEventListener('resize', layout); layout();
new ResizeObserver(layout).observe(hero); new ResizeObserver(layout).observe(box);

/* ---------- timeline ---------- */
const DUR = 3000, RISE_A = 250, RISE_B = 2700, TEXT_AT = 2550;
let t = 0, last = 0, warm = 0, started = false, released = false, mx = 0, my = 0, sx = 0, sy = 0;
function start() { started = true; }
if (RM) { started = true; t = 1e9; release(); released = true; }
addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, {passive:true});

let visible = true;
new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(hero);

function frame(now) {
  // the clouds wait for the ring intro to start fading, then roll away
  if (!started) { const intro = document.getElementById('intro'); if (!root.classList.contains('intro') || (intro && intro.classList.contains('leaving'))) start(); }
  // time only moves in small steps, so a slow first frame (shader warm-up) can't skip the clouds
  const dt = last ? Math.min(now - last, 34) : 0; last = now;
  if (started && warm > 2 && !RM) t += dt;
  warm++;
  const k = inOut(span(t, 0, DUR));                       // clouds: 0 = covering, 1 = gone
  for (const c of clouds) {
    const dir = Math.sign(c.x0) || 1, p = clamp(k * c.speed);
    c.sp.position.set(c.x0 + dir * p * 9 + c.drift * t / 1000, c.y0 - p * 16, c.z);
    c.sp.material.rotation = c.spin * p;
    c.sp.material.opacity = (1 - span(k, .55, 1)) * (started ? 1 : 1);
  }
  veil.material.opacity = 1 - span(k, .05, .45);
  // laptop rises through the clouds and settles at its peak
  const r = out(span(t, RISE_A, RISE_B));
  const idle = now / 1000;
  sx += (mx - sx) * .05; sy += (my - sy) * .05;
  rig.position.set(target.x, target.y - (1 - r) * 9 + (r > .98 ? Math.sin(idle * 1.1) * .08 : 0), target.z);
  rig.scale.setScalar(scale);
  rig.rotation.set(.3 + (1 - r) * .5 + sy * .12 + Math.sin(idle * .9) * .015, -.5 + (1 - r) * .7 + sx * .3, .05 - (1 - r) * .12);
  // the screen scrolls through the project, slowly, top to bottom and back
  const sc = (Math.sin(idle * .12 - Math.PI / 2) + 1) / 2;
  shot.offset.y = (1 - VIEW) * (1 - sc);
  if (!released && t > TEXT_AT) { released = true; release(); }
  if (visible || !released) renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
canvas.classList.add('on');
window.__lapRunning = true;
