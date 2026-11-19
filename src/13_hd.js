// ---------- HD art: every sprite here has 2 pixels per world unit (img.hd = 2) ----------
// outlined characters with real proportions, side-view weapons with glints, full-length bodies with gore
const HDK = 2, INK = '#140c10';
function hdc(c) { c.hd = HDK; return c; }
// draw a sprite at its world size (HD sprites are half their pixel size in world units)
function dImg(x, img, px, py) { const k = img.hd || 1; x.drawImage(img.live ? img : gpuOf(img), px, py, img.width / k, img.height / k); }
// every empty pixel touching the sprite takes a very dark shade of that neighbour (wood gets brown edges, steel black)
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
// Scale2x (EPX) for the older 1x furniture so it sits with the HD art
function scale2x(src) {
  const W = src.width, H = src.height, s = src.getContext('2d').getImageData(0, 0, W, H).data, [c, x] = mkCanvas(W * 2, H * 2), out = x.createImageData(W * 2, H * 2), o = out.data;
  const at = (i, j) => { if (i < 0 || j < 0 || i >= W || j >= H) return -1; const k = (j * W + i) * 4; return s[k + 3] > 8 ? (s[k] << 16 | s[k + 1] << 8 | s[k + 2]) : -1; };
  const put = (X, Y, v) => { if (v < 0) return; const k = (Y * W * 2 + X) * 4; o[k] = v >> 16 & 255; o[k + 1] = v >> 8 & 255; o[k + 2] = v & 255; o[k + 3] = 255; };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const P = at(i, j), A = at(i, j - 1), B = at(i + 1, j), C = at(i - 1, j), D = at(i, j + 1);
    put(i * 2, j * 2, C === A && C !== D && A !== B ? A : P); put(i * 2 + 1, j * 2, A === B && A !== C && B !== D ? B : P);
    put(i * 2, j * 2 + 1, D === C && D !== B && C !== A ? C : P); put(i * 2 + 1, j * 2 + 1, B === D && B !== A && D !== C ? D : P);
  }
  x.putImageData(out, 0, 0); return hdc(c);
}
const hdUp = src => hdc(hardOutline(scale2x(src), INK));
// ================= WEAPONS: side view, pointing +x on a 44x16 canvas =================
// g = rear-hand grip, f = front hand (two-handers), m = muzzle x
const M0 = '#151518', M1 = '#2c2c32', M2 = '#45454d', M3 = '#6c6c76', GL = '#ffffff';
const WRD = ['#4a1a0a', '#7a2e12', '#a3461e'], WTN = ['#5a4014', '#8a6626', '#b28a3c'], STL = ['#6a707a', '#b4bac4', '#e6eaf0'];
const wbar = (P, x, y, w, h, col) => { P.r(x, y, w, h, col); P.r(x, y, w, 1, shade(col, 1.45)); if (h > 2) P.r(x, y + h - 1, w, 1, shade(col, 0.7)); };
const wdots = (P, x0, x1, y, step) => { for (let x = x0; x <= x1; x += step) P.p(x, y, GL); };
const wstock = (P, x, y, w, pal) => { P.r(x, y, w, 3, pal[1]); P.r(x, y, w, 1, pal[2]); P.r(x, y + 3, Math.ceil(w * 0.45), 2, pal[1]); P.r(x, y + 4, Math.ceil(w * 0.45), 1, pal[0]); };
const WD = {
  knife: { g: [4, 7], d: P => { for (const [o, y] of [[0, 4], [3, 8]]) { P.r(2 + o, y + 1, 4, 2, '#26262c'); P.p(1 + o, y + 1, '#888'); P.r(6 + o, y, 1, 4, STL[0]); P.r(7 + o, y + 1, 6, 2, STL[1]); P.r(7 + o, y + 2, 5, 1, STL[2]); P.p(13 + o, y + 1, STL[1]); P.p(9 + o, y + 1, GL); } } },
  pipe: { g: [5, 7], d: P => { P.r(2, 6, 24, 3, '#6e767f'); P.r(2, 6, 24, 1, '#a6aeb8'); P.r(2, 8, 24, 1, '#4c535b'); for (const x of [2, 13, 23]) { P.r(x, 5, 3, 5, '#5a6169'); P.r(x, 5, 3, 1, '#8a929b'); } P.p(9, 7, '#8a4a2a'); P.p(18, 8, '#8a4a2a'); wdots(P, 7, 20, 6, 6); } },
  machete: { g: [4, 7], d: P => { P.r(1, 6, 8, 3, '#1c1c20'); P.p(3, 7, '#777'); P.p(6, 7, '#777'); P.r(9, 5, 1, 5, '#3a3a40'); P.r(10, 4, 14, 4, STL[1]); P.r(10, 4, 14, 1, STL[0]); P.r(10, 7, 15, 1, STL[2]); P.r(24, 5, 2, 2, STL[1]); P.p(26, 6, STL[2]); P.p(13, 5, GL); P.p(19, 5, GL); } },
  katana: { g: [5, 7], f: [9, 7], d: P => { P.r(1, 6, 9, 3, '#18181c'); for (let x = 2; x < 10; x += 2) { P.p(x, 6, '#e8e0d0'); P.p(x + 1, 8, '#e8e0d0'); } P.r(10, 4, 2, 7, '#c8a040'); P.p(10, 4, '#f0d070'); P.r(12, 6, 3, 2, '#c8a040'); P.r(15, 6, 18, 2, STL[1]); P.r(15, 6, 18, 1, STL[2]); P.r(33, 5, 3, 2, STL[1]); P.p(36, 5, STL[2]); wdots(P, 18, 30, 6, 6); } },
  saw: { g: [6, 8], d: P => { P.r(2, 4, 10, 7, '#e07a14'); P.r(2, 4, 10, 1, '#ffaa44'); P.r(2, 10, 10, 1, '#a04e08'); P.r(4, 6, 5, 2, '#2a2a2a'); P.p(5, 6, '#3ff'); P.r(12, 5, 15, 5, '#8a9099'); P.r(12, 5, 15, 1, '#c8ccd2'); P.r(26, 6, 2, 3, '#8a9099'); for (let x = 12; x < 27; x += 2) { P.p(x, 4, '#d8d8d8'); P.p(x + 1, 10, '#d8d8d8'); } P.r(4, 11, 4, 3, '#26262a'); } },
  pistol: { g: [5, 9], m: 17, d: P => { wbar(P, 4, 5, 12, 3, M1); P.r(16, 5, 1, 2, M0); P.r(5, 8, 7, 1, M1); P.r(4, 8, 4, 2, M1); P.r(3, 10, 4, 3, M1); P.r(3, 10, 1, 3, M2); P.r(8, 9, 3, 1, M0); P.p(10, 8, M0); wdots(P, 6, 14, 5, 4); } },
  smart: { g: [5, 9], m: 20, d: P => { wbar(P, 3, 4, 15, 4, '#2e3a4e'); P.r(6, 6, 8, 1, '#3ff'); P.p(14, 6, '#bff'); P.r(18, 5, 2, 2, M0); P.r(4, 8, 4, 5, '#1e2a3a'); P.r(4, 8, 1, 5, '#3a4a60'); P.r(9, 8, 3, 1, M0); P.p(11, 9, M0); P.p(7, 4, GL); P.p(15, 4, GL); } },
  revolver: { g: [4, 9], m: 19, d: P => { P.r(10, 5, 9, 2, '#8a8f99'); P.r(10, 5, 9, 1, '#c8ccd2'); P.p(18, 4, '#8a8f99'); P.r(6, 4, 5, 5, '#5c6068'); P.r(6, 4, 5, 1, '#9aa0a8'); P.p(7, 6, M0); P.p(9, 6, M0); P.r(4, 5, 2, 3, '#5c6068'); P.r(3, 8, 3, 2, WRD[1]); P.r(2, 10, 3, 3, WRD[1]); P.p(3, 8, WRD[2]); P.r(7, 9, 3, 1, M0); P.p(13, 5, GL); P.p(8, 4, GL); } },
  nailer: { g: [7, 9], m: 21, d: P => { wbar(P, 3, 3, 13, 5, '#d8b21c'); P.r(5, 5, 7, 1, '#a07a10'); P.r(16, 5, 4, 2, '#2a2a2a'); P.r(20, 4, 1, 4, '#555'); P.r(6, 8, 3, 5, '#2a2a2e'); P.r(9, 8, 7, 2, '#8a8f99'); P.p(6, 3, GL); P.p(12, 3, GL); } },
  smg: { g: [9, 10], f: [17, 8], m: 29, d: P => { P.r(2, 5, 5, 3, M1); wbar(P, 7, 3, 10, 6, '#33363d'); for (const y of [3, 5, 7]) { P.r(17, y, 11, 1, M2); P.p(28, y, M0); } P.r(17, 2, 3, 7, '#e07a14'); P.r(17, 2, 3, 1, '#ffaa44'); P.r(8, 9, 3, 4, M0); P.r(12, 9, 4, 3, M1); wdots(P, 9, 15, 3, 3); } },
  pump: { g: [10, 8], f: [23, 8], m: 36, d: P => { wstock(P, 1, 5, 9, WRD); wbar(P, 10, 4, 7, 4, M1); P.r(17, 4, 19, 2, M1); P.r(17, 4, 19, 1, M3); P.r(17, 6, 15, 1, M0); P.r(19, 7, 9, 2, WRD[1]); P.r(19, 7, 9, 1, WRD[2]); for (let x = 20; x < 28; x += 2) P.p(x, 8, WRD[0]); P.r(11, 8, 3, 2, M0); wdots(P, 12, 34, 4, 7); } },
  twin: { g: [11, 8], f: [21, 9], m: 33, d: P => { wstock(P, 1, 5, 10, WTN); P.r(11, 4, 4, 5, M2); P.r(11, 4, 4, 1, M3); P.r(15, 4, 18, 2, M1); P.r(15, 4, 18, 1, M3); P.r(15, 6, 18, 2, M1); P.r(15, 6, 18, 1, M2); P.r(16, 8, 9, 2, WTN[1]); P.r(16, 8, 9, 1, WTN[2]); P.r(12, 9, 2, 2, M0); wdots(P, 18, 30, 4, 6); } },
  rifle: { g: [11, 8], f: [21, 8], m: 40, d: P => { wstock(P, 1, 6, 11, WTN); P.r(12, 6, 13, 2, WTN[1]); P.r(12, 6, 13, 1, WTN[2]); P.r(12, 5, 6, 1, M1); P.r(25, 6, 14, 1, M1); P.p(39, 5, M1); wbar(P, 10, 2, 11, 2, M0); P.r(10, 2, 1, 3, M1); P.r(20, 2, 1, 3, M1); P.p(20, 2, '#ff3b4e'); P.p(14, 4, M2); P.r(13, 8, 2, 2, M0); wdots(P, 12, 18, 2, 6); P.p(30, 6, GL); } },
  belt: { g: [11, 10], f: [22, 9], m: 39, d: P => { P.r(1, 5, 7, 4, M1); P.r(1, 5, 7, 1, M2); wbar(P, 8, 3, 10, 6, '#3a3a40'); P.r(18, 4, 15, 3, M1); P.r(18, 4, 15, 1, M2); for (let x = 19; x < 32; x += 3) P.p(x, 5, M0); P.r(33, 5, 6, 1, M0); P.r(26, 7, 1, 5, M0); P.r(28, 7, 1, 5, M0); for (let i = 0; i < 6; i++) { P.r(13 + i * 2, 9 + (i & 1), 1, 3, '#c8a040'); P.p(13 + i * 2, 9 + (i & 1), '#f0d070'); } P.r(10, 9, 2, 3, M0); wdots(P, 10, 16, 3, 3); } },
  rail: { g: [10, 9], f: [20, 8], m: 34, d: P => { P.r(1, 5, 7, 4, '#2e3a4a'); wbar(P, 8, 3, 8, 6, '#3a4a5e'); P.r(16, 3, 18, 1, '#6a7a8e'); P.r(16, 8, 18, 1, '#6a7a8e'); for (let x = 17; x < 33; x += 4) P.r(x, 4, 2, 4, '#3ff'); P.r(16, 5, 18, 2, '#0a3a44'); P.r(9, 9, 3, 3, M0); P.p(10, 3, GL); } },
  rocket: { g: [11, 9], f: [19, 9], m: 33, d: P => { P.r(2, 4, 26, 5, '#4a5a2a'); P.r(2, 4, 26, 1, '#7a8a4a'); P.r(2, 8, 26, 1, '#2e3a1a'); P.r(1, 3, 2, 7, M1); P.r(28, 3, 2, 7, M1); P.r(30, 5, 3, 3, '#c82a2a'); P.p(30, 5, '#ff6a5a'); P.r(14, 1, 5, 3, M0); P.p(18, 2, '#ff3b4e'); P.r(10, 9, 2, 4, M0); P.r(18, 9, 2, 3, M0); P.p(8, 4, GL); } },
};
const NADE_HD = { frag: P => { P.d(7, 8, 4, 4.5, '#3a5a2a'); for (let y = 5; y < 13; y += 2) P.r(4, y, 7, 1, '#2a4a1e'); P.p(5, 6, '#7aa05a'); P.r(6, 2, 3, 2, M2); P.r(9, 3, 3, 1, M3); P.p(11, 2, '#c8c8c8'); P.p(5, 6, GL); },
  emp: P => { P.r(3, 4, 8, 9, '#1e3a6a'); P.r(3, 4, 8, 1, '#4a6aaa'); P.r(3, 8, 8, 1, '#3ff'); P.p(10, 8, '#bff'); P.r(5, 2, 4, 2, M2); P.p(4, 5, GL); } };
