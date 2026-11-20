/* Signet Works — Work page hero: a ribbon of live work that spirals around the viewer and lands in a grid,
   then the page header drops in above it. Plays by itself each time the Work page opens. */
import * as THREE from './vendor/three.module.min.js';

const R2 = 'videos/';
const WORK = [
  ['Medixis — Live', 'medixis.mp4', 'https://medixisgroup.com'],
  ['Kettle & Crema — Concept', 'kettle-crema.mp4', 'concepts/coffee.html'],
  ['Clearwell Cleaning — Concept', 'clearwell-cleaning.mp4', 'concepts/cleaning.html'],
  ['Plumb & Level — Concept', 'plumb-level.mp4', 'concepts/handyman.html'],
  ['Nebulo — Concept', 'nebulo.mp4', 'concepts/startup.html'],
];
const DURATION = 9000, HEAD_AT = .9, HEAD_MS = 1400;
const $ = id => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mix = (a, b, t) => a + (b - a) * t;
const ease = t => t * t * (3 - 2 * t);
const out = t => 1 - (1 - t) ** 3;
const span = (p, a, b) => clamp((p - a) / (b - a));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const light = () => root.getAttribute('data-theme') === 'light';
const pal = () => light()
  ? {base:0xEDEBE7, rim:0x1C1B19, card:'#F2F0EC', ink:'#1C1B19', soft:'rgba(28,27,25,.62)'}
  : {base:0x131313, rim:0xFFFFFF, card:'#0A0A0B', ink:'#F5F5F7', soft:'rgba(245,245,247,.72)'};

/* ---------- renderer ---------- */
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setClearColor(0, 0);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const scene = new THREE.Scene();
const FOV = 35, camera = new THREE.PerspectiveCamera(FOV, 1, .1, 100);

/* ---------- ribbon path ---------- */
let path, PATH_L = 1;
const SAMPLES = 1200, pathP = [], pathT = [];
const PH0 = -1.5, PH1 = Math.PI * 2 + 1.35;
function buildPath() {
  const pts = [];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160, ph = mix(PH0, PH1, t), cs = Math.cos(ph), u = 2 * t - 1;
    // a shallow arc close to the camera, then long runs far behind it
    const depth = cs > 0 ? 7.6 + 16.4 * cs ** .9 : 7.6 + 2.2 * cs;
    const edge = .84 + .5 * span(.14 - t, 0, .14) + .8 * span(t, .84, 1);
    pts.push(new THREE.Vector3(edge * Math.sin(ph) * depth * .561, .5 * Math.sign(u) * Math.abs(u) ** 1.4 * depth * .63, -depth));
  }
  path = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  path.arcLengthDivisions = 1500;
  PATH_L = path.getLength(); pathP.length = pathT.length = 0;
  for (let i = 0; i <= SAMPLES; i++) { const u = i / SAMPLES; pathP.push(path.getPointAt(u)); pathT.push(path.getTangentAt(u)); }
}
const at = (s, op, ot) => {
  const f = clamp(s / PATH_L) * SAMPLES, i = Math.min(SAMPLES - 1, Math.floor(f)), k = f - i;
  op.lerpVectors(pathP[i], pathP[i + 1], k); ot.lerpVectors(pathT[i], pathT[i + 1], k).normalize();
};

