// ---------- new weapons: bat, sledgehammer, fire axe, bottle (breaks into a shard), silenced pistol, assault rifle, flare gun ----------
Object.assign(WEAPONS, {
  bat: { name: 'BAT', melee: 1, len: 10, c: '#d89a4a', acc: '#1c1c20', cd: 0.34, reach: 27, blunt: 1, kd: 0.7 },
  sledge: { name: 'SLEDGEHAMMER', melee: 1, len: 12, c: '#45454d', acc: '#8a6626', cd: 0.62, reach: 29, blunt: 1, kd: 0, crush: 1, heavy: 1, breaker: 1 },
  axe: { name: 'FIRE AXE', melee: 1, len: 12, c: '#b8241c', acc: '#b4bac4', cd: 0.46, reach: 28, sharp: 1, decap: 1, breaker: 1 },
  bottle: { name: 'BOTTLE', melee: 1, len: 8, c: '#2a6a32', acc: '#e8e0c0', cd: 0.28, reach: 23, blunt: 1, kd: 0.5, breaks: 'shard' },
  shard: { name: 'BROKEN BOTTLE', melee: 1, len: 6, c: '#2a6a32', acc: '#9ee8ff', cd: 0.24, reach: 21, sharp: 1 },
  silp: { name: 'SILENCED PISTOL', len: 7, c: '#1e1e22', acc: '#45454d', ammo: 8, cd: 0.3, spread: 0.03, pellets: 1, noise: 70, quiet: 1 },
  ar: { name: 'ASSAULT RIFLE', len: 10, c: '#2c2c32', acc: '#7a2e12', ammo: 24, cd: 0.11, spread: 0.05, pellets: 1, noise: 380, auto: 1, two: 1 },
  flare: { name: 'FLARE GUN', len: 5, c: '#f07a14', acc: '#3a1a08', ammo: 2, cd: 0.6, spread: 0.01, pellets: 1, noise: 240, flare: 1, noAI: 1 },
});
Object.assign(WD, {
  bat: { g: [4, 7], f: [8, 7], d: P => { P.r(1, 6, 1, 3, '#d89a4a'); P.r(2, 6, 7, 2, '#1c1c20'); P.p(4, 6, '#444'); for (let x = 9; x < 27; x++) { const h = 2 + Math.round((x - 9) / 6); P.r(x, 7 - (h >> 1), 1, h, '#d89a4a'); P.p(x, 7 - (h >> 1), '#f4c27a'); } P.r(27, 5, 1, 4, '#c88a3a'); P.p(14, 6, GL); P.p(21, 6, GL); } },
  sledge: { g: [5, 7], f: [12, 7], d: P => { P.r(1, 6, 22, 2, WTN[1]); P.r(1, 6, 22, 1, WTN[2]); P.r(1, 6, 5, 2, '#1c1c20'); P.r(22, 2, 7, 10, M2); P.r(22, 2, 7, 1, M3); P.r(22, 11, 7, 1, M1); P.r(23, 2, 1, 10, M3); P.p(25, 4, GL); } },
  axe: { g: [5, 7], f: [12, 7], d: P => { P.r(1, 6, 22, 2, '#b8241c'); P.r(1, 6, 22, 1, '#e04a3a'); P.r(1, 6, 4, 2, '#1c1c20'); P.r(20, 3, 4, 6, M2); P.r(24, 1, 3, 10, STL[1]); P.r(26, 0, 2, 12, STL[2]); P.r(18, 4, 2, 3, M2); P.p(25, 3, GL); } },
  bottle: { g: [5, 7], d: P => { P.r(3, 6, 6, 3, '#2e7a3a'); P.r(2, 6, 1, 3, '#c8a040'); P.r(9, 5, 3, 5, '#2e7a3a'); P.r(12, 4, 12, 7, '#2a6a32'); P.r(12, 4, 12, 1, '#5aaa62'); P.r(15, 6, 6, 3, '#e8e0c0'); P.p(16, 7, '#c82a2a'); P.p(13, 5, GL); P.p(22, 5, GL); } },
  shard: { g: [5, 7], d: P => { P.r(3, 6, 6, 3, '#2e7a3a'); P.r(2, 6, 1, 3, '#c8a040'); P.r(9, 5, 3, 5, '#2e7a3a'); P.r(12, 4, 4, 7, '#2a6a32'); P.r(12, 4, 4, 1, '#5aaa62'); P.r(16, 4, 3, 2, '#3a8a44'); P.p(19, 4, '#9ee8ff'); P.r(16, 7, 2, 1, '#3a8a44'); P.r(16, 9, 4, 2, '#3a8a44'); P.p(20, 10, '#9ee8ff'); P.p(13, 5, GL); } },
  silp: { g: [5, 9], m: 25, d: P => { wbar(P, 4, 5, 12, 3, M1); P.r(16, 5, 9, 3, '#1e1e22'); P.r(16, 5, 9, 1, M2); P.r(5, 8, 7, 1, M1); P.r(4, 8, 4, 2, M1); P.r(3, 10, 4, 3, M1); P.r(3, 10, 1, 3, M2); P.r(8, 9, 3, 1, M0); wdots(P, 6, 14, 5, 4); P.p(20, 5, GL); } },
  ar: { g: [12, 9], f: [22, 8], m: 36, d: P => { wstock(P, 1, 5, 9, WRD); wbar(P, 10, 4, 10, 4, M1); P.r(20, 5, 7, 3, WRD[1]); P.r(20, 5, 7, 1, WRD[2]); P.r(27, 5, 9, 1, M1); P.p(33, 4, M1); P.r(12, 8, 2, 3, M1); P.r(15, 8, 3, 2, M2); P.r(16, 10, 3, 2, M2); P.r(17, 12, 2, 1, M2); wdots(P, 12, 18, 4, 3); P.p(31, 5, GL); } },
  flare: { g: [5, 9], m: 17, d: P => { wbar(P, 4, 4, 9, 4, '#f07a14'); P.r(13, 4, 4, 4, '#d06010'); P.r(14, 5, 2, 2, '#3a1a08'); P.r(3, 8, 4, 5, '#f07a14'); P.r(3, 8, 1, 5, '#ffa850'); P.r(8, 8, 3, 1, M0); P.p(7, 4, GL); } },
});
Object.assign(SFX, {
  silp: (t, v) => { nz(t, 0.08, 'lowpass', 900, 300, 1, 0.5 * v); tone(t, 0.05, 'sine', 160, 60, 0.15 * v); nz(t + 0.01, 0.04, 'highpass', 5000, 4000, 1, 0.08 * v); },
  arifle: (t, v) => { nz(t, 0.12, 'bandpass', 1800, 400, 0.8, 1.0 * v); tone(t, 0.07, 'square', 220, 60, 0.25 * v); },
  flare: (t, v) => { nz(t, 0.35, 'bandpass', 1400, 600, 1.5, 0.7 * v); tone(t, 0.3, 'sawtooth', 420, 120, 0.08 * v); },
  burn: (t, v) => { nz(t, 0.5, 'lowpass', 1600, 400, 1, 0.5 * v); },
  bottle: (t, v) => { for (let i = 0; i < 5; i++) tone(t + i * 0.02, 0.12, 'triangle', 1800 + Math.random() * 2400, 1200, 0.08 * v); nz(t, 0.2, 'highpass', 4000, 2500, 1, 0.5 * v); },
});
// a bottle shatters on its first hit and leaves you holding the jagged neck
function bottleBreak(e) {
  const W = WEAPONS[e.wpn]; if (!W || !W.breaks) return; e.wpn = W.breaks; if (e.kind === 'e') e.w0 = e.wpn; sfx('bottle', e.x, e.y);
  const hx = e.x + Math.cos(e.a) * 12, hy = e.y + Math.sin(e.a) * 12; for (let i = 0; i < 12; i++) part(hx, hy, rr(-120, 120), rr(-120, 120), rr(0.2, 0.45), pick(['#3a8a44', '#5aaa62', '#9ee8ff', '#fff']), 1, 1);
  if (e.kind === 'p') pop(e.x, e.y - 10, 'BROKEN BOTTLE', '#9ee8ff');
}
// heavy weapons smash doors off their hinges; the sledgehammer also caves in cracked walls
function breakerSwing(e, W) {
  if (!W || !W.breaker) return; const reach = W.reach + 2, fx = e.x + Math.cos(e.a) * reach * 0.6, fy = e.y + Math.sin(e.a) * reach * 0.6;
  for (const dr of M.doors.slice()) { const s = doorEnds(dr), [dd] = segDist(fx, fy, s[0], s[1], s[2], s[3]); if (dd < reach * 0.55) { blowDoor(dr, e.a); if (e.kind === 'p') { G.stats.doors = (G.stats.doors || 0); pop(fx, fy, W.crush ? 'SMASHED' : 'CHOPPED', '#ffe14d'); } } }
  if (W.crush) for (const s of M.weak.slice()) if (Math.hypot(s.x - fx, s.y - fy) < reach * 0.7) breakWeak(s);
}
// flare rounds start fires; fire burns enemies who walk into it
function igniteAt(x, y, byP, life) {
  if (solidAt(x, y)) return; G.dfx.push({ k: 'fire', x: x, y: y, t: 0, life: life || 4.5, burn: 11, byP: byP }); sfx('burn', x, y);
  for (let i = 0; i < 16; i++) part(x, y, rr(-90, 90), rr(-90, 90), rr(0.2, 0.5), pick(['#ffe14d', '#ff8a1c', '#ff3b1c', '#fff']), ri(1, 2));
  const d = M.decX; d.fillStyle = 'rgba(14,8,6,0.5)'; d.beginPath(); d.arc(x, y, 7, 0, 6.29); d.fill();
}
function fireTick(dt) {
  for (const f of G.dfx) { if (!f.burn || f.t > f.life - 0.3) continue;
    for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || ETYPE[e.t].boss || Math.hypot(e.x - f.x, e.y - f.y) > f.burn + e.r) continue; killE(e, 'shot', Math.atan2(e.y - f.y, e.x - f.x), f.byP, 'flare'); } }
}
