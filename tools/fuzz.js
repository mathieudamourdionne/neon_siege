// crash hunter: a random bot plays every floor through the real game loop and reports any error with its stack
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const secs = +(process.argv[2] || 6);
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = new Map(); p.on('pageerror', e => { const k = e.message; if (!errs.has(k)) errs.set(k, { n: 0, stack: (e.stack || '').split('\n').slice(0, 6).join('\n'), ctx: null }); errs.get(k).n++; });
  p.on('console', m => { if (m.type() !== 'error') return; const k = m.text().split('\n')[0]; if (!errs.has(k)) errs.set(k, { n: 0, stack: m.text().split('\n').slice(0, 6).join('\n'), ctx: null }); errs.get(k).n++; });
  await p.goto(GAME); await p.waitForTimeout(500);
  const floors = await p.evaluate(() => { const L = []; LEVELS.forEach((lv, li) => lv.floors.forEach((f, fi) => L.push([li, fi]))); return L; });
  const imps = ['none', 'od', 'dash', 'plating', 'spike', 'reflex', 'ghost', 'blades'];
  let n = 0;
  for (const [li, fi] of floors) for (const god of [true, false]) {
    const imp = imps[n++ % imps.length];
    await p.evaluate(([li, fi, imp, god]) => {
      const G = NS.G; UI.sel = imp; showPanel(null); G.implant = imp; startLevel(li); if (fi) startFloor(fi, null); G.state = 'play'; G.god = god; window.__ctx = [li, fi, imp, god];
      const W = Object.keys(WEAPONS);
      clearInterval(window.__bot); window.__bot = setInterval(() => {
        const P = G.player, IN = NS.IN; if (G.state !== 'play') { if (G.state === 'result' || G.state === 'menu') { startLevel(li); if (fi) startFloor(fi, null); G.state = 'play'; } return; }
        for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft']) K[k] = Math.random() < (k === 'ShiftLeft' ? 0.1 : 0.3);
        const tg = G.ents.filter(e => e.st !== 'dead').sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y))[0];
        if (tg && R.xf) { const [sx, sy] = worldToScreen(tg.x + (Math.random() - 0.5) * 30, tg.y + (Math.random() - 0.5) * 30); UI.msx = sx; UI.msy = sy; } else { UI.msx = Math.random() * innerWidth; UI.msy = Math.random() * innerHeight; }
        IN.fire = Math.random() < 0.5; if (Math.random() < 0.3) IN.fireEdge = true;
        if (Math.random() < 0.05) IN.pick = true; if (Math.random() < 0.08) IN.exec = true; if (Math.random() < 0.05) IN.abil = true; if (Math.random() < 0.04) IN.nade = true;
        if (Math.random() < 0.04) { P.wpn = W[Math.floor(Math.random() * W.length)]; P.ammo = WEAPONS[P.wpn].ammo || 0; }
        if (Math.random() < 0.02) P.gren = { k: Math.random() < 0.5 ? 'frag' : 'emp', n: 2 };
        if (Math.random() < 0.01) toggleLock();
        if (P.dead && Math.random() < 0.2) restartFloor();
        if (Math.random() < 0.004) { for (const e of G.ents) if (e.st !== 'dead') killE(e, 'hit', 0, true, 'x'); for (const s of M.b.sws) if (!s.done) useSwitch(s); for (const c of M.b.cages) if (!c.open) openCage(c); }
        if (G.cleared && Math.random() < 0.05) { const ex = M.b.exit; P.x = (ex.x + ex.w / 2) * 8; P.y = (ex.y + ex.h / 2) * 8; }
        if (Math.random() < 0.003) pauseGame(); if (G.state === 'pause') resumeGame();
      }, 50);
    }, [li, fi, imp, god]);
    await p.waitForTimeout(secs * 1000);
    const alive = await p.evaluate(() => { const t0 = NS.G.time; return new Promise(r => setTimeout(() => r(NS.G.time !== t0 || NS.G.state !== 'play'), 400)); });
    for (const v of errs.values()) if (!v.ctx) v.ctx = await p.evaluate(() => window.__ctx);
    if (!alive) console.log('FROZE on', li, fi);
  }
  await p.evaluate(() => clearInterval(window.__bot));
  if (!errs.size) console.log('no errors in ' + floors.length * 2 + ' runs');
  for (const [m, v] of errs) console.log('ERROR x' + v.n + ' [level,floor,implant,god]=' + JSON.stringify(v.ctx) + '\n  ' + m + '\n' + v.stack + '\n');
  await b.close();
})();
