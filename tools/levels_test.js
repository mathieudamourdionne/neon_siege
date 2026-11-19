// scripted completion of every level + mechanic checks: node tools/levels_test.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const res = await p.evaluate(() => {
    const G = NS.G, M = NS.M, IN = NS.IN, out = [], run = (n, dt) => { for (let i = 0; i < n; i++) updateGame(dt || 1 / 30); };
    const killAll = () => { for (const e of G.ents) if (e.st !== 'dead' && e.st !== 'freed') { if (e.t === 'wkr') { e.st = 'freed'; } else { e.hp = 0; killE(e, 'hit', 0, true, 'test'); } } checkClear(); };
    // complete every level, floor by floor
    LEVELS.forEach((lv, li) => {
      if (lv.job || lv.hub) return;
      showPanel(null); G.implant = 'none'; startLevel(li); G.god = true; G.state = 'pause'; const log = [];
      for (let guard = 0; guard < 6 && G.state !== 'result'; guard++) {
        const fi = G.fi, def = floorDef(), P = G.player, f = { floor: def.name };
        for (const c of G.civs) if (c.wit) freeWitness(c);
        for (const s of M.b.sws) if (!s.done && s.kind !== 'console') useSwitch(s);
        for (const s of M.b.sws) if (s.kind === 'console' && G.hold && !G.hold.started) useSwitch(s);
        for (const c of M.b.cages) if (!c.open) openCage(c);
        for (const pr of G.props) damageProp(pr, 99, pr.x * 8, pr.y * 8);
        if (G.hold) { let t = 0; while (!G.hold.done && t < 3000) { run(1); killAll(); t++; } f.holdSecs = Math.round(G.hold.t); f.waves = G.hold.wave; }
        killAll(); run(70); killAll(); checkClear(); if (G.timer) f.timerLeft = Math.round(G.timer.t);
        f.cleared = G.cleared; f.objs = (G.obj || []).map(o => o.have + '/' + o.n).join(' ');
        const ex = M.b.exit; P.x = (ex.x + ex.w / 2) * 8; P.y = (ex.y + ex.h / 2) * 8; P.sx = P.x; P.sy = P.y; P.dead = false; run(3);
        f.next = G.state === 'result' ? 'LEVEL DONE' : G.fi !== fi ? 'NEXT FLOOR' : 'STUCK'; log.push(f);
        if (f.next === 'STUCK') break;
        G.state = G.state === 'result' ? 'result' : 'pause';
      }
      out.push({ level: lv.name, floors: log, finished: G.state === 'result' });
    });
    // mechanics
    const mech = {};
    { // live water blocks you until the breakers are cut, then hounds come
      showPanel(null); startLevel(2); G.state = 'pause'; G.god = true; const P = G.player; for (const e of G.ents) e.st = 'dead';
      const wc = M.waterCells.find(c => !cellBlocked(c - M.W) && !cellBlocked(c - 2 * M.W) && !M.water[c - M.W] && !M.water[c - 2 * M.W]), wx = (wc % M.W) * 8 + 4, wy = Math.floor(wc / M.W) * 8 + 4;
      P.x = wx; P.y = wy - 14; P.sx = P.x; P.sy = P.y; for (let i = 0; i < 40; i++) { IN.mx = 0; IN.my = 1; updatePlayerOnly(); } mech.waterCell = [wc % M.W, Math.floor(wc / M.W)]; mech.liveWaterBlocks = P.y < wy - 6 && !M.water[Math.floor(P.y / 8) * M.W + Math.floor(P.x / 8)];
      for (const s of M.b.sws) useSwitch(s); mech.powerOff = !M.live; mech.houndsAfter = G.ents.filter(e => e.t === 'hnd' && e.st !== 'dead').length;
      for (let i = 0; i < 40; i++) { IN.mx = 0; IN.my = 1; updatePlayerOnly(); } mech.walkIntoWaterAfter = !!M.water[Math.floor(P.y / 8) * M.W + Math.floor(P.x / 8)] || P.y > wy; IN.mx = IN.my = 0;
    }
    function updatePlayerOnly() { updPlayer(1 / 30); }
    { // flood timer kills you if you don't make it
      showPanel(null); startLevel(4); startFloor(1, null); G.state = 'pause'; G.god = false; const P = G.player; for (const e of G.ents) e.st = 'dead';
      for (const s of M.b.sws) useSwitch(s); mech.timerStarts = !!G.timer && G.timer.t > 25; mech.reinforcements = G.ents.filter(e => e.st === 'alert').length; for (const e of G.ents) e.st = 'dead';
      const r0 = G.flood.r; run(30 * 31); mech.floodGrew = G.flood.r > r0 + 10; mech.drownedAtZero = P.dead;
    }
    { // crane flattens the twins on the stripes
      showPanel(null); startLevel(7); startFloor(1, null); G.state = 'pause'; G.god = true; const z = M.b.zone, tw = G.ents.filter(e => ETYPE[e.t].boss);
      tw.forEach((e, i) => { e.x = (z.x + 3 + i * 5) * 8; e.y = (z.y + 4) * 8; e.st = 'idle'; e.vx = e.vy = 0; });
      useSwitch(M.b.sws[0]); run(30); mech.twinsCrushed = tw.every(e => e.st === 'dead'); mech.craneCooldownBlocks = (() => { useSwitch(M.b.sws[0]); return !G.crane.drop; })();
      // and bullets alone take 14 hits
      startFloor(1, null); G.state = 'pause'; const t = G.ents.find(e => e.t === 'twin'); let shots = 0; while (t.st !== 'dead' && shots < 40) { t.hp--; shots++; if (t.hp <= 0) killE(t, 'shot', 0, true, 'pistol'); } mech.twinBulletHits = shots;
    }
    { // watcher: laser for ~1s, then a shot
      showPanel(null); startLevel(5); startFloor(1, null); G.state = 'pause'; G.god = false; const P = G.player; const w = G.ents.find(e => e.t === 'snp'); for (const e of G.ents) if (e !== w) e.st = 'dead';
      P.x = w.x - 120; P.y = w.y; P.sx = P.x; P.sy = P.y; let t = 0, aimSeen = false; while (!P.dead && t < 120) { IN.mx = IN.my = 0; updateGame(1 / 30); if (w.aimT > 0) aimSeen = true; t++; } mech.watcherAimsFirst = aimSeen; mech.watcherKillSecs = P.dead ? +(t / 30).toFixed(2) : 'no shot';
    }
    { // racks break from bullets and melee
      showPanel(null); startLevel(5); G.state = 'pause'; G.god = true; const P = G.player, pr = G.props[0]; for (const e of G.ents) e.st = 'dead';
      P.x = (pr.x + 1.5) * 8; P.y = (pr.y + 3.2) * 8; P.sx = P.x; P.sy = P.y; P.a = -Math.PI / 2; P.wpn = 'pistol'; P.ammo = 9; for (let i = 0; i < 4; i++) { P.a = -Math.PI / 2; IN.ax = P.x; IN.ay = P.y - 50; attack(P, true); run(10); } mech.rackShotDown = pr.dead;
      const pr2 = G.props[1]; P.x = (pr2.x + 1.5) * 8; P.y = (pr2.y + 2.4) * 8; P.wpn = 'pipe'; for (let i = 0; i < 3; i++) { P.a = -Math.PI / 2; IN.ax = P.x; IN.ay = P.y - 50; P.cd = 0; attack(P, true); run(14); } mech.rackSmashed = pr2.dead; mech.rackGoneFromMap = !M.solid[pr.y * M.W + pr.x];
    }
    { // kids run out of opened cages
      showPanel(null); startLevel(6); G.state = 'pause'; G.god = true; const c = M.b.cages[0]; openCage(c); mech.kidsOut = G.civs.filter(v => v.st === 'run').length; run(90); mech.kidsGoneAfter3s = G.civs.filter(v => v.st === 'run' && !v.gone).length;
    }
    G.god = false; return { out: out, mech: mech };
  });
  for (const L of res.out) { console.log((L.finished ? 'OK   ' : 'FAIL ') + L.level); for (const f of L.floors) console.log('       ', JSON.stringify(f)); }
  console.log('mechanics', JSON.stringify(res.mech, null, 1));
  console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
