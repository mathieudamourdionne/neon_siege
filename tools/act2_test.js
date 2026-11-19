// Act 2 mechanic checks: node tools/act2_test.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const G = NS.G, M = NS.M, IN = NS.IN, R2 = {}, run = (n, dt) => { for (let i = 0; i < n; i++) { IN.fireEdge = false; updateGame(dt || 1 / 30); } };
    const open = n => { for (let y = 1; y < M.H - n; y++) for (let x = 1; x < M.W - n; x++) { let ok = true; for (let j = 0; j < n && ok; j++) for (let i = 0; i < n; i++) { const c = (y + j) * M.W + x + i; if (!M.fl[c] || M.solid[c]) { ok = false; break; } } if (ok) return [(x + n / 2) * 8, (y + n / 2) * 8]; } };
    const arena = (li, fi) => { showPanel(null); G.implant = 'none'; startLevel(li === undefined ? 7 : li); startFloor(fi === undefined ? 1 : fi, null); G.state = 'pause'; G.lore = null; for (const e of G.ents) e.st = 'dead'; G.ents = []; G.items = []; G.corpses = []; const [cx, cy] = open(10); const P = G.player; P.x = cx - 30; P.y = cy; P.sx = P.x; P.sy = P.y; IN.mx = IN.my = 0; IN.fire = false; return [P, cx, cy]; };
    UI.assist = false;
    { // riot shield: front blocks bullets and punches; back is open; doors/rail still work
      let [P, cx, cy] = arena(); G.god = true; let e = spawnEnemy('rio', cx + 20, cy, 'pistol', Math.PI); e.st = 'idle'; e.cd = 99; P.wpn = 'pistol'; P.ammo = 9; P.a = 0; attack(P, true); run(8); R2.riotFrontShot = e.st;
      [P, cx, cy] = arena(); e = spawnEnemy('rio', cx + 20, cy, 'pistol', 0); e.st = 'idle'; e.cd = 99; G.god = true; P.wpn = 'pistol'; P.ammo = 9; P.a = 0; attack(P, true); run(8); R2.riotBackShot = e.st;
      [P, cx, cy] = arena(); e = spawnEnemy('rio', P.x + 14, P.y, 'pistol', Math.PI); e.st = 'idle'; e.cd = 99; G.god = true; P.a = 0; attack(P, true); run(4); R2.riotFrontPunch = e.st;
      [P, cx, cy] = arena(); e = spawnEnemy('rio', cx + 40, cy, 'pistol', Math.PI); e.st = 'idle'; e.cd = 99; G.god = true; P.wpn = 'rail'; P.ammo = 4; P.a = 0; IN.ax = e.x; IN.ay = e.y; IN.fire = true; for (let i = 0; i < 20 && P.ammo === 4; i++) { updateGame(1 / 30); P.a = 0; } IN.fire = false; R2.riotVsRail = e.st;
    }
    { // ghost hound: nearly invisible far away, visible close
      const vis = d => +(0.06 + 0.94 * Math.max(0, Math.min(1, (95 - d) / 45))).toFixed(2); R2.ghostHoundAlpha = { at200px: vis(200), at80px: vis(80), at40px: vis(40) };
    }
    { // field technician walks to a body and revives it; killing him first stops it
      let [P, cx, cy] = arena(); G.god = true; let v = spawnEnemy('grd', cx + 30, cy, 'pistol', 0); const t = spawnEnemy('tec', cx + 60, cy + 20, null, Math.PI); t.st = 'idle'; killE(v, 'hit', 0, true, 'test'); run(30 * 4);
      R2.techRevives = G.ents.filter(e => e.t === 'grd' && e.st !== 'dead').length === 1;
      [P, cx, cy] = arena(); G.god = true; v = spawnEnemy('grd', cx + 30, cy, 'pistol', 0); killE(v, 'shotgun', 0, true, 'test'); const t2 = spawnEnemy('tec', cx + 60, cy + 20, null, Math.PI); run(30 * 4); R2.gibbedBodyCannotBeRevived = G.ents.filter(e => e.t === 'grd' && e.st !== 'dead').length === 0;
    }
    { // night: in the dark a guard misses you at 100px outside his flashlight; under a lamp he sees you at 200px
      showPanel(null); startLevel(9); G.state = 'pause'; G.god = true; G.lore = null; for (const e of G.ents) e.st = 'dead'; const P = G.player, L = M.b.lamps[0];
      const g = spawnEnemy('grd', L[0] + 100, L[1], 'pistol', Math.PI / 2); g.st = 'idle'; P.x = g.x - 100; P.y = g.y + 30; if (solidAt(P.x, P.y)) P.y = g.y; P.sx = P.x; P.sy = P.y; run(10); R2.nightDarkSeen = g.sees || g.st === 'alert';
      g.a = Math.PI; g.st = 'idle'; P.x = L[0]; P.y = L[1] + 10; if (solidAt(P.x, P.y)) P.y = L[1] - 10; P.sx = P.x; P.sy = P.y; run(10); R2.nightLampSeen = g.st === 'alert';
    }
    { // birds: running past them makes noise that alerts a nearby guard
      showPanel(null); startLevel(9); G.state = 'pause'; G.god = true; G.lore = null; for (const e of G.ents) e.st = 'dead'; const P = G.player, bd = G.birds[0];
      const g = spawnEnemy('grd', bd.x + 60, bd.y + 40, 'pistol', 0); for (let k = 0; k < 64 && solidAt(g.x, g.y); k++) { const a = k * 0.7, r = 40 + k; g.x = bd.x + Math.cos(a) * r; g.y = bd.y + Math.sin(a) * r; } g.st = 'idle'; P.x = bd.x - 60; P.y = bd.y; P.sx = P.x; P.sy = P.y; IN.mx = 1; IN.my = 0; run(30); IN.mx = 0;
      R2.birdsFlew = G.birds.some(x => x.st === 'fly'); R2.birdNoiseAlertsGuard = g.st === 'alert' || g.st === 'search';
    }
    { // disguise: guards ignore you; a red zone gets you noticed; a gunshot blows it
      showPanel(null); startLevel(10); G.state = 'pause'; G.god = true; G.lore = null; const P = G.player; let g = G.ents.find(e => e.wpn && !WEAPONS[e.wpn].melee && !ETYPE[e.t].sniper);
      P.x = g.x - 30; P.y = g.y; P.sx = P.x; P.sy = P.y; g.a = Math.PI; run(60); R2.disguiseIgnored = G.disguise && g.st !== 'alert';
      const z = M.b.restrict[0]; const sg = G.ents.find(e => e.x > z[0] * 8 && e.x < (z[0] + z[2]) * 8 && e.y > z[1] * 8 && e.y < (z[1] + z[3]) * 8); P.x = sg.x - 24; P.y = sg.y; P.sx = P.x; P.sy = P.y; sg.a = Math.PI; let t = 0; while (G.disguise && t < 120) { run(1); t++; } R2.restrictedNoticedSecs = +(t / 30).toFixed(2);
      startFloor(0, null); G.state = 'pause'; G.god = true; G.player.wpn = 'pistol'; G.player.ammo = 9; attack(G.player, true); R2.gunshotBlowsCover = !G.disguise; R2.guestsFlee = G.civs.filter(c => c.st === 'run').length;
      startFloor(0, null); G.state = 'pause'; G.god = true; const Pp = G.player; const lone = G.ents.find(e => e.wpn && WEAPONS[e.wpn].melee && e.x < 16 * 8) || G.ents.find(e => e.wpn && WEAPONS[e.wpn].melee); Pp.x = lone.x - 10; Pp.y = lone.y; lone.a = 0; Pp.a = 0; attack(Pp, true); run(3); R2.unseenTakedownKeepsCover = G.disguise;
    }
    { // handler: boss with 8 hp
      const [P, cx, cy] = arena(); const h = spawnEnemy('hdl', cx + 40, cy, 'smart', Math.PI); R2.handlerHp = h.hp;
    }
    G.god = false; UI.assist = true; return R2;
  });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
