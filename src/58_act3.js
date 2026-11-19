// ---------- Act 3 mechanics: drones, auto-turrets, blackouts, Director Hale ----------
Object.assign(ETYPE, { dir: { name: 'DIRECTOR HALE', spd: 100, pat: 40, react: 0.28, hp: 20, armor: 1, boss: 1, strafe: 1 } });
Object.assign(CHARS, { dir: { jacket: '#1e2228', boots: '#0a0a0a', skin: SKINS[2], hair: '#c8c8c8', legs: '#16181c', stripe: '#ff7a1a', implant: '#ff3b4e', vest: '#3a4048' } });
Object.assign(LOOKS, { dir: { hairStyle: 'slick', collar: '#ff7a1a' } });
Object.assign(Builder.prototype, {
  drone(x, y, path) { (this.drones = this.drones || []).push({ x: x, y: y, p: path || null }); return this; },
  turret(x, y, a) { (this.turrets = this.turrets || []).push({ x: x, y: y, a: a || 0 }); return this; },
});
function act3Gfx() {
  if (GFX.drone) return;
  const dr = k => hdc(spr(28, 28, P => { const C = 14; for (const [dx, dy] of [[-8, -8], [8, -8], [-8, 8], [8, 8]]) { P.ln(C, C, C + dx, C + dy, '#140c10', 3); P.ln(C, C, C + dx, C + dy, '#5a5e66', 1); P.d(C + dx, C + dy, 5, 5, '#140c10'); P.d(C + dx, C + dy, 4, 4, k ? 'rgba(200,210,220,0.55)' : 'rgba(160,170,180,0.35)'); P.ln(C + dx - (k ? 3 : 0), C + dy - (k ? 0 : 3), C + dx + (k ? 3 : 0), C + dy + (k ? 0 : 3), '#e8ecf2', 1); }
    P.d(C, C, 6, 5, '#140c10'); P.d(C, C, 5, 4, '#2a2e36'); P.r(C - 3, C - 1, 6, 2, '#ff7a1a'); P.r(C + 3, C - 1, 2, 2, '#ff3b4e'); P.p(C - 2, C - 3, '#8a8f99'); }));
  GFX.drone = [dr(0), dr(1)];
  GFX.droneWreck = hdc(spr(28, 28, P => { const C = 14; for (const [dx, dy] of [[-9, -5], [7, -8], [-6, 9], [9, 6]]) { P.ln(C, C, C + dx, C + dy, '#140c10', 3); P.ln(C, C, C + dx, C + dy, '#3a3e46', 1); } P.d(C, C, 5, 4, '#140c10'); P.d(C, C, 4, 3, '#1a1c20'); P.p(C, C, '#ff7a1a'); }));
  GFX.turretBase = hdc(spr(18, 18, P => { P.d(9, 9, 8.5, 8.5, '#140c10'); P.d(9, 9, 7.5, 7.5, '#4a4e58'); P.d(9, 9, 5.5, 5.5, '#2a2e36'); for (let a = 0; a < 6.28; a += 1.05) P.p(9 + Math.cos(a) * 6.5, 9 + Math.sin(a) * 6.5, '#ffd040'); }));
  GFX.turretGun = hdc(spr(24, 12, P => { P.r(10, 2, 14, 3, '#140c10'); P.r(10, 7, 14, 3, '#140c10'); P.r(11, 3, 12, 1, '#8a8f99'); P.r(11, 8, 12, 1, '#8a8f99'); P.d(8, 6, 6, 5.5, '#140c10'); P.d(8, 6, 5, 4.5, '#5a5e66'); P.r(6, 5, 4, 2, '#ff3b4e'); }));
}
// ---------- per floor ----------
function act3Init(def) {
  const b = M.b; G.drones = []; G.turrets = []; G.turretsOff = false; G.bo = null; G.firesLit = 0; G.lanceFx = null;
  for (const d of b.drones || []) spawnDrone((d.x + 0.5) * CELL, (d.y + 0.5) * CELL, d.p ? d.p.map(q => [(q[0] + 0.5) * CELL, (q[1] + 0.5) * CELL]) : null);
  for (const t of b.turrets || []) { const x = (t.x + 0.5) * CELL, y = (t.y + 0.5) * CELL; G.turrets.push({ x: x, y: y, a0: t.a, a: t.a, hp: 3, see: 0, cd: 0, burst: 0, bt: 0, t: Math.random() * 6, dead: false }); M.solid[t.y * M.W + t.x] = 1; }
  if (def.blackout) G.bo = { t: def.blackout.light, dark: false };
  if (def.helipad) { const [hx, hy] = def.helipad, x = (hx + 0.5) * CELL, y = (hy + 0.5) * CELL, d = M.decX; d.save(); d.strokeStyle = 'rgba(232,192,32,0.75)'; d.lineWidth = 2; d.beginPath(); d.arc(x, y, 64, 0, 6.29); d.stroke(); d.fillStyle = 'rgba(232,236,242,0.7)'; d.fillRect(x - 20, y - 26, 8, 52); d.fillRect(x + 12, y - 26, 8, 52); d.fillRect(x - 12, y - 4, 24, 8); d.restore(); }
  if (G.drones.length || G.turrets.length || def.helipad) act3Gfx();
  if (G.turrets.length) mapChanged();
}
function spawnDrone(x, y, path, hunt) { act3Gfx(); const d = { x: x, y: y, vx: 0, vy: 0, m: 4, hp: 2, a: rr(0, 6.28), st: hunt ? 'hunt' : 'patrol', p: path, pi: 0, see: hunt ? 1 : 0, cd: 1, aimT: 0, lost: 0, t: Math.random() * 9, dead: false }; if (hunt) { d.lx = G.player.x; d.ly = G.player.y; } G.drones.push(d); return d; }
function enemyShot(x, y, a, src) { const s = 430, b = { x: x, y: y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, owner: 'e', src: src, k: 'pistol', t: 0 }; G.bullets.push(b); return b; }
// ---------- drones: searchlight, lock on, call it in, shoot ----------
function droneTick(dt) {
  const P = G.player;
  for (const d of G.drones) {
    if (d.dead) continue; d.t += dt; const dx = P.x - d.x, dy = P.y - d.y, dP = Math.hypot(dx, dy), toP = Math.atan2(dy, dx);
    const sees = !P.dead && !G.god && dP < 180 && (d.st === 'hunt' || Math.abs(angDiff(toP, d.a)) < 0.5) && los(d.x, d.y, P.x, P.y) && !smokeBlocks(d.x, d.y, P.x, P.y);
    d.see = sees ? d.see + dt : Math.max(0, d.see - dt * 0.5); let tx = d.vx, ty = d.vy, spd = 0;
    if (d.st === 'patrol') {
      if (d.p) { const q = d.p[d.pi], qd = Math.hypot(q[0] - d.x, q[1] - d.y); if (qd < 6) d.pi = (d.pi + 1) % d.p.length; else { tx = (q[0] - d.x) / qd; ty = (q[1] - d.y) / qd; spd = 38; } d.a = turn(d.a, Math.atan2(ty, tx) + Math.sin(d.t * 1.3) * 0.6, dt * 3); }
      else d.a += dt * 0.7;
      if (d.see > 0.35) { d.st = 'hunt'; sfx('alert', d.x, d.y); pop(d.x, d.y - 10, 'DRONE LOCK', '#ff3b4e'); makeNoise(P.x, P.y, 420); }
    } else {
      if (sees) { d.lx = P.x; d.ly = P.y; d.lost = 0; } else d.lost += dt;
      if (d.lost > 5) { d.st = 'patrol'; d.see = 0; }
      d.a = turn(d.a, sees ? toP : Math.atan2(d.ly - d.y, d.lx - d.x), dt * 5);
      if (!sees || dP > 120) { const [mx, my] = goDir(d, d.lx, d.ly); tx = mx; ty = my; spd = 70; } else if (dP < 70) { tx = -dx / dP; ty = -dy / dP; spd = 55; } else { tx = -dy / dP * Math.sin(d.t); ty = dx / dP * Math.sin(d.t); spd = 40; }
      d.cd -= dt; if (sees && d.cd <= 0 && d.aimT <= 0) { d.aimT = 0.4; sfx('charge', d.x, d.y); }
      if (d.aimT > 0) { d.aimT -= dt; spd *= 0.3; if (d.aimT <= 0) { d.cd = 1.1; if (sees) { enemyShot(d.x + Math.cos(d.a) * 6, d.y + Math.sin(d.a) * 6, d.a + rr(-0.05, 0.05), { wpn: 'pistol', x: d.x, y: d.y }); sfx('epistol', d.x, d.y); } } }
    }
    d.vx = lerp(d.vx, tx * spd, Math.min(1, dt * 5)); d.vy = lerp(d.vy, ty * spd, Math.min(1, dt * 5)); slideObj(d, dt, 0);
    if (P.meleeT > 0 && dP < 28 && Math.abs(angDiff(toP + Math.PI, P.a)) < 1.2 && d.lastSwing !== G.swingId) { d.lastSwing = G.swingId; droneHit(d, 2, true); }
  }
}
function droneHit(d, n, byP) {
  d.hp -= n; sfx('tink', d.x, d.y); for (let i = 0; i < 6; i++) part(d.x, d.y, rr(-100, 100), rr(-100, 100), rr(0.1, 0.3), pick(['#ffe14d', '#fff', '#8a8f99']), 1); if (d.st === 'patrol') { d.st = 'hunt'; d.lx = G.player.x; d.ly = G.player.y; }
  if (d.hp > 0) return; d.dead = true; sfx('explode', d.x, d.y); G.shake = Math.max(G.shake, 0.35); dRot(M.decX, GFX.droneWreck, d.x, d.y, rr(0, 6.28));
  for (let i = 0; i < 18; i++) part(d.x, d.y, rr(-160, 160), rr(-160, 160), rr(0.2, 0.5), pick(['#ff7a1a', '#ffe14d', '#3a3e46', '#8a8f99']), ri(1, 2), 1);
  if (byP) addScore(300, d.x, d.y, 'DRONE DOWN', null);
}
// ---------- turrets: sweep, lock, burst ----------
function turretTick(dt) {
  const P = G.player;
  for (const t of G.turrets) {
    if (t.dead || G.turretsOff) continue; t.t += dt; const dP = Math.hypot(P.x - t.x, P.y - t.y), toP = Math.atan2(P.y - t.y, P.x - t.x);
    const sees = !P.dead && !G.god && dP < 210 && Math.abs(angDiff(toP, t.a)) < 0.6 && los(t.x, t.y, P.x, P.y) && !smokeBlocks(t.x, t.y, P.x, P.y);
    if (sees) { t.see += dt; t.a = turn(t.a, toP, dt * 2.2); } else { t.see = Math.max(0, t.see - dt); t.a = turn(t.a, t.a0 + Math.sin(t.t * 0.6) * 0.9, dt * 1.2); }
    t.cd -= dt; if (t.see > 0.45 && t.cd <= 0 && !t.burst) { t.burst = 3; t.bt = 0; t.cd = 1.5; sfx('charge', t.x, t.y); }
    if (t.burst) { t.bt -= dt; if (t.bt <= 0) { t.bt = 0.11; t.burst--; enemyShot(t.x + Math.cos(t.a) * 9, t.y + Math.sin(t.a) * 9, t.a + rr(-0.04, 0.04), { wpn: 'pistol', x: t.x, y: t.y }); sfx('epistol', t.x, t.y); } }
    if (P.meleeT > 0 && dP < 26 && Math.abs(angDiff(toP + Math.PI, P.a)) < 1.2 && t.lastSwing !== G.swingId) { t.lastSwing = G.swingId; turretHit(t, 1, true); }
  }
}
function turretHit(t, n, byP) {
  t.hp -= n; sfx('tink', t.x, t.y); for (let i = 0; i < 5; i++) part(t.x, t.y, rr(-90, 90), rr(-90, 90), rr(0.1, 0.3), pick(['#ffe14d', '#fff']), 1);
  if (t.hp > 0) return; t.dead = true; sfx('explode', t.x, t.y); G.shake = Math.max(G.shake, 0.3); for (let i = 0; i < 16; i++) part(t.x, t.y, rr(-150, 150), rr(-150, 150), rr(0.2, 0.5), pick(['#ff7a1a', '#ffe14d', '#3a3e46']), ri(1, 2), 1);
  if (byP) addScore(300, t.x, t.y, 'TURRET DOWN', null);
}
function act3Bullet(b) {
  if (b.owner === 'e') return false;
  for (const d of G.drones) if (!d.dead && segDist(d.x, d.y, b.px, b.py, b.x, b.y)[0] < 6) { b.rem = b.hung = true; droneHit(d, b.k === 'rail' || b.k === 'rifle' ? 2 : 1, true); return true; }
  for (const t of G.turrets) if (!t.dead && !G.turretsOff && segDist(t.x, t.y, b.px, b.py, b.x, b.y)[0] < 6) { b.rem = b.hung = true; turretHit(t, b.k === 'rail' || b.k === 'rifle' ? 3 : 1, true); return true; }
  return false;
}
// explosions take out drones and turrets too
function act3Explode(x, y, R) { if (!G.drones) return; for (const d of G.drones) if (!d.dead && Math.hypot(d.x - x, d.y - y) < R + 6) droneHit(d, 9, true); for (const t of G.turrets) if (!t.dead && Math.hypot(t.x - x, t.y - y) < R + 4) turretHit(t, 9, true); }
// ---------- blackouts ----------
function blackoutTick(dt) {
  const B = G.bo, def = floorDef(); if (!B) return; B.t -= dt;
  if (B.t <= 0) { B.dark = !B.dark; B.t = B.dark ? def.blackout.dark : def.blackout.light; G.night = B.dark; sfx('power'); banner(B.dark ? 'BLACKOUT' : 'POWER BACK', B.dark ? '#8a8aff' : '#ffe14d'); }
}
// ---------- Director Hale: telegraphed rail lance, then drones ----------
function hostileHale(dt) {
  const P = G.player;
  for (const e of G.ents) { if (e.t !== 'dir' || e.st === 'dead') continue;
    if (e.st !== 'alert') { e.lanceT = 3; continue; }
    e.lanceT = (e.lanceT === undefined ? 3 : e.lanceT) - dt;
    if (e.lanceT < 1 && e.lanceT + dt >= 1) { sfx('singcharge', e.x, e.y); e.lanceOn = true; }
    if (e.lanceOn && e.lanceT > 0.3) e.lanceA = Math.atan2(P.y - e.y, P.x - e.x);
    if (e.lanceOn && e.lanceT <= 0) { e.lanceOn = false; e.lanceT = e.phase2 ? 3.4 : 4.6; haleLance(e); }
    if (!e.phase2 && e.hp <= 10) { e.phase2 = true; banner('HALE CALLS IN THE DRONES', '#ff3b4e'); sfx('alarm'); const W = M.W, H = M.H; for (const [cx, cy] of [[4, 4], [W - 5, 4], [4, H - 6], [W - 5, H - 6]].slice(0, 3)) spawnDrone((cx + 0.5) * CELL, (cy + 0.5) * CELL, null, true); }
  }
}
function haleLance(e) {
  const ux = Math.cos(e.lanceA), uy = Math.sin(e.lanceA), L = 420, P = G.player; sfx('rail', e.x, e.y); G.shake = Math.max(G.shake, 0.6); G.flash = 0.15;
  for (let s = 0; s < L; s += 6) if (Math.random() < 0.5) part(e.x + ux * s, e.y + uy * s, rr(-30, 30), rr(-30, 30), rr(0.15, 0.35), pick(['#ff3b4e', '#ffb0b0', '#fff']), 1);
  G.lanceFx = { x: e.x, y: e.y, ux: ux, uy: uy, L: L, t: 0.25 }; destRail(e.x, e.y, ux, uy, L);
  if (!P.dead && segDist(P.x, P.y, e.x, e.y, e.x + ux * L, e.y + uy * L)[0] < 7) hurtPlayer(e, e.lanceA);
  for (const o of G.ents) if (o !== e && o.st !== 'dead' && o.st !== 'freed' && segDist(o.x, o.y, e.x, e.y, e.x + ux * L, e.y + uy * L)[0] < 7) killE(o, 'rail', e.lanceA, false, 'rail');
}
function act3Update(dt) { if (!G.drones) return; const def = floorDef(); if (def.fires && !G.firesLit) { G.firesLit = 1; for (const [x, y] of def.fires) G.dfx.push({ k: 'fire', x: x * CELL, y: y * CELL, t: 0, life: 9999 }); } droneTick(dt); turretTick(dt); blackoutTick(dt); hostileHale(dt); if (G.lanceFx) { G.lanceFx.t -= dt; if (G.lanceFx.t <= 0) G.lanceFx = null; } }
// ---------- drawing ----------
function drawAct3Low(x) {
  if (!G.turrets) return;
  for (const t of G.turrets) { if (!inView(t.x, t.y, 30)) continue; dRot(x, GFX.turretBase, t.x, t.y, 0); if (t.dead) { x.fillStyle = 'rgba(10,6,6,0.6)'; x.beginPath(); x.arc(t.x, t.y, 5, 0, 6.29); x.fill(); continue; }
    dRot(x, GFX.turretGun, t.x + Math.cos(t.a) * 3, t.y + Math.sin(t.a) * 3, t.a);
    if (!G.turretsOff && t.see > 0) { x.strokeStyle = `rgba(255,59,78,${0.3 + 0.4 * Math.min(1, t.see * 2)})`; x.lineWidth = 0.5; x.beginPath(); x.moveTo(t.x, t.y); let L = 0; while (L < 210 && !blockAt(t.x + Math.cos(t.a) * L, t.y + Math.sin(t.a) * L)) L += 4; x.lineTo(t.x + Math.cos(t.a) * L, t.y + Math.sin(t.a) * L); x.stroke(); }
    if (G.turretsOff) { x.fillStyle = '#3a3e46'; x.fillRect(t.x - 1, t.y - 1, 2, 2); } }
  for (const e of G.ents) if (e.t === 'dir' && e.lanceOn && e.st !== 'dead') { const k = 1 - Math.max(0, e.lanceT) / 1; x.strokeStyle = `rgba(255,59,78,${0.25 + 0.6 * k})`; x.lineWidth = 0.5 + k * 2; x.setLineDash(e.lanceT > 0.3 ? [4, 3] : []); x.beginPath(); x.moveTo(e.x, e.y); x.lineTo(e.x + Math.cos(e.lanceA) * 420, e.y + Math.sin(e.lanceA) * 420); x.stroke(); x.setLineDash([]); }
  const F = G.lanceFx; if (F) { x.strokeStyle = `rgba(255,220,220,${F.t * 4})`; x.lineWidth = 4; x.beginPath(); x.moveTo(F.x, F.y); x.lineTo(F.x + F.ux * F.L, F.y + F.uy * F.L); x.stroke(); x.strokeStyle = `rgba(255,59,78,${F.t * 3})`; x.lineWidth = 8; x.stroke(); }
}
function drawAct3High(x) {
  if (!G.drones) return;
  for (const d of G.drones) { if (d.dead || !inView(d.x, d.y, 200)) continue;
    const pts = [[d.x, d.y]]; for (let i = 0; i <= 10; i++) { const a = d.a - 0.5 + i * 0.1; let L = 0; while (L < 180 && !blockAt(d.x + Math.cos(a) * L, d.y + Math.sin(a) * L)) L += 6; pts.push([d.x + Math.cos(a) * L, d.y + Math.sin(a) * L]); }
    x.fillStyle = d.st === 'hunt' ? `rgba(255,59,78,${0.12 + 0.06 * Math.sin(G.time * 18)})` : 'rgba(255,240,200,0.10)'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts) x.lineTo(p[0], p[1]); x.closePath(); x.fill();
    if (d.aimT > 0) { x.strokeStyle = 'rgba(255,59,78,0.8)'; x.lineWidth = 0.5; x.beginPath(); x.moveTo(d.x, d.y); x.lineTo(G.player.x, G.player.y); x.stroke(); }
    x.fillStyle = 'rgba(0,0,0,0.3)'; x.beginPath(); x.ellipse(d.x + 5, d.y + 8, 6, 4, 0, 0, 6.29); x.fill();
    dRot(x, GFX.drone[(G.time * 20 | 0) % 2], d.x, d.y + Math.sin(d.t * 3) * 0.8, d.a); }
}
