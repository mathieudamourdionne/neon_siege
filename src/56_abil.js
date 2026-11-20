// ---------- implant abilities: dash, reflex boost (big slow-mo), neural spike (hack an enemy) ----------
function ability() {
  const P = G.player; if (P.dead || P.reviveT > 0) return; if (gearAbility()) return;
  if (G.implant === 'dash' && P.dashCd <= 0 && !P.mount) {
    let mx = IN.mx, my = IN.my; if (Math.hypot(mx, my) < 0.2) { mx = Math.cos(P.a); my = Math.sin(P.a); } const l = Math.hypot(mx, my);
    P.vx = mx / l * 380; P.vy = my / l * 380; P.dashT = 0.15; P.dashCd = 0.7; sfx('dash');
    for (let i = 0; i < 6; i++) part(P.x, P.y, -P.vx * rr(0.1, 0.3) + rr(-40, 40), -P.vy * rr(0.1, 0.3) + rr(-40, 40), rr(0.15, 0.3), pick(['#9aa', '#cdd', '#4ff']), 1);
  }
  if (G.implant === 'blades') { bladeLeap(); return; }
  if (G.implant === 'reflex') { if (P.sandUsed) { sfx('noway'); toast('REFLEX BOOST IS SPENT ON THIS FLOOR'); return; } sandStart(); }
  if (G.implant === 'spike') { if (P.spikeUsed) { sfx('noway'); toast('NEURAL SPIKE IS SPENT ON THIS FLOOR'); return; } spikeFire(); }
}
// ---------- reflex boost: the world drops to 20% speed for 5 seconds, you don't ----------
const SAND_T = 5;
function sandStart() { const P = G.player; P.sandUsed = true; G.slowT = SAND_T; G.sandBeat = 0.3; G.sandGhost = 0; sfx('emp'); sfx('charge'); G.flash = 0.3; G.shake = Math.max(G.shake, 0.3); G.fx.push({ k: 'ring', x: P.x, y: P.y, t: 0, d: 0.55, real: 1 }); }
function sandEnd() { const P = G.player; sfx('streak'); sfx('dash'); G.flash = 0.25; G.shake = Math.max(G.shake, 0.3); G.fx.push({ k: 'ring', x: P.x, y: P.y, t: 0, d: 0.3, real: 1, inv: 1 }); }
function sandTick(dt) {
  if (!(G.slowT > 0)) return; G.slowT -= dt; G.sandBeat -= dt; if (G.sandBeat <= 0) { G.sandBeat = 0.5; sfx('thud', G.player.x, G.player.y); }
  if (G.slowT <= 0) { G.slowT = 0; sandEnd(); }
}
// ---------- neural spike: hack the enemy nearest your cursor for 6 seconds ----------
function spikeTarget() {
  const P = G.player; let best = null, bs = 1e9;
  for (const e of G.ents) {
    if (e.st === 'dead' || e.st === 'down' || e.st === 'freed' || e.hacked > 0 || ETYPE[e.t].boss) continue; const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > 260 || !los(P.x, P.y, e.x, e.y)) continue;
    const dc = Math.hypot(e.x - IN.ax, e.y - IN.ay), da = Math.abs(angDiff(Math.atan2(e.y - P.y, e.x - P.x), P.a)); if (dc > 40 && da > 0.35) continue;
    const sc = Math.min(dc, da * 100) + d * 0.05; if (sc < bs) { bs = sc; best = e; }
  }
  return best;
}
function spikeFire() {
  const P = G.player, e = spikeTarget();
  if (!e) { sfx('noway'); toast('AIM AT AN ENEMY YOU CAN SEE, THEN PRESS F'); return; }
  P.spikeUsed = true; sfx('hack', e.x, e.y); sfx('zap', e.x, e.y); G.fx.push({ k: 'link', x0: P.x, y0: P.y, e: e, t: 0, d: 0.35, real: 1 }); G.flash = 0.1;
  for (let i = 0; i < 12; i++) part(e.x, e.y, rr(-90, 90), rr(-90, 90), rr(0.2, 0.4), pick(['#ff3bd8', '#ffd0f4', '#fff']), 1);
  e.hacked = 6; e.hackHp = 2; e.st = 'alert'; e.hold = 0; e.wind = 0; e.goItem = null; e.aimT = 0; e.cd = 0.15; G.hackedE = e; if (P.lock === e) P.lock = null;
  e.tg = nearestFoe(e); if (e.tg) e.a = Math.atan2(e.tg.y - e.y, e.tg.x - e.x);
  // the hack's feedback burst scrambles everyone close by for a moment
  for (const o of G.ents) if (o !== e && o.st !== 'dead' && o.st !== 'down' && o.st !== 'freed' && !ETYPE[o.t].boss && Math.hypot(o.x - e.x, o.y - e.y) < 140) { o.dazeT = 0.8; o.wind = 0; }
  G.fx.push({ k: 'ring', x: e.x, y: e.y, t: 0, d: 0.35, real: 1, pink: 1 });
  pop(e.x, e.y - 10, 'HACKED', '#ff3bd8');
}
function nearestFoe(e) { let best = null, bs = 1e9; for (const t of G.ents) { if (t === e || t.st === 'dead' || t.st === 'down' || t.st === 'freed' || t.hacked > 0) continue; const d = Math.hypot(t.x - e.x, t.y - e.y) + (los(e.x, e.y, t.x, t.y) ? 0 : 220); if (d < bs) { bs = d; best = t; } } return best; }
function updHacked(e, dt) {
  e.hacked -= dt; if (Math.random() < dt * 14) part(e.x + rr(-5, 5), e.y + rr(-5, 5), rr(-30, 30), rr(-60, -10), 0.3, pick(['#ff3bd8', '#ffd0f4', '#b02a9a']), 1);
  if (e.hacked <= 0) { e.hacked = 0; G.hackedE = null; sfx('emp', e.x, e.y); killE(e, 'burn', e.a, true, 'spike'); return; }
  if (!e.tg || e.tg.st === 'dead' || e.tg.st === 'down' || e.tg.st === 'freed' || (e.tgT = (e.tgT || 0) - dt) <= 0) { e.tgT = 0.4; e.tg = nearestFoe(e); }
  if (e.tg) fightTarget(e, e.tg, dt); else { e.vx *= 0.8; e.vy *= 0.8; }
}
// walk toward a moving target using a flow field of its own (hacked enemies and the ones fighting them)
function pathTo(e, t) {
  const c = Math.floor(t.y / CELL) * M.W + Math.floor(t.x / CELL);
  if (!e.pf || e.pfC !== c) { e.pf = flowFrom(t.x, t.y, e.pf); e.pfC = c; }
  return flowStep(e, e.pf, t);
}
// one enemy fighting another (the hacked one, or someone attacking the hacked one)
function fightTarget(e, tg, dt) {
  const T = ETYPE[e.t], W = e.wpn && WEAPONS[e.wpn], dx = tg.x - e.x, dy = tg.y - e.y, d = Math.hypot(dx, dy) || 1, to = Math.atan2(dy, dx), see = los(e.x, e.y, tg.x, tg.y);
  let mvx = 0, mvy = 0, spd = 0; e.st = 'alert';
  if (W && !W.melee) {
    if (see) { e.a = turn(e.a, to, dt * 10); if (e.cd <= 0 && Math.abs(angDiff(to, e.a)) < 0.2) { attack(e, false); e.cd = Math.max(e.cd, W.cd * (e.hacked > 0 ? 1 : 1.5)); } if (d > 120) { mvx = dx / d; mvy = dy / d; spd = T.spd * 0.5; } }
    else { [mvx, mvy] = pathTo(e, tg); spd = T.spd; e.a = turn(e.a, Math.atan2(mvy, mvx), dt * 8); }
  } else {
    const reach = (W ? W.reach : 13) + tg.r;
    if (see && d < 60) { mvx = dx / d; mvy = dy / d; } else [mvx, mvy] = pathTo(e, tg);
    spd = T.spd; e.a = turn(e.a, see ? to : Math.atan2(mvy, mvx), dt * 11);
    if (e.wind > 0) { e.wind -= dt; spd *= 0.3; if (e.wind <= 0) { meleeTeam(e, W, tg); e.cd = (W ? W.cd : 0.45) * 1.5; } }
    else if (see && d < reach + 3 && e.cd <= 0 && Math.abs(angDiff(to, e.a)) < 0.7) { e.wind = 0.14; e.atk = { k: 'wind', t: 0, d: 0.14 }; }
    if (d < 8) spd = 0;
  }
  const k = Math.min(1, dt * 12); e.vx = lerp(e.vx, mvx * spd, k); e.vy = lerp(e.vy, mvy * spd, k); moveEnt(e, e.vx * dt, e.vy * dt); if (spd > 1) e.legT += dt * spd / 9;
}
function meleeTeam(e, W, tg) {
  const T = ETYPE[e.t]; sfx(W ? (e.wpn === 'saw' ? 'saw' : 'swish') : 'swish', e.x, e.y); e.alt = !e.alt;
  e.atk = W ? { k: e.alt ? 'sF' : 'sB', t: 0, d: 0.16 } : { k: e.alt ? 'pR' : 'pL', t: 0, d: 0.15 };
  if (tg.st === 'dead' || tg.st === 'down' || tg.st === 'freed') return;
  const d = Math.hypot(tg.x - e.x, tg.y - e.y) - tg.r, ang = Math.atan2(tg.y - e.y, tg.x - e.x), reach = W ? W.reach : 15;
  if (d > reach + 2 || !los(e.x, e.y, tg.x, tg.y)) return;
  const byP = e.hacked > 0, how = byP ? 'puppet' : (e.wpn || 'fists');
  G.fx.push({ k: 'hit', x: tg.x - Math.cos(ang) * tg.r, y: tg.y - Math.sin(ang) * tg.r, a: ang, t: 0, d: 0.12 });
  if (tg.hacked > 0 && tg.hackHp > 0) { tg.hackHp--; tg.hitT = 0.12; tg.vx += Math.cos(ang) * 120; tg.vy += Math.sin(ang) * 120; splat(tg.x, tg.y, ang, 4); return; }
  if (ETYPE[tg.t].boss) { tg.hp -= 2; tg.hitT = 0.1; if (tg.hp <= 0) killE(tg, 'hit', ang, byP, how); return; }
  if (T.dog || (W && (!ETYPE[tg.t].armor || e.wpn === 'saw'))) { killE(tg, W && W.sharp ? 'cut' : 'hit', ang, byP, how); sfx(W ? 'thud' : 'punch', tg.x, tg.y); }
  else { knockdown(tg, ang, 'punch'); sfx('punch', tg.x, tg.y); }
}
