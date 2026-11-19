// checks for neural spike, reflex boost, smart pistol: node tools/feat_test.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const G = NS.G, M = NS.M, IN = NS.IN, R2 = {}, run = (n, dt) => { for (let i = 0; i < n; i++) { IN.fireEdge = false; updateGame(dt || 1 / 30); } };
    const open = n => { for (let y = 1; y < M.H - n; y++) for (let x = 1; x < M.W - n; x++) { let ok = true; for (let j = 0; j < n && ok; j++) for (let i = 0; i < n; i++) { const c = (y + j) * M.W + x + i; if (!M.fl[c] || M.solid[c]) { ok = false; break; } } if (ok) return [(x + n / 2) * 8, (y + n / 2) * 8]; } };
    const arena = imp => { showPanel(null); G.implant = imp; startLevel(7); startFloor(1, null); G.state = 'pause'; G.lore = null; for (const e of G.ents) e.st = 'dead'; G.ents = []; const [cx, cy] = open(10); const P = G.player; P.x = cx - 30; P.y = cy; P.sx = P.x; P.sy = P.y; return [P, cx, cy]; };
    { // neural spike: hacked shotgunner wrecks his friends, then burns out
      let puppet = 0, burn = 0, trials = 8; for (let k = 0; k < trials; k++) {
        const [P, cx, cy] = arena('spike'); G.god = true; const t = spawnEnemy('grd', cx + 10, cy, 'pump', Math.PI); const f1 = spawnEnemy('grd', cx + 30, cy - 12, 'pipe', Math.PI), f2 = spawnEnemy('grd', cx + 34, cy + 14, 'pistol', Math.PI);
        for (const e of [t, f1, f2]) { e.st = 'idle'; } IN.ax = t.x; IN.ay = t.y; P.a = Math.atan2(t.y - P.y, t.x - P.x); const k0 = G.stats.kills; ability();
        if (k === 0) { R2.hackedOk = t.hacked === 6; R2.spikeSpent = G.player.spikeUsed; }
        run(30 * 7); puppet += (f1.st === 'dead' ? 1 : 0) + (f2.st === 'dead' ? 1 : 0); if (t.st === 'dead') burn++;
        if (k === 0) { R2.secondUseBlocked = (() => { const e3 = spawnEnemy('grd', cx + 20, cy, null, 0); IN.ax = e3.x; IN.ay = e3.y; ability(); return !(e3.hacked > 0); })(); }
      }
      R2.puppetKillsOf16 = puppet; R2.burnedOutOf8 = burn;
      const [P, cx, cy] = arena('spike'); const tw = spawnEnemy('twin', cx + 20, cy, 'saw', Math.PI); IN.ax = tw.x; IN.ay = tw.y; P.a = 0; ability(); R2.bossImmune = !(tw.hacked > 0) && !G.player.spikeUsed;
      const w = spawnEnemy('wkr', cx + 15, cy + 5, null, Math.PI); w.st = 'alert'; IN.ax = w.x; IN.ay = w.y; ability(); R2.workerFreed = w.st === 'freed';
    }
    { // reflex boost: world at 20% while you run at full speed; once per floor
      const [P, cx, cy] = arena('reflex'); G.god = true; const e = spawnEnemy('grd', cx, cy + 30, null, 0); e.st = 'patrol'; e.p = [[cx + 400, cy + 30]];
      run(15); let x0 = e.x; run(30); const normal = e.x - x0; ability(); R2.slowOn = G.slowT > 0; x0 = e.x; const px0 = P.x; IN.mx = 1; IN.my = 0; run(30); IN.mx = 0; const slowed = e.x - x0, pmove = P.x - px0;
      R2.enemySpeedDuringSlow = Math.round(slowed / Math.max(1, normal) * 100) + '%'; R2.playerMovedPx = Math.round(pmove);
      run(30 * 5); R2.slowEndsAfter5s = !(G.slowT > 0); ability(); R2.reflexOncePerFloor = !(G.slowT > 0);
      startFloor(G.fi, null); G.state = 'pause'; ability(); R2.reflexResetsNextFloor = G.slowT > 0; G.slowT = 0;
    }
    { // smart pistol: aim 25 degrees off, bullets curve in (aim assist off)
      UI.assist = false; let hits = 0, plain = 0;
      for (let k = 0; k < 10; k++) for (const wpn of ['smart', 'pistol']) { const [P, cx, cy] = arena('none'); G.god = true; const e = spawnEnemy('grd', cx + 60, cy + rr(-10, 10), null, Math.PI); e.st = 'idle'; P.wpn = wpn; P.ammo = 9; P.a = Math.atan2(e.y - P.y, e.x - P.x) + (k % 2 ? 0.44 : -0.44); attack(P, true); run(30); if (e.st === 'dead') { if (wpn === 'smart') hits++; else plain++; } }
      R2.smart25degOff = hits + '/10'; R2.normalPistol25degOff = plain + '/10'; UI.assist = true;
      // enemy smart rounds: you can still dodge by running sideways
      let dodged = 0; for (let k = 0; k < 10; k++) { const [P, cx, cy] = arena('none'); G.god = false; const e = spawnEnemy('cln', cx + 120, cy, 'smart', Math.PI); e.st = 'alert'; P.x = cx - 40; P.y = cy; e.a = Math.atan2(P.y - e.y, P.x - e.x); attack(e, false); e.cd = 99; for (let i = 0; i < 40; i++) { IN.mx = 0; IN.my = k % 2 ? 1 : -1; IN.ax = P.x + 50; IN.ay = P.y; updateGame(1 / 30); } IN.my = 0; if (!P.dead) dodged++; }
      R2.enemySmartShotDodgedRunning = dodged + '/10';
    }
    G.god = false; return R2;
  });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
