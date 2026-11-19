// HM-style approval sheets: node tools/hm_preview.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  await p.addScriptTag({ path: ROOT + '/tools/hmart.js' });
  const shot = async (name, fn, h) => { if (h) await p.setViewportSize({ width: 1280, height: h }); await p.evaluate(fn); await p.waitForTimeout(80); await p.screenshot({ path: `${ROOT}/shots/${name}.png` }); await p.evaluate(() => document.getElementById('pv').remove()); };
  const mk = (W, H, bg) => `const cv = document.createElement('canvas'); cv.id = 'pv'; cv.width = ${W}; cv.height = ${H}; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:999'; document.body.appendChild(cv); const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.fillStyle = '${bg}'; x.fillRect(0, 0, ${W}, ${H});
    const T = (s, X, Y, z, col, al) => { x.font = 'bold ' + z + 'px Arial'; x.textAlign = al || 'left'; x.fillStyle = col || '#eee'; x.fillText(s, X, Y); };`;
  // ---- 1. weapons ----
  await shot('hm_weapons', new Function(mk(1280, 900, '#505050') + `
    Object.keys(HM.HMW).forEach((k, i) => { const col = i % 4, row = i / 4 | 0, X = 20 + col * 315, Y = 14 + row * 98; x.drawImage(HM.HMW[k], X, Y + 14, 44 * 6, 16 * 6); T(HM.NAMES[k], X, Y + 12, 13, HM.NAMES[k].includes('*') ? '#ffe14d' : '#ddd'); });
    T('* = NEW WEAPON IDEA (yellow)', 1260, 890, 14, '#ffe14d', 'right');`), 900);
  // ---- 2. characters + corpses ----
  await shot('hm_chars', new Function(mk(1280, 720, '#c8a26a') + `
    const L = [['player', 'katana', 'YOU'], ['grd', 'pistol', 'GUARD'], ['brc', 'pump', 'BREACHER'], ['cln', 'smart', 'CLEANER'], ['wkr', 'pipe', 'WORKER'], ['fat', 'belt', 'JUGGERNAUT'], ['snp', 'rifle', 'WATCHER'], ['tec', null, 'TECHNICIAN'], ['hdl', 'smart', 'HANDLER'], ['nadia', null, 'NADIA']];
    L.forEach(([k, w, n], i) => { const c = HM.look(k), Z = 3.2, cx = 110 + (i % 5) * 255, cy = 120 + (i / 5 | 0) * 220; x.save(); x.translate(cx, cy); x.drawImage(HM.legs(c, 2), -40 * Z, -40 * Z, 80 * Z, 80 * Z); x.drawImage(HM.body(c, w, 2), -40 * Z, -40 * Z, 80 * Z, 80 * Z); x.restore(); T(n, cx, cy + 92, 15, '#2a1a10', 'center'); });
    [['grd', 0], ['wkr', 1], ['cln', 0]].forEach(([k, v], i) => { const Z = 2.6; x.drawImage(HM.corpse(HM.look(k), v), 60 + i * 400, 560, 96 * Z, 48 * Z); });
    T('BODIES NOW LIE FULL-LENGTH', 640, 712, 15, '#2a1a10', 'center');`), 720);
  // ---- 3. full-frame in-game mockup (sprite pixels = canvas pixels, then scaled like the game does) ----
  await shot('hm_scene', new Function(mk(1280, 720, '#000') + `
    const WW = 267, WH = 150, [o, X] = mkCanvas(WW * 2, WH * 2); X.imageSmoothingEnabled = false; const INK = '#140c10';
    const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    const pat = (w, h, fn) => X.createPattern(spr(w, h, fn), 'repeat');
    const wood = pat(48, 16, P => { P.r(0, 0, 48, 16, '#d49a58'); for (const [y, o2] of [[0, 0], [8, 24]]) { for (let k = -1; k < 2; k++) { const x0 = o2 + k * 48; P.r(x0, y, 1, 8, '#6a3a1a'); } P.r(0, y + 7, 48, 1, '#6a3a1a'); P.r(0, y, 48, 1, '#eebc7a'); } for (let i = 0; i < 30; i++) P.p(rnd() * 48, rnd() * 16, '#c48a4a'); for (const [y, x0] of [[0, 1], [8, 25]]) P.r(x0, y + 1, 23, 1, '#e2aa66'); });
    const tile = pat(16, 16, P => { P.r(0, 0, 16, 16, '#3d8f88'); P.r(0, 0, 8, 8, '#e4e0d2'); P.r(8, 8, 8, 8, '#e4e0d2'); P.r(0, 0, 16, 1, '#2a5e5a'); P.r(0, 0, 1, 16, '#2a5e5a'); P.r(1, 1, 6, 1, '#fffef6'); P.r(9, 9, 6, 1, '#fffef6'); });
    const carpet = pat(8, 8, P => { for (let y = 0; y < 8; y++) for (let i = 0; i < 8; i++) P.p(i, y, (i + y) % 2 ? '#5a2266' : (rnd() < 0.3 ? '#7a3a86' : '#4a1a56')); });
    const rug = pat(8, 8, P => { for (let y = 0; y < 8; y++) for (let i = 0; i < 8; i++) P.p(i, y, (i + y) % 2 ? '#e0a020' : (rnd() < 0.3 ? '#ffd050' : '#c88a18')); });
    const S = 2, R = (px, py, w, h, f) => { X.fillStyle = f; X.fillRect(px * S, py * S, w * S, h * S); };
    R(0, 0, WW, 40, tile); R(0, 48, 150, 102, wood); R(158, 48, 109, 102, carpet);
    R(180, 92, 70, 44, '#8a5a10'); R(181, 93, 68, 42, rug); for (let i = 0; i < 68; i += 4) R(181 + i, 93, 2, 2, '#fff2c0');
    // blood: pools + splatter
    const blood = (cx, cy, r, n) => { for (let i = 0; i < n; i++) { const a = rnd() * 6.28, d = rnd() * r, rr = r * (0.35 + rnd() * 0.5); X.fillStyle = '#a0040c'; X.beginPath(); X.ellipse((cx + Math.cos(a) * d * 0.6) * S, (cy + Math.sin(a) * d * 0.6) * S, rr * S, rr * 0.8 * S, a, 0, 6.29); X.fill(); }
      for (let i = 0; i < n * 3; i++) { const a = rnd() * 6.28, d = r * (0.9 + rnd() * 1.4), s2 = 0.8 + rnd() * 1.8, px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d; X.fillStyle = rnd() < 0.5 ? '#b80610' : '#8a0008'; X.beginPath(); X.ellipse(px * S, py * S, s2 * S * 1.6, s2 * S * 0.9, a, 0, 6.29); X.fill(); X.strokeStyle = X.fillStyle; X.lineWidth = Math.max(1, s2); X.beginPath(); X.moveTo(px * S, py * S); X.lineTo((px - Math.cos(a) * s2 * 3) * S, (py - Math.sin(a) * s2 * 3) * S); X.stroke(); } };
    blood(42, 74, 13, 9); blood(200, 72, 12, 8); blood(118, 112, 5, 4);
    // walls: ink edge, cream face, posts at the door gaps
    const wall = (px, py, w, h) => { R(px, py, w, h, INK); R(px + 1, py + 1, w - 2, h - 2, '#e8dcc0'); if (w > h) { R(px + 1, py + 1, w - 2, 1, '#fffaf0'); R(px + 1, py + h - 3, w - 2, 1, '#b8a888'); } else { R(px + 1, py + 1, 1, h - 2, '#fffaf0'); R(px + w - 3, py + 1, 1, h - 2, '#b8a888'); } };
    const post = (px, py) => { R(px - 1, py - 1, 10, 10, INK); R(px, py, 8, 8, '#e8dcc0'); R(px + 2, py + 2, 4, 4, '#3a2a2a'); };
    wall(0, 40, 120, 8); wall(136, 40, 131, 8); wall(150, 48, 8, 48); wall(150, 112, 8, 38); post(112, 40); post(136, 40); post(150, 88); post(150, 112);
    R(136, 26, 2, 15, INK); R(137, 27, 1, 13, '#8a4a22');                                  // open door (corridor)
    X.save(); X.translate(154 * S, 112 * S); X.rotate(-2.3); X.fillStyle = INK; X.fillRect(0, -2, 16 * S, 4); X.fillStyle = '#8a4a22'; X.fillRect(2, -1, 16 * S - 4, 2); X.restore();
    // furniture: couch + low table
    R(226, 50, 40, 14, INK); R(227, 51, 38, 12, '#2a2a34'); for (let i = 0; i < 3; i++) { R(229 + i * 12, 53, 11, 8, '#3a3a48'); R(229 + i * 12, 53, 11, 1, '#5a5a6a'); }
    R(8, 120, 26, 18, INK); R(9, 121, 24, 16, '#5a3418'); R(9, 121, 24, 1, '#8a5a30'); R(13, 125, 6, 4, '#e8e8e0'); R(24, 130, 5, 4, '#2a6a32');
    // corpses + dropped weapons
    const put = (img, wx, wy, a, w, h) => { X.save(); X.translate(Math.round(wx * S), Math.round(wy * S)); X.rotate(a); X.drawImage(img, -w / 2, -h / 2); X.restore(); };
    put(HM.corpse(HM.look('wkr'), 1), 42, 74, 0.5, 96, 48); put(HM.corpse(HM.look('grd'), 0), 200, 72, -2.6, 96, 48);
    put(HM.HMW.pipe, 66, 92, 1.1, 44, 16); put(HM.HMW.pistol, 222, 88, 0.7, 44, 16); put(HM.HMW.bat, 30, 22, -0.3, 44, 16); put(HM.HMW.knife, 96, 136, 2.2, 44, 16); put(HM.HMW.pump, 120, 62, -0.2, 44, 16);
    // live characters
    const guy = (k, w, wx, wy, a, f) => { const c = HM.look(k); X.save(); X.translate(Math.round(wx * S), Math.round(wy * S)); X.rotate(a); X.drawImage(HM.legs(c, f), -40, -40); X.drawImage(HM.body(c, w, f), -40, -40); X.restore(); };
    guy('player', 'katana', 92, 100, -0.35, 2); guy('grd', 'pistol', 196, 22, Math.PI - 0.15, 8); guy('cln', 'smart', 48, 22, 0.1, 5); guy('brc', 'pump', 214, 118, -2.9, 8); guy('wkr', 'pipe', 128, 132, -2.2, 3);
    // muzzle flash + bullet streak from the guard
    R(150, 23, 22, 1, '#fff6c8'); R(171, 21, 4, 4, '#ffe14d');
    // mild vignette like the game's post pass, then blow up to the window
    x.drawImage(o, 0, 0, 1280, 720); const g = x.createRadialGradient(640, 360, 300, 640, 360, 760); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,0,20,0.55)'); x.fillStyle = g; x.fillRect(0, 0, 1280, 720);`), 720);
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
