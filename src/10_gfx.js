// ---------- procedural pixel art: floors, characters, weapons, furniture ----------
const GFX = {};
// floor patterns (16x16, tiled); index = floor type
const FLOORS = {
  lino: P => { for (let y = 0; y < 16; y += 8) for (let x = 0; x < 16; x += 8) P.r(x, y, 8, 8, ((x + y) >> 3) & 1 ? '#3d5c50' : '#46695b'); P.r(0, 0, 16, 1, '#2b4239'); P.r(0, 8, 16, 1, '#2b4239'); P.r(0, 0, 1, 16, '#2b4239'); P.r(8, 0, 1, 16, '#2b4239'); },
  conc: P => { P.r(0, 0, 16, 16, '#45474f'); for (let i = 0; i < 18; i++) P.p(srnd() * 16, srnd() * 16, srnd() < 0.5 ? '#3b3d44' : '#50525a'); P.r(0, 15, 16, 1, '#383a41'); P.r(15, 0, 1, 16, '#383a41'); },
  check: P => { for (let y = 0; y < 16; y += 4) for (let x = 0; x < 16; x += 4) P.r(x, y, 4, 4, ((x + y) >> 2) & 1 ? '#e8e1ee' : '#2a1a33'); },
  carpet: P => { P.r(0, 0, 16, 16, '#4a1f5e'); for (let y = 0; y < 16; y += 8) for (let x = 0; x < 16; x += 8) { P.p(x + 3, y + 3, '#c23fa2'); P.p(x + 4, y + 4, '#c23fa2'); P.p(x + 3, y + 4, '#7b2c8c'); P.p(x + 4, y + 3, '#7b2c8c'); } },
  tile: P => { P.r(0, 0, 16, 16, '#7fd6e8'); for (let i = 0; i < 16; i += 4) { P.r(i, 0, 1, 16, '#4ba8bd'); P.r(0, i, 16, 1, '#4ba8bd'); } },
  wood: P => { for (let y = 0; y < 16; y += 4) { P.r(0, y, 16, 4, y % 8 ? '#a35a2a' : '#b5672f'); P.r(0, y + 3, 16, 1, '#6e3a1a'); P.r(((y * 5) % 13) + 1, y, 1, 3, '#6e3a1a'); } },
  grate: P => { P.r(0, 0, 16, 16, '#2a3036'); for (let i = 0; i < 16; i += 3) { P.r(i, 0, 1, 16, '#454e57'); } P.r(0, 7, 16, 2, '#1c2126'); },
  dirt: P => { P.r(0, 0, 16, 16, '#5a4433'); for (let i = 0; i < 26; i++) P.p(srnd() * 16, srnd() * 16, pick(['#4a372a', '#6b5240', '#7a6150'])); },
  asph: P => { P.r(0, 0, 16, 16, '#26262e'); for (let i = 0; i < 20; i++) P.p(srnd() * 16, srnd() * 16, srnd() < 0.5 ? '#1e1e25' : '#30303a'); },
  pink: P => { for (let y = 0; y < 16; y += 8) for (let x = 0; x < 16; x += 8) P.r(x, y, 8, 8, ((x + y) >> 3) & 1 ? '#ff4fa0' : '#ff7ab8'); P.r(0, 0, 16, 1, '#c2306f'); P.r(0, 8, 16, 1, '#c2306f'); P.r(0, 0, 1, 16, '#c2306f'); P.r(8, 0, 1, 16, '#c2306f'); },
  cell: P => { P.r(0, 0, 16, 16, '#55524a'); for (let i = 0; i < 14; i++) P.p(srnd() * 16, srnd() * 16, pick(['#4a4740', '#615d54', '#3f3c36'])); },
  stairs: P => { for (let y = 0; y < 16; y += 4) { P.r(0, y, 16, 3, '#8a8f9a'); P.r(0, y + 3, 16, 1, '#3a3e46'); } },
};
const FL_IDS = Object.keys(FLOORS);
// ---------- characters (top-down, facing +x, 24x24) ----------
const SKINS = ['#e0ac7e', '#c68a5e', '#8d5a3b', '#f1c9a5', '#6b4129'];
const TAU = Math.PI * 2, easeO = t => 1 - (1 - t) * (1 - t);
// where the hands go and what the weapon does for every pose
function poseOf(c, w, pose, f) {
  const W = w && WEAPONS[w], fa = c.fat ? 1.25 : 1, ly = 12 - 5.5 * fa, ry = 12 + 5.5 * fa, o = { w: W, k: w, lean: 0 }, s = Math.sin(f / 8 * TAU);
  if (!W) {
    if (pose === 'pR' || pose === 'pL') {
      const R = pose === 'pR', hx = [12, 21.5, 17][f], hy = R ? [ry, 13.5, 15.5][f] : [ly, 10.5, 8.5][f];
      o[R ? 'ra' : 'la'] = [hx, hy]; o[R ? 'la' : 'ra'] = [16, R ? ly + 2 : ry - 2]; o.lean = [0, 1, 0.5][f];
    } else if (pose === 'raise') { o.ra = [10.5, ry + 1]; o.la = [17, ly + 3]; o.big = 'r'; }
    else if (pose === 'slam') { o.ra = [21, 13]; o.la = [17, ly + 3]; o.lean = 2; }
    else { o.la = [14.5 - s * 2.6, ly + 0.5]; o.ra = [14.5 + s * 2.6, ry - 0.5]; }
  } else if (W.melee) {
    if (pose === 'sF' || pose === 'sB') {
      const t = f / 5, e = easeO(t), F = pose === 'sF', th = F ? lerp(1.75, -1.4, e) : lerp(-1.4, 1.75, e);
      o.ra = [11 + 7 * Math.cos(th), 12 + 7 * Math.sin(th)]; o.wa = th + (F ? 1 : -1) * (0.45 - 0.75 * t); o.la = [13.5, F ? ly : ly + 1]; o.lean = Math.sin(t * Math.PI) * 1.2;
    } else if (pose === 'raise') { o.ra = [10, ry]; o.wa = 2.7; o.la = [17, ly + 3]; o.big = 'r'; }
    else if (pose === 'slam') { o.ra = [17.5, 13.5]; o.wa = -0.15; o.la = [17, ly + 3]; o.lean = 2; }
    else { o.ra = [15.5, 16 + s * 0.6]; o.la = [14.5 - s * 1.6, ly + 0.5]; o.wa = -0.85 + s * 0.06; }
  } else {
    const two = W.two, back = pose === 'rec' ? (two ? 2 : 1.5) : 0, push = pose === 'slam' || pose === 'raise' ? 2 : 0;
    o.gun = two ? 2 : 1; o.gx = (two ? 13 : 17) - back + push; o.lean = push - back * 0.5;
    if (two) { o.ra = [o.gx + 2, 13.5]; o.la = [o.gx + W.len - (pose === 'pump' ? (f ? 3 : 5.5) : 2), 10.5]; }
    else { o.ra = [o.gx - 0.5, 13]; o.la = [o.gx - 0.5, 11]; }
  }
  return o;
}
// colour sets for every character
const CHARS = {
  player: { jacket: '#1fb7c9', boots: '#222', skin: SKINS[0], hair: '#2a1a12', legs: '#26253a', implant: '#4ff', stripe: '#ff2a8a' },
  grd: { jacket: '#5d6f8c', boots: '#1c1c22', skin: SKINS[1], helmet: '#3d4a60', visor: '#ff3b4e', legs: '#2c3240' },
  brc: { jacket: '#a8343f', boots: '#1c1c22', skin: SKINS[2], helmet: '#5c1c22', visor: '#ffc53d', legs: '#3a1c20' },
  cln: { jacket: '#1b1b20', boots: '#000', skin: SKINS[3], hair: '#d8d8d8', legs: '#111', eyes: '#f22', stripe: '#ddd' },
  wkr: { jacket: '#e09a24', boots: '#3a2a1a', skin: SKINS[4], hair: '#1a1410', legs: '#3d4a3a', eyes: '#ff3bd8', stripe: '#e8e8d0', implant: '#ff3bd8' },
  fat: { jacket: '#6a6e78', boots: '#111', skin: SKINS[1], helmet: '#3a3d45', visor: '#ff6a2a', legs: '#2a2c33', fat: 1 },
  hnd: { jacket: '#8a929e', boots: '#000', visor: '#ff2a2a', dog: 1 },
  nadia: { jacket: '#2b2440', boots: '#111', skin: SKINS[0], hair: '#b32a6a', legs: '#1a1626' },
  kid: { jacket: '#3e8de0', boots: '#333', skin: SKINS[2], hair: '#1a1410', legs: '#444' },
};
// the player's look depends on the implant (plating can be knocked off)
const AUG = { blades: { aug: 'blades', stripe: '#dfe6ee' }, od: { aug: 'od' }, dash: { aug: 'dash', stripe: '#4ff' }, plating: { aug: 'plating' }, spike: { aug: 'spike', implant: '#ff3bd8' }, reflex: { aug: 'reflex', implant: '#5dff9a', stripe: '#5dff9a' }, ghost: { aug: 'ghost', jacket: '#16707c', stripe: '#7a2a5a', implant: null } };
const PLAYER_SETS = {};
function playerSet(imp, spent) { const jl = typeof jacketLook === 'function' ? jacketLook() : {}, k = imp + (spent ? '_x' : '') + '|' + (jl.jacket || ''); if (!PLAYER_SETS[k]) { const base = CHARS.player; CHARS.player = Object.assign({}, base, jl, spent ? {} : (AUG[imp] || {})); PLAYER_SETS[k] = charSet('player'); CHARS.player = base; } return PLAYER_SETS[k]; }
function bodyFrame0(c) { return bodyF(c, poseOf(c, null, 'walk', 0)); }
// body frames are built the first time they're needed, then cached
function bodyFrame(t, w, pose, f) { const S = GFX.ch[t], k = (w || '-') + pose + f; return S.cache[k] || (S.cache[k] = bodyF(S.c, poseOf(S.c, w, pose, f))); }
// ---------- weapons ----------
const WEAPONS = {
  pipe: { name: 'PIPE', melee: 1, len: 9, c: '#9aa3ad', acc: '#5a626b', cd: 0.38, reach: 25, kills: 1, blunt: 1 },
  machete: { name: 'MACHETE', melee: 1, len: 10, c: '#d9dee6', acc: '#3a2a1a', cd: 0.3, reach: 26, kills: 1, sharp: 1 },
  saw: { name: 'ARC SAW', melee: 1, len: 9, c: '#ff8a1c', acc: '#ccc', cd: 0.22, reach: 25, kills: 1, loud: 1, sharp: 1 },
  pistol: { name: 'SERVICE PISTOL', len: 5, c: '#2a2d33', acc: '#4ff', ammo: 9, cd: 0.26, spread: 0.035, pellets: 1, noise: 300 },
  smg: { name: 'SPINNER', len: 8, c: '#33363d', acc: '#ff8a1c', ammo: 30, cd: 0.075, spread: 0.09, pellets: 1, noise: 320, auto: 1, two: 1 },
  pump: { name: 'PUMP SHOTGUN', len: 9, c: '#3a3d44', acc: '#7a4a2a', ammo: 6, cd: 0.75, spread: 0.24, pellets: 6, noise: 360, two: 1 },
  twin: { name: 'TWIN-BORE', len: 8, c: '#2a2a2a', acc: '#8a5a2a', ammo: 2, cd: 0.4, spread: 0.36, pellets: 10, noise: 380, two: 1, dbl: 1 },
  nailer: { name: 'NAIL DRIVER', len: 6, c: '#d8b21c', acc: '#333', ammo: 12, cd: 0.28, spread: 0.02, pellets: 1, noise: 40 },
};
// ---------- furniture (cells) ----------
const OBJ = {
  bed: { w: 2, h: 4, solid: 1, d: P => { P.r(0, 0, 16, 32, '#555b66'); P.r(1, 1, 14, 30, '#d8d4c8'); P.r(2, 2, 12, 6, '#f2f0ea'); P.r(1, 14, 14, 17, '#4a6aa8'); } },
  desk: { w: 3, h: 2, solid: 1, d: P => { P.r(0, 0, 24, 16, '#6e3f22'); P.r(1, 1, 22, 14, '#8a5230'); P.r(3, 2, 7, 5, '#1a1a22'); P.r(4, 3, 5, 3, '#4ff'); P.r(14, 4, 6, 4, '#ddd'); P.r(15, 5, 4, 2, '#999'); } },
  table: { w: 2, h: 2, solid: 1, d: P => { P.r(0, 0, 16, 16, '#3a2a22'); P.r(1, 1, 14, 14, '#c9b48a'); P.r(4, 5, 3, 3, '#eee'); P.r(10, 9, 3, 3, '#eee'); } },
  ltable: { w: 6, h: 2, solid: 1, d: P => { P.r(0, 0, 48, 16, '#2a2a30'); P.r(1, 1, 46, 14, '#9aa0a8'); for (let x = 4; x < 46; x += 8) P.r(x, 5, 3, 3, '#ddd'); } },
  toilet: { w: 1, h: 1, solid: 0, d: P => { P.r(1, 0, 6, 3, '#bbb'); P.d(4, 5, 2.6, 2.6, '#eee'); P.p(4, 5, '#7ac'); } },
  sink: { w: 1, h: 1, solid: 0, d: P => { P.r(0, 0, 8, 6, '#ccc'); P.r(2, 1, 4, 3, '#8ab'); } },
  locker: { w: 1, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 8, 16, '#3d5a7a'); P.r(1, 1, 6, 6, '#4a6e94'); P.r(1, 9, 6, 6, '#4a6e94'); P.p(6, 4, '#ddd'); P.p(6, 12, '#ddd'); } },
  plant: { w: 1, h: 1, solid: 1, tall: 1, d: P => { P.d(4, 4, 3.5, 3.5, '#6b3a1e'); P.d(4, 4, 3, 3, '#2e8a3e'); P.p(3, 3, '#5fd06a'); P.p(5, 5, '#1f5f2a'); } },
  crate: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 16, '#5a3e22'); P.r(1, 1, 14, 14, '#8a6234'); P.ln(1, 1, 14, 14, '#5a3e22'); P.ln(14, 1, 1, 14, '#5a3e22'); } },
  server: { w: 2, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 8, '#1a1c22'); for (let x = 1; x < 15; x += 3) P.p(x, 3, pick(['#4ff', '#3f8', '#f3a'])); } },
  sofa: { w: 3, h: 1, solid: 1, d: P => { P.r(0, 0, 24, 8, '#7a1f4a'); P.r(1, 2, 22, 5, '#a8326a'); } },
  bench: { w: 4, h: 1, solid: 0, d: P => { P.r(0, 1, 32, 6, '#6e4a2a'); P.r(0, 3, 32, 1, '#4a2e1a'); } },
  barrels: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.d(4, 4, 3.5, 3.5, '#2e6a3a'); P.d(12, 5, 3.5, 3.5, '#a8322a'); P.d(6, 12, 3.5, 3.5, '#2e4a8a'); P.p(4, 4, '#9f9'); } },
  van: { w: 6, h: 3, solid: 1, tall: 1, d: P => { P.r(0, 0, 48, 24, '#111'); P.r(1, 1, 46, 22, '#2a2440'); P.r(36, 3, 10, 18, '#4ff'); P.r(37, 4, 8, 16, '#1a6a7a'); P.r(4, 10, 28, 4, '#ff2a8a'); } },
  cagec: { w: 2, h: 2, solid: 1, tall: 1, d: P => { P.r(0, 0, 16, 16, '#222'); for (let i = 1; i < 16; i += 3) { P.r(i, 0, 1, 16, '#8a8f99'); } P.r(0, 0, 16, 1, '#aaa'); P.r(0, 15, 16, 1, '#aaa'); } },
  term: { w: 1, h: 1, solid: 1, tall: 1, d: P => { P.r(0, 0, 8, 8, '#1a1a22'); P.r(1, 1, 6, 4, '#3ff'); P.r(2, 2, 3, 1, '#0aa'); P.r(1, 6, 6, 1, '#555'); } },
  shower: { w: 1, h: 1, solid: 0, d: P => { P.d(4, 4, 2, 2, '#bbb'); P.p(4, 4, '#555'); } },
};
const OBJSPR = {};
function objSprite(k) { const o = OBJ[k]; SEED = 77; return spr(o.w * CELL, o.h * CELL, o.d); }
function genGfx() {
  SEED = 4242; GFX.floor = {}; for (const k of FL_IDS) GFX.floor[k] = floorHD(k);
  goreSprites();
  GFX.ch = {}; for (const k in CHARS) GFX.ch[k] = charSet(k);
  GFX.wpn = {}; for (const k in WEAPONS) GFX.wpn[k] = hdWeapon(k);
  for (const k in OBJ) OBJSPR[k] = OBJ_HD[k] ? hdObj(k) : hdUp(objSprite(k));
  SEED = 99; GFX.rack = rackSprites().map(hdUp); GFX.wpn.frag = hdWeapon('frag'); GFX.wpn.emp = hdWeapon('emp');
  GFX.cageBars = hdUp(spr(16, 16, P => { for (let i = 1; i < 16; i += 3) P.r(i, 0, 1, 16, '#8a8f99'); P.r(0, 0, 16, 1, '#aaa'); P.r(0, 15, 16, 1, '#aaa'); }));
  GFX.cageOpen = hdUp(spr(16, 16, P => { P.r(0, 0, 16, 16, '#2a2018'); for (let i = 1; i < 16; i += 3) { P.p(i, 0, '#8a8f99'); P.p(i, 15, '#8a8f99'); } P.r(0, 0, 16, 1, '#aaa'); P.r(0, 15, 16, 1, '#aaa'); P.r(0, 0, 1, 16, '#8a8f99'); P.ln(15, 15, 22, 9, '#aaa', 1); }));
  GFX.flash = flashHD();
}