/* ---------- cards ---------- */
const CARD_W = 2.1, CARD_H = 1.32, GAP = .03, STEP = CARD_W + GAP, NX = 28, NY = 3;
const vs = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fs = `uniform sampler2D map;uniform vec2 cover;uniform float aspect,ready,radius;uniform vec3 base,rim;varying vec2 vUv;
void main(){
  vec2 q=(abs(vUv-.5)-.5)*vec2(aspect,1.)+radius;
  float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
  float px=fwidth(d),a=1.-smoothstep(-px,px,d);
  if(a<.01)discard;
  vec2 uv=vUv;if(!gl_FrontFacing)uv.x=1.-uv.x;
  vec3 c=mix(base,texture2D(map,(uv-.5)*cover+.5).rgb,ready);
  float edge=smoothstep(-.012-px,-.012,d);
  gl_FragColor=vec4(mix(c,rim,edge*.12),a);
}`;
function makeMesh(tex) {
  const geo = new THREE.PlaneGeometry(1, 1, NX, NY);
  const mat = new THREE.ShaderMaterial({vertexShader:vs, fragmentShader:fs, transparent:true, side:THREE.DoubleSide,
    uniforms:{map:{value:tex}, cover:{value:new THREE.Vector2(1, 1)}, aspect:{value:CARD_W / CARD_H}, ready:{value:0}, radius:{value:.018}, base:{value:new THREE.Color()}, rim:{value:new THREE.Color()}}});
  const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; mesh.visible = false; scene.add(mesh);
  return {geo, mat, mesh};
}
function canvasTex(draw) {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = Math.round(1024 * CARD_H / CARD_W);
  draw(cv.getContext('2d'), cv.width, cv.height);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.NoColorSpace; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  return tex;
}
// if a video is missing, keep the dark placeholder and write the project name small in the centre
const nameCard = title => canvasTex((g, w, h) => {
  const k = pal(); g.fillStyle = k.card; g.fillRect(0, 0, w, h);
  g.fillStyle = k.soft; g.font = '500 30px Inter, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(title.split(' — ')[0], w / 2, h / 2);
});
const cards = WORK.map(([title, src, url], i) => {
  const v = document.createElement('video');
  Object.assign(v, {crossOrigin:'anonymous', muted:true, loop:true, playsInline:true, preload:'auto', src:R2 + src});
  v.setAttribute('playsinline', '');
  const tex = new THREE.VideoTexture(v);
  tex.colorSpace = THREE.NoColorSpace; tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  const {geo, mat, mesh} = makeMesh(tex);
  const c = {i, title, url, v, tex, geo, mat, mesh, rect:null, failed:false};
  v.addEventListener('loadeddata', () => {
    const va = v.videoWidth / v.videoHeight, ca = CARD_W / CARD_H;
    mat.uniforms.cover.value.set(va > ca ? ca / va : 1, va > ca ? 1 : va / ca);
    mat.uniforms.ready.value = 1;
  });
  v.addEventListener('error', () => {
    c.failed = true; mat.uniforms.map.value = nameCard(title); mat.uniforms.cover.value.set(1, 1); mat.uniforms.ready.value = 1;
  });
  return c;
});
// the sixth grid slot: an open invitation, never part of the ribbon
const ctaTex = canvasTex((g, w, h) => { g.fillStyle = '#0a0a0b'; g.fillRect(0, 0, w, h); });
const cta = Object.assign(makeMesh(ctaTex), {i:5, title:'Start a project', url:'start.html', rect:null});
cta.mat.uniforms.ready.value = 1;
function drawCta() {
  const cv = ctaTex.image, g = cv.getContext('2d'), w = cv.width, h = cv.height, k = pal();
  g.fillStyle = k.card; g.fillRect(0, 0, w, h);
  g.fillStyle = k.ink; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = '500 92px Newsreader, Georgia, serif'; g.fillText('Your business', w / 2, h / 2 - 8);
  g.font = 'italic 500 92px Newsreader, Georgia, serif'; g.fillText('could be next.', w / 2, h / 2 + 92);
  ctaTex.needsUpdate = true;
}
drawCta();
if (document.fonts) Promise.all([document.fonts.load('500 92px Newsreader'), document.fonts.load('italic 500 92px Newsreader')]).then(drawCta, drawCta);
const all = cards.concat([cta]);
function applyTheme() {
  const k = pal();
  for (const c of all) { c.mat.uniforms.base.value.setHex(k.base); c.mat.uniforms.rim.value.setHex(k.rim); }
  for (const c of cards) if (c.failed) c.mat.uniforms.map.value = nameCard(c.title);
  drawCta();
}
applyTheme();
new MutationObserver(applyTheme).observe(root, {attributes:true, attributeFilter:['data-theme']});

/* ---------- layout ---------- */
let p = 0, hp = 0;
const GZ = 8;
let W = 1, H = 1, asp = 1, cols = 3, rows = 2, tanH = .3153;
function resize() {
  W = innerWidth; H = innerHeight; asp = W / H;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
  camera.aspect = asp; camera.fov = asp < 16 / 9 ? Math.atan(.561 / asp) * 360 / Math.PI : FOV; camera.updateProjectionMatrix();
  tanH = Math.tan(camera.fov * Math.PI / 360);
  cols = asp < .9 ? 2 : 3; rows = asp < .9 ? 3 : 2;
}
addEventListener('resize', resize); buildPath(); resize();
function grid(i) {
  const vh = 2 * GZ * tanH, vw = vh * asp;
  // once the header drops in, the grid shrinks and moves down to make room for it
  const gw = vw * (cols === 3 ? .74 : .88) * mix(1, cols === 3 ? .7 : .8, hp), gap = gw * .017;
  const oy = -vh * mix(0, cols === 3 ? .17 : .14, hp);
  const cw = (gw - gap * (cols - 1)) / cols, ch = cw / (CARD_W / CARD_H), gh = ch * rows + gap * 1.6 * (rows - 1);
  const c = i % cols, r = Math.floor(i / cols);
  return {x:-gw / 2 + cw / 2 + c * (cw + gap), y:oy + gh / 2 - ch / 2 - r * (ch + gap * 1.6), w:cw, h:ch, vw, vh, c, r};
}