const HDW = {};
function hdWeapon(k) { if (HDW[k]) return HDW[k]; if (NADE_HD[k]) return HDW[k] = hdc(selOutline(spr(14, 16, NADE_HD[k]), 0.3)); return HDW[k] = WD[k] ? hdc(selOutline(spr(44, 16, WD[k].d), 0.3)) : scale2x(weaponIconOld(k)); }
function weaponIconOld(k) { return spr(16, 16, P => { const W = WEAPONS[k]; P.r(2, 7, W.len + 3, 3, shade(W.c, 0.6)); P.r(2, 7, W.len + 3, 2, W.c); }); }
// world distance from a character's centre to the muzzle, standing pose
function muzzleOff(k) { const W = WEAPONS[k], wd = WD[k]; if (!wd || !wd.m) return (W.two ? 1 : 5) + W.len + 2; const rx = W.two ? 15 : 16.5; return ((rx - 12) * 1.5 + (W.two ? 3 : 5) - wd.g[0] + wd.m) / 2 + 1; }
// ================= CHARACTERS: 80x80, facing +x, centre 40 =================
const LOOKS = {
  player: { hairStyle: 'short', collar: '#141418' },
  grd: { hat: 'helmet', vest: '#2c3446', pouches: 1, glove: '#26262c' },
  brc: { hat: 'helmet', pads: '#5c1c22', glove: '#26262c' },
  cln: { hairStyle: 'slick', collar: '#f0f0f0', shades: '#c81e28', jacket: '#26262e' },
  wkr: { hat: 'hard', hatCol: '#f2c21a', refl: '#f2f2dc', jacket: '#ec7a1c', glove: '#7a5430' },
  fat: { hat: 'helmet', pads: '#4a4e58', vest: '#4e525c', plates: 1, glove: '#26262c' },
  snp: { hat: 'hood', hood: '#34442e', goggles: '#5dff9a', glove: '#1c1c1c' },
  twin: { hat: 'helmet', pads: '#1a1a1a', vest: '#b84e10', plates: 1, glove: '#1c1c1c' }, twin2: { hat: 'helmet', pads: '#1a1a1a', vest: '#b89010', plates: 1, glove: '#1c1c1c' },
  mig: { hairStyle: 'short' }, mig2: { hairStyle: 'short' }, kid: { kid: 1, hairStyle: 'short' }, kid2: { kid: 1, hairStyle: 'short' },
  nadia: { hairStyle: 'pony', collar: '#141418' },
  rio: { hat: 'helmet', vest: '#141a22', glove: '#141418' },
  hdl: { hairStyle: 'slick', collar: '#c8a040', tie: '#c8a040' },
  tec: { hairStyle: 'short', coat: 1, cross: '#2fd070', collar: '#d8d8d0' },
  guest: { hairStyle: 'short', collar: '#f0f0f0', tie: '#16161c' }, guest2: { hairStyle: 'pony' }, guest3: { hairStyle: 'short', collar: '#f0f0f0', tie: '#c8a040' },
};
function hdLook(key) {
  const c = Object.assign({}, CHARS[key], LOOKS[key] || {}); if (c.hair === '#d8d8d8') c.hairL = '#ffffff';
  if (c.aug === 'ghost') Object.assign(c, { hat: 'hood', hood: '#22222c', goggles: '#9a9ab0' });
  if (c.aug === 'plating') c.pads = '#8a9099';
  return c;
}
// elbow for a two-segment arm (bends outward)
function elbow(sh, h, L, side) { const dx = h[0] - sh[0], dy = h[1] - sh[1], d = Math.hypot(dx, dy) || 0.01; if (d >= L - 0.5) return null; const k = Math.min(2.5, Math.sqrt(Math.max(0, (L / 2) ** 2 - (d / 2) ** 2))); let nx = -dy / d, ny = dx / d; if (ny * side < 0) { nx = -nx; ny = -ny; } return [(sh[0] + h[0]) / 2 + nx * k, (sh[1] + h[1]) / 2 + ny * k]; }
function headHD(P, c, hx, hy, HR) {
  const S = c.skin || '#c68a5e', Sd = shade(S, 0.78);
  const ear = y => { P.d(hx - 1, y, 1.8, 1.8, INK); P.d(hx - 1, y, 1.1, 1.1, S); };
  if (c.hat === 'helmet') {
    P.d(hx, hy, HR + 1.6, HR + 1.6, INK); P.d(hx, hy, HR + 0.6, HR + 0.6, c.helmet); P.d(hx - 1, hy - 1, HR - 1.5, HR - 2, shade(c.helmet, 1.25));
    P.d(hx - 2, hy - 2, 1.4, 1, shade(c.helmet, 1.7)); P.r(hx - HR, hy, HR, 1, shade(c.helmet, 0.7));
    P.r(Math.round(hx + HR - 2), hy - 3, 3, 6, INK); P.r(Math.round(hx + HR - 1), hy - 2, 2, 4, c.visor); P.p(Math.round(hx + HR - 1), hy - 2, '#fff');
  } else if (c.hat === 'hard') {
    const H = c.hatCol; P.d(hx, hy, HR + 2.6, HR + 2.6, INK); P.d(hx, hy, HR + 1.7, HR + 1.7, shade(H, 0.75)); P.d(hx - 0.5, hy, HR + 0.2, HR + 0.2, H);
    P.r(hx - HR, hy - 1, 2 * HR, 2, shade(H, 1.25)); P.r(hx - HR, hy - 1, 2 * HR, 1, '#fff6c8'); P.d(hx - 2.5, hy - 3, 1.6, 1.2, '#fff6c8');
  } else if (c.hat === 'hood') {
    P.d(hx - 1, hy, HR + 2.4, HR + 2.4, INK); P.d(hx - 1, hy, HR + 1.4, HR + 1.4, c.hood); P.d(hx - 2, hy - 1, HR - 1, HR - 1.4, shade(c.hood, 1.25));
    P.r(hx - HR - 1, hy, HR, 1, shade(c.hood, 0.7)); P.d(hx + HR - 1, hy, 2.4, HR - 1.5, '#0e120c');
    P.r(Math.round(hx + HR - 1), hy - 3, 2, 2, c.goggles); P.r(Math.round(hx + HR - 1), hy + 1, 2, 2, c.goggles); P.p(Math.round(hx + HR), hy - 3, '#fff');
  } else {
    ear(hy - HR); ear(hy + HR);
    P.d(hx, hy, HR + 1, HR + 1, INK); P.d(hx, hy, HR, HR, S); P.d(hx + 1.5, hy + 1.5, HR - 2.5, HR - 3, Sd);
    const H = c.hair || '#2a1a12', Hl = c.hairL || shade(H, 2.1), Hd = shade(H, 0.6);
    if (c.hairStyle === 'pony') { P.d(hx - HR - 3, hy + 1, 4.4, 3.4, INK); P.d(hx - HR - 3, hy + 1, 3.4, 2.4, H); P.p(hx - HR - 4, hy, Hl); }
    P.d(hx - 2, hy, HR - 0.2, HR + 0.3, H);
    if (c.hairStyle === 'slick') { for (const y of [-3, 0, 3]) P.r(hx - HR, hy + y, HR + 1, 1, y ? Hd : Hl); P.r(hx - 4, hy - 2, 4, 1, Hl); }
    else { P.d(hx - 2.5, hy - 1.5, Math.max(1, HR - 3), Math.max(1, HR - 3.4), Hl); for (const [dx, dy] of [[-3, 2], [-1, 2], [-4, -1], [0, -2]]) P.p(hx + dx, hy + dy, Hd); }
    if (c.shades) { P.r(Math.round(hx + HR - 2), hy - 3, 2, 2, c.shades); P.r(Math.round(hx + HR - 2), hy + 1, 2, 2, c.shades); P.p(Math.round(hx + HR - 1), hy - 1, INK); P.p(Math.round(hx + HR - 2), hy - 3, '#ffb0b0'); }
    else if (c.eyes) { P.p(Math.round(hx + HR - 1), hy - 2, c.eyes); P.p(Math.round(hx + HR - 1), hy + 2, c.eyes); }
  }
  if (c.implant && c.hat !== 'hard') { P.r(Math.round(hx - HR + 1), hy - 1, 2, 2, c.implant); P.p(Math.round(hx - HR + 1), hy - 1, '#fff'); }
  if (c.aug === 'spike') { P.r(Math.round(hx - HR - 2), hy - 2, 3, 4, INK); P.r(Math.round(hx - HR - 1), hy - 1, 2, 2, '#ff3bd8'); }
}
// legs: f 0..7 = run cycle, 8 = standing, 9 = kneeling on someone
function legsF(c, f) {
  return hdc(hardOutline(spr(80, 80, P => {
    const C = 40, K = c.kid ? 0.74 : 1, F = c.fat ? 1.3 : 1, B = c.boots === '#000' ? '#18181c' : c.boots, Bl = shade(B === '#18181c' ? '#3a3a40' : B, 1.7), L = c.legs || '#333';
    if (f === 9) { for (const y of [C - 4.5 * F, C + 4.5 * F]) { P.ln(C - 4, y, C + 7, y, INK, 5); P.ln(C - 4, y, C + 7, y, L, 3); P.d(C + 7, y, 2.6, 2.6, INK); P.d(C + 7, y, 1.9, 1.9, shade(L, 1.3)); P.d(C - 6, y, 2.8, 2.2, INK); P.d(C - 6, y, 2.1, 1.5, B); } return; }
    const s = f === 8 ? 0 : Math.sin(f / 8 * TAU), fy = 3.6 * F * K, a = f === 8 ? C + 2 : C + 1 + s * 7 * K, b = f === 8 ? C : C + 1 - s * 7 * K;
    const leg = (fx, y) => { P.ln(C - 3, y, fx - 3, y, INK, 5); P.ln(C - 3, y, fx - 3, y, L, 3); P.ln(C - 3, y - 1, fx - 3, y - 1, shade(L, 1.35), 1);
      P.d(fx, y, 3.6 * K, 2.6 * K, INK); P.d(fx, y, 2.8 * K, 1.8 * K, B); P.r(fx, y - 1, 2, 1, Bl); if (c.aug === 'dash') { P.r(fx - 6, y - 1, 2, 3, '#1a5a66'); P.p(fx - 6, y, '#4ff'); } };
    leg(Math.round(a), Math.round(C - fy)); leg(Math.round(b), Math.round(C + fy));
  }), INK));
}
// upper body for any pose from poseOf (24-unit coordinates are mapped onto the 80px canvas)
function bodyF(c, o) {
  const W = o.w, k = o.k, wd = W && WD[k];
  return hdc(hardOutline(spr(80, 80, P => {
    const C = 40, K = c.kid ? 0.74 : 1, F = c.fat ? 1.32 : 1, J = c.jacket, Jd = shade(J, 0.66), Jl = shade(J, 1.3), Jll = shade(J, 1.55);
    const SH = Math.round(9 * F * K), x0 = C - Math.round(5 * F * K), x1 = C + Math.round(4 * K), R = Math.round(4 * K);
    const armC = c.aug === 'od' ? '#a8202a' : J, armL = c.aug === 'od' ? '#ff5a5a' : Jl, Gl = c.aug === 'od' ? '#ff3b4e' : (c.glove || c.skin || '#c68a5e'), Gll = shade(Gl, 1.4);
    const map = v => v && [C + (v[0] - 12) * 1.5 * K, C + (v[1] - 12) * 1.3 * K];
    let la = map(o.la), ra = map(o.ra), gun = null; const fwd = W && !W.melee ? (W.two ? 3 : 5) : 0; if (fwd) { if (ra) ra[0] += fwd; if (la && !W.two) la[0] += fwd; }
    if (W && !W.melee && wd && ra) { gun = [Math.round(ra[0] - wd.g[0]), Math.round(ra[1] - wd.g[1])]; if (W.two && wd.f && o.la) { const pull = Math.max(0, (W.len - 4) - (o.la[0] - o.ra[0])) * 1.5; la = [gun[0] + wd.f[0] - pull, gun[1] + wd.f[1]]; } }
    if (c.coat) { P.r(x0 - 4, C - SH + 3, 7, 2 * SH - 6, INK); P.r(x0 - 3, C - SH + 4, 6, 2 * SH - 8, shade(J, 0.86)); P.r(x0 - 3, C - 1, 5, 1, shade(J, 0.7)); }
    if (c.aug === 'dash') for (const y of [C - 6, C + 3]) { P.r(x0 - 4, y, 5, 4, INK); P.r(x0 - 3, y + 1, 3, 2, '#1a3a44'); P.p(x0 - 3, y + 1, '#4ff'); P.p(x0 - 3, y + 2, '#bff'); }
    const stad = (g, col) => { P.r(x0 - g, C - SH + R, x1 - x0 + 2 * g, 2 * (SH - R), col); P.d((x0 + x1) / 2, C - SH + R, (x1 - x0) / 2 + g, R + g, col); P.d((x0 + x1) / 2, C + SH - R, (x1 - x0) / 2 + g, R + g, col); };
    stad(1, INK); stad(0, J);
    P.r(x0, C - SH + 3, 2, 2 * SH - 6, Jd); P.d(C, C - SH + 3, 2.5 * K, 1.8 * K, Jl); P.d(C, C + SH - 3, 2.5 * K, 1.8 * K, Jl); P.p(C - 1, C - SH + 2, Jll); P.p(C - 1, C + SH - 4, Jll);
    P.r(x0 + 2, C, C - x0 - 2, 1, Jd); P.ln(x0 + 2, C - 5 * K, x0 + 4, C - 3 * K, Jd, 1); P.ln(x0 + 2, C + 5 * K, x0 + 4, C + 3 * K, Jd, 1);
    if (c.vest) { P.r(x0 + 1, C - SH + 5, x1 - x0 - 3, 2 * SH - 10, INK); P.r(x0 + 2, C - SH + 6, x1 - x0 - 5, 2 * SH - 12, c.vest); P.r(x0 + 2, C - SH + 6, 1, 2 * SH - 12, shade(c.vest, 1.35));
      if (c.pouches) for (const y of [C - 5, C - 1, C + 3]) { P.r(x0 + 2, y, 2, 3, shade(c.vest, 0.7)); P.p(x0 + 2, y, shade(c.vest, 1.4)); }
      if (c.plates) for (let y = C - SH + 7; y < C + SH - 6; y += 4) P.r(x0 + 2, y, x1 - x0 - 5, 1, shade(c.vest, 0.65)); }
    if (c.stripe && !c.vest && !c.coat && !c.refl && !c.tie) { P.r(x0 + 1, C - SH + 4, 2, 2 * SH - 8, c.stripe); P.r(x0 + 1, C - SH + 4, 1, 2 * SH - 8, shade(c.stripe, 1.3)); }
    if (c.refl) { P.r(x0 + 2, C - SH + 2, 2, 2 * SH - 4, c.refl); P.r(C - 2, C - SH + 1, 2, 4, c.refl); P.r(C - 2, C + SH - 5, 2, 4, c.refl); }
    if (c.cross) { P.r(x0 - 1, C - 3, 4, 7, INK); P.r(x0 - 2, C - 2, 6, 5, INK); P.r(x0, C - 2, 2, 5, c.cross); P.r(x0 - 1, C - 1, 4, 3, c.cross); }
    if (c.aug === 'reflex') { P.r(x0 + 1, C - 2, C - x0 - 4, 4, INK); P.r(x0 + 2, C - 1, C - x0 - 6, 2, '#16241c'); for (let x = x0 + 2; x < C - 4; x += 3) P.p(x, C - 1, '#5dff9a'); }
    if (c.pads) for (const y of [C - SH + 3, C + SH - 3]) { P.d(C - 1, y, 5 * K, 3.4 * K, INK); P.d(C - 1, y, 4.1 * K, 2.6 * K, c.pads); P.r(C - 3, y - 1, 4, 1, shade(c.pads, 1.6)); }
    // arms (elbows bend outward), then the weapon, then hands on top
    const Ls = [C - 1, C - SH + 3], Rs = [C - 1, C + SH - 3], AL = 17 * K;
    const seg = (a, b) => P.ln(a[0], a[1], b[0], b[1], INK, 5);
    const fill = (a, b) => { P.ln(a[0], a[1], b[0], b[1], armC, 3); P.ln(a[0], a[1] - 1, b[0], b[1] - 1, armL, 1); };
    const arm = (sh, h, side) => { if (!h) return null; const e = elbow(sh, h, AL, side); if (e) { seg(sh, e); seg(e, h); fill(sh, e); fill(e, h); } else { seg(sh, h); fill(sh, h); } return e || sh; };
    const el = arm(Ls, la, -1), er = arm(Rs, ra, 1);
    const x = P.x, drawW = () => { if (!W || !wd && !HDW[k]) return; const img = hdWeapon(k); x.save(); x.imageSmoothingEnabled = false; if (W.melee) { x.translate(Math.round(ra[0]), Math.round(ra[1])); x.rotate(o.wa || 0); x.drawImage(img, -(wd ? wd.g[0] : 4), -(wd ? wd.g[1] : 7)); } else if (gun) x.drawImage(img, gun[0], gun[1]); x.restore(); };
    drawW();
    const cuffC = c.cuff || (c.collar && c.collar !== '#141418' ? c.collar : null);
    const hand = (h, from, big) => { if (!h) return; if (cuffC && from) { const dx = h[0] - from[0], dy = h[1] - from[1], L = Math.hypot(dx, dy) || 1, cx = h[0] - dx / L * 3.5, cy = h[1] - dy / L * 3.5; P.d(cx, cy, 2.2, 2.2, INK); P.d(cx, cy, 1.5, 1.5, cuffC); }
      const z = big ? 1.3 : 1; P.d(h[0], h[1], 2.6 * z * K, 2.6 * z * K, INK); P.d(h[0], h[1], 1.9 * z * K, 1.9 * z * K, Gl); P.p(h[0] - 1, h[1] - 1, Gll);
      if (c.aug === 'blades' && from) { const dx = h[0] - from[0], dy = h[1] - from[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L; P.ln(h[0] + ux * 2, h[1] + uy * 2, h[0] + ux * 9, h[1] + uy * 9, INK, 3); P.ln(h[0] + ux * 2, h[1] + uy * 2, h[0] + ux * 8, h[1] + uy * 8, '#dfe6ee', 1); P.p(h[0] + ux * 8, h[1] + uy * 8, '#fff'); } };
    hand(la, el, o.big === 'l'); hand(ra, er, o.big === 'r');
    if (c.shield) { P.r(C + 10, C - 14, 6, 28, INK); P.r(C + 11, C - 13, 4, 26, '#2a3442'); P.r(C + 11, C - 13, 1, 26, '#6a8aa8'); P.r(C + 14, C - 13, 1, 26, '#1a2028'); P.r(C + 12, C - 4, 2, 8, '#8ab4d8'); P.p(C + 12, C - 4, '#e8f8ff'); }
    const HR = 4.8 * K * (c.fat ? 1.08 : 1), hx = C + 1 + Math.round((o.lean || 0) * 1.5), hy = C;
    if (c.collar) { P.d(hx - 1.5, hy, HR + 1.8, HR + 2.1, INK); P.d(hx - 1.5, hy, HR + 1.1, HR + 1.4, c.collar); }
    if (c.tie) P.r(hx + HR - 1, hy - 1, 3, 2, c.tie);
    if (c.aug === 'spike') P.ln(hx - HR - 1, hy, C - 4, C + SH - 6, '#b02a9a', 1);
    headHD(P, c, hx, hy, HR);
  }), INK));
}
// ================= BODIES (lying on the back, head toward +x) =================
const PINK = '#f08aa8', PINKD = '#b84a6e', PINKL = '#ffc8d8', MEAT = '#8a0a14', MEATD = '#4a0208', BONE = '#f4ecdc';
const brainBlob = (P, x, y, r) => { P.d(x, y, r + 0.8, r * 0.8 + 0.8, PINKD); P.d(x, y, r, r * 0.8, PINK); for (let i = -r + 1; i < r; i += 2) P.ln(x + i, y - r * 0.5, x + i + 1, y + r * 0.4, PINKD, 1); P.p(x - 1, y - 1, PINKL); };
const gutsHD = (P, pts) => { for (let i = 1; i < pts.length; i++) P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], PINKD, 4); for (let i = 1; i < pts.length; i++) { P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], PINK, 2); P.p(pts[i][0], pts[i][1] - 1, PINKL); } };
// limb sets per corpse variant and per knocked-down frame
const LIMBS = {
  0: { legA: [[50, -5], [36, -6], [21, -11]], legB: [[50, 5], [36, 7], [22, 9]], armA: [[71, -1], [63, -6], [55, -9]], armB: [[71, 1], [77, 7], [85, 9]] },
  1: { legA: [[50, -5], [37, -9], [22, -9]], legB: [[50, 5], [38, 10], [26, 16]], armA: [[71, -1], [77, -7], [86, -9]], armB: [[71, 1], [62, 5], [54, 7]] },
  2: { legA: [[50, -5], [38, -10], [25, -15]], legB: [[50, 5], [36, 5], [21, 6]], armA: [[71, -1], [74, -9], [70, -16]], armB: [[71, 1], [63, 8], [57, 14]] },
  d0: { legA: [[50, -5], [40, -12], [28, -9]], legB: [[50, 5], [40, 12], [28, 9]], armA: [[71, -1], [77, -8], [84, -10]], armB: [[71, 1], [77, 8], [84, 10]] },
  d1: { legA: [[50, -5], [36, -7], [22, -9]], legB: [[50, 5], [42, 12], [32, 15]], armA: [[71, -1], [66, -8], [60, -12]], armB: [[71, 1], [79, 6], [86, 7]] },
  d2: { legA: [[50, -5], [42, -12], [32, -15]], legB: [[50, 5], [36, 7], [22, 9]], armA: [[71, -1], [78, -5], [86, -5]], armB: [[71, 1], [64, 8], [58, 11]] },
};
function lying(c0, o) {
  o = o || {}; const c = Object.assign({}, c0);
  if (o.burnt) Object.assign(c, { jacket: '#2a2220', legs: '#1e1a18', skin: '#3a2a22', hair: '#0e0c0c', vest: c.vest ? '#1e1a18' : null, collar: null, helmet: c.helmet ? '#1a1818' : null, visor: '#ff7a1a', pads: c.pads ? '#221e1c' : null, refl: null, hatCol: '#2a2420', boots: '#0e0e0e', glove: '#2a2220', cross: null, tie: null, hood: c.hood ? '#1a1a14' : null, shades: null });
  const half = o.part, hv = half === 'top' ? 10 : 0, lv = half === 'bot' ? -6 : 0;
  return hdc(hardOutline(spr(90, 46, P0 => {
    const q = 0.78, X0 = 55, Y0 = 28, tx = v => 45 + (v - X0) * q, ty = v => 23 + (v - Y0) * q;
    const P = { x: P0.x, r: (x, y, w, h, col) => P0.r(tx(x), ty(y), Math.max(1, w * q), Math.max(1, h * q), col), p: (x, y, col) => P0.p(tx(x), ty(y), col), d: (x, y, rx, ry, col) => P0.d(tx(x), ty(y), Math.max(0.6, rx * q), Math.max(0.6, ry * q), col), ln: (a, b, c2, d2, col, w) => P0.ln(tx(a), ty(b), tx(c2), ty(d2), col, Math.max(1, Math.round((w || 1) * (w > 3 ? 0.7 : 1)))) };
    const J = c.jacket, Jd = shade(J, 0.66), Jl = shade(J, 1.3), S = c.skin || '#c68a5e', L = c.legs || '#333', Ll = shade(L, 1.4), B = c.boots === '#000' ? '#18181c' : c.boots, F = c.fat ? 1.2 : 1, my = 28, TW = Math.round(10 * F), ox = 4 + hv, K = c.kid ? 0.8 : 1;
    const lim = LIMBS[o.limbs !== undefined ? o.limbs : 0], tr = (p, dx) => [p[0] + dx, my + p[1] * (p[1] === -1 || p[1] === 1 ? TW - 1 : 1) * (Math.abs(p[1]) === 1 ? 1 : 1)];
    const limb = (pts, w, col, hl) => { for (let i = 1; i < pts.length; i++) P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], INK, w + 2); for (let i = 1; i < pts.length; i++) { P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], col, w); if (hl) P.ln(pts[i - 1][0], pts[i - 1][1] - (w >> 1), pts[i][0], pts[i][1] - (w >> 1), hl, 1); } };
    const shoulder = (p, s) => [p[0] + ox, my + s * (TW - 1)], pt = (p, dx) => [p[0] + dx, my + p[1]];
    // lower body
    if (half !== 'top') {
      const legA = lim.legA.map(p => pt(p, 4 + lv)), legB = lim.legB.map(p => pt(p, 4 + lv));
      limb(legA, Math.round(7 * K), L, Ll); limb(legB, Math.round(7 * K), L, Ll);
      for (const lg of [legA, legB]) { const p = lg[lg.length - 1], Bh = shade(B === '#18181c' ? '#444' : B, 1.6); P.d(p[0] - 1, p[1], 4.6 * K, 4.2 * K, INK); P.d(p[0] - 1, p[1], 3.6 * K, 3.2 * K, B); P.r(p[0] - 4, p[1] - 1, 1, 3, Bh); P.r(p[0] - 2, p[1] - 2, 2, 1, Bh); }
      P.r(51 + lv, my - 8, 5, 16, INK); P.r(52 + lv, my - 7, 4, 14, '#1c1c1c'); P.r(53 + lv, my - 2, 2, 3, o.burnt ? '#5a4a2a' : '#d8b048'); P.r(51 + lv, my - 1, 1, 2, '#4a4a4a');
      if (half === 'bot') { P.d(56 + lv, my, 3, 8, INK); P.d(56 + lv, my, 2, 7, MEAT); P.r(56 + lv, my - 4, 1, 8, '#d02030'); P.p(56 + lv, my, BONE); gutsHD(P, [[57 + lv, my + 2], [62 + lv, my + 6], [60 + lv, my + 10]]); return; }
    }
    // upper body
    const armA = [shoulder(lim.armA[0], -1)].concat(lim.armA.slice(1).map(p => [p[0] + ox, my - TW + 1 + p[1]])), armB = [shoulder(lim.armB[0], 1)].concat(lim.armB.slice(1).map(p => [p[0] + ox, my + TW - 1 + p[1]]));
    if (o.sit) { for (const a of [armA, armB]) for (let i = 1; i < a.length; i++) a[i][0] -= 22; }
    limb(armA, 5, J, Jl); limb(armB, 5, J, Jl);
    for (const a of [armA, armB]) { const p = a[a.length - 1], q = a[a.length - 2], dx = p[0] - q[0], dy = p[1] - q[1], Ln = Math.hypot(dx, dy) || 1; if (c.collar && c.collar !== '#141418' && !c.vest) { P.d(p[0] - dx / Ln * 3, p[1] - dy / Ln * 3, 2.6, 2.6, INK); P.d(p[0] - dx / Ln * 3, p[1] - dy / Ln * 3, 1.8, 1.8, c.collar); } P.d(p[0], p[1], 3.4, 3.4, INK); P.d(p[0], p[1], 2.6, 2.6, c.glove || S); P.p(p[0] - 1, p[1] - 1, shade(c.glove || S, 1.3)); }
    const tx1 = o.sit ? 66 : 75;
    for (let x = 51; x <= tx1; x++) { const t = (x - 51) / (tx1 - 51), hw = Math.round(lerp(7 * F, TW, Math.min(1, t * 1.6)) - (x > tx1 - 2 ? 2 : 0)); P.r(x + ox, my - hw - 1, 1, hw * 2 + 2, INK); P.r(x + ox, my - hw, 1, hw * 2, J); P.p(x + ox, my - hw, Jl); P.p(x + ox, my + hw - 1, Jd); }
    P.ln(58 + ox, my - TW + 2, 64 + ox, my - TW + 5, Jd, 1); P.ln(58 + ox, my + TW - 2, 64 + ox, my + TW - 5, Jd, 1);
    if (c.vest) { P.r(55 + ox, my - 6 * F, Math.min(15, tx1 - 59), 12 * F, INK); P.r(56 + ox, my - 5 * F, Math.min(13, tx1 - 61), 10 * F, c.vest); P.r(56 + ox, my - 5 * F, Math.min(13, tx1 - 61), 1, shade(c.vest, 1.3)); if (c.pouches) for (const y of [-4, 1]) { P.r(57 + ox, my + y, 3, 3, shade(c.vest, 0.7)); P.r(62 + ox, my + y, 3, 3, shade(c.vest, 0.7)); } }
    else if (!o.sit) { const sh = c.collar && c.collar !== '#141418' ? c.collar : '#e0dccc'; P.r(62 + ox, my - 3, 12, 6, sh); P.ln(74 + ox, my - 5, 61 + ox, my - 1, INK, 1); P.ln(74 + ox, my + 5, 61 + ox, my + 1, INK, 1); P.r(70 + ox, my - 1, 4, 2, shade(sh, 0.8)); if (c.tie) { P.r(60 + ox, my - 1, 12, 2, c.tie); P.p(71 + ox, my - 1, shade(c.tie, 1.4)); } if (c.cross) { P.r(57 + ox, my - 1, 5, 2, c.cross); P.r(58 + ox, my - 2, 2, 4, c.cross); } }
    if (c.refl) { P.r(57 + ox, my - TW + 1, 2, 2 * TW - 2, c.refl); P.r(66 + ox, my - TW + 1, 2, 2 * TW - 2, c.refl); }
    if (c.pads) for (const y of [my - TW + 2, my + TW - 2]) { P.d(tx1 - 3 + ox, y, 4, 3.4, INK); P.d(tx1 - 3 + ox, y, 3, 2.6, c.pads); P.p(tx1 - 4 + ox, y - 1, shade(c.pads, 1.6)); }
    if (half === 'top') { P.d(51 + ox, my, 3, 8, INK); P.d(51 + ox, my, 2.2, 7, MEAT); P.r(50 + ox, my - 3, 1, 6, '#d02030'); gutsHD(P, [[50 + ox, my - 2], [44 + ox, my - 7], [38 + ox, my - 4], [40 + ox, my + 2]]); gutsHD(P, [[50 + ox, my + 3], [45 + ox, my + 8]]); P.p(51 + ox, my, BONE); }
    if (o.torso === 'shot') { const tx = 63 + ox; P.d(tx, my, 8, 6, INK); P.d(tx, my, 7, 5.2, MEATD); P.d(tx + 1, my - 1, 5, 3.6, MEAT); for (const dy of [-3, 0, 3]) P.ln(tx - 3, my + dy, tx + 4, my + dy - 1, BONE, 1); gutsHD(P, [[tx - 2, my + 2], [tx - 7, my + 8], [tx - 2, my + 13], [tx + 5, my + 12]]);
      for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; P.p(tx + Math.cos(a) * 8.5, my + Math.sin(a) * 6.5, i % 2 ? J : INK); } for (const [x, y] of [[57, -6], [69, 6], [60, 7], [70, -7]]) { P.d(x + ox, my + y, 1.4, 1.4, MEATD); P.p(x + ox, my + y, '#d02030'); } }
    // head, face up
    const hx = (o.sit ? 72 : 82) + ox, HR = 7 * K;
    const face = () => { P.d(hx, my, HR + 1, HR + 1, INK); P.d(hx, my, HR, HR, S); P.d(hx + 3.5, my, HR - 3, HR + 0.3, c.hair || '#2a1a12'); if (c.hairStyle === 'pony') { P.d(hx + HR + 3, my - 3, 3.4, 2.6, INK); P.d(hx + HR + 3, my - 3, 2.6, 1.8, c.hair); }
      if (c.shades) { P.r(hx - 1, my - 4, 2, 3, c.shades); P.r(hx - 1, my + 1, 2, 3, c.shades); } else if (c.eyes && !o.dead) { P.p(hx - 1, my - 3, c.eyes); P.p(hx - 1, my + 2, c.eyes); } else { P.r(hx - 1, my - 3, 1, 2, INK); P.r(hx - 1, my + 1, 1, 2, INK); }
      P.r(hx - 4, my - 1, 2, 2, shade(S, 0.68)); if (o.dead) { P.r(hx - 6, my - 2, 1, 4, '#7a1010'); P.p(hx - 6, my - 1, BONE); } else P.r(hx - 6, my - 1, 1, 2, '#5a1a1a'); };
    if (o.head === 'off') { P.d(hx - 6, my, 4, 4.5, INK); P.d(hx - 6, my, 3, 3.5, MEAT); P.d(hx - 6, my, 1.6, 1.6, '#d02030'); P.p(hx - 6, my, BONE); P.p(hx - 5, my, BONE); }
    else if (o.head === 'crush') { for (let i = 0; i < 7; i++) { const a = srnd() * 6.28, d = srnd() * 6; P.d(hx + 2 + Math.cos(a) * d, my + Math.sin(a) * d * 1.3, 3, 2.4, i % 2 ? MEAT : '#c01020'); } for (let i = 0; i < 6; i++) P.p(hx + (srnd() - 0.3) * 12, my + (srnd() - 0.5) * 14, c.hair || '#2a1a12'); brainBlob(P, hx + 3, my - 3, 2.4); P.p(hx - 1, my + 2, BONE); P.p(hx + 1, my + 4, BONE); P.p(hx + 4, my + 3, '#fff'); }
    else if (c.hat === 'helmet' && o.head !== 'burst') { P.d(hx, my, HR + 1.6, HR + 1.6, INK); P.d(hx, my, HR + 0.6, HR + 0.6, c.helmet); P.r(hx - 3, my - 5, 3, 10, INK); P.r(hx - 2, my - 4, 2, 8, c.visor); P.d(hx + 2, my - 3, 2, 1.4, shade(c.helmet, 1.6)); }
    else if (c.hat === 'hood' && o.head !== 'burst') { P.d(hx, my, HR + 1.8, HR + 1.8, INK); P.d(hx, my, HR + 0.8, HR + 0.8, c.hood); P.d(hx - 1, my, HR - 2, HR - 2.4, '#18140e'); P.p(hx - 2, my - 2, c.goggles); P.p(hx - 2, my + 2, c.goggles); }
    else { if (c.hat === 'hard' && !o.burnt && o.dead) { P.d(hx + 12, my + 9, 5, 5, INK); P.d(hx + 12, my + 9, 4, 4, c.hatCol); P.p(hx + 11, my + 7, '#fff6c8'); } if (c.hat === 'hard' && !o.dead) { P.d(hx, my, HR + 2.2, HR + 2.2, INK); P.d(hx, my, HR + 1.4, HR + 1.4, c.hatCol); P.r(hx - HR, my - 1, 2 * HR, 2, shade(c.hatCol, 1.25)); } else face(); }
    if (o.head === 'burst') { P.d(hx + 4, my, 5.5, 6.5, INK); P.d(hx + 4, my, 4.6, 5.6, MEAT); P.d(hx + 5, my, 3, 4, '#d02030'); brainBlob(P, hx + 6, my - 2, 3.2); brainBlob(P, hx + 9, my + 3, 2.6); brainBlob(P, hx + 12, my - 1, 2.2); for (const [dx, dy] of [[1, -6], [2, 6], [7, -5], [6, 6], [10, -4]]) P.p(hx + dx, my + dy, BONE); P.p(hx + 1, my - 5, '#fff'); }
    if (o.burnt) { for (let i = 0; i < 26; i++) P.p(30 + srnd() * 70, my - 12 + srnd() * 24, srnd() < 0.5 ? '#ff7a1a' : (srnd() < 0.5 ? '#ffd040' : '#3a3a3a')); }
    else if (o.wounds) for (const [x, y, r] of [[60, my - 3, 3], [67, my + 4, 2.2]]) { P.d(x + ox, y, r + 0.6, r + 0.6, MEATD); P.d(x + ox, y, r, r, '#b00a14'); P.p(x + ox - 1, y - 1, '#ff4a50'); }
  }), INK));
}
// knocked down: f 0..2 = flailing, 3 = sitting up
function downF(c, f) { return f === 3 ? lying(c, { limbs: 0, sit: 1 }) : lying(c, { limbs: 'd' + f }); }
// kinds: undefined = plain (v picks the pose), gib = shotgun, top/bot = cut in half, smash = crushed head, head = headshot, decap, burnt
function corpse(c, v, down, kind) {
  if (c.dog) return dogWreck(c, kind);
  SEED = 300 + (v || 0) * 7 + (kind ? kind.length * 13 : 0);
  const o = { dead: 1, limbs: (v || 0) % 3, wounds: !kind };
  if (kind === 'gib') o.torso = 'shot'; if (kind === 'top' || kind === 'bot') o.part = kind; if (kind === 'smash') o.head = 'crush'; if (kind === 'head') o.head = 'burst'; if (kind === 'decap') o.head = 'off'; if (kind === 'burnt') o.burnt = 1;
  return lying(c, o);
}
// a severed head (face up, neck stump toward -x)
function headSprite(c) { return hdc(hardOutline(spr(22, 20, P => { const S = c.skin || '#c68a5e', hx = 11, my = 10, HR = 7; if (c.hat === 'helmet') { P.d(hx, my, HR + 0.6, HR + 0.6, c.helmet); P.r(hx - 2, my - 4, 2, 8, c.visor); P.d(hx + 2, my - 3, 2, 1.4, shade(c.helmet, 1.6)); } else if (c.hat === 'hood') { P.d(hx, my, HR + 0.8, HR + 0.8, c.hood); P.d(hx - 1, my, HR - 2, HR - 2.4, '#18140e'); P.p(hx - 2, my - 2, c.goggles); } else { P.d(hx, my, HR, HR, S); P.d(hx + 3.5, my, HR - 3, HR + 0.3, c.hair || '#2a1a12'); P.r(hx - 1, my - 3, 1, 2, INK); P.r(hx - 1, my + 1, 1, 2, INK); P.r(hx - 4, my - 1, 2, 2, shade(S, 0.68)); if (c.shades) { P.r(hx - 2, my - 4, 2, 3, c.shades); P.r(hx - 2, my + 1, 2, 3, c.shades); } } P.d(hx - 6, my, 2.4, 4.4, MEAT); P.r(hx - 7, my - 2, 2, 4, '#d02030'); P.p(hx - 7, my, BONE); }), INK)); }
// gore chunks that fly out and stick to the floor
const GORE = {};
function goreSprites() {
  const o = (c, col) => hdc(hardOutline(c, col));
  GORE.brain = o(spr(12, 10, P => brainBlob(P, 6, 5, 4)), '#5a1020'); GORE.brain2 = o(spr(8, 7, P => brainBlob(P, 4, 3, 2.6)), '#5a1020');
  GORE.meat = o(spr(8, 7, P => { P.d(4, 3, 3.5, 3, MEAT); P.p(3, 2, '#d02030'); P.p(5, 4, MEATD); }), MEATD); GORE.meat2 = o(spr(6, 5, P => { P.d(3, 2, 2.4, 2, '#a01020'); P.p(2, 1, '#e03040'); }), MEATD);
  GORE.bone = o(spr(10, 5, P => { P.r(2, 2, 6, 1, BONE); P.d(2, 2, 1.6, 1.6, BONE); P.d(8, 2, 1.6, 1.6, BONE); }), '#5a4a3a');
  GORE.skull = o(spr(8, 6, P => { P.d(4, 3, 3.5, 2.5, BONE); P.p(3, 2, '#fff'); P.r(2, 4, 4, 1, '#c8b8a0'); }), '#5a4a3a');
  GORE.gut = o(spr(14, 8, P => gutsHD(P, [[2, 4], [5, 2], [9, 5], [12, 3]])), '#5a1020');
  GORE.plate = o(spr(8, 6, P => { P.r(1, 1, 6, 4, '#8a929e'); P.r(1, 1, 6, 1, '#c8ccd2'); }), INK); GORE.wire = o(spr(8, 6, P => { P.ln(1, 4, 7, 1, '#ffd040', 1); P.p(4, 3, '#3ff'); }), INK);
}
// ================= ROBOT HOUNDS =================
function dogSprites(c) {
  const fr = f => hdc(hardOutline(spr(56, 48, P => {
    const D = '#22262e', Pl = c.jacket, Hi = shade(Pl, 1.35), Lo = shade(Pl, 0.7), ph = f / 6 * TAU, fo = Math.cos(ph) * 5, bo = Math.cos(ph + 2.4) * 5, st = Math.sin(ph) * 1.5, Y = 24;
    const leg = (hx, hy, fx, fy) => { const kx = (hx + fx) / 2 - 2, ky = (hy + fy) / 2; P.ln(hx, hy, kx, ky, INK, 4); P.ln(kx, ky, fx, fy, INK, 3); P.ln(hx, hy, kx, ky, D, 2); P.ln(kx, ky, fx, fy, Lo, 1); P.d(fx, fy, 2.2, 2.2, INK); P.d(fx, fy, 1.4, 1.4, Lo); P.d(kx, ky, 1.2, 1.2, '#8a8f99'); };
    leg(34, Y - 5, 37 + fo, Y - 15); leg(34, Y + 5, 35 + fo, Y + 15); leg(18, Y - 5, 17 + bo, Y - 15); leg(18, Y + 5, 19 + bo, Y + 15);
    P.ln(11, Y, 4 - st, Y + (f % 3) - 1, INK, 3); P.ln(11, Y, 4 - st, Y + (f % 3) - 1, D, 1); P.d(4 - st, Y + (f % 3) - 1, 1.8, 1.8, '#ff3b4e');
    P.r(10, Y - 7, 26, 14, INK); P.r(11, Y - 6, 24, 12, Pl); P.r(11, Y - 6, 24, 2, Hi); P.r(11, Y + 4, 24, 2, Lo); P.r(22, Y - 6, 1, 12, D); P.r(16, Y - 6, 1, 12, shade(Pl, 0.85));
    P.r(25, Y - 2, 5, 4, INK); P.r(26, Y - 1, 3, 2, '#ff3b4e'); P.p(26, Y - 1, '#ffb0b0'); for (let x = 12; x < 21; x += 3) P.r(x, Y - 1, 2, 2, D);
    const hx = 35 + Math.round(st); P.r(hx, Y - 6, 11, 12, INK); P.r(hx + 1, Y - 5, 9, 10, Pl); P.r(hx + 1, Y - 5, 9, 2, Hi); P.r(hx + 8, Y - 4, 2, 8, c.visor); P.p(hx + 8, Y - 4, '#fff'); P.r(hx + 2, Y - 10, 3, 5, INK); P.r(hx + 3, Y - 9, 1, 3, D); P.r(hx + 2, Y + 5, 3, 5, INK); P.r(hx + 3, Y + 6, 1, 3, D);
  }), INK));
  return [0, 1, 2, 3, 4, 5].map(fr);
}
function dogWreck(c, kind) {
  SEED = 500 + (kind ? kind.length : 0);
  return hdc(hardOutline(spr(56, 48, P => {
    const D = '#22262e', Pl = c.jacket, Hi = shade(Pl, 1.3), Y = 24, wires = (x, y) => { P.ln(x, y, x + 4, y - 3, '#ffd040', 1); P.ln(x, y, x + 3, y + 4, '#3ff', 1); P.p(x + 5, y + 1, '#ff3b4e'); };
    P.d(28, Y, 16, 9, '#101216');
    if (kind !== 'bot') { P.r(30, Y - 6, 14, 12, INK); P.r(31, Y - 5, 12, 10, Pl); P.r(31, Y - 5, 12, 2, Hi); P.r(44, Y - 4, 6, 8, INK); P.r(45, Y - 3, 4, 6, Pl); P.p(48, Y - 2, kind === 'smash' ? '#3a0a0a' : c.visor); }
    if (kind !== 'top') { P.r(10, Y - 6, 17, 12, INK); P.r(11, Y - 5, 15, 10, Pl); P.r(11, Y - 5, 15, 2, Hi); P.ln(10, Y + 5, 6, Y + 13, INK, 3); P.ln(20, Y + 5, 23, Y + 14, INK, 3); P.ln(6, Y, 1, Y - 2, INK, 2); P.p(1, Y - 2, '#ff3b4e'); }
    if (kind === 'top' || kind === 'bot' || kind === 'gib') wires(27, Y); else { P.ln(34, Y - 6, 37, Y - 14, INK, 3); P.ln(38, Y + 6, 41, Y + 14, INK, 3); }
    if (kind === 'gib') { P.r(4, 6, 5, 4, Pl); P.r(44, 38, 6, 4, D); P.p(18, 40, '#ffd040'); }
  }), INK));
}
// ================= FLOORS (32x32 tiles = 16x16 world) =================
const hdNoise = (P, n, cols) => { for (let i = 0; i < n; i++) P.p(srnd() * 32 | 0, srnd() * 32 | 0, cols[srnd() * cols.length | 0]); };
const hdTiles = (P, sz, a, b, gr) => { for (let y = 0; y < 32; y += sz) for (let x = 0; x < 32; x += sz) { const col = ((x + y) / sz) % 2 ? a : b; P.r(x, y, sz, sz, col); P.r(x, y, sz, 1, shade(col, 1.18)); P.r(x, y, 1, sz, shade(col, 1.1)); P.r(x, y + sz - 1, sz, 1, gr || shade(col, 0.72)); P.r(x + sz - 1, y, 1, sz, gr || shade(col, 0.8)); } };
const hdPlanks = (P, a, b, mortar, hi) => { for (let r = 0; r < 4; r++) { const y = r * 8, off = r % 2 ? 16 : 0; for (let x = -off; x < 32; x += 32) { const col = (r + (x < 0 ? 1 : 0)) % 2 ? a : b; P.r(x, y, 32, 8, col); P.r(x, y, 32, 1, hi || shade(col, 1.25)); P.r(x, y + 7, 32, 1, mortar); P.r(x + 31, y, 1, 8, mortar); P.r(x + 32, y, 1, 8, mortar); } P.r(off ? 15 : 31, y, 1, 7, mortar); } hdNoise(P, 40, [shade(a, 0.9), shade(b, 1.08)]); };
const FLOORS_HD = {
  lino: P => { hdTiles(P, 16, '#46695b', '#3d5c50', '#2b4239'); hdNoise(P, 30, ['#3a5649', '#4e7464']); },
  conc: P => { P.r(0, 0, 32, 32, '#45474f'); hdNoise(P, 90, ['#3b3d44', '#50525a', '#55575f', '#36383f']); P.r(0, 31, 32, 1, '#34363c'); P.r(31, 0, 1, 32, '#34363c'); P.ln(4, 20, 11, 24, '#38393f', 1); P.ln(11, 24, 15, 23, '#38393f', 1); },
  check: P => hdTiles(P, 8, '#e8e1ee', '#2a1a33'),
  carpet: P => { for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) P.p(x, y, (x + y) % 2 ? '#4a1f5e' : (srnd() < 0.3 ? '#5a2a6e' : '#42184f')); for (let y = 4; y < 32; y += 16) for (let x = 4; x < 32; x += 16) { const o = (y / 16 | 0) % 2 ? 8 : 0; P.r(x + o, y, 2, 2, '#c23fa2'); P.r(x + o - 1, y + 1, 4, 1, '#7b2c8c'); } },
  tile: P => hdTiles(P, 8, '#8adcec', '#7fd6e8', '#4ba8bd'),
  wood: P => hdPlanks(P, '#a35a2a', '#b5672f', '#5e3016', '#d08848'),
  grate: P => { P.r(0, 0, 32, 32, '#22282e'); for (let i = 0; i < 32; i += 6) { P.r(i, 0, 3, 32, '#454e57'); P.r(i, 0, 1, 32, '#6a747e'); } P.r(0, 14, 32, 4, '#1a1e23'); P.r(0, 14, 32, 1, '#3a424a'); },
  pink: P => hdTiles(P, 16, '#ff7ab8', '#ff4fa0', '#c2306f'),
  cell: P => { P.r(0, 0, 32, 32, '#55524a'); for (const [x, y, w, h] of [[0, 0, 18, 14], [18, 0, 14, 14], [0, 14, 12, 18], [12, 14, 20, 18]]) { P.r(x, y, w, 1, '#6a665c'); P.r(x, y, 1, h, '#625e55'); P.r(x, y + h - 1, w, 1, '#3f3c36'); P.r(x + w - 1, y, 1, h, '#3f3c36'); } hdNoise(P, 60, ['#4a4740', '#615d54', '#3f3c36']); },
  deck: P => hdPlanks(P, '#7a3a2a', '#8a4632', '#3e1a10'),
  rug: P => { P.r(0, 0, 32, 32, '#5a1a2a'); for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if ((x + y) % 2 && srnd() < 0.3) P.p(x, y, '#6a2232'); P.r(0, 0, 32, 2, '#c8a040'); P.r(0, 16, 32, 2, '#c8a040'); for (let x = 4; x < 32; x += 16) { P.r(x + 2, 7, 4, 4, '#c8a040'); P.r(x + 3, 6, 2, 6, '#c8a040'); P.r(x + 1, 8, 6, 2, '#c8a040'); P.p(x + 3, 8, '#8a2a3a'); } },
  marble: P => { P.r(0, 0, 32, 32, '#dcd8d0'); hdTiles(P, 16, '#dcd8d0', '#d2cec6', '#b8b4ac'); P.ln(3, 26, 13, 15, '#bab6ae', 1); P.ln(13, 15, 22, 18, '#c4c0b8', 1); P.ln(22, 18, 29, 7, '#bab6ae', 1); },
  plate: P => { P.r(0, 0, 32, 32, '#5a6068'); hdTiles(P, 16, '#5c626a', '#565c64'); for (const [x, y] of [[3, 3], [12, 3], [3, 12], [12, 12], [19, 19], [28, 19], [19, 28], [28, 28], [19, 3], [28, 3], [3, 19], [12, 28]]) { P.p(x, y, '#9aa0a8'); P.p(x + 1, y + 1, '#3a3e44'); } },
  hazard: P => { for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) P.p(x, y, ((x + y) >> 3) & 1 ? '#e8c020' : '#1a1a1a'); for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (((x + y) & 7) === 0) P.p(x, y, ((x + y) >> 3) & 1 ? '#fff080' : '#2a2a2a'); },
  water: P => { P.r(0, 0, 32, 32, '#123a5a'); for (let i = 0; i < 12; i++) { const x = (i * 11) % 32, y = (i * 7) % 32; P.r(x, y, 5, 1, '#1f5a85'); P.r(x + 1, y + 1, 3, 1, '#2a7ab0'); } P.p(9, 22, '#8ad0ff'); P.p(24, 8, '#8ad0ff'); },
};
function floorHD(k) { SEED = 4242 + k.length; return hdc(FLOORS_HD[k] ? spr(32, 32, FLOORS_HD[k]) : scale2x(spr(16, 16, FLOORS[k]))); }
// ================= WALLS: cream-railed walls with a dashed core and posts at corners and door frames =================
const OUTDOOR = ['sand', 'rock', 'dirt', 'mud', 'asph', 'water', 'deck', 'roof', 'rail'];
function drawWallsHD(wx, def, keep) {
  const W = M.W, H = M.H, T = CELL * HDK, top = def.wall[0], lum = parseInt(top.slice(1, 3), 16) * 0.3 + parseInt(top.slice(3, 5), 16) * 0.59 + parseInt(top.slice(5, 7), 16) * 0.11;
  const rail = '#efe4cc', railHi = '#fffaf0', railLo = '#c8bca0', core = '#2a1612', dash = lum > 150 ? '#c8702a' : shade(top, 1.25), dashHi = shade(dash, 1.4), dashLo = shade(dash, 0.65);
  const isW = (x, y) => x >= 0 && y >= 0 && x < W && y < H && M.wall[y * W + x] === 1, isF = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !!M.b.fl[y * W + x], isV = (x, y) => !isW(x, y) && !isF(x, y);
  const ext = (x, y) => isW(x, y) && (isV(x - 1, y) || isV(x + 1, y) || isV(x, y - 1) || isV(x, y + 1)), indoor = (x, y) => { const f = M.b.fl[y * W + x]; return f && !OUTDOOR.includes(FL_IDS[f - 1]); };
  if (!keep) M.win = new Uint8Array(W * H); const posts = [];
  // windows along long straight outer walls next to indoor floor
  const runs = (horiz) => { const A = horiz ? H : W, B = horiz ? W : H; for (let a = 0; a < A; a++) { let start = -1; for (let b = 0; b <= B; b++) { const x = horiz ? b : a, y = horiz ? a : b, ok = b < B && ext(x, y) && (horiz ? (isF(x, y - 1) && indoor(x, y - 1)) || (isF(x, y + 1) && indoor(x, y + 1)) : (isF(x - 1, y) && indoor(x - 1, y)) || (isF(x + 1, y) && indoor(x + 1, y))) && (horiz ? !isW(x, y - 1) && !isW(x, y + 1) : !isW(x - 1, y) && !isW(x + 1, y));
    if (ok && start < 0) start = b; if (!ok && start >= 0) { const len = b - start; if (len >= 6) for (let k = start + 2; k + 1 < b - 2; k += 7) for (let q = 0; q < 2; q++) { const xx = horiz ? k + q : a, yy = horiz ? a : k + q; M.win[yy * W + xx] = horiz ? 1 : 2; } start = -1; } } } };
  if (!keep) { runs(true); runs(false); }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!isW(x, y)) continue; const X = x * T, Y = y * T, n = isW(x, y - 1), s = isW(x, y + 1), e = isW(x + 1, y), w = isW(x - 1, y), outer = ext(x, y);
    const nf = (i, j) => { const f = isF(x + i, y + j) && M.b.fl[(y + j) * W + x + i]; return f ? (OUTDOOR.includes(FL_IDS[f - 1]) ? 1 : 2) : 0; }, N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], N8 = N4.concat([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    if (outer && def.barrier && (N4.some(([i, j]) => nf(i, j) === 1) || (!N4.some(([i, j]) => nf(i, j)) && N8.some(([i, j]) => nf(i, j) === 1)))) { // concrete barrier with a hazard stripe
      wx.fillStyle = '#8e8c86'; wx.fillRect(X, Y, T, T); wx.fillStyle = '#b4b2aa'; wx.fillRect(X, Y + 2, T, 3); wx.fillStyle = '#6a6862'; wx.fillRect(X, Y + T - 4, T, 3);
      if ((x + y) % 2) { wx.fillStyle = '#7a7872'; wx.fillRect(X + T - 1, Y, 1, T); } for (let i = 0; i < T; i += 6) { wx.fillStyle = ((X + i) / 6 | 0) % 2 ? '#e8c020' : '#1a1a1a'; wx.fillRect(X + i, Y + 7, 6, 2); }
      wx.fillStyle = INK; if (!n) wx.fillRect(X, Y, T, 1); if (!s) wx.fillRect(X, Y + T - 1, T, 1); if (!w) wx.fillRect(X, Y, 1, T); if (!e) wx.fillRect(X + T - 1, Y, 1, T); continue;
    }
    if (outer) { // red brick
      wx.fillStyle = '#9a1620'; wx.fillRect(X, Y, T, T);
      for (let r = 0; r < 4; r++) { const yy = Y + r * 4, off = ((y * 4 + r) % 2) * 4; wx.fillStyle = '#5a0a12'; wx.fillRect(X, yy + 3, T, 1); for (let xx = X - off; xx < X + T; xx += 8) { wx.fillStyle = '#5a0a12'; if (xx + 7 >= X && xx + 7 < X + T) wx.fillRect(xx + 7, yy, 1, 3); wx.fillStyle = '#c83040'; wx.fillRect(Math.max(X, xx), yy, Math.min(7, X + T - Math.max(X, xx)), 1); } }
      wx.fillStyle = INK; if (!n) wx.fillRect(X, Y, T, 1); if (!s) wx.fillRect(X, Y + T - 1, T, 1); if (!w) wx.fillRect(X, Y, 1, T); if (!e) wx.fillRect(X + T - 1, Y, 1, T);
      const wv = M.win[y * W + x]; if (wv) drawWindow(wx, X, Y, T, wv === 1, false);
      continue;
    }
    wx.fillStyle = core; wx.fillRect(X, Y, T, T);
    const horiz = (e || w) && !n && !s, vert = (n || s) && !e && !w;
    if (horiz) for (let i = 0; i < T; i++) if ((X + i) % 8 < 5) { wx.fillStyle = dash; wx.fillRect(X + i, Y + 6, 1, 4); wx.fillStyle = dashHi; wx.fillRect(X + i, Y + 6, 1, 1); wx.fillStyle = dashLo; wx.fillRect(X + i, Y + 9, 1, 1); }
    if (vert) for (let i = 0; i < T; i++) if ((Y + i) % 8 < 5) { wx.fillStyle = dash; wx.fillRect(X + 6, Y + i, 4, 1); wx.fillStyle = dashHi; wx.fillRect(X + 6, Y + i, 1, 1); wx.fillStyle = dashLo; wx.fillRect(X + 9, Y + i, 1, 1); }
    if (!n) { wx.fillStyle = INK; wx.fillRect(X, Y, T, 1); wx.fillStyle = railHi; wx.fillRect(X, Y + 1, T, 1); wx.fillStyle = rail; wx.fillRect(X, Y + 2, T, 2); }
    if (!s) { wx.fillStyle = INK; wx.fillRect(X, Y + T - 1, T, 1); wx.fillStyle = railLo; wx.fillRect(X, Y + T - 2, T, 1); wx.fillStyle = rail; wx.fillRect(X, Y + T - 4, T, 2); }
    if (!w) { wx.fillStyle = INK; wx.fillRect(X, Y, 1, T); wx.fillStyle = railHi; wx.fillRect(X + 1, Y, 1, T); wx.fillStyle = rail; wx.fillRect(X + 2, Y, 2, T); }
    if (!e) { wx.fillStyle = INK; wx.fillRect(X + T - 1, Y, 1, T); wx.fillStyle = railLo; wx.fillRect(X + T - 2, Y, 1, T); wx.fillStyle = rail; wx.fillRect(X + T - 4, Y, 2, T); }
    if (n && w && !isW(x - 1, y - 1)) { wx.fillStyle = rail; wx.fillRect(X, Y, 4, 4); wx.fillStyle = INK; wx.fillRect(X, Y, 1, 1); }
    if (n && e && !isW(x + 1, y - 1)) { wx.fillStyle = rail; wx.fillRect(X + T - 4, Y, 4, 4); wx.fillStyle = INK; wx.fillRect(X + T - 1, Y, 1, 1); }
    if (s && w && !isW(x - 1, y + 1)) { wx.fillStyle = rail; wx.fillRect(X, Y + T - 4, 4, 4); wx.fillStyle = INK; wx.fillRect(X, Y + T - 1, 1, 1); }
    if (s && e && !isW(x + 1, y + 1)) { wx.fillStyle = rail; wx.fillRect(X + T - 4, Y + T - 4, 4, 4); wx.fillStyle = INK; wx.fillRect(X + T - 1, Y + T - 1, 1, 1); }
    const cnt = n + s + e + w, straight = (n && s && !e && !w) || (e && w && !n && !s);
    if (!straight && cnt < 4) posts.push([X, Y]);
  }
  for (const [X, Y] of posts) { wx.fillStyle = INK; wx.fillRect(X - 1, Y - 1, T + 2, T + 2); wx.fillStyle = rail; wx.fillRect(X, Y, T, T); wx.fillStyle = railHi; wx.fillRect(X, Y, T, 1); wx.fillRect(X, Y, 1, T); wx.fillStyle = core; wx.fillRect(X + 4, Y + 4, T - 8, T - 8); wx.fillStyle = rail; wx.fillRect(X + 6, Y + 6, T - 12, T - 12); }
}
// a window pane set into a wall cell (horizontal = runs along x); broken leaves jagged teeth in the frame
function drawWindow(wx, X, Y, T, horiz, broken) {
  wx.save(); wx.translate(X + T / 2, Y + T / 2); if (!horiz) wx.rotate(Math.PI / 2); wx.translate(-T / 2, -T / 2);
  wx.fillStyle = INK; wx.fillRect(0, 3, T, 10); wx.fillStyle = '#c8ccd4'; wx.fillRect(0, 4, T, 1); wx.fillRect(0, 11, T, 1);
  if (!broken) { wx.fillStyle = '#5ac8c0'; wx.fillRect(0, 5, T, 6); wx.fillStyle = '#8ae8e0'; wx.fillRect(0, 5, T, 2); wx.fillStyle = '#ffffff'; wx.fillRect(3, 6, 2, 1); wx.fillRect(10, 8, 3, 1); }
  else { wx.fillStyle = '#1a1416'; wx.fillRect(0, 5, T, 6); wx.fillStyle = '#8ae8e0'; for (let i = 0; i < T; i += 3) { wx.fillRect(i, 5, 1, 1 + (i * 7) % 3); wx.fillRect(i + 1, 10 - (i * 5) % 2, 1, 1 + (i * 5) % 2); } }
  wx.restore();
}
// muzzle flashes
function flashHD() {
  return [hdc(spr(24, 24, P => { P.d(10, 12, 5, 4, '#ffd040'); P.r(12, 10, 10, 4, '#ffe680'); P.d(10, 12, 2.4, 2, '#fff'); P.ln(14, 9, 19, 4, '#ffd040', 2); P.ln(14, 15, 19, 20, '#ffd040', 2); })),
    hdc(spr(32, 32, P => { P.d(12, 16, 7, 6, '#ff9a20'); P.d(14, 16, 6, 4.8, '#ffd040'); P.r(16, 14, 14, 4, '#ffe680'); P.d(12, 16, 3.2, 2.8, '#fff'); P.ln(18, 12, 26, 4, '#ffd040', 2); P.ln(18, 20, 26, 28, '#ffd040', 2); P.ln(16, 10, 20, 2, '#ff9a20', 1); P.ln(16, 22, 20, 30, '#ff9a20', 1); }))];
}
// character set: every sprite of a character, corpse variants built on first use
function charSet(key) {
  const c = hdLook(key), S = { c: c, cache: {} };
  const lazy = (name, fn) => { let v; Object.defineProperty(S, name, { get() { return v || (v = fn()); }, configurable: true }); };
  lazy('downF', () => [0, 1, 2, 3].map(f => downF(c, f))); lazy('down', () => S.downF[0]);
  lazy('dead', () => [corpse(c, 0), corpse(c, 1), corpse(c, 2)]);
  for (const k of ['gib', 'top', 'bot', 'smash', 'head', 'decap', 'burnt']) lazy(k, () => corpse(c, k === 'top' ? 1 : 0, false, k));
  lazy('headSpr', () => headSprite(c));
  if (c.dog) { S.dog = dogSprites(c); return S; }
  S.legs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(f => legsF(c, f));
  return S;
}

