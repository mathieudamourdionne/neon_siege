// ---------- SPECIAL OP: BLACK SAND - Marrow Key, its security, and what lives under the temple ----------
// art: black sand, hellstone, palms, wall safes, altars, braziers
Object.assign(FLOORS, {
  bsand: P => { P.r(0, 0, 16, 16, '#26262c'); for (let i = 0; i < 30; i++) P.p(srnd() * 16, srnd() * 16, pick(['#1e1e24', '#323238', '#3e3e46', '#18181e'])); P.p(srnd() * 16, srnd() * 16, '#8a8a80'); },
  hell: P => { P.r(0, 0, 16, 16, '#1c0e0f'); for (let i = 0; i < 22; i++) P.p(srnd() * 16, srnd() * 16, pick(['#24120f', '#150a0b', '#2a1512', '#1f0f0e'])); if (srnd() < 0.6) { const x = srnd() * 10 + 2, y = srnd() * 10 + 2; P.ln(x, y, x + 3, y + 2, '#3a0a0a', 1); P.p(Math.round(x + 1), Math.round(y + 1), '#8a1a0a'); } },
});
for (const k of ['bsand', 'hell']) if (!FL_IDS.includes(k)) FL_IDS.push(k);
OUTDOOR.push('bsand');
Object.assign(OBJ, {
  palm: { w: 2, h: 2, solid: 1, tall: 1, d: P => { for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + 0.3, ex = 8 + Math.cos(a) * 8, ey = 8 + Math.sin(a) * 8; P.ln(8, 8, ex, ey, '#143a18', 3); P.ln(8, 8, ex, ey, '#2e6a2e', 1); P.p(Math.round(ex), Math.round(ey), '#4a8a3a'); } P.d(8, 8, 2.4, 2.4, '#3a2410'); P.d(8, 8, 1.4, 1.4, '#6a4a22'); } },
  wsafe: { w: 2, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 8, '#1a1c22'); P.r(1, 1, 14, 6, '#5a606a'); P.r(1, 1, 14, 1, '#8a929e'); P.d(7, 4, 2.4, 2.4, '#1a1c22'); P.d(7, 4, 1.5, 1.5, '#c8ccd2'); P.p(7, 3, '#1a1c22'); P.r(11, 3, 3, 2, '#c8a040'); P.p(13, 2, '#ff3b4e'); } },
  altar: { w: 4, h: 2, solid: 1, tall: 0, d: P => { P.r(0, 0, 32, 16, '#140a0c'); P.r(1, 1, 30, 14, '#3a3034'); P.r(1, 1, 30, 1, '#5a4e54'); P.r(11, 0, 10, 16, '#6a0a12'); P.r(11, 0, 10, 1, '#c8a040'); P.r(11, 15, 10, 1, '#c8a040'); P.d(16, 8, 3, 2.4, '#2a0206'); for (const [x, y] of [[3, 3], [3, 12], [28, 3], [28, 12], [7, 7]]) { P.r(x, y, 2, 2, '#e8dcc0'); P.p(x, y - 1, '#ffe14d'); } } },
  brazier: { w: 1, h: 1, solid: 1, tall: 0, d: P => { P.d(4, 4, 3.8, 3.8, '#140a0a'); P.d(4, 4, 3, 3, '#3a2a22'); P.d(4, 4, 2, 2, '#ff7a1a'); P.p(4, 3, '#ffe14d'); P.p(3, 4, '#ffe14d'); } },
});
// enemies: the island's security, three kinds of demon, and Marrow himself
Object.assign(ETYPE, {
  isl: { name: 'KEY SECURITY', spd: 104, pat: 42, react: 0.45 },
  imp: { name: 'IMP', spd: 150, pat: 60, react: 0.18, demon: 1, sight: 320 },
  fnd: { name: 'FIEND', spd: 76, pat: 36, react: 0.6, demon: 1, strafe: 1 },
  hbr: { name: 'HELL BRUTE', spd: 84, pat: 34, react: 0.4, hp: 5, armor: 1, demon: 1 },
  mrw: { name: 'SILAS MARROW - THE HORNED HOST', spd: 66, pat: 30, react: 0.3, hp: 44, armor: 1, boss: 1, demon: 1 },
});
Object.assign(CHARS, {
  isl: { jacket: '#d8d4c4', boots: '#2a2018', skin: SKINS[2], hair: '#1a1410', legs: '#5a5440', stripe: '#3a6a8a' },
  imp: { jacket: '#8a1420', boots: '#1a0608', skin: '#b4242c', hair: '#4a060c', legs: '#5a0a12', eyes: '#ffd040' },
  fnd: { jacket: '#1e0a16', boots: '#0a0406', skin: '#7a1a3a', hair: '#2a0410', legs: '#140610', eyes: '#ff8a1c', stripe: '#ff5a1a' },
  hbr: { jacket: '#5a0a0e', boots: '#140406', skin: '#7a1214', hair: '#2a0406', legs: '#3a0608', eyes: '#ffd040', fat: 1 },
  mrw: { bar: '#ff5a1a', jacket: '#16080a', boots: '#0a0406', skin: '#a8161c', hair: '#2a0406', legs: '#16080a', eyes: '#ffd040' },
});
Object.assign(LOOKS, {
  isl: { hairStyle: 'short', shades: '#16161c', collar: '#ecebe4' },
  imp: { hairStyle: 'short', horns: '#e8dcc0' },
  fnd: { hairStyle: 'short', horns: '#c8b8a0' },
  hbr: { hairStyle: 'short', horns: '#f0e6d0', pads: '#3a0608' },
  mrw: { hairStyle: 'slick', collar: '#4a0a10', tie: '#c8a040', horns: '#f0e6d0' },
});
// horns, drawn onto any head that has them (called from headHD)
function hornsHD(P, c, hx, hy, HR) {
  for (const s of [-1, 1]) { const bx = hx + 1, by = hy + s * (HR - 1), mx = hx + 2.5, my = hy + s * (HR + 2.5), tx = hx + 6, ty = hy + s * (HR + 3.2);
    P.ln(bx, by, mx, my, INK, 3.4); P.ln(mx, my, tx, ty, INK, 2.6); P.ln(bx, by, mx, my, c.horns, 2); P.ln(mx, my, tx, ty, c.horns, 1.2); P.p(Math.round(tx), Math.round(ty), '#fff8e0'); }
}
// demon weapons: claws (never dropped) and a hand full of fire
Object.assign(WEAPONS, {
  claw: { name: 'CLAWS', melee: 1, len: 6, c: '#e8dcc0', acc: '#5a0a10', cd: 0.3, reach: 24, sharp: 1, noAI: 1, nodrop: 1 },
  hellfire: { name: 'HELLFIRE', len: 4, c: '#ff7a1a', acc: '#ffe14d', ammo: 99, cd: 1.7, spread: 0, pellets: 1, noise: 200, fireball: 1, noAI: 1, nodrop: 1 },
});
Object.assign(WD, {
  claw: { g: [3, 7], d: P => { P.r(1, 5, 5, 5, '#7a1018'); for (const y of [4, 7, 10]) { P.ln(5, y, 12, y + (y - 7) * 0.4, INK, 2); P.ln(5, y, 12, y + (y - 7) * 0.4, '#e8dcc0', 1); P.p(12, Math.round(y + (y - 7) * 0.4), '#fff'); } } },
  hellfire: { g: [3, 7], m: 10, d: P => { P.d(8, 7, 4.5, 4.5, '#7a0a08'); P.d(8, 7, 3.6, 3.6, '#ff3b1c'); P.d(8, 7, 2.6, 2.6, '#ff8a1c'); P.d(8, 7, 1.4, 1.4, '#ffe14d'); P.p(8, 6, '#fff'); } },
});
Object.assign(SFX, {
  fireball: (t, v) => { nz(t, 0.45, 'bandpass', 700, 200, 1.2, 0.7 * v); tone(t, 0.3, 'sawtooth', 190, 60, 0.12 * v); },
  roar: (t, v) => { tone(t, 0.7, 'sawtooth', 120, 50, 0.22 * v); tone(t + 0.02, 0.6, 'square', 83, 38, 0.1 * v); nz(t, 0.7, 'lowpass', 600, 150, 1, 0.5 * v); },
  squelch: (t, v) => { nz(t, 0.3, 'lowpass', 1100, 180, 2, 0.9 * v); tone(t, 0.18, 'sine', 140, 35, 0.35 * v); nz(t + 0.08, 0.2, 'bandpass', 500, 300, 3, 0.4 * v); },
});
function islandGfx() {
  if (GFX.horn) return;
  GFX.horn = hdc(hardOutline(spr(9, 5, P => { P.ln(0, 3, 4, 2, '#e8dcc0', 2); P.ln(4, 2, 8, 0, '#e8dcc0', 1); P.p(8, 0, '#fff8e0'); P.p(0, 3, '#8a0a14'); }), INK));
}
function islandInit(def) {
  G.fireballs = []; G.hellfire = []; G.fountains = []; G.goreChain = []; G.mrwDown = false;
  G.pits = (def.pits || []).map(([x, y]) => ({ x: (x + 0.5) * CELL, y: (y + 0.5) * CELL, glow: 0 }));
  G.isle = !!def.pits || G.ents.some(e => ETYPE[e.t] && ETYPE[e.t].demon);
  if (!G.isle) return; islandGfx();
  for (const e of G.ents) { if (e.t === 'hbr') e.r = 6; if (e.t === 'mrw') { e.r = 10; e.volT = 2.5; e.sumT = 7; } }
}
// ---------- fireballs: fiends and Marrow throw them; shoot them down or bat them back ----------
function hurlFireball(e, a, sp, big, byP) {
  if (a === undefined) a = e.a; const ox = e.x + Math.cos(a) * 9, oy = e.y + Math.sin(a) * 9; if (wallAt(ox, oy)) return;
  G.fireballs.push({ x: ox, y: oy, vx: Math.cos(a) * (sp || 165), vy: Math.sin(a) * (sp || 165), src: e, t: 0, big: !!big, own: byP ? 'p' : 'e' }); sfx('fireball', e.x, e.y);
}
function fireballBurst(f, patch) {
  const R = f.big ? 12 : 9;
  for (let i = 0; i < (f.big ? 26 : 16); i++) { const a = rr(0, TAU), s = rr(40, 200); part(f.x, f.y, Math.cos(a) * s, Math.sin(a) * s, rr(0.2, 0.5), pick(['#ffe14d', '#ff8a1c', '#ff3b1c', '#fff', '#3a1a10']), ri(1, 2)); }
  const d = M.decX; d.fillStyle = 'rgba(14,6,4,0.5)'; d.beginPath(); d.arc(f.x, f.y, R * 0.7, 0, 6.29); d.fill();
  if (patch) { G.hellfire.push({ x: f.x, y: f.y, t: 0, life: f.big ? 3 : 2.2, r: R }); G.dfx.push({ k: 'fire', x: f.x, y: f.y, t: 0, life: f.big ? 3 : 2.2 }); }
  sfx('burn', f.x, f.y); G.shake = Math.max(G.shake, f.big ? 0.35 : 0.2);
}
function fireballTick(dt) {
  const P = G.player;
  for (const f of G.fireballs) {
    f.t += dt; const nx = f.x + f.vx * dt, ny = f.y + f.vy * dt;
    if (Math.random() < 0.8) part(f.x, f.y, rr(-30, 30) - f.vx * 0.15, rr(-30, 30) - f.vy * 0.15, rr(0.15, 0.35), pick(['#ffe14d', '#ff8a1c', '#ff3b1c', '#5a1a10']), ri(1, 2));
    let hitWall = wallAt(nx, ny) || f.t > 4;
    if (!hitWall) for (const dr of M.doors) { const s = doorEnds(dr); if (segX(f.x, f.y, nx, ny, s[0], s[1], s[2], s[3]) >= 0) { hitWall = true; break; } }
    if (hitWall) { fireballBurst(f, true); f.rem = true; continue; }
    f.x = nx; f.y = ny;
    // a bullet knocks it out of the air
    for (const b of G.bullets) if (b.owner === 'p' && !b.rem && Math.hypot(b.x - f.x, b.y - f.y) < (f.big ? 7 : 5.5)) { b.rem = true; f.rem = true; fireballBurst(f, false); pop(f.x, f.y, 'SHOT DOWN', '#ffe14d'); break; }
    if (f.rem) continue;
    if (f.own === 'e') {
      // a melee swing at the right moment sends it back where it came from
      if (P.swingT > 0 && !P.dead && Math.hypot(P.x - f.x, P.y - f.y) < 24 && Math.abs(angDiff(Math.atan2(f.y - P.y, f.x - P.x), P.a)) < 1.3) {
        f.own = 'p'; const sp = Math.hypot(f.vx, f.vy) * 1.5; f.vx = Math.cos(P.a) * sp; f.vy = Math.sin(P.a) * sp; f.t = 0; sfx('tink', f.x, f.y); pop(f.x, f.y - 6, 'RETURNED', '#4ff'); G.hitStop = Math.max(G.hitStop, 0.05); continue;
      }
      if (!P.dead && Math.hypot(P.x - f.x, P.y - f.y) < P.r + (f.big ? 5 : 3.5)) { if (hurtPlayer(f.src, Math.atan2(f.vy, f.vx))) toast('BURNED ALIVE. SHOOT THE FIREBALLS OR SWING AT THEM TO KNOCK THEM BACK.'); fireballBurst(f, true); f.rem = true; }
    } else {
      for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || Math.hypot(e.x - f.x, e.y - f.y) > e.r + 4) continue;
        if (ETYPE[e.t].boss) { e.hp -= f.big ? 4 : 3; e.hitT = 0.15; pop(e.x, e.y - 8, String(Math.max(0, e.hp)), '#ffe14d'); if (e.hp <= 0) killE(e, 'shotgun', Math.atan2(f.vy, f.vx), true, 'hellfire'); }
        else killE(e, 'shotgun', Math.atan2(f.vy, f.vx), true, 'hellfire');
        fireballBurst(f, true); f.rem = true; break; }
    }
  }
  G.fireballs = G.fireballs.filter(f => !f.rem);
  // the burning patches they leave behind hurt you, not them
  for (const h of G.hellfire) { h.t += dt; if (h.t < h.life - 0.2 && !P.dead && Math.hypot(P.x - h.x, P.y - h.y) < h.r + P.r - 2) { if (hurtPlayer(null, Math.atan2(P.y - h.y, P.x - h.x))) toast('BURNED. DON\'T STAND IN THE HELLFIRE.'); } }
  G.hellfire = G.hellfire.filter(h => h.t < h.life);
}
// ---------- the gore: demons don't die, they come apart ----------
const GORE_WORDS = ['SPLATTERED', 'GIBBED', 'TORN APART', 'OVERKILL', 'PAINTED THE WALLS', 'UNMADE', 'DEMOLISHED', 'RIPPED'];
function demonGore(e, how, ang, method) {
  const S = GFX.ch[e.t], big = !!ETYPE[e.t].boss, K = big ? 2.4 : 1, d = M.decX, hx = e.x + Math.cos(ang) * 6, hy = e.y + Math.sin(ang) * 6;
  const boom = method === 'rocket' || method === 'frag' || method === 'barrel' || method === 'hellfire' || how === 'shotgun';
  if (boom) { addBody(e.x, e.y, ang + rr(-0.4, 0.4), S.burnt, 210, ang, rr(-6, 6), mkPool(12)); addBody(hx, hy, rr(0, TAU), S.headSpr, 300, ang + rr(-0.6, 0.6), rr(-18, 18), mkPool(4)); }
  else if (how === 'cut' || Math.random() < 0.5) { // halves go one way, the head goes another
    addBody(e.x + Math.cos(ang) * 2, e.y + Math.sin(ang) * 2, ang + rr(-0.5, 0.5), S.top, 170, ang + rr(-0.3, 0.3), rr(-6, 6), mkPool(10));
    addBody(e.x - Math.cos(ang) * 2, e.y - Math.sin(ang) * 2, ang + rr(-0.5, 0.5), S.bot, 60, ang + rr(-0.8, 0.8), rr(-3, 3), mkPool(9));
    if (Math.random() < 0.6) addBody(hx, hy, rr(0, TAU), S.headSpr, 260, ang + rr(-0.7, 0.7), rr(-16, 16), mkPool(4));
  } else { addBody(e.x, e.y, ang + rr(-0.4, 0.4), S.decap, 110, ang + rr(-0.3, 0.3), rr(-3, 3), mkPool(11)); addBody(hx, hy, rr(0, TAU), S.headSpr, 280, ang + rr(-0.5, 0.5), rr(-18, 18), mkPool(4)); }
  const parts = [GORE.meat, GORE.meat2, GORE.gut, GORE.bone, GORE.brain2, GORE.skull, GORE.gut];
  for (let i = 0; i < Math.round((boom ? 12 : 8) * K); i++) chunk(e.x, e.y, ang, boom ? 3.1 : 1.5, pick(parts), boom ? 1.7 : 1.4);
  for (let i = 0; i < 2; i++) chunk(hx, hy, ang, 2, GFX.horn, 1.6);
  gibs(e.x, e.y, ang, Math.round(34 * K), boom ? 3.1 : 1.3); gibs(e.x, e.y, ang + Math.PI, Math.round(10 * K), 1.2);
  splat(e.x, e.y, ang, 28, true); splat(e.x, e.y, ang + Math.PI, 12, true); splat(hx + Math.cos(ang) * 14, hy + Math.sin(ang) * 14, ang, 16, true);
  wallSplat(e.x, e.y, ang, Math.round(26 * K)); wallSplat(e.x, e.y, ang + Math.PI, Math.round(10 * K)); wallSplat(e.x, e.y, ang + Math.PI / 2, Math.round(6 * K)); wallSplat(e.x, e.y, ang - Math.PI / 2, Math.round(6 * K));
  d.fillStyle = '#1a0406'; for (let i = 0; i < 10 * K; i++) { d.beginPath(); d.ellipse(e.x + Math.cos(ang) * rr(0, 22 * K) + rr(-6, 6), e.y + Math.sin(ang) * rr(0, 22 * K) + rr(-6, 6), rr(1.5, 4), rr(1, 3), rr(0, 3), 0, 6.29); d.fill(); }
  for (let i = 0; i < 18 * K; i++) { const a = rr(0, TAU), s = rr(60, 260); part(e.x, e.y, Math.cos(a) * s, Math.sin(a) * s, rr(0.3, 0.8), pick(['#ff8a1c', '#ffe14d', '#ff3b1c']), 1); }
  G.fountains.push({ x: e.x, y: e.y, t: 0, life: rr(1.2, 1.8) * (big ? 2.5 : 1), a: ang, k: K });
  G.shake = Math.max(G.shake, big ? 1.4 : 0.8); G.hitStop = Math.max(G.hitStop, big ? 0.2 : 0.07); G.flash = Math.max(G.flash, big ? 0.4 : 0.1);
  pop(e.x, e.y - 12, big ? 'ANNIHILATED' : pick(GORE_WORDS), '#ff3b4e'); sfx('squelch', e.x, e.y);
}
// blood keeps pumping out of what's left for a second or two
function fountainTick(dt) {
  for (const f of G.fountains) {
    f.t += dt; const pulse = 0.5 + 0.5 * Math.sin(f.t * 14), n = Math.round((2 + pulse * 3) * f.k);
    for (let i = 0; i < n; i++) { const a = f.a + rr(-1.4, 1.4) + (Math.random() < 0.3 ? Math.PI : 0), s = rr(50, 230) * (1 - f.t / f.life * 0.6); part(f.x + rr(-3, 3), f.y + rr(-3, 3), Math.cos(a) * s, Math.sin(a) * s, rr(0.2, 0.5), pick(['#c00a14', '#8a0610', '#ff2a2a', '#6e0a12']), rr(0.8, 2), 1); }
    if (Math.random() < dt * 8) splat(f.x + rr(-14, 14) * f.k, f.y + rr(-14, 14) * f.k, rr(0, TAU), 4, false);
  }
  G.fountains = G.fountains.filter(f => f.t < f.life);
}
// ---------- Marrow ----------
function marrowTick(e, dt) {
  const P = G.player; if (e.st === 'idle' || e.st === 'patrol' || P.dead) return;
  e.volT -= dt; e.sumT -= dt;
  if (!e.rage && e.hp <= 22) {
    e.rage = true; e.volT = 1; banner('MARROW SHEDS WHAT WAS LEFT OF THE MAN', '#ff3b4e'); toast('HE\'S ANGRY NOW. MORE FIRE, MORE DEMONS. KEEP MOVING.'); sfx('roar', e.x, e.y); G.shake = 1.2; G.flash = 0.3;
    for (let i = 0; i < 14; i++) hurlFireball(e, i / 14 * TAU, 120, true);
    splat(e.x, e.y, rr(0, TAU), 20, true); for (let i = 0; i < 4; i++) chunk(e.x, e.y, rr(0, TAU), 3.1, pick([GORE.meat, GORE.meat2]), 1.2);
  }
  if (e.volT <= 0 && e.sees) {
    e.volT = e.rage ? 2.3 : 3.4; const a = Math.atan2(P.y - e.y, P.x - e.x), n = e.rage ? 7 : 5;
    for (let i = 0; i < n; i++) hurlFireball(e, a + (i - (n - 1) / 2) * 0.2, 150, true);
    e.atk = { k: 'rec', t: 0, d: 0.3 }; sfx('roar', e.x, e.y);
  }
  if (e.sumT <= 0 && G.pits.length) {
    e.sumT = e.rage ? 7 : 10; const alive = G.ents.filter(o => o.st !== 'dead' && ETYPE[o.t].demon && !ETYPE[o.t].boss).length;
    if (alive < 8) { const far = G.pits.filter(p => Math.hypot(p.x - P.x, p.y - P.y) > 70), use = (far.length ? far : G.pits).slice().sort(() => Math.random() - 0.5).slice(0, e.rage ? 3 : 2);
      for (const p of use) { const t = e.rage && Math.random() < 0.4 ? 'fnd' : 'imp', o = spawnEnemy(t, p.x, p.y, t === 'fnd' ? 'hellfire' : 'claw', rr(0, TAU)); o.st = 'alert'; o.react = 0.8; o.lx = P.x; o.ly = P.y; p.glow = 1.2;
        for (let i = 0; i < 24; i++) part(p.x, p.y, rr(-120, 120), rr(-120, 120), rr(0.3, 0.7), pick(['#ff3b1c', '#ff8a1c', '#8a0610', '#1a0406']), ri(1, 2)); splat(p.x, p.y, rr(0, TAU), 8, true); }
      G.cleared = false; banner('THE PITS ARE OPENING', '#ff3b4e'); sfx('roar', P.x, P.y); }
  }
  if (Math.random() < dt * 20) part(e.x + rr(-8, 8), e.y + rr(-8, 8), rr(-20, 20), rr(-60, -20), rr(0.3, 0.6), pick(['#ff8a1c', '#ff3b1c', '#ffe14d']), 1);
}
// when Marrow dies, everything he called up comes apart with him
function marrowDown() {
  G.mrwDown = true; let k = 0; toast('EVERYTHING HE CALLED UP IS COMING APART.');
  for (const e of G.ents) if (e.st !== 'dead' && ETYPE[e.t].demon) G.goreChain.push({ e: e, t: 0.35 + k++ * 0.22 });
}
function islandUpdate(dt) {
  if (!G.isle) return; const P = G.player;
  fireballTick(dt); fountainTick(dt);
  for (const e of G.ents) { if (e.st === 'dead') continue; const T = ETYPE[e.t];
    if (T.demon && !e.roared && e.st === 'alert') { e.roared = 1; if (Math.random() < 0.5 || T.boss) sfx('roar', e.x, e.y); }
    if (e.t === 'mrw') marrowTick(e, dt); }
  if (!G.mrwDown && G.ents.some(e => e.t === 'mrw' && e.st === 'dead')) marrowDown();
  for (const c of G.goreChain) { c.t -= dt; if (c.t <= 0 && !c.done) { c.done = true; if (c.e.st !== 'dead') killE(c.e, 'shotgun', rr(0, TAU), true, 'rocket'); } }
  G.goreChain = G.goreChain.filter(c => !c.done);
  for (const p of G.pits) p.glow = Math.max(0, p.glow - dt);
}
// ---------- drawing ----------
function drawIslandLow(x) {
  if (!G.isle) return;
  for (const p of G.pits) { const k = 0.5 + 0.3 * Math.sin(G.time * 3 + p.x) + p.glow * 0.5;
    x.fillStyle = `rgba(120,8,8,${0.25 + 0.2 * k})`; x.beginPath(); x.arc(p.x, p.y, 11, 0, 6.29); x.fill();
    x.strokeStyle = `rgba(255,60,30,${0.5 + 0.4 * k})`; x.lineWidth = 0.8; x.beginPath(); x.arc(p.x, p.y, 11, 0, 6.29); x.stroke(); x.beginPath(); x.arc(p.x, p.y, 7.5, 0, 6.29); x.stroke();
    x.beginPath(); for (let i = 0; i < 4; i++) { const a = G.time * 0.4 + i * TAU / 3; if (i) x.lineTo(p.x + Math.cos(a) * 7.5, p.y + Math.sin(a) * 7.5); else x.moveTo(p.x + Math.cos(a) * 7.5, p.y + Math.sin(a) * 7.5); } x.stroke();
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU - G.time * 0.3; x.fillStyle = '#ff5a1a'; x.fillRect(p.x + Math.cos(a) * 9.3 - 0.5, p.y + Math.sin(a) * 9.3 - 0.5, 1, 1); } }
  for (const h of G.hellfire) { const a = Math.min(1, (h.life - h.t) * 2); for (let i = 0; i < 3; i++) { x.fillStyle = `rgba(255,${80 + i * 50},20,${0.25 * a})`; x.beginPath(); x.arc(h.x + Math.sin(G.time * 9 + i) * 1.5, h.y + Math.cos(G.time * 7 + i) * 1.5, h.r * (1 - i * 0.28), 0, 6.29); x.fill(); } }
}
function drawIslandHigh(x) {
  if (!G.isle || !G.fireballs.length) return;
  for (const f of G.fireballs) { const R = f.big ? 4.5 : 3.4;
    x.fillStyle = 'rgba(255,90,20,0.25)'; x.beginPath(); x.arc(f.x, f.y, R * 2.2, 0, 6.29); x.fill();
    x.fillStyle = f.own === 'p' ? '#4ff' : '#ff3b1c'; x.beginPath(); x.arc(f.x, f.y, R, 0, 6.29); x.fill();
    x.fillStyle = '#ffd040'; x.beginPath(); x.arc(f.x, f.y, R * 0.6, 0, 6.29); x.fill(); x.fillStyle = '#fff'; x.fillRect(f.x - 0.7, f.y - 0.7, 1.4, 1.4); }
}
// Marrow is drawn half again as big as a man, with heat coming off him
function drawHorned(x, e) {
  const k = 0.5 + 0.5 * Math.sin(G.time * 5); x.fillStyle = `rgba(255,40,20,${0.12 + 0.08 * k})`; x.beginPath(); x.arc(e.x, e.y, 18, 0, 6.29); x.fill();
  x.save(); x.translate(e.x, e.y); x.scale(1.7, 1.7); x.translate(-e.x, -e.y); drawChar(x, e); x.restore();
}
