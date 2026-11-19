// Act 3 mechanics: drones, turrets, blackouts, Director Hale: node tools/act3_test.js
const { chromium, GAME } = require('./pw');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const G = NS.G, M = NS.M, out = {}, L = n => LEVELS.findIndex(l => l.name === n), run = n => { for (let i = 0; i < n; i++) updateGame(1 / 30); };
    const shoot = (tx, ty, fx, fy) => { const a = Math.atan2(ty - fy, tx - fx); G.bullets.push({ x: fx, y: fy, px: fx, py: fy, vx: Math.cos(a) * 600, vy: Math.sin(a) * 600, owner: 'p', k: 'pistol', t: 0 }); run(3); };
    // drones: lock on when you're in the light, shoot, and go down in two hits
    showPanel(null); startLevel(L('LOCKDOWN')); G.state = 'pause'; out.drones = G.drones.length; for (const e of G.ents) e.st = 'dead';
    const d = G.drones[0], P = G.player; d.p = null; d.a = Math.PI / 2; d.x = 16 * 8; d.y = 17 * 8; P.x = d.x; P.y = d.y + 36; P.inv = 0; run(25); out.droneLocks = d.st === 'hunt'; let shotsAtPlayer = 0; for (let i = 0; i < 60 && !P.dead; i++) { const n = G.bullets.length; run(1); shotsAtPlayer += Math.max(0, G.bullets.length - n); } out.droneShoots = shotsAtPlayer > 0 || P.dead;
    P.dead = false; G.god = true; shoot(d.x, d.y, d.x - 40, d.y); out.droneHp1 = d.hp; shoot(d.x, d.y, d.x - 40, d.y); out.droneDown = d.dead;
    // turrets: fire bursts, die to bullets and explosions, all go dark at the breaker
    startLevel(L('THE LOBBY')); G.state = 'pause'; G.god = false; for (const e of G.ents) e.st = 'dead'; const t = G.turrets[2]; const P2 = G.player; P2.x = t.x + Math.cos(t.a) * 60; P2.y = t.y + Math.sin(t.a) * 60; let tb = 0; for (let i = 0; i < 45; i++) { const n = G.bullets.length; run(1); tb += Math.max(0, G.bullets.length - n); } out.turretFires = tb > 0 || P2.dead;
    P2.dead = false; G.god = true; const t2 = G.turrets[0]; shoot(t2.x, t2.y, t2.x + 40, t2.y + 40); shoot(t2.x, t2.y, t2.x + 40, t2.y + 40); shoot(t2.x, t2.y, t2.x + 40, t2.y + 40); out.turretShotDown = t2.dead;
    explode(G.turrets[1].x + 5, G.turrets[1].y, 26, true, 'frag'); out.turretBlownUp = G.turrets[1].dead;
    for (const s of M.b.sws) useSwitch(s); out.turretsOffline = G.turretsOff; const t3 = G.turrets[3]; P2.x = t3.x + 40; P2.y = t3.y; G.god = false; const n3 = G.bullets.length; run(40); out.offlineTurretQuiet = G.bullets.length === n3 && !P2.dead;
    // blackouts toggle night vision
    startLevel(L('THE STACK')); G.state = 'pause'; G.god = true; const seq = []; for (let s = 0; s < 6; s++) { run(30 * 6); seq.push(G.night ? 'dark' : 'lit'); } out.blackoutCycle = seq.join(',');
    // Hale: the lance kills you on the line, misses you off it; drones at half health; exit after
    startLevel(L('THE DIRECTOR')); G.state = 'pause'; G.god = false; const h = G.ents.find(e => e.t === 'dir'); for (const e of G.ents) if (e !== h) e.st = 'dead'; for (const dd of G.drones) dd.dead = true;
    const P3 = G.player; P3.x = h.x; P3.y = h.y + 60; h.st = 'alert'; h.lanceT = 0.5; h.lanceOn = true; h.lanceA = Math.PI / 2; run(1); P3.x = h.x; P3.y = h.y + 60; for (let i = 0; i < 20 && h.lanceOn; i++) { run(1); h.x = h.x; P3.x = h.x; P3.y = h.y + 60; } out.lanceKillsOnLine = P3.dead;
    startLevel(L('THE DIRECTOR')); G.state = 'pause'; const h2 = G.ents.find(e => e.t === 'dir'); for (const e of G.ents) if (e !== h2) e.st = 'dead'; for (const dd of G.drones) dd.dead = true; const P4 = G.player; h2.st = 'alert'; h2.lanceT = 0.2; h2.lanceOn = true; h2.lanceA = 0; P4.x = h2.x; P4.y = h2.y + 50; P4.inv = 0; h2.lanceA = 0; const fx = h2.x; run(1); out.lanceMissesOffLine = !P4.dead;
    G.god = true; const d0 = G.drones.filter(x => !x.dead).length; h2.hp = 10; run(2); out.halePhase2Drones = G.drones.filter(x => !x.dead).length - d0;
    h2.hp = 1; killE(h2, 'shot', 0, true, 'pistol'); for (const e of G.ents) if (e.st !== 'dead') { e.hp = 0; killE(e, 'hit', 0, true, 'test'); } run(5); out.clearedAfterHale = G.cleared;
    G.god = false; return out; });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
