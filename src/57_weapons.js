// ---------- extra weapons: katana, rail gun, missiles, belt-fed MG, ricochet revolver, throwing knives, grenades; arm blades implant ----------
Object.assign(WEAPONS, {
  katana: { name: 'KATANA', melee: 1, len: 12, c: '#e8eef6', acc: '#2a1a2a', cd: 0.22, reach: 28, sharp: 1, deflect: 1 },
  rail: { name: 'RAIL GUN', len: 12, c: '#2e3a4a', acc: '#3ff', ammo: 4, cd: 0.55, charge: 0.45, rail: 1, noise: 450, two: 1, noAI: 1 },
  rocket: { name: 'MISSILE LAUNCHER', len: 10, c: '#3a4a2e', acc: '#ff3b4e', ammo: 3, cd: 0.8, rocket: 1, noise: 500, two: 1, noAI: 1 },
  belt: { name: 'BELT-FED MG', len: 11, c: '#26262a', acc: '#c8a040', ammo: 60, cd: 0.07, spread: 0.12, pellets: 1, noise: 420, auto: 1, two: 1, heavy: 1 },
  revolver: { name: 'RICOCHET REVOLVER', len: 6, c: '#8a8f99', acc: '#ffe14d', ammo: 6, cd: 0.36, spread: 0.01, pellets: 1, noise: 320, bounce: 1 },
  knife: { name: 'THROWING KNIVES', len: 4, c: '#d8dee6', acc: '#2a2a2a', ammo: 3, cd: 0.26, knife: 1, noAI: 1 },
});
const NADES = { frag: { name: 'FRAG GRENADE', fuse: 1.25 }, emp: { name: 'EMP GRENADE', fuse: 0.9 } };
function nadeIcon(k) { return spr(16, 16, P => { const c = k === 'frag' ? '#3a5a2a' : '#1e4a8a'; P.d(8, 9, 4, 4, '#111'); P.d(8, 9, 3.2, 3.2, c); P.r(7, 3, 3, 3, '#888'); P.p(6, 3, '#bbb'); P.p(9, 8, k === 'frag' ? '#ff3b4e' : '#3ff'); if (k === 'frag') { P.p(6, 10, shade(c, 0.7)); P.p(10, 10, shade(c, 0.7)); } else P.r(6, 9, 5, 1, '#3ff'); }); }
// ---------- explosions ----------
function explode(x, y, R, byP, src) {
  sfx('explode', x, y); G.shake = Math.max(G.shake, 1.1); G.flash = Math.max(G.flash, 0.25); G.hitStop = Math.max(G.hitStop, 0.06); G.zp = Math.max(G.zp, 0.08);
  const d = M.decX; d.fillStyle = 'rgba(10,8,8,0.55)'; d.beginPath(); d.arc(x, y, R * 0.55, 0, 6.29); d.fill(); d.fillStyle = 'rgba(20,14,12,0.35)'; d.beginPath(); d.arc(x, y, R * 0.85, 0, 6.29); d.fill();
  G.fx.push({ k: 'boom', x: x, y: y, r: R, t: 0, d: 0.35, real: 1 });
  for (let i = 0; i < 40; i++) { const a = rr(0, 6.28), s = rr(40, 260); part(x, y, Math.cos(a) * s, Math.sin(a) * s, rr(0.2, 0.6), pick(['#ffe14d', '#ff8a1c', '#ff3b1c', '#fff', '#555', '#333']), ri(1, 2)); }
  for (const e of G.ents) {
    if (e.st === 'dead' || e.st === 'freed') continue; const dd = Math.hypot(e.x - x, e.y - y), ang = Math.atan2(e.y - y, e.x - x); if (dd > R * 1.4 || !los(x, y, e.x, e.y)) continue;
    if (dd < R) { if (ETYPE[e.t].boss) { e.hp -= 5; e.hitT = 0.15; if (e.hp <= 0) killE(e, 'shotgun', ang, byP, src); else pop(e.x, e.y - 8, String(e.hp), '#ffe14d'); } else killE(e, 'shotgun', ang, byP, src); }
    else if (e.st !== 'down') knockdown(e, ang, 'blast');
  }
  const P = G.player, dp = Math.hypot(P.x - x, P.y - y); if (!P.dead && dp < R * 0.9 && los(x, y, P.x, P.y)) hurtPlayer(null, Math.atan2(P.y - y, P.x - x));
  for (const p of G.props) if (!p.dead && Math.hypot((p.x + p.w / 2) * CELL - x, (p.y + p.h / 2) * CELL - y) < R + 8) damageProp(p, 99, x, y);
  for (const dr of M.doors) { const s = doorEnds(dr), [dd] = segDist(x, y, s[0], s[1], s[2], s[3]); if (dd < R * 1.2) dr.w = (dr.ang >= 0 ? 1 : -1) * 14; }
  destExplode(x, y, R, byP);
  makeNoise(x, y, 520);
}
function empBlast(x, y, R) {
  sfx('emp', x, y); sfx('zap', x, y); G.flash = Math.max(G.flash, 0.15); G.fx.push({ k: 'ring', x: x, y: y, t: 0, d: 0.4, real: 1, emp: 1 });
  for (let i = 0; i < 26; i++) { const a = rr(0, 6.28), s = rr(60, 220); part(x, y, Math.cos(a) * s, Math.sin(a) * s, rr(0.15, 0.4), pick(['#3ff', '#bff', '#fff', '#5a8aff']), 1); }
  for (const e of G.ents) {
    if (e.st === 'dead' || e.st === 'freed') continue; const dd = Math.hypot(e.x - x, e.y - y); if (dd > R || !los(x, y, e.x, e.y)) continue;
    if (ETYPE[e.t].dog || ETYPE[e.t].robot) killE(e, 'shot', Math.atan2(e.y - y, e.x - x), true, 'emp');
    else if (!ETYPE[e.t].boss) { e.dazeT = 2.5; e.wind = 0; e.aimT = 0; }
  }
  for (const p of G.props) if (!p.dead && Math.hypot((p.x + p.w / 2) * CELL - x, (p.y + p.h / 2) * CELL - y) < R) damageProp(p, 99, x, y);
  checkClear();
}
// ---------- rail gun: hold to charge, the slug goes through walls and everyone on the line ----------
function railFire(P) {
  const W = WEAPONS.rail; P.ammo--; P.cd = W.cd; P.charge = 0;
  if (UI.assist !== false) { const t = gunTarget(P); if (t) P.a = Math.atan2(t.y - P.y, t.x - P.x); }
  const a = P.a, ux = Math.cos(a), uy = Math.sin(a), L = 640, hits = [];
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || e.st === 'down' && false) continue; const vx = e.x - P.x, vy = e.y - P.y, t = vx * ux + vy * uy, perp = Math.abs(vx * uy - vy * ux); if (t > 0 && t < L && perp < e.r + 4 && e.st !== 'dead') hits.push([t, e]); }
  hits.sort((p, q) => p[0] - q[0]);
  for (const [, e] of hits) { if (ETYPE[e.t].boss) { e.hp -= 6; e.hitT = 0.15; pop(e.x, e.y - 8, String(Math.max(0, e.hp)), '#ffe14d'); if (e.hp <= 0) killE(e, 'rail', a, true, 'rail'); } else killE(e, 'rail', a, true, 'rail'); }
  let inWall = false; for (let d = 6; d < L; d += 2) { const x = P.x + ux * d, y = P.y + uy * d, b = blockAt(x, y); if (b !== inWall) { for (let i = 0; i < 6; i++) part(x, y, rr(-120, 120), rr(-120, 120), rr(0.1, 0.3), pick(['#3ff', '#fff', '#aaa']), 1); inWall = b; } const pr = propAt(x, y); if (pr) damageProp(pr, 99, x, y); }
  destRail(P.x, P.y, ux, uy, L);
  G.fx.push({ k: 'beam', x0: P.x + ux * 8, y0: P.y + uy * 8, x1: P.x + ux * L, y1: P.y + uy * L, t: 0, d: 0.3, real: 1 });
  sfx('rail', P.x, P.y); G.shake = Math.max(G.shake, 0.6); G.kx -= ux * 5; G.ky -= uy * 5; P.atk = { k: 'rec', t: 0, d: 0.12 }; P.flashT = 0.06;
  if (G.implant !== 'ghost') makeNoise(P.x, P.y, W.noise);
}
// ---------- rockets ----------
function fireRocket(e, isP) {
  const a = e.a, s = 280; G.rockets.push({ x: e.x, y: e.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, a: a, t: 0, byP: isP, src: e });
  sfx('rocketfire', e.x, e.y); G.shake = Math.max(G.shake, 0.4); if (isP) { G.kx -= Math.cos(a) * 4; G.ky -= Math.sin(a) * 4; }
  makeNoise(e.x, e.y, 500);
}
function updRockets(dt) {
  for (const r of G.rockets) {
    r.t += dt; const n = Math.max(1, Math.ceil(Math.hypot(r.vx, r.vy) * dt / 3)); let boom = r.t > 1.6;
    if (Math.random() < 0.7) part(r.x - Math.cos(r.a) * 5, r.y - Math.sin(r.a) * 5, rr(-15, 15), rr(-15, 15), rr(0.3, 0.6), pick(['#777', '#999', '#555']), 2);
    for (let i = 0; i < n && !boom; i++) {
      const ox = r.x, oy = r.y; r.x += r.vx * dt / n; r.y += r.vy * dt / n;
      if (blockAt(r.x, r.y)) { r.x = ox; r.y = oy; boom = true; break; }
      for (const d of M.doors) { const s = doorEnds(d); if (segX(ox, oy, r.x, r.y, s[0], s[1], s[2], s[3]) >= 0) { boom = true; break; } }
      if (r.t > 0.05) for (const e of G.ents) if (e !== r.src && e.st !== 'dead' && e.st !== 'freed' && e.st !== 'down' && Math.hypot(e.x - r.x, e.y - r.y) < e.r + 3) { boom = true; break; }
      if (!r.byP && !G.player.dead && Math.hypot(G.player.x - r.x, G.player.y - r.y) < G.player.r + 3) boom = true;
    }
    if (boom) { r.rem = true; explode(r.x, r.y, 40, r.byP, 'rocket'); }
  }
  G.rockets = G.rockets.filter(r => !r.rem);
}
// ---------- grenades: G throws one toward the cursor; they bounce off walls ----------
function throwNade() {
  const P = G.player; if (P.dead || P.mount || !P.gren || P.gren.n <= 0) { if (!P.dead) { sfx('click'); toast('NO GRENADES'); } return; }
  const k = P.gren.k, dist = clamp(Math.hypot(IN.ax - P.x, IN.ay - P.y), 30, 170), a = P.a, v = dist * 3.5;
  G.nades.push({ k: k, x: P.x + Math.cos(a) * 6, y: P.y + Math.sin(a) * 6, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, fuse: NADES[k].fuse, spin: rr(-12, 12), a: 0 });
  P.gren.n--; if (P.gren.n <= 0) P.gren = null; sfx('throw'); P.atk = { k: P.alt ? 'pR' : 'pL', t: 0, d: 0.15 }; P.alt = !P.alt;
}
function updNades(dt) {
  for (const g of G.nades) {
    g.t += dt; g.a += g.spin * dt; const k = Math.exp(-dt * 3.5); g.vx *= k; g.vy *= k; g.spin *= k;
    const n = Math.max(1, Math.ceil(Math.hypot(g.vx, g.vy) * dt / 2));
    for (let i = 0; i < n; i++) {
      const nx = g.x + g.vx * dt / n, ny = g.y + g.vy * dt / n;
      if (blockAt(nx, ny)) { const bx = blockAt(nx, g.y), by = blockAt(g.x, ny); if (bx || !by) g.vx *= -0.5; if (by || !bx) g.vy *= -0.5; if (Math.hypot(g.vx, g.vy) > 40) sfx('tink', g.x, g.y); break; }
      let hitDoor = false; for (const d of M.doors) { const s = doorEnds(d); if (segX(g.x, g.y, nx, ny, s[0], s[1], s[2], s[3]) >= 0) { hitDoor = true; break; } } if (hitDoor) { g.vx *= -0.5; g.vy *= -0.5; break; }
      g.x = nx; g.y = ny;
    }
    if (g.t >= g.fuse) { g.rem = true; if (g.k === 'frag') explode(g.x, g.y, 38, true, 'frag'); else empBlast(g.x, g.y, 64); }
  }
  G.nades = G.nades.filter(g => !g.rem);
}
// grenades lying around are picked up by walking over them
function collectNades() {
  const P = G.player; if (P.dead) return;
  for (const it of G.items) { if (!NADES[it.k] || Math.hypot(it.x - P.x, it.y - P.y) > 11) continue; if (!P.gren || P.gren.k !== it.k) P.gren = { k: it.k, n: 0 }; P.gren.n += it.ammo || 2; it.rem = true; sfx('weapon'); pop(P.x, P.y - 8, NADES[it.k].name + ' x' + P.gren.n, '#ffe14d'); }
  // throwing knives on the floor join the ones in your hand
  if (P.wpn === 'knife') for (const it of G.items) if (it.k === 'knife' && !it.rem && Math.hypot(it.x - P.x, it.y - P.y) < 11) { P.ammo += it.ammo || 1; it.rem = true; sfx('pickup'); }
  if (G.items.some(i => i.rem)) G.items = G.items.filter(i => !i.rem);
}
// ---------- throwing knives ----------
function throwKnife(P) {
  const W = WEAPONS.knife; if (UI.assist !== false) { const t = gunTarget(P); if (t) P.a = Math.atan2(t.y - P.y, t.x - P.x); }
  P.ammo--; P.cd = W.cd; G.thrown.push({ k: 'knife', ammo: 1, x: P.x, y: P.y, vx: Math.cos(P.a) * 560, vy: Math.sin(P.a) * 560, a: P.a, t: 0, knife: 1 }); sfx('throw');
  P.atk = { k: 'rec', t: 0, d: 0.1 }; if (P.ammo <= 0) { P.wpn = null; P.ammo = 0; }
}
// ---------- arm blades implant: F leaps onto the enemy you're aiming at ----------
function bladeLeap() {
  const P = G.player; if (P.leapCd > 0 || P.mount) return; let best = null, bs = 1e9;
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'down' || e.st === 'freed' || e.hacked > 0) continue; const d = Math.hypot(e.x - P.x, e.y - P.y), da = Math.abs(angDiff(Math.atan2(e.y - P.y, e.x - P.x), P.a)); if (d > 160 || da > 0.6 || !los(P.x, P.y, e.x, e.y)) continue; const sc = d + da * 120; if (sc < bs) { bs = sc; best = e; } }
  if (!best) { sfx('noway'); return; }
  P.leap = best; P.leapT = 0.32; P.dashT = 0.32; P.leapCd = 2.5; sfx('dash'); sfx('swish');
}
function updLeap(P, dt) {
  const e = P.leap; P.leapT -= dt;
  if (!e || e.st === 'dead' || e.st === 'freed' || P.leapT <= 0) { P.leap = null; return; }
  const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy); P.a = Math.atan2(dy, dx); P.vx = dx / d * 460; P.vy = dy / d * 460;
  if (d < 20) { P.leap = null; P.vx *= 0.2; P.vy *= 0.2; P.cd = 0; attack(P, true); }
}
// ---------- previews: rail charge line, ricochet bank shot ----------
function drawAimAids(x) {
  const P = G.player; if (P.dead || P.mount) return; const W = P.wpn && WEAPONS[P.wpn]; if (!W) return;
  if (W.rail && P.charge > 0) { const k = P.charge / W.charge, ux = Math.cos(P.a), uy = Math.sin(P.a); x.strokeStyle = `rgba(80,255,255,${0.2 + 0.6 * k})`; x.lineWidth = 0.5 + k * 1.5; x.beginPath(); x.moveTo(P.x + ux * 8, P.y + uy * 8); x.lineTo(P.x + ux * 640, P.y + uy * 640); x.stroke(); }
  if (W.bounce && P.ammo > 0) {
    let px = P.x, py = P.y, vx = Math.cos(P.a), vy = Math.sin(P.a), bounced = false; x.strokeStyle = 'rgba(255,225,77,0.6)'; x.lineWidth = 1.2; x.setLineDash([3, 3]); x.beginPath(); x.moveTo(px + vx * 8, py + vy * 8);
    for (let d = 0; d < 260; d += 2) { const nx = px + vx * 2, ny = py + vy * 2; if (blockAt(nx, ny)) { if (bounced) break; const bx = blockAt(nx, py), by = blockAt(px, ny); if (bx || !by) vx = -vx; if (by || !bx) vy = -vy; bounced = true; x.lineTo(px, py); continue; } px = nx; py = ny; }
    x.lineTo(px, py); x.stroke(); x.setLineDash([]);
  }
}
function drawProjectiles(x) {
  for (const r of G.rockets) { x.save(); x.translate(r.x, r.y); x.rotate(r.a); x.fillStyle = '#ddd'; x.fillRect(-4, -1.5, 7, 3); x.fillStyle = '#ff3b4e'; x.fillRect(3, -1.5, 2, 3); x.fillStyle = (G.time * 30 | 0) % 2 ? '#ffe14d' : '#ff8a1c'; x.fillRect(-7, -1, 3, 2); x.restore(); }
  for (const g of G.nades) { dRot(x, GFX.wpn[g.k], g.x, g.y, g.a); if ((g.fuse - g.t) < 0.5 ? (G.time * 20 | 0) % 2 : (G.time * 6 | 0) % 2) { x.fillStyle = g.k === 'frag' ? '#ff3b4e' : '#3ff'; x.fillRect(Math.round(g.x) - 1, Math.round(g.y) - 1, 2, 2); } x.strokeStyle = g.k === 'frag' ? 'rgba(255,59,78,0.5)' : 'rgba(80,255,255,0.5)'; x.lineWidth = 1; x.beginPath(); x.arc(g.x, g.y, 7, -Math.PI / 2, -Math.PI / 2 + 6.283 * (1 - g.t / g.fuse)); x.stroke(); }
}
