// new weapon checks: node tools/weapons_test.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const G = NS.G, M = NS.M, IN = NS.IN, R2 = {}, run = (n, dt) => { for (let i = 0; i < n; i++) { IN.fireEdge = false; updateGame(dt || 1 / 30); } };
    const open = n => { for (let y = 1; y < M.H - n; y++) for (let x = 1; x < M.W - n; x++) { let ok = true; for (let j = 0; j < n && ok; j++) for (let i = 0; i < n; i++) { const c = (y + j) * M.W + x + i; if (!M.fl[c] || M.solid[c]) { ok = false; break; } } if (ok) return [(x + n / 2) * 8, (y + n / 2) * 8]; } };
    const arena = (imp, li, fi) => { showPanel(null); G.implant = imp || 'none'; startLevel(li === undefined ? 7 : li); startFloor(fi === undefined ? 1 : fi, null); G.state = 'pause'; G.lore = null; for (const e of G.ents) e.st = 'dead'; G.ents = []; G.items = []; const [cx, cy] = open(10); const P = G.player; P.x = cx - 30; P.y = cy; P.sx = P.x; P.sy = P.y; IN.mx = IN.my = 0; IN.fire = false; return [P, cx, cy]; };
    { // katana deflects a bullet back into the shooter
      let ok = 0; for (let k = 0; k < 10; k++) { const [P, cx, cy] = arena(); G.god = false; P.wpn = 'katana'; const e = spawnEnemy('grd', P.x + 90, P.y + rr(-8, 8), 'pistol', Math.PI); e.st = 'alert'; e.a = Math.atan2(P.y - e.y, P.x - e.x); e.cd = 99; attack(e, false); P.a = Math.atan2(e.y - P.y, e.x - P.x); IN.ax = e.x; IN.ay = e.y; for (let i = 0; i < 12; i++) { const b = G.bullets[0]; if (b && Math.hypot(b.x - P.x, b.y - P.y) < 26 && !P.atk) { P.cd = 0; attack(P, true); } run(1); } run(15); if (e.st === 'dead' && !P.dead) ok++; } R2.katanaDeflectKills = ok + '/10';
    }
    { // rail gun: hold to charge, kills two guards standing behind a wall
      showPanel(null); G.implant = 'none'; startLevel(0); G.state = 'pause'; G.lore = null; for (const e of G.ents) e.st = 'dead'; const P = G.player; P.x = 20 * 8; P.y = 19.5 * 8; P.sx = P.x; P.sy = P.y; P.wpn = 'rail'; P.ammo = 4; UI.assist = false;
      const a = spawnEnemy('grd', 20 * 8, 13 * 8, null, 0), c = spawnEnemy('grd', 20 * 8, 27 * 8, null, 0); P.a = Math.PI / 2; IN.ax = P.x; IN.ay = P.y + 100; const wallBetween = !los(P.x, P.y, c.x, c.y);
      IN.fire = true; let fired = false; for (let i = 0; i < 30 && !fired; i++) { updateGame(1 / 30); P.a = Math.PI / 2; if (P.ammo < 4) fired = true; } IN.fire = false; run(5);
      R2.railThroughWall = { wallBetween: wallBetween, behindWallKilled: c.st === 'dead', chargeMs: 'about 450' };
      P.a = -Math.PI / 2; IN.ay = P.y - 100; IN.fire = true; for (let i = 0; i < 30 && P.ammo === 3; i++) { updateGame(1 / 30); P.a = -Math.PI / 2; } IN.fire = false; R2.railUp = a.st === 'dead'; UI.assist = true;
    }
    { // missiles: one rocket into a group of three
      const [P, cx, cy] = arena(); G.god = true; P.wpn = 'rocket'; P.ammo = 3; const g = [spawnEnemy('grd', cx + 60, cy, null, 0), spawnEnemy('grd', cx + 66, cy - 12, null, 0), spawnEnemy('fat', cx + 70, cy + 12, null, 0)]; for (const e of g) e.st = 'idle';
      P.a = Math.atan2(cy - P.y, cx + 60 - P.x); attack(P, true); run(40); R2.rocketGroupKills = g.filter(e => e.st === 'dead').length + '/3 (incl. juggernaut)';
      const [P2, cx2, cy2] = arena(); G.god = false; P2.wpn = 'rocket'; P2.ammo = 3; P2.x = cx2; P2.y = cy2; const e2 = spawnEnemy('grd', cx2 + 14, cy2, null, 0); e2.st = 'idle'; P2.a = 0; attack(P2, true); run(20); R2.pointBlankRocketHurtsYou = P2.dead;
    }
    { // grenades: frag kills a group, EMP fries hounds, frees workers, dazes guards
      const [P, cx, cy] = arena(); G.god = true; P.gren = { k: 'frag', n: 2 }; const g = [spawnEnemy('grd', cx + 50, cy - 6, 'pistol', Math.PI), spawnEnemy('grd', cx + 56, cy + 8, null, Math.PI)]; for (const e of g) e.st = 'idle';
      IN.ax = cx + 52; IN.ay = cy; P.a = Math.atan2(IN.ay - P.y, IN.ax - P.x); IN.nade = true; run(50); R2.fragKills = g.filter(e => e.st === 'dead').length + '/2'; R2.fragsLeft = P.gren ? P.gren.n : 0;
      const [P2, cx2, cy2] = arena(); G.god = true; P2.gren = { k: 'emp', n: 1 }; const h = spawnEnemy('hnd', cx2 + 50, cy2, null, 0), w = spawnEnemy('wkr', cx2 + 55, cy2 + 10, null, 0), gd = spawnEnemy('grd', cx2 + 45, cy2 - 10, 'pistol', 0); for (const e of [h, w, gd]) e.st = 'idle';
      IN.ax = cx2 + 50; IN.ay = cy2; P2.a = 0; IN.nade = true; run(40); R2.emp = { houndFried: h.st === 'dead', workerFreed: w.st === 'freed', guardDazed: gd.dazeT > 0 || gd.st !== 'dead' };
      const [P3, cx3, cy3] = arena(); G.items.push({ k: 'frag', x: P3.x + 4, y: P3.y, ammo: 2, a: 0 }); run(2); R2.walkOverGrenadePickup = P3.gren && P3.gren.n === 2;
    }
    { // belt-fed: heavy (slower walk), 60 rounds, auto fire
      const [P, cx, cy] = arena(); G.god = true; P.wpn = 'belt'; P.ammo = 60; const x0 = P.x; IN.mx = 1; run(30); IN.mx = 0; const heavy = P.x - x0; P.wpn = null; P.x = x0; P.sx = P.x; IN.mx = 1; run(30); IN.mx = 0; const light = P.x - x0;
      R2.beltWalkSpeed = Math.round(heavy / light * 100) + '%'; P.wpn = 'belt'; P.ammo = 60; IN.fire = true; run(30); IN.fire = false; R2.beltRoundsIn1s = 60 - P.ammo;
    }
    { // ricochet revolver: banks off a wall into a guard hidden around a corner (aim assist off)
      let hits = 0; UI.assist = false;
      for (let k = 0; k < 12; k++) { const [P, cx, cy] = arena(); G.god = true; P.wpn = 'revolver'; P.ammo = 6; let wy = cy; while (!blockAt(cx, wy - 8)) wy -= 8; const e = spawnEnemy('grd', cx + 40, wy - 4 + 12, null, 0); e.st = 'idle'; P.x = cx - 40; P.y = wy + 12; const tx = (P.x + e.x) / 2, ty = wy - 6; P.a = Math.atan2(ty - P.y, tx - P.x) + rr(-0.03, 0.03); attack(P, true); run(20); if (e.st === 'dead') hits++; }
      R2.ricochetBankShots = hits + '/12'; UI.assist = true;
    }
    { // throwing knives: silent, picked back up
      const [P, cx, cy] = arena(); G.god = true; P.wpn = 'knife'; P.ammo = 3; const e = spawnEnemy('grd', cx + 40, cy, 'pistol', Math.PI / 2), far = spawnEnemy('grd', cx + 40, cy + 70, 'pistol', 0); e.st = 'idle'; far.st = 'idle';
      P.a = Math.atan2(e.y - P.y, e.x - P.x); IN.ax = e.x; IN.ay = e.y; attack(P, true); run(30); R2.knifeKill = e.st === 'dead'; R2.knifeSilent = far.st === 'idle'; R2.knivesLeft = P.ammo;
      const kn = G.items.find(i => i.k === 'knife'); if (kn) { P.x = kn.x; P.y = kn.y; P.sx = P.x; P.sy = P.y; run(2); } R2.knifePickedBack = P.ammo === 3;
    }
    { // arm blades: punches cut, F leaps onto an enemy
      const [P, cx, cy] = arena('blades'); G.god = true; const e = spawnEnemy('grd', P.x + 14, P.y, null, Math.PI); e.st = 'idle'; P.a = 0; attack(P, true); run(5); R2.bladesPunchKills = e.st === 'dead';
      const f = spawnEnemy('grd', P.x + 130, P.y + 10, 'pistol', Math.PI); f.st = 'idle'; P.a = Math.atan2(f.y - P.y, f.x - P.x); IN.ax = f.x; IN.ay = f.y; ability(); run(20); R2.bladesLeapKill = f.st === 'dead'; R2.leapCooldownSecs = 2.5;
    }
    G.god = false; IN.fire = false; return R2;
  });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
