// ---------- destruction: windows, explosive barrels, fire extinguishers, fish tanks, weak walls, doors off hinges, sparking machines, bloody footprints ----------
Object.assign(SFX, {
  glass: (t, v) => { for (let i = 0; i < 7; i++) tone(t + i * 0.018, 0.14, 'triangle', 2600 + Math.random() * 2600, 1600, 0.07 * v); nz(t, 0.35, 'highpass', 5200, 3000, 1, 0.55 * v); },
  hiss: (t, v) => { nz(t, 1.4, 'highpass', 2600, 1600, 0.6, 0.55 * v); },
  splash: (t, v) => { nz(t, 0.7, 'lowpass', 1800, 260, 1, 0.9 * v); nz(t + 0.06, 0.45, 'bandpass', 900, 380, 2, 0.4 * v); },
  clunk: (t, v) => { tone(t, 0.1, 'square', 230, 120, 0.15 * v); nz(t, 0.1, 'lowpass', 800, 300, 1, 0.4 * v); },
  fuse: (t, v) => { nz(t, 0.35, 'bandpass', 3200, 2200, 4, 0.35 * v); tone(t, 0.3, 'square', 900, 1400, 0.03 * v); },
  crumble: (t, v) => { nz(t, 0.9, 'lowpass', 700, 60, 0.8, 1.3 * v); for (let i = 0; i < 5; i++) nz(t + 0.1 + i * 0.07, 0.08, 'bandpass', 1400, 600, 2, 0.4 * v); },
});
const SPARKY = { vend: 1, tvwall: 1, term: 1, server: 1, console: 1, xmit: 1, gen: 1, breaker: 1, ac: 1 };
const INDUSTRIAL = ['grate', 'plate', 'dark', 'hazard', 'asph', 'rail', 'deck', 'water', 'dirt', 'mud', 'lift', 'roof', 'rock'];
function destGfx() {
  if (GFX.barrel) return;
  GFX.barrel = hdc(hardOutline(spr(18, 18, P => { P.d(9, 9, 8, 8, '#5a0808'); P.d(9, 9, 7.2, 7.2, '#d01c18'); P.d(9, 9, 5.8, 5.8, '#8a0e0e'); P.d(9, 9, 5, 5, '#c01816'); for (let a = 3.4; a < 4.6; a += 0.15) P.p(9 + Math.cos(a) * 6.6, 9 + Math.sin(a) * 6.6, '#ff6a5a');
    for (let dy = -4; dy <= 4; dy++) { const w = 4 - Math.abs(dy); P.r(9 - w - 1, 9 + dy, 2 * w + 3, 1, '#141414'); if (w > 0) P.r(9 - w, 9 + dy, 2 * w + 1, 1, '#ffd020'); } P.p(9, 7, '#141414'); P.r(8, 8, 3, 2, '#141414'); P.p(9, 10, '#141414'); P.d(4.5, 12.5, 1.3, 1.3, '#8a8f99'); }), INK));
  GFX.barrelBlown = hdc(hardOutline(spr(22, 22, P => { for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; P.ln(11, 11, 11 + Math.cos(a) * 10, 11 + Math.sin(a) * 10, '#3a3a3e', 3); P.ln(11, 11, 11 + Math.cos(a) * 9, 11 + Math.sin(a) * 9, i % 3 ? '#5a1a14' : '#8a2a1a', 1); } P.d(11, 11, 5, 5, '#0a0a0a'); P.d(11, 11, 2, 2, '#ff7a1a'); }), INK));
  GFX.ext = hdc(hardOutline(spr(10, 16, P => { P.r(2, 3, 6, 12, '#c81e1e'); P.r(2, 3, 2, 12, '#ff5a4a'); P.r(7, 3, 1, 12, '#8a0e0e'); P.r(2, 7, 6, 3, '#f0f0f0'); P.r(3, 8, 4, 1, '#c81e1e'); P.r(3, 0, 4, 3, '#1a1a1a'); P.r(7, 1, 2, 1, '#1a1a1a'); P.p(8, 2, '#1a1a1a'); }), INK));
  GFX.tank = hdc(spr(32, 16, P => { P.r(0, 0, 32, 16, INK); P.r(1, 1, 30, 14, '#9aa0a8'); P.r(2, 2, 28, 12, '#2a7ab8'); P.r(2, 2, 28, 3, '#5ab0e8'); P.r(2, 11, 28, 3, '#c8a868'); for (let x = 3; x < 29; x += 2) P.p(x, 12 + (x % 3 === 0 ? 1 : 0), '#a88848'); for (const x of [6, 20, 26]) { P.r(x, 7, 1, 5, '#2a9a3a'); P.p(x + 1, 8, '#3aca4a'); P.p(x - 1, 9, '#3aca4a'); } P.p(10, 4, '#d8f4ff'); P.p(22, 3, '#d8f4ff'); }));
  GFX.tankBroken = hdc(spr(32, 16, P => { P.r(0, 0, 32, 16, INK); P.r(1, 1, 30, 14, '#5a6068'); P.r(2, 2, 28, 12, '#1a1a1e'); P.r(2, 11, 28, 3, '#a88848'); for (const [x, y] of [[2, 2], [29, 2], [2, 10], [29, 10]]) P.r(x, y, 2, 3, '#8ad8f0'); P.p(14, 2, '#8ad8f0'); P.p(15, 3, '#8ad8f0'); }));
  GFX.fishA = hdc(hardOutline(spr(9, 5, P => { P.r(2, 1, 5, 3, '#ff8a1c'); P.r(0, 0, 2, 5, '#ff8a1c'); P.r(1, 1, 1, 3, '#ffd090'); P.p(6, 1, '#141414'); P.r(3, 1, 3, 1, '#ffb050'); }), '#3a1a08'));
  GFX.fishB = hdc(hardOutline(spr(9, 5, P => { P.r(2, 1, 5, 3, '#ffe040'); P.r(0, 0, 2, 5, '#3a6ab8'); P.p(6, 1, '#141414'); P.r(3, 2, 3, 1, '#3a6ab8'); }), '#3a2a08'));
  GFX.can = hdc(hardOutline(spr(4, 7, P => { P.r(0, 0, 4, 7, pick(['#c81e28', '#2a6ab8', '#2a9a3a'])); P.r(0, 0, 4, 1, '#d8d8d8'); P.r(1, 2, 1, 3, '#fff'); }), INK));
  GFX.can2 = hdc(hardOutline(spr(4, 7, P => { P.r(0, 0, 4, 7, '#2a6ab8'); P.r(0, 0, 4, 1, '#d8d8d8'); P.r(1, 2, 1, 3, '#fff'); }), INK));
  GFX.plank = hdc(hardOutline(spr(34, 7, P => { P.r(0, 0, 34, 7, '#7a4420'); P.r(0, 0, 34, 1, '#a8642e'); P.r(0, 5, 34, 2, '#5a3016'); for (let x = 4; x < 32; x += 7) P.p(x, 3, '#5a3016'); P.r(28, 2, 2, 2, '#d8b048'); P.r(31, 0, 3, 3, '#3a1a08'); }), INK));
  GFX.rubble = hdc(hardOutline(spr(7, 6, P => { P.d(3, 3, 3, 2.4, '#8a8478'); P.p(2, 2, '#b8b0a0'); P.p(4, 4, '#5a564e'); }), INK));
}
// ---------- setup per floor ----------
function destInit() {
  destGfx(); G.dest = []; G.smoke = []; G.fish = []; G.dfx = [];
  const W = M.W, H = M.H, N = W * H, b = M.b; M.wet = new Uint8Array(N); M.winBroken = new Uint8Array(N); M.objAt = new Int16Array(N).fill(-1); M.weak = []; M.spilled = {};
  b.objs.forEach((o, i) => { const O = OBJ[o.k]; for (let j = 0; j < O.h; j++) for (let k = 0; k < O.w; k++) M.objAt[(o.y + j) * W + o.x + k] = i; });
  if (floorDef().noDest) return;
  SEED = 7000 + G.li * 31 + G.fi * 7;
  // what kind of place is this floor?
  let ind = 0, tot = 0; for (let i = 0; i < N; i++) if (M.fl[i] && !M.wall[i]) { tot++; if (INDUSTRIAL.includes(FL_IDS[M.fl[i] - 1])) ind++; }
  const gala = /GALA/.test(LEVELS[G.li].name), industrial = ind / Math.max(1, tot) > 0.3 && !gala, outdoors = ['sand', 'rock'].some(k => countFl(k) > tot * 0.3);
  // cells we must keep clear: doors, exit, spawn, captives, enemies, items, switches, zones
  const busy = new Uint8Array(N), mark = (x, y, r) => { for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const X = x + i, Y = y + j; if (X >= 0 && Y >= 0 && X < W && Y < H) busy[Y * W + X] = 1; } };
  for (const d of b.doors) { mark(d.x, d.y, 2); mark(d.x + (d.o === 'h' ? 1 : 0), d.y + (d.o === 'v' ? 1 : 0), 2); }
  if (b.exit) for (let j = -1; j <= b.exit.h; j++) for (let i = -1; i <= b.exit.w; i++) mark(b.exit.x + i, b.exit.y + j, 0);
  mark(b.start[0], b.start[1], 7); for (const c of b.cages) mark(c.x + 1, c.y + 1, c.kind === 'cont' ? 5 : 3); for (const e of b.ens) mark(e.x, e.y, 1); for (const it of b.items) mark(it.x, it.y, 1); for (const s of b.sws) mark(s.x, s.y, 2); for (const s of b.sps) mark(s[0], s[1], 2); for (const w of b.wits) mark(w.x, w.y, 2);
  if (b.zone) for (let j = -1; j <= b.zone.h; j++) for (let i = -1; i <= b.zone.w; i++) mark(b.zone.x + i, b.zone.y + j, 0);
  for (const r of b.restrict || []) for (let j = 0; j < r[3]; j++) for (let i = 0; i < r[2]; i++) mark(r[0] + i, r[1] + j, 0);
  for (const p of b.props) mark(p.x + 1, p.y, 2);
  const free = c => M.fl[c] && !M.solid[c] && !M.wall[c] && !busy[c] && !M.water[c] && FL_IDS[M.fl[c] - 1] !== 'hazard';
  const wallSide = (x, y) => { for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && M.wall[Y * W + X] && !M.win[Y * W + X]) return [dx, dy]; } return null; };
  let reachNow = reachCount();
  const tryBlock = (cells) => { for (const c of cells) M.solid[c] = 1; const r = reachCount(); if (r < reachNow - cells.length) { for (const c of cells) M.solid[c] = 0; return false; } reachNow = r; for (const c of cells) { M.tall[c] = 1; busy[c] = 1; } return true; };
  const cand = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const c = y * W + x; if (free(c) && wallSide(x, y)) cand.push([x, y]); }
  for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(srnd() * (i + 1)); [cand[i], cand[j]] = [cand[j], cand[i]]; }
  const far = (x, y, k, d) => G.dest.every(o => o.k !== k || Math.hypot(o.cx - x, o.cy - y) > d);
  // explosive barrels in pairs where it makes sense
  if (industrial) { let n = 0; for (const [x, y] of cand) { if (n >= 4) break; const c = y * W + x; if (!free(c) || !far(x, y, 'barrel', 9)) continue; const [dx, dy] = wallSide(x, y), ax = dy ? 1 : 0, ay = dx ? 1 : 0, c2 = (y + ay) * W + x + ax;
    const pair = free(c2) && wallSide(x + ax, y + ay) ? [c, c2] : [c]; if (!tryBlock(pair)) continue; for (const q of pair) G.dest.push({ k: 'barrel', cx: q % W, cy: q / W | 0, x: (q % W + 0.5) * CELL, y: ((q / W | 0) + 0.5) * CELL, fuse: -1 }); n += pair.length; } }
  // fish tanks along the gala walls
  if (gala) { let n = 0; for (const [x, y] of cand) { if (n >= 2) break; const [dx, dy] = wallSide(x, y); if (!dy) continue; const c = y * W + x, c2 = c + 1; if (!free(c) || !free(c2) || !M.wall[(y + dy) * W + x + 1] || !far(x, y, 'fish', 12)) continue; if (!tryBlock([c, c2])) continue; G.dest.push({ k: 'fish', cx: x, cy: y, x: (x + 1) * CELL, y: (y + 0.5) * CELL, cells: [c, c2], fl: dy }); n++; } }
  // fire extinguishers on the walls of indoor rooms
  if (!outdoors) { let n = 0; for (const [x, y] of cand) { if (n >= 3) break; const c = y * W + x; if (!free(c) || !far(x, y, 'ext', 12)) continue; const f = FL_IDS[M.fl[c] - 1]; if (INDUSTRIAL.includes(f) && f !== 'dark') continue; const [dx, dy] = wallSide(x, y); busy[c] = 1; G.dest.push({ k: 'ext', cx: x, cy: y, x: (x + 0.5 + dx * 0.32) * CELL, y: (y + 0.5 + dy * 0.32) * CELL, a: Math.atan2(-dy, -dx) }); n++; } }
  // weak walls where explosives turn up: near barrels or explosive pickups
  const boomy = !floorDef().noWeak && (G.dest.some(d => d.k === 'barrel') || b.items.some(it => ['rocket', 'rail', 'frag'].includes(it.k)));
  if (boomy) { const segs = []; for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) { const c = y * W + x; if (!M.wall[c] || M.win[c] || busy[c]) continue;
      if (M.wall[c + 1] && M.fl[c - W] && M.fl[c + W] && M.fl[c + 1 - W] && M.fl[c + 1 + W] && !M.wall[c - W] && !M.wall[c + W] && !M.wall[c + 1 - W] && !M.wall[c + 1 + W] && !busy[c + 1]) segs.push({ cells: [c, c + 1], o: 'h', x: (x + 1) * CELL, y: (y + 0.5) * CELL });
      if (M.wall[c + W] && M.fl[c - 1] && M.fl[c + 1] && M.fl[c + W - 1] && M.fl[c + W + 1] && !M.wall[c - 1] && !M.wall[c + 1] && !M.wall[c + W - 1] && !M.wall[c + W + 1] && !busy[c + W]) segs.push({ cells: [c, c + W], o: 'v', x: (x + 0.5) * CELL, y: (y + 1) * CELL }); }
    const bar = G.dest.filter(d => d.k === 'barrel'), score = s => bar.length ? Math.min(...bar.map(d => Math.hypot(d.x - s.x, d.y - s.y))) : srnd() * 200;
    segs.sort((p, q) => score(p) - score(q)); for (const s of segs) { if (M.weak.length >= 2) break; if (M.weak.some(w => Math.hypot(w.x - s.x, w.y - s.y) < 60)) continue; M.weak.push(s); } drawCracks(); }
  function countFl(k) { const id = FL_IDS.indexOf(k) + 1; let n = 0; for (let i = 0; i < N; i++) if (M.fl[i] === id) n++; return n; }
}
// how many cells the player can reach from the start (keeps placements from blocking routes)
function reachCount() { const W = M.W, H = M.H, s = M.b.start[1] * W + M.b.start[0], seen = new Uint8Array(W * H), q = [s]; seen[s] = 1; let n = 0;
  while (q.length) { const c = q.pop(); n++; const x = c % W; for (const d of [-1, 1, -W, W]) { const o = c + d; if (o < 0 || o >= W * H || seen[o] || (d === -1 && x === 0) || (d === 1 && x === W - 1)) continue; if (cellBlocked(o)) continue; seen[o] = 1; q.push(o); } } return n; }