const track = $('track'), stage = $('stage');

/* ---------- pose ---------- */
const op = new THREE.Vector3(), ot = new THREE.Vector3(), up = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), vp = new THREE.Vector3();
function poseRibbon(c, head) {
  const pos = c.geo.attributes.position, centre = head - c.i * STEP;
  for (let iy = 0; iy <= NY; iy++) for (let ix = 0; ix <= NX; ix++) {
    const k = iy * (NX + 1) + ix, lu = ix / NX - .5, lv = .5 - iy / NY;
    at(centre + lu * CARD_W, op, ot);
    // keep the sheet upright, leaning a little into the turn
    up.copy(Y).addScaledVector(ot, -Y.dot(ot)).normalize();
    vp.copy(op).addScaledVector(up, lv * CARD_H);
    pos.setXYZ(k, vp.x, vp.y, vp.z);
  }
  pos.needsUpdate = true;
}
function poseGrid(c, q) {
  const g = grid(c.i), pos = c.geo.attributes.position;
  const dx = (g.c - (cols - 1) / 2) * 1.2 + (cols === 3 && g.c === 1 ? 0 : 0), dy = g.r < rows / 2 ? 1 : -1;
  const ox = dx * g.vw * .62 * (1 - q), oy = dy * g.vh * (g.c === 1 ? .95 : .34) * (1 - q), tilt = (1 - q) * .22 * (g.c - 1 || .5) * dy;
  const cs = Math.cos(tilt), sn = Math.sin(tilt);
  for (let iy = 0; iy <= NY; iy++) for (let ix = 0; ix <= NX; ix++) {
    const k = iy * (NX + 1) + ix, x = (ix / NX - .5) * g.w, y = (.5 - iy / NY) * g.h;
    pos.setXYZ(k, g.x + ox + x * cs - y * sn, g.y + oy + x * sn + y * cs, -GZ - (1 - q) * .6 * Math.sin(ix / NX * Math.PI));
  }
  pos.needsUpdate = true;
  c.rect = g;
}

const RIB_A = .14, RIB_B = .63;
function render() {
  const pp = p;
  // headline runs right across the page in opposite directions
  const rise = 1 - out(span(pp, 0, .12));
  const run = mix(-50, 76, span(pp, 0, .58));
  $('l1').style.transform = `translate3d(${run}vw,${rise * 34}vh,0)`;
  $('l2').style.transform = `translate3d(${-run}vw,${rise * 34}vh,0)`;
  const capA = 1 - span(pp, .52, .57);
  $('cap').style.opacity = capA; $('cap').style.transform = `translate(-50%,calc(-50% + ${rise * 34}vh))`;
  const intro = 1 - span(pp, 0, .05);
  for (const id of ['hint', 'pager', 'cross', 'glow']) $(id).style.opacity = intro;
  $('hint').style.pointerEvents = $('pager').style.pointerEvents = intro > .5 ? 'auto' : 'none';
  $('rule').style.transform = `scaleX(${ease(span(pp, .72, .86))})`;
  // ribbon, then the grid
  const pr = span(pp, RIB_A, RIB_B), head = mix(0, PATH_L + cards.length * STEP, pr);
  for (const c of all) {
    const ribbon = c !== cta, s = head - c.i * STEP, end = PATH_L - CARD_W;
    if (ribbon && s < end) {
      c.mesh.visible = s > CARD_W; c.rect = null;
      if (c.mesh.visible) poseRibbon(c, head);
    } else if (c.i < cols * rows) {
      // each card flies to its slot the moment it leaves the rail (the CTA uses a sixth card's timing)
      const st = mix(RIB_A, RIB_B, (end + c.i * STEP) / (PATH_L + cards.length * STEP)), q = out(span(pp, st, st + .13));
      c.mesh.visible = q > .001;
      if (c.mesh.visible) poseGrid(c, q); else c.rect = null;
    } else { c.mesh.visible = false; c.rect = null; }
  }
  renderer.render(scene, camera);
}

