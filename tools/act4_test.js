// Act 4 mechanics: laser grids, gas, The Chair, the ending: node tools/act4_test.js
const { chromium, GAME } = require('./pw');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const G = NS.G, M = NS.M, out = {}, L = n => LEVELS.findIndex(l => l.name === n), run = n => { for (let i = 0; i < n; i++) updateGame(1 / 30); };
    // lasers: deadly when lit, safe when dark, cut guards, panel turns them off
    showPanel(null); startLevel(L('THE CROWN')); G.state = 'pause'; for (const e of G.ents) e.st = 'dead'; const Lz = G.lasers[0], P = G.player; out.lasers = G.lasers.length;
    Lz.t = 0.5; P.x = Lz.ax; P.y = (Lz.ay + Lz.by) / 2; run(1); out.litLaserKills = P.dead;
    startLevel(L('THE CROWN')); G.state = 'pause'; for (const e of G.ents) e.st = 'dead'; const L2 = G.lasers[0], P2 = G.player; L2.t = L2.on + 0.1; P2.x = L2.ax; P2.y = (L2.ay + L2.by) / 2; run(1); out.darkLaserSafe = !P2.dead; P2.x -= 20;
    const g = spawnEnemy('grd', L2.ax, L2.ay + 20, 'pipe', 0); g.st = 'idle'; L2.t = 0; run(1); out.laserCutsGuard = g.st === 'dead';
    for (const s of M.b.sws) useSwitch(s); out.panelOff = G.lasersOff; L2.t = 0; P2.x = L2.ax; P2.y = (L2.ay + L2.by) / 2; run(2); out.offLaserSafe = !P2.dead;
    // gas: spreads, kills after about a second, stops once the valves are shut, then clears
    startLevel(L('PANIC PROTOCOL')); G.state = 'pause'; G.god = true; run(30 * 20); out.gasCellsAt20s = G.blaze.on.size; for (const e of G.ents) e.st = 'dead'; G.god = false;
    const gc = [...G.blaze.on.keys()][0], P3 = G.player; P3.x = (gc % M.W + 0.5) * 8; P3.y = ((gc / M.W) | 0) * 8 + 4; let survivedHalfSec; for (let i = 0; i < 15; i++) { P3.x = (gc % M.W + 0.5) * 8; P3.y = ((gc / M.W) | 0) * 8 + 4; if (!G.blaze.on.has(gc)) G.blaze.on.set(gc, 1); run(1); } survivedHalfSec = !P3.dead; for (let i = 0; i < 30 && !P3.dead; i++) { if (!G.blaze.on.has(gc)) G.blaze.on.set(gc, 1); run(1); } out.gas = { survivesHalfSecond: survivedHalfSec, killsAfterASecond: P3.dead };
    startLevel(L('PANIC PROTOCOL')); G.state = 'pause'; G.god = true; run(30 * 10); for (const s of M.b.sws) useSwitch(s); out.gasOff = G.gasOff; run(30 * 20); out.gasCellsAfterValves = G.blaze.on.size;
    // The Chair: rockets, the suit breaks at half, he's down for good after
    startLevel(L('THE BOARD')); G.state = 'pause'; G.god = true; const c = G.ents.find(e => e.t === 'chr'); for (const e of G.ents) if (e !== c) e.st = 'dead'; c.st = 'alert'; c.rockT = 0.05; run(2); out.rocketStrikes = G.strikes.length; run(45); out.strikesLanded = G.strikes.length === 0;
    c.hp = 15; run(2); out.suitBreaks = c.t === 'chr2' && c.hp === 8 && c.wpn === 'smart';
    c.hp = 1; killE(c, 'shot', 0, true, 'pistol'); run(5); out.boardCleared = G.cleared; out.isLastStory = L('THE BOARD') === STORY() - 1;
    UI.li = L('THE BOARD'); act('next'); out.ending = document.querySelector('#pEnd .big').textContent + ' / ' + $('endMsg').textContent.split('\n')[0];
    G.god = false; return out; });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
