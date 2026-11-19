// ---------- art for the rest of Act 1: floors, cover, switches, captives, new enemies ----------
Object.assign(FLOORS, {
  water: P => { P.r(0, 0, 16, 16, '#123a5a'); for (let i = 0; i < 7; i++) { const x = (i * 5) % 16, y = (i * 7) % 16; P.r(x, y, 3, 1, '#1f5a85'); } P.r(2, 11, 4, 1, '#2a7ab0'); P.r(10, 4, 3, 1, '#2a7ab0'); },
  hazard: P => { P.r(0, 0, 16, 16, '#1a1a1a'); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (((x + y) >> 2) & 1) P.p(x, y, '#e8c020'); },
  plate: P => { P.r(0, 0, 16, 16, '#5a6068'); P.r(0, 0, 16, 1, '#6e757e'); P.r(0, 0, 1, 16, '#6e757e'); P.r(0, 15, 16, 1, '#454a51'); P.r(15, 0, 1, 16, '#454a51'); P.p(2, 2, '#8a9099'); P.p(13, 2, '#8a9099'); P.p(2, 13, '#8a9099'); P.p(13, 13, '#8a9099'); },
  mud: P => { P.r(0, 0, 16, 16, '#4a3a2c'); for (let i = 0; i < 20; i++) P.p(srnd() * 16, srnd() * 16, pick(['#3e3024', '#57463a', '#3a2e22'])); P.r(3, 9, 5, 2, '#3a4a52'); P.r(11, 3, 3, 1, '#3a4a52'); },
  roof: P => { P.r(0, 0, 16, 16, '#5e5e66'); for (let i = 0; i < 30; i++) P.p(srnd() * 16, srnd() * 16, pick(['#4e4e56', '#6e6e76', '#555560'])); },
  rail: P => { P.r(0, 0, 16, 16, '#4a3d30'); for (let x = 0; x < 16; x += 4) P.r(x, 2, 2, 12, '#5e4a36'); P.r(0, 4, 16, 1, '#8a8f99'); P.r(0, 11, 16, 1, '#8a8f99'); },
  deck: P => { for (let y = 0; y < 16; y += 4) { P.r(0, y, 16, 4, '#7a3a2a'); P.r(0, y + 3, 16, 1, '#5a2a1e'); } P.p(4, 1, '#9a5a44'); P.p(12, 9, '#9a5a44'); },
  dark: P => { P.r(0, 0, 16, 16, '#2e3238'); for (let i = 0; i < 16; i++) P.p(srnd() * 16, srnd() * 16, pick(['#262a30', '#3a4a3a', '#363a40'])); P.r(0, 15, 16, 1, '#24282d'); },
  lift: P => { P.r(0, 0, 16, 16, '#6a6e76'); for (let y = 0; y < 16; y += 4) for (let x = (y >> 2) & 1 ? 2 : 0; x < 16; x += 4) P.p(x, y, '#8a8e96'); P.r(0, 0, 16, 1, '#e8c020'); },
});
for (const k of ['water', 'hazard', 'plate', 'mud', 'roof', 'rail', 'deck', 'dark', 'lift']) if (!FL_IDS.includes(k)) FL_IDS.push(k);
const contDraw = (main, dark) => P => { P.r(0, 0, 64, 24, dark); P.r(1, 1, 62, 22, main); for (let x = 3; x < 60; x += 4) P.r(x, 1, 1, 22, dark); P.r(60, 1, 3, 22, shade(main, 0.8)); P.r(61, 6, 1, 12, '#ddd'); };
Object.assign(OBJ, {
  pillar: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 16, '#6e6e76'); P.r(1, 1, 14, 14, '#9a9aa2'); P.r(1, 1, 14, 3, '#b4b4bc'); P.r(12, 1, 3, 14, '#86868e'); } },
  shelf: { w: 4, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 32, 8, '#3a2e22'); for (let x = 1; x < 31; x += 5) P.r(x, 1, 4, 6, pick(['#a8783a', '#8a6234', '#c8a060', '#6a8aa8'])); } },
  counter: { w: 6, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 48, 8, '#4a4e56'); P.r(1, 1, 46, 6, '#9aa0a8'); for (let x = 3; x < 46; x += 7) P.r(x, 2, 4, 4, '#c8ccd2'); } },
  vend: { w: 2, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 8, '#1a1a22'); P.r(1, 1, 9, 6, '#ff2a8a'); P.r(2, 2, 7, 4, '#ff7ab8'); P.r(11, 1, 4, 6, '#3ff'); } },
  tank: { w: 3, h: 3, solid: 1, tall: 1, d: P => { P.d(12, 12, 11.5, 11.5, '#1e3a4e'); P.d(12, 12, 10.5, 10.5, '#3a6a8a'); P.d(10, 10, 5, 5, '#4a7a9a'); P.r(11, 2, 2, 20, '#2a5068'); } },
  pump: { w: 3, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 24, 16, '#2a323a'); P.r(1, 1, 22, 14, '#4a5a6a'); P.d(8, 8, 5, 5, '#6a7a8a'); P.d(8, 8, 2, 2, '#2a323a'); P.r(15, 3, 6, 10, '#3a4a5a'); P.r(16, 5, 4, 2, '#e8c020'); } },
  car: { w: 5, h: 3, solid: 1, tall: 1, d: P => { P.r(1, 1, 38, 22, '#111'); P.r(2, 2, 36, 20, '#5a3a3a'); P.r(10, 4, 18, 16, '#2a2a30'); P.r(11, 5, 7, 14, '#3a4a5a'); P.r(21, 5, 6, 14, '#3a4a5a'); P.r(2, 2, 6, 3, '#8a6a4a'); P.p(30, 6, '#ddd'); } },
  dumpster: { w: 3, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 24, 16, '#1a2a1e'); P.r(1, 1, 22, 14, '#2e5a3a'); P.r(1, 7, 22, 1, '#1a3a24'); P.r(4, 3, 4, 2, '#4a7a5a'); } },
  mattress: { w: 2, h: 3, solid: 0, d: P => { P.r(0, 0, 16, 24, '#6a5a3a'); P.r(1, 1, 14, 22, '#a89868'); P.r(3, 4, 5, 4, '#8a7a50'); P.r(9, 14, 4, 6, '#7a6a48'); } },
  drum: { w: 1, h: 1, solid: 1, tall: 1, d: P => { P.d(4, 4, 3.6, 3.6, '#3a2a1e'); P.d(4, 4, 2.6, 2.6, '#ff8a1c'); P.d(4, 4, 1.4, 1.4, '#ffe14d'); } },
  gen: { w: 3, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 24, 16, '#3a3010'); P.r(1, 1, 22, 14, '#d8a81c'); P.r(3, 3, 8, 10, '#2a2a2a'); P.r(14, 4, 7, 2, '#2a2a2a'); P.r(14, 9, 7, 2, '#2a2a2a'); } },
  ac: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 16, '#5a5e66'); P.r(1, 1, 14, 14, '#9aa0a8'); P.d(8, 8, 5, 5, '#5a5e66'); P.r(7, 3, 2, 10, '#9aa0a8'); P.r(3, 7, 10, 2, '#9aa0a8'); } },
  dish: { w: 3, h: 3, solid: 1, tall: 1, d: P => { P.d(12, 12, 11, 11, '#8a8e96'); P.d(12, 12, 9.5, 9.5, '#d8dce2'); P.d(12, 12, 2, 2, '#5a5e66'); P.ln(12, 12, 20, 4, '#5a5e66', 1); } },
  cart: { w: 2, h: 3, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 24, '#2a2a2a'); P.r(1, 1, 14, 22, '#6a5040'); P.r(3, 3, 10, 18, '#1e1a16'); for (let i = 0; i < 6; i++) P.d(5 + (i % 2) * 5, 6 + i * 2.5, 2, 2, '#333'); } },
  beam: { w: 1, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 8, 8, '#4a3220'); P.r(1, 1, 6, 6, '#7a5a38'); P.r(1, 3, 6, 1, '#5a4028'); } },
  cont: { w: 8, h: 3, solid: 1, tall: 1, d: contDraw('#c8601c', '#7a3a10') },
  contb: { w: 8, h: 3, solid: 1, tall: 1, d: contDraw('#2a5a9a', '#173a66') },
  contr: { w: 8, h: 3, solid: 1, tall: 1, d: contDraw('#9a2a2a', '#5a1818') },
  contg: { w: 8, h: 3, solid: 1, tall: 1, d: contDraw('#3a7a4a', '#1e4a2a') },
  breaker: { w: 1, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 8, 8, '#2a2a2a'); P.r(1, 1, 6, 6, '#b8b090'); P.r(2, 2, 4, 1, '#e8c020'); P.r(3, 3, 2, 4, '#ff3b4e'); } },
  valve: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(2, 2, 12, 12, '#3a4a5a'); P.d(8, 8, 6.5, 6.5, '#a8202a'); P.d(8, 8, 4.5, 4.5, '#3a4a5a'); P.r(7, 1, 2, 14, '#c8303a'); P.r(1, 7, 14, 2, '#c8303a'); P.d(8, 8, 1.5, 1.5, '#ddd'); } },
  console: { w: 2, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 8, '#1a1a22'); P.r(1, 1, 9, 5, '#e8c020'); P.r(2, 2, 7, 3, '#3a3010'); P.r(12, 2, 2, 2, '#ff3b4e'); P.r(12, 5, 2, 2, '#3f8'); } },
  xmit: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(1, 1, 14, 14, '#2a2e36'); P.r(2, 2, 12, 12, '#4a525e'); P.r(7, 0, 2, 16, '#9aa0a8'); P.r(3, 3, 3, 3, '#ff3b4e'); P.r(10, 10, 3, 3, '#3ff'); } },
  cagek: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 16, '#2a2018'); for (let i = 1; i < 16; i += 3) P.r(i, 0, 1, 16, '#8a8f99'); P.r(0, 0, 16, 1, '#aaa'); P.r(0, 15, 16, 1, '#aaa'); } },
  tvwall: { w: 4, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 32, 8, '#111'); for (let x = 1; x < 31; x += 6) P.r(x, 1, 5, 5, pick(['#ff2a8a', '#3ff', '#ffe14d', '#7a5aff'])); } },
});
// destructible phone-farm rack (3x1 cells): intact / wrecked
function rackSprites() {
  return [spr(24, 8, P => { P.r(0, 0, 24, 8, '#111'); for (let x = 1; x < 23; x += 2) for (let y = 1; y < 7; y += 3) P.r(x, y, 1, 2, pick(['#3ff', '#5dff9a', '#ff2a8a', '#ffe14d', '#222'])); }),
    spr(24, 8, P => { P.r(0, 1, 22, 6, '#1a1a1a'); for (let i = 0; i < 14; i++) P.p(srnd() * 24, srnd() * 8, pick(['#333', '#555', '#3ff', '#000'])); P.r(3, 3, 6, 2, '#2a2a2a'); })];
}
WEAPONS.smart = { name: 'SMART PISTOL', len: 6, c: '#2e3a4e', acc: '#3ff', ammo: 12, cd: 0.24, spread: 0.03, pellets: 1, noise: 280, smart: 1 };
WEAPONS.rifle = { name: 'LONG RIFLE', len: 11, c: '#2e3a2e', acc: '#ff3b4e', ammo: 5, cd: 0.9, spread: 0.004, pellets: 1, noise: 420, two: 1, pierce: 1 };
Object.assign(CHARS, {
  snp: { jacket: '#3a4a3a', boots: '#111', skin: SKINS[1], helmet: '#2a332a', visor: '#5dff9a', legs: '#1e261e', stripe: '#5a6a4a' },
  twin: { jacket: '#e86a1c', boots: '#111', skin: SKINS[2], helmet: '#2a2a2a', visor: '#ffe14d', legs: '#2a2a33', fat: 1, stripe: '#1a1a1a' },
  twin2: { jacket: '#e8c020', boots: '#111', skin: SKINS[4], helmet: '#2a2a2a', visor: '#ff2a2a', legs: '#2a2a33', fat: 1, stripe: '#1a1a1a' },
  mig: { jacket: '#7a5a8a', boots: '#3a2a1a', skin: SKINS[2], hair: '#1a1410', legs: '#4a4a3a' },
  mig2: { jacket: '#4a7a6a', boots: '#2a2a2a', skin: SKINS[4], hair: '#2a1a12', legs: '#3a3a4a' },
  kid2: { jacket: '#e0b030', boots: '#333', skin: SKINS[0], hair: '#6a3a1a', legs: '#3a4a6a' },
});
