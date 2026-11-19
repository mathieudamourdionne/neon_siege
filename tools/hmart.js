// HM-style art prototype: side-view weapons with glints + selective outlines, detailed top-down characters, full-body corpses
(function () {
  const G = '#ffffff';
  // selective outline: each empty pixel touching the sprite takes a very dark shade of that neighbour's colour
  function selOutline(c, k) {
    const x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H), a = d.data, o = new Uint8ClampedArray(a);
    for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) {
      const p = (y * W + i) * 4; if (a[p + 3]) continue;
      for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) { const X = i + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; const q = (Y * W + X) * 4; if (a[q + 3]) { o[p] = a[q] * k; o[p + 1] = a[q + 1] * k; o[p + 2] = a[q + 2] * k; o[p + 3] = 255; break; } }
    }
    x.putImageData(new ImageData(o, W, H), 0, 0); return c;
  }
  function hardOutline(c, col) {
    const x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H), a = d.data, o = new Uint8ClampedArray(a), r = parseInt(col.slice(1, 3), 16), g = parseInt(col.slice(3, 5), 16), b = parseInt(col.slice(5, 7), 16);
    for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) { const p = (y * W + i) * 4; if (a[p + 3]) continue; for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) { const X = i + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; if (a[(Y * W + X) * 4 + 3]) { o[p] = r; o[p + 1] = g; o[p + 2] = b; o[p + 3] = 255; break; } } }
    x.putImageData(new ImageData(o, W, H), 0, 0); return c;
  }
  // ---------- palettes ----------
  const M0 = '#151518', M1 = '#2c2c32', M2 = '#45454d', M3 = '#6c6c76';            // gun metal
  const WR = ['#4a1a0a', '#7a2e12', '#a3461e'], WT = ['#5a4014', '#8a6626', '#b28a3c']; // red wood, tan wood
  const ST = ['#6a707a', '#b4bac4', '#e6eaf0'];                                       // steel
  const bar = (P, x, y, w, h, col) => { P.r(x, y, w, h, col); P.r(x, y, w, 1, shade(col, 1.45)); if (h > 2) P.r(x, y + h - 1, w, 1, shade(col, 0.7)); };
  const dots = (P, x0, x1, y, step) => { for (let x = x0; x <= x1; x += step) P.p(x, y, G); };
  const stock = (P, x, y, w, pal) => { P.r(x, y, w, 3, pal[1]); P.r(x, y, w, 1, pal[2]); P.r(x, y + 3, Math.ceil(w * 0.45), 2, pal[1]); P.r(x, y + 4, Math.ceil(w * 0.45), 1, pal[0]); };
  // each weapon: drawn pointing +x on a 44x16 canvas; g = where the rear hand grips, f = front hand (two-handers)
  const WD = {
    knife: { g: [4, 7], d: P => { P.r(2, 6, 5, 3, '#2a2220'); P.p(3, 7, '#4a3a34'); P.p(5, 7, '#4a3a34'); P.r(7, 5, 1, 5, ST[0]); P.r(8, 6, 7, 1, ST[0]); P.r(8, 7, 8, 1, ST[1]); P.r(8, 8, 6, 1, ST[2]); P.p(16, 7, ST[1]); P.p(10, 7, G); } },
    knives: { g: [4, 7], d: P => { for (const [o, y] of [[0, 4], [3, 8]]) { P.r(2 + o, y + 1, 4, 2, '#26262c'); P.p(1 + o, y + 1, '#888'); P.r(6 + o, y, 1, 4, ST[0]); P.r(7 + o, y + 1, 6, 2, ST[1]); P.r(7 + o, y + 2, 5, 1, ST[2]); P.p(13 + o, y + 1, ST[1]); P.p(9 + o, y + 1, G); } } },
    pipe: { g: [5, 7], d: P => { P.r(2, 6, 24, 3, '#6e767f'); P.r(2, 6, 24, 1, '#a6aeb8'); P.r(2, 8, 24, 1, '#4c535b'); for (const x of [2, 13, 23]) { P.r(x, 5, 3, 5, '#5a6169'); P.r(x, 5, 3, 1, '#8a929b'); } P.p(9, 7, '#8a4a2a'); P.p(18, 8, '#8a4a2a'); dots(P, 7, 20, 6, 6); } },
    machete: { g: [4, 7], d: P => { P.r(1, 6, 8, 3, '#1c1c20'); P.p(3, 7, '#777'); P.p(6, 7, '#777'); P.r(9, 5, 1, 5, '#3a3a40'); P.r(10, 4, 14, 4, ST[1]); P.r(10, 4, 14, 1, ST[0]); P.r(10, 7, 15, 1, ST[2]); P.r(24, 5, 2, 2, ST[1]); P.p(26, 6, ST[2]); P.p(13, 5, G); P.p(19, 5, G); } },
    katana: { g: [5, 7], f: [9, 7], d: P => { P.r(1, 6, 9, 3, '#18181c'); for (let x = 2; x < 10; x += 2) { P.p(x, 6, '#e8e0d0'); P.p(x + 1, 8, '#e8e0d0'); } P.r(10, 4, 2, 7, '#c8a040'); P.p(10, 4, '#f0d070'); P.r(12, 6, 3, 2, '#c8a040'); P.r(15, 6, 18, 2, ST[1]); P.r(15, 6, 18, 1, ST[2]); P.r(33, 5, 3, 2, ST[1]); P.p(36, 5, ST[2]); dots(P, 18, 30, 6, 6); } },
    saw: { g: [6, 8], d: P => { P.r(2, 4, 10, 7, '#e07a14'); P.r(2, 4, 10, 1, '#ffaa44'); P.r(2, 10, 10, 1, '#a04e08'); P.r(4, 6, 5, 2, '#2a2a2a'); P.p(5, 6, '#3ff'); P.r(12, 5, 15, 5, '#8a9099'); P.r(12, 5, 15, 1, '#c8ccd2'); P.r(26, 6, 2, 3, '#8a9099'); for (let x = 12; x < 27; x += 2) { P.p(x, 4, '#d8d8d8'); P.p(x + 1, 10, '#d8d8d8'); } P.r(4, 11, 4, 3, '#26262a'); } },
    bat: { g: [4, 7], f: [8, 7], d: P => { P.r(1, 6, 1, 3, '#d89a4a'); P.r(2, 6, 7, 2, '#1c1c20'); P.p(4, 6, '#444'); for (let x = 9; x < 27; x++) { const h = 2 + Math.round((x - 9) / 6); P.r(x, 7 - (h >> 1), 1, h, '#d89a4a'); P.p(x, 7 - (h >> 1), '#f4c27a'); } P.r(27, 5, 1, 4, '#c88a3a'); P.p(14, 6, G); P.p(21, 6, G); } },
    crowbar: { g: [6, 7], d: P => { P.r(3, 6, 21, 2, '#a0181c'); P.r(3, 6, 21, 1, '#e0484c'); P.r(1, 5, 2, 2, '#2a2a2e'); P.p(1, 4, '#2a2a2e'); P.r(24, 6, 2, 2, '#a0181c'); P.r(25, 8, 2, 2, '#a0181c'); P.r(24, 10, 2, 1, '#a0181c'); P.p(23, 10, '#2a2a2e'); P.p(10, 6, G); P.p(17, 6, G); } },
    sledge: { g: [5, 7], f: [12, 7], d: P => { P.r(1, 6, 22, 2, WT[1]); P.r(1, 6, 22, 1, WT[2]); P.r(1, 6, 5, 2, '#1c1c20'); P.r(22, 2, 7, 10, M2); P.r(22, 2, 7, 1, M3); P.r(22, 11, 7, 1, M1); P.r(23, 2, 1, 10, M3); P.p(25, 4, G); } },
    axe: { g: [5, 7], f: [12, 7], d: P => { P.r(1, 6, 22, 2, '#b8241c'); P.r(1, 6, 22, 1, '#e04a3a'); P.r(1, 6, 4, 2, '#1c1c20'); P.r(20, 3, 4, 6, M2); P.r(24, 1, 3, 10, ST[1]); P.r(26, 0, 2, 12, ST[2]); P.r(18, 4, 2, 3, M2); P.p(25, 3, G); } },
    cleaver: { g: [3, 7], d: P => { P.r(1, 6, 7, 3, WR[1]); P.r(1, 6, 7, 1, WR[2]); P.p(3, 7, '#ccc'); P.p(5, 7, '#ccc'); P.r(8, 2, 11, 9, ST[1]); P.r(8, 2, 11, 1, ST[0]); P.r(8, 10, 11, 1, ST[2]); P.r(18, 3, 1, 8, ST[2]); P.r(15, 4, 2, 2, '#2a2a2a'); P.p(11, 5, G); } },
    golf: { g: [4, 7], f: [8, 7], d: P => { P.r(1, 6, 8, 2, '#1c1c20'); P.r(9, 7, 20, 1, '#b8bec8'); P.p(14, 7, G); P.r(28, 7, 2, 4, '#d0d4da'); P.r(26, 10, 5, 2, '#d0d4da'); P.r(26, 11, 5, 1, '#8a9099'); } },
    bottle: { g: [5, 7], d: P => { P.r(3, 6, 6, 3, '#2e7a3a'); P.r(2, 6, 1, 3, '#c8a040'); P.r(9, 5, 3, 5, '#2e7a3a'); P.r(12, 4, 12, 7, '#2a6a32'); P.r(12, 4, 12, 1, '#5aaa62'); P.r(15, 6, 6, 3, '#e8e0c0'); P.p(16, 7, '#c82a2a'); P.p(13, 5, G); P.p(22, 5, G); } },
    pickaxe: { g: [5, 7], f: [12, 7], d: P => { P.r(1, 6, 22, 2, WT[1]); P.r(1, 6, 22, 1, WT[2]); P.r(22, 5, 3, 4, M2); P.r(23, 0, 2, 14, M2); P.r(23, 0, 1, 14, M3); P.p(22, 0, M1); P.p(22, 13, M1); P.p(24, 4, G); } },
    baton: { g: [5, 7], d: P => { P.r(1, 6, 9, 3, '#1c1c22'); for (let x = 2; x < 10; x += 2) P.p(x, 7, '#3a3a44'); P.r(10, 6, 2, 3, M2); P.r(12, 7, 12, 2, '#2a2a32'); P.r(12, 7, 12, 1, '#55555f'); P.r(24, 6, 2, 3, ST[1]); P.p(24, 6, G); P.p(17, 7, G); } },
    pistol: { g: [5, 9], d: P => { bar(P, 4, 5, 12, 3, M1); P.r(16, 5, 1, 2, M0); P.r(5, 8, 7, 1, M1); P.r(4, 8, 4, 2, M1); P.r(3, 10, 4, 3, M1); P.r(3, 10, 1, 3, M2); P.r(8, 9, 3, 1, M0); P.p(10, 8, M0); dots(P, 6, 14, 5, 4); } },
    silp: { g: [5, 9], d: P => { bar(P, 4, 5, 12, 3, M1); P.r(16, 5, 9, 3, '#1e1e22'); P.r(16, 5, 9, 1, M2); P.r(5, 8, 7, 1, M1); P.r(4, 8, 4, 2, M1); P.r(3, 10, 4, 3, M1); P.r(3, 10, 1, 3, M2); P.r(8, 9, 3, 1, M0); dots(P, 6, 14, 5, 4); P.p(20, 5, G); } },
    smart: { g: [5, 9], d: P => { bar(P, 3, 4, 15, 4, '#2e3a4e'); P.r(6, 6, 8, 1, '#3ff'); P.p(14, 6, '#bff'); P.r(18, 5, 2, 2, M0); P.r(4, 8, 4, 5, '#1e2a3a'); P.r(4, 8, 1, 5, '#3a4a60'); P.r(9, 8, 3, 1, M0); P.p(11, 9, M0); P.p(7, 4, G); P.p(15, 4, G); } },
    revolver: { g: [4, 9], d: P => { P.r(10, 5, 9, 2, '#8a8f99'); P.r(10, 5, 9, 1, '#c8ccd2'); P.p(18, 4, '#8a8f99'); P.r(6, 4, 5, 5, '#5c6068'); P.r(6, 4, 5, 1, '#9aa0a8'); P.p(7, 6, M0); P.p(9, 6, M0); P.r(4, 5, 2, 3, '#5c6068'); P.r(3, 8, 3, 2, WR[1]); P.r(2, 10, 3, 3, WR[1]); P.p(3, 8, WR[2]); P.r(7, 9, 3, 1, M0); P.p(13, 5, G); P.p(8, 4, G); } },
    nailer: { g: [7, 9], d: P => { bar(P, 3, 3, 13, 5, '#d8b21c'); P.r(5, 5, 7, 1, '#a07a10'); P.r(16, 5, 4, 2, '#2a2a2a'); P.r(20, 4, 1, 4, '#555'); P.r(6, 8, 3, 5, '#2a2a2e'); P.r(9, 8, 7, 2, '#8a8f99'); P.p(6, 3, G); P.p(12, 3, G); } },
    mpist: { g: [8, 9], d: P => { bar(P, 4, 4, 12, 4, M1); P.r(16, 5, 3, 2, M0); P.r(1, 5, 3, 1, M2); P.r(1, 5, 1, 3, M2); P.r(7, 8, 3, 7, M0); P.r(7, 8, 1, 7, M2); P.r(11, 8, 3, 1, M0); dots(P, 6, 14, 4, 4); } },
    smg: { g: [9, 10], f: [17, 8], d: P => { P.r(2, 5, 5, 3, M1); bar(P, 7, 3, 10, 6, '#33363d'); for (const y of [3, 5, 7]) { P.r(17, y, 11, 1, M2); P.p(28, y, M0); } P.r(17, 2, 3, 7, '#e07a14'); P.r(17, 2, 3, 1, '#ffaa44'); P.r(8, 9, 3, 4, M0); P.r(12, 9, 4, 3, M1); dots(P, 9, 15, 3, 3); } },
    pump: { g: [10, 8], f: [23, 8], d: P => { stock(P, 1, 5, 9, WR); bar(P, 10, 4, 7, 4, M1); P.r(17, 4, 19, 2, M1); P.r(17, 4, 19, 1, M3); P.r(17, 6, 15, 1, M0); P.r(19, 7, 9, 2, WR[1]); P.r(19, 7, 9, 1, WR[2]); for (let x = 20; x < 28; x += 2) P.p(x, 8, WR[0]); P.r(11, 8, 3, 2, M0); dots(P, 12, 34, 4, 7); } },
    twin: { g: [11, 8], f: [21, 9], d: P => { stock(P, 1, 5, 10, WT); P.r(11, 4, 4, 5, M2); P.r(11, 4, 4, 1, M3); P.r(15, 4, 18, 2, M1); P.r(15, 4, 18, 1, M3); P.r(15, 6, 18, 2, M1); P.r(15, 6, 18, 1, M2); P.r(16, 8, 9, 2, WT[1]); P.r(16, 8, 9, 1, WT[2]); P.r(12, 9, 2, 2, M0); dots(P, 18, 30, 4, 6); } },
    rifle: { g: [11, 8], f: [21, 8], d: P => { stock(P, 1, 6, 11, WT); P.r(12, 6, 13, 2, WT[1]); P.r(12, 6, 13, 1, WT[2]); P.r(12, 5, 6, 1, M1); P.r(25, 6, 14, 1, M1); P.p(39, 5, M1); bar(P, 10, 2, 11, 2, M0); P.r(10, 2, 1, 3, M1); P.r(20, 2, 1, 3, M1); P.p(20, 2, '#ff3b4e'); P.p(14, 4, M2); P.r(13, 8, 2, 2, M0); dots(P, 12, 18, 2, 6); P.p(30, 6, G); } },
    ar: { g: [12, 9], f: [22, 8], d: P => { stock(P, 1, 5, 9, WR); bar(P, 10, 4, 10, 4, M1); P.r(20, 5, 7, 3, WR[1]); P.r(20, 5, 7, 1, WR[2]); P.r(27, 5, 9, 1, M1); P.p(33, 4, M1); P.r(12, 8, 2, 3, M1); P.r(15, 8, 3, 2, M2); P.r(16, 10, 3, 2, M2); P.r(17, 12, 2, 1, M2); dots(P, 12, 18, 4, 3); P.p(31, 5, G); } },
    belt: { g: [11, 10], f: [22, 9], d: P => { P.r(1, 5, 7, 4, M1); P.r(1, 5, 7, 1, M2); bar(P, 8, 3, 10, 6, '#3a3a40'); P.r(18, 4, 15, 3, M1); P.r(18, 4, 15, 1, M2); for (let x = 19; x < 32; x += 3) P.p(x, 5, M0); P.r(33, 5, 6, 1, M0); P.r(26, 7, 1, 5, M0); P.r(28, 7, 1, 5, M0); for (let i = 0; i < 6; i++) { P.r(13 + i * 2, 9 + (i & 1), 1, 3, '#c8a040'); P.p(13 + i * 2, 9 + (i & 1), '#f0d070'); } P.r(10, 9, 2, 3, M0); dots(P, 10, 16, 3, 3); } },
    rail: { g: [10, 9], f: [20, 8], d: P => { P.r(1, 5, 7, 4, '#2e3a4a'); bar(P, 8, 3, 8, 6, '#3a4a5e'); P.r(16, 3, 18, 1, '#6a7a8e'); P.r(16, 8, 18, 1, '#6a7a8e'); for (let x = 17; x < 33; x += 4) P.r(x, 4, 2, 4, '#3ff'); P.r(16, 5, 18, 2, '#0a3a44'); P.r(9, 9, 3, 3, M0); P.p(10, 3, G); } },
    rocket: { g: [11, 9], f: [19, 9], d: P => { P.r(2, 4, 26, 5, '#4a5a2a'); P.r(2, 4, 26, 1, '#7a8a4a'); P.r(2, 8, 26, 1, '#2e3a1a'); P.r(1, 3, 2, 7, M1); P.r(28, 3, 2, 7, M1); P.r(30, 5, 3, 3, '#c82a2a'); P.p(30, 5, '#ff6a5a'); P.r(14, 1, 5, 3, M0); P.p(18, 2, '#ff3b4e'); P.r(10, 9, 2, 4, M0); P.r(18, 9, 2, 3, M0); P.p(8, 4, G); } },
    flare: { g: [5, 9], d: P => { bar(P, 4, 4, 9, 4, '#f07a14'); P.r(13, 4, 4, 4, '#d06010'); P.r(14, 5, 2, 2, '#3a1a08'); P.r(3, 8, 4, 5, '#f07a14'); P.r(3, 8, 1, 5, '#ffa850'); P.r(8, 8, 3, 1, M0); P.p(7, 4, G); } },
    frag: { g: [14, 8], d: P => { P.d(14, 8, 4, 4.5, '#3a5a2a'); for (let y = 5; y < 13; y += 2) P.r(11, y, 7, 1, '#2a4a1e'); P.p(12, 6, '#7aa05a'); P.r(13, 2, 3, 2, M2); P.r(16, 3, 3, 1, M3); P.p(18, 2, '#c8c8c8'); P.p(12, 6, G); } },
    emp: { g: [14, 8], d: P => { P.r(10, 4, 8, 9, '#1e3a6a'); P.r(10, 4, 8, 1, '#4a6aaa'); P.r(10, 8, 8, 1, '#3ff'); P.p(17, 8, '#bff'); P.r(12, 2, 4, 2, M2); P.p(11, 5, G); } },
  };
  const HMW = {}; for (const k in WD) HMW[k] = selOutline(spr(44, 16, WD[k].d), 0.3);
  const NAMES = { knife: 'KNIFE', knives: 'THROWING KNIVES', pipe: 'PIPE', machete: 'MACHETE', katana: 'KATANA', saw: 'ARC SAW', bat: 'BAT *', crowbar: 'CROWBAR *', sledge: 'SLEDGEHAMMER *', axe: 'FIRE AXE *', cleaver: 'CLEAVER *', golf: 'GOLF CLUB *', bottle: 'BOTTLE *', pickaxe: 'PICKAXE *', baton: 'BATON *',
    pistol: 'SERVICE PISTOL', silp: 'SILENCED PISTOL *', smart: 'SMART PISTOL', revolver: 'RICOCHET REVOLVER', nailer: 'NAIL DRIVER', mpist: 'MACHINE PISTOL *', smg: 'SPINNER', pump: 'PUMP SHOTGUN', twin: 'TWIN-BORE', rifle: 'LONG RIFLE', ar: 'ASSAULT RIFLE *', belt: 'BELT-FED MG', rail: 'RAIL GUN', rocket: 'MISSILE LAUNCHER', flare: 'FLARE GUN *', frag: 'FRAG GRENADE', emp: 'EMP GRENADE' };

  // ---------- characters: 80x80 canvas (2 px per world px), centre 40, facing +x ----------
  const INK = '#140c10', CV = 80, C = 40;
  const looks = {
    player: { hairStyle: 'short', collar: '#141418', stripe: '#ff2a8a', glow: '#4ff' },
    grd: { hat: 'helmet', vest: '#2c3446', pouches: 1, glove: '#26262c' },
    brc: { hat: 'helmet', pads: '#5c1c22', glove: '#26262c' },
    cln: { hairStyle: 'slick', collar: '#f0f0f0', shades: '#c81e28' },
    wkr: { hat: 'hard', hatCol: '#f2c21a', refl: '#f2f2dc', jacket: '#ec7a1c', glove: '#7a5430' },
    fat: { hat: 'helmet', pads: '#4a4e58', vest: '#4e525c', plates: 1, glove: '#26262c' },
    snp: { hat: 'hood', hood: '#34442e', goggles: '#5dff9a', glove: '#1c1c1c' },
    tec: { hairStyle: 'short', coat: 1, cross: '#2fd070', collar: '#d8d8d0' },
    hdl: { hairStyle: 'slick', collar: '#c8a040', tie: '#c8a040' },
    nadia: { hairStyle: 'pony', collar: '#141418' },
  };
  function look(k) { const c = Object.assign({}, CHARS[k], looks[k] || {}); if (c.hair === '#d8d8d8') c.hairL = '#ffffff'; return c; }
  function legs(c, f) {
    return hardOutline(spr(CV, CV, P => {
      const B = c.boots === '#000' ? '#18181c' : c.boots, Bl = shade(B === '#18181c' ? '#3a3a40' : B, 1.7), L = c.legs || '#333', F = c.fat ? 1.3 : 1;
      const s = f === 8 ? 0 : Math.sin(f / 8 * Math.PI * 2), fy = 5 * F, a = f === 8 ? C + 2 : C + 1 + s * 8, b = f === 8 ? C : C + 1 - s * 8;
      const leg = (fx, y) => { P.ln(C - 3, y, fx - 3, y, INK, 7); P.ln(C - 3, y, fx - 3, y, L, 5); P.ln(C - 3, y - 2, fx - 3, y - 2, shade(L, 1.35), 1);
        P.d(fx, y, 4.6, 3.4, INK); P.d(fx, y, 3.8, 2.6, B); P.r(fx, y - 2, 3, 1, Bl); };
      leg(Math.round(a), Math.round(C - fy)); leg(Math.round(b), Math.round(C + fy));
    }), INK);
  }
  function body(c, k, f) {
    const W = k && WEAPONS[k], wd = k && WD[k];
    return hardOutline(spr(CV, CV, P => {
      const J = c.jacket, Jd = shade(J, 0.66), Jl = shade(J, 1.3), Jll = shade(J, 1.55), S = c.skin || '#c68a5e', Sd = shade(S, 0.78), F = c.fat ? 1.32 : 1;
      const SH = Math.round(12 * F), x0 = C - Math.round(7 * F), x1 = C + 5, R = 5, s = f === 8 ? 0 : Math.sin(f / 8 * Math.PI * 2);
      const Gl = c.glove || S, Gll = shade(Gl, 1.4);
      // coat tail (lab coat) under everything
      if (c.coat) { P.r(x0 - 5, C - SH + 4, 8, 2 * SH - 8, INK); P.r(x0 - 4, C - SH + 5, 7, 2 * SH - 10, shade(J, 0.86)); P.r(x0 - 4, C - 1, 6, 1, shade(J, 0.7)); }
      // torso (stadium across the shoulders) with an ink edge
      const stad = (g, col) => { P.r(x0 - g, C - SH + R, x1 - x0 + 2 * g, 2 * (SH - R), col); P.d((x0 + x1) / 2, C - SH + R, (x1 - x0) / 2 + g, R + g, col); P.d((x0 + x1) / 2, C + SH - R, (x1 - x0) / 2 + g, R + g, col); };
      stad(1, INK); stad(0, J);
      P.r(x0, C - SH + 3, 3, 2 * SH - 6, Jd);                                          // back in shadow
      P.d(C, C - SH + 4, 3.5, 2.5, Jl); P.d(C, C + SH - 4, 3.5, 2.5, Jl);             // lit shoulder tops
      P.p(C - 1, C - SH + 3, Jll); P.p(C - 1, C + SH - 5, Jll);
      P.r(x0 + 2, C, C - x0 - 2, 1, Jd);                                               // spine seam
      P.ln(x0 + 2, C - 7, x0 + 5, C - 4, Jd, 1); P.ln(x0 + 2, C + 7, x0 + 5, C + 4, Jd, 1);   // back creases
      P.ln(C - 3, C - SH + 2, C + 1, C - SH + 6, Jd, 1); P.ln(C - 3, C + SH - 2, C + 1, C + SH - 6, Jd, 1); // shoulder seams
      P.p(x0 + 3, C - 9, Jl); P.p(x0 + 3, C + 8, Jl);
      if (c.vest) { P.r(x0 + 1, C - SH + 5, x1 - x0 - 3, 2 * SH - 10, INK); P.r(x0 + 2, C - SH + 6, x1 - x0 - 5, 2 * SH - 12, c.vest); P.r(x0 + 2, C - SH + 6, 1, 2 * SH - 12, shade(c.vest, 1.35));
        if (c.pouches) for (const y of [C - 8, C - 3, C + 2, C + 6]) { P.r(x0 + 2, y, 3, 3, shade(c.vest, 0.7)); P.p(x0 + 2, y, shade(c.vest, 1.4)); } }
      if (c.plates) for (let y = C - SH + 6; y < C + SH - 6; y += 4) P.r(x0 + 1, y, x1 - x0 - 3, 1, shade(c.vest, 0.65));
      if (c.stripe && !c.vest && !c.coat && !c.refl && !c.tie) { P.r(x0 + 1, C - SH + 4, 2, 2 * SH - 8, c.stripe); P.r(x0 + 1, C - SH + 4, 1, 2 * SH - 8, shade(c.stripe, 1.3)); }
      if (c.refl) { P.r(x0 + 2, C - SH + 2, 2, 2 * SH - 4, c.refl); P.r(C - 2, C - SH + 1, 2, 4, c.refl); P.r(C - 2, C + SH - 5, 2, 4, c.refl); }
      if (c.cross) { P.r(x0 - 1, C - 3, 5, 7, INK); P.r(x0 - 3, C - 1, 9, 3, INK); P.r(x0, C - 2, 3, 5, c.cross); P.r(x0 - 2, C, 7, 1, c.cross); P.r(x0 - 1, C - 1, 5, 3, c.cross); }
      if (c.pads) for (const y of [C - SH + 4, C + SH - 4]) { P.d(C - 1, y, 6.5, 4.5, INK); P.d(C - 1, y, 5.5, 3.6, c.pads); P.r(C - 4, y - 2, 5, 1, shade(c.pads, 1.6)); P.p(C - 5, y, shade(c.pads, 0.7)); }
      // arms
      const Ls = [C - 1, C - SH + 4], Rs = [C - 1, C + SH - 4];
      let la, ra, el = null, er = null, gun = null, wa = 0;
      if (!W) { la = [C + 7 + s * 4, C - SH + 2]; ra = [C + 7 - s * 4, C + SH - 2]; el = [C + 3, C - SH]; er = [C + 3, C + SH]; }
      else if (W.melee) { ra = [C + 11, C + SH - 3]; er = [C + 5, C + SH + 1]; la = [C + 7 + s * 3, C - SH + 2]; el = [C + 3, C - SH]; wa = -0.6; }
      else if (W.two) { gun = [C + 2, C - 1]; ra = [gun[0] + wd.g[0], gun[1] + wd.g[1]]; la = [gun[0] + wd.f[0], gun[1] + wd.f[1]]; }
      else { gun = [C + 9, C - 3]; ra = [gun[0] + wd.g[0], gun[1] + wd.g[1]]; la = [C + 6 + s * 3, C - SH + 2]; el = [C + 3, C - SH]; }
      const seg = (a, b) => { P.ln(a[0], a[1], b[0], b[1], INK, 7); };
      const fill = (a, b) => { P.ln(a[0], a[1], b[0], b[1], J, 5); P.ln(a[0] - 0.5, a[1] - 1.5, b[0] - 0.5, b[1] - 1.5, Jl, 1); };
      const arm = (sh, e, h) => { if (e) { seg(sh, e); seg(e, h); fill(sh, e); fill(e, h); } else { seg(sh, h); fill(sh, h); } };
      const cuffC = c.cuff || (c.collar && c.collar !== '#141418' ? c.collar : null);
      const hand = (h, from) => { if (cuffC && from) { const dx = h[0] - from[0], dy = h[1] - from[1], L = Math.hypot(dx, dy) || 1, cx2 = h[0] - dx / L * 3.5, cy2 = h[1] - dy / L * 3.5; P.d(cx2, cy2, 2.8, 2.8, INK); P.d(cx2, cy2, 2, 2, cuffC); }
        P.d(h[0], h[1], 3.2, 3.2, INK); P.d(h[0], h[1], 2.4, 2.4, Gl); P.r(h[0] - 1, h[1] - 2, 2, 1, Gll); P.p(h[0] + 1, h[1] + 1, shade(Gl, 0.7)); };
      const x = P.x, drawW = () => { if (!wd) return; x.save(); x.imageSmoothingEnabled = false; if (W.melee) { x.translate(Math.round(ra[0]), Math.round(ra[1])); x.rotate(wa); x.drawImage(HMW[k], -wd.g[0], -wd.g[1]); } else x.drawImage(HMW[k], gun[0], gun[1]); x.restore(); };
      arm(Ls, el, la);
      if (W && !W.melee) drawW();
      arm(Rs, er, ra);
      if (W && W.melee) drawW();
      hand(la, el || Ls); hand(ra, er || Rs);
      // collar ring + head
      const HR = 6.2 * (c.fat ? 1.08 : 1), hx = C + 2, hy = C;
      if (c.collar) { P.d(hx - 1.5, hy, HR + 2.2, HR + 2.6, INK); P.d(hx - 1.5, hy, HR + 1.4, HR + 1.8, c.collar); }
      if (c.tie) { P.r(hx + HR - 1, hy - 1, 4, 2, c.tie); }
      const ear = y => { P.d(hx - 1, y, 2.2, 2.2, INK); P.d(hx - 1, y, 1.4, 1.4, S); };
      if (c.hat === 'helmet') {
        P.d(hx, hy, HR + 1.6, HR + 1.6, INK); P.d(hx, hy, HR + 0.6, HR + 0.6, c.helmet); P.d(hx - 1, hy - 1, HR - 1.5, HR - 2, shade(c.helmet, 1.25));
        P.d(hx - 2, hy - 2.5, 2, 1.4, shade(c.helmet, 1.7)); P.r(hx - HR, hy, HR + 1, 1, shade(c.helmet, 0.7));
        P.r(Math.round(hx + HR - 2), hy - 4, 3, 8, INK); P.r(Math.round(hx + HR - 1), hy - 3, 2, 6, c.visor); P.p(Math.round(hx + HR - 1), hy - 3, '#fff');
      } else if (c.hat === 'hard') {
        const H = c.hatCol; P.d(hx, hy, HR + 2.6, HR + 2.6, INK); P.d(hx, hy, HR + 1.7, HR + 1.7, shade(H, 0.75)); P.d(hx - 0.5, hy, HR + 0.2, HR + 0.2, H);
        P.r(hx - HR, hy - 1, 2 * HR, 2, shade(H, 1.25)); P.r(hx - HR, hy - 1, 2 * HR, 1, '#fff6c8'); P.d(hx - 2.5, hy - 3, 1.6, 1.2, '#fff6c8');
      } else if (c.hat === 'hood') {
        P.d(hx - 1, hy, HR + 2.4, HR + 2.4, INK); P.d(hx - 1, hy, HR + 1.4, HR + 1.4, c.hood); P.d(hx - 2, hy - 1, HR - 1, HR - 1.4, shade(c.hood, 1.25));
        P.r(hx - HR - 1, hy, HR, 1, shade(c.hood, 0.7)); P.d(hx + HR - 1, hy, 2.4, HR - 1.5, '#0e120c');
        P.r(Math.round(hx + HR - 1), hy - 4, 2, 3, c.goggles); P.r(Math.round(hx + HR - 1), hy + 1, 2, 3, c.goggles); P.p(Math.round(hx + HR), hy - 4, '#fff');
      } else {
        ear(hy - HR - 0.3); ear(hy + HR + 0.3);
        P.d(hx, hy, HR + 1, HR + 1, INK); P.d(hx, hy, HR, HR, S); P.d(hx + 1.5, hy + 1.5, HR - 2.5, HR - 3, Sd);
        const H = c.hair, Hl = c.hairL || shade(H, 2.1), Hd = shade(H, 0.6);
        if (c.hairStyle === 'pony') { P.d(hx - HR - 3, hy + 1, 4.4, 3.4, INK); P.d(hx - HR - 3, hy + 1, 3.4, 2.4, H); P.p(hx - HR - 4, hy, Hl); }
        P.d(hx - 2, hy, HR - 0.2, HR + 0.3, H);
        if (c.hairStyle === 'slick') { for (const y of [-3, 0, 3]) P.r(hx - HR, hy + y, HR + 1, 1, y ? Hd : Hl); P.r(hx - 4, hy - 2, 4, 1, Hl); }
        else { P.d(hx - 3, hy - 2, HR - 3.5, HR - 4, Hl); for (const [dx, dy] of [[-4, 2], [-1, 3], [-5, -1], [0, -3]]) P.p(hx + dx, hy + dy, Hd); P.r(hx + 1, hy - 4, 2, 1, H); P.r(hx + 1, hy + 3, 2, 1, H); }
        if (c.shades) { P.r(Math.round(hx + HR - 2), hy - 4, 2, 3, c.shades); P.r(Math.round(hx + HR - 2), hy + 1, 2, 3, c.shades); P.r(Math.round(hx + HR - 1), hy - 1, 1, 2, INK); P.p(Math.round(hx + HR - 2), hy - 4, '#ffb0b0'); }
        else if (c.eyes) { P.p(Math.round(hx + HR - 1), hy - 2, c.eyes); P.p(Math.round(hx + HR - 1), hy + 2, c.eyes); }
        if (c.glow) { P.r(hx - HR + 1, hy - 1, 2, 2, c.glow); P.p(hx - HR + 1, hy - 1, '#fff'); }
      }
    }), INK);
  }
  // full-body corpse lying on its back, head toward +x (96x48 = 48x24 world)
  function corpse(c, v) {
    return hardOutline(spr(96, 48, P => {
      const J = c.jacket, Jd = shade(J, 0.66), Jl = shade(J, 1.3), S = c.skin || '#c68a5e', L = c.legs || '#333', Ll = shade(L, 1.4), B = c.boots === '#000' ? '#18181c' : c.boots, F = c.fat ? 1.2 : 1, my = 24, TW = Math.round(10 * F);
      const limb = (pts, w, col, hl) => { for (let i = 1; i < pts.length; i++) P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], INK, w + 2); for (let i = 1; i < pts.length; i++) { P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], col, w); if (hl) P.ln(pts[i - 1][0], pts[i - 1][1] - (w >> 1), pts[i][0], pts[i][1] - (w >> 1), hl, 1); } };
      const legA = v ? [[50, my - 5], [37, my - 9], [22, my - 9]] : [[50, my - 5], [36, my - 6], [21, my - 11]];
      const legB = v ? [[50, my + 5], [38, my + 10], [26, my + 16]] : [[50, my + 5], [36, my + 7], [22, my + 9]];
      const armA = v ? [[71, my - TW + 1], [77, my - TW - 7], [86, my - TW - 9]] : [[71, my - TW + 1], [63, my - TW - 6], [55, my - TW - 9]];
      const armB = v ? [[71, my + TW - 1], [62, my + TW + 5], [54, my + TW + 7]] : [[71, my + TW - 1], [77, my + TW + 7], [85, my + TW + 9]];
      limb(legA, 7, L, Ll); limb(legB, 7, L, Ll);
      for (const lg of [legA, legB]) { const p = lg[lg.length - 1]; P.d(p[0] - 1, p[1], 4.4, 4, INK); P.d(p[0] - 1, p[1], 3.4, 3, B); P.r(p[0] - 3, p[1] - 2, 2, 1, shade(B === '#18181c' ? '#444' : B, 1.7)); }
      P.r(47, my - 7, 5, 14, INK); P.r(48, my - 6, 4, 12, '#1c1c1c'); P.r(49, my - 1, 2, 2, '#c8a040');           // belt
      limb(armA, 5, J, Jl); limb(armB, 5, J, Jl);
      for (const a of [armA, armB]) { const p = a[a.length - 1]; P.d(p[0], p[1], 3.2, 3.2, INK); P.d(p[0], p[1], 2.4, 2.4, c.glove || S); }
      // torso: shoulders wider than the waist
      for (let x = 51; x <= 75; x++) { const t = (x - 51) / 24, hw = Math.round(lerp(7 * F, TW, Math.min(1, t * 1.6)) - (x > 73 ? 2 : 0)); P.r(x, my - hw - 1, 1, hw * 2 + 2, INK); P.r(x, my - hw, 1, hw * 2, J); P.p(x, my - hw, Jl); P.p(x, my + hw - 1, Jd); }
      if (c.vest) { P.r(55, my - 6 * F, 15, 12 * F, INK); P.r(56, my - 5 * F, 13, 10 * F, c.vest); if (c.pouches) for (const y of [-4, 1]) P.r(57, my + y, 3, 3, shade(c.vest, 0.7)); }
      else { P.r(63, my - 3, 11, 6, c.collar && c.collar !== '#141418' ? c.collar : '#e0dccc'); P.ln(74, my - 5, 61, my - 1, INK, 1); P.ln(74, my + 5, 61, my + 1, INK, 1); if (c.tie) P.r(62, my - 1, 11, 2, c.tie); if (c.cross) { P.r(57, my - 1, 5, 2, c.cross); P.r(58, my - 2, 2, 4, c.cross); } }
      if (c.refl) { P.r(57, my - TW + 1, 2, 2 * TW - 2, c.refl); P.r(66, my - TW + 1, 2, 2 * TW - 2, c.refl); }
      if (c.pads) for (const y of [my - TW + 2, my + TW - 2]) { P.d(72, y, 4, 3.4, INK); P.d(72, y, 3, 2.6, c.pads); }
      // head, face up
      const hx = 82, HR = 7;
      if (c.hat === 'helmet') { P.d(hx, my, HR + 1.6, HR + 1.6, INK); P.d(hx, my, HR + 0.6, HR + 0.6, c.helmet); P.r(hx - 3, my - 5, 3, 10, INK); P.r(hx - 2, my - 4, 2, 8, c.visor); P.d(hx + 2, my - 3, 2, 1.4, shade(c.helmet, 1.6)); }
      else if (c.hat === 'hood') { P.d(hx, my, HR + 1.8, HR + 1.8, INK); P.d(hx, my, HR + 0.8, HR + 0.8, c.hood); P.d(hx - 1, my, HR - 2, HR - 2.4, '#18140e'); P.p(hx - 2, my - 2, c.goggles); P.p(hx - 2, my + 2, c.goggles); }
      else {
        if (c.hat === 'hard') { P.d(hx + 9, my + 9, 5, 5, INK); P.d(hx + 9, my + 9, 4, 4, c.hatCol); P.p(hx + 8, my + 7, '#fff6c8'); }
        P.d(hx, my, HR + 1, HR + 1, INK); P.d(hx, my, HR, HR, S); P.d(hx + 3.5, my, HR - 3, HR + 0.3, c.hair || '#2a1a12');
        if (c.hairStyle === 'pony') { P.d(hx + HR + 3, my - 3, 3.4, 2.6, INK); P.d(hx + HR + 3, my - 3, 2.6, 1.8, c.hair); }
        if (c.shades) { P.r(hx - 1, my - 4, 2, 3, c.shades); P.r(hx - 1, my + 1, 2, 3, c.shades); } else { P.r(hx - 1, my - 3, 1, 2, INK); P.r(hx - 1, my + 1, 1, 2, INK); }
        P.r(hx - 4, my - 1, 2, 2, shade(S, 0.68)); P.r(hx - 6, my - 1, 1, 3, '#7a1010');
      }
      for (const [x, y, r] of [[60, my - 3, 3], [67, my + 4, 2.2]]) { P.d(x, y, r + 0.6, r + 0.6, '#5a0006'); P.d(x, y, r, r, '#b00a14'); P.p(x - 1, y - 1, '#ff4a50'); }
    }), INK);
  }
  window.HM = { selOutline, hardOutline, WD, HMW, NAMES, look, legs, body, corpse, CV };
})();
