// ---------- gameplay ----------
const G = { state: 'title', li: 0, fi: 0, time: 0, ents: [], items: [], bullets: [], thrown: [], parts: [], corpses: [], pops: [], civs: [], score: 0, combo: 0, comboT: 0, comboMax: 0, player: null, cleared: false, implant: 'none', shake: 0, slowT: 0, flash: 0, lore: null, banner: null, rockets: [], nades: [], fx: [], ghosts: [], kx: 0, ky: 0, zp: 0, hitStop: 0 };
const IN = { mx: 0, my: 0, ax: 0, ay: 0, fire: false, fireEdge: false, pick: false, exec: false, abil: false };
const ETYPE = {
  grd: { name: 'GUARD', spd: 104, pat: 42, react: 0.45 },
  brc: { name: 'BREACHER', spd: 118, pat: 42, react: 0.5, rush: 1 },
  cln: { name: 'CLEANER', spd: 128, pat: 60, react: 0.3, strafe: 1 },
  wkr: { name: 'SCRAPPER', spd: 96, pat: 40, react: 0.55 },
  fat: { name: 'JUGGERNAUT', spd: 74, pat: 34, react: 0.6, hp: 3, armor: 1 },
  hnd: { name: 'HOUND', spd: 172, pat: 60, react: 0.14, dog: 1 },
  snp: { name: 'WATCHER', spd: 70, pat: 30, react: 0.25, sniper: 1, sight: 430 },
  twin: { name: 'DOCK TWIN', spd: 86, pat: 40, react: 0.35, hp: 14, armor: 1, boss: 1 },
  twin2: { name: 'DOCK TWIN', spd: 80, pat: 40, react: 0.45, hp: 14, armor: 1, boss: 1 }
};
function floorDef() { return LEVELS[G.li].floors[G.fi]; }
function startLevel(li) {
  G.li = li; G.score = 0; G.combo = 0; G.comboMax = 0; G.levelDeaths = 0; G.runSeed = (Math.random() * 1e9) | 0; G.stats = { kills: 0, execs: 0, saved: 0, freed: 0, methods: {}, t0: 0 }; G.levelTime = 0;
  startFloor(0, null);
}
function startFloor(fi, carry) {
  G.fi = fi; G.floorCarry = carry; G.floorScore0 = G.score; G.statsSnap = JSON.stringify(G.stats);
  const def = floorDef(); loadFloorMap(def); const b = M.b;
  G.ents = []; G.items = []; G.bullets = []; G.thrown = []; G.parts = []; G.corpses = []; G.pops = []; G.civs = []; G.fx = []; G.ghosts = []; G.rockets = []; G.nades = []; G.kx = G.ky = G.zp = G.hitStop = 0; G.cleared = false; G.witFreed = !def.req; G.flow = null; G.flowCell = -1; G.tflow = null; M.fv = 0;
  G.shake = 0; G.slowT = 0; G.flash = 0; G.lore = null; G.toast = null; G.banner = null; G.deadT = 0; G.combo = 0; G.comboT = 0;
  const P = G.player = { kind: 'p', t: 'player', x: (b.start[0] + 0.5) * CELL, y: (b.start[1] + 0.5) * CELL, a: b.start[2], vx: 0, vy: 0, r: 4.5, wpn: carry ? carry.wpn : null, ammo: carry ? carry.ammo : 0, cd: 0, swingT: 0, legT: 0, dead: false, execT: 0, dashT: 0, dashCd: 0, abilCd: 0, inv: 0, shield: G.implant === 'plating' ? 1 : 0 };
  IN.ax = P.x + Math.cos(P.a) * 40; IN.ay = P.y + Math.sin(P.a) * 40; P.kev = PERKS.kevlar && !def.hub ? 1 : 0; if (fi === 0 && !carry && !def.hub && G.state !== 'title') applyLoadout();
  for (const s of b.ens) spawnEnemy(s.t, (s.x + 0.5) * CELL, (s.y + 0.5) * CELL, s.w, s.a, s.p);
  for (const it of b.items) G.items.push({ k: it.k, x: (it.x + 0.5) * CELL, y: (it.y + 0.5) * CELL, ammo: WEAPONS[it.k] ? (WEAPONS[it.k].ammo || 0) : 2, a: rr(0, 6.28) });
  for (const w of b.wits) G.civs.push({ t: 'nadia', x: (w.x + 0.5) * CELL, y: (w.y + 0.5) * CELL, a: Math.PI, st: 'held', wit: 1 });
  mechInit(def); heistInit(def); act2bInit(def); destInit(); varyFloor(); warmFloor();
  G.cam = { x: P.x, y: P.y }; GFX.ch.player = playerSet(G.implant, false); G.hackedE = null;
  G.state = 'play'; banner(def.name, '#ffe14d'); const tok = G.floorTok = (G.floorTok || 0) + 1; if (def.tip) setTimeout(() => { if (G.state === 'play' && G.floorTok === tok) toast(def.tip); }, 1800);
  musicStart(LEVELS[G.li].music);
}
// every run of a level differs a little: weapons swap within their class, some guards walk short beats
// (seeded per level start, so restarting after a death keeps the same setup)
function varyFloor() {
  if (G.li === 0 && G.fi === 0) return;
  let s = ((G.runSeed || 1) + G.fi * 977 + 13) % 2147483646 + 1; const R = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }, pk = a => a[R() * a.length | 0], li = G.li;
  const tiers = [['pipe', 'machete', 'bat'].concat(li >= 2 ? ['saw', 'bottle'] : [], li >= 4 ? ['axe', 'sledge'] : [], li >= 5 ? ['katana'] : []), ['pistol', 'nailer', 'revolver'].concat(li >= 2 ? ['silp'] : [], li >= 3 ? ['smart'] : []), ['smg'].concat(li >= 4 ? ['ar'] : [], li >= 6 ? ['belt'] : []), ['pump', 'twin']];
  const S0 = M.b.start;
  for (const e of G.ents) {
    const T = ETYPE[e.t]; if (T.boss || T.dog || T.sniper || T.shield || T.tech) continue;
    if (e.wpn) { const tr = tiers.find(t => t.includes(e.wpn)); if (tr && R() < 0.55) { let w = pk(tr); if (['katana', 'saw', 'axe', 'sledge'].includes(w) && R() < 0.6) w = tr[0]; e.wpn = e.w0 = w; } }
    else if (R() < 0.15) e.wpn = e.w0 = 'pipe';
    if (e.wpn === 'bottle' && e.t !== 'wkr' && R() < 0.7) e.wpn = e.w0 = 'bat';
    if (e.st === 'idle' && !e.p && R() < 0.35 && Math.hypot(e.x / CELL - S0[0], e.y / CELL - S0[1]) > 12) { const t = patrolTarget(e, R); if (t) { e.p = [[e.x, e.y], t]; e.pi = 1; e.st = 'patrol'; e.ppause = true; } }
  }
  // bottles on bars and counters; now and then a flare gun lies where a pistol would
  const W = M.W, free = (cx, cy) => cx > 0 && cy > 0 && cx < W && cy < M.H && M.fl[cy * W + cx] && !cellBlocked(cy * W + cx) && !G.items.some(it => Math.hypot(it.x - (cx + 0.5) * CELL, it.y - (cy + 0.5) * CELL) < 10);
  for (const o of M.b.objs) if ((o.k === 'bar' || o.k === 'counter') && R() < 0.6) { const O = OBJ[o.k]; for (let k = 0; k < 8; k++) { const cx = o.x + (R() * O.w | 0), cy = R() < 0.5 ? o.y - 1 : o.y + O.h; if (free(cx, cy)) { G.items.push({ k: 'bottle', x: (cx + 0.5) * CELL, y: (cy + 0.5) * CELL, ammo: 0, a: R() * 6.28 }); break; } } }
  if (li >= 2) { const guns = G.items.filter(it => ['pistol', 'nailer', 'revolver'].includes(it.k)); if (guns.length && R() < 0.4) { const it = guns[R() * guns.length | 0]; it.k = 'flare'; it.ammo = WEAPONS.flare.ammo; } }
}
// a spot 4-9 steps away in the same room, in a straight line, away from the player's start
function patrolTarget(e, R) {
  const W = M.W, H = M.H, b = M.b, door = new Set(); for (const d of b.doors) { door.add(d.y * W + d.x); door.add(d.o === 'v' ? (d.y + 1) * W + d.x : d.y * W + d.x + 1); }
  const s = Math.floor(e.y / CELL) * W + Math.floor(e.x / CELL), dist = new Map([[s, 0]]), q = [s], out = [];
  while (q.length) { const c = q.shift(), d = dist.get(c); if (d >= 9) continue; const x = c % W; for (const o of [-1, 1, -W, W]) { const n = c + o; if (n < 0 || n >= W * H || dist.has(n) || (o === -1 && x === 0) || (o === 1 && x === W - 1) || cellBlocked(n) || door.has(n)) continue; dist.set(n, d + 1); q.push(n); if (d + 1 >= 4) out.push(n); } }
  const ok = out.filter(c => { const cx = (c % W + 0.5) * CELL, cy = ((c / W | 0) + 0.5) * CELL; return Math.hypot(c % W - b.start[0], (c / W | 0) - b.start[1]) > 10 && FL_IDS[M.fl[c] - 1] !== 'hazard' && los(e.x, e.y, cx, cy) && !G.ents.some(o => o !== e && Math.hypot(o.x - cx, o.y - cy) < 10); });
  if (!ok.length) return null; ok.sort((a, b) => dist.get(b) - dist.get(a)); const c = ok[Math.floor(R() * Math.min(ok.length, 6))]; return [(c % W + 0.5) * CELL, ((c / W | 0) + 0.5) * CELL];
}
function restartFloor() { G.score = G.floorScore0; G.stats = JSON.parse(G.statsSnap); startFloor(G.fi, G.floorCarry); }
function spawnEnemy(t, x, y, wpn, a, p) {
  const T = ETYPE[t], e = { kind: 'e', t: t, x: x, y: y, a: a || 0, vx: 0, vy: 0, r: T.dog ? 4 : T.boss ? 7 : t === 'fat' ? 6 : 4.5, wpn: T.dog ? null : wpn, st: p ? 'patrol' : 'idle', p: p ? p.map(q => [(q[0] + 0.5) * CELL, (q[1] + 0.5) * CELL]) : null, pi: 0, hx: x, hy: y, cd: 0, swingT: 0, react: 0, seeT: Math.random() * 0.1, sees: false, legT: Math.random() * 4, hp: T.hp || 1, downT: 0, idleT: rr(1, 4), a0: a || 0 };
  e.w0 = e.wpn; G.ents.push(e); return e;
}
function banner(t, c) { G.banner = { t: t, c: c || '#fff', life: 2.2 }; }
function toast(t) { G.toast = { t: t, life: 4 }; }
function pop(x, y, txt, c) { const lane = G.pops.filter(p => p.t < 0.6 && Math.hypot(p.x - x, p.y - y) < 24).length; G.pops.push({ x: x, y: y, txt: txt, c: c || '#fff', t: 0, lane: lane }); return G.pops[G.pops.length - 1]; }
// sound travels along walkable paths; only the closest few go and check, the rest just look toward it
function makeNoise(x, y, r) {
  if (!M.W) return; const W = M.W, f = G.nflow = flowFrom(x, y, G.nflow), lim = r >= 9000 ? 1e9 : r < 200 ? r : r * 0.7, cand = [];
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'down' || e.st === 'freed' || e.hacked > 0) continue; const c = Math.floor(e.y / CELL) * W + Math.floor(e.x / CELL); let d = f[c]; if (d < 0) for (const o of [1, -1, W, -W, W + 1, W - 1, -W + 1, -W - 1]) { const q = f[c + o]; if (q >= 0 && (d < 0 || q + 1 < d)) d = q + 1; } if (d < 0 || d * CELL > lim) continue; cand.push([d, e]); }
  cand.sort((a, b) => a[0] - b[0]); let n = 0; const N = r >= 9000 ? 999 : r >= 420 ? 4 : r >= 280 ? 3 : 2;
  for (const [, e] of cand) {
    if (e.st === 'alert') { if (!e.sees) { e.lx = x; e.ly = y; } continue; }
    if (n < N || e.st === 'search') { n++; const was = e.st; e.st = 'search'; e.lx = x; e.ly = y; e.arrived = false; e.heard = true; e.react = ETYPE[e.t].react + 0.25; const Wp = e.wpn && WEAPONS[e.wpn]; if (was !== 'search') e.hold = Wp && !Wp.melee && !ETYPE[e.t].rush && Math.random() < 0.45 ? rr(1.2, 3) : 0; }
    else { e.look = Math.atan2(y - e.y, x - e.x); e.idleT = rr(2.5, 4); e.wary = 4; }
  }
}
function mapChanged() { G.flowCell = -1; M.fv = (M.fv || 0) + 1; }
// path toward any point (cached per target cell; rebuilt when walls/doors/props change)
function goDir(e, tx, ty) {
  const c = Math.floor(ty / CELL) * M.W + Math.floor(tx / CELL); G.tflow = G.tflow || new Map(); let f = G.tflow.get(c);
  if (!f || f.v !== (M.fv || 0)) { f = { a: flowFrom(tx, ty), v: M.fv || 0 }; G.tflow.set(c, f); if (G.tflow.size > 16) G.tflow.delete(G.tflow.keys().next().value); }
  return flowStep(e, f.a, { x: tx, y: ty });
}
// lost sight of the player: go to where they were last seen, then search
function huntDir(e) {
  if (e.lx === undefined || Math.hypot(e.lx - e.x, e.ly - e.y) < 10) { e.st = 'search'; e.arrived = true; e.hold = 0; e.searchT = rr(2.5, 4); e.lookT = 0; e.look = e.a; return [0, 0]; }
  return goDir(e, e.lx, e.ly);
}
// ---------- particles & decals ----------
function part(x, y, vx, vy, life, c, s, dec) { if (G.parts.length < 600) G.parts.push({ x: x, y: y, vx: vx, vy: vy, life: life, t: 0, c: c, s: s || 1, dec: dec }); }
function splat(x, y, ang, n, big) {
  // pool of overlapping blobs, spikes thrown along the hit, then droplets
  const d = M.decX, R0 = big ? 7 : 4.5; markWet(x + Math.cos(ang) * R0, y + Math.sin(ang) * R0, R0 + 3);
  for (let i = 0; i < (big ? 10 : 6); i++) { const r = rr(R0 * 0.35, R0 * 0.8), ox = Math.cos(ang) * rr(0, R0 * 1.2) + rr(-2, 2), oy = Math.sin(ang) * rr(0, R0 * 1.2) + rr(-2, 2); d.fillStyle = pick(['#b00812', '#c80a16', '#98060e']); d.beginPath(); d.ellipse(x + ox, y + oy, r, r * rr(0.6, 1), rr(0, 3), 0, 6.29); d.fill(); }
  for (let i = 0; i < (big ? 9 : 5); i++) { const a = ang + rr(-0.9, 0.9), L = rr(R0, R0 * (big ? 3.2 : 2.4)), w = rr(0.6, 1.6), ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L; d.fillStyle = '#c00a14'; d.beginPath(); d.moveTo(x + Math.cos(a + 1.57) * w, y + Math.sin(a + 1.57) * w); d.lineTo(ex, ey); d.lineTo(x + Math.cos(a - 1.57) * w, y + Math.sin(a - 1.57) * w); d.fill(); d.beginPath(); d.arc(ex, ey, w * 0.9, 0, 6.29); d.fill(); }
  for (let i = 0; i < (big ? 18 : 8); i++) { const a = ang + rr(-1.2, 1.2), L = rr(R0, R0 * 4); d.fillStyle = pick(['#d00c18', '#8a0610', '#ff2a2a']); d.fillRect(x + Math.cos(a) * L, y + Math.sin(a) * L, rr(0.5, 1.5), rr(0.5, 1.5)); }
  for (let i = 0; i < n; i++) { const a = ang + rr(-0.7, 0.7), s = rr(60, 300); part(x, y, Math.cos(a) * s, Math.sin(a) * s, rr(0.15, 0.45), pick(['#b0101c', '#8a0a14', '#d0202a']), rr(0.5, 1.5), 1); }
}
// a gore chunk (brain, meat, bone...) that tumbles and sticks where it lands
function chunk(x, y, ang, spread, img, sp) { if (G.parts.length >= 600 || !img) return; const a = ang + rr(-spread, spread), s = (sp || 1) * rr(70, 220); G.parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rr(0.3, 0.6), t: 0, img: img, a: rr(0, 6.28), va: rr(-14, 14), dec: 1, s: 1 }); }
function updParts(dt) {
  for (const p of G.parts) {
    p.t += dt; const k = Math.max(0, 1 - dt * 5); p.vx *= k; p.vy *= k; if (p.img) p.a += p.va * dt * k; const nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
    if (wallAt(nx, ny)) { p.vx = 0; p.vy = 0; } else { p.x = nx; p.y = ny; }
    if (p.t >= p.life) { p.rem = true; if (p.dec) { if (p.img) dRot(M.decX, p.img, p.x, p.y, p.a); else { M.decX.fillStyle = p.c; M.decX.fillRect(p.x, p.y, p.s, p.s); } } }
  }
  if (G.parts.some(p => p.rem)) G.parts = G.parts.filter(p => !p.rem);
}
// ---------- kills, knockdowns, scoring ----------
function addScore(base, x, y, label, method) {
  G.combo = G.time - G.comboT < 3.4 ? G.combo + 1 : 1; G.comboT = G.time; G.comboMax = Math.max(G.comboMax, G.combo);
  const pts = base * Math.min(G.combo, 10); G.score += pts; if (method) G.stats.methods[method] = 1;
  const p = pop(x, y, String(pts), '#fff'); p.pts = pts; p.label = label || ''; p.combo = G.combo;
}
function dropWeapon(e, ang) {
  if (!e.wpn) return; const W = WEAPONS[e.wpn];
  if (W.knife && e.ammo <= 0) { e.wpn = null; return; }
  const sp = rr(60, 110), da = ang + rr(-0.5, 0.5); G.items.push({ k: e.wpn, x: e.x, y: e.y, vx: Math.cos(da) * sp, vy: Math.sin(da) * sp, va: rr(-14, 14), ammo: W.melee ? 0 : e.kind === 'p' ? e.ammo : ri(Math.ceil(W.ammo / 3), W.ammo), a: rr(0, 6.28) }); e.wpn = null;
}
function mkPool(mx) { const seeds = []; for (let i = 0; i < 6; i++) seeds.push([rr(-11, 12), rr(-3, 3), rr(0.6, 1.1)]); return { r: 1, max: mx, seeds: seeds }; }
function gibs(x, y, ang, n, spread) { for (let i = 0; i < n; i++) { const a = ang + rr(-(spread || 0.8), spread || 0.8), s = rr(90, 320); part(x, y, Math.cos(a) * s, Math.sin(a) * s, rr(0.2, 0.5), pick(['#e2586a', '#9a0c18', '#efe4d2', '#c0182a', '#6e0a12']), ri(2, 3), 1); } }
function wallSplat(x, y, ang, n) {
  const ctx = M.wallC.getContext('2d'); ctx.globalCompositeOperation = 'source-atop';
  for (let k = 0; k < n; k++) {
    const a = ang + rr(-0.55, 0.55); let px = 0, py = 0, hit = false;
    for (let d = 2; d < 64; d += 2) { px = x + Math.cos(a) * d; py = y + Math.sin(a) * d; if (wallAt(px, py)) { hit = true; break; } }
    if (!hit) continue; ctx.fillStyle = pick(['#8a0a14', '#b0101c', '#6e0a10', '#c0182a']);
    ctx.beginPath(); ctx.arc(px + Math.cos(a) * 1.5, py + Math.sin(a) * 1.5, rr(1.2, 3.2), 0, 6.29); ctx.fill();
    for (let i = 0; i < ri(3, 7); i++) ctx.fillRect(Math.round(px + Math.cos(a) * rr(0, 4) + rr(-3, 3)), Math.round(py + Math.sin(a) * rr(0, 4) + rr(-3, 3)), 1, ri(1, 3));
  }
  ctx.globalCompositeOperation = 'source-over';
}
function addBody(x, y, a, spr, sp, ang, va, pool) { const c = { x: x, y: y, a: a, spr: spr, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, va: va, pool: pool }; G.corpses.push(c); return c; }
function roboKill(e, how, ang) {
  const S = GFX.ch[e.t], d = M.decX, sp = how === 'shotgun' ? 220 : how === 'shot' ? 140 : 90;
  if (how === 'cut') { addBody(e.x, e.y, ang, S.top, 130, ang + 0.2, rr(-5, 5), null); addBody(e.x, e.y, ang, S.bot, 50, ang - 0.4, rr(-2, 2), null); }
  else addBody(e.x, e.y, ang + rr(-0.3, 0.3), how === 'shotgun' ? S.gib : S.dead[0], sp, ang, rr(-4, 4), null);
  d.fillStyle = '#121418'; for (let i = 0; i < 7; i++) { d.beginPath(); d.ellipse(e.x + Math.cos(ang) * rr(0, 12) + rr(-3, 3), e.y + Math.sin(ang) * rr(0, 12) + rr(-3, 3), rr(1.5, 4), rr(1, 3), rr(0, 3), 0, 6.29); d.fill(); }
  for (let i = 0; i < 14; i++) { const a = ang + rr(-1, 1), s = rr(80, 300); part(e.x, e.y, Math.cos(a) * s, Math.sin(a) * s, rr(0.1, 0.35), pick(['#ffd040', '#fff', '#3ff', '#ff8a1c']), 1); }
  for (let i = 0; i < 6; i++) { const a = ang + rr(-0.8, 0.8), s = rr(60, 200); part(e.x, e.y, Math.cos(a) * s, Math.sin(a) * s, rr(0.2, 0.5), pick(['#5a5e66', '#8a929e', '#2a2e36']), 2, 1); } chunk(e.x, e.y, ang, 1, GORE.plate); chunk(e.x, e.y, ang, 1, GORE.wire);
  sfx('tink', e.x, e.y); sfx('emp', e.x, e.y);
}
function goreKill(e, how, ang, method) {
  const S = GFX.ch[e.t], hx = e.x + Math.cos(ang) * 6, hy = e.y + Math.sin(ang) * 6;
  if (ETYPE[e.t].dog) { roboKill(e, how, ang); return; }
  if (method === 'flare') { addBody(e.x, e.y, ang + rr(-0.4, 0.4), S.burnt, 90, ang, rr(-3, 3), mkPool(6)); G.dfx.push({ k: 'fire', x: e.x, y: e.y, t: 0, life: 2.5 }); for (let i = 0; i < 14; i++) part(e.x, e.y, rr(-110, 110), rr(-110, 110), rr(0.2, 0.5), pick(['#ffe14d', '#ff8a1c', '#ff3b1c']), ri(1, 2)); splat(e.x, e.y, ang, 6); return; }
  if (method === 'rocket' || method === 'frag' || method === 'barrel') { // blown up: charred body, chunks everywhere
    addBody(e.x, e.y, ang + rr(-0.4, 0.4), S.burnt, 160, ang, rr(-4, 4), mkPool(8)); for (let i = 0; i < 6; i++) chunk(e.x, e.y, ang, 1.6, pick([GORE.meat, GORE.meat2, GORE.bone, GORE.gut]), 1.3);
    gibs(e.x, e.y, ang, 18, 1.4); splat(e.x, e.y, ang, 16, true); wallSplat(e.x, e.y, ang, 12); return; }
  if (how === 'burn') { addBody(e.x, e.y, e.a, S.smash, 0, 0, 0, mkPool(9)); chunk(hx, hy, rr(0, 6.28), 3.1, GORE.brain2); gibs(e.x + Math.cos(e.a) * 6, e.y + Math.sin(e.a) * 6, rr(0, 6.28), 10, 3.1); splat(e.x + Math.cos(e.a) * 6, e.y + Math.sin(e.a) * 6, rr(0, 6.28), 10, true); for (let i = 0; i < 16; i++) part(e.x, e.y, rr(-150, 150), rr(-150, 150), rr(0.2, 0.5), pick(['#ff3bd8', '#ffd0f4', '#fff']), 1); return; }
  if (how === 'cut') {
    if (Math.random() < 0.5 && !(WEAPONS[method] && WEAPONS[method].decap)) { // cut in half
      const pa = ang + Math.PI / 2 * (Math.random() < 0.5 ? 1 : -1);
      addBody(e.x + Math.cos(ang) * 2, e.y + Math.sin(ang) * 2, ang + rr(-0.5, 0.5), S.top, 135, ang + rr(-0.25, 0.25), rr(-5, 5), mkPool(8));
      addBody(e.x - Math.cos(ang) * 2, e.y - Math.sin(ang) * 2, ang + rr(-0.5, 0.5), S.bot, 45, pa * 0.3 + ang * 0.7, rr(-2, 2), mkPool(7)); chunk(e.x, e.y, ang, 1, GORE.gut);
    } else { // head comes off and rolls away
      addBody(e.x, e.y, ang + rr(-0.4, 0.4), S.decap, 80, ang + rr(-0.3, 0.3), rr(-3, 3), mkPool(8));
      addBody(hx, hy, rr(0, 6.28), S.headSpr, 230, ang + rr(-0.5, 0.5), rr(-16, 16), mkPool(3));
    }
    gibs(e.x, e.y, ang, 10, 1.2); splat(e.x, e.y, ang, 18, true); wallSplat(e.x, e.y, ang, 10);
  } else if (how === 'shotgun') {
    addBody(e.x, e.y, ang, S.gib, 235, ang + rr(-0.15, 0.15), rr(-4, 4), mkPool(10)); for (let i = 0; i < 5; i++) chunk(hx, hy, ang, 0.7, pick([GORE.meat, GORE.meat2, GORE.bone, GORE.gut]), 1.4);
    gibs(hx, hy, ang, 22, 0.7); splat(e.x, e.y, ang, 24, true); wallSplat(e.x, e.y, ang, 16);
  } else if (how === 'exec') {
    addBody(e.x, e.y, e.a, S.smash, 0, 0, 0, mkPool(11)); const fx = e.x + Math.cos(e.a) * 15, fy = e.y + Math.sin(e.a) * 15; chunk(fx, fy, rr(0, 6.28), 3.1, GORE.brain2, 0.6); chunk(fx, fy, rr(0, 6.28), 3.1, GORE.skull, 0.6);
    gibs(fx, fy, rr(0, 6.28), 14, 3.1); splat(fx, fy, rr(0, 6.28), 14, true);
  } else {
    const sh = how === 'shot' || how === 'rail', head = sh && Math.random() < 0.4, blunt = how === 'hit' && method && WEAPONS[method] && WEAPONS[method].blunt && (WEAPONS[method].crush || Math.random() < 0.35);
    if (how === 'rail') { splat(e.x, e.y, ang, 20, true); wallSplat(e.x, e.y, ang, 14); }
    const spr0 = head ? S.head : blunt ? S.smash : S.dead[ri(0, 2)];
    const cb = addBody(e.x, e.y, ang + rr(-0.3, 0.3), spr0, how === 'rail' ? 420 : sh ? 150 : how === 'throw' ? 110 : 85, ang + rr(-0.2, 0.2), rr(-3, 3), mkPool(sh ? 8 : 7)); splat(e.x, e.y, ang, sh ? 16 : 10, sh); gibs(e.x, e.y, ang, sh ? 6 : 3, 0.5); wallSplat(e.x, e.y, ang, sh ? 8 : 4);
    if (head) { chunk(hx, hy, ang, 0.6, GORE.brain, 1.3); chunk(hx, hy, ang, 0.8, GORE.brain2, 1.5); chunk(hx, hy, ang, 0.9, GORE.skull, 1.2); splat(hx, hy, ang, 10, true); }
    if (blunt) chunk(hx, hy, ang, 1, GORE.brain2, 0.7);
    if (how !== 'rail' && !head && !blunt && !ETYPE[e.t].boss) cb.rev = { t: e.t, w: e.w0 };
  }
}
function killE(e, how, ang, byP, method) {
  if (e.st === 'dead') return;
  if (byP && how === 'shot' && !G.noCrawl && !e.crawl && e.st !== 'down' && !ETYPE[e.t].boss && !ETYPE[e.t].dog && !ETYPE[e.t].shield && !(e.hacked > 0) && method !== 'emp' && Math.random() < 0.22) { crawlStart(e, ang, method); return; } e.st = 'dead'; e.sees = false; dropWeapon(e, ang + Math.PI);
  goreKill(e, how, ang, method); sfx(how === 'shot' || how === 'shotgun' ? 'gib' : 'splat', e.x, e.y); G.shake = Math.max(G.shake, how === 'shotgun' || how === 'exec' ? 0.6 : 0.35);
  if (byP) { G.hitStop = Math.max(G.hitStop, how === 'shotgun' || how === 'exec' ? 0.06 : 0.035); G.zp = Math.max(G.zp, how === 'exec' ? 0.09 : 0.05); }
  if (G.player.lock === e) G.player.lock = null;
  if (ETYPE[e.t].boss) { banner(e.t === 'hdl' ? 'THE HANDLER IS DOWN' : e.t === 'hst' ? 'THE HOST IS DOWN' : G.ents.some(o => o !== e && ETYPE[o.t].boss && o.st !== 'dead') ? 'ONE TWIN DOWN' : 'BOTH TWINS DOWN', '#ffe14d'); G.hitStop = 0.15; }
  if (byP && method !== 'puppet' && how !== 'burn') coverCheck(e);
  if (byP) { G.stats.kills++; if (how === 'exec') G.stats.execs++; if (!e.everSaw) G.stats.unseen = (G.stats.unseen || 0) + 1; if (how === 'shotgun' || how === 'cut' || how === 'exec') G.stats.brutal = (G.stats.brutal || 0) + 1; addScore(how === 'exec' ? 700 : 400, e.x, e.y, how === 'burn' ? 'BURNOUT' : method === 'puppet' ? 'PUPPET' : method === 'rail' ? 'RAILED' : method === 'rocket' || method === 'frag' || method === 'barrel' ? 'BOOM' : method === 'bleed' ? 'BLED OUT' : method === 'emp' ? 'FRIED' : method === 'knife' ? 'KNIFED' : method === 'blades' ? 'SLICED' : how === 'exec' ? 'FINISHER' : how === 'throw' ? 'THROWN' : '', method);  }
  checkClear();
}
// a wounded enemy drops and crawls away bleeding; finish them or they bleed out
function crawlStart(e, ang, method) {
  e.st = 'down'; e.crawl = true; e.downT = 99; e.bleed = rr(6, 9); e.wind = 0; e.atk = null; e.sees = false; e.trailT = 0; dropWeapon(e, ang + Math.PI);
  e.vx = Math.cos(ang) * 110; e.vy = Math.sin(ang) * 110; e.a = ang; e.spin = 0; e.hitT = 0.1; splat(e.x, e.y, ang, 12, false); sfx('splat', e.x, e.y); sfx('thud', e.x, e.y);
  addScore(150, e.x, e.y, 'WOUNDED', method); if (G.player.lock === e) G.player.lock = null; checkClear();
}
function crawlTick(e, dt) {
  const P = G.player, k = Math.max(0, 1 - dt * 6); e.vx *= k; e.vy *= k; e.bleed -= dt;
  if (P.mount !== e) { const away = Math.atan2(e.y - P.y, e.x - P.x); e.a = turn(e.a, away, dt * 1.5); const sp = 8 + 3 * Math.sin(G.time * 6 + e.x); moveEnt(e, (e.vx + Math.cos(e.a) * sp) * dt, (e.vy + Math.sin(e.a) * sp) * dt); }
  e.trailT -= dt; if (e.trailT <= 0) { e.trailT = 0.18; const d = M.decX; d.fillStyle = pick(['#a0060e', '#c00a14', '#8a0610']); d.beginPath(); d.ellipse(e.x - Math.cos(e.a) * 4, e.y - Math.sin(e.a) * 4, rr(1.4, 2.4), rr(1, 1.8), e.a, 0, 6.29); d.fill(); markWet(e.x, e.y, 3); }
  if (e.bleed <= 0 && P.mount !== e) { e.crawl = false; killE(e, 'bleed', e.a, true, 'bleed'); }
}
function knockdown(e, ang, how) {
  if (e.st === 'dead' || e.st === 'down' || e.st === 'freed') return false;
  if (G.player.lock === e) G.player.lock = null;
  if (ETYPE[e.t].dog) { killE(e, 'hit', ang, true, how); return true; }
  const T = ETYPE[e.t]; if (T.armor && (how !== 'door' || T.boss)) { e.vx += Math.cos(ang) * (T.boss ? 40 : 90); e.vy += Math.sin(ang) * 90; e.hitT = 0.1; sfx('thud', e.x, e.y); return false; }
  e.st = 'down'; e.wind = 0; e.downT = 3; e.vx = Math.cos(ang) * 150; e.vy = Math.sin(ang) * 150; e.a = ang + Math.PI; e.spin = rr(-6, 6); e.hitT = 0.08; e.atk = null; dropWeapon(e, ang); sfx('thud', e.x, e.y); G.hitStop = Math.max(G.hitStop, 0.025);
  if (how === 'door' || how === 'throw') { addScore(150, e.x, e.y, how === 'door' ? 'DOOR!' : 'THROWN', how); if (how === 'door') G.stats.doors = (G.stats.doors || 0) + 1; }
  if (how === 'punch' || how === 'door' || how === 'throw' || how === 'melee') coverCheck(e);
  checkClear(); return true;
}
function hurtPlayer(src, ang) {
  const P = G.player; if (P.dead || P.inv > 0 || P.dashT > 0 || G.god) return false;
  if (P.kev > 0) { P.kev--; P.inv = 0.6; sfx('plate'); pop(P.x, P.y, 'KEVLAR!', '#ffe14d'); G.flash = 0.25; for (let i = 0; i < 10; i++) part(P.x, P.y, rr(-160, 160), rr(-160, 160), rr(0.3, 0.6), pick(['#3a3a2a', '#5a5a3a', '#c8c0a0']), 2, 1); return false; }
  if (P.shield > 0) { P.shield--; P.inv = 0.6; sfx('plate'); pop(P.x, P.y, 'PLATING!', '#4ff'); G.flash = 0.3; GFX.ch.player = playerSet('plating', true); for (let i = 0; i < 10; i++) part(P.x, P.y, rr(-160, 160), rr(-160, 160), rr(0.3, 0.6), pick(['#8a9099', '#c8ccd2', '#5a5e66']), 2, 1); return false; }
  P.dead = true; G.deadT = 0; P.mount = null; G.levelDeaths = (G.levelDeaths || 0) + 1; dropWeapon(P, ang + Math.PI); const sg = src && (src.wpn === 'pump' || src.wpn === 'twin'), ct = src && src.wpn && WEAPONS[src.wpn].sharp; addBody(P.x, P.y, ang, sg ? GFX.ch.player.gib : GFX.ch.player.dead[ri(0, 2)], sg ? 220 : 130, ang, rr(-3, 3), mkPool(11)); G.hitStop = 0.12; splat(P.x, P.y, ang, 22, true); gibs(P.x, P.y, ang, sg ? 18 : 6, 0.7); wallSplat(P.x, P.y, ang, 12);
  sfx('pdeath'); G.shake = 1; G.slowT = 0; musicStop(); return true;
}
function hostiles() { return G.ents.filter(e => e.st !== 'dead' && e.st !== 'freed' && !e.crawl).length; }
function checkClear() {
  if (floorDef().hub) return;
  if (G.cleared || !objDone() || (floorDef().clear !== 'obj' && hostiles() > 0)) return;
  G.cleared = true; banner('FLOOR CLEAR', '#5dff9a'); setTimeout(() => { if (G.cleared && G.state === 'play') toast(floorDef().exitText || 'GET TO ' + (M.b.exit.label || 'THE EXIT')); }, 1300); sfx('clear');
}
// ---------- attacks ----------
function gunTarget(e) { let best = null, bs = 1e9; for (const t of G.ents) { if (t.st === 'dead' || t.st === 'down' || t.st === 'freed' || t.hacked > 0) continue; const dx = t.x - e.x, dy = t.y - e.y, d = Math.hypot(dx, dy); if (d > 330 || d < 1) continue; const da = Math.abs(angDiff(Math.atan2(dy, dx), e.a)), lim = 0.24 + 9 / d; if (da > lim) continue; const sc = da / lim + d / 600; if (sc < bs && los(e.x, e.y, t.x, t.y)) { bs = sc; best = t; } } return best; }
function meleeTarget(e, W) { const reach = W ? W.reach : 21; let best = null, bd = 1e9; for (const t of G.ents) { if (t.st === 'dead' || t.st === 'down' || t.st === 'freed' || t.hacked > 0) continue; const d = Math.hypot(t.x - e.x, t.y - e.y) - t.r, ang = Math.atan2(t.y - e.y, t.x - e.x); if (d < reach + 16 && Math.abs(angDiff(ang, e.a)) < 1.75 && d < bd && los(e.x, e.y, t.x, t.y)) { bd = d; best = t; } } return best ? [best, bd] : null; }
function attack(e, isP) {
  const W = e.wpn ? WEAPONS[e.wpn] : null;
  if (!W || W.melee) {
    melee(e, W, isP); e.cd = (W ? W.cd : isP ? 0.24 : 0.3) * (isP && PERKS.brawler ? 0.8 : 1); e.swingT = 0.14; e.alt = !e.alt;
    if (W) { const F = e.alt; e.atk = { k: F ? 'sF' : 'sB', t: 0, d: 0.16 }; G.fx.push({ k: 'arc', e: e, a0: e.a + (F ? 1.5 : -1.25), a1: e.a + (F ? -1.25 : 1.5), r: W.reach * 0.72, t: 0, d: 0.13 }); }
    else { e.atk = { k: e.alt ? 'pR' : 'pL', t: 0, d: 0.15 }; if (isP && G.implant === 'od') for (let i = 0; i < 5; i++) part(e.x + Math.cos(e.a) * 9, e.y + Math.sin(e.a) * 9, Math.cos(e.a + rr(-0.6, 0.6)) * rr(60, 160), Math.sin(e.a + rr(-0.6, 0.6)) * rr(60, 160), rr(0.08, 0.2), pick(['#ff3b4e', '#ffd0d0', '#ff8a1c']), 1); }
    return;
  }
  if (isP && e.ammo <= 0) { sfx('click'); e.cd = 0.25; toast('OUT OF AMMO - RIGHT CLICK TO THROW IT'); return; }
  if (W.knife) { if (isP) throwKnife(e); return; }
  if (W.rail) return;
  if (W.rocket) { if (isP && UI.assist !== false) { const t = gunTarget(e); if (t) e.a = Math.atan2(t.y - e.y, t.x - e.x); } if (isP) e.ammo--; e.cd = W.cd; e.atk = { k: 'rec', t: 0, d: 0.14 }; e.flashT = 0.06; fireRocket(e, isP); return; }
  if (isP && UI.assist !== false) { const best = gunTarget(e); if (best) { const tt = Math.hypot(best.x - e.x, best.y - e.y) / 600; e.a = Math.atan2(best.y + best.vy * tt - e.y, best.x + best.vx * tt - e.x); } }
  if (isP) e.ammo--; e.cd = W.cd * (isP || e.hacked > 0 ? 1 : 1.8); e.flashT = 0.05; e.atk = { k: 'rec', t: 0, d: W.pellets > 1 ? 0.1 : 0.07, nx: e.wpn === 'pump' ? { k: 'pump', t: 0, d: 0.34 } : null };
  const mx = e.x + Math.cos(e.a) * 9, my = e.y + Math.sin(e.a) * 9;
  for (let i = 0; i < W.pellets; i++) { const a = e.a + rr(-W.spread, W.spread) * (isP ? (PERKS.steady ? 0.65 : 1) : e.hacked > 0 ? 1 : 1.25), s = W.flare ? 330 : W.smart ? (isP ? 430 : 360) : rr(560, 640), b = { flare: W.flare ? 1 : 0, x: e.x, y: e.y, px: e.x, py: e.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, owner: isP ? 'p' : e.hacked > 0 ? 'h' : 'e', src: e, k: e.wpn, t: 0, smart: W.smart ? (isP || e.hacked > 0 ? 9 : 0.8) : 0, bounce: W.bounce ? 1 : 0 }; bulletMove(b, Math.cos(a) * 9, Math.sin(a) * 9); b.px = e.x + Math.cos(a) * 5; b.py = e.y + Math.sin(a) * 5; if (!b.rem) G.bullets.push(b); }
  for (let i = 0; i < 4; i++) part(mx, my, Math.cos(e.a + rr(-0.5, 0.5)) * rr(80, 200), Math.sin(e.a + rr(-0.5, 0.5)) * rr(80, 200), 0.06, '#ffe680', 2);
  part(e.x, e.y, Math.cos(e.a + 1.6) * 60, Math.sin(e.a + 1.6) * 60, 0.3, '#d8b040', 1, 1);
  sfx(e.wpn === 'pump' || e.wpn === 'twin' ? (e.wpn === 'twin' ? 'sshotgun' : 'shotgun') : e.wpn === 'smg' ? 'minigun' : e.wpn === 'nailer' ? 'nail' : e.wpn === 'silp' ? 'silp' : e.wpn === 'ar' ? 'arifle' : e.wpn === 'flare' ? 'flare' : 'pistol', e.x, e.y);
  if (isP) { blowCover(); G.shake = Math.max(G.shake, W.pellets > 1 ? 0.45 : 0.18); G.muzzle = 0.05; const kk = W.pellets > 1 ? 4 : 1.6; G.kx -= Math.cos(e.a) * kk; G.ky -= Math.sin(e.a) * kk; if (G.implant !== 'ghost') makeNoise(e.x, e.y, W.noise); } else makeNoise(e.x, e.y, Math.min(160, W.noise));
}
function melee(e, W, isP) {
  sfx(W ? (e.wpn === 'saw' ? 'saw' : 'swish') : 'swish', e.x, e.y);
  if (isP) {
    // turn toward the closest enemy in front, and lunge a few px if it's just out of reach
    const reach = W ? W.reach : 21, mt = meleeTarget(e, W), best = mt && mt[0], bd = mt && mt[1];
    if (best) { const ang = Math.atan2(best.y - e.y, best.x - e.x); e.a = ang; if (bd > reach - 3) { const st = Math.min(16, bd - reach + 5); moveEnt(e, Math.cos(ang) * st, Math.sin(ang) * st); e.lungeT = 0.08; } }
    e.meleeT = 0.12; e.meleeW = W; G.swingId++; meleeProps(e, W); destMelee(e, W); breakerSwing(e, W);
    if (!meleeHits(e, W, true) && G.shake < 0.06) G.shake = 0.06;
    return;
  }
  meleeHits(e, W, false);
}
// one swing's hits; the player's swing stays live for a moment so an enemy stepping in still gets hit
function meleeHits(e, W, isP) {
  const reach = W ? W.reach + (isP ? 4 : 0) : (isP ? 25 : 15), arc = isP ? 1.45 : 1.05, targets = isP ? G.ents : [G.player]; let hit = false;
  for (const t of targets) {
    if (t === e || (t.kind === 'e' && (t.st === 'dead' || (t.st === 'down' && !t.crawl) || t.st === 'freed' || (isP && t.hacked > 0))) || (t.kind === 'p' && t.dead)) continue;
    const d = Math.hypot(t.x - e.x, t.y - e.y) - t.r, ang = Math.atan2(t.y - e.y, t.x - e.x);
    if (d > reach || Math.abs(angDiff(ang, e.a)) > arc) continue;
    if (!los(e.x, e.y, t.x, t.y)) continue;
    hit = true; G.fx.push({ k: 'hit', x: t.x - Math.cos(ang) * t.r, y: t.y - Math.sin(ang) * t.r, a: ang, t: 0, d: 0.12 });
    if (isP && shieldBlocks(t, e.x, e.y)) { e.meleeT = 0; t.vx += Math.cos(ang) * 120; t.vy += Math.sin(ang) * 120; shieldSpark(t, t.x - Math.cos(ang) * t.r, t.y - Math.sin(ang) * t.r); sfx('plate', t.x, t.y); G.shake = Math.max(G.shake, 0.25); continue; }
    if (isP) {
      e.meleeT = 0;
      if (t.crawl) { killE(t, W && W.sharp ? 'cut' : 'hit', ang, true, e.wpn || 'fists'); sfx(W ? 'thud' : 'punch', t.x, t.y); continue; }
      if (!W) { if (G.implant === 'blades' && !ETYPE[t.t].armor) { killE(t, 'cut', ang, true, 'blades'); sfx('slash', t.x, t.y); } else if (G.implant === 'od' && t.t !== 'fat') killE(t, 'hit', ang, true, 'fists'); else knockdown(t, ang, 'punch'); sfx('punch', t.x, t.y); }
      else if (ETYPE[t.t].boss) { if (t.lastSwing !== G.swingId) { t.lastSwing = G.swingId; t.hp -= e.wpn === 'saw' || W.crush ? 3 : 2; t.hitT = 0.12; splat(t.x, t.y, ang, 6); sfx('thud', t.x, t.y); if (t.hp <= 0) killE(t, 'cut', ang, true, e.wpn); else knockdown(t, ang, 'melee'); } }
      else if (ETYPE[t.t].armor && e.wpn !== 'saw' && !W.crush) { knockdown(t, ang, 'melee'); sfx('thud', t.x, t.y); }
      else if (W.blunt && Math.random() < (W.kd !== undefined ? W.kd : 0.4)) { knockdown(t, ang, 'melee'); sfx('thud', t.x, t.y); pop(t.x, t.y, 'KNOCKED DOWN', '#ffe14d'); }
      else killE(t, W.sharp ? 'cut' : 'hit', ang, true, e.wpn);
      G.shake = Math.max(G.shake, 0.3);
    } else hurtPlayer(e, ang);
  }
  if (hit && isP && W && W.breaks) bottleBreak(e);
  return hit;
}
function pickOrThrow() {
  const P = G.player; if (P.dead || P.mount) return;
  if (P.wpn === 'knife') { let near = null; for (const it of G.items) if (it.k === 'knife' && Math.hypot(it.x - P.x, it.y - P.y) < 18) near = it; if (near) { P.ammo += near.ammo || 1; G.items.splice(G.items.indexOf(near), 1); sfx('pickup'); return; } if (P.cd <= 0 && P.ammo > 0) throwKnife(P); return; }
  if (P.wpn) {
    const s = 420; G.thrown.push({ k: P.wpn, ammo: P.ammo, x: P.x, y: P.y, vx: Math.cos(P.a) * s, vy: Math.sin(P.a) * s, a: P.a, t: 0 }); P.wpn = null; P.ammo = 0; sfx('throw'); return;
  }
  let best = null, bd = 18; for (const it of G.items) { if (!WEAPONS[it.k]) continue; const d = Math.hypot(it.x - P.x, it.y - P.y); if (d < bd) { bd = d; best = it; } }
  if (best) { P.wpn = best.k; P.ammo = best.ammo; if (PERKS.pockets && !WEAPONS[best.k].melee && best.ammo === WEAPONS[best.k].ammo) P.ammo = Math.ceil(best.ammo * 1.5); G.items.splice(G.items.indexOf(best), 1); sfx('weapon'); pop(P.x, P.y - 8, WEAPONS[P.wpn].name + (WEAPONS[P.wpn].melee ? '' : ' (' + P.ammo + ')'), '#ffe14d'); }
}
function nearDowned() { const P = G.player; let best = null, bd = 22; for (const e of G.ents) if (e.st === 'down') { const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < bd) { bd = d; best = e; } } return best; }
function nearUsable() {
  const P = G.player;
  for (const c of G.civs) if (c.wit && c.st === 'held' && Math.hypot(c.x - P.x, c.y - P.y) < 22) return { kind: 'wit', o: c, text: 'FREE NADIA' };
  for (const c of M.b.cages) { if (!c.open && Math.hypot(c.ux - P.x, c.uy - P.y) < (c.kind === 'cont' ? 16 : 22)) return { kind: 'cage', o: c, text: c.kind === 'kids' ? 'FREE THE KIDS' : c.kind === 'cont' ? 'OPEN THE CONTAINER' : 'OPEN THE CAGE' }; }
  for (const s of M.b.sws) { if (!s.done && Math.hypot(s.ux - P.x, s.uy - P.y) < 18) return { kind: 'sw', o: s, text: s.label }; }
  for (const t of M.b.terms) { const tx = (t.x + 0.5) * CELL, ty = (t.y + 0.5) * CELL; if (Math.hypot(tx - P.x, ty - P.y) < 15) return { kind: 'term', o: t, text: 'READ' }; }
  return hubUsable(P) || heistUsable(P);
}
function useAction() {
  const P = G.player; if (P.dead || P.mount) return;
  const d = !(P.bag && P.bag.heavy) && nearDowned(); if (d) { P.mount = d; P.mountHits = 0; P.mountIdle = 0; P.cd = 0.1; sfx('thud', d.x, d.y); return; }
  const u = nearUsable(); if (!u) { if (P.bag) throwBag(); return; }
  if (u.kind === 'heist') u.act();
  if (u.kind === 'term') { G.lore = { who: u.o.who || 'TERMINAL', text: u.o.text, life: 8 }; sfx('beep'); }
  if (u.kind === 'wit') freeWitness(u.o);
  if (u.kind === 'cage') openCage(u.o);
  if (u.kind === 'sw') useSwitch(u.o);
}
function freeWitness(c) {
  c.st = 'free'; G.witFreed = true; sfx('cage'); banner('NADIA REN IS FREE', '#5dff9a'); addScore(1000, c.x, c.y, 'WITNESS', null);
  G.lore = { who: 'NADIA REN', text: "YOU'RE THE CLEANER WHO WOULDN'T.\nI'M NADIA. THEIR CLEANER TEAM IS ALREADY HERE.\nI'LL GET TO THE TRANSFER BAY. CLEAR ME A PATH.", life: 8 };
  setTimeout(() => { if (G.state !== 'play') return; banner('CLEANER TEAM INBOUND', '#ff2a8a'); sfx('alarm');
    for (const [x, y] of [[9, 17], [10, 16], [9, 18]]) { const e = spawnEnemy('cln', (x + 0.5) * CELL, (y + 0.5) * CELL, 'pistol', 0); e.st = 'alert'; e.react = 0.8; } G.cleared = false; }, 1600);
}
// ---------- player ----------
function tickAnim(e, dt) { if (e.atk) { e.atk.t += dt; if (e.atk.t >= e.atk.d) e.atk = e.atk.nx || null; } if (e.hitT > 0) e.hitT -= dt; if (e.flashT > 0) e.flashT -= dt; }
function updPlayer(dt) {
  const P = G.player; P.inv -= dt; P.dashCd -= dt; P.abilCd -= dt; tickAnim(P, dt);
  if (P.dead) { G.deadT += dt; return; }
  if (P.mount) {
    const e = P.mount;
    if (e.st !== 'down') P.mount = null;
    else {
      e.downT = Math.max(e.downT, 0.8); e.vx = e.vy = 0; P.vx = P.vy = 0; P.a = e.a;
      P.x = lerp(P.x, e.x - Math.cos(e.a) * 1.5, 0.4); P.y = lerp(P.y, e.y - Math.sin(e.a) * 1.5, 0.4); safePos(P);
      P.cd -= dt; P.swingT -= dt;
      if ((IN.fireEdge || IN.exec) && P.cd <= 0) { smash(); IN.fireEdge = false; IN.exec = false; }
      if (P.cd <= 0) { IN.fireEdge = false; IN.exec = false; } IN.pick = false; // clicks during the short cooldown are buffered, not lost
      if (Math.hypot(IN.mx, IN.my) > 0.5) { P.mountIdle += dt; if (P.mountIdle > 0.3) P.mount = null; } else P.mountIdle = 0;
      return;
    }
  }
  let mx = IN.mx, my = IN.my; const l = Math.hypot(mx, my); if (l > 1) { mx /= l; my /= l; }
  const sp = (G.flood && floodAt(P.x, P.y) ? 88 : 124) * (G.slowT > 0 ? 1.12 : 1) * (P.wpn && WEAPONS[P.wpn].heavy ? 0.72 : 1) * (P.bag ? (P.bag.heavy ? 0.5 : 0.8) : 1) * (PERKS.feet ? 1.08 : 1), k = Math.min(1, dt * 16);
  if (P.dashT > 0) P.dashT -= dt; else if (!P.leap) { P.vx = lerp(P.vx, mx * sp, k); P.vy = lerp(P.vy, my * sp, k); }
  moveEnt(P, P.vx * dt, P.vy * dt);
  P.a = Math.atan2(IN.ay - P.y, IN.ax - P.x); const spd = Math.hypot(P.vx, P.vy); if (spd > 10) { P.legT += dt * spd / 9; P.ma = Math.atan2(P.vy, P.vx); }
  P.cd -= dt; P.swingT -= dt;
  if (P.meleeT > 0) { P.meleeT -= dt; if (P.meleeW === (P.wpn ? WEAPONS[P.wpn] : null)) meleeHits(P, P.meleeW, true); else P.meleeT = 0; }
  const W = P.wpn && WEAPONS[P.wpn];
  if (P.leap) updLeap(P, dt); P.leapCd = (P.leapCd || 0) - dt;
  if (W && W.rail) { if (IN.fire && P.ammo > 0 && P.cd <= 0) { if (!(P.charge > 0)) sfx('charge', P.x, P.y); P.charge = (P.charge || 0) + dt; if (P.charge >= W.charge) railFire(P); } else { P.charge = 0; if (IN.fireEdge && P.ammo <= 0) { sfx('click'); toast('OUT OF AMMO - RIGHT CLICK TO THROW IT'); } } }
  else if (P.bag && P.bag.heavy) { if (IN.fireEdge) sfx('noway'); }
  else if (P.cd <= 0 && (IN.fireEdge || (IN.fire && (!W || W.melee || W.auto)))) attack(P, true);
  IN.fireEdge = false;
  if (IN.nade) { IN.nade = false; throwNade(); }
  collectNades();
  if (IN.pick) { IN.pick = false; if (!(P.bag && P.bag.heavy)) pickOrThrow(); }
  if (IN.exec) { IN.exec = false; useAction(); }
  if (IN.abil) { IN.abil = false; ability(); }
  const ex = M.b.exit; if (G.cleared && ex && !(P.bag && inSecure(P.x, P.y)) && P.x > ex.x * CELL && P.x < (ex.x + ex.w) * CELL && P.y > ex.y * CELL && P.y < (ex.y + ex.h) * CELL) floorDone();
}
function smashNeed(P) { const W = P.wpn && WEAPONS[P.wpn]; if (!W) return G.implant === 'od' ? 2 : 4; if (!W.melee) return P.ammo > 0 ? 1 : 3; return W.sharp ? 1 : 2; }
function smash() {
  const P = G.player, e = P.mount, W = P.wpn && WEAPONS[P.wpn]; P.mountHits++; P.swingT = 0.12; P.cd = 0.13; P.atk = { k: 'smash', t: 0, d: 0.14 }; e.hitT = 0.07; G.hitStop = Math.max(G.hitStop, 0.03); if (W && !W.melee && P.ammo > 0) P.flashT = 0.05;
  const hx = e.x + Math.cos(e.a) * 7, hy = e.y + Math.sin(e.a) * 7;
  if (W && !W.melee && P.ammo > 0) { P.ammo--; sfx(P.wpn === 'pump' || P.wpn === 'twin' ? 'shotgun' : 'pistol', hx, hy); G.muzzle = 0.05; if (G.implant !== 'ghost') makeNoise(P.x, P.y, W.noise); }
  else sfx(W ? (W.sharp ? 'slash' : 'thud') : 'punch', hx, hy);
  splat(hx, hy, rr(0, 6.28), 6 + P.mountHits * 2, P.mountHits > 1); gibs(hx, hy, rr(0, 6.28), 2 + P.mountHits * 2, 3.1);
  G.shake = Math.max(G.shake, 0.55); G.zp = Math.max(G.zp, 0.04); e.bloody = P.mountHits; G.fx.push({ k: 'hit', x: hx, y: hy, a: e.a, t: 0, d: 0.1 });
  if (P.mountHits >= smashNeed(P)) { const m = P.wpn || 'fists'; P.mount = null; killE(e, 'exec', e.a, true, m); }
}
function floorDone() {
  const P = G.player, carry = { wpn: P.wpn, ammo: P.ammo }, lv = LEVELS[G.li];
  if (G.fi + 1 < lv.floors.length) { sfx('exit'); startFloor(G.fi + 1, carry); return; }
  levelDone();
}
// ---------- enemies ----------
function updEnemy(e, dt) {
  const T = ETYPE[e.t], P = G.player; e.cd -= dt; e.swingT -= dt; tickAnim(e, dt);
  if (e.st === 'dead' || e.st === 'freed') return;
  if (e.st === 'down' && e.crawl) { crawlTick(e, dt); return; }
  if (e.st === 'down') {
    e.downT -= dt; const k = Math.max(0, 1 - dt * 6); e.vx *= k; e.vy *= k; moveEnt(e, e.vx * dt, e.vy * dt); if (e.spin) { e.a += e.spin * dt; e.spin *= Math.max(0, 1 - dt * 5); }
    if (e.downT <= 0) { e.st = 'alert'; e.react = 0.5; }
    return;
  }
  if (e.hacked > 0) { updHacked(e, dt); return; }
  if (T.tech && !G.disguise && techAI(e, dt)) return;
  if (e.dazeT > 0) { e.dazeT -= dt; e.vx *= 0.8; e.vy *= 0.8; if (Math.random() < dt * 10) part(e.x + rr(-4, 4), e.y - 6, rr(-20, 20), rr(-40, -10), 0.25, pick(['#ff3bd8', '#fff']), 1); return; }
  const H = G.hackedE; if (H && H.hacked > 0 && H.st === 'alert' && e.st !== 'down') { const dh = Math.hypot(H.x - e.x, H.y - e.y); if (dh < 170 && (dh < Math.hypot(P.x - e.x, P.y - e.y) || !e.sees) && los(e.x, e.y, H.x, H.y)) { fightTarget(e, H, dt); return; } }
  const dx = P.x - e.x, dy = P.y - e.y, dP = Math.hypot(dx, dy), toP = Math.atan2(dy, dx);
  e.seeT -= dt; if (e.wary > 0) e.wary -= dt;
  if (e.seeT <= 0) { e.seeT = 0.09; e.sees = !P.dead && !G.disguise && (G.night && e.st !== 'alert' ? nightSees(e, dP, toP) : dP < (T.sight || 280) && (e.st === 'alert' || Math.abs(angDiff(toP, e.a)) < (e.st === 'search' || e.wary > 0 ? 1.6 : 1.15) || dP < 36)) && los(e.x, e.y, P.x, P.y); }
  if (e.sees && G.smoke.length && smokeBlocks(e.x, e.y, P.x, P.y)) e.sees = false;
  if (e.sees) e.everSaw = 1;
  if (e.sees && e.st !== 'alert') { e.st = 'alert'; e.react = T.react * rr(0.85, 1.3); }
  if (e.sees) { e.lx = P.x; e.ly = P.y; }
  let mvx = 0, mvy = 0, spd = 0;
  if (e.st === 'alert' && !P.dead && e.hold > 0 && !e.sees) { e.hold -= dt; if (e.lx !== undefined) e.a = turn(e.a, Math.atan2(e.ly - e.y, e.lx - e.x), dt * 5); }
  else if (e.st === 'alert' && !P.dead) {
    const W = e.wpn && WEAPONS[e.wpn];
    if (!e.wpn && !T.dog && !e.goItem && !T.shield) { let best = null, bd = 150; for (const it of G.items) { if (!WEAPONS[it.k] || WEAPONS[it.k].noAI) continue; const d = Math.hypot(it.x - e.x, it.y - e.y); if (d < bd && los(e.x, e.y, it.x, it.y)) { bd = d; best = it; } } e.goItem = best; }
    if (e.goItem && !G.items.includes(e.goItem)) e.goItem = null;
    if (T.shield) { [mvx, mvy, spd] = riotAI(e, dt, P, dP, toP, W); }
    else if (e.goItem && !e.wpn) {
      const it = e.goItem, d = Math.hypot(it.x - e.x, it.y - e.y); [mvx, mvy] = [(it.x - e.x) / d, (it.y - e.y) / d]; spd = T.spd; e.a = turn(e.a, Math.atan2(mvy, mvx), dt * 10);
      if (d < 7) { e.wpn = it.k; G.items.splice(G.items.indexOf(it), 1); e.goItem = null; e.react = 0.3; }
    } else if (W && !W.melee) {
      if (T.sniper) {
        if (e.sees) { if (!(e.aimT > 0) && e.cd <= 0) { e.aimT = 1.0; sfx('charge', e.x, e.y); } if (e.aimT > 0) { e.a = turn(e.a, toP, dt * 1.5); e.aimT -= dt; if (e.aimT <= 0) { attack(e, false); e.cd = 1.3; } } else e.a = turn(e.a, toP, dt * 3); }
        else { e.aimT = 0; if (e.lx !== undefined) e.a = turn(e.a, Math.atan2(e.ly - e.y, e.lx - e.x), dt * 2); }
      } else if (e.sees) {
        e.a = turn(e.a, toP, dt * 9); e.react -= dt;
        if (e.react <= 0 && e.cd <= 0 && (!T.rush || dP < 125) && Math.abs(angDiff(toP, e.a)) < 0.2) attack(e, false);
        if (T.rush && dP > 46) { [mvx, mvy] = [dx / dP, dy / dP]; spd = T.spd; }
        else if (T.strafe) { if ((e.sfT = (e.sfT || 0) - dt) <= 0) { e.sfT = rr(0.6, 1.3); e.sfD = -(e.sfD || 1); } const sa = toP + Math.PI / 2 * e.sfD + (dP > 120 ? -0.6 * e.sfD : dP < 60 ? 0.6 * e.sfD : 0); [mvx, mvy] = [Math.cos(sa), Math.sin(sa)]; spd = T.spd * 0.55; }
        else if (dP > 110) { [mvx, mvy] = [dx / dP, dy / dP]; spd = T.spd * 0.35; }
      }
      else { [mvx, mvy] = huntDir(e); spd = e.st === 'alert' ? T.spd : 0; e.a = turn(e.a, Math.atan2(mvy, mvx), dt * 8); e.react = Math.max(e.react, 0.18); }
    } else {
      const reach = (W ? W.reach : T.dog ? 13 : 13) + P.r;
      if (e.sees && dP < 40) { [mvx, mvy] = [dx / dP, dy / dP]; } else [mvx, mvy] = e.sees ? chaseDir(e) : huntDir(e);
      spd = T.spd; e.a = turn(e.a, e.sees ? toP : Math.atan2(mvy, mvx), dt * 11);
      if (e.wind > 0) { e.wind -= dt; spd = T.spd * 0.3; e.a = turn(e.a, toP, dt * 5); if (e.wind <= 0) { attack(e, false); e.cd = (W ? W.cd : 0.45) * 1.6; } }
      else if (e.sees) { e.react -= dt; if (dP < reach + 5 && e.react <= 0 && e.cd <= 0 && Math.abs(angDiff(toP, e.a)) < 0.7) { e.wind = T.dog ? 0.17 : W ? 0.32 : 0.26; e.atk = { k: 'wind', t: 0, d: e.wind }; } }
      if (dP < 8) spd = 0;
    }
  } else if (e.st === 'search') { // went to check a sound: walk there, look around, then go back
    const sa = Math.atan2(e.ly - e.y, e.lx - e.x);
    if (T.sniper || T.shield && false) { e.a = turn(e.a, sa, dt * 3); e.searchT = (e.searchT || 3) - dt; if (e.searchT <= 0) e.st = e.p ? 'patrol' : 'idle'; }
    else if (e.hold > 0) { e.hold -= dt; e.a = turn(e.a, sa, dt * 5); }
    else if (!e.arrived) { if (Math.hypot(e.lx - e.x, e.ly - e.y) < 10) { e.arrived = true; e.searchT = rr(2.5, 4); e.lookT = 0; e.look = e.a; } else { [mvx, mvy] = goDir(e, e.lx, e.ly); spd = T.spd * 0.75; e.a = turn(e.a, Math.atan2(mvy, mvx), dt * 7); } }
    else { e.searchT -= dt; e.lookT -= dt; if (e.lookT <= 0) { e.lookT = rr(0.5, 1.1); e.look = e.a + rr(-2.2, 2.2); } e.a = turn(e.a, e.look, dt * 4); if (e.searchT <= 0) e.st = 'return'; }
  } else if (e.st === 'return') {
    if (Math.hypot(e.hx - e.x, e.hy - e.y) < 5) { e.st = e.p ? 'patrol' : 'idle'; e.look = e.a0; e.idleT = rr(1, 3); }
    else { [mvx, mvy] = goDir(e, e.hx, e.hy); spd = T.pat || T.spd * 0.5; e.a = turn(e.a, Math.atan2(mvy, mvx), dt * 6); }
  } else if (e.st === 'patrol' && e.p) {
    if (e.pauseT > 0) { e.pauseT -= dt; if (e.look !== undefined) e.a = turn(e.a, e.look, dt * 2.5); }
    else { const q = e.p[e.pi], d = Math.hypot(q[0] - e.x, q[1] - e.y); if (d < 4) { e.pi = (e.pi + 1) % e.p.length; if (e.ppause) { e.pauseT = rr(1, 2.6); e.look = e.a + rr(-1.3, 1.3); } }
    else { [mvx, mvy] = [(q[0] - e.x) / d, (q[1] - e.y) / d]; spd = T.pat || T.spd * 0.45; e.a = turn(e.a, Math.atan2(mvy, mvx), dt * 5); } }
  } else { e.idleT -= dt; if (e.idleT <= 0) { e.idleT = rr(2, 5); e.look = e.a0 + rr(-0.8, 0.8); } if (e.look !== undefined) e.a = turn(e.a, e.look, dt * 2); }
  if (e.side > 0) { e.side -= dt; const sa = Math.atan2(mvy, mvx) + e.sideD; [mvx, mvy] = [Math.cos(sa), Math.sin(sa)]; spd = Math.max(spd, T.spd * 0.8); }
  const k = Math.min(1, dt * 12); e.vx = lerp(e.vx, mvx * spd, k); e.vy = lerp(e.vy, mvy * spd, k);
  const ox = e.x, oy = e.y;
  if (G.flood && floodAt(e.x, e.y)) { e.vx *= 0.75; e.vy *= 0.75; }
  moveEnt(e, e.vx * dt, e.vy * dt); if (spd > 1) e.legT += dt * spd / 9;
  if (spd > 20 && !(e.side > 0)) { const got = Math.hypot(e.x - ox, e.y - oy) / Math.max(1e-4, dt); e.stuck = got < spd * 0.25 ? (e.stuck || 0) + dt : 0; if (e.stuck > 0.45) { e.stuck = 0; e.side = rr(0.3, 0.5); e.sideD = (Math.random() < 0.5 ? 1 : -1) * rr(1.1, 1.9); } }
}
function turn(a, b, s) { const d = angDiff(b, a); return a + clamp(d, -s, s); }
function chaseDir(e) {
  const P = G.player, c = Math.floor(P.y / CELL) * M.W + Math.floor(P.x / CELL);
  if (c !== G.flowCell || !G.flow) { G.flow = flowFrom(P.x, P.y, G.flow); G.flowCell = c; }
  return flowStep(e, G.flow, P);
}
function flowStep(e, F, P) {
  const W = M.W, cx = Math.floor(e.x / CELL), cy = Math.floor(e.y / CELL); let best = F[cy * W + cx], bx = -1, by = -1; if (best < 0) best = 1e9;
  for (const [i, j] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) { const X = cx + i, Y = cy + j, f = F[Y * W + X]; if (f < 0 || f >= best) continue; if (i && j && (F[cy * W + X] < 0 || F[Y * W + cx] < 0)) continue; best = f; bx = X; by = Y; }
  if (bx < 0) { const d = Math.hypot(P.x - e.x, P.y - e.y) || 1; return [(P.x - e.x) / d, (P.y - e.y) / d]; }
  const tx = (bx + 0.5) * CELL - e.x, ty = (by + 0.5) * CELL - e.y, d = Math.hypot(tx, ty) || 1; return [tx / d, ty / d];
}
// ---------- doors ----------
function updDoors(dt) {
  const chars = [G.player].concat(G.ents, G.civs.filter(c => c.st === 'run' && c.t0 > 0)).filter(c => c.kind === 'p' ? !c.dead : (c.st !== 'dead' && c.st !== 'freed'));
  for (const d of M.doors) {
    for (const c of chars) {
      const e = doorEnds(d), [dd, qx, qy] = segDist(c.x, c.y, e[0], e[1], e[2], e[3]); if (dd > c.r + 1.2) continue;
      const dx = e[2] - e[0], dy = e[3] - e[1], cr = dx * (c.y - e[1]) - dy * (c.x - e[0]), side = cr > 0 ? 1 : -1, rc = Math.max(3, Math.hypot(qx - d.hx, qy - d.hy));
      const intoC = (d.w * side) > 0, tip = Math.abs(d.w) * rc;
      if (c === G.player) d.pT = G.time;
      if (c.kind === 'e' && c.st !== 'down' && intoC && tip > 70 && G.time - (d.pT === undefined ? -9 : d.pT) < 0.8) { knockdown(c, Math.atan2(c.y - qy, c.x - qx), 'door'); d.w *= -0.3; continue; }
      const cv = Math.hypot(c.vx, c.vy); if (c.st !== 'down') d.w = -side * Math.max(Math.abs(d.w), (cv + 30) / rc * 1.3);
      const nx = (c.x - qx) / (dd || 1), ny = (c.y - qy) / (dd || 1); c.x += nx * (c.r + 1.2 - dd); c.y += ny * (c.r + 1.2 - dd);
      if (Math.abs(d.w) > 9 && !d.bang) { d.bang = 0.3; sfx('door', d.hx, d.hy); }
    }
    d.ang += d.w * dt; if (d.ang > 2.85) { d.ang = 2.85; d.w = 0; } if (d.ang < -2.85) { d.ang = -2.85; d.w = 0; }
    d.w *= Math.pow(0.04, dt); d.bang = Math.max(0, (d.bang || 0) - dt);
  }
}
// ---------- bullets & thrown ----------
// move a bullet in 3px steps: walls and door panels stop it, and a hit only counts with nothing solid in between
function bulletMove(b, mx, my) {
  const n = Math.max(1, Math.ceil(Math.hypot(mx, my) / 3)); let ang = Math.atan2(b.vy, b.vx), sx = mx / n, sy = my / n; const sl0 = Math.hypot(sx, sy);
  for (let s = 0; s < n; s++) {
    const ox = b.x, oy = b.y; b.x += sx; b.y += sy;
    if (blockAt(b.x, b.y) && b.bounce > 0 && !propAt(b.x, b.y)) { // ricochet: bounce once off the wall
      const bx = blockAt(b.x, oy), by = blockAt(ox, b.y); if (bx || !by) { b.vx = -b.vx; sx = -sx; } if (by || !bx) { b.vy = -b.vy; sy = -sy; }
      b.x = ox; b.y = oy; b.bounce--; b.bounced = 1; ang = Math.atan2(b.vy, b.vx); sfx('tink', ox, oy); for (let i = 0; i < 5; i++) part(ox, oy, rr(-90, 90), rr(-90, 90), 0.15, pick(['#ffe14d', '#fff']), 1); continue;
    }
    if (b.owner === 'e') { const P = G.player, Wp = P.wpn && WEAPONS[P.wpn]; if (!P.dead && Wp && Wp.deflect && ((P.atk && (P.atk.k === 'sF' || P.atk.k === 'sB')) || P.meleeT > 0) && Math.hypot(P.x - b.x, P.y - b.y) < P.r + 13 && Math.abs(angDiff(Math.atan2(b.y - P.y, b.x - P.x), P.a)) < 1.7) {
      const s0 = Math.hypot(b.vx, b.vy) || 1, tg = b.src && b.src.st !== 'dead' && b.src.kind === 'e' ? Math.atan2(b.src.y - b.y, b.src.x - b.x) : Math.atan2(-b.vy, -b.vx); b.vx = Math.cos(tg) * s0; b.vy = Math.sin(tg) * s0; sx = Math.cos(tg) * sl0; sy = Math.sin(tg) * sl0; b.owner = 'p'; b.src = P; b.smart = 0; ang = tg;
      sfx('tink', b.x, b.y); sfx('slash', b.x, b.y); G.fx.push({ k: 'hit', x: b.x, y: b.y, a: tg, t: 0, d: 0.12 }); pop(P.x, P.y - 10, 'DEFLECT', '#3ff'); continue; } }
    if (blockAt(b.x, b.y)) { const pr = propAt(b.x, b.y); if (pr) damageProp(pr, 1, ox, oy); destBullet(b, ox, oy); b.rem = true; if (b.flare) igniteAt(ox - Math.cos(ang) * 3, oy - Math.sin(ang) * 3, b.owner !== 'e'); for (let i = 0; i < 3; i++) part(ox, oy, rr(-80, 80), rr(-80, 80), 0.12, '#ffd080', 1); return; }
    for (const d of M.doors) { const e = doorEnds(d); if (segX(ox, oy, b.x, b.y, e[0], e[1], e[2], e[3]) >= 0) { b.rem = true; if (b.k === 'pump' || b.k === 'twin') { blowDoor(d, ang); return; } for (let i = 0; i < 4; i++) part(ox, oy, -b.vx * rr(0.05, 0.2) + rr(-50, 50), -b.vy * rr(0.05, 0.2) + rr(-50, 50), 0.18, pick(['#c08a5a', '#8a5a3a', '#fff']), 1); return; } }
    if (b.owner === 'e') { const P = G.player; if (!P.dead && Math.hypot(P.x - b.x, P.y - b.y) < P.r + 1 && los(ox, oy, P.x, P.y)) { hurtPlayer(b.src, ang); b.rem = true; return; } }
    for (const e of G.ents) {
      if (e === b.src || e.st === 'dead' || (e.st === 'down' && !e.crawl) || e.st === 'freed' || (b.hit && b.hit.includes(e)) || Math.hypot(e.x - b.x, e.y - b.y) > e.r + (b.owner === 'p' ? 5 : 1) || !los(ox, oy, e.x, e.y)) continue;
      if (shieldBlocks(e, ox - (b.vx || 0) * 0.01, oy - (b.vy || 0) * 0.01)) { b.rem = true; shieldSpark(e, b.x, b.y); return; }
      if (b.k === 'rifle' && b.owner === 'p' && (b.hit = b.hit || []).length < 3) b.hit.push(e); else b.rem = true; if (e.hacked > 0 && e.hackHp > 0) { e.hackHp--; e.hitT = 0.12; splat(e.x, e.y, ang, 4); return; } if (--e.hp <= 0) killE(e, b.k === 'pump' || b.k === 'twin' ? 'shotgun' : 'shot', ang, b.owner !== 'e', b.owner === 'h' ? 'puppet' : b.k); else { splat(e.x, e.y, ang, 4); if (ETYPE[e.t].boss) pop(e.x, e.y - 8, String(e.hp), '#ffe14d'); e.vx += Math.cos(ang) * 60; e.vy += Math.sin(ang) * 60; e.hitT = 0.1; if (e.st !== 'alert') { e.st = 'alert'; e.react = 0.3; } }
      if (b.rem) return;
    }
  }
}
function updBullets(dt) {
  const sl = 1;
  for (const b of G.bullets) {
    b.t += dt; b.px = b.x; b.py = b.y; if (b.flare && Math.random() < 0.8) part(b.x, b.y, rr(-25, 25), rr(-25, 25), rr(0.15, 0.35), pick(['#ffe14d', '#ff8a1c', '#ff3b1c', '#fff']), 1);
    if (b.smart) { // smart rounds curve toward the closest target ahead of them
      const sp = Math.hypot(b.vx, b.vy), a = Math.atan2(b.vy, b.vx); let tg = null, bs = 1e9;
      const cands = b.owner === 'e' ? (G.player.dead ? [] : [G.player]) : G.ents.filter(t => t !== b.src && t.st !== 'dead' && t.st !== 'down' && t.st !== 'freed' && !(t.hacked > 0));
      for (const t of cands) { const d = Math.hypot(t.x - b.x, t.y - b.y), da = Math.abs(angDiff(Math.atan2(t.y - b.y, t.x - b.x), a)); if (d > 170 || da > 1.3) continue; const sc = d + da * 80; if (sc < bs && los(b.x, b.y, t.x, t.y)) { bs = sc; tg = t; } }
      if (tg) { const na = turn(a, Math.atan2(tg.y - b.y, tg.x - b.x), b.smart * dt); b.vx = Math.cos(na) * sp; b.vy = Math.sin(na) * sp; }
      (b.trail = b.trail || []).push([b.x, b.y]); if (b.trail.length > 8) b.trail.shift();
    }
    bulletMove(b, b.vx * dt * sl, b.vy * dt * sl); if (b.t > 1) b.rem = true; if (G.cams && (G.cams.length || G.chands.length)) bulletHang(b);
  }
  G.bullets = G.bullets.filter(b => !b.rem);
  for (const t of G.thrown) {
    t.t += dt; t.a += dt * 18; const k = t.t > 0.45 ? Math.max(0, 1 - dt * 8) : 1; t.vx *= k; t.vy *= k;
    const dx = t.vx * dt, dy = t.vy * dt, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 3)), fast = Math.hypot(t.vx, t.vy) >= 120; let stop = false, hitE = false;
    for (let i = 0; i < n && !stop; i++) {
      const nx = t.x + dx / n, ny = t.y + dy / n;
      if (blockAt(nx, ny)) { const pr = propAt(nx, ny); if (pr) damageProp(pr, 2, t.x, t.y); stop = true; break; }
      for (const d of M.doors) { const e = doorEnds(d); if (segX(t.x, t.y, nx, ny, e[0], e[1], e[2], e[3]) >= 0) { stop = true; break; } }
      if (stop) break; t.x = nx; t.y = ny;
      if (fast) for (const e of G.ents) { if (e.st === 'dead' || e.st === 'down' || e.st === 'freed' || Math.hypot(e.x - t.x, e.y - t.y) > e.r + 6 || !los(t.x, t.y, e.x, e.y)) continue; const ang = Math.atan2(t.vy, t.vx); if (shieldBlocks(e, t.x - t.vx * 0.03, t.y - t.vy * 0.03)) { shieldSpark(e, t.x, t.y); stop = true; break; } if (t.knife) killE(e, 'hit', ang, true, 'knife'); else if (WEAPONS[t.k].sharp) killE(e, 'cut', ang, true, 'throw'); else knockdown(e, ang, 'throw'); stop = hitE = true; break; }
    }
    if (t.k === 'bottle' && stop) { t.rem = true; sfx('bottle', t.x, t.y); for (let i = 0; i < 12; i++) part(t.x, t.y, rr(-120, 120), rr(-120, 120), rr(0.2, 0.45), pick(['#3a8a44', '#5aaa62', '#9ee8ff', '#fff']), 1, 1); continue; }
    if (stop || Math.hypot(t.vx, t.vy) < 15) { t.rem = true; const bv = stop ? -0.25 : 0.6; G.items.push({ k: t.k, x: t.x, y: t.y, ammo: t.ammo, a: t.a, vx: t.vx * bv, vy: t.vy * bv, va: rr(-12, 12) }); if (stop) sfx('tink', t.x, t.y); }
  }
  G.thrown = G.thrown.filter(t => !t.rem);
}
function separate() {
  const L = G.ents.filter(e => e.st !== 'dead' && e.st !== 'down' && e.st !== 'freed'); L.push(G.player);
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i], b = L[j]; if (a.dead || b.dead) continue; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = a.r + b.r; if (d < m && d > 0.01) { const p = (m - d) / 2, ux = dx / d, uy = dy / d; a.x -= ux * p; a.y -= uy * p; b.x += ux * p; b.y += uy * p; } }
  for (const c of L) if (!c.dead) { collide(c); safePos(c); }
}
function updateGame(dt) {
  if (G.hitStop > 0) { G.hitStop -= dt; G.time += dt * 0.15; return; }
  G.time += dt; G.levelTime += dt; sandTick(dt);
  const edt = G.slowT > 0 ? dt * 0.2 : dt;
  updPlayer(dt);
  for (const e of G.ents) updEnemy(e, edt);
  separate(); updDoors(edt); updBullets(edt); updRockets(edt); updNades(edt); updParts(edt); destUpdate(edt);
  for (const it of G.items) if (it.vx || it.vy) slideObj(it, edt, 5);
  for (const c of G.corpses) if (c.vx || c.vy) { const sp = Math.hypot(c.vx, c.vy); slideObj(c, edt, 6.5); if (sp > 20 && !c.debris) { const d = M.decX; d.fillStyle = '#8a0610'; d.beginPath(); d.ellipse(c.x, c.y, 3.4, 2.2, Math.atan2(c.vy, c.vx), 0, 6.29); d.fill(); } }
  for (const f of G.fx) f.t += f.real ? dt : edt; G.fx = G.fx.filter(f => f.t < f.d); for (const g of G.ghosts) g.t += dt; G.ghosts = G.ghosts.filter(g => g.t < (g.life || 0.16));
  const kd = Math.exp(-dt * 14); G.kx *= kd; G.ky *= kd; G.zp *= Math.exp(-dt * 9);
  for (const c of G.corpses) if (!c.vx && !c.vy && c.pool && c.pool.r < c.pool.max) { const pl = c.pool; pl.r = Math.min(pl.max, pl.r + dt * 5); if (Math.random() < dt * 4) markWet(c.x, c.y, pl.r + 6); const d = M.decX; const ca = Math.cos(c.a), sa = Math.sin(c.a); for (const [ox, oy, s] of pl.seeds) { const px = c.x + ca * ox - sa * oy, py = c.y + sa * ox + ca * oy; d.fillStyle = '#9a0610'; d.beginPath(); d.ellipse(px, py, pl.r * s, pl.r * s * 0.8, c.a, 0, 6.29); d.fill(); d.fillStyle = '#b80a14'; d.beginPath(); d.ellipse(px, py, pl.r * s * 0.72, pl.r * s * 0.56, c.a, 0, 6.29); d.fill(); } }
  if (G.player.lock && (G.player.lock.st === 'dead' || G.player.lock.st === 'down')) G.player.lock = null;
  for (const p of G.pops) p.t += dt; G.pops = G.pops.filter(p => p.t < 1.3);
  for (const c of G.civs) if (c.st === 'free') { c.t = (c.t || 0) + dt; if (c.t > 1.5) c.gone = true; } else if (c.st === 'run') civRun(c, dt);
  mechUpdate(edt); heistUpdate(edt); act2bUpdate(edt); if (G.birds.length) updBirds(dt); if (G.storm) updStorm(dt); if (G.disguise) updDisguise(dt); updGuests(dt);
  G.shake = Math.max(0, G.shake - dt * 2.5); G.flash = Math.max(0, G.flash - dt * 2); G.muzzle = Math.max(0, (G.muzzle || 0) - dt);
  if (G.banner) { G.banner.life -= dt; if (G.banner.life <= 0) G.banner = null; } if (G.toast) { G.toast.life -= dt; if (G.toast.life <= 0) G.toast = null; } if (G.lore) { G.lore.life -= dt; if (G.lore.life <= 0) G.lore = null; }
}
