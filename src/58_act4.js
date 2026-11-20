// ---------- Act 4 mechanics: laser grids, gas (shares the fire spreader), The Chair and his combat suit ----------
Object.assign(ETYPE, {
  brd: { name: 'BOARD MEMBER', spd: 92, pat: 40, react: 0.6 },
  chr: { name: 'THE CHAIR - COMBAT SUIT', spd: 58, pat: 30, react: 0.35, hp: 30, armor: 1, boss: 1 },
  chr2: { name: 'THE CHAIR', spd: 112, pat: 40, react: 0.25, hp: 8, armor: 1, boss: 1, strafe: 1 },
});
Object.assign(CHARS, {
  brd: { jacket: '#2a2a3a', boots: '#0a0a0a', skin: SKINS[3], hair: '#6a5a4a', legs: '#1e1e28', stripe: '#c8a040', implant: '#c8a040' },
  chr: { bar: '#ff3b4e', jacket: '#121216', boots: '#0a0a0a', skin: SKINS[0], hair: '#a8a8ac', legs: '#0e0e12', stripe: '#ff3b4e', implant: '#ff3b4e' },
});
CHARS.chr2 = CHARS.chr;
Object.assign(LOOKS, { brd: { hairStyle: 'slick', collar: '#e8e4dc', tie: '#c8a040' }, chr: { hairStyle: 'slick', collar: '#e8e4dc', tie: '#ff3b4e' } });
LOOKS.chr2 = LOOKS.chr;
Object.assign(Builder.prototype, { laser(x1, y1, x2, y2, on, off, ph) { (this.lasers = this.lasers || []).push({ x1: x1, y1: y1, x2: x2, y2: y2, on: on || 2, off: off || 1.6, ph: ph || 0 }); return this; } });
function act4Gfx() {
  if (GFX.mech) return;
  GFX.mech = hdc(spr(72, 64, P => { const C = 36, M = 32;
    P.r(10, 12, 40, 40, '#140c10'); P.r(12, 14, 36, 36, '#3a3e46'); P.r(12, 14, 36, 4, '#6a6e78'); P.r(12, 46, 36, 4, '#22252c'); for (const y of [22, 30, 38]) P.r(14, y, 32, 1, '#2a2e36');
    P.r(14, 16, 6, 6, '#ff3b4e'); P.r(14, 42, 6, 6, '#ff3b4e'); P.d(38, M, 10, 10, '#140c10'); P.d(38, M, 9, 9, '#2a5a6a'); P.d(39, M - 2, 5, 4, '#8ad8e8'); P.d(36, M, 4, 4, SKINS[0]); P.d(35, M, 3, 3.6, '#a8a8ac');
    P.r(30, 2, 26, 10, '#140c10'); P.r(31, 3, 24, 8, '#4a4e58'); for (let i = 0; i < 3; i++) { P.r(52, 3 + i * 3, 18, 2, '#140c10'); P.r(52, 4 + i * 3, 17, 1, '#8a8f99'); } P.r(34, 4, 8, 6, '#2a2e36');
    P.r(26, 52, 22, 11, '#140c10'); P.r(27, 53, 20, 9, '#4a4e58'); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { P.d(31 + i * 6, 55 + j * 4, 2, 2, '#140c10'); P.p(31 + i * 6, 55 + j * 4, '#ff7a1a'); }
    P.r(0, 26, 12, 12, '#140c10'); P.r(1, 27, 10, 10, '#5a5e66'); P.p(3, 29, '#ffd040'); }));
  GFX.mechFoot = hdc(spr(16, 12, P => { P.r(0, 0, 16, 12, '#140c10'); P.r(1, 1, 14, 10, '#4a4e58'); P.r(1, 1, 14, 2, '#7a7e88'); P.r(11, 3, 4, 6, '#2a2e36'); }));
  GFX.mechWreck = hdc(spr(72, 64, P => { for (let i = 0; i < 14; i++) { const x = 8 + (i * 23) % 56, y = 8 + (i * 17) % 48; P.r(x, y, 10, 6, '#140c10'); P.r(x + 1, y + 1, 8, 4, i % 3 ? '#3a3e46' : '#5a5e66'); } P.d(36, 32, 12, 10, '#140c10'); P.d(36, 32, 10, 8, '#22252c'); P.p(36, 32, '#ff7a1a'); P.p(30, 28, '#ff7a1a'); }));
}
function act4Init(def) {
  const b = M.b; G.lasers = (b.lasers || []).map(l => ({ ax: (l.x1 + 0.5) * CELL, ay: (l.y1 + 0.5) * CELL, bx: (l.x2 + 0.5) * CELL, by: (l.y2 + 0.5) * CELL, on: l.on, off: l.off, t: l.ph, live: false, warn: false }));
  G.lasersOff = false; G.gasOff = false; G.strikes = []; if (G.ents.some(e => e.t === 'chr')) act4Gfx();
}
// ---------- laser grids ----------
function laserTick(dt) {
  if (G.lasersOff) return; const P = G.player;
  for (const L of G.lasers) { L.t += dt; const cyc = L.on + L.off, m = L.t % cyc, was = L.live; L.live = m < L.on; L.warn = !L.live && m > cyc - 0.45; if (L.live && !was) sfx('zap', (L.ax + L.bx) / 2, (L.ay + L.by) / 2);
    if (!L.live) continue;
    if (!P.dead && segDist(P.x, P.y, L.ax, L.ay, L.bx, L.by)[0] < 3.2) { if (hurtPlayer(null, Math.atan2(L.by - L.ay, L.bx - L.ax) + Math.PI / 2)) toast('CUT BY THE LASER GRID. TIME THE GAPS.'); }
    for (const e of G.ents) if (e.st !== 'dead' && e.st !== 'freed' && !ETYPE[e.t].boss && segDist(e.x, e.y, L.ax, L.ay, L.bx, L.by)[0] < 3.2) killE(e, 'cut', Math.atan2(L.by - L.ay, L.bx - L.ax) + Math.PI / 2, false, 'laser'); }
}
// ---------- The Chair ----------
function chairTick(dt) {
  const P = G.player;
  for (const e of G.ents) { if (e.st === 'dead') continue;
    if (e.t === 'chr') {
      e.stepT = (e.stepT || 0) + Math.hypot(e.vx || 0, e.vy || 0) * dt * 0.08;
      if (e.st !== 'idle' && e.st !== 'patrol' && !G.player.dead) { e.rockT = (e.rockT === undefined ? 3 : e.rockT) - dt; if (e.rockT <= 0) { e.rockT = 6.5; sfx('charge', e.x, e.y); banner('ROCKETS INCOMING', '#ff3b4e'); for (const [ox, oy] of [[0, 0], [rr(-40, -20), rr(-30, 30)], [rr(20, 40), rr(-30, 30)]]) G.strikes.push({ x: P.x + ox, y: P.y + oy, t: 1.3, T: 1.3 }); } }
      if (e.hp <= 15) { // the suit gives out and he climbs out of it
        e.t = 'chr2'; e.hp = ETYPE.chr2.hp; e.wpn = e.w0 = 'smart'; e.r = 6; e.st = 'alert'; e.lx = P.x; e.ly = P.y;
        sfx('explode', e.x, e.y); G.shake = 1; G.flash = 0.3; dRot(M.decX, GFX.mechWreck, e.x, e.y, e.a); for (let i = 0; i < 40; i++) part(e.x, e.y, rr(-220, 220), rr(-220, 220), rr(0.2, 0.7), pick(['#ff7a1a', '#ffe14d', '#3a3e46', '#8a8f99', '#fff']), ri(1, 3), 1);
        G.dfx.push({ k: 'fire', x: e.x + 6, y: e.y + 4, t: 0, life: 12 }); banner('THE SUIT IS DOWN - HE\'S CLIMBING OUT', '#ffe14d'); toast('HE\'S FAST NOW. DON\'T LET HIM GET BEHIND THE TABLE.');
        GFX.ch.chr2 = GFX.ch.chr2 || charSet('chr2');
      }
    }
  }
  for (const s of G.strikes) { s.t -= dt; if (s.t <= 0 && !s.done) { s.done = true; explode(s.x, s.y, 22, false, 'rocket'); } }
  G.strikes = G.strikes.filter(s => !s.done);
}
function act4Update(dt) { if (!G.lasers) return; laserTick(dt); chairTick(dt); }
// ---------- drawing ----------
function drawAct4Low(x) {
  if (!G.lasers) return;
  for (const L of G.lasers) {
    if (!inView((L.ax + L.bx) / 2, (L.ay + L.by) / 2, 200)) continue;
    for (const [px, py] of [[L.ax, L.ay], [L.bx, L.by]]) { x.fillStyle = '#140c10'; x.fillRect(px - 2.5, py - 2.5, 5, 5); x.fillStyle = G.lasersOff ? '#3a3e46' : L.live ? '#ff3b4e' : '#5a1a20'; x.fillRect(px - 1.5, py - 1.5, 3, 3); }
    if (G.lasersOff) continue;
    if (L.live) { x.strokeStyle = 'rgba(255,40,60,0.35)'; x.lineWidth = 3.5; x.beginPath(); x.moveTo(L.ax, L.ay); x.lineTo(L.bx, L.by); x.stroke(); x.strokeStyle = '#ffd0d4'; x.lineWidth = 0.8; x.stroke(); }
    else { x.strokeStyle = L.warn && (G.time * 16 | 0) % 2 ? 'rgba(255,59,78,0.8)' : 'rgba(255,59,78,0.15)'; x.lineWidth = 0.5; x.setLineDash([2, 3]); x.beginPath(); x.moveTo(L.ax, L.ay); x.lineTo(L.bx, L.by); x.stroke(); x.setLineDash([]); }
  }
  for (const s of G.strikes) { const k = 1 - s.t / s.T; x.strokeStyle = `rgba(255,59,78,${0.4 + 0.5 * k})`; x.lineWidth = 1; x.beginPath(); x.arc(s.x, s.y, 22, 0, 6.29); x.stroke(); x.fillStyle = `rgba(255,59,78,${0.08 + 0.2 * k})`; x.beginPath(); x.arc(s.x, s.y, 22 * k, 0, 6.29); x.fill(); x.fillStyle = '#ff3b4e'; x.fillRect(s.x - 3, s.y - 0.5, 6, 1); x.fillRect(s.x - 0.5, s.y - 3, 1, 6); }
}
function drawSuit(x, e) {
  if (e.t === 'mrw') { drawHorned(x, e); return; }
  const st = e.stepT || 0, ca = Math.cos(e.a), sa = Math.sin(e.a), px = -sa, py = ca;
  x.fillStyle = 'rgba(0,0,0,0.35)'; x.beginPath(); x.ellipse(e.x + 4, e.y + 5, 17, 15, 0, 0, 6.29); x.fill();
  for (const sd of [-1, 1]) { const f = Math.sin(st * 6 + (sd > 0 ? Math.PI : 0)) * 6; dRot(x, GFX.mechFoot, e.x + px * sd * 10 + ca * f, e.y + py * sd * 10 + sa * f, e.a); }
  dRot(x, GFX.mech, e.x, e.y, e.a);
  if (e.hitT > 0) { x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.5; dRot(x, GFX.mech, e.x, e.y, e.a); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
}
function skipCharDraw(e) { return e.t === 'chr' || e.t === 'mrw'; }
