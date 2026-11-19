// renders before/after art sheets for approval: node tools/hd_preview.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  await p.addScriptTag({ path: ROOT + '/tools/hdart.js' });
  const sheet = async (name, fn) => { await p.evaluate(fn); await p.waitForTimeout(80); await p.screenshot({ path: `${ROOT}/shots/hd_${name}.png` }); await p.evaluate(() => { const c = document.getElementById('pv'); if (c) c.remove(); }); };
  const setup = `const cv = document.createElement('canvas'); cv.id = 'pv'; cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:999'; document.body.appendChild(cv); const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.fillStyle = '#23202c'; x.fillRect(0, 0, 1280, 720);
    const T = (s, X, Y, z, col, al) => { x.font = 'italic 900 ' + z + 'px Arial Black, Impact, sans-serif'; x.textAlign = al || 'center'; x.fillStyle = col || '#ffe14d'; x.fillText(s, X, Y); };`;
  // 1. characters: current vs new, same size on screen
  await sheet('chars', new Function(setup + `
    const L = [['player', 'katana', 'YOU'], ['grd', 'pistol', 'GUARD'], ['brc', 'pump', 'BREACHER'], ['cln', 'smart', 'CLEANER'], ['wkr', 'pipe', 'WORKER'], ['fat', 'belt', 'JUGGERNAUT'], ['snp', 'rifle', 'WATCHER'], ['tec', null, 'TECHNICIAN'], ['hdl', 'smart', 'HANDLER'], ['nadia', null, 'NADIA']];
    T('CURRENT', 20, 46, 26, '#ff6a8a', 'left'); T('NEW', 20, 386, 26, '#5dff9a', 'left');
    L.forEach(([k, w, n], i) => { const cx = 70 + i * 122;
      const old = GFX.ch[k], Z = 6; x.save(); x.translate(cx, 170); x.rotate(-Math.PI / 2); x.drawImage(old.legs[8], -12 * Z, -12 * Z, 24 * Z, 24 * Z); x.drawImage(bodyFrame(k, w, 'walk', 0), -12 * Z, -12 * Z, 24 * Z, 24 * Z); x.restore(); T(n, cx, 300, 15, '#ddd');
      const c = HD.charOf(k), Z2 = 3; x.save(); x.translate(cx, 510); x.rotate(-Math.PI / 2); x.drawImage(HD.hdLegs(c, 8), -36 * Z2, -36 * Z2, 72 * Z2, 72 * Z2); x.drawImage(HD.hdBody(c, w, 8), -36 * Z2, -36 * Z2, 72 * Z2, 72 * Z2); x.restore(); T(n, cx, 650, 15, '#ddd'); });
  `));
  // 2. weapons: current vs new
  await sheet('weapons', new Function(setup + `
    const L = ['knife', 'pipe', 'machete', 'katana', 'saw', 'pistol', 'smart', 'revolver', 'nailer', 'smg', 'pump', 'twin', 'rifle', 'belt', 'rail', 'rocket', 'frag', 'emp'];
    for (const bx of [40, 660]) { T('NOW', bx + 207, 40, 18, '#ff6a8a'); T('NEW', bx + 372, 40, 18, '#5dff9a'); }
    L.forEach((k, i) => { const col = i % 2, row = i >> 1, y = 70 + row * 70, bx = col ? 660 : 40;
      const nm = (WEAPONS[k] || NADES[k] || {}).name || k.toUpperCase(); T(nm, bx, y + 34, 13, '#ddd', 'left');
      x.drawImage(GFX.wpn[k], bx + 175, y + 4, 64, 64);
      x.drawImage(HD.HDW[k], bx + 300, y + 12, 32 * 4.5, 12 * 4.5); });
  `));
  // 3. a mock of the game at the new detail level, next to the current look at the same zoom
  await sheet('scene', new Function(setup + `
    const hdFloor = (a, b2, line) => spr(32, 32, P => { for (let yy = 0; yy < 32; yy += 16) for (let xx = 0; xx < 32; xx += 16) P.r(xx, yy, 16, 16, ((xx + yy) >> 4) & 1 ? a : b2); for (let i = 0; i < 32; i += 16) { P.r(i, 0, 1, 32, line); P.r(0, i, 32, 1, line); } for (let k = 0; k < 40; k++) P.p(Math.random() * 32, Math.random() * 32, shade(a, 0.93)); });
    const tileHD = hdFloor('#46695b', '#3d5c50', '#2b4239'), woodHD = spr(32, 32, P => { for (let yy = 0; yy < 32; yy += 6) { P.r(0, yy, 32, 6, yy % 12 ? '#a35a2a' : '#b5672f'); P.r(0, yy + 5, 32, 1, '#6e3a1a'); P.r((yy * 7) % 29 + 1, yy, 1, 5, '#6e3a1a'); for (let k = 0; k < 6; k++) P.p(Math.random() * 32, yy + 1 + Math.random() * 3, '#c07040'); } });
    // scene in world units (1 world px = 1 old pixel): a corridor and a room
    const draw = (hd, ox, oy, vw, vh, Z) => {
      x.save(); x.beginPath(); x.rect(ox, oy, vw, vh); x.clip(); x.translate(ox, oy); x.fillStyle = '#1a1622'; x.fillRect(0, 0, vw, vh);
      const S = Z; // world -> screen
      const fill = (pat, wx, wy, ww, wh, oldPat) => { if (hd) { for (let yy = wy; yy < wy + wh; yy += 16) for (let xx = wx; xx < wx + ww; xx += 16) x.drawImage(pat, 0, 0, 32, 32, xx * S, yy * S, 16 * S, 16 * S); } else { for (let yy = wy; yy < wy + wh; yy += 16) for (let xx = wx; xx < wx + ww; xx += 16) x.drawImage(oldPat, 0, 0, 16, 16, xx * S, yy * S, 16 * S, 16 * S); } };
      fill(tileHD, 0, 0, 112, 48, GFX.floor.lino); fill(woodHD, 0, 56, 112, 64, GFX.floor.wood);
      x.fillStyle = '#d8d0c0'; x.fillRect(0, 48 * S, 112 * S, 8 * S); x.fillStyle = hd ? '#fff7e6' : '#fff7e6'; x.fillRect(0, 48 * S, 112 * S, 1.5 * S); x.fillStyle = '#08070c'; x.fillRect(0, 48 * S, 112 * S, (hd ? 0.5 : 1) * S); x.fillRect(0, 56 * S - (hd ? 0.5 : 1) * S, 112 * S, (hd ? 0.5 : 1) * S);
      x.fillStyle = '#1a1622'; x.fillRect(40 * S, 48 * S, 16 * S, 8 * S); x.fillStyle = '#8a5a3a'; x.fillRect(40 * S, 51.5 * S, 3 * S, 1 * S);
      const ch = (k, w, wx, wy, a) => { x.fillStyle = 'rgba(0,0,0,0.35)'; x.beginPath(); x.ellipse((wx + 2) * S, (wy + 2) * S, 5.5 * S, 5.5 * S, 0, 0, 6.29); x.fill(); x.save(); x.translate(wx * S, wy * S); x.rotate(a);
        if (hd) { const c = HD.charOf(k); x.drawImage(HD.hdLegs(c, 2), -18 * S, -18 * S, 36 * S, 36 * S); x.drawImage(HD.hdBody(c, w, 2), -18 * S, -18 * S, 36 * S, 36 * S); } else { x.drawImage(GFX.ch[k].legs[8], -12 * S, -12 * S, 24 * S, 24 * S); x.drawImage(bodyFrame(k, w, 'walk', 0), -12 * S, -12 * S, 24 * S, 24 * S); } x.restore(); };
      const wp = (k, wx, wy, a) => { x.save(); x.translate(wx * S, wy * S); x.rotate(a); if (hd) x.drawImage(HD.HDW[k], -8 * S, -3 * S, 16 * S, 6 * S); else x.drawImage(GFX.wpn[k], -8 * S, -8 * S, 16 * S, 16 * S); x.restore(); };
      x.fillStyle = '#6e0a10'; x.beginPath(); x.ellipse(82 * S, 92 * S, 9 * S, 6 * S, 0.3, 0, 6.29); x.fill();
      wp('knife', 20, 70, 0.6); wp('pistol', 34, 100, -0.4); wp('pump', 64, 76, 2.4); wp('katana', 92, 104, -1.9); wp('revolver', 86, 20, 0.9); wp('frag', 100, 64, 0);
      ch('player', 'katana', 48, 30, 0.4); ch('grd', 'pistol', 84, 30, Math.PI); ch('brc', 'pump', 22, 88, -0.3); ch('cln', 'smart', 58, 96, -2.2); ch('wkr', 'pipe', 102, 84, 3.6);
      x.restore(); };
    T('CURRENT', 320, 30, 22, '#ff6a8a'); T('NEW (MOCKUP)', 960, 30, 22, '#5dff9a');
    draw(false, 10, 45, 620, 665, 5.4); draw(true, 650, 45, 620, 665, 5.4);
  `));
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
