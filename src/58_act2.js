// ---------- Act 2 mechanics: riot shields, ghost hounds, field technicians, storm, night + birds, disguise among gala guests ----------
Object.assign(ETYPE, {
  rio: { name: 'RIOT UNIT', spd: 74, pat: 34, react: 0.55, shield: 1 },
  ghd: { name: 'GHOST HOUND', spd: 180, pat: 60, react: 0.12, dog: 1, camo: 1 },
  hdl: { name: 'THE HANDLER', spd: 104, pat: 40, react: 0.3, hp: 8, armor: 1, boss: 1, strafe: 1 },
  tec: { name: 'FIELD TECHNICIAN', spd: 104, pat: 40, react: 0.45, tech: 1 },
});
// a riot shield faces where its owner faces: hits from the front bounce off
function shieldBlocks(e, fx, fy) { return ETYPE[e.t].shield && e.st !== 'down' && e.st !== 'dead' && Math.abs(angDiff(Math.atan2(fy - e.y, fx - e.x), e.a)) < 1.15; }
function shieldSpark(e, x, y) { sfx('tink', x, y); for (let i = 0; i < 6; i++) part(x, y, rr(-120, 120), rr(-120, 120), rr(0.08, 0.2), pick(['#fff', '#cfe', '#ffe14d']), 1); if (!e.blkT || G.time - e.blkT > 0.8) { e.blkT = G.time; pop(e.x, e.y - 10, 'BLOCKED', '#8ab4d8'); } }
// riot unit: shield up, walk you down, shoot over the shield, bash when close
function riotAI(e, dt, P, dP, toP, W) {
  const T = ETYPE[e.t]; let mvx = 0, mvy = 0, spd = 0;
  if (e.sees) {
    e.a = turn(e.a, toP, dt * 5); e.react -= dt;
    if (dP > 42) { mvx = (P.x - e.x) / dP; mvy = (P.y - e.y) / dP; spd = T.spd; }
    if (e.wind > 0) { e.wind -= dt; spd = 0; if (e.wind <= 0) { meleeHits(e, null, false); sfx('thud', e.x, e.y); e.cd = 1.0; e.alt = !e.alt; e.atk = { k: e.alt ? 'pR' : 'pL', t: 0, d: 0.15 }; } }
    else if (dP < 24 && e.cd <= 0) { e.wind = 0.32; e.atk = { k: 'wind', t: 0, d: 0.32 }; }
    else if (W && !W.melee && e.react <= 0 && e.cd <= 0 && Math.abs(angDiff(toP, e.a)) < 0.25) attack(e, false);
  } else { [mvx, mvy] = huntDir(e); spd = e.st === 'alert' ? T.spd : 0; e.a = turn(e.a, Math.atan2(mvy, mvx), dt * 6); e.react = Math.max(e.react, 0.3); }
  return [mvx, mvy, spd];
}
// field technician: runs to fresh bodies and patches them back up
function techAI(e, dt) {
  if (e.revT > 0 && e.revC && G.corpses.includes(e.revC)) {
    e.revT += dt; e.vx *= 0.7; e.vy *= 0.7; const c = e.revC;
    if (Math.random() < dt * 20) part(c.x + rr(-5, 5), c.y + rr(-5, 5), rr(-20, 20), rr(-50, -10), rr(0.2, 0.4), pick(['#3f8', '#bfb', '#fff']), 1);
    if (e.revT >= 1.6) {
      G.corpses.splice(G.corpses.indexOf(c), 1); const n = spawnEnemy(c.rev.t, c.x, c.y, c.rev.w, rr(0, 6.28)); n.st = 'alert'; n.react = 0.7; n.lx = G.player.x; n.ly = G.player.y;
      sfx('power', c.x, c.y); pop(c.x, c.y - 8, 'REVIVED', '#3f8'); G.cleared = false; e.revT = 0; e.revC = null; e.cd = 0.8;
    }
    return true;
  }
  e.revT = 0;
  if (!e.revC || !G.corpses.includes(e.revC) || e.revC.claimed !== e) {
    let best = null, bd = 260; for (const c of G.corpses) { if (!c.rev || (c.claimed && c.claimed !== e && c.claimed.st !== 'dead')) continue; const d = Math.hypot(c.x - e.x, c.y - e.y); if (d < bd) { bd = d; best = c; } }
    if (e.revC && e.revC !== best && e.revC.claimed === e) e.revC.claimed = null; e.revC = best; if (best) best.claimed = e;
  }
  const c = e.revC; if (!c) return false;
  const d = Math.hypot(c.x - e.x, c.y - e.y); if (d < 9) { e.revT = 0.001; sfx('charge', e.x, e.y); return true; }
  const [mx, my] = pathTo(e, c); e.a = turn(e.a, Math.atan2(my, mx), dt * 9); const k = Math.min(1, dt * 12); e.vx = lerp(e.vx, mx * ETYPE.tec.spd, k); e.vy = lerp(e.vy, my * ETYPE.tec.spd, k); moveEnt(e, e.vx * dt, e.vy * dt); e.legT += dt * ETYPE.tec.spd / 9; e.st = 'alert';
  return true;
}
// ---------- night: lamps light the way; in the dark, guards only see what their flashlight hits ----------
function playerLit() { const P = G.player; for (const l of M.b.lamps || []) if (Math.hypot(P.x - l[0], P.y - l[1]) < l[2]) return true; return G.muzzle > 0; }
function nightSees(e, dP, toP) { const lit = playerLit(), T = ETYPE[e.t]; if (dP < 34) return true; if (T.dog) return dP < 90; return lit ? dP < (T.sight || 280) && (e.st === 'alert' || Math.abs(angDiff(toP, e.a)) < 1.15) : dP < 118 && Math.abs(angDiff(toP, e.a)) < 0.5; }
function drawNight(x) {
  if (!R.nc || R.nc.width !== VW) { [R.nc, R.ncx] = mkCanvas(VW, VH); } const n = R.ncx, X = R.xf, c = Math.cos(X.rot), s = Math.sin(X.rot);
  const v = (wx, wy) => { const dx = (wx - X.x) * X.zoom, dy = (wy - X.y) * X.zoom; return [VW / 2 + dx * c - dy * s, VH / 2 + dx * s + dy * c]; };
  n.globalCompositeOperation = 'source-over'; n.fillStyle = 'rgba(4,6,18,0.86)'; n.fillRect(0, 0, VW, VH); n.globalCompositeOperation = 'destination-out';
  const hole = (wx, wy, r, a) => { const [px, py] = v(wx, wy), R0 = r * X.zoom, g = n.createRadialGradient(px, py, 0, px, py, R0); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(0.6, `rgba(0,0,0,${a * 0.7})`); g.addColorStop(1, 'rgba(0,0,0,0)'); n.fillStyle = g; n.beginPath(); n.arc(px, py, R0, 0, 6.29); n.fill(); };
  const P = G.player; hole(P.x, P.y, 70, 0.75);
  for (const l of M.b.lamps || []) hole(l[0], l[1], l[2], 1);
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || ETYPE[e.t].dog) continue; const [px, py] = v(e.x, e.y), R0 = (e.st === 'down' ? 30 : 118) * X.zoom, a = e.a + X.rot, g = n.createRadialGradient(px, py, 0, px, py, R0); g.addColorStop(0, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); n.fillStyle = g; n.beginPath(); n.moveTo(px, py); n.arc(px, py, R0, a - 0.5, a + 0.5); n.closePath(); n.fill(); }
  for (const f of G.fx) if (f.k === 'boom') hole(f.x, f.y, f.r * 2, 1 - f.t / f.d);
  if (G.muzzle > 0 || P.flashT > 0) hole(P.x, P.y, 110, 0.8); if (G.lightT && G.lightT > 0) hole(P.x, P.y, 400, G.lightT);
  x.drawImage(R.nc, 0, 0);
  // lamp halos
  x.globalCompositeOperation = 'lighter'; for (const l of M.b.lamps || []) { const [px, py] = v(l[0], l[1]), g = x.createRadialGradient(px, py, 0, px, py, l[2] * X.zoom); g.addColorStop(0, 'rgba(255,220,140,0.18)'); g.addColorStop(1, 'rgba(255,220,140,0)'); x.fillStyle = g; x.beginPath(); x.arc(px, py, l[2] * X.zoom, 0, 6.29); x.fill(); } x.globalCompositeOperation = 'source-over';
}
// ---------- birds: running past them scares them up, and the noise carries ----------
function updBirds(dt) {
  const P = G.player, sp = Math.hypot(P.vx, P.vy);
  for (const b of G.birds) {
    if (b.st === 'sit') { b.hop -= dt; if (b.hop <= 0) { b.hop = rr(0.5, 2.5); b.a = rr(0, 6.28); } if (!P.dead && Math.hypot(P.x - b.x, P.y - b.y) < (sp > 60 ? 42 : 16)) scareFlock(b); }
    else { b.t += dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vy -= 30 * dt; }
  }
  G.birds = G.birds.filter(b => b.st === 'sit' || b.t < 1.6);
}
function scareFlock(b0) { let n = 0; for (const b of G.birds) if (b.st === 'sit' && Math.hypot(b.x - b0.x, b.y - b0.y) < 40) { const a = Math.atan2(b.y - G.player.y, b.x - G.player.x) + rr(-0.6, 0.6), s = rr(110, 190); b.st = 'fly'; b.t = 0; b.vx = Math.cos(a) * s; b.vy = Math.sin(a) * s; n++; } if (n) { sfx('coo', b0.x, b0.y); makeNoise(b0.x, b0.y, 130); } }
function drawBirds(x) { for (const b of G.birds) { const al = b.st === 'fly' ? Math.max(0, 1 - b.t / 1.6) : 1; x.globalAlpha = al; x.fillStyle = '#2a2a32'; const fx = Math.round(b.x), fy = Math.round(b.y); if (b.st === 'sit') { x.fillRect(fx - 1, fy - 1, 3, 2); x.fillStyle = '#4a4a54'; x.fillRect(fx + Math.round(Math.cos(b.a) * 2), fy + Math.round(Math.sin(b.a) * 2) - 1, 1, 1); } else { const f = (G.time * 16 | 0) % 2; x.fillRect(fx - 1, fy, 3, 1); x.fillRect(fx - 3, fy - f * 2, 2, 1); x.fillRect(fx + 2, fy - f * 2, 2, 1); } } x.globalAlpha = 1; }
// ---------- storm: rain, lightning, a rolling deck ----------
function updStorm(dt) { G.lightT = Math.max(0, (G.lightT || 0) - dt * 2.5); G.nextLight = (G.nextLight === undefined ? rr(3, 6) : G.nextLight) - dt; if (G.nextLight <= 0) { G.nextLight = rr(4, 9); G.lightT = 0.9; sfx('thunder'); } }
function drawStorm(x) {
  if (!R.rain) R.rain = Array.from({ length: 140 }, () => [rr(0, 700), rr(0, 300), rr(0.6, 1)]);
  x.strokeStyle = 'rgba(170,200,255,0.35)'; x.lineWidth = 1; x.beginPath();
  for (const d of R.rain) { d[0] -= 90 * d[2] / 60; d[1] += 420 * d[2] / 60; if (d[1] > VH) { d[1] = -10; d[0] = rr(0, VW + 60); } x.moveTo(d[0], d[1]); x.lineTo(d[0] - 3 * d[2], d[1] + 9 * d[2]); } x.stroke();
  x.fillStyle = 'rgba(20,30,70,0.18)'; x.fillRect(0, 0, VW, VH);
  if (G.lightT > 0) { x.fillStyle = `rgba(220,230,255,${0.55 * G.lightT})`; x.fillRect(0, 0, VW, VH); }
}
// ---------- disguise: in a staff uniform nobody looks twice - until you do something they can see ----------
function enemyCanSee(o) { const P = G.player; if (o.st === 'dead' || o.st === 'down' || o.st === 'freed' || ETYPE[o.t].dog) return false; const d = Math.hypot(P.x - o.x, P.y - o.y), a = Math.atan2(P.y - o.y, P.x - o.x); return d < 260 && (d < 40 || Math.abs(angDiff(a, o.a)) < 1.2) && los(o.x, o.y, P.x, P.y); }
function coverCheck(victim) { if (!G.disguise) return; for (const o of G.ents) if (o !== victim && enemyCanSee(o)) { blowCover(); return; } }
function blowCover() {
  if (!G.disguise) return; G.disguise = false; banner('COVER BLOWN', '#ff2a8a'); sfx('alarm'); const P = G.player; makeNoise(P.x, P.y, 9999);
  for (const c of G.civs) if (c.st === 'guest') { c.st = 'run'; c.t0 = rr(0, 0.4); c.vx = c.vy = 0; c.r = 3; c.sx = c.x; c.sy = c.y; }
}
function inRestricted(x, y) { for (const z of M.b.restrict || []) if (x > z[0] * CELL && x < (z[0] + z[2]) * CELL && y > z[1] * CELL && y < (z[1] + z[3]) * CELL) return true; return false; }
function updDisguise(dt) {
  if (!G.disguise) return; const P = G.player, inR = inRestricted(P.x, P.y);
  for (const e of G.ents) { if (!inR || !enemyCanSee(e)) { e.sus = Math.max(0, (e.sus || 0) - dt * 0.6); continue; } e.sus = (e.sus || 0) + dt * 1.4; e.a = turn(e.a, Math.atan2(P.y - e.y, P.x - e.x), dt * 4); if (e.sus >= 1) { blowCover(); return; } }
}
function updGuests(dt) {
  for (const c of G.civs) {
    if (c.st !== 'guest') continue; c.wait -= dt;
    if (c.wait <= 0 && !c.walk) { for (let k = 0; k < 6; k++) { const tx = c.hx + rr(-36, 36), ty = c.hy + rr(-28, 28); if (!solidAt(tx, ty) && los(c.x, c.y, tx, ty)) { c.tx = tx; c.ty = ty; c.walk = true; break; } } if (!c.walk) c.wait = rr(1, 2); }
    if (c.walk) { const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy); if (d < 2) { c.walk = false; c.wait = rr(1.5, 4); } else { c.a = turn(c.a, Math.atan2(dy, dx), dt * 6); c.x += Math.cos(c.a) * 26 * dt; c.y += Math.sin(c.a) * 26 * dt; c.legT = (c.legT || 0) + dt * 3; } }
  }
}
function drawDisguise(x) {
  for (const z of M.b.restrict || []) { x.fillStyle = 'rgba(255,40,80,0.10)'; x.fillRect(z[0] * CELL, z[1] * CELL, z[2] * CELL, z[3] * CELL); x.strokeStyle = 'rgba(255,40,80,0.45)'; x.lineWidth = 1; x.setLineDash([3, 3]); x.strokeRect(z[0] * CELL + 0.5, z[1] * CELL + 0.5, z[2] * CELL - 1, z[3] * CELL - 1); x.setLineDash([]); }
  if (G.disguise) for (const e of G.ents) if (e.sus > 0.05) { x.fillStyle = e.sus > 0.6 ? '#ff2a8a' : '#ffe14d'; x.fillRect(Math.round(e.x) - 1, Math.round(e.y) - 15, 2, 5); x.fillRect(Math.round(e.x) - 1, Math.round(e.y) - 9, 2, 2); x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(Math.round(e.x) - 6, Math.round(e.y) - 18, 12, 2); x.fillStyle = '#ff2a8a'; x.fillRect(Math.round(e.x) - 6, Math.round(e.y) - 18, Math.round(12 * Math.min(1, e.sus)), 2); }
}
function drawGuests(x) { for (const c of G.civs) { if (c.st !== 'guest') continue; const wf = c.walk ? Math.floor(c.legT * 2) & 7 : 8; dRot(x, GFX.ch[c.t].legs[wf], c.x, c.y, c.a); dRot(x, bodyFrame(c.t, null, 'walk', c.walk ? wf : 0), c.x, c.y, c.a); } }
