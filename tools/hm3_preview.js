// art round 3: full-frame mockup with stylized environment, gore, destruction, points: node tools/hm3_preview.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + e.stack));
  await p.goto(GAME); await p.waitForTimeout(500);
  for (const f of ['hmart.js', 'hmenv.js']) await p.addScriptTag({ path: ROOT + '/tools/' + f });
  await p.evaluate(() => {
    const cv = document.createElement('canvas'); cv.id = 'pv'; cv.width = 1280; cv.height = 720; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:999'; document.body.appendChild(cv);
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    const W = 534, H = 300, [o, X] = mkCanvas(W, H); X.imageSmoothingEnabled = false; HME.reseed(21);
    const E = HME, PR = E.PROP, rnd = E.rnd, fillPat = (img, x0, y0, w, h) => { X.save(); X.fillStyle = X.createPattern(img, 'repeat'); X.fillRect(x0, y0, w, h); X.restore(); };
    const put = (img, px, py, a, sc) => { X.save(); X.translate(Math.round(px), Math.round(py)); X.rotate(a || 0); X.drawImage(img, -img.width / 2, -img.height / 2); X.restore(); };
    // ---- floors
    fillPat(E.FLOOR.redBrick, 0, 0, 236, 300); fillPat(E.FLOOR.blueStripe, 252, 0, 282, 168); fillPat(E.FLOOR.darkTile, 252, 184, 282, 116);
    fillPat(E.FLOOR.purpleBrick, 236, 206, 16, 32); fillPat(E.FLOOR.blueStripe, 392, 168, 32, 16);
    // ---- decals: scorch, blood pools/sprays, glass, casings
    E.scorch(X, 362, 248, 46);
    E.pool(X, 96, 116, 140, 104, 11); E.splat(X, 150, 104, 16, -0.3, 1.2);                 // decapitated (left room)
    E.pool(X, 262, 132, 300, 128, 10); E.splat(X, 262, 128, 18, Math.PI, 1.6);            // headshot by the window: spray toward it
    E.splat(X, 218, 120, 6, Math.PI, 0.8);                                                // spray through the broken window
    E.pool(X, 420, 132, 462, 138, 12); E.splat(X, 448, 136, 22, 0.25, 1.8);              // shotgunned worker
    E.splat(X, 130, 200, 7, 2, 0.6);
    E.shards(X, 244, 125, 26, 60, Math.PI); E.shards(X, 256, 122, 16, 30, 0); E.shards(X, 432, 64, 30, 70, 1.2); E.shards(X, 432, 64, 14, 40, -1.6);
    for (let i = 0; i < 6; i++) { X.fillStyle = '#ffd040'; X.fillRect(368 + rnd() * 20 | 0, 118 + rnd() * 16 | 0, 2, 1); }
    // ---- props
    put(PR.table, 52, 52); put(PR.table, 132, 34); put(PR.table, 60, 150); put(PR.bar, 14, 190, Math.PI / 2); put(PR.plant, 206, 22); put(PR.pot, 206, 22); X.drawImage(PR.plant, 187, 3);
    put(PR.couch, 420, 14); put(PR.glassBroken, 432, 64); put(PR.arcade, 514, 82, -Math.PI / 2); put(PR.arcade, 514, 120, -Math.PI / 2); put(PR.tv, 300, 12);
    put(PR.crate, 272, 196); put(PR.crate, 290, 196); put(PR.crate, 272, 214); put(PR.barrel, 504, 200); put(PR.barrel, 519, 216); put(PR.barrel, 498, 230);
    put(PR.barrelBlown, 364, 250);
    // ---- walls, posts, windows, door
    E.wallV(X, 236, 0, 30); E.windowV(X, 236, 30, 50, 0); E.wallV(X, 236, 80, 16); E.windowV(X, 236, 96, 54, 1); E.wallV(X, 236, 150, 56); E.wallV(X, 236, 238, 62);
    E.wallH(X, 252, 168, 140); E.wallH(X, 424, 168, 110);
    for (const [px, py] of [[236, 30], [236, 80], [236, 96], [236, 150], [236, 206], [236, 238], [236, 168], [392, 168], [424, 168]]) E.post(X, px, py - (py === 168 ? 0 : 8));
    X.save(); X.translate(244, 238); X.rotate(-2.2); X.fillStyle = '#140c10'; X.fillRect(0, -3, 30, 6); X.fillStyle = '#8a4a22'; X.fillRect(1, -2, 28, 4); X.fillStyle = '#b06a32'; X.fillRect(1, -2, 28, 1); X.restore();
    E.neonDots(X, 229, 4, 290, 1, '#2fff8a'); E.neonDots(X, 6, 4, 220, 0, '#ff3bd8');
    // ---- bodies + gibs + dropped weapons
    const L = HM.look;
    put(E.corpse(L('cln'), { head: 'off' }), 120, 110, -0.25); put(E.head(L('cln')), 168, 96, 1.2);
    put(E.corpse(L('grd'), { head: 'burst', v: 1 }), 300, 130, Math.PI + 0.1); put(E.GIB.brain, 258, 118, 0.5); put(E.GIB.brain2, 266, 140, 2); put(E.GIB.skull, 252, 132, 1); put(E.GIB.brain2, 226, 116, 1);
    put(E.corpse(L('wkr'), { torso: 'shot' }), 444, 136, 0.15); put(E.GIB.meat, 486, 150, 0); put(E.GIB.meat, 470, 118, 1); put(E.GIB.bone, 492, 132, 0.4); put(E.GIB.meat, 500, 142, 2);
    put(E.corpse(L('fat'), { burnt: 1 }), 330, 238, -0.6); put(E.GIB.bone, 400, 270, 0.7); put(E.GIB.meat, 392, 222, 0);
    put(HM.HMW.machete, 176, 128, 0.9); put(HM.HMW.pistol, 318, 150, 2.4); put(HM.HMW.pipe, 470, 104, -0.3); put(HM.HMW.knife, 40, 220, 0.5);
    // ---- living
    const guy = (k, w, px, py, a, f) => { const c = L(k); X.save(); X.translate(px, py); X.rotate(a); X.drawImage(HM.legs(c, f), -40, -40); X.drawImage(HM.body(c, w, f), -40, -40); X.restore(); };
    guy('player', 'pump', 372, 112, 0.2, 2); guy('cln', 'smart', 96, 214, -0.25, 5); guy('brc', 'pump', 470, 262, -2.3, 8); guy('grd', 'pistol', 140, 64, 0.35, 3);
    // fire last so it glows over the floor
    E.fire(X, 364, 250, 12); E.fire(X, 340, 232, 7); E.fire(X, 390, 262, 5);
    // tracer + muzzle flash
    X.fillStyle = '#fff6c8'; X.save(); X.translate(96, 214); X.rotate(-0.25); X.fillRect(34, -1, 92, 2); X.restore(); for (let i = 0; i < 7; i++) { X.fillStyle = i % 2 ? '#ffe14d' : '#fff'; X.fillRect(226 - rnd() * 8 | 0, 178 + (rnd() - 0.5) * 10 | 0, 2, 1); }
    X.save(); X.translate(372, 112); X.rotate(0.2); X.fillStyle = '#ffe14d'; X.beginPath(); X.moveTo(44, -1); X.lineTo(60, -6); X.lineTo(54, 0); X.lineTo(62, 5); X.lineTo(44, 2); X.fill(); X.fillStyle = '#fff'; X.fillRect(44, -1, 8, 2); X.restore();
    // lighting: warm pool around the player, darker edges
    const lg = X.createRadialGradient(372, 112, 10, 372, 112, 170); lg.addColorStop(0, 'rgba(255,220,180,0.28)'); lg.addColorStop(1, 'rgba(255,220,180,0)'); X.globalCompositeOperation = 'lighter'; X.fillStyle = lg; X.fillRect(0, 0, W, H);
    const fl = X.createRadialGradient(364, 250, 4, 364, 250, 70); fl.addColorStop(0, 'rgba(255,140,40,0.45)'); fl.addColorStop(1, 'rgba(255,140,40,0)'); X.fillStyle = fl; X.fillRect(0, 0, W, H); X.globalCompositeOperation = 'source-over';
    // ---- to screen
    x.drawImage(o, 0, 0, 1280, 720);
    const vg = x.createRadialGradient(640, 360, 280, 640, 360, 780); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,0,30,0.6)'); x.fillStyle = vg; x.fillRect(0, 0, 1280, 720);
    // ---- points popups (world-anchored) + HUD
    const u = 4.8, t = 0.3;
    E.bigText(x, 'BRUTAL!', 1070, 214, 2.4, { top: '#fff6a0', bot: '#ffb020', ext: '#c81e28', depth: 2, t, wob: 1, align: 'center' });
    E.bigText(x, '600', 1070, 240, u, { t, wob: 1, align: 'center' });
    E.bigText(x, 'HEADSHOT', 660, 214, 2.4, { top: '#fff6a0', bot: '#ffb020', ext: '#c81e28', depth: 2, t: t + 1, wob: 1, align: 'center' });
    E.bigText(x, '400', 660, 240, u, { t: t + 1, wob: 1, align: 'center' });
    E.bigText(x, '12,850', 1250, 22, u, { align: 'right', depth: 3 });
    E.bigText(x, 'X4 COMBO', 1250, 70, 3.6, { top: '#ffffff', bot: '#ff8ad8', ext: '#6a1ab8', depth: 2, t: 2, wob: 1, align: 'right' });
    E.bigText(x, 'PUMP SHOTGUN', 24, 650, 3.6, { top: '#ffffff', bot: '#c8c8d8', ext: '#3a3a8a', depth: 2 });
    E.bigText(x, '4/6', 24, 684, 3.6, { top: '#fff6a0', bot: '#ffb020', ext: '#8a3a14', depth: 2 });
    // scanlines
    x.fillStyle = 'rgba(0,0,0,0.10)'; for (let y = 0; y < 720; y += 3) x.fillRect(0, y, 1280, 1);
  });
  await p.waitForTimeout(80); await p.screenshot({ path: ROOT + '/shots/hm3_scene.png' });
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
