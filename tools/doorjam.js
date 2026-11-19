// door jam diagnosis: alert every enemy on each floor and measure time spent stuck near doors
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const res = await p.evaluate(() => {
    const G = NS.G, M = NS.M, IN = NS.IN, out = [];
    LEVELS.forEach((lv, li) => lv.floors.forEach((f, fi) => {
      showPanel(null); G.implant = 'none'; startLevel(li); if (fi) startFloor(fi, null); G.state = 'pause'; G.god = true; G.lore = null;
      const P = G.player; IN.mx = IN.my = 0; IN.fire = false; IN.fireEdge = false;
      makeNoise(P.x, P.y, 9999); for (const e of G.ents) { e.react = 0.3; }
      const T = new Map(); let jamT = 0; const dt = 1 / 30;
      for (let k = 0; k < 30 * 12; k++) {
        const prev = G.ents.map(e => [e.x, e.y]);
        IN.ax = P.x + 40; IN.ay = P.y; updateGame(dt);
        G.ents.forEach((e, i) => {
          if (!prev[i] || e.st !== 'alert' || e.hacked || e.hold > 0) return; const mv = Math.hypot(e.x - prev[i][0], e.y - prev[i][1]) / dt, dP = Math.hypot(e.x - P.x, e.y - P.y);
          let nearDoor = false; for (const d of M.doors) { const s = doorEnds(d); if (segDist(e.x, e.y, s[0], s[1], s[2], s[3])[0] < 12 || segDist(e.x, e.y, d.hx, d.hy, d.hx + (s[2] - d.hx), d.hy + (s[3] - d.hy))[0] < 12) nearDoor = true; }
          if (nearDoor && mv < 15 && dP > 40 && !e.sees) { T.set(e, (T.get(e) || 0) + dt); jamT += dt; }
        });
      }
      const jammed = [...T.values()].filter(t => t > 1).length, worst = Math.max(0, ...T.values());
      const reached = G.ents.filter(e => e.st === 'alert' && Math.hypot(e.x - P.x, e.y - P.y) < 60).length;
      out.push({ id: li + '.' + fi, floor: f.name, enemies: G.ents.filter(e => e.st !== 'dead').length, jamSecs: +jamT.toFixed(1), jammedOver1s: jammed, worstSecs: +worst.toFixed(1), reachedPlayer: reached });
    }));
    G.god = false; return out;
  });
  console.table(res); console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