// ---------- prewarm: build every frame/body this floor will need, a few each frame ----------
const WARM = [];
function warmFloor() {
  WARM.length = 0; const types = new Set(G.ents.map(e => e.t)), wp = new Set(G.ents.map(e => e.wpn).filter(Boolean).concat(G.items.map(i => i.k).filter(k => WEAPONS[k]), [null]));
  const job = (t, w) => { const W = w && WEAPONS[w], S = GFX.ch[t]; if (!S || S.dog) return; if (!W || W.melee) { for (let f = 0; f < 8; f++) WARM.push(() => bodyFrame(t, w, 'walk', f)); if (W) for (const po of ['sF', 'sB']) for (let f = 0; f < 6; f++) WARM.push(() => bodyFrame(t, w, po, f)); else for (const po of ['pR', 'pL']) for (let f = 0; f < 3; f++) WARM.push(() => bodyFrame(t, w, po, f)); }
    else { WARM.push(() => bodyFrame(t, w, 'walk', 0), () => bodyFrame(t, w, 'rec', 0), () => bodyFrame(t, w, 'pump', 0), () => bodyFrame(t, w, 'pump', 1)); } };
  for (const t of types) { const S = GFX.ch[t]; for (const k of ['dead', 'gib', 'top', 'bot', 'smash', 'head', 'decap', 'burnt', 'headSpr', 'downF']) WARM.push(() => S[k]); job(t, null); for (const e of G.ents) if (e.t === t && e.wpn) job(t, e.wpn); }
  for (const w of wp) job('player', w);
}
function warmTick(budget) { const t0 = performance.now(); while (WARM.length && performance.now() - t0 < budget) { try { WARM.shift()(); } catch (e) { } } }
