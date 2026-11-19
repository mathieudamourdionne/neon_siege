// ---------- synthesized sound effects & music (WebAudio, no files) ----------
const AU = { ctx: null, master: null, sfxG: null, musG: null, noise: null, on: true, mus: true };
function audioInit() {
  try {
    if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const c = AU.ctx = new C();
    AU.master = c.createGain(); AU.master.gain.value = 0.8; AU.master.connect(c.destination);
    const comp = c.createDynamicsCompressor(); comp.connect(AU.master);
    AU.sfxG = c.createGain(); AU.sfxG.gain.value = 0.9; AU.sfxG.connect(comp);
    AU.musG = c.createGain(); AU.musG.gain.value = AU.mus ? 0.32 : 0; AU.musG.connect(comp);
    const len = c.sampleRate * 2; AU.noise = c.createBuffer(1, len, c.sampleRate); const d = AU.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) { AU.ctx = null; }
}
function nz(t0, dur, type, f0, f1, q, v0, dest) {
  const c = AU.ctx, s = c.createBufferSource(); s.buffer = AU.noise;
  const f = c.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t0); f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t0 + dur); f.Q.value = q || 1;
  const g = c.createGain(); g.gain.setValueAtTime(v0, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  s.connect(f); f.connect(g); g.connect(dest || AU.sfxG); s.start(t0, Math.random() * 1.2); s.stop(t0 + dur + 0.05);
}
function tone(t0, dur, type, f0, f1, v0, dest, att) {
  const c = AU.ctx, o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t0);
  if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  const g = c.createGain();
  if (att) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v0, t0 + att); } else g.gain.setValueAtTime(v0, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  o.connect(g); g.connect(dest || AU.sfxG); o.start(t0); o.stop(t0 + dur + 0.05);
}
const SFX = {
  splat: (t, v) => { nz(t, 0.22, 'lowpass', 900, 120, 1, 0.9 * v); tone(t, 0.12, 'sine', 140, 50, 0.4 * v); nz(t + 0.03, 0.1, 'bandpass', 2400, 800, 2, 0.3 * v); },
  click: (t, v) => { tone(t, 0.03, 'square', 2000, 1800, 0.08 * v); },
  throw: (t, v) => { nz(t, 0.18, 'bandpass', 600, 2400, 2, 0.4 * v); },
  plate: (t, v) => { tone(t, 0.3, 'triangle', 1800, 600, 0.2 * v); nz(t, 0.2, 'highpass', 3000, 2000, 1, 0.4 * v); },
  clear: (t, v) => { tone(t, 0.12, 'square', 523, 0, 0.12 * v); tone(t + 0.12, 0.12, 'square', 659, 0, 0.12 * v); tone(t + 0.24, 0.25, 'square', 784, 0, 0.12 * v); },
  nail: (t, v) => { nz(t, 0.06, 'highpass', 3000, 2500, 1, 0.3 * v); tone(t, 0.05, 'square', 900, 300, 0.05 * v); },
  punch: (t, v) => { nz(t, 0.12, 'bandpass', 900, 300, 1, 0.6 * v); tone(t, 0.1, 'sine', 180, 60, 0.3 * v); },
  thud: (t, v) => { nz(t, 0.18, 'lowpass', 900, 80, 1, 1.0 * v); tone(t, 0.16, 'sine', 120, 40, 0.8 * v); },
  saw: (t, v) => { tone(t, 0.2, 'sawtooth', 140, 120, 0.12 * v); tone(t, 0.2, 'square', 283, 260, 0.05 * v); nz(t, 0.2, 'bandpass', 3000, 2600, 2, 0.12 * v); },
  sawhit: (t, v) => { nz(t, 0.16, 'bandpass', 4200, 2400, 3, 0.5 * v); tone(t, 0.12, 'sawtooth', 900, 500, 0.06 * v); },
  nade: (t, v) => { nz(t, 0.15, 'highpass', 1800, 1200, 1, 0.3 * v); tone(t, 0.05, 'square', 1200, 900, 0.05 * v); },
  tink: (t, v) => { tone(t, 0.08, 'triangle', 2400, 2200, 0.12 * v); },
  emp: (t, v) => { tone(t, 0.7, 'sine', 1800, 60, 0.4 * v); nz(t, 0.6, 'bandpass', 3000, 300, 2, 0.6 * v); tone(t + 0.05, 0.4, 'square', 90, 40, 0.15 * v); },
  dash: (t, v) => { nz(t, 0.22, 'bandpass', 600, 2400, 2, 0.5 * v); tone(t, 0.12, 'sine', 300, 900, 0.1 * v); },
  zap: (t, v) => { for (let i = 0; i < 4; i++) nz(t + i * 0.035, 0.03, 'highpass', 4000, 3000, 1, 0.5 * v); tone(t, 0.15, 'sawtooth', 60, 50, 0.15 * v); },
  radio: (t, v) => { tone(t, 0.06, 'square', 1400, 0, 0.06 * v); tone(t + 0.09, 0.06, 'square', 1900, 0, 0.06 * v); nz(t, 0.25, 'bandpass', 2000, 1800, 3, 0.15 * v); },
  crane: (t, v) => { tone(t, 1.0, 'sawtooth', 60, 50, 0.12 * v); nz(t, 1.0, 'lowpass', 500, 300, 2, 0.3 * v); tone(t + 0.9, 0.2, 'square', 900, 300, 0.08 * v); },
  slam: (t, v) => { nz(t, 0.7, 'lowpass', 700, 40, 0.8, 1.6 * v); tone(t, 0.5, 'sine', 70, 25, 1.0 * v); },
  coo: (t, v) => { tone(t, 0.14, 'sine', 520, 430, 0.12 * v, null, 0.03); tone(t + 0.16, 0.18, 'sine', 470, 380, 0.1 * v, null, 0.03); },
  plead: (t, v) => { tone(t, 0.35, 'sawtooth', 240, 190, 0.07 * v, null, 0.05); tone(t + 0.3, 0.4, 'sawtooth', 260, 160, 0.06 * v, null, 0.05); nz(t, 0.6, 'bandpass', 900, 700, 4, 0.12 * v); },
  flare: (t, v) => { nz(t, 0.3, 'bandpass', 1400, 400, 1.5, 0.5 * v); tone(t, 0.2, 'triangle', 700, 1500, 0.08 * v); },
  pistol: (t, v) => { nz(t, 0.14, 'bandpass', 2600, 500, 0.8, 1.0 * v); tone(t, 0.08, 'square', 340, 80, 0.22 * v); },
  shotgun: (t, v) => { nz(t, 0.45, 'lowpass', 3200, 160, 0.7, 1.4 * v); tone(t, 0.18, 'sine', 120, 38, 0.8 * v); nz(t + 0.32, 0.08, 'bandpass', 1500, 1200, 3, 0.25 * v); nz(t + 0.45, 0.08, 'bandpass', 1100, 900, 3, 0.25 * v); },
  minigun: (t, v) => { nz(t, 0.08, 'bandpass', 2300, 800, 0.9, 0.8 * v); tone(t, 0.05, 'square', 200, 80, 0.1 * v); },
  plasma: (t, v) => { tone(t, 0.13, 'sawtooth', 1500, 280, 0.16 * v); tone(t, 0.1, 'square', 800, 2000, 0.07 * v); },
  rocketfire: (t, v) => { nz(t, 0.55, 'lowpass', 2200, 180, 1, 1.0 * v); tone(t, 0.35, 'sawtooth', 220, 60, 0.14 * v); },
  explode: (t, v) => { nz(t, 1.1, 'lowpass', 1400, 50, 0.7, 1.6 * v); tone(t, 0.7, 'sine', 95, 28, 0.9 * v); },
  katana: (t, v) => { nz(t, 0.24, 'bandpass', 700, 4500, 3, 0.7 * v); },
  slash: (t, v) => { tone(t, 0.3, 'triangle', 2700, 2300, 0.12 * v); nz(t, 0.12, 'highpass', 2500, 2500, 1, 0.5 * v); tone(t, 0.12, 'sine', 160, 60, 0.4 * v); },
  door: (t, v) => { nz(t, 0.65, 'lowpass', 600, 140, 4, 0.55 * v); tone(t, 0.55, 'sawtooth', 72, 55, 0.07 * v); },
  pickup: (t, v) => { tone(t, 0.07, 'square', 660, 0, 0.13 * v); tone(t + 0.06, 0.09, 'square', 990, 0, 0.13 * v); },
  weapon: (t, v) => { [440, 554, 659, 880].forEach((f, i) => tone(t + i * 0.06, 0.12, 'square', f, 0, 0.13 * v)); },
  key: (t, v) => { [784, 988, 1175, 1568].forEach((f, i) => tone(t + i * 0.07, 0.2, 'triangle', f, 0, 0.2 * v)); },
  secret: (t, v) => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(t + i * 0.09, 0.3, 'triangle', f, 0, 0.2 * v)); },
  locked: (t, v) => { tone(t, 0.18, 'square', 120, 0, 0.18 * v); tone(t + 0.16, 0.22, 'square', 95, 0, 0.18 * v); },
  noway: (t, v) => { tone(t, 0.12, 'sine', 160, 70, 0.4 * v); },
  hurt: (t, v) => { tone(t, 0.24, 'sawtooth', 230, 80, 0.28 * v); nz(t, 0.14, 'lowpass', 900, 200, 1, 0.45 * v); },
  pdeath: (t, v) => { tone(t, 1.4, 'sawtooth', 320, 35, 0.32 * v); nz(t, 0.9, 'lowpass', 1300, 60, 1, 0.6 * v); },
  alert: (t, v) => { tone(t, 0.08, 'square', 620, 0, 0.1 * v); tone(t + 0.09, 0.12, 'square', 930, 0, 0.1 * v); },
  dalert: (t, v) => { tone(t, 0.3, 'sine', 1200, 2400, 0.12 * v); tone(t, 0.3, 'square', 1210, 2420, 0.04 * v); },
  malert: (t, v) => { tone(t, 0.6, 'sawtooth', 60, 120, 0.3 * v); nz(t, 0.5, 'lowpass', 500, 2000, 2, 0.3 * v); },
  bossalert: (t, v) => { tone(t, 1.6, 'sawtooth', 55, 40, 0.4 * v); tone(t, 1.6, 'sawtooth', 82, 61, 0.3 * v); nz(t, 1.5, 'lowpass', 300, 1500, 3, 0.4 * v); },
  epistol: (t, v) => { nz(t, 0.12, 'bandpass', 1900, 500, 0.8, 0.7 * v); },
  eshotgun: (t, v) => { nz(t, 0.35, 'lowpass', 2500, 200, 0.7, 1.0 * v); tone(t, 0.14, 'sine', 110, 40, 0.5 * v); },
  ebolt: (t, v) => { tone(t, 0.22, 'sawtooth', 900, 180, 0.13 * v); tone(t, 0.18, 'square', 1800, 600, 0.05 * v); },
  bossfire: (t, v) => { tone(t, 0.4, 'sawtooth', 300, 90, 0.25 * v); nz(t, 0.35, 'bandpass', 1500, 400, 2, 0.5 * v); },
  epain: (t, v) => { tone(t, 0.12, 'square', 320, 140, 0.13 * v); },
  edeath: (t, v) => { tone(t, 0.45, 'sawtooth', 420, 55, 0.24 * v); nz(t, 0.3, 'bandpass', 1100, 200, 2, 0.4 * v); },
  ddeath: (t, v) => { nz(t, 0.5, 'lowpass', 2000, 100, 1, 0.9 * v); tone(t, 0.3, 'square', 1600, 100, 0.08 * v); },
  rattack: (t, v) => { tone(t, 0.2, 'sawtooth', 140, 380, 0.2 * v); nz(t, 0.2, 'bandpass', 600, 2500, 2, 0.3 * v); },
  charge: (t, v) => { tone(t, 0.3, 'sine', 300, 900, 0.06 * v); },
  swish: (t, v) => { nz(t, 0.2, 'bandpass', 900, 3000, 2, 0.3 * v); },
  exit: (t, v) => { tone(t, 0.9, 'sawtooth', 110, 880, 0.15 * v); tone(t, 0.9, 'square', 220, 1760, 0.05 * v); },
  barrel: (t, v) => { tone(t, 0.08, 'triangle', 500, 300, 0.2 * v); },
  sshotgun: (t, v) => { nz(t, 0.6, 'lowpass', 3800, 120, 0.7, 1.7 * v); tone(t, 0.22, 'sine', 100, 30, 1.0 * v); nz(t + 0.5, 0.1, 'bandpass', 1300, 1000, 3, 0.3 * v); nz(t + 0.62, 0.08, 'bandpass', 900, 800, 3, 0.3 * v); },
  swarm: (t, v) => { for (let i = 0; i < 4; i++) nz(t + i * 0.06, 0.3, 'bandpass', 2400, 400, 1.5, 0.6 * v); },
  rail: (t, v) => { tone(t, 0.5, 'sawtooth', 3000, 120, 0.25 * v); nz(t, 0.35, 'highpass', 4000, 1500, 1, 0.8 * v); tone(t, 0.6, 'sine', 80, 40, 0.6 * v); },
  arc: (t, v) => { nz(t, 0.09, 'bandpass', 3500 + Math.random() * 2000, 2000, 4, 0.5 * v); tone(t, 0.06, 'square', 120 + Math.random() * 80, 0, 0.08 * v); },
  singcharge: (t, v) => { tone(t, 0.7, 'sawtooth', 60, 900, 0.18 * v); tone(t, 0.7, 'sine', 120, 1800, 0.12 * v); },
  singfire: (t, v) => { tone(t, 0.8, 'sawtooth', 900, 40, 0.3 * v); nz(t, 0.8, 'lowpass', 2000, 80, 2, 1.0 * v); },
  implode: (t, v) => { tone(t, 1.6, 'sine', 40, 20, 1.0 * v); nz(t, 1.8, 'lowpass', 300, 40, 1, 1.6 * v); tone(t, 0.4, 'sawtooth', 2000, 60, 0.3 * v); },
  growl: (t, v) => { tone(t, 0.4, 'sawtooth', 80, 140, 0.25 * v); nz(t, 0.35, 'bandpass', 400, 900, 3, 0.4 * v); },
  gib: (t, v) => { nz(t, 0.35, 'lowpass', 1500, 200, 1, 1.0 * v); tone(t, 0.2, 'triangle', 900, 300, 0.15 * v); tone(t + 0.05, 0.15, 'triangle', 1300, 500, 0.1 * v); },
  cage: (t, v) => { tone(t, 0.12, 'triangle', 1800, 1500, 0.2 * v); nz(t, 0.4, 'bandpass', 900, 600, 4, 0.4 * v); [523, 659, 784].forEach((f, i) => tone(t + 0.2 + i * 0.08, 0.25, 'triangle', f, 0, 0.18 * v)); },
  cargo: (t, v) => { nz(t, 1.2, 'lowpass', 500, 120, 6, 0.8 * v); tone(t, 1.0, 'sawtooth', 50, 70, 0.12 * v); [440, 554, 659, 880].forEach((f, i) => tone(t + 0.5 + i * 0.09, 0.3, 'triangle', f, 0, 0.16 * v)); },
  hack: (t, v) => { for (let i = 0; i < 8; i++) tone(t + i * 0.05, 0.04, 'square', 800 + Math.random() * 1200, 0, 0.06 * v); },
  hackdone: (t, v) => { [660, 880, 1320].forEach((f, i) => tone(t + i * 0.07, 0.15, 'square', f, 0, 0.1 * v)); },
  plant: (t, v) => { tone(t, 0.1, 'square', 1000, 0, 0.1 * v); tone(t + 0.15, 0.1, 'square', 1000, 0, 0.1 * v); },
  charge: (t, v) => { tone(t, 0.3, 'square', 1400, 0, 0.12 * v); nz(t, 0.15, 'highpass', 3000, 3000, 1, 0.3 * v); },
  alarm: (t, v) => { tone(t, 0.6, 'sawtooth', 600, 900, 0.12 * v); tone(t + 0.6, 0.6, 'sawtooth', 600, 900, 0.12 * v); },
  thunder: (t, v) => { nz(t, 2.8, 'lowpass', 400, 40, 1, 1.4 * v); nz(t + 0.1, 1.2, 'lowpass', 900, 100, 1, 0.6 * v); },
  teleport: (t, v) => { tone(t, 0.5, 'sawtooth', 200, 1600, 0.12 * v); nz(t, 0.5, 'bandpass', 3000, 600, 3, 0.4 * v); },
  evac: (t, v) => { tone(t, 0.9, 'sine', 400, 1600, 0.1 * v); tone(t, 0.9, 'triangle', 800, 3200, 0.05 * v); },
  streak: (t, v) => { tone(t, 0.15, 'square', 220, 0, 0.12 * v); tone(t + 0.12, 0.25, 'square', 330, 0, 0.12 * v); },
  power: (t, v) => { [262, 330, 392, 523, 659, 784].forEach((f, i) => tone(t + i * 0.05, 0.2, 'sawtooth', f, 0, 0.1 * v)); },
  objdone: (t, v) => { [392, 523, 659, 784, 1047].forEach((f, i) => tone(t + i * 0.08, 0.35, 'triangle', f, 0, 0.18 * v)); },
  laser: (t, v) => { tone(t, 1.2, 'sine', 1800, 2400, 0.05 * v); },
  snipe: (t, v) => { nz(t, 0.5, 'bandpass', 2000, 300, 1, 1.2 * v); tone(t, 0.3, 'sawtooth', 800, 60, 0.2 * v); },
  flame: (t, v) => { nz(t, 0.3, 'lowpass', 900, 600, 1, 0.5 * v); },
  beep: (t, v) => { tone(t, 0.05, 'square', 1800, 0, 0.06 * v); }
};
function sfx(name, x, y) {
  if (!AU.ctx || !AU.on) return; let v = 1;
  if (x !== undefined && G.player) { const d = Math.hypot(x - G.player.x, y - G.player.y); v = clamp(1.15 - d / 22, 0.06, 1); }
  try { SFX[name](AU.ctx.currentTime + 0.005, v); } catch (e) { }
}

