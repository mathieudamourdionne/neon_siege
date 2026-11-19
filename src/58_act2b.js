// ---------- end of Act 2: security cameras, spreading fire, chandeliers, The Host ----------
Object.assign(ETYPE, { hst: { name: 'THE HOST', spd: 96, pat: 40, react: 0.3, hp: 18, armor: 1, boss: 1, strafe: 1 } });
Object.assign(CHARS, { hst: { jacket: '#3a1238', boots: '#0a0a0a', skin: SKINS[1], hair: '#d8d8dc', legs: '#1a0a1e', stripe: '#d8a830', implant: '#ff3b4e' } });
Object.assign(LOOKS, { hst: { hairStyle: 'slick', collar: '#d8a830', tie: '#c81e28' } });
Object.assign(Builder.prototype, {
  cam(x, y, a, sw) { (this.cams = this.cams || []).push({ x: x, y: y, a: a, sw: sw === undefined ? 0.6 : sw }); return this; },
  chand(x, y) { (this.chands = this.chands || []).push({ x: x, y: y }); return this; },
});
function act2bGfx() {
  if (GFX.flame) return; const fr = (k) => { const [c, x] = mkCanvas(20, 24); c.hd = 2; const g = (cx, cy, rx, ry, col) => { x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 6.29); x.fill(); };
    g(10, 15 + k, 8, 8, 'rgba(200,40,10,0.85)'); g(10 - k, 12, 6, 9 - k, '#ff6a1a'); g(10 + k * 0.5, 13, 4, 6, '#ffc030'); g(10, 15, 2.2, 3, '#fff6c0'); x.fillStyle = '#ffe14d'; x.fillRect(4 + k * 3, 3 + k, 1, 2); x.fillRect(15 - k * 2, 5, 1, 1); return c; };
  GFX.flame = [fr(0), fr(1), fr(2)];
  GFX.chand = hdc(spr(44, 44, P => { const C = 22; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, x = C + Math.cos(a) * 15, y = C + Math.sin(a) * 15; P.ln(C, C, x, y, '#140c10', 3); P.ln(C, C, x, y, '#d8a830', 1); P.d(x, y, 2.6, 2.6, '#140c10'); P.d(x, y, 1.8, 1.8, '#fff6c0'); P.p(x, y, '#fff'); }
    P.d(C, C, 10, 10, '#140c10'); P.d(C, C, 9, 9, '#c8962a'); P.d(C, C, 7, 7, '#9ee8ff'); P.d(C, C, 5, 5, '#d8f8ff'); P.d(C, C, 2.5, 2.5, '#d8a830'); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + 0.26; P.p(C + Math.cos(a) * 11.5, C + Math.sin(a) * 11.5, i % 2 ? '#bff4ff' : '#fff'); } }));
  GFX.chandWreck = hdc(spr(48, 44, P => { const C = 22; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + (i % 3) * 0.3, L = 10 + (i * 7) % 9; P.ln(C, C, C + Math.cos(a) * L, C + Math.sin(a) * L, '#140c10', 3); P.ln(C, C, C + Math.cos(a) * L, C + Math.sin(a) * L, '#a8802a', 1); }
    P.d(C, C, 8, 6, '#140c10'); P.d(C, C, 7, 5, '#8a6a2a'); for (let i = 0; i < 26; i++) { const a = i * 2.4, d = 4 + (i * 13) % 17; P.p(C + Math.cos(a) * d, C + Math.sin(a) * d, i % 3 ? '#9ee8ff' : '#fff'); } }));
  GFX.camBody = hdc(spr(12, 10, P => { P.r(0, 1, 9, 8, '#140c10'); P.r(1, 2, 7, 6, '#4a4e58'); P.r(1, 2, 7, 1, '#8a8f99'); P.r(8, 3, 4, 4, '#140c10'); P.r(9, 4, 2, 2, '#ff3b4e'); }));
}
// ---------- per floor ----------
function act2bInit(def) {
  const b = M.b; G.cams = (b.cams || []).map(c => ({ x: (c.x + 0.5) * CELL, y: (c.y + 0.5) * CELL, a0: c.a, sw: c.sw, a: c.a, t: Math.random() * 6, see: 0, cd: 0, dead: false }));
  G.chands = (b.chands || []).map(c => ({ x: (c.x + 0.5) * CELL, y: (c.y + 0.5) * CELL, st: 'hang', t: 0, ph: Math.random() * 6 }));
  G.blaze = null; if (def.blaze) { G.blaze = { on: new Map(), out: new Float32Array(M.W * M.H), tick: 0, smokeT: 0 }; for (const [x, y] of def.blaze.seeds) blazeLight(y * M.W + x); }
  if (G.cams.length || G.chands.length || G.blaze) act2bGfx();
  G.player.burnT = 0;
}
// ---------- fire that spreads room to room ----------
function blazeOk(c) { return c >= 0 && c < M.W * M.H && M.fl[c] && !M.wall[c] && !(M.solid[c] && M.tall[c]); }
function blazeLight(c) { const B = G.blaze; if (!B || B.on.has(c) || !blazeOk(c) || B.out[c] > G.levelTime) return; B.on.set(c, 0); }
function blazeTick(dt) {
  const B = G.blaze, def = floorDef(); if (!B) return; const W = M.W, life = def.blaze.life || 14, P = G.player;
  B.tick -= dt; if (B.tick <= 0) { B.tick = def.blaze.every || 0.5; const add = [];
    for (const [c, t] of B.on) { if (Math.random() < (def.blaze.chance || 0.2) && B.on.size + add.length < (def.blaze.max || 220)) { const n = c + pick([1, -1, W, -W]); if (blazeOk(n) && !B.on.has(n) && !(B.out[n] > G.levelTime)) add.push(n); } }
    for (const n of add) blazeLight(n); }
  for (const [c, t] of B.on) { const nt = t + dt; if (nt > life) { B.on.delete(c); B.out[c] = G.levelTime + 40; const d = M.decX; d.fillStyle = 'rgba(14,8,6,0.55)'; d.fillRect((c % W) * CELL, ((c / W) | 0) * CELL, CELL, CELL); } else B.on.set(c, nt); }
  // fire kills whoever stands in it (the cleaners wear fire suits)
  const at = (x, y) => B.on.has(Math.floor(y / CELL) * W + Math.floor(x / CELL));
  for (const e of G.ents) if (e.st !== 'dead' && e.st !== 'freed' && e.t !== 'cln' && !ETYPE[e.t].boss && at(e.x, e.y)) killE(e, 'shot', rr(0, 6.28), false, 'flare');
  if (!P.dead && at(P.x, P.y) && def.fireHurts) { P.burnT += dt; if (P.burnT > 0.25) { P.burnT = 0; if (hurtPlayer(null, rr(0, 6.28))) toast('BURNED. STAY OUT OF THE FLAMES.'); } } else P.burnT = 0;
  // smoke rolls off the fire and hides you from the guards
  B.smokeT -= dt; if (B.smokeT <= 0 && B.on.size) { B.smokeT = 1.6; if (G.smoke.filter(s => s.fire).length < 6) { const keys = [...B.on.keys()], c = keys[ri(0, keys.length - 1)]; G.smoke.push({ x: (c % W + 0.5) * CELL, y: ((c / W | 0) + 0.5) * CELL, r: 3, t: 0, life: 6, seed: Math.random() * 99, fire: 1 }); } }
  if (B.on.size && Math.random() < dt * 3) sfx('burn', P.x + rr(-60, 60), P.y + rr(-60, 60));
}
// ---------- security cameras ----------
function camTick(dt) {
  const P = G.player;
  for (const c of G.cams) {
    if (c.dead) continue; c.t += dt; c.cd -= dt;
    const d = Math.hypot(P.x - c.x, P.y - c.y), toP = Math.atan2(P.y - c.y, P.x - c.x);
    const seen = !P.dead && !G.god && d < 150 && Math.abs(angDiff(toP, c.a)) < 0.42 && los(c.x, c.y, P.x, P.y) && !smokeBlocks(c.x, c.y, P.x, P.y);
    if (seen) { c.see += dt; c.a = turn(c.a, toP, dt * 3); } else { c.see = Math.max(0, c.see - dt * 0.6); c.a = turn(c.a, c.a0 + Math.sin(c.t * 0.7) * c.sw, dt * 1.5); }
    if (c.see > 0.6 && c.cd <= 0) { c.cd = 9; c.see = 0; sfx('alarm'); banner('CAMERA ALARM', '#ff3b4e'); makeNoise(P.x, P.y, 9999); if (M.b.sps.length) spawnWave([['grd', 'smg'], ['grd', 'pistol']]); }
    // shot or smashed
    if (!c.dead && P.meleeT > 0 && d < 30 && Math.abs(angDiff(toP + Math.PI, P.a)) < 1.2) camBreak(c, true);
  }
}
// a bullet's path this frame (checked before it's removed, so shots that end in the wall behind still count)
function bulletHang(b) {
  if (b.hung || act3Bullet(b)) return;
  for (const c of G.cams) if (!c.dead && segDist(c.x, c.y, b.px, b.py, b.x, b.y)[0] < 5) { b.rem = b.hung = true; camBreak(c, b.owner !== 'e'); return; }
  for (const c of G.chands) if (c.st === 'hang' && segDist(c.x, c.y, b.px, b.py, b.x, b.y)[0] < 7) { b.rem = b.hung = true; c.st = 'fall'; c.t = 0; c.byP = b.owner !== 'e'; sfx('clunk', c.x, c.y); for (let i = 0; i < 6; i++) part(c.x, c.y, rr(-60, 60), rr(-60, 60), 0.3, '#ffe14d', 1); return; }
}
function camBreak(c, byP) { c.dead = true; sfx('glass', c.x, c.y); for (let i = 0; i < 12; i++) part(c.x, c.y, rr(-120, 120), rr(-120, 120), rr(0.2, 0.4), pick(['#ffe14d', '#fff', '#8a8f99']), 1, 1); if (byP) addScore(100, c.x, c.y, 'CAMERA', null); }
// ---------- chandeliers: shoot one down onto whoever is under it ----------
function chandTick(dt) {
  for (const c of G.chands) {
    if (c.st === 'fall') { c.t += dt; if (c.t >= 0.4) chandCrash(c); }
  }
}
function chandCrash(c) {
  c.st = 'down'; sfx('glass', c.x, c.y); sfx('thud', c.x, c.y); G.shake = Math.max(G.shake, 0.5); dRot(M.decX, GFX.chandWreck, c.x, c.y, c.ph);
  for (let i = 0; i < 30; i++) part(c.x, c.y, rr(-200, 200), rr(-200, 200), rr(0.2, 0.5), pick(['#9ee8ff', '#fff', '#d8a830', '#bff4ff']), ri(1, 2), 1);
  let n = 0; for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || Math.hypot(e.x - c.x, e.y - c.y) > 18) continue; if (ETYPE[e.t].boss) { e.hp -= 6; e.hitT = 0.2; if (e.hp <= 0) killE(e, 'hit', rr(0, 6.28), c.byP, 'chandelier'); } else { killE(e, 'hit', Math.atan2(e.y - c.y, e.x - c.x), c.byP, 'chandelier'); n++; } }
  if (n && c.byP) addScore(400 * n, c.x, c.y - 12, n > 1 ? 'CHANDELIER x' + n : 'CHANDELIER', null);
  const P = G.player; if (!P.dead && Math.hypot(P.x - c.x, P.y - c.y) < 12) hurtPlayer(null, Math.atan2(P.y - c.y, P.x - c.x));
}
// ---------- The Host ----------
function hostTick(dt) {
  for (const e of G.ents) { if (e.t !== 'hst' || e.st === 'dead') continue;
    if (!e.phase2 && e.hp <= 9) { e.phase2 = true; banner('THE HOST CALLS HIS CLEANERS', '#ff3b4e'); sfx('alarm'); G.smoke.push({ x: e.x, y: e.y, r: 5, t: 0, life: 6, seed: Math.random() * 99 }); spawnWave([['cln', 'smg'], ['cln', 'smart'], ['cln', 'pistol']]); e.wpn = e.w0 = 'ar'; toast('HE SWITCHED TO A RIFLE. KEEP MOVING.'); } }
}
function act2bUpdate(dt) { if (!G.cams) return; camTick(dt); chandTick(dt); blazeTick(dt); hostTick(dt); }
// ---------- drawing ----------
function drawAct2bLow(x) {
  if (!G.cams) return;
  for (const c of G.cams) { if (c.dead) { dRot(x, GFX.camBody, c.x, c.y, c.a); continue; }
    if (!inView(c.x, c.y, 160)) continue; const pts = [[c.x, c.y]]; for (let i = 0; i <= 12; i++) { const a = c.a - 0.42 + i * 0.07; let L = 0; while (L < 150 && !blockAt(c.x + Math.cos(a) * L, c.y + Math.sin(a) * L)) L += 5; pts.push([c.x + Math.cos(a) * L, c.y + Math.sin(a) * L]); }
    const hot = c.see > 0 || c.cd > 7; x.fillStyle = hot ? `rgba(255,59,78,${0.16 + 0.1 * Math.sin(G.time * 20)})` : 'rgba(255,225,77,0.09)'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts) x.lineTo(p[0], p[1]); x.closePath(); x.fill();
    dRot(x, GFX.camBody, c.x, c.y, c.a); if ((G.time * 2 | 0) % 2) { x.fillStyle = hot ? '#ff3b4e' : '#5dff9a'; x.fillRect(c.x - 0.5, c.y - 3, 1, 1); } }
  if (G.blaze) { const W = M.W, k = (G.time * 10 | 0); x.globalCompositeOperation = 'lighter'; for (const [c] of G.blaze.on) { const X = (c % W) * CELL + 4, Y = ((c / W) | 0) * CELL + 4; if (!inView(X, Y, 20)) continue; x.fillStyle = 'rgba(255,110,30,0.10)'; x.fillRect(X - 9, Y - 9, 18, 18); } x.globalCompositeOperation = 'source-over';
    for (const [c, t] of G.blaze.on) { const X = (c % W) * CELL + 4, Y = ((c / W) | 0) * CELL + 4; if (!inView(X, Y, 20)) continue; dRot(x, GFX.flame[(k + c) % 3], X, Y - 2, 0); } }
}
function drawAct2bHigh(x) {
  if (!G.chands) return;
  for (const c of G.chands) { if (c.st === 'down' || !inView(c.x, c.y, 40)) continue; const k = c.st === 'fall' ? c.t / 0.4 : 0, s = 1.35 - k * 0.35, sway = Math.sin(G.time * 0.9 + c.ph) * 0.06;
    x.fillStyle = `rgba(0,0,0,${0.18 + k * 0.25})`; x.beginPath(); x.ellipse(c.x + 4 * (1 - k), c.y + 6 * (1 - k), 9 * (0.7 + k * 0.3), 7 * (0.7 + k * 0.3), 0, 0, 6.29); x.fill();
    x.save(); x.translate(c.x, c.y); x.scale(s, s); dRot(x, GFX.chand, 0, 0, c.ph + sway); x.restore();
    if (c.st === 'hang') { x.globalCompositeOperation = 'lighter'; x.fillStyle = 'rgba(255,230,160,0.06)'; x.beginPath(); x.arc(c.x, c.y, 34, 0, 6.29); x.fill(); x.globalCompositeOperation = 'source-over'; } }
}
