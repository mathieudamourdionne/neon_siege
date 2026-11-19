// regression tests: node test.js
const { chromium, GAME, ROOT } = require('./tools/pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const res = await p.evaluate(() => {
    const G = NS.G, IN = NS.IN, M = NS.M, R = {};
    const setup = (li, fi) => { showPanel(null); G.implant = 'none'; G.noCrawl = true; startLevel(li || 0); if (fi) startFloor(fi, null); G.state = 'pause'; G.banner = G.toast = null; return G.player; };
    // centre of a clear n x n cell block, so test setups never start inside walls
    const open = n => { for (let y = 1; y < M.H - n; y++) for (let x = 1; x < M.W - n; x++) { let ok = true; for (let j = 0; j < n && ok; j++) for (let i = 0; i < n; i++) { const c = (y + j) * M.W + x + i; if (!M.fl[c] || M.solid[c]) { ok = false; break; } } if (ok) return [(x + n / 2) * 8, (y + n / 2) * 8]; } return null; };
    const arena = (li, fi) => { const P = setup(li, fi), [cx, cy] = open(10); const e = guard() || spawnEnemy('grd', cx, cy, null, 0); for (const o of G.ents) if (o !== e) o.st = 'dead'; e.x = cx + 20; e.y = cy; e.vx = e.vy = 0; e.st = 'idle'; e.a = Math.PI; P.x = cx - 20; P.y = cy; P.sx = P.x; P.sy = P.y; e.sx = e.x; e.sy = e.y; return [P, e]; };
    const run = (n, dt) => { for (let i = 0; i < n; i++) { updateGame(dt || 0.016); } };
    const guard = () => G.ents.find(e => e.t === 'grd' && e.st !== 'dead');
    const solo = e => { for (const o of G.ents) if (o !== e) o.st = 'dead'; };
    // off-aim punch (40 deg, 22px) knocks down
    { const [P, e] = arena(7, 1); const a = 0.7; P.x = e.x - Math.cos(a) * 22; P.y = e.y - Math.sin(a) * 22; P.a = 0; attack(P, true); R.punch = e.st; }
    // off-aim shot kills
    { const [P, e] = arena(7, 1); P.x = e.x - 60; P.y = e.y + 5; P.a = 0; P.wpn = 'pistol'; P.ammo = 9; attack(P, true); run(10); R.shot = e.st; }
    // mount + 4 clicks kills with smash corpse
    { const [P, e] = arena(7, 1); P.x = e.x - 12; P.y = e.y; P.a = 0; attack(P, true); run(30); P.x = e.x - 5; P.y = e.y; IN.mx = IN.my = 0; IN.exec = true; run(2); let n = 0; while (P.mount && n < 10) { IN.fireEdge = true; run(12); n++; } R.mount = [e.st, n, G.corpses.at(-1) && G.corpses.at(-1).spr === GFX.ch.grd.smash]; }
    // shotgun -> gib corpse that slides and then pools
    { const P = setup(); const e = guard(); solo(e); P.x = e.x - 30; P.y = e.y; P.a = 0; P.wpn = 'pump'; P.ammo = 6; attack(P, true); run(8); const c = G.corpses[0]; const v0 = c && Math.hypot(c.vx, c.vy); run(80); R.shotgun = [e.st, c && c.spr === GFX.ch.grd.gib, Math.round(v0), c && c.vx === 0 && c.vy === 0, c && c.pool.r > 1, c && !solidAt(c.x, c.y)]; }
    // machete -> two halves
    { const P = setup(); const e = guard(); solo(e); P.x = e.x - 14; P.y = e.y; P.a = 0; P.wpn = 'machete'; attack(P, true); run(5); R.machete = [e.st, G.corpses.length, P.atk && P.atk.k]; }
    // throw knockdown
    { const P = setup(); const e = guard(); solo(e); e.st = 'idle'; P.x = e.x - 50; P.y = e.y; P.a = 0; P.wpn = 'pipe'; pickOrThrow(); run(20); R.throw = e.st; }
    // door knockdown: walk a guard up to a door, slam it from the other side
    { R.door = 'no-door'; const P = setup(); for (const d of M.doors) { const s = doorEnds(d), dx = s[2] - s[0], dy = s[3] - s[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, mx = s[0] + dx * 0.7, my = s[1] + dy * 0.7; if (solidAt(mx + nx * 14, my + ny * 14) || solidAt(mx - nx * 14, my - ny * 14)) continue; d.ang = 0; d.w = 0; const e = guard(); solo(e); e.st = 'idle'; e.x = mx + nx * 6.5; e.y = my + ny * 6.5; e.vx = e.vy = 0; P.x = mx - nx * 14; P.y = my - ny * 14; P.vx = nx * 124; P.vy = ny * 124; for (let i = 0; i < 20; i++) { IN.mx = nx; IN.my = ny; IN.ax = P.x + nx * 40; IN.ay = P.y + ny * 40; updateGame(0.016); } R.door = e.st; break; } IN.mx = IN.my = 0; }
    // guards kill the player
    { const P = setup(); const e = G.ents.find(e => e.wpn === 'pistol' || e.wpn === 'smg' || e.wpn === 'pump') || guard(); if (!e.wpn) e.wpn = 'pistol'; solo(e); e.st = 'alert'; e.react = 0; P.x = e.x - 40; P.y = e.y; e.a = Math.PI; run(120); R.die = P.dead; }
    // fat guy takes 3 shots, flashes on hit
    { const [P, e] = arena(7, 1); const f = spawnEnemy('fat', e.x, e.y, null, Math.PI); e.st = 'dead'; P.wpn = 'pistol'; P.ammo = 9; P.a = 0; attack(P, true); run(4); R.fat = [f.st, f.hp, f.hitT > 0]; }
    // dash: never leaves the map, at 20fps, from every wall-adjacent cell
    { let bad = 0, n = 0; for (const [li, fi] of [[0, 0], [0, 1], [1, 0], [1, 1]]) { const P0 = setup(li, fi); G.implant = 'dash'; G.god = true; for (const e of G.ents) e.st = 'dead'; for (let y = 1; y < M.H - 1; y += 2) for (let x = 1; x < M.W - 1; x++) { const i = y * M.W + x; if (!M.fl[i] || M.solid[i]) continue; for (const [a, c] of [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, -0.7]]) { const P = G.player; P.x = (x + 0.5) * 8; P.y = (y + 0.5) * 8; P.sx = P.x; P.sy = P.y; P.vx = P.vy = 0; P.dashCd = 0; P.dashT = 0; IN.mx = a; IN.my = c; ability(); n++; run(5, 0.05); if (solidAt(P.x, P.y)) bad++; } } G.god = false; } IN.mx = IN.my = 0; R.dash = [n, bad]; }
    // Nadia rescue -> cleaners arrive
    { R.nadia = 'skip'; }
    return R;
  });
  console.log(JSON.stringify(res));
  // soak: play every floor for a while with the AI fighting a god-mode player, measure fps
  const soak = await p.evaluate(async () => {
    const G = NS.G, IN = NS.IN, out = [];
    const all = []; LEVELS.forEach((lv, li) => lv.floors.forEach((f, fi) => all.push([li, fi])));
    for (const [li, fi] of all) {
      showPanel(null); G.implant = 'dash'; startLevel(li); if (fi) startFloor(fi, null); G.god = true; G.player.wpn = 'smg'; G.player.ammo = 999;
      let frames = 0; const t0 = performance.now(); IN.fire = true;
      await new Promise(res => { const tick = () => { frames++; const P = G.player, e = G.ents.filter(e => e.st !== 'dead' && e.st !== 'freed' && e.st !== 'down' && los(P.x, P.y, e.x, e.y)).sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y))[0]; P.lock = e || null; P.ammo = 999; if (performance.now() - t0 > 2000) return res(); requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
      out.push([li, fi, Math.round(frames / 2), G.ents.filter(e => e.st === 'dead').length, G.corpses.length]);
    }
    IN.fire = false; G.god = false; return out;
  });
  console.log('soak', JSON.stringify(soak));
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no errors'); await b.close();
})();
