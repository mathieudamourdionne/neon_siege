// scripted completion of every heist job + heist mechanic checks: node tools/jobs_test.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const res = await p.evaluate(() => {
    const G = NS.G, M = NS.M, IN = NS.IN, out = [], run = (n) => { for (let i = 0; i < n; i++) { updateGame(1 / 30); if (G.state === 'result') return; } };
    const killAll = () => { for (const e of G.ents) if (e.st !== 'dead' && e.st !== 'freed') { e.hp = 0; killE(e, 'hit', 0, true, 'test'); } };
    const spot = (x, y) => { let best = null, bd = 1e9; for (let j = -4; j <= 4; j++) for (let i = -4; i <= 4; i++) { const cx = Math.floor(x / 8) + i, cy = Math.floor(y / 8) + j, c = cy * M.W + cx; if (cx < 0 || cy < 0 || cx >= M.W || cy >= M.H || !M.fl[c] || cellBlocked(c)) continue; const px = cx * 8 + 4, py = cy * 8 + 4, d = Math.hypot(px - x, py - y); if (d < bd) { bd = d; best = [px, py]; } } return best; };
    const tp = (x, y) => { const P = G.player, s = spot(x, y); P.x = s[0]; P.y = s[1]; P.vx = P.vy = 0; P.dead = false; G.hitStop = 0; };
    const use = () => { IN.exec = true; updPlayer(1 / 30); };
    LEVELS.forEach((lv, li) => {
      if (!lv.job) return;
      showPanel(null); G.implant = 'none'; startLevel(li); G.god = true; G.state = 'pause'; const P = G.player, f = { job: lv.name, steps: [] }, step = s => f.steps.push(s);
      for (let guard = 0; guard < 60 && G.state !== 'result'; guard++) {
        killAll();
        const kg = G.ents.find(e => e.key && e.st !== 'dead'); if (kg) { kg.hp = 0; killE(kg, 'hit', 0, true, 'test'); run(2); }
        const k = G.keys.find(k => !k.got); if (k) { tp(k.x, k.y); run(2); step('key:' + G.hasKey); continue; }
        const g = G.gates.find(g => !g.open && g.kind === 'key'); if (g && G.hasKey) { tp((g.x + g.w / 2) * 8, (g.y + g.h / 2) * 8 + 10); use(); step('gate:' + g.open); continue; }
        const d = G.drills.find(d => d.st === 'idle' || d.st === 'jam'); if (d) { tp(d.x, d.y); const was = d.st; use(); step('drill ' + was + '->' + d.st); for (let t = 0; t < 30 * 80 && d.st === 'run'; t++) { run(1); if (t % 30 === 0) killAll(); } continue; }
        const c = G.c4.find(c => c.st === 'idle'); if (c) { tp(c.x, c.y); use(); tp(c.x - 60, c.y); run(30 * 4); step('c4:' + c.st); continue; }
        const live = G.props.filter(q => !q.dead); if (live.length) { for (const q of live) damageProp(q, 99, (q.x + 1) * 8, (q.y + 0.5) * 8); run(20); step('smashed ' + live.length); }
        if (G.gems.length) { const n = G.gems.length; for (const m of G.gems.slice()) { tp(m.x, m.y); run(1); } step('gems ' + n + ' left ' + G.gems.length); continue; }
        const pile = G.piles.find(q => q.n > 0 && gateOpen(q.gate)); const z = G.secureZ;
        if (pile && z && (!G.obj.every(o => o.have >= o.n) || pile.k !== 'safe')) { tp(pile.x, pile.y); use(); const got = !!P.bag, heavy = got && P.bag.heavy; tp((z.x + z.w / 2) * 8, (z.y + z.h / 2) * 8); run(4); step('bag ' + pile.k + (got ? '' : ' NOT LIFTED') + (heavy ? ' heavy' : '') + ' loot=' + G.stats.loot); continue; }
        if (G.hcount && !G.hcount.done) { let t = 0; while (!G.hcount.done && t < 30 * 120) { run(1); if (t % 15 === 0) killAll(); t++; } step('count ' + G.hcount.k + ' ' + Math.round(t / 30) + 's'); continue; }
        if (G.cleared) { const ex = M.b.exit; tp((ex.x + ex.w / 2) * 8, (ex.y + ex.h / 2) * 8); run(3); step('exit ' + G.state); continue; }
        run(30); step('wait objs ' + G.obj.map(o => o.have + '/' + o.n).join(' '));
      }
      f.finished = G.state === 'result'; f.loot = G.stats.loot; f.table = (UI.lastRows || []).map(r => r.join(' '));
      clearInterval(UI.tallyT); out.push(f);
    });
    // mechanics
    const mech = {}, J = n => LEVELS.findIndex(l => l.name === n);
    { // bags slow you; the safe slows you more and stops you attacking; throwing a bag sends it flying
      showPanel(null); startLevel(J('SKYLINE SAFE')); G.state = 'pause'; G.god = true; const P = G.player; for (const e of G.ents) e.st = 'dead';
      const sp = () => { P.vx = P.vy = 0; const x0 = P.x; IN.mx = 1; IN.my = 0; for (let i = 0; i < 20; i++) updPlayer(1 / 30); IN.mx = 0; return (P.x - x0) / (20 / 30); };
      const tpS = (x, y) => { const s = (() => { for (let r = 0; r < 4; r++) for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const c = (Math.floor(y / 8) + j) * M.W + Math.floor(x / 8) + i; if (M.fl[c] && !cellBlocked(c)) return [(c % M.W) * 8 + 4, Math.floor(c / M.W) * 8 + 4]; } })(); P.x = s[0]; P.y = s[1]; };
      tpS(30 * 8, 31 * 8); mech.speedFree = Math.round(sp());
      P.bag = { k: 'cash', v: 6000 }; tpS(30 * 8, 31 * 8); mech.speedBag = Math.round(sp());
      P.bag = { k: 'safe', v: 60000, heavy: 1 }; tpS(30 * 8, 31 * 8); mech.speedSafe = Math.round(sp());
      P.wpn = 'pistol'; P.ammo = 9; const b0 = G.bullets.length; IN.fireEdge = true; P.cd = 0; updPlayer(1 / 30); mech.safeBlocksShooting = G.bullets.length === b0;
      P.bag = { k: 'cash', v: 6000 }; tpS(30 * 8, 31 * 8); P.a = Math.PI; const tx = P.x; throwBag(); run(20); const g = G.bags[0]; mech.thrownBagFlew = g ? Math.round(tx - g.x) : -1;
    }
    { // drill jams twice and needs a kick each time; assault starts with the drill
      showPanel(null); startLevel(J('TIDEWATER VAULT')); G.state = 'pause'; G.god = true; for (const e of G.ents) e.st = 'dead'; const d = G.drills[0]; let jams = 0;
      d.st = 'run'; floorDef().on('drillStart'); mech.assaultOnDrill = !!G.asl;
      for (let t = 0; t < 30 * 70 && d.st !== 'done'; t++) { updateGame(1 / 30); if (d.st === 'jam') { jams++; if (jams < 9) d.st = 'run'; } if (t % 30 === 0) killAll(); }
      mech.drillJams = jams; mech.vaultOpen = G.gates.find(q => q.id === 'vault').open; mech.vaultPassable = !cellBlocked(5 * M.W + 28);
    }
    { // assault waves arrive and take breaks
      showPanel(null); startLevel(J('TIDEWATER VAULT')); G.state = 'pause'; G.god = true; for (const e of G.ents) e.st = 'dead'; startAssault(); let spawned = 0, sawBreak = false, n0 = G.ents.length;
      for (let t = 0; t < 30 * 80; t++) { updateGame(1 / 30); if (G.asl.phase === 'break') sawBreak = true; if (t % 60 === 0) { spawned += G.ents.length - n0; killAll(); n0 = G.ents.length; } }
      mech.assaultSpawned = spawned; mech.assaultBreak = sawBreak; mech.assaultWaveNo = G.asl.n;
    }
    { // the tactical team countdown in the jewelry store turns into an assault
      showPanel(null); startLevel(J('GLASS HOUSE')); G.state = 'pause'; G.god = true; for (const e of G.ents) e.st = 'dead';
      for (let t = 0; t < 30 * 62; t++) updateGame(1 / 30); mech.policeArrived = !!G.asl;
      const c = G.props[0]; damageProp(c, 1, c.x * 8, c.y * 8); mech.caseOneHit = c.dead; mech.gemsFromCase = G.gems.length;
    }
    { // the rig stalls while an enemy stands on the roof next to it
      showPanel(null); startLevel(J('SKYLINE SAFE')); G.state = 'pause'; G.god = true; for (const e of G.ents) e.st = 'dead';
      heistCount({ t: 10, label: 'RIG', k: 'rig', stall: { x: 29 * 8, y: 28, r: 60 } }); const e = spawnEnemy('grd', 29 * 8, 6 * 8, 'pipe', 0); e.st = 'idle'; e.react = 99;
      for (let t = 0; t < 30; t++) { updateGame(1 / 30); e.x = 29 * 8; e.y = 6 * 8; } mech.rigStalled = G.hcount.stalled && G.hcount.t > 9.9;
      e.st = 'dead'; for (let t = 0; t < 30; t++) updateGame(1 / 30); mech.rigResumes = G.hcount.t < 9.1;
    }
    { // keycard drops when its carrier dies; the gate refuses you without it
      showPanel(null); startLevel(J('TIDEWATER VAULT')); G.state = 'pause'; G.god = true; const kg = G.ents.find(e => e.key); mech.keyCarrier = !!kg; const P = G.player, g = G.gates.find(q => q.kind === 'key');
      for (const e of G.ents) if (e !== kg) e.st = 'dead'; P.x = (g.x + 1) * 8; P.y = (g.y + 2) * 8; IN.exec = true; updPlayer(1 / 30); mech.gateLockedWithoutKey = !g.open;
      kg.hp = 0; killE(kg, 'hit', 0, true, 'test'); G.hitStop = 0; updateGame(1 / 30); mech.keyDropped = G.keys.length === 1;
    }
    G.god = false; return { out: out, mech: mech };
  });
  for (const f of res.out) { console.log((f.finished ? 'OK   ' : 'FAIL ') + f.job + '  loot $' + f.loot); console.log('       ' + f.steps.join(' | ')); console.log('       ' + f.table.slice(-4).join(' / ')); }
  console.log('mechanics', JSON.stringify(res.mech, null, 1));
  console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
