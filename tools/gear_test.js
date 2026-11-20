// new gear: monowire, wrist rockets, thruster legs, backup heart, frost carbine, shock baton, grenade launcher,
// vending machines, shock boxes, job marks: node tools/gear_test.js
const { chromium, GAME } = require('./pw');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const G = NS.G, M = NS.M, out = {}, L = n => LEVELS.findIndex(l => l.name === n);
    const run = n => { for (let i = 0; i < n; i++) { G.hitStop = 0; updateGame(1 / 30); } };
    // a quiet test room: the first floor of the first story level, emptied out
    const fresh = (imp) => { showPanel(null); G.implant = imp || 'none'; startLevel(L('THE LANDING')); G.state = 'pause'; G.god = false; for (const e of G.ents) e.st = 'dead'; G.dest = []; const P = G.player; P.x = 31.5 * 8; P.y = 22.5 * 8; P.a = 0; P.wpn = null; P.ammo = 0; IN.ax = P.x + 100; IN.ay = P.y; IN.mx = 0; IN.my = 0; return P; };
    const guard = (x, y, w) => { const e = spawnEnemy('grd', x, y, w === undefined ? 'pipe' : w, Math.PI); e.st = 'idle'; e.react = 9; return e; };
    const open = (P, d) => { for (let i = 0; i < 12; i++) if (blockAt(P.x + i * 9, P.y)) return false; return true; };
    out.implants = ['wire', 'wrist', 'thrust', 'heart'].every(k => IMPLANTS.some(i => i.k === k));
    out.shop = ['baton', 'cryo', 'glaunch'].every(k => SHOP.weapons.some(w => w[0] === k));
    // monowire: three in a line, one lash
    let P = fresh('wire'); out.roomOpen = open(P); const line = [guard(P.x + 30, P.y), guard(P.x + 55, P.y + 2), guard(P.x + 80, P.y - 2)];
    ability(); out.wireKillsLine = line.every(e => e.st === 'dead'); const g4 = guard(P.x + 30, P.y); ability(); out.wireCooldown = g4.st !== 'dead'; G.god = true; run(80); G.god = false; g4.x = P.x + 30; g4.y = P.y; ability(); out.wireRecharged = g4.st === 'dead';
    // wrist rockets: two charges, they come back by themselves
    P = fresh('wrist'); const w1 = guard(P.x + 60, P.y); ability(); out.miniRocket = G.rockets.length === 1 && G.rockets[0].R === 24; G.god = true; run(20); out.miniRocketKills = w1.st === 'dead'; ability(); out.chargesLeft = P.wristN; ability(); out.emptyNoRocket = P.wristN === 0; run(30 * 8); out.reloadsItself = P.wristN >= 1; G.god = false;
    // thruster legs: flattens who it hits, then time slows
    P = fresh('thrust'); const t1 = guard(P.x + 40, P.y, 'pistol'); IN.mx = 1; ability(); IN.mx = 0; let downed = false; for (let i = 0; i < 12; i++) { run(1); if (t1.st === 'down') downed = true; } out.thrustKnocksDown = downed; out.thrustSlowsTime = G.slowT > 0;
    // backup heart: first death is a knockout, then a shockwave; the second death is real
    P = fresh('heart'); const h1 = guard(P.x + 30, P.y, 'pistol'); h1.st = 'alert'; hurtPlayer(h1, 0); out.heartSaves = !P.dead && P.reviveT > 0; run(50); out.heartShockwave = h1.st === 'down' || h1.dazeT > 0; out.heartUp = !(P.reviveT > 0); P.inv = 0; hurtPlayer(h1, 0); out.secondDeathReal = P.dead;
    // frost carbine: frozen solid, then shattered
    P = fresh(); P.wpn = 'cryo'; P.ammo = 12; const c1 = guard(P.x + 50, P.y); P.cd = 0; attack(P, true); for (let i = 0; i < 20 && !G.ice.length; i++) run(1); out.cryoFreezes = c1.st === 'dead' && G.ice.length === 1; G.parts = []; let shards = false; for (let i = 0; i < 40; i++) { run(1); if (G.parts.some(q => q.img === GFX.ice1 || q.img === GFX.ice2)) shards = true; } out.cryoShatters = G.ice.length === 0 && shards;
    // shock baton: kills the one it hits, the current knocks two more down
    P = fresh(); P.wpn = 'baton'; const s1 = guard(P.x + 14, P.y), s2 = guard(P.x + 50, P.y + 10), s3 = guard(P.x + 50, P.y - 25); G.swingId = (G.swingId || 0) + 1; meleeHits(P, WEAPONS.baton, true); out.batonKills = s1.st === 'dead'; out.batonChains = [s2, s3].filter(e => e.st === 'down' || e.dazeT > 0).length;
    // grenade launcher: goes off on contact
    P = fresh(); G.god = true; P.wpn = 'glaunch'; P.ammo = 6; const n1 = guard(P.x + 60, P.y); P.cd = 0; attack(P, true); out.launched = G.nades.length === 1 && G.nades[0].impact === 1 && P.ammo === 5; run(15); out.launcherKills = n1.st === 'dead'; G.god = false;
    // vending machines and shock boxes: find floors that got them
    let vendFloors = 0, shockFloors = 0, vendDone = false, shockDone = false;
    LEVELS.forEach((lv, li) => lv.floors.forEach((f, fi) => { if (lv.hub) return; showPanel(null); startLevel(li); if (fi) startFloor(fi); G.state = 'pause';
      const v = G.dest.find(d => d.k === 'vend'), s = G.dest.find(d => d.k === 'shock'); if (v) vendFloors++; if (s) shockFloors++;
      if (v && !vendDone) { vendDone = true; for (const e of G.ents) e.st = 'dead'; const fx = v.x, fy = v.y + v.dir * 10, e = guard(fx, fy); const PP = G.player; PP.x = v.x + 14; PP.y = v.y + v.dir * 6; const u = nearUsable(); out.vendUse = u && u.text;
        if (u) u.act(); out.vendCrushes = e.st === 'dead'; out.vendCellsFree = v.cells.every(c => !M.solid[c]); }
      if (s && !shockDone) { shockDone = true; for (const e of G.ents) e.st = 'dead'; G.god = true; let placed = null; for (const [dx, dy] of [[20, 0], [-20, 0], [0, 20], [0, -20], [14, 14], [-14, 14], [14, -14], [-14, -14]]) { if (!blockAt(s.x + dx, s.y + dy) && los(s.x, s.y, s.x + dx, s.y + dy)) { placed = guard(s.x + dx, s.y + dy); break; } }
        hitDest(s, true, 0); out.shockKills = !!placed && placed.st === 'dead'; G.god = false; } }));
    out.vendFloors = vendFloors; out.shockFloors = shockFloors;
    // a job's mark: knock them down, zip-tie them, get paid
    showPanel(null); G.implant = 'none'; startLevel(L('TIDEWATER VAULT')); G.state = 'pause'; out.markPicked = !!G.mark && G.mark.mark === 1; const m = G.mark;
    for (const e of G.ents) if (e !== m) e.st = 'dead'; knockdown(m, 0, 'punch'); const P2 = G.player; P2.x = m.x - 8; P2.y = m.y; const u2 = nearUsable(); out.markUse = u2 && u2.text; if (u2) u2.act(); out.markTaken = G.markTaken && m.st === 'freed';
    G.stats.loot = 1000; levelDone(); out.payRow = (UI.lastRows || []).length >= 0 && $('rTable') !== null; const rowsTxt = JSON.stringify(UI.lastRows); out.markPaid = /MARK TAKEN ALIVE/.test(rowsTxt) || !!G.markTaken;
    showPanel(null); startLevel(L('TIDEWATER VAULT')); G.state = 'pause'; const m2 = G.mark; killE(m2, 'cut', 0, true, 'machete'); run(2); out.markLostWhenKilled = G.markLost === true;
    return out; });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