/* ---------- hover + click ---------- */
const nameEl = $('name');
function hitAt(e) {
  if (p <= .86) return null;
  const b = stage.getBoundingClientRect(), nx = ((e.clientX - b.left) / W - .5), ny = (.5 - (e.clientY - b.top) / H);
  let hit = null;
  for (const c of all) { const g = c.rect; if (!g) continue; const x = nx * g.vw, y = ny * g.vh; if (Math.abs(x - g.x) < g.w / 2 && Math.abs(y - g.y) < g.h / 2) hit = c; }
  return hit;
}
stage.addEventListener('pointermove', e => {
  const hit = e.target.closest('a,button') ? null : hitAt(e);
  nameEl.style.opacity = hit ? 1 : 0;
  stage.style.cursor = hit ? 'pointer' : '';
  if (hit) { nameEl.textContent = hit.title; const b = stage.getBoundingClientRect(); nameEl.style.transform = `translate(${e.clientX - b.left + 14}px,${e.clientY - b.top + 16}px)`; }
});
stage.addEventListener('pointerleave', () => { nameEl.style.opacity = 0; stage.style.cursor = ''; });
stage.addEventListener('click', e => {
  if (e.target.closest('a,button')) return;
  const hit = hitAt(e); if (!hit) return;
  if (/^https?:/.test(hit.url)) window.open(hit.url, '_blank', 'noopener'); else location.href = hit.url;
});

/* ---------- pills ---------- */
const menuPill = $('menuPill');
if (menuPill) menuPill.addEventListener('click', e => { const b = document.querySelector('.menu-btn'); if (b){ e.preventDefault(); b.click(); } });

/* ---------- the header that drops in once the grid lands ---------- */
const headEl = $('rbHead');
(function split(el){
  let n = 0;
  (function walk(node){
    for (const t of Array.from(node.childNodes)) {
      if (t.nodeType === 1) { walk(t); continue; }
      if (t.nodeType !== 3) continue;
      const frag = document.createDocumentFragment();
      for (const w of t.textContent.split(/(\s+)/)) {
        if (!w) continue;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); continue; }
        const o = document.createElement('span'), i = document.createElement('span');
        o.className = 'w'; i.className = 'wi'; i.style.setProperty('--i', n++); i.textContent = w;
        o.appendChild(i); frag.appendChild(o);
      }
      t.parentNode.replaceChild(frag, t);
    }
  })(el);
})(headEl.querySelector('.rb-h'));

/* ---------- timeline ---------- */
let t0 = 0, playing = false, headStart = 0;
function land(now) {
  headStart = now; stage.classList.add('done'); headEl.classList.add('in'); root.classList.remove('ribbon-on');
}
function play() {
  t0 = performance.now(); playing = true; headStart = 0; hp = 0; p = 0;
  stage.classList.remove('done'); headEl.classList.remove('in'); root.classList.add('ribbon-on');
}
function skip() { playing = false; p = 1; land(performance.now() - HEAD_MS); }
$('skipAnim').addEventListener('click', skip);
addEventListener('keydown', e => { if (e.key === 'Escape' && playing) skip(); });
// the Work tab plays it again when you're already here
document.querySelectorAll('a[href="work.html"]').forEach(a => a.addEventListener('click', e => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  e.preventDefault();
  if (root.classList.contains('menu-open')) { const b = document.querySelector('.menu-btn'); b && b.click(); }
  scrollTo(0, 0); if (!RM) play();
}));

/* ---------- loop ---------- */
function loop(now) {
  if (playing) {
    p = clamp((now - t0) / DURATION);
    if (p >= HEAD_AT && !headStart) land(now);
    if (p >= 1) playing = false;
  }
  if (headStart) hp = out(clamp((now - headStart) / HEAD_MS));
  const r = track.getBoundingClientRect();
  if (r.bottom > 0 && r.top < innerHeight) {
    for (const c of cards) {
      if (c.mesh.visible && c.v.paused && !c.failed) c.v.play().catch(() => {});
      else if (!c.mesh.visible && !c.v.paused) c.v.pause();
    }
    render();
  } else for (const c of cards) if (!c.v.paused) c.v.pause();
  requestAnimationFrame(loop);
}
// wait for the first-visit intro (if it's running) before starting
(function start() {
  if (RM) return skip();
  if (root.classList.contains('intro')) return setTimeout(start, 120);
  play();
})();
root.classList.toggle('ribbon-on', !RM);
requestAnimationFrame(loop);