// --- music: a tiny step sequencer playing dark synthwave ---
const SONGS = [
  { bpm: 118, root: 40, prog: [[0, 'm'], [0, 'm'], [-2, 'M'], [-4, 'M']], bass: 'x.xxx.xxx.xxx.xx', kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'x.xxx.xxx.xxx.xx', arp: 2 },
  { bpm: 128, root: 43, prog: [[0, 'm'], [3, 'M'], [-2, 'M'], [-4, 'M']], bass: 'xx.xxx.xxx.xxx.x', kick: 'x...x...x...x...', snare: '....x.......x..x', hat: 'xxxxxxxxxxxxxxxx', arp: 1 },
  { bpm: 88, root: 45, prog: [[0, 'm'], [-4, 'M'], [-7, 'M'], [-2, 'M']], bass: 'x.......x...x...', kick: 'x.......x.......', snare: '........x.......', hat: '..x...x...x...x.', arp: 2 },
  { bpm: 110, root: 38, prog: [[0, 'm'], [0, 'm'], [5, 'm'], [3, 'M']], bass: 'x..x..x.x..x..x.', kick: 'x.....x...x.....', snare: '....x.......x...', hat: '..x...x...x...x.', arp: 2 },
  { bpm: 124, root: 41, prog: [[0, 'm'], [-2, 'M'], [-4, 'M'], [-5, 'M']], bass: 'x.x.xx.x.x.xx.x.', kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'xxx.xxx.xxx.xxx.', arp: 1 },
  { bpm: 132, root: 45, prog: [[0, 'm'], [3, 'M'], [5, 'm'], [-2, 'M']], bass: 'xxxxxxxxxxxxxxxx', kick: 'x..x..x.x..x..x.', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', arp: 1 },
  { bpm: 120, root: 42, prog: [[0, 'M'], [4, 'm'], [-3, 'm'], [5, 'M']], bass: 'x..xx..xx..xx..x', kick: 'x...x...x...x...', snare: '....x..x....x...', hat: '.x.x.x.x.x.x.x.x', arp: 2 },
  { bpm: 100, root: 36, prog: [[0, 'm'], [1, 'M'], [0, 'm'], [-2, 'M']], bass: 'x...x.x.x...x.x.', kick: 'x.x.....x.x.....', snare: '....x.......x...', hat: 'x...x...x...x...', arp: 2 },
  { bpm: 140, root: 40, prog: [[0, 'm'], [-4, 'M'], [-2, 'M'], [3, 'M']], bass: 'x.xxx.xxx.xxx.xx', kick: 'x...x...x...x...', snare: '....x.......x.x.', hat: 'xxxxxxxxxxxxxxxx', arp: 1 },
  { bpm: 126, root: 38, prog: [[0, 'm'], [-2, 'M'], [-5, 'M'], [-7, 'M']], bass: 'x.x.x.xxx.x.x.xx', kick: 'x...x...x..xx...', snare: '....x.......x...', hat: 'x.xxx.xxx.xxx.xx', arp: 1 },
  { bpm: 96, root: 41, prog: [[0, 'm'], [0, 'm'], [-4, 'M'], [-2, 'M']], bass: 'x.......x.x.....', kick: 'x.......x.......', snare: '........x.......', hat: '..x...x...x...x.', arp: 2 },
  { bpm: 118, root: 44, prog: [[0, 'M'], [-3, 'm'], [5, 'M'], [7, 'M']], bass: 'x..x..x.x..x..x.', kick: 'x...x...x...x...', snare: '....x.......x...', hat: '.xx..xx..xx..xx.', arp: 2 },
  { bpm: 134, root: 37, prog: [[0, 'm'], [1, 'M'], [3, 'm'], [0, 'm']], bass: 'xx.xxx.xxx.xxx.x', kick: 'x..x..x.x..x..x.', snare: '....x.......x...', hat: 'xxxxxxxxxxxxxxxx', arp: 1 }
];
const MUS = { on: false, song: 0, step: 0, next: 0, timer: null };
const mtof = n => 440 * Math.pow(2, (n - 69) / 12);
function musicStart(i) { if (!AU.ctx) return; MUS.song = i; MUS.step = 0; MUS.next = AU.ctx.currentTime + 0.1; MUS.on = true; if (!MUS.timer) MUS.timer = setInterval(musTick, 40); }
function musicStop() { MUS.on = false; }
function musTick() {
  if (!MUS.on || !AU.ctx || !AU.mus) return; const c = AU.ctx, S = SONGS[MUS.song], sd = 60 / S.bpm / 4;
  if (MUS.next < c.currentTime) MUS.next = c.currentTime + 0.05;
  while (MUS.next < c.currentTime + 0.25) { try { playStep(S, MUS.step, MUS.next, sd); } catch (e) { } MUS.next += sd; MUS.step = (MUS.step + 1) % 64; }
}
function playStep(S, st, t, sd) {
  const c = AU.ctx, D = AU.musG, bar = st >> 4, s = st & 15, ch = S.prog[bar], root = S.root + ch[0], third = ch[1] === 'm' ? 3 : 4;
  if (S.bass[s] === 'x') {
    const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = mtof(root + (s % 8 === 7 ? 12 : 0));
    f.type = 'lowpass'; f.frequency.setValueAtTime(1400, t); f.frequency.exponentialRampToValueAtTime(180, t + sd * 1.5); f.Q.value = 6;
    g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.001, t + sd * 1.8); o.connect(f); f.connect(g); g.connect(D); o.start(t); o.stop(t + sd * 2);
  }
  const arpN = S.arp === 1 ? [0, third, 7, 12, 7, third, 0, 7] : [12, 7, third + 12, 7, 0, 7, third, 7];
  if (s % 2 === 0 || S.arp === 1) {
    const n = root + 24 + arpN[s % 8], o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'square'; o.frequency.value = mtof(n);
    f.type = 'lowpass'; f.frequency.value = 1800 + 1200 * Math.sin(st / 10); g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + sd * 1.4);
    o.connect(f); f.connect(g); g.connect(D); o.start(t); o.stop(t + sd * 1.5);
  }
  if (s === 0) for (const k of [0, third, 7]) tone(t, sd * 15, 'sawtooth', mtof(root + 12 + k), 0, 0.025, D, sd * 4);
  if (S.kick[s] === 'x') tone(t, 0.28, 'sine', 150, 42, 0.75, D);
  if (S.snare[s] === 'x') { nz(t, 0.16, 'bandpass', 1800, 900, 0.8, 0.45, D); tone(t, 0.08, 'triangle', 220, 120, 0.2, D); }
  if (S.hat[s] === 'x') nz(t, 0.045, 'highpass', 7000, 7000, 1, 0.13, D);
}