// ---------- drawing helpers on the pre-rendered layers (pixel space) ----------
function withPx(cv, fn) { const x = cv.getContext('2d'); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); fn(x); x.restore(); }
function drawCracks() { const T = CELL * HDK; withPx(M.wallC, x => { for (const s of M.weak) { const X0 = Math.min(...s.cells.map(c => (c % M.W) * T)), Y0 = Math.min(...s.cells.map(c => (c / M.W | 0) * T)), w = s.o === 'h' ? T * 2 : T, h = s.o === 'h' ? T : T * 2;
  x.fillStyle = '#4a3a34'; x.fillRect(X0 + 1, Y0 + 1, w - 2, h - 2); x.fillStyle = '#6a584e'; for (let i = 0; i < 14; i++) x.fillRect(X0 + 2 + (i * 7) % (w - 4), Y0 + 2 + (i * 5) % (h - 4), 2, 1);
  const L = s.o === 'h' ? w : h, pts = []; for (let k = 0; k <= 6; k++) { const t = k / 6, off = (k % 2 ? 1 : -1) * (2 + (k * 3) % 3); pts.push(s.o === 'h' ? [X0 + t * L, Y0 + h / 2 + off] : [X0 + w / 2 + off, Y0 + t * L]); }
  x.strokeStyle = '#0a0606'; x.lineWidth = 2; x.beginPath(); pts.forEach((p, k) => k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); x.lineWidth = 1; for (let k = 1; k < 6; k += 2) { const p = pts[k]; x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(p[0] + (s.o === 'h' ? 2 : 4), p[1] + (s.o === 'h' ? 4 : 2)); x.stroke(); }
  x.fillStyle = '#d8ccb8'; for (const p of pts) x.fillRect(p[0] + 1, p[1] - 2, 1, 1); } }); }
