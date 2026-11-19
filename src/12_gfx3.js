// ---------- Act 2 art: island, ship and mansion floors/objects, new enemies, gala guests ----------
Object.assign(FLOORS, {
  sand: P => { P.r(0, 0, 16, 16, '#a8946a'); for (let i = 0; i < 26; i++) P.p(srnd() * 16, srnd() * 16, pick(['#988458', '#b8a47a', '#8a7650'])); },
  rug: P => { P.r(0, 0, 16, 16, '#5a1a2a'); P.r(0, 0, 16, 1, '#c8a040'); P.r(0, 8, 16, 1, '#c8a040'); for (let x = 3; x < 16; x += 8) { P.p(x, 4, '#c8a040'); P.p(x + 1, 3, '#8a2a3a'); P.p(x + 1, 5, '#8a2a3a'); } },
  marble: P => { P.r(0, 0, 16, 16, '#d8d4cc'); P.r(0, 0, 16, 1, '#b8b4ac'); P.r(0, 0, 1, 16, '#b8b4ac'); P.ln(2, 12, 9, 6, '#bab6ae', 1); P.ln(9, 6, 14, 9, '#c4c0b8', 1); },
  rock: P => { P.r(0, 0, 16, 16, '#3a3e44'); for (let i = 0; i < 18; i++) P.p(srnd() * 16, srnd() * 16, pick(['#32363c', '#44484e', '#2c3036'])); },
});
for (const k of ['sand', 'rug', 'marble', 'rock']) if (!FL_IDS.includes(k)) FL_IDS.push(k);
Object.assign(OBJ, {
  boulder: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.d(8, 8, 7.5, 6.5, '#2a2e34'); P.d(7, 7, 6.5, 5.5, '#4a4e56'); P.d(6, 5, 3, 2, '#5e626a'); } },
  boat: { w: 6, h: 3, solid: 1, tall: 1, d: P => { P.d(24, 12, 23, 10.5, '#1a1a1a'); P.d(24, 12, 22, 9.5, '#c8c8c8'); P.d(24, 12, 19, 7, '#3a5a7a'); P.r(14, 9, 10, 6, '#e8e8e8'); } },
  lifeboat: { w: 4, h: 2, solid: 1, tall: 1, d: P => { P.d(16, 8, 15.5, 7.5, '#1a1a1a'); P.d(16, 8, 14.5, 6.5, '#ff6a1c'); P.r(6, 6, 20, 4, '#e8e8e8'); } },
  lamp: { w: 1, h: 1, solid: 1, tall: 1, d: P => { P.d(4, 4, 3, 3, '#2a2a2a'); P.d(4, 4, 2, 2, '#ffe9a0'); P.p(4, 4, '#fff'); } },
  piano: { w: 3, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 24, 16, '#0a0a0e'); P.r(1, 1, 22, 14, '#1a1a22'); P.r(2, 11, 20, 3, '#eee'); for (let x = 3; x < 22; x += 2) P.p(x, 11, '#111'); } },
  statue: { w: 1, h: 1, solid: 1, tall: 1, d: P => { P.d(4, 4, 3.6, 3.6, '#8a8680'); P.d(4, 4, 2.4, 2.4, '#c8c4bc'); P.p(3, 3, '#fff'); } },
  bunk: { w: 2, h: 4, solid: 1, d: P => { P.r(0, 0, 16, 32, '#4a4a52'); P.r(1, 1, 14, 30, '#8a8a7a'); P.r(2, 2, 12, 5, '#c8c8b8'); P.r(1, 15, 14, 1, '#4a4a52'); P.r(2, 17, 12, 5, '#c8c8b8'); } },
  bar: { w: 6, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 48, 8, '#3a1a10'); P.r(1, 1, 46, 6, '#6a3a20'); for (let x = 3; x < 46; x += 5) P.r(x, 2, 2, 3, pick(['#3f8', '#c8a040', '#fff', '#a8203a'])); } },
  crane2: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 16, '#3a3a10'); P.r(1, 1, 14, 14, '#e8c020'); P.ln(1, 1, 14, 14, '#3a3a10', 1); P.ln(14, 1, 1, 14, '#3a3a10', 1); } },
});
Object.assign(CHARS, {
  rio: { jacket: '#28303c', boots: '#0a0a0e', skin: SKINS[1], helmet: '#1a2028', visor: '#8ab4d8', legs: '#1a1e26', shield: 1 },
  ghd: { jacket: '#3a4048', boots: '#000', visor: '#3ff', dog: 1 },
  hdl: { jacket: '#e8e4dc', boots: '#1a1a1a', skin: SKINS[3], hair: '#1a1a1a', legs: '#1e1e24', stripe: '#c8a040', implant: '#ffe14d' },
  tec: { jacket: '#e8e8e0', boots: '#2a2a2a', skin: SKINS[2], hair: '#3a2a1a', legs: '#2a4a3a', stripe: '#3f8', eyes: '#3f8' },
  guest: { jacket: '#16161c', boots: '#000', skin: SKINS[3], hair: '#4a3020', legs: '#16161c', stripe: '#e8e8e8' },
  guest2: { jacket: '#a8203a', boots: '#3a0a12', skin: SKINS[0], hair: '#e8c060', legs: '#a8203a' },
  guest3: { jacket: '#2a4a7a', boots: '#111', skin: SKINS[2], hair: '#1a1410', legs: '#1a2a4a', stripe: '#c8a040' },
});
