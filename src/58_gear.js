// ---------- new gear: monowire, wrist rockets, thruster legs, backup heart, frost carbine, shock baton,
// grenade launcher, vending machines, shock boxes, and job marks you can take alive ----------
IMPLANTS.push(
  { k: 'wire', name: 'MONOWIRE', desc: 'F: WHIP A WIRE THAT CUTS THROUGH A WHOLE LINE', lv: 1 },
  { k: 'wrist', name: 'WRIST ROCKETS', desc: 'F: MINI ROCKET - 2 CHARGES, RELOADS ITSELF', lv: 2 },
  { k: 'thrust', name: 'THRUSTER LEGS', desc: 'F: ROCKET DASH THAT FLATTENS ENEMIES, THEN TIME SLOWS', lv: 2 },
  { k: 'heart', name: 'BACKUP HEART', desc: 'GET BACK UP ONCE PER LEVEL, WITH A SHOCKWAVE', lv: 3 },
);
Object.assign(WEAPONS, {
  cryo: { name: 'FROST CARBINE', len: 9, c: '#2a4a5e', acc: '#7fe0ff', ammo: 12, cd: 0.2, spread: 0.035, pellets: 1, noise: 300, two: 1, cryo: 1, noAI: 1 },
  baton: { name: 'SHOCK BATON', melee: 1, len: 8, c: '#1c1c22', acc: '#4ff', cd: 0.3, reach: 24, shock: 1 },
  glaunch: { name: 'GRENADE LAUNCHER', len: 10, c: '#3a3a2e', acc: '#ffb020', ammo: 6, cd: 0.6, glauncher: 1, noise: 350, two: 1, noAI: 1 },
});
Object.assign(WD, {
  cryo: { g: [11, 9], f: [21, 8], m: 33, d: P => { wstock(P, 1, 5, 9, ['#1a2a36', '#2a4a5e', '#3a6a80']); wbar(P, 10, 4, 10, 4, '#2a4a5e'); P.r(20, 5, 6, 3, '#3a6a80'); P.r(26, 6, 7, 1, M1); P.r(13, 2, 6, 2, '#7fe0ff'); P.r(13, 2, 6, 1, '#d8f8ff'); P.p(16, 1, '#fff'); P.r(12, 8, 2, 3, M1); P.r(15, 8, 3, 2, M2); P.p(31, 6, '#7fe0ff'); } },
  baton: { g: [4, 7], f: [8, 7], d: P => { P.r(1, 6, 9, 2, '#1c1c22'); P.r(1, 6, 9, 1, '#45454d'); P.r(10, 5, 2, 4, '#3a3a42'); P.r(12, 6, 13, 2, '#26262c'); P.r(12, 6, 13, 1, '#4a4a54'); P.r(25, 5, 3, 4, '#4ff'); P.p(26, 4, '#dff'); P.p(28, 7, '#fff'); P.p(27, 3, '#4ff'); } },
  glaunch: { g: [11, 10], f: [22, 9], m: 33, d: P => { wstock(P, 1, 6, 8, WRD); P.r(9, 4, 12, 9, '#3a3a2e'); P.r(9, 4, 12, 1, '#5a5a48'); P.d(15, 8, 4, 4, '#26261e'); P.d(15, 8, 2.5, 2.5, '#4a4a3a'); P.r(21, 5, 12, 5, '#2e2e26'); P.r(21, 5, 12, 1, '#4a4a3a'); P.r(31, 4, 2, 7, M1); P.p(17, 5, '#ffb020'); } },
});
SHOP.weapons.push(['baton', 14000], ['cryo', 26000], ['glaunch', 40000]); SHOP.weapons.sort((a, b) => a[1] - b[1]);
Object.assign(SFX, {
  wire: (t, v) => { nz(t, 0.18, 'highpass', 3000, 6000, 1, 0.5 * v); tone(t, 0.12, 'square', 1800, 400, 0.08 * v); },
  thrust: (t, v) => { nz(t, 0.4, 'bandpass', 400, 1400, 0.8, 0.8 * v); tone(t, 0.3, 'sawtooth', 90, 200, 0.1 * v); },
  heartbeat: (t, v) => { tone(t, 0.12, 'sine', 70, 40, 0.5 * v); tone(t + 0.18, 0.12, 'sine', 70, 40, 0.4 * v); },
  freeze: (t, v) => { nz(t, 0.35, 'highpass', 2500, 5000, 2, 0.4 * v); tone(t, 0.25, 'triangle', 1400, 2600, 0.07 * v); },
  vend: (t, v) => { nz(t, 0.35, 'lowpass', 500, 120, 1, 1.0 * v); tone(t, 0.2, 'square', 70, 40, 0.25 * v); nz(t + 0.15, 0.3, 'bandpass', 2500, 1800, 3, 0.4 * v); },
});
function gearGfx() {
  if (GFX.vend) return; const out = (w, h, fn) => hdc(scale2x(hardOutline(spr(w, h, fn), INK)));
  GFX.vend = out(16, 9, P => { P.r(0, 0, 16, 9, '#a8141c'); P.r(1, 1, 14, 7, '#c82a2a'); P.r(1, 1, 14, 1, '#ff6a5a'); P.r(2, 3, 8, 4, '#1a2a3a'); P.r(2, 3, 8, 1, '#5ab8e8'); for (let i = 0; i < 4; i++) P.p(3 + i * 2, 5, pick(['#ffe14d', '#5dff9a', '#ff3bd8', '#fff'])); P.r(11, 3, 3, 2, '#1c1c20'); P.p(12, 6, '#ffe14d'); P.r(1, 8, 14, 1, '#7a0a10'); });
  GFX.vendDown = out(16, 12, P => { P.r(0, 0, 16, 12, '#7a0a10'); P.r(1, 1, 14, 10, '#a8141c'); P.r(1, 1, 14, 1, '#c82a2a'); P.r(3, 3, 10, 5, '#1a2a3a'); P.r(4, 4, 3, 1, '#5ab8e8'); P.ln(5, 4, 11, 7, '#bff4ff', 1); P.p(9, 9, '#ffe14d'); });
  GFX.can = out(3, 2, P => { P.r(0, 0, 3, 2, pick(['#c82a2a', '#2a6ac8', '#e8c040'])); P.p(0, 0, '#ddd'); });
  GFX.shockbox = out(8, 6, P => { P.r(0, 0, 8, 6, '#3a3e46'); P.r(1, 1, 6, 4, '#ffe14d'); P.r(3, 1, 2, 1, '#1c1c20'); P.r(3, 2, 1, 1, '#1c1c20'); P.r(4, 3, 1, 1, '#1c1c20'); P.p(3, 4, '#1c1c20'); P.p(7, 0, '#ff3b4e'); });
  GFX.shockDead = out(8, 6, P => { P.r(0, 0, 8, 6, '#1c1e22'); P.r(1, 1, 6, 4, '#3a3a2a'); P.p(3, 2, '#ff8a1c'); P.p(5, 3, '#1a1a1a'); });
  GFX.ice1 = out(4, 3, P => { P.r(0, 0, 4, 3, '#9ee8ff'); P.p(1, 0, '#fff'); P.p(3, 2, '#5ab8d8'); });
  GFX.ice2 = out(3, 3, P => { P.r(0, 0, 3, 3, '#bff4ff'); P.p(0, 0, '#fff'); P.p(2, 2, '#7fc8e8'); });
  GFX.zip = out(5, 3, P => { P.r(0, 1, 5, 1, '#ffe14d'); P.p(0, 0, '#ffe14d'); P.p(4, 2, '#ffe14d'); });
}
// a sprite turned to ice
function iceTint(img) { if (img._ice) return img._ice; const [c, cx] = mkCanvas(img.width, img.height); cx.drawImage(img, 0, 0); cx.globalCompositeOperation = 'source-atop'; cx.fillStyle = 'rgba(150,225,255,0.72)'; cx.fillRect(0, 0, img.width, img.height); cx.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < img.width; i += 5) cx.fillRect(i, (i * 7) % img.height, 2, 1); c.hd = img.hd; img._ice = c; return c; }
function gearInit(def) {
  const P = G.player, lv = LEVELS[G.li]; gearGfx();
  G.wires = []; G.zaps = []; G.ice = []; G.mark = null;
  if (G.fi === 0) G.heartUsed = false;
  P.wireCd = 0; P.wristN = 2; P.wristT = 0; P.thrCd = 0; P.thrT = 0; P.reviveT = 0;
  if (lv.job && G.fi === 0) {
    G.markTaken = false; G.markLost = false;
    const st = M.b.start, sx = (st[0] + 0.5) * CELL, sy = (st[1] + 0.5) * CELL;
    const pool = G.ents.filter(e => !ETYPE[e.t].dog && !ETYPE[e.t].boss && !ETYPE[e.t].armor).sort((a, b) => Math.hypot(b.x - sx, b.y - sy) - Math.hypot(a.x - sx, a.y - sy));
    if (pool.length) { G.mark = pool[0]; G.mark.mark = 1; G.markBonus = markBonus(lv); setTimeout(() => { if (G.state === 'play' && G.mark && G.mark.st !== 'dead') toast('THE GOLD-MARKED ONE IS ' + (lv.markName || 'THE CREW CHIEF') + '. KNOCK THEM DOWN AND PRESS E TO ZIP-TIE THEM: +' + money(G.markBonus) + '.'); }, 2600); }
  } else if (lv.job) G.mark = G.ents.find(e => e.mark) || null;
}
function markBonus(lv) { return Math.round((lv.fee || 10000) * 0.5 / 500) * 500; }
// ---------- implant abilities ----------
function gearAbility() {
  const P = G.player, k = G.implant;
  if (k === 'wire') { wireLash(); return true; }
  if (k === 'wrist') { wristRocket(); return true; }
  if (k === 'thrust') { thrustDash(); return true; }
  if (k === 'heart') { toast(G.heartUsed ? 'YOUR BACKUP HEART IS SPENT ON THIS LEVEL' : 'THE BACKUP HEART WORKS ON ITS OWN. IT KICKS IN WHEN YOU DIE.'); return true; }
  return false;
}
function wireLash() {
  const P = G.player; if (P.wireCd > 0) { sfx('noway'); return; } P.wireCd = 2.2;
  const a = P.a, ux = Math.cos(a), uy = Math.sin(a); let L = 4; while (L < 104 && !blockAt(P.x + ux * (L + 3), P.y + uy * (L + 3))) L += 3;
  for (const d of M.doors) { const s = doorEnds(d), t = segX(P.x, P.y, P.x + ux * L, P.y + uy * L, s[0], s[1], s[2], s[3]); if (t >= 0) L = Math.min(L, t * L); }
  const x1 = P.x + ux * L, y1 = P.y + uy * L; let n = 0;
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || (e.st === 'down' && !e.crawl)) continue; const [d] = segDist(e.x, e.y, P.x, P.y, x1, y1); if (d > e.r + 3) continue;
    if (ETYPE[e.t].boss) { e.hp -= 3; e.hitT = 0.15; splat(e.x, e.y, a, 8); pop(e.x, e.y - 8, String(Math.max(0, e.hp)), '#ffe14d'); if (e.hp <= 0) killE(e, 'cut', a, true, 'wire'); continue; }
    killE(e, 'cut', a + rr(-0.3, 0.3), true, 'wire'); n++; }
  destRail(P.x, P.y, ux, uy, L);
  G.wires.push({ x0: P.x + ux * 5, y0: P.y + uy * 5, x1: x1, y1: y1, t: 0 }); sfx('wire', P.x, P.y); sfx('slash', P.x, P.y); P.atk = { k: 'rec', t: 0, d: 0.12 };
  for (let i = 0; i < 10; i++) { const k = Math.random(); part(P.x + ux * L * k, P.y + uy * L * k, rr(-40, 40), rr(-40, 40), rr(0.1, 0.25), pick(['#ffb020', '#fff', '#4ff']), 1); }
  if (n > 1) pop(P.x, P.y - 10, 'WIRED x' + n, '#ffb020'); G.shake = Math.max(G.shake, 0.3);
}
function wristRocket() {
  const P = G.player; if (P.wristN <= 0) { sfx('noway'); toast('WRIST ROCKETS ARE RELOADING'); return; }
  P.wristN--; if (!P.wristT) P.wristT = 7; const a = P.a, s = 300;
  G.rockets.push({ x: P.x + Math.cos(a) * 6, y: P.y + Math.sin(a) * 6, vx: Math.cos(a) * s, vy: Math.sin(a) * s, a: a, t: 0, byP: true, src: P, R: 24, mini: 1 });
  sfx('rocketfire', P.x, P.y); G.shake = Math.max(G.shake, 0.25); P.atk = { k: 'rec', t: 0, d: 0.12 }; makeNoise(P.x, P.y, 400);
}
function thrustDash() {
  const P = G.player; if (P.thrCd > 0 || P.mount) { if (!P.mount) sfx('noway'); return; }
  let mx = IN.mx, my = IN.my; if (Math.hypot(mx, my) < 0.2) { mx = Math.cos(P.a); my = Math.sin(P.a); } const l = Math.hypot(mx, my);
  P.vx = mx / l * 560; P.vy = my / l * 560; P.dashT = 0.24; P.thrT = 0.24; P.thrCd = 2.6; P.thrHit = []; sfx('thrust', P.x, P.y); G.shake = Math.max(G.shake, 0.35);
}
function thrustTick(dt) {
  const P = G.player; if (!(P.thrT > 0)) return; P.thrT -= dt;
  for (let i = 0; i < 3; i++) part(P.x, P.y, -P.vx * rr(0.1, 0.3) + rr(-30, 30), -P.vy * rr(0.1, 0.3) + rr(-30, 30), rr(0.2, 0.4), pick(['#ff8a1c', '#ffe14d', '#fff', '#888']), ri(1, 2));
  const ang = Math.atan2(P.vy, P.vx);
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || e.st === 'down' || P.thrHit.includes(e) || Math.hypot(e.x - P.x, e.y - P.y) > P.r + e.r + 4) continue; P.thrHit.push(e);
    if (ETYPE[e.t].boss) { e.hp -= 1; e.hitT = 0.1; e.vx += Math.cos(ang) * 60; e.vy += Math.sin(ang) * 60; continue; }
    if (ETYPE[e.t].dog) { killE(e, 'hit', ang, true, 'thrust'); continue; }
    if (!knockdown(e, ang, 'door')) { e.vx += Math.cos(ang) * 120; e.vy += Math.sin(ang) * 120; } else pop(e.x, e.y, 'FLATTENED', '#ff8a1c'); }
  if (P.thrT <= 0) { G.slowT = Math.max(G.slowT || 0, 1.1); G.sandBeat = 0.5; G.fx.push({ k: 'ring', x: P.x, y: P.y, t: 0, d: 0.3, real: 1 }); }
}
// the backup heart: you go down, it restarts you, and everything close gets thrown back
function heartDown(src, ang) {
  const P = G.player; G.heartUsed = true; P.reviveT = 1.4; P.inv = 2.6; P.vx = P.vy = 0; P.atk = null;
  addBody(P.x, P.y, ang, GFX.ch.player.dead[0], 0, ang, 0, mkPool(4)); G.corpses[G.corpses.length - 1].ghost = 1;
  splat(P.x, P.y, ang, 10, true); sfx('pdeath'); sfx('heartbeat', P.x, P.y); G.flash = 0.5; G.shake = 0.8; pop(P.x, P.y - 10, 'FLATLINE', '#ff3b4e');
}
function heartUp() {
  const P = G.player; G.corpses = G.corpses.filter(c => !c.ghost); sfx('heartbeat', P.x, P.y); sfx('emp', P.x, P.y); G.flash = 0.4; G.shake = 1; pop(P.x, P.y - 10, 'BACK UP', '#5dff9a'); banner('BACKUP HEART', '#5dff9a');
  G.fx.push({ k: 'ring', x: P.x, y: P.y, t: 0, d: 0.45, real: 1 });
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || Math.hypot(e.x - P.x, e.y - P.y) > 80) continue; const a = Math.atan2(e.y - P.y, e.x - P.x); if (ETYPE[e.t].boss) { e.vx += Math.cos(a) * 80; e.vy += Math.sin(a) * 80; } else if (!knockdown(e, a, 'door')) { e.vx += Math.cos(a) * 140; e.vy += Math.sin(a) * 140; e.dazeT = 1; } }
}
// player-side ticking; returning true skips normal control (you're lying on the floor)
function gearPlayer(dt) {
  const P = G.player; P.wireCd -= dt; P.thrCd -= dt;
  if (P.wristN < 2 && P.wristT > 0) { P.wristT -= dt; if (P.wristT <= 0) { P.wristN++; P.wristT = P.wristN < 2 ? 7 : 0; if (G.implant === 'wrist') pop(P.x, P.y - 10, 'ROCKET READY', '#ffb020'); } }
  thrustTick(dt);
  if (P.reviveT > 0) { P.reviveT -= dt; P.vx = P.vy = 0; if (P.reviveT <= 0) heartUp(); return true; }
  return false;
}
function gearHud() {
  const P = G.player, k = G.implant, key = UI.touch ? '' : ' [F]';
  if (k === 'wire') return P.wireCd > 0 ? [' CHARGING', '#888'] : [' READY' + key, '#ffb020'];
  if (k === 'wrist') return [' ' + P.wristN + '/2' + (P.wristN ? key : ''), P.wristN ? '#ffb020' : '#888'];
  if (k === 'thrust') return P.thrCd > 0 ? [' COOLING', '#888'] : [' READY' + key, '#ff8a1c'];
  if (k === 'heart') return G.heartUsed ? [' SPENT', '#888'] : [' BEATING', '#ff3b4e'];
  return null;
}
// ---------- weapons ----------
function launchNade(e) {
  const a = e.a, v = 330; G.nades.push({ k: 'frag', x: e.x + Math.cos(a) * 9, y: e.y + Math.sin(a) * 9, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0, fuse: 0.95, spin: rr(-14, 14), a: 0, impact: 1, src: e });
  sfx('thud', e.x, e.y); sfx('throw', e.x, e.y); G.shake = Math.max(G.shake, 0.3); if (e === G.player) { G.kx -= Math.cos(a) * 3; G.ky -= Math.sin(a) * 3; } makeNoise(e.x, e.y, 350);
}
// a launched grenade goes off as soon as it hits somebody
function nadeImpact() {
  for (const g of G.nades) { if (!g.impact || g.rem || g.t < 0.06) continue;
    for (const e of G.ents) if (e !== g.src && e.st !== 'dead' && e.st !== 'freed' && Math.hypot(e.x - g.x, e.y - g.y) < e.r + 3) { g.rem = true; explode(g.x, g.y, 38, true, 'frag'); break; } }
}
// the shock baton: kills who it hits, and the current jumps to two more
function batonHit(t, ang) {
  const P = G.player;
  if (ETYPE[t.t].armor) { knockdown(t, ang, 'melee'); t.dazeT = 1.2; } else killE(t, 'hit', ang, true, 'baton');
  zap(P.x + Math.cos(ang) * 10, P.y + Math.sin(ang) * 10, t.x, t.y); sfx('zap', t.x, t.y);
  let from = t; const done = [t];
  for (let k = 0; k < 2; k++) { let best = null, bd = 64; for (const o of G.ents) { if (done.includes(o) || o.st === 'dead' || o.st === 'freed' || ETYPE[o.t].boss) continue; const d = Math.hypot(o.x - from.x, o.y - from.y); if (d < bd && los(from.x, from.y, o.x, o.y)) { bd = d; best = o; } }
    if (!best) break; done.push(best); zap(from.x, from.y, best.x, best.y); if (!knockdown(best, Math.atan2(best.y - from.y, best.x - from.x), 'melee')) best.dazeT = 1.2; best.shockT = 0.6; from = best; }
  if (done.length > 1) pop(t.x, t.y - 10, 'CHAIN x' + done.length, '#4ff');
}
function zap(x0, y0, x1, y1) { const pts = [[x0, y0]], n = 6; for (let i = 1; i < n; i++) { const k = i / n; pts.push([x0 + (x1 - x0) * k + rr(-4, 4), y0 + (y1 - y0) * k + rr(-4, 4)]); } pts.push([x1, y1]); G.zaps.push({ pts: pts, t: 0 }); for (let i = 0; i < 6; i++) part(x1, y1, rr(-90, 90), rr(-90, 90), rr(0.1, 0.25), pick(['#4ff', '#fff', '#bff']), 1); }
// ice and electricity kill differently
function iceKill(e, ang) {
  const S = GFX.ch[e.t]; G.ice.push({ x: e.x, y: e.y, a: ang + rr(-0.3, 0.3), spr: iceTint(S.dead[0]), t: 0, life: rr(0.5, 0.9), e: e });
  sfx('freeze', e.x, e.y); for (let i = 0; i < 12; i++) part(e.x, e.y, rr(-70, 70), rr(-70, 70), rr(0.2, 0.5), pick(['#bff4ff', '#fff', '#7fe0ff']), 1); pop(e.x, e.y - 10, 'FROZEN', '#7fe0ff');
}
function iceShatter(s) {
  s.done = true; const d = M.decX; sfx('glass', s.x, s.y); sfx('glass', s.x + 1, s.y);
  for (let i = 0; i < 12; i++) chunk(s.x, s.y, rr(0, TAU), 2.6, Math.random() < 0.5 ? GFX.ice1 : GFX.ice2, 1.3);
  for (let i = 0; i < 26; i++) part(s.x, s.y, rr(-180, 180), rr(-180, 180), rr(0.2, 0.6), pick(['#bff4ff', '#fff', '#7fe0ff', '#5ab8d8']), ri(1, 2), 1);
  for (let i = 0; i < 10; i++) { d.fillStyle = `rgba(${170 + ri(0, 60)},${225 + ri(0, 30)},255,${rr(0.25, 0.5)})`; d.beginPath(); d.ellipse(s.x + rr(-12, 12), s.y + rr(-12, 12), rr(2, 6), rr(1.5, 4), rr(0, 3), 0, 6.29); d.fill(); }
  d.fillStyle = '#8a0a14'; for (let i = 0; i < 4; i++) d.fillRect(s.x + rr(-8, 8), s.y + rr(-8, 8), 1, 1);
  G.shake = Math.max(G.shake, 0.3); pop(s.x, s.y - 6, 'SHATTERED', '#bff4ff');
}
function shockKill(e, ang) {
  const S = GFX.ch[e.t]; addBody(e.x, e.y, ang, S.burnt, 60, ang, rr(-2, 2), mkPool(5));
  for (let i = 0; i < 16; i++) part(e.x, e.y, rr(-120, 120), rr(-120, 120), rr(0.15, 0.4), pick(['#4ff', '#fff', '#bff', '#ffe14d']), 1);
  G.smoke.push({ x: e.x, y: e.y, r: 2, t: 0, life: 2.5, seed: Math.random() * 99 }); sfx('zap', e.x, e.y); pop(e.x, e.y - 10, 'ZAPPED', '#4ff');
}
function crushKill(e, ang) {
  const S = GFX.ch[e.t]; addBody(e.x, e.y, ang, S.smash, 0, ang, 0, mkPool(14)); splat(e.x, e.y, ang, 18, true); splat(e.x, e.y, ang + Math.PI, 10, true); gibs(e.x, e.y, ang, 14, 1.4); wallSplat(e.x, e.y, ang, 8);
  for (let i = 0; i < 3; i++) chunk(e.x, e.y, rr(0, TAU), 1.4, pick([GORE.meat, GORE.gut, GORE.bone]), 1.2); sfx('splat', e.x, e.y);
}
// called from goreKill; true means this death is handled here
function gearGore(e, how, ang, method) {
  if (method === 'cryo') { iceKill(e, ang); return true; }
  if (method === 'baton' || method === 'shock') { shockKill(e, ang); return true; }
  if (method === 'vend') { crushKill(e, ang); return true; }
  return false;
}
// ---------- vending machines and shock boxes (placed by destInit) ----------
function envPlace(cand, free, wallSide, tryBlock, far, busy, outdoors, industrial) {
  if (outdoors || floorDef().pits) return; const W = M.W, P0 = M.b.start, nearE = (x, y) => Math.min(99, ...M.b.ens.map(e => Math.hypot(e.x - x, e.y - y)));
  const ordered = cand.slice().sort((p, q) => nearE(p[0], p[1]) - nearE(q[0], q[1]));
  let n = industrial || /GALA|MANSION|HOST/.test(LEVELS[G.li].name) ? 2 : 0; for (const [x, y] of ordered) { if (n >= 2) break; const ws = wallSide(x, y); if (!ws || !ws[1] || nearE(x, y) > 9 || Math.hypot(x - P0[0], y - P0[1]) < 8) continue; const c = y * W + x, c2 = c + 1;
    if (!free(c) || !free(c2) || !M.wall[(y + ws[1]) * W + x + 1] || !far(x, y, 'vend', 14)) continue;
    const fy = y - ws[1]; if (fy < 1 || fy >= M.H - 1 || !M.fl[fy * W + x] || !M.fl[fy * W + x + 1] || M.wall[fy * W + x] || M.wall[fy * W + x + 1]) continue;
    if (!tryBlock([c, c2])) continue; G.dest.push({ k: 'vend', cells: [c, c2], cx: x, cy: y, x: (x + 1) * CELL, y: (y + 0.5) * CELL, dir: -ws[1], hp: 4 }); n++; }
  let m = 0; for (const [x, y] of ordered) { if (m >= 2) break; const c = y * W + x; if (!free(c) || nearE(x, y) > 6 || !far(x, y, 'shock', 10) || !far(x, y, 'vend', 3) || Math.hypot(x - P0[0], y - P0[1]) < 7) continue;
    const [dx, dy] = wallSide(x, y); busy[c] = 1; G.dest.push({ k: 'shock', cx: x, cy: y, x: (x + 0.5 + dx * 0.32) * CELL, y: (y + 0.5 + dy * 0.32) * CELL, a: Math.atan2(-dy, -dx) }); m++; }
}
function envHit(d, byP, ang, melee) {
  if (d.dead) return;
  if (d.k === 'vend') { d.hp -= melee ? 2 : 1; sfx('tink', d.x, d.y); for (let i = 0; i < 5; i++) part(d.x, d.y, rr(-80, 80), rr(-80, 80), rr(0.15, 0.3), pick(['#ffe14d', '#fff', '#5ab8e8']), 1); if (Math.random() < 0.4) chunk(d.x, d.y, ang + Math.PI, 0.8, GFX.can, 1); if (d.hp <= 0) toppleVend(d, byP); return; }
  if (d.k === 'shock') shockBurst(d, byP);
}
function toppleVend(d, byP) {
  if (d.dead) return; d.dead = true; for (const c of d.cells) { M.solid[c] = 0; M.tall[c] = 0; } mapChanged();
  const fx = d.x, fy = d.y + d.dir * 10, ang = d.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
  dRot(M.decX, GFX.vendDown, fx, fy, d.dir > 0 ? 0 : Math.PI); for (let i = 0; i < 8; i++) chunk(fx, fy, rr(0, TAU), 1.6, GFX.can, 1.2);
  for (let i = 0; i < 20; i++) part(fx, fy, rr(-150, 150), rr(-150, 150), rr(0.2, 0.5), pick(['#5ab8e8', '#fff', '#ffe14d', '#888']), ri(1, 2), 1);
  sfx('vend', fx, fy); sfx('glass', fx, fy); G.shake = Math.max(G.shake, 0.7); makeNoise(fx, fy, 300); let n = 0;
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || Math.abs(e.x - fx) > 10 + e.r || Math.abs(e.y - fy) > 9 + e.r) continue;
    if (ETYPE[e.t].boss) { e.hp -= 6; e.hitT = 0.2; if (e.hp <= 0) killE(e, 'hit', ang, byP, 'vend'); continue; } killE(e, 'hit', ang, byP, 'vend'); n++; }
  if (n && byP) addScore(400 * n, fx, fy - 10, n > 1 ? 'VENDING MACHINE x' + n : 'VENDING MACHINE', null);
}
function shockBurst(d, byP) {
  d.dead = true; sfx('zap', d.x, d.y); sfx('power', d.x, d.y); G.flash = Math.max(G.flash, 0.2); G.shake = Math.max(G.shake, 0.5); makeNoise(d.x, d.y, 260); let n = 0;
  for (let i = 0; i < 18; i++) part(d.x, d.y, rr(-160, 160), rr(-160, 160), rr(0.15, 0.4), pick(['#4ff', '#fff', '#ffe14d']), ri(1, 2));
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || Math.hypot(e.x - d.x, e.y - d.y) > 52 || !los(d.x, d.y, e.x, e.y)) continue; zap(d.x, d.y, e.x, e.y);
    if (ETYPE[e.t].boss) { e.hp -= 4; e.hitT = 0.2; if (e.hp <= 0) killE(e, 'hit', 0, byP, 'shock'); continue; } killE(e, 'hit', Math.atan2(e.y - d.y, e.x - d.x), byP, 'shock'); n++; }
  const P = G.player; if (!P.dead && Math.hypot(P.x - d.x, P.y - d.y) < 24 && los(d.x, d.y, P.x, P.y)) { zap(d.x, d.y, P.x, P.y); if (hurtPlayer(null, Math.atan2(P.y - d.y, P.x - d.x))) toast('TOO CLOSE TO THE SHOCK BOX. SHOOT IT FROM A DISTANCE.'); }
  if (n && byP) addScore(350 * n, d.x, d.y - 10, n > 1 ? 'SHOCK BOX x' + n : 'SHOCK BOX', null);
}
function drawEnv(x, d) {
  if (d.k === 'vend') { if (!d.dead) dRot(x, GFX.vend, d.x, d.y, d.dir > 0 ? Math.PI : 0); return; }
  if (d.k === 'shock') { dRot(x, d.dead ? GFX.shockDead : GFX.shockbox, d.x, d.y, d.a + Math.PI / 2); if (d.dead && Math.random() < 0.04) part(d.x, d.y, rr(-60, 60), rr(-60, 60), 0.2, pick(['#4ff', '#ffe14d']), 1); else if (!d.dead && (G.time * 3 + d.cx) % 2 < 0.15) { x.fillStyle = 'rgba(80,255,255,0.5)'; x.fillRect(d.x - 0.5, d.y - 0.5, 1, 1); } }
}
// ---------- things you can press E on: vending machines and the job's mark ----------
function envUsable(P) {
  for (const d of G.dest || []) if (d.k === 'vend' && !d.dead && Math.hypot(d.x - P.x, d.y - P.y) < 20) return { kind: 'heist', text: 'TIP IT OVER', act: () => toppleVend(d, true) };
  const m = G.mark; if (m && m.st === 'down' && !m.cuffed && Math.hypot(m.x - P.x, m.y - P.y) < 20) return { kind: 'heist', text: 'ZIP-TIE THE MARK', act: () => cuffMark(m) };
  return null;
}
function cuffMark(m) {
  m.st = 'freed'; m.cuffed = 1; m.vx = m.vy = 0; G.markTaken = true; sfx('pickup'); sfx('tink', m.x, m.y); banner('MARK TAKEN ALIVE +' + money(G.markBonus), '#ffe14d'); pop(m.x, m.y - 10, 'ZIP-TIED', '#ffe14d'); checkClear();
}
// ---------- per-frame ----------
function gearUpdate(dt) {
  if (!G.wires) return;
  nadeImpact();
  for (const w of G.wires) w.t += dt; G.wires = G.wires.filter(w => w.t < 0.2);
  for (const z of G.zaps) z.t += dt; G.zaps = G.zaps.filter(z => z.t < 0.22);
  for (const s of G.ice) { s.t += dt; if (s.t >= s.life && !s.done) iceShatter(s); } G.ice = G.ice.filter(s => !s.done);
  if (G.mark && G.mark.st === 'dead' && !G.markLost && !G.markTaken) { G.markLost = true; toast('THE MARK IS DEAD. NO BONUS ON THIS JOB.'); }
}
function gearExplode(x, y, R) { if (!G.ice) return; for (const s of G.ice) if (!s.done && Math.hypot(s.x - x, s.y - y) < R + 8) iceShatter(s); }
function drawGearLow(x) {
  if (!G.ice) return;
  for (const s of G.ice) { const k = Math.min(1, s.t * 8); dRot(x, s.spr, s.x, s.y, s.a); if (k < 1) { x.fillStyle = `rgba(255,255,255,${0.6 * (1 - k)})`; x.beginPath(); x.arc(s.x, s.y, 8, 0, 6.29); x.fill(); } }
  const m = G.mark; if (m && m.st !== 'dead') {
    const bob = Math.sin(G.time * 4) * 1.5; x.fillStyle = '#ffe14d'; x.strokeStyle = '#1a1206'; x.lineWidth = 0.8; x.beginPath(); x.moveTo(m.x, m.y - 14 + bob); x.lineTo(m.x + 3, m.y - 11 + bob); x.lineTo(m.x, m.y - 8 + bob); x.lineTo(m.x - 3, m.y - 11 + bob); x.closePath(); x.fill(); x.stroke();
    if (m.cuffed) dRot(x, GFX.zip, m.x, m.y + 4, 0);
    if (m.st === 'down' && !m.cuffed) { x.strokeStyle = `rgba(255,225,77,${0.5 + 0.4 * Math.sin(G.time * 10)})`; x.setLineDash([2, 2]); x.beginPath(); x.arc(m.x, m.y, 10, 0, 6.29); x.stroke(); x.setLineDash([]); }
  }
}
function drawGearHigh(x) {
  if (!G.wires) return;
  for (const w of G.wires) { const a = 1 - w.t / 0.2; x.strokeStyle = `rgba(255,176,32,${a})`; x.lineWidth = 1.4; x.beginPath(); x.moveTo(w.x0, w.y0); x.lineTo(w.x1, w.y1); x.stroke(); x.strokeStyle = `rgba(255,255,255,${a})`; x.lineWidth = 0.5; x.stroke(); }
  for (const z of G.zaps) { const a = 1 - z.t / 0.22; x.strokeStyle = `rgba(80,255,255,${a})`; x.lineWidth = 1.2; x.beginPath(); z.pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); x.strokeStyle = `rgba(255,255,255,${a})`; x.lineWidth = 0.5; x.stroke(); }
}