function redrawWalls() { withPx(M.wallC, x => { x.clearRect(0, 0, M.wallC.width, M.wallC.height); drawWallsHD(x, M.def, true); const T = CELL * HDK; for (let c = 0; c < M.W * M.H; c++) if (M.winBroken[c]) drawWindow(x, (c % M.W) * T, (c / M.W | 0) * T, T, M.win[c] === 1, true); }); drawCracks(); }
// ---------- breaking things ----------
function breakWindow(c, ang) {
  if (!M.win[c] || M.winBroken[c]) return; M.winBroken[c] = 1; const T = CELL * HDK, cx = (c % M.W + 0.5) * CELL, cy = ((c / M.W | 0) + 0.5) * CELL;
  withPx(M.wallC, x => drawWindow(x, (c % M.W) * T, (c / M.W | 0) * T, T, M.win[c] === 1, true)); sfx('glass', cx, cy);
  const d = M.decX; for (let i = 0; i < 26; i++) { const a = ang + Math.PI + rr(-1.2, 1.2), r = rr(2, 14); d.fillStyle = pick(['#ffffff', '#9ee8ff', '#5ab8d8']); d.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, rr(0.5, 1.2), 0.5); }
  for (let i = 0; i < 10; i++) part(cx, cy, rr(-120, 120), rr(-120, 120), rr(0.15, 0.35), pick(['#fff', '#9ee8ff']), 1);
}
function blowDoor(dr, ang) {
  const i = M.doors.indexOf(dr); if (i < 0) return; M.doors.splice(i, 1); const e = doorEnds(dr), mx = (e[0] + e[2]) / 2, my = (e[1] + e[3]) / 2;
  G.corpses.push({ x: mx, y: my, a: dr.base + dr.ang, spr: GFX.plank, vx: Math.cos(ang) * 210, vy: Math.sin(ang) * 210, va: rr(-14, 14), pool: null, debris: 1 });
  for (let k = 0; k < 18; k++) part(mx, my, Math.cos(ang) * rr(40, 220) + rr(-60, 60), Math.sin(ang) * rr(40, 220) + rr(-60, 60), rr(0.2, 0.5), pick(['#c08a5a', '#8a5a3a', '#5a3016']), ri(1, 2), 1);
  sfx('thud', mx, my); sfx('door', mx, my); G.shake = Math.max(G.shake, 0.4); mapChanged(); makeNoise(mx, my, 260);
}
function breakWeak(s) {
  if (s.broken) return; s.broken = true; M.weak.splice(M.weak.indexOf(s), 1); const W = M.W, T = CELL * HDK;
  const nb = s.cells.map(c => s.o === 'h' ? M.fl[c - W] || M.fl[c + W] : M.fl[c - 1] || M.fl[c + 1]);
  s.cells.forEach((c, i) => { M.wall[c] = 0; M.solid[c] = 0; M.tall[c] = 0; M.fl[c] = nb[i] || 1; const pat = GFX.floor[FL_IDS[M.fl[c] - 1]], X = (c % W) * T, Y = (c / W | 0) * T; withPx(M.floorC, x => x.drawImage(pat, X % 32, Y % 32, T, T, X, Y, T, T)); });
  redrawWalls(); mapChanged(); G.flow = null;
  for (let k = 0; k < 8; k++) chunk(s.x, s.y, rr(0, 6.28), 3.1, GFX.rubble, 0.8);
  for (let k = 0; k < 40; k++) part(s.x + rr(-6, 6), s.y + rr(-6, 6), rr(-180, 180), rr(-180, 180), rr(0.3, 0.8), pick(['#8a8478', '#b8b0a0', '#5a564e', '#efe4cc']), ri(1, 2), 1);
  sfx('crumble', s.x, s.y); G.shake = Math.max(G.shake, 0.9); pop(s.x, s.y, 'WALL DOWN', '#ffe14d'); makeNoise(s.x, s.y, 400);
}
function hitDest(d, byP, ang, melee) {
  if (d.dead) return;
  if (d.k === 'barrel') { if (d.fuse < 0) { d.fuse = melee ? 0.9 : 0.32; d.byP = byP; sfx('fuse', d.x, d.y); } return; }
  if (d.k === 'ext') { d.dead = true; G.smoke.push({ x: d.x + Math.cos(d.a) * 10, y: d.y + Math.sin(d.a) * 10, r: 4, t: 0, life: 7.5, seed: Math.random() * 99 }); sfx('hiss', d.x, d.y); sfx('tink', d.x, d.y); chunk(d.x, d.y, d.a, 0.6, GFX.ext, 1.4); makeNoise(d.x, d.y, 200); if (byP) pop(d.x, d.y, 'SMOKESCREEN', '#e8f0f0'); return; }
  if (d.k === 'fish') { d.dead = true; for (const c of d.cells) { M.solid[c] = 0; M.tall[c] = 0; } mapChanged(); sfx('glass', d.x, d.y); sfx('splash', d.x, d.y);
    const dx = M.decX, wy = d.y + d.fl * -6; for (let i = 0; i < 14; i++) { dx.fillStyle = `rgba(${rr(60, 110) | 0},${rr(150, 200) | 0},230,0.28)`; dx.beginPath(); dx.ellipse(d.x + rr(-16, 16), wy + rr(-10, 10) * 1, rr(4, 10), rr(3, 7), rr(0, 3), 0, 6.29); dx.fill(); }
    for (let i = 0; i < 30; i++) { dx.fillStyle = pick(['#ffffff', '#9ee8ff', '#5ab8d8']); dx.fillRect(d.x + rr(-14, 14), wy + rr(-12, 12), rr(0.5, 1.3), 0.5); }
    for (let i = 0; i < 4; i++) G.fish.push({ x: d.x + rr(-6, 6), y: d.y - d.fl * 3, vx: rr(-40, 40), vy: -d.fl * rr(30, 80), z: 0, vz: 0, a: rr(0, 6.28), t: 0, life: rr(6, 10), img: i % 2 ? GFX.fishA : GFX.fishB, hop: 0 });
    for (let i = 0; i < 14; i++) part(d.x, d.y, rr(-140, 140), rr(-140, 140), rr(0.2, 0.5), pick(['#9ee8ff', '#fff', '#5ab8d8']), 1); if (byP) pop(d.x, d.y, 'SPLASH', '#5ab8e8'); return; }
}
function explodeBarrel(d) {
  d.dead = true; const c = d.cy * M.W + d.cx; M.solid[c] = 0; M.tall[c] = 0; mapChanged();
  dRot(M.decX, GFX.barrelBlown, d.x, d.y, rr(0, 6.28)); G.dfx.push({ k: 'fire', x: d.x, y: d.y, t: 0, life: 3.5 });
  explode(d.x, d.y, 38, d.byP, 'barrel');
}
// a shot stopped inside something solid at (bx, by); (ox, oy) is the last point before it
function destBullet(b, ox, oy) {
  const x = Math.floor(b.x / CELL), y = Math.floor(b.y / CELL), c = y * M.W + x, ang = Math.atan2(b.vy, b.vx), byP = b.owner === 'p';
  if (M.win[c]) breakWindow(c, ang);
  for (const d of G.dest) if (!d.dead && (d.k === 'barrel' ? d.cx === x && d.cy === y : d.k === 'fish' ? d.cells.includes(c) : Math.hypot(d.x - ox, d.y - oy) < 6)) hitDest(d, byP, ang);
  const oi = M.objAt[c]; if (oi >= 0 && SPARKY[M.b.objs[oi].k]) sparkObj(oi, ox, oy, ang);
}
function sparkObj(oi, x, y, ang) {
  for (let i = 0; i < 9; i++) { const a = ang + Math.PI + rr(-1, 1), s = rr(60, 220); part(x, y, Math.cos(a) * s, Math.sin(a) * s, rr(0.1, 0.35), pick(['#ffe14d', '#fff', '#3ff', '#ff8a1c']), 1); }
  if (!G.sparkT || G.time - G.sparkT > 0.12) { G.sparkT = G.time; sfx('zap', x, y); }
  const o = M.b.objs[oi]; if (o.k === 'vend' && !M.spilled[oi]) { M.spilled[oi] = 1; for (let i = 0; i < 6; i++) chunk(x, y, ang + Math.PI, 1.2, i % 2 ? GFX.can : GFX.can2, 0.8); sfx('clunk', x, y); }
}
// player swings break things in reach
function destMelee(e, W) {
  const reach = (W ? W.reach : 21) + 4;
  for (const d of G.dest) { if (d.dead) continue; const dd = Math.hypot(d.x - e.x, d.y - e.y), a = Math.atan2(d.y - e.y, d.x - e.x); if (dd < reach + (d.k === 'fish' ? 8 : 4) && Math.abs(angDiff(a, e.a)) < 1.3) hitDest(d, true, a, true); }
}
function destExplode(x, y, R, byP) {
  for (const d of G.dest) if (!d.dead && Math.hypot(d.x - x, d.y - y) < R + 6) { if (d.k === 'barrel') { if (d.fuse < 0 || d.fuse > 0.2) { d.fuse = rr(0.12, 0.25); d.byP = byP; } } else hitDest(d, byP, Math.atan2(d.y - y, d.x - x)); }
  for (const s of M.weak.slice()) if (Math.hypot(s.x - x, s.y - y) < R + 10) breakWeak(s);
  for (const dr of M.doors.slice()) { const e = doorEnds(dr), [dd] = segDist(x, y, e[0], e[1], e[2], e[3]); if (dd < R * 0.9) blowDoor(dr, Math.atan2((e[1] + e[3]) / 2 - y, (e[0] + e[2]) / 2 - x)); }
  const W = M.W, r = Math.ceil((R + 8) / CELL), cx = Math.floor(x / CELL), cy = Math.floor(y / CELL);
  for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const X = cx + i, Y = cy + j; if (X < 0 || Y < 0 || X >= W || Y >= M.H) continue; const c = Y * W + X; if (M.win[c] && Math.hypot((X + 0.5) * CELL - x, (Y + 0.5) * CELL - y) < R + 8) breakWindow(c, Math.atan2((Y + 0.5) * CELL - y, (X + 0.5) * CELL - x)); }
}
function destRail(x0, y0, ux, uy, L) { for (const s of M.weak.slice()) { const [d] = segDist(s.x, s.y, x0, y0, x0 + ux * L, y0 + uy * L); if (d < 7) breakWeak(s); } for (const d of G.dest) if (!d.dead) { const [dd] = segDist(d.x, d.y, x0, y0, x0 + ux * L, y0 + uy * L); if (dd < 6) hitDest(d, true, Math.atan2(uy, ux)); } }
// blood on the floor: remembers which cells are wet so walking through leaves prints
function markWet(x, y, r) { if (!M.wet) return; const W = M.W, R = Math.ceil(r / CELL), cx = Math.floor(x / CELL), cy = Math.floor(y / CELL); for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) { const X = cx + i, Y = cy + j; if (X >= 0 && Y >= 0 && X < W && Y < M.H && Math.hypot(i, j) * CELL <= r + 4) M.wet[Y * W + X] = 1; } }
function smokeBlocks(x0, y0, x1, y1) { for (const s of G.smoke) { const k = smokeK(s); if (k < 0.45) continue; const R = s.r * 0.85; if (Math.hypot(x0 - s.x, y0 - s.y) < R || Math.hypot(x1 - s.x, y1 - s.y) < R) return true; const [d] = segDist(s.x, s.y, x0, y0, x1, y1); if (d < R) return true; } return false; }
const smokeK = s => Math.min(1, s.t * 3, (s.life - s.t) / 1.8);
// ---------- per frame ----------
function destUpdate(dt) {
  for (const d of G.dest) if (d.k === 'barrel' && !d.dead && d.fuse >= 0) { d.fuse -= dt; if (Math.random() < dt * 30) part(d.x + rr(-2, 2), d.y - 3, rr(-30, 30), rr(-60, -20), 0.25, pick(['#ffd040', '#fff', '#ff7a1a']), 1); if (d.fuse <= 0) explodeBarrel(d); }
  for (const s of G.smoke) { s.t += dt; s.r = Math.min(34, s.r + dt * 60); } G.smoke = G.smoke.filter(s => s.t < s.life);
  for (const f of G.fish) { f.t += dt; if (f.t < f.life) { f.hop -= dt; if (f.hop <= 0 && f.z <= 0) { f.hop = rr(0.25, 0.7); f.vz = rr(30, 60); f.vx = rr(-30, 30); f.vy = rr(-30, 30); f.va = rr(-10, 10); } } f.vz -= 220 * dt; f.z = Math.max(0, f.z + f.vz * dt); if (f.z <= 0) { f.vx *= 0.8; f.vy *= 0.8; f.vz = Math.max(0, f.vz); f.va = 0; } const nx = f.x + f.vx * dt, ny = f.y + f.vy * dt; if (!solidAt(nx, ny)) { f.x = nx; f.y = ny; } f.a += (f.va || 0) * dt; }
  fireTick(dt); for (const f of G.dfx) f.t += dt; G.dfx = G.dfx.filter(f => f.t < f.life);
  // bloody footprints
  const P = G.player; if (P && !P.dead && M.wet) { const sp = Math.hypot(P.vx, P.vy); if (sp > 20) { const c = Math.floor(P.y / CELL) * M.W + Math.floor(P.x / CELL); if (M.wet[c]) P.bloodSteps = 10; P.stepD = (P.stepD || 0) + sp * dt;
    if (P.stepD > 6.5) { P.stepD = 0; P.stepSide = !P.stepSide; if (P.bloodSteps > 0) { const a = Math.atan2(P.vy, P.vx), s = P.stepSide ? 1.8 : -1.8, fx = P.x - Math.sin(a) * s, fy = P.y + Math.cos(a) * s, k = P.bloodSteps / 10, d = M.decX; d.save(); d.translate(fx, fy); d.rotate(a); d.fillStyle = `rgba(150,8,16,${0.35 + 0.5 * k})`; d.beginPath(); d.ellipse(0.6, 0, 1.5, 0.9, 0, 0, 6.29); d.fill(); d.beginPath(); d.ellipse(-1.6, 0, 0.8, 0.75, 0, 0, 6.29); d.fill(); d.restore(); P.bloodSteps--; } } } }
}
function drawDest(x) {
  for (const d of G.dest) {
    if (d.k === 'barrel' && !d.dead) { dRot(x, GFX.barrel, d.x, d.y, 0); if (d.fuse >= 0 && (G.time * 18 | 0) % 2) { x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.6; dRot(x, tint(GFX.barrel, '#ffd040'), d.x, d.y, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; } }
    else if (d.k === 'ext' && !d.dead) dRot(x, GFX.ext, d.x, d.y, d.a + Math.PI / 2);
    else if (d.k === 'fish') { dImg(x, d.dead ? GFX.tankBroken : GFX.tank, d.cx * CELL, d.cy * CELL); if (!d.dead) for (let i = 0; i < 2; i++) { const t = G.time * (0.6 + i * 0.25) + i * 2, fx = d.cx * CELL + 8 + Math.sin(t) * 5.5, fy = d.cy * CELL + 3 + i * 1.6; dRot(x, i ? GFX.fishB : GFX.fishA, fx, fy, Math.cos(t) > 0 ? 0 : Math.PI); } }
  }
  for (const f of G.fish) { x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(f.x - 2, f.y + 0.5, 4, 1); dRot(x, f.img, f.x, f.y - f.z, f.a); }
  for (const f of G.dfx) if (f.k === 'fire') { const k = 1 - f.t / f.life; for (let i = 0; i < 6; i++) { const a = G.time * 3 + i * 1.7, r = 3 + Math.sin(G.time * 9 + i) * 1.2; x.fillStyle = `rgba(255,${120 + i * 15},40,${0.7 * k})`; x.beginPath(); x.ellipse(f.x + Math.cos(a) * 3, f.y + Math.sin(a) * 2 - 1, r * k + 0.5, (r + 1) * k + 0.5, 0, 0, 6.29); x.fill(); } x.fillStyle = `rgba(255,240,180,${0.8 * k})`; x.fillRect(f.x - 1, f.y - 2, 2, 2); }
}
function drawSmoke(x) {
  for (const s of G.smoke) { const k = smokeK(s); for (let i = 0; i < 9; i++) { const a = s.seed + i * 0.7 + G.time * 0.12, d = s.r * (i ? 0.55 : 0), r = s.r * (i ? 0.55 : 0.7) + Math.sin(G.time * 0.8 + i) * 1.5; x.fillStyle = `rgba(${i % 2 ? 236 : 214},${i % 2 ? 240 : 222},${i % 2 ? 242 : 228},${0.62 * k})`; x.beginPath(); x.arc(s.x + Math.cos(a) * d, s.y + Math.sin(a) * d, Math.max(1, r), 0, 6.29); x.fill(); } }
}
