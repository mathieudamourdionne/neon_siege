// ---------- heist jobs (loud only): loot bags, the secure zone, gates, drills, charges, keycards, jewel cases, weapon crates, police assaults, countdowns ----------
Object.assign(SFX, {
  drill: (t, v) => { tone(t, 0.45, 'sawtooth', 180, 170, 0.07 * v); tone(t, 0.45, 'square', 363, 350, 0.03 * v); nz(t, 0.45, 'bandpass', 2600, 2400, 3, 0.12 * v); },
  jam: (t, v) => { tone(t, 0.25, 'square', 180, 60, 0.2 * v); nz(t, 0.3, 'lowpass', 900, 200, 1, 0.5 * v); tone(t + 0.3, 0.12, 'square', 900, 0, 0.1 * v); tone(t + 0.5, 0.12, 'square', 900, 0, 0.1 * v); },
  cash: (t, v) => { [880, 1175, 1568].forEach((f, i) => tone(t + i * 0.05, 0.12, 'square', f, 0, 0.07 * v)); nz(t, 0.1, 'highpass', 4000, 3000, 1, 0.2 * v); },
  bag: (t, v) => { nz(t, 0.18, 'bandpass', 500, 300, 1, 0.5 * v); tone(t, 0.1, 'sine', 140, 80, 0.2 * v); },
});
// builder additions used by job floors
Object.assign(Builder.prototype, {
  loot(x, y, k, n, gate) { (this.loots = this.loots || []).push({ x: x, y: y, k: k, n: n || 1, gate: gate }); return this; },
  secure(x, y, w, h, label) { this.secureZ = { x: x, y: y, w: w, h: h, label: label }; return this; },
  gate(id, x, y, w, h, kind) { (this.gates = this.gates || []).push({ id: id, x: x, y: y, w: w, h: h, kind: kind }); return this; },
  drill(x, y, gate, secs) { (this.drills = this.drills || []).push({ x: x, y: y, gate: gate, secs: secs || 40 }); return this; },
  c4(x, y, gate) { (this.c4s = this.c4s || []).push({ x: x, y: y, gate: gate }); return this; },
  jcase(x, y) { this.props.push({ k: 'jcase', x: x, y: y, w: 2, h: 1, hp: 1 }); return this; },
  wcrate(x, y) { this.props.push({ k: 'wcrate', x: x, y: y, w: 2, h: 2, hp: 3 }); return this; },
});
// the armored truck (rear doors on the left, cab on the right)
OBJ.atruck = { w: 10, h: 4, solid: 1, tall: 1, d: P => { P.r(0, 0, 80, 32, '#2e3a48'); P.r(60, 4, 18, 24, '#26303c'); } };
OBJ_HD.atruck = (P, W, H) => {
  for (const x of [16, 40, W - 34]) { P.r(x, 0, 14, 5, INK); P.r(x, H - 5, 14, 5, INK); P.r(x + 2, 1, 10, 2, '#3a3a3a'); P.r(x + 2, H - 3, 10, 2, '#3a3a3a'); }
  ob(P, 0, 4, W - 38, H - 8, '#4a5668'); for (let x = 10; x < W - 42; x += 12) { P.r(x, 6, 1, H - 12, '#3a4454'); P.r(x + 1, 6, 1, H - 12, '#5e6a7c'); }
  ob(P, 2, 8, 9, H / 2 - 9, '#5a6678'); ob(P, 2, H / 2 + 1, 9, H / 2 - 9, '#5a6678'); P.r(9, H / 2 - 4, 2, 8, '#c8ccd2'); for (const y of [10, H / 2 - 4, H / 2 + 3, H - 12]) P.r(1, y, 2, 3, '#8a8f99');
  P.r(14, H / 2 - 2, W - 56, 4, '#c8a040'); P.r(14, H / 2 - 2, W - 56, 1, '#f0d070'); ob(P, W - 92, 10, 22, 14, '#3a4454'); P.d(W - 81, 17, 4, 4, '#2a3240');
  ob(P, W - 40, 7, 32, H - 14, '#3a4658'); ob(P, W - 16, 10, 10, H - 20, '#2a5a6a', '#8ad8e8'); P.ln(W - 14, H - 12, W - 8, 12, '#b8f0ff', 1);
  P.r(W - 34, 9, 14, 3, INK); P.r(W - 32, 10, 4, 1, '#ff3b4e'); P.r(W - 25, 10, 4, 1, '#3a8aff');
  P.r(W - 6, 9, 4, 5, '#ffe680'); P.r(W - 6, H - 14, 4, 5, '#ffe680'); P.r(W - 4, 15, 3, H - 30, '#2a2a2a');
};
OBJ.jersey = { w: 4, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 32, 8, '#8e8c86'); } };
OBJ_HD.jersey = (P, W, H) => { ob(P, 0, 1, W, H - 2, '#9a988f'); P.r(3, 4, W - 6, 2, '#b8b6ae'); P.r(3, H - 5, W - 6, 1, '#76746c'); for (let x = 2; x < W - 2; x += 8) { P.r(x, H / 2 - 1, 4, 2, '#e8c020'); P.r(x + 4, H / 2 - 1, 4, 2, '#1a1a1a'); } P.r(W / 2, 2, 1, H - 4, '#7a7870'); };
const LOOT = { cash: { name: 'CASH', v: 6000 }, gold: { name: 'GOLD', v: 11000 }, case: { name: 'CASH CASE', v: 8000 }, crate: { name: 'WEAPON CRATE', v: 7000 }, safe: { name: 'THE SAFE', v: 60000, heavy: 1 }, bonds: { name: 'BEARER BONDS', v: 9000 } };
function heistGfx() {
  if (GFX.bag) return; const o = (c) => hdc(hardOutline(c, INK));
  const duffel = (tag) => o(spr(22, 14, P => { P.r(1, 2, 20, 10, '#2a2a34'); P.r(1, 2, 20, 2, '#4a4a58'); P.r(1, 10, 20, 2, '#1a1a22'); P.d(1.5, 7, 1.5, 4, '#22222a'); P.d(20.5, 7, 1.5, 4, '#22222a'); P.r(4, 6, 14, 1, '#8a8a96'); P.r(8, 0, 6, 2, '#ff2a8a'); P.r(8, 0, 1, 3, '#ff2a8a'); P.r(13, 0, 1, 3, '#ff2a8a'); if (tag) { P.r(16, 3, 3, 3, tag); P.p(16, 3, '#fff'); } }));
  GFX.bag = { cash: duffel('#5dff9a'), gold: duffel('#ffd040'), bonds: duffel('#e8e0c0'), case: o(spr(18, 13, P => { P.r(1, 2, 16, 10, '#9aa0a8'); P.r(1, 2, 16, 2, '#d8dce2'); P.r(1, 10, 16, 2, '#5a6068'); P.r(8, 0, 3, 2, '#2a2a2a'); P.r(3, 6, 12, 1, '#7a8088'); P.p(4, 4, '#fff'); })),
    crate: o(spr(18, 14, P => { P.r(1, 1, 16, 12, '#4a5a2a'); P.r(1, 1, 16, 2, '#6a7a3a'); for (let x = 5; x < 16; x += 5) P.r(x, 1, 1, 12, '#3a4820'); P.r(6, 6, 6, 2, '#d8d0a0'); P.r(0, 5, 1, 4, '#2a2a2a'); P.r(17, 5, 1, 4, '#2a2a2a'); })),
    safe: o(spr(22, 22, P => { P.r(1, 1, 20, 20, '#4a4e58'); P.r(1, 1, 20, 3, '#7a7e88'); P.r(1, 18, 20, 3, '#2a2e36'); P.r(3, 5, 16, 12, '#5a5e68'); P.d(11, 11, 4, 4, '#2a2e36'); P.d(11, 11, 3, 3, '#c8ccd2'); P.p(11, 9, '#2a2a2a'); P.r(16, 9, 2, 5, '#c8a040'); P.p(4, 6, '#fff'); })) };
  GFX.pile = { cash: o(spr(28, 22, P => { for (let i = 0; i < 6; i++) { const x = 2 + (i % 3) * 8, y = 2 + (i / 3 | 0) * 9; P.r(x, y, 8, 8, '#2e7a3a'); P.r(x, y, 8, 2, '#6ac87a'); P.r(x, y + 4, 8, 1, '#e8e0c0'); P.r(x + 7, y, 1, 8, '#1e5a2a'); } })),
    gold: o(spr(26, 18, P => { for (let i = 0; i < 7; i++) { const x = 2 + (i % 4) * 6 + (i > 3 ? 3 : 0), y = i > 3 ? 3 : 9; P.r(x, y, 6, 5, '#c89a20'); P.r(x, y, 6, 1, '#fff080'); P.r(x + 1, y + 1, 4, 1, '#ffd040'); } })),
    case: o(spr(26, 20, P => { for (const [x, y] of [[2, 2], [13, 2], [2, 10], [13, 10]]) { P.r(x, y, 11, 8, '#9aa0a8'); P.r(x, y, 11, 2, '#d8dce2'); P.r(x + 4, y + 3, 3, 1, '#2a2a2a'); } })),
    crate: o(spr(22, 22, P => { for (const [x, y] of [[1, 1], [11, 1], [6, 11]]) { P.r(x, y, 10, 10, '#4a5a2a'); P.r(x, y, 10, 2, '#6a7a3a'); P.r(x + 3, y + 4, 4, 2, '#d8d0a0'); } })),
    bonds: o(spr(22, 16, P => { for (let i = 0; i < 4; i++) { P.r(2 + i * 4, 2 + (i % 2), 9, 12, '#e8e0c0'); P.r(2 + i * 4, 2 + (i % 2), 9, 2, '#c8a040'); P.r(4 + i * 4, 8, 5, 1, '#8a7a50'); } })), safe: null };
  GFX.pile.safe = GFX.bag.safe;
  GFX.gem = [['#3ff', '#bff'], ['#ff3bd8', '#ffc8f0'], ['#fff6c0', '#ffffff'], ['#5dff9a', '#d0ffe0']].map(([a, b]) => o(spr(7, 7, P => { P.r(1, 2, 5, 2, a); P.r(2, 4, 3, 1, a); P.p(3, 5, a); P.r(2, 1, 3, 1, b); P.p(2, 2, '#fff'); })));
  GFX.keycard = o(spr(10, 7, P => { P.r(0, 0, 10, 7, '#f0f0f0'); P.r(0, 1, 10, 2, '#2a6ab8'); P.r(2, 4, 3, 2, '#ffd040'); P.p(2, 4, '#fff'); }));
  GFX.drill = o(spr(26, 18, P => { P.ln(4, 2, 8, 9, '#3a3a3a', 2); P.ln(4, 16, 8, 9, '#3a3a3a', 2); P.ln(2, 9, 8, 9, '#3a3a3a', 2); P.r(7, 5, 11, 8, '#e8c020'); P.r(7, 5, 11, 2, '#fff080'); P.r(9, 8, 6, 2, '#1a1a1a'); P.r(18, 8, 7, 2, '#8a8f99'); P.p(24, 8, '#fff'); P.r(10, 3, 3, 2, '#c81e28'); }));
  GFX.c4 = o(spr(10, 8, P => { P.r(0, 1, 10, 6, '#c8c0a0'); P.r(0, 1, 10, 1, '#e8e0c0'); P.r(2, 3, 6, 2, '#2a2a2a'); P.p(7, 3, '#ff3b4e'); P.ln(3, 0, 8, 0, '#3a8a3a', 1); }));
}
// prop sprites (jewel cases, weapon crates): [intact, broken]
function heistPropGfx() {
  if (GFX.jcase) return;
  GFX.jcase = [hdc(spr(32, 16, P => { P.r(0, 0, 32, 16, INK); P.r(1, 1, 30, 14, '#3a2a3a'); P.r(2, 2, 28, 12, '#7ac8e0'); P.r(2, 2, 28, 3, '#c8f4ff'); for (let i = 0; i < 6; i++) { const x = 4 + i * 4.5, c = ['#3ff', '#ff3bd8', '#ffd040', '#fff'][i % 4]; P.r(x, 8, 2, 2, c); P.p(x, 8, '#fff'); } P.ln(5, 13, 12, 3, '#e8fcff', 1); })),
    hdc(spr(32, 16, P => { P.r(0, 0, 32, 16, INK); P.r(1, 1, 30, 14, '#3a2a3a'); P.r(2, 2, 28, 12, '#1a1418'); for (const [x, y] of [[2, 2], [28, 2], [2, 12], [28, 12]]) P.r(x, y, 2, 2, '#8ad8f0'); P.r(12, 2, 3, 2, '#8ad8f0'); }))];
  GFX.wcrate = [hdc(spr(32, 32, P => { P.r(0, 0, 32, 32, INK); P.r(1, 1, 30, 30, '#4a5a2a'); P.r(1, 1, 30, 3, '#6a7a3a'); for (let y = 8; y < 30; y += 7) P.r(2, y, 28, 1, '#3a4820'); P.r(8, 12, 16, 6, '#d8d0a0'); P.r(10, 14, 12, 2, '#4a5a2a'); P.r(1, 1, 2, 30, '#5a6a32'); for (const [x, y] of [[3, 3], [28, 3], [3, 28], [28, 28]]) P.p(x, y, '#c8ccd2'); })),
    hdc(spr(32, 32, P => { for (let i = 0; i < 9; i++) { const x = 2 + (i * 11) % 26, y = 3 + (i * 7) % 24; P.ln(x, y, x + 7, y + (i % 2 ? 3 : -2), INK, 4); P.ln(x, y, x + 7, y + (i % 2 ? 3 : -2), '#5a6a32', 2); } P.r(10, 14, 12, 2, '#2a2a2a'); P.r(20, 13, 4, 1, '#8a6a4a'); }))];
}
// ---------- per floor ----------
function heistInit(def) {
  const b = M.b; G.bags = []; G.keys = []; G.gems = []; G.hasKey = false; G.asl = null; G.hcount = null; G.police = null; G.c4 = []; G.rigSafe = 0;
  G.piles = (b.loots || []).map(l => ({ x: (l.x + 0.5) * CELL, y: (l.y + 0.5) * CELL, k: l.k, n: l.n, gate: l.gate }));
  G.gates = (b.gates || []).map(g => Object.assign({ open: false }, g)); for (const g of G.gates) gateSolid(g, 1);
  G.drills = (b.drills || []).map(d => ({ x: (d.x + 0.5) * CELL, y: (d.y + 0.5) * CELL, gate: d.gate, secs: d.secs, t: 0, st: 'idle', jams: [0.32 + Math.random() * 0.12, 0.66 + Math.random() * 0.12], sndT: 0 }));
  G.c4 = (b.c4s || []).map(c => ({ x: (c.x + 0.5) * CELL, y: (c.y + 0.5) * CELL, gate: c.gate, st: 'idle', t: 0 }));
  G.secureZ = b.secureZ || null; if (G.stats.loot === undefined) G.stats.loot = 0;
  if (def.police) G.police = { t: def.police, lab: def.policeText || 'TACTICAL TEAM IN' };
  if (def.assault && def.assault.at !== undefined) G.aslAt = def.assault.at; else G.aslAt = null;
  if (b.loots || b.gates || b.secureZ) { heistGfx(); heistPropGfx(); }
  if (def.lanes) { const x = M.decX; x.save(); for (const [y, x0, x1, solid] of def.lanes) { x.fillStyle = solid ? '#c8a020' : '#d8d4c8'; x.globalAlpha = 0.55; for (let X = x0 * CELL; X < x1 * CELL; X += solid ? 4 : 14) x.fillRect(X, y * CELL - 0.5, solid ? 4 : 7, 1); } x.restore(); }
  if (b.props.some(p => p.k !== 'rack')) heistPropGfx();
  for (const s of b.ens) if (s.key) { const x = (s.x + 0.5) * CELL, y = (s.y + 0.5) * CELL; let best = null, bd = 1e9; for (const e of G.ents) { const d = Math.hypot(e.x - x, e.y - y); if (d < bd) { bd = d; best = e; } } if (best) best.key = 1; }
  applyAssets();
}
function gateSolid(g, on) { for (let j = 0; j < g.h; j++) for (let i = 0; i < g.w; i++) { const c = (g.y + j) * M.W + g.x + i; M.solid[c] = on; M.tall[c] = on; } mapChanged(); }
function openGate(id) { const g = G.gates.find(q => q.id === id); if (!g || g.open) return; g.open = true; gateSolid(g, 0); sfx('door', (g.x + g.w / 2) * CELL, (g.y + g.h / 2) * CELL); G.shake = Math.max(G.shake, 0.4); }
const gateOpen = id => !id || (G.gates.find(q => q.id === id) || { open: true }).open;
// police assault: waves while it's on, a short break, then the next (harder) one
function startAssault() {
  const A = floorDef().assault; if (!A || G.asl) return; G.asl = { phase: 'assault', t: 0, n: 1, waveT: 2 };
  banner('ASSAULT INCOMING', '#ff3b4e'); sfx('alarm'); toast('THEY KNOW YOU\'RE HERE. KEEP WORKING.');
}
function assaultTick(dt) {
  const A = floorDef().assault, S = G.asl; if (!A || !S) return; S.t += dt;
  if (S.phase === 'assault') {
    S.waveT -= dt; const alive = G.ents.filter(e => e.st !== 'dead' && e.st !== 'freed' && !e.crawl).length;
    if (S.waveT <= 0) { S.waveT = Math.max(3.5, (A.every || 6) - S.n * 0.4); if (alive < (A.cap || 9)) { const W = A.waves, w = W[(S.n - 1 + ri(0, W.length - 1)) % W.length].slice(); if (S.n >= 2 && A.heavy && Math.random() < 0.35 + S.n * 0.1) w.push(pick(A.heavy)); spawnWave(w); } }
    if (S.t >= (A.len || 32) + S.n * 4) { S.phase = 'break'; S.t = 0; banner('ASSAULT ENDING', '#ffe14d'); }
  } else if (S.t >= (A.rest || 16)) { S.phase = 'assault'; S.t = 0; S.n++; S.waveT = 1; banner('ASSAULT WAVE ' + S.n, '#ff3b4e'); sfx('alarm'); }
}
// ---------- per frame ----------
function heistUpdate(dt) {
  if (!G.piles) return; const P = G.player;
  if (G.aslAt !== null && !G.asl && G.levelTime >= G.aslAt) startAssault();
  assaultTick(dt);
  if (G.police && !G.police.done) { G.police.t -= dt; if (G.police.t <= 0) { G.police.done = true; startAssault(); } }
  if (G.hcount && !G.hcount.done) { const hs = G.hcount.stall; G.hcount.stalled = !!hs && G.ents.some(e => e.st !== 'dead' && e.st !== 'freed' && e.st !== 'down' && !e.crawl && Math.hypot(e.x - hs.x, e.y - hs.y) < hs.r); if (!G.hcount.stalled) G.hcount.t -= dt; if (G.hcount.t <= 0) { G.hcount.done = true; banner(G.hcount.doneText || 'GO GO GO', '#5dff9a'); objHit(G.hcount.k); } }
  for (const d of G.drills) if (d.st === 'run') { d.t += dt; d.sndT -= dt; if (d.sndT <= 0) { d.sndT = 0.45; sfx('drill', d.x, d.y); } if (Math.random() < dt * 12) part(d.x + 10, d.y, rr(-60, 60), rr(-60, 60), 0.2, pick(['#ffd040', '#fff', '#ff8a1c']), 1);
    const p = d.t / d.secs; if (d.jams.length && p >= d.jams[0]) { d.jams.shift(); d.st = 'jam'; sfx('jam', d.x, d.y); banner('DRILL JAMMED', '#ff3b4e'); }
    if (p >= 1) { d.st = 'done'; openGate(d.gate); banner('VAULT OPEN', '#5dff9a'); objHit('drill', d.x, d.y); } }
  for (const c of G.c4) if (c.st === 'armed') { c.t -= dt; if ((c.t * 6 | 0) !== ((c.t + dt) * 6 | 0)) sfx('beep', c.x, c.y); if (c.t <= 0) { c.st = 'done'; explode(c.x, c.y, 26, true, 'c4'); openGate(c.gate); objHit('c4', c.x, c.y); } }
  // bags in flight / on the floor
  for (const g of G.bags) { if (g.vx || g.vy) slideObj(g, dt, 4); if (inSecure(g.x, g.y)) secureBag(g); }
  G.bags = G.bags.filter(g => !g.secured);
  if (P.bag && !P.dead && inSecure(P.x, P.y)) { const g = { x: P.x, y: P.y, k: P.bag.k, v: P.bag.v }; P.bag = null; secureBag(g); }
  if (P.dead && P.bag) { G.bags.push({ x: P.x, y: P.y, vx: 0, vy: 0, a: rr(0, 6.28), k: P.bag.k, v: P.bag.v, heavy: P.bag.heavy }); P.bag = null; }
  for (const e of G.ents) if (e.key && (e.st === 'dead' || e.crawl)) { e.key = 0; G.keys.push({ x: e.x, y: e.y }); sfx('tink', e.x, e.y); pop(e.x, e.y - 10, 'KEYCARD DROPPED', '#ffd040'); }
  // keycards and loose jewels are grabbed by walking over them
  for (const k of G.keys) if (!k.got && !P.dead && Math.hypot(k.x - P.x, k.y - P.y) < 11) { k.got = true; G.hasKey = true; sfx('pickup'); pop(k.x, k.y, 'KEYCARD', '#ffd040'); objHit('key', k.x, k.y); }
  for (const m of G.gems) { if (m.vx || m.vy) { m.x += m.vx * dt; m.y += m.vy * dt; m.vx *= Math.max(0, 1 - dt * 6); m.vy *= Math.max(0, 1 - dt * 6); if (Math.abs(m.vx) + Math.abs(m.vy) < 3) m.vx = m.vy = 0; if (solidAt(m.x, m.y)) { m.vx = m.vy = 0; } }
    if (!m.got && !P.dead && Math.hypot(m.x - P.x, m.y - P.y) < 10) { m.got = true; G.stats.loot += 800; G.score += 160; sfx('cash'); pop(m.x, m.y, '$800', '#5dff9a'); objHit('gem'); } }
  G.gems = G.gems.filter(m => !m.got);
}
function heistCount(o) { G.hcount = Object.assign({ t0: o.t }, o); }
function inSecure(x, y) { const z = G.secureZ; return z && x > z.x * CELL && x < (z.x + z.w) * CELL && y > z.y * CELL && y < (z.y + z.h) * CELL; }
function secureBag(g) { g.secured = true; G.stats.loot += g.v; G.score += Math.round(g.v / 5); sfx('cash'); pop(g.x, g.y, '$' + g.v.toLocaleString('en-US') + ' SECURED', '#5dff9a'); objHit(g.k === 'safe' ? 'safe' : g.k === 'crate' ? 'crates' : 'bag', g.x, g.y); }
function throwBag() { const P = G.player, b = P.bag; if (!b) return; P.bag = null; const sp = b.heavy ? 0 : 230; G.bags.push({ x: P.x + Math.cos(P.a) * 4, y: P.y + Math.sin(P.a) * 4, vx: Math.cos(P.a) * sp, vy: Math.sin(P.a) * sp, va: rr(-8, 8), a: P.a, k: b.k, v: b.v, heavy: b.heavy }); sfx(b.heavy ? 'thud' : 'throw', P.x, P.y); }
// things you can use with E
function heistUsable(P) {
  if (!G.piles) return null; const near = (x, y, r) => Math.hypot(x - P.x, y - P.y) < r;
  for (const g of G.gates) if (!g.open && g.kind === 'key') { const gx = (g.x + g.w / 2) * CELL, gy = (g.y + g.h / 2) * CELL; if (near(gx, gy, 22)) return G.hasKey ? { kind: 'heist', text: 'SWIPE THE KEYCARD', act: () => { openGate(g.id); sfx('hack', gx, gy); objHit('gate', gx, gy); } } : { kind: 'heist', text: 'NEEDS A KEYCARD', act: () => { sfx('noway'); toast('ONE OF THE GUARDS CARRIES THE KEYCARD.'); } }; }
  for (const d of G.drills) if ((d.st === 'idle' || d.st === 'jam') && near(d.x, d.y, 18)) return { kind: 'heist', text: d.st === 'idle' ? 'SET UP THE DRILL' : 'FIX THE DRILL', act: () => { const first = d.st === 'idle'; d.st = 'run'; sfx('plant', d.x, d.y); if (first) { banner('DRILLING', '#ffe14d'); const def = floorDef(); if (def.on) def.on('drillStart', 1); } } };
  for (const c of G.c4) if (c.st === 'idle' && near(c.x, c.y, 18)) return { kind: 'heist', text: 'PLANT THE CHARGE', act: () => { c.st = 'armed'; c.t = 3.2; sfx('plant', c.x, c.y); banner('CHARGE SET - BACK OFF', '#ff3b4e'); } };
  if (!P.bag) {
    for (const p of G.piles) if (p.n > 0 && gateOpen(p.gate) && !(p.k === 'safe' && p.locked) && near(p.x, p.y, p.k === 'safe' ? 20 : 17)) return { kind: 'heist', text: p.k === 'safe' ? 'LIFT THE SAFE' : 'BAG THE ' + LOOT[p.k].name, act: () => { p.n--; const L = LOOT[p.k]; P.bag = { k: p.k, v: L.v, heavy: L.heavy }; sfx('bag', P.x, P.y); if (p.k === 'safe') toast('HEAVY. YOU CAN\'T FIGHT WHILE CARRYING IT - E TO DROP.'); } };
    for (const g of G.bags) if (near(g.x, g.y, 14)) return { kind: 'heist', text: 'PICK UP THE ' + LOOT[g.k].name, act: () => { G.bags.splice(G.bags.indexOf(g), 1); P.bag = { k: g.k, v: g.v, heavy: g.heavy }; sfx('bag', P.x, P.y); } };
  }
  return null;
}
// a broken jewel case scatters jewels; a smashed weapon crate counts toward the job
function heistBreak(p, cx, cy) {
  if (p.k === 'jcase') { sfx('glass', cx, cy); for (let i = 0; i < 3; i++) { const a = rr(0, 6.28), s = rr(30, 80); G.gems.push({ x: cx, y: cy + 6, vx: Math.cos(a) * s, vy: Math.abs(Math.sin(a)) * s, img: pick(GFX.gem) }); } for (let i = 0; i < 14; i++) part(cx, cy, rr(-110, 110), rr(-110, 110), rr(0.2, 0.4), pick(['#fff', '#9ee8ff']), 1, 1); objHit('jcase'); }
  else if (p.k === 'wcrate') { sfx('crumble', cx, cy); addScore(300, cx, cy, 'DESTROYED', null); objHit('crates', cx, cy); for (let i = 0; i < 6; i++) chunk(cx, cy, rr(0, 6.28), 3.1, GFX.rubble, 0.6); }
}
// ---------- drawing ----------
function drawHeist(x) {
  if (!G.piles) return; drawHeistExtras(x);
  const z = G.secureZ; if (z) { const p = 0.5 + 0.5 * Math.sin(G.time * 4); x.fillStyle = `rgba(93,255,154,${0.07 + p * 0.06})`; x.fillRect(z.x * CELL, z.y * CELL, z.w * CELL, z.h * CELL); x.strokeStyle = 'rgba(93,255,154,0.55)'; x.lineWidth = 1; x.setLineDash([3, 3]); x.strokeRect(z.x * CELL + 0.5, z.y * CELL + 0.5, z.w * CELL - 1, z.h * CELL - 1); x.setLineDash([]); }
  for (const g of G.gates) if (!g.open && g.kind !== 'virtual') { const X = g.x * CELL, Y = g.y * CELL, w = g.w * CELL, h = g.h * CELL; x.fillStyle = '#140c10'; x.fillRect(X - 0.5, Y - 0.5, w + 1, h + 1); x.fillStyle = g.kind === 'key' ? '#5a6068' : '#7a7e88'; x.fillRect(X, Y, w, h); x.fillStyle = g.kind === 'key' ? '#3a3e46' : '#9aa0a8';
    if (g.kind === 'key') { for (let i = 1; i < Math.max(w, h); i += 2.5) w > h ? x.fillRect(X + i, Y + 1, 1, h - 2) : x.fillRect(X + 1, Y + i, w - 2, 1); x.fillStyle = '#2a6ab8'; x.fillRect(X + w / 2 - 1.5, Y + h / 2 - 1.5, 3, 3); x.fillStyle = G.hasKey ? '#5dff9a' : '#ff3b4e'; x.fillRect(X + w / 2 - 0.5, Y + h / 2 - 0.5, 1, 1); }
    else { x.beginPath(); x.arc(X + w / 2, Y + h / 2, Math.min(w, h) / 2 - 0.5, 0, 6.29); x.fill(); x.fillStyle = '#4a4e58'; x.beginPath(); x.arc(X + w / 2, Y + h / 2, Math.min(w, h) / 4, 0, 6.29); x.fill(); x.fillStyle = '#c8ccd2'; for (let a = 0; a < 6.28; a += 1.05) x.fillRect(X + w / 2 + Math.cos(a) * Math.min(w, h) * 0.36 - 0.5, Y + h / 2 + Math.sin(a) * Math.min(w, h) * 0.36 - 0.5, 1, 1); } }
  for (const p of G.piles) if (p.n > 0 && gateOpen(p.gate) && GFX.pile[p.k]) { if (p.k === 'safe' && p.locked) { x.globalAlpha = 0.75; } dRot(x, GFX.pile[p.k], p.x, p.y, 0); x.globalAlpha = 1; if (p.n > 1) { x.fillStyle = '#140c10'; x.fillRect(p.x + 5, p.y - 9, 6, 5); x.fillStyle = '#5dff9a'; x.font = 'bold 5px monospace'; x.fillText(String(p.n), p.x + 6, p.y - 5); } }
  for (const c of G.c4) if (c.st !== 'done') { if (c.st === 'idle') { const k = 0.5 + 0.5 * Math.sin(G.time * 6); x.strokeStyle = `rgba(255,224,77,${0.4 + 0.5 * k})`; x.lineWidth = 0.75; x.strokeRect(c.x - 5, c.y - 5, 10, 10); } else { dRot(x, GFX.c4, c.x, c.y, 0); if ((G.time * 8 | 0) % 2) { x.fillStyle = '#ff3b4e'; x.fillRect(c.x + 2, c.y - 1, 1.5, 1.5); } } }
  for (const d of G.drills) { if (d.st === 'idle') { const k = 0.5 + 0.5 * Math.sin(G.time * 6); x.strokeStyle = `rgba(255,224,77,${0.4 + 0.5 * k})`; x.lineWidth = 0.75; x.strokeRect(d.x - 6, d.y - 6, 12, 12); continue; } if (d.st === 'done') continue;
    const gt = G.gates.find(q => q.id === d.gate), a = gt ? Math.atan2((gt.y + gt.h / 2) * CELL - d.y, (gt.x + gt.w / 2) * CELL - d.x) : 0; dRot(x, GFX.drill, d.x, d.y, a);
    const p = Math.min(1, d.t / d.secs); x.fillStyle = 'rgba(0,0,0,0.7)'; x.fillRect(d.x - 10, d.y - 12, 20, 3); x.fillStyle = d.st === 'jam' ? ((G.time * 6 | 0) % 2 ? '#ff3b4e' : '#5a0a10') : '#ffd040'; x.fillRect(d.x - 9.5, d.y - 11.5, 19 * p, 2); }
  for (const g of G.bags) dRot(x, GFX.bag[g.k], g.x, g.y, g.a || 0);
  for (const k of G.keys) if (!k.got) { dRot(x, GFX.keycard, k.x, k.y + Math.sin(G.time * 5) * 0.8, 0.3); }
  for (const m of G.gems) { dRot(x, m.img, m.x, m.y, 0); if ((G.time * 1.7 + m.x * 0.13 + m.y * 0.07) % 1 < 0.12) { x.fillStyle = '#fff'; x.fillRect(m.x - 2.5, m.y - 1.5, 5, 0.6); x.fillRect(m.x - 0.3, m.y - 4, 0.6, 5); } }
  // the guard carrying the keycard wears a little card icon
  for (const e of G.ents) if (e.key && e.st !== 'dead') dRot(x, GFX.keycard, e.x, e.y - 11 + Math.sin(G.time * 4), 0);
}
function drawHeistExtras(x) {
  const def = floorDef();
  for (const o of M.b.objs) if (o.k === 'atruck' && gateOpen('truck')) { const X = o.x * CELL, Y = o.y * CELL, h = OBJ.atruck.h * CELL; x.fillStyle = '#140c10'; x.fillRect(X - 1, Y + 3, 5, h - 6); x.fillStyle = '#2a2018'; x.fillRect(X, Y + 4, 3, h - 8);
    x.save(); x.translate(X - 5, Y + 1); x.rotate(-0.9); x.fillStyle = INK; x.fillRect(-1, -1, 6, 14); x.fillStyle = '#4a5668'; x.fillRect(0, 0, 4, 12); x.restore();
    x.save(); x.translate(X - 6, Y + h + 2); x.rotate(0.7); x.fillStyle = INK; x.fillRect(-1, -13, 6, 14); x.fillStyle = '#4a5668'; x.fillRect(0, -12, 4, 12); x.restore(); }
  const ex = M.b.exit; if (def.vanArrives && ex && G.hcount && G.hcount.done && OBJSPR.van) dImg(x, OBJSPR.van, ex.x * CELL + (ex.w * CELL - 48) / 2, ex.y * CELL + (ex.h * CELL - 24) / 2);
  if (def.rig && G.secureZ) { const z = G.secureZ, X = z.x * CELL, Y = z.y * CELL, w = z.w * CELL, h = z.h * CELL, low = G.hcount && G.hcount.k === 'rig' && !G.hcount.done, k = low ? 1 - G.hcount.t / G.hcount.t0 : 0;
    x.strokeStyle = '#140c10'; x.lineWidth = 2; for (const ax of [X + 3, X + w - 3]) { x.beginPath(); x.moveTo(ax, Y + h); x.lineTo(ax, Y - 9); x.stroke(); }
    x.strokeStyle = '#c8ccd2'; x.lineWidth = 1; for (const ax of [X + 3, X + w - 3]) { x.beginPath(); x.moveTo(ax, Y + h); x.lineTo(ax, Y - 9); x.stroke(); }
    if (!low || k < 0.15) { x.fillStyle = '#140c10'; x.fillRect(X + 1, Y + 1, w - 2, h - 2); x.fillStyle = '#5a6068'; x.fillRect(X + 2, Y + 2, w - 4, h - 4); x.fillStyle = '#3a3e46'; for (let i = X + 4; i < X + w - 3; i += 3) x.fillRect(i, Y + 3, 1, h - 6); x.fillStyle = '#ffd040'; x.fillRect(X + 2, Y + 2, w - 4, 1); }
    if (low) { x.globalAlpha = Math.max(0, 1 - k * 1.4); x.fillStyle = '#5a6068'; const s = 1 - k * 0.6; x.fillRect(X + w / 2 - w * s / 2, Y + h / 2 - h * s / 2 - k * 10, w * s, h * s); if (G.rigSafe && GFX.bag) { x.save(); x.translate(X + w / 2, Y + h / 2 - k * 10); x.scale(s, s); dRot(x, GFX.bag.safe, 0, 0, 0); x.restore(); } x.globalAlpha = 1; } }
  if (def.zipline && ex) { const cx = (ex.x + ex.w / 2) * CELL, cy = (ex.y + ex.h / 2) * CELL; x.strokeStyle = '#140c10'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx - 90, cy - 70); x.stroke(); x.strokeStyle = '#c8ccd2'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx - 90, cy - 70); x.stroke(); x.fillStyle = '#140c10'; x.fillRect(cx - 3, cy - 3, 6, 6); x.fillStyle = '#ffd040'; x.fillRect(cx - 2, cy - 2, 4, 4); }
}
function drawCarried(x) { const P = G.player; if (!P.bag || P.dead || !GFX.bag) return; const img = GFX.bag[P.bag.k]; const o = P.bag.heavy ? -7 : 6; dRot(x, img, P.x - Math.cos(P.a) * o, P.y - Math.sin(P.a) * o, P.a + Math.PI / 2); }
function heistHud(x, u, W, H) {
  if (!G.piles) return; const tm = s => Math.floor(s / 60) + ':' + String(Math.max(0, Math.ceil(s % 60)) % 60).padStart(2, '0');
  let y = u * 1.6;
  if (G.asl) { const S = G.asl, A = floorDef().assault; if (S.phase === 'assault') htxt(x, 'ASSAULT WAVE ' + S.n, W / 2, y, u * 0.9, (G.time * 3 | 0) % 2 ? '#ff3b4e' : '#fff', 'center', -0.03, '#000'); else htxt(x, 'BREAK ' + tm((A.rest || 16) - S.t), W / 2, y, u * 0.9, '#ffe14d', 'center', -0.03, '#000'); y += u * 1.1; }
  if (G.police && !G.police.done) { htxt(x, G.police.lab + ' ' + tm(G.police.t), W / 2, y, u * 0.9, G.police.t < 10 && (G.time * 4 | 0) % 2 ? '#fff' : '#ff3b4e', 'center', -0.03, '#000'); y += u * 1.1; }
  if (G.hcount && !G.hcount.done) { htxt(x, G.hcount.label + ' ' + tm(G.hcount.t) + (G.hcount.stalled ? ' - STALLED, CLEAR THEM OFF' : ''), W / 2, y, u * 0.9, G.hcount.stalled ? ((G.time * 4 | 0) % 2 ? '#ff3b4e' : '#fff') : '#5dff9a', 'center', -0.03, '#000'); y += u * 1.1; }
  const z = G.secureZ; if (z && z.label) { const [sx, sy] = worldToScreen((z.x + z.w / 2) * CELL, z.y * CELL); if (sx > 0 && sy > 0 && sx < W && sy < H) htxt(x, z.label, sx, sy - u * 0.4, u * 0.5, '#5dff9a', 'center', 0); }
  for (const d of G.drills) if (d.st === 'run' || d.st === 'jam') { htxt(x, d.st === 'jam' ? 'DRILL JAMMED - FIX IT' : 'DRILL ' + Math.floor(Math.min(1, d.t / d.secs) * 100) + '%', W / 2, y, u * 0.8, d.st === 'jam' ? ((G.time * 4 | 0) % 2 ? '#ff3b4e' : '#fff') : '#ffe14d', 'center', -0.03, '#000'); y += u * 1.0; }
  if (G.stats.loot) htxt(x, '$' + G.stats.loot.toLocaleString('en-US'), W - u * 0.8, u * 4.6, u * 0.8, '#5dff9a', 'right', -0.03, '#000');
  const P = G.player; if (P.bag) htxt(x, 'CARRYING: ' + LOOT[P.bag.k].name + (UI.touch ? '' : P.bag.heavy ? '  [E] SET DOWN' : '  [E] THROW'), u * 0.8, H - u * 5.2, u * 0.55, '#5dff9a', 'left', 0);
}
