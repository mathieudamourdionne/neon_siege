// ---------- level mechanics: objectives, switches, smashable racks, captives, escape timer + flood, hold-outs, the crane ----------
function mechInit(def) {
  const b = M.b;
  G.obj = (def.objs || []).map(o => ({ k: o.k, n: o.n, have: 0, label: o.label }));
  G.objFired = false; G.timer = null; G.flood = null; G.crane = { cd: 0, drop: null, box: 0 }; G.swingId = 0;
  G.props = b.props.map(p => Object.assign({ hp: 4, dead: false }, p));
  G.hold = def.hold ? { t: 0, need: def.hold.t, next: 0.5, wave: 0, done: false, started: false } : null;
  M.waterCells = []; for (let i = 0; i < M.W * M.H; i++) if (M.water[i]) M.waterCells.push(i);
  G.birds = b.birds.map(([x, y]) => ({ x: x, y: y, st: 'sit', hop: rr(0, 2), a: rr(0, 6.28), t: 0 }));
  for (const [x, y] of b.guests) G.civs.push({ t: pick(['guest', 'guest2', 'guest3']), x: x, y: y, hx: x, hy: y, a: rr(0, 6.28), st: 'guest', wait: rr(0, 3), legT: 0 });
  G.disguise = !!def.disguise; G.night = !!def.night; G.storm = !!def.storm; G.lightT = 0; G.nextLight = undefined;
  if (def.onStart) def.onStart();
}
function objDone() { return (G.obj || []).every(o => o.have >= o.n) && G.witFreed; }
function objHit(k, x, y) {
  const o = (G.obj || []).find(o => o.k === k); if (!o || o.have >= o.n) return;
  o.have++; sfx(o.have >= o.n ? 'objdone' : 'hack'); if (x !== undefined) pop(x, y - 12, o.label.split(' ').pop() + ' ' + o.have + '/' + o.n, '#5dff9a');
  const def = floorDef(); if (def.on) def.on(k, o.have);
  if (objDone() && !G.objFired) { G.objFired = true; if (def.onDone) def.onDone(); }
  checkClear();
}
// spawn a group of alerted enemies at the floor's spawn points, preferring ones out of the player's sight
function spawnWave(list) {
  const P = G.player, pts = M.b.sps.map(([x, y]) => [(x + 0.5) * CELL, (y + 0.5) * CELL]);
  const ok = pts.filter(([x, y]) => Math.hypot(x - P.x, y - P.y) > 90 && !los(P.x, P.y, x, y)), use = ok.length ? ok : pts;
  list.forEach(([t, w], i) => { const [x, y] = use[(ri(0, use.length - 1) + i) % use.length]; const e = spawnEnemy(t, x + rr(-4, 4), y + rr(-4, 4), w || null, 0); e.st = 'alert'; e.react = 0.6; e.lx = P.x; e.ly = P.y; });
  if (floorDef().clear !== 'obj') G.cleared = false;
}
// ---------- switches ----------
function useSwitch(s) {
  const def = floorDef(), P = G.player;
  if (s.kind === 'console' && def.crane) { if (G.crane.cd > 0 || G.crane.drop) { sfx('noway'); return; } G.crane.drop = { t: 0 }; G.crane.cd = 3.2; sfx('crane'); banner('CONTAINER DROPPING', '#ffe14d'); return; }
  s.done = true; sfx(s.kind === 'breaker' ? 'power' : s.kind === 'valve' ? 'plant' : 'hack', s.ux, s.uy);
  G.flash = 0.15; for (let i = 0; i < 10; i++) part(s.ux, s.uy, rr(-120, 120), rr(-120, 120), rr(0.15, 0.35), pick(['#ffe14d', '#fff', '#3ff']), 1);
  if (s.kind === 'console' && G.hold && !G.hold.started) { G.hold.started = true; banner(def.hold.startText || 'HOLD THE LANDING', '#ff2a8a'); sfx('alarm'); }
  objHit(s.kind, s.ux, s.uy);
}
// ---------- smashable racks ----------
function propAt(px, py) { const x = Math.floor(px / CELL), y = Math.floor(py / CELL); for (const p of G.props) if (!p.dead && x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h) return p; return null; }
function damageProp(p, n, x, y) {
  if (p.dead) return; p.hp -= n; p.hitT = 0.1; sfx('tink', x, y);
  for (let i = 0; i < 5; i++) part(x, y, rr(-90, 90), rr(-90, 90), rr(0.1, 0.3), pick(['#3ff', '#5dff9a', '#ff2a8a', '#fff', '#222']), 1, 1);
  if (p.hp > 0) return;
  p.dead = true; for (let j = 0; j < p.h; j++) for (let i = 0; i < p.w; i++) { const c = (p.y + j) * M.W + p.x + i; M.solid[c] = 0; M.tall[c] = 0; } mapChanged();
  const cx = (p.x + p.w / 2) * CELL, cy = (p.y + p.h / 2) * CELL; if (p.k === 'rack') sfx('emp', cx, cy); G.shake = Math.max(G.shake, 0.4);
  if (p.k === 'rack') for (let i = 0; i < 24; i++) part(cx + rr(-10, 10), cy, rr(-160, 160), rr(-160, 160), rr(0.2, 0.6), pick(['#3ff', '#ffe14d', '#fff', '#333', '#555']), ri(1, 2), 1);
  if (p.k !== 'rack') { heistBreak(p, cx, cy); return; }
  addScore(200, cx, cy, 'FEED CUT', null); objHit('rack');
}
function meleeProps(e, W) {
  const reach = (W ? W.reach : 21) + 4;
  for (const p of G.props) {
    if (p.dead || p.swing === G.swingId) continue;
    const qx = clamp(e.x, p.x * CELL, (p.x + p.w) * CELL), qy = clamp(e.y, p.y * CELL, (p.y + p.h) * CELL), d = Math.hypot(qx - e.x, qy - e.y);
    if (d > reach || (d > 2 && Math.abs(angDiff(Math.atan2(qy - e.y, qx - e.x), e.a)) > 1.45)) continue;
    p.swing = G.swingId; damageProp(p, W ? (W.sharp ? 2 : 3) : 1, qx, qy);
  }
}
// ---------- captives ----------
function openCage(c) {
  const P = G.player; c.open = true; sfx('cage', c.ux, c.uy); G.stats.freed += c.n;
  addScore(1000, c.ux, c.uy, c.kind === 'kids' ? 'KIDS FREED' : c.kind === 'cont' ? 'FREED' : 'FREED', null);
  // the cage opens up for real; people come out of the door and head for the way you came in
  if (c.kind !== 'cont') { for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const k = (c.y + j) * M.W + c.x + i; M.solid[k] = 0; M.tall[k] = 0; } mapChanged(); }
  G.escF = null;
  for (let i = 0; i < c.n; i++) {
    const t = c.kind === 'kids' ? pick(['kid', 'kid2']) : pick(['mig', 'mig2']), x = c.kind === 'cont' ? c.ux - 2 + i * 1.5 : c.ux + rr(-3, 3), y = c.kind === 'cont' ? c.uy + (i - 1.5) * 3 : c.uy + rr(-3, 3);
    G.civs.push({ t: t, x: x, y: y, sx: x, sy: y, r: 3, vx: 0, vy: 0, a: 0, st: 'run', t0: -i * 0.3 });
  }
  objHit('cage', c.ux, c.uy);
}
// freed people run along a real path back to the floor's entrance, then slip away
function civRun(c, dt) {
  c.t0 += dt; if (c.t0 < 0) return;
  const sx = (M.b.start[0] + 0.5) * CELL, sy = (M.b.start[1] + 0.5) * CELL;
  if (!G.escF) G.escF = flowFrom(sx, sy);
  const [mx, my] = flowStep(c, G.escF, { x: sx, y: sy }), want = Math.atan2(my, mx);
  c.a = c.t0 < dt * 1.5 ? want : turn(c.a, want, dt * 10); c.vx = Math.cos(c.a) * 72; c.vy = Math.sin(c.a) * 72; moveEnt(c, c.vx * dt, c.vy * dt);
  if (Math.hypot(c.x - sx, c.y - sy) < 22 || c.t0 > 10) c.fade = (c.fade || 0) + dt; if (c.fade > 0.6) c.gone = true;
}
// ---------- per-frame ----------
function mechUpdate(dt) {
  const def = floorDef(), P = G.player;
  // live water crackles
  if (M.live && M.waterCells.length) for (let k = 0; k < 3; k++) { const c = M.waterCells[ri(0, M.waterCells.length - 1)], x = (c % M.W) * CELL + rr(0, 8), y = ((c / M.W) | 0) * CELL + rr(0, 8); if (Math.abs(x - P.x) < 260 && Math.abs(y - P.y) < 180) part(x, y, rr(-40, 40), rr(-40, 40), rr(0.06, 0.16), pick(['#9ff', '#fff', '#4ff']), 1); }
  // escape timer
  if (G.timer && !P.dead && !G.timer.off) { G.timer.t -= dt; if (G.timer.t <= 0) { G.timer.t = 0; P.shield = 0; P.inv = 0; P.dashT = 0; G.god = false; hurtPlayer(null, rr(0, 6.28)); toast(G.timer.lose || 'TOO SLOW.'); } }
  if (G.flood) G.flood.r += G.flood.rate * dt;
  // hold-out waves
  const H = G.hold;
  if (H && H.started && !H.done) {
    H.t += dt; H.next -= dt;
    if (H.next <= 0) { const W = def.hold.waves; H.next = def.hold.every || 5; if (H.t < H.need - 3) spawnWave(W[H.wave % W.length]); H.wave++; }
    if (H.t >= H.need) { H.done = true; banner(def.hold.doneText || 'DONE', '#5dff9a'); objHit('hold'); }
  }
  // crane
  const C = G.crane; C.cd -= dt; if (C.box > 0) C.box -= dt;
  if (C.drop) {
    C.drop.t += dt;
    if (C.drop.t >= 0.75) {
      const z = M.b.zone, x0 = z.x * CELL, y0 = z.y * CELL, x1 = (z.x + z.w) * CELL, y1 = (z.y + z.h) * CELL, inZ = e => e.x > x0 - 2 && e.x < x1 + 2 && e.y > y0 - 2 && e.y < y1 + 2;
      for (const e of G.ents) if (e.st !== 'dead' && e.st !== 'freed' && inZ(e)) { e.hp = 0; killE(e, 'shotgun', rr(0, 6.28), true, 'crane'); }
      if (!P.dead && inZ(P)) { P.shield = 0; hurtPlayer(null, rr(0, 6.28)); }
      sfx('explode'); sfx('cargo'); G.shake = 1.2; G.flash = 0.25; C.drop = null; C.box = 1.4;
      for (let i = 0; i < 30; i++) part(rr(x0, x1), rr(y0, y1), rr(-200, 200), rr(-200, 200), rr(0.2, 0.5), pick(['#888', '#aaa', '#555', '#e8c020']), ri(1, 2));
    }
  }
  for (const p of G.props) if (p.hitT > 0) p.hitT -= dt;
}
// flood spreading out from a set of cells (for drawing + slowing you down)
function floodStart(src, seconds, toX, toY) {
  const W = M.W, H = M.H, d = new Int16Array(W * H).fill(-1), q = []; for (const [x, y] of src) { d[y * W + x] = 0; q.push(y * W + x); }
  for (let h = 0; h < q.length; h++) { const c = q[h], x = c % W, y = (c / W) | 0; for (const [i, j] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = (y + j) * W + x + i; if (x + i < 0 || x + i >= W || y + j < 0 || y + j >= H || d[n] >= 0 || !M.fl[n] || M.wall[n]) continue; d[n] = d[c] + 1; q.push(n); } }
  const far = d[Math.floor(toY) * W + Math.floor(toX)]; G.flood = { d: d, r: 0, rate: Math.max(4, far) / seconds };
}
function floodAt(x, y) { const F = G.flood; if (!F) return false; const v = F.d[Math.floor(y / CELL) * M.W + Math.floor(x / CELL)]; return v >= 0 && v < F.r; }
