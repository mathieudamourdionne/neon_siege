// end of Act 2 mechanics: cameras, spreading fire, chandeliers, The Host: node tools/act2b_test.js
const { chromium, GAME } = require('./pw');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const G = NS.G, M = NS.M, out = {}, L = n => LEVELS.findIndex(l => l.name === n), run = n => { for (let i = 0; i < n; i++) updateGame(1 / 30); };
    // cameras: standing in a cone raises the alarm; a bullet kills the camera
    showPanel(null); startLevel(L('OBSERVATION')); G.state = 'pause'; const P = G.player, c = G.cams[0]; out.cams = G.cams.length;
    for (const e of G.ents) e.st = 'dead'; P.x = c.x + Math.cos(c.a) * 60; P.y = c.y + Math.sin(c.a) * 60; const n0 = G.ents.length; run(30); out.cameraAlarm = c.cd > 0; out.alarmReinforcements = G.ents.length - n0;
    const bx = c.x + Math.cos(c.a) * 40, by = c.y + Math.sin(c.a) * 40; G.bullets.push({ x: bx, y: by, px: bx, py: by, vx: -Math.cos(c.a) * 600, vy: -Math.sin(c.a) * 600, owner: 'p', k: 'pistol', t: 0 }); run(3); out.cameraShot = c.dead;
    // fire: spreads, kills enemies, hurts the player here
    startLevel(L('THE CLEAN ONES')); G.state = 'pause'; G.god = true; const sizes = []; for (let s = 0; s < 4; s++) { run(30 * 30); sizes.push(G.blaze.on.size); } G.god = false; out.burningCellsEvery30s = sizes.join(','); out.timer = G.timer && Math.round(G.timer.t);
    startLevel(L('THE CLEAN ONES')); G.state = 'pause'; const fc = [...G.blaze.on.keys()][0], P2 = G.player; P2.x = (fc % M.W + 0.5) * 8; P2.y = ((fc / M.W) | 0) * 8 + 4; run(15); out.fireKillsPlayer = P2.dead;
    startLevel(L('THE CLEAN ONES')); G.state = 'pause'; const fc2 = [...G.blaze.on.keys()][1], g = spawnEnemy('grd', (fc2 % M.W + 0.5) * 8, ((fc2 / M.W) | 0) * 8 + 4, 'pipe', 0); const cl = spawnEnemy('cln', g.x, g.y, 'smg', 0); run(5); out.fireKillsGuard = g.st === 'dead'; out.cleanerFireproof = cl.st !== 'dead';
    // chandelier: shoot it down on two guards
    startLevel(L('MANSION')); G.state = 'pause'; G.god = true; const ch = G.chands[0]; for (const e of G.ents) e.st = 'dead'; const v1 = spawnEnemy('grd', ch.x + 9, ch.y - 2, 'pistol', 0), v2 = spawnEnemy('grd', ch.x - 9, ch.y + 3, 'pistol', 0); v1.st = v2.st = 'idle'; v1.react = v2.react = 99;
    G.bullets.push({ x: ch.x, y: ch.y + 40, px: ch.x, py: ch.y + 40, vx: 0, vy: -600, owner: 'p', k: 'pistol', t: 0 }); run(20); out.chandelier = ch.st + ' ' + [v1.st, v2.st].join('/');
    // The Host: glass down after three breakers, cleaners at half health
    startLevel(L('THE HOST')); G.state = 'pause'; G.god = true; const h = G.ents.find(e => e.t === 'hst'); out.hostBehindGlass = cellBlocked(7 * M.W + 29);
    for (const s of M.b.sws) useSwitch(s); out.glassDown = !cellBlocked(7 * M.W + 29) && h.st === 'alert';
    const n1 = G.ents.length; h.hp = 9; run(2); out.hostPhase2 = h.phase2 && h.wpn === 'ar' && G.ents.length - n1 >= 3;
    h.hp = 1; killE(h, 'shot', 0, true, 'pistol'); for (const e of G.ents) if (e.st !== 'dead') { e.hp = 0; killE(e, 'hit', 0, true, 'test'); } run(5); out.clearedAfterHost = G.cleared;
    G.god = false; return out; });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
