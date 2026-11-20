// Special op BLACK SAND: menu, blackmail safes, kids, fireballs, demon gore, Marrow, the ending: node tools/island_test.js
const { chromium, GAME } = require('./pw');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const G = NS.G, M = NS.M, out = {}, L = n => LEVELS.findIndex(l => l.name === n), run = n => { for (let i = 0; i < n; i++) { G.hitStop = 0; updateGame(1 / 30); } };
    const clearAll = () => { for (const e of G.ents) if (e.st !== 'dead') e.st = 'dead'; };
    // menus: the op sits on the JOBS screen and stays out of the story
    act('jobs'); out.menuButton = [...document.querySelectorAll('#jobList button')].some(b => b.textContent.startsWith('SPECIAL OP: BLACK SAND'));
    act('levels'); out.notInLevelSelect = ![...document.querySelectorAll('#lvList button')].some(b => /LANDING|ESTATE|TEMPLE/.test(b.textContent)); out.storyCount = STORY();
    // the house: three wall safes
    showPanel(null); startLevel(L('THE ESTATE')); G.state = 'pause'; G.god = true; clearAll(); for (const s of M.b.sws) useSwitch(s); run(3); out.safesDone = M.b.sws.filter(s => s.kind === 'wsafe' && s.done).length; out.houseCleared = G.cleared;
    // the cellar: the kids come out, and nothing - not even a rocket going off next to them - touches them
    startFloor(1); G.state = 'pause'; G.god = true; for (const c of M.b.cages) openCage(c); out.kidsOut = G.civs.filter(c => c.st === 'run' && /kid/.test(c.t)).length; run(8);
    const k0 = G.civs.find(c => c.st === 'run'); const g = spawnEnemy('isl', k0.x + 10, k0.y, 'pistol', 0); g.st = 'alert'; explode(k0.x, k0.y, 22, true, 'rocket'); for (let i = 0; i < 5; i++) enemyShot(k0.x - 20, k0.y, 0, g); run(4);
    out.kidsUnhurt = G.civs.filter(c => /kid/.test(c.t) && c.st === 'run').length === out.kidsOut; out.kidsReachBoat = (run(30 * 12), G.civs.filter(c => /kid/.test(c.t) && !c.gone).length === 0); clearAll(); checkClear(); run(2); out.cellarCleared = G.cleared;
    // the temple: fiends throw fire
    G.god = false; startLevel(L('THE TEMPLE')); G.state = 'pause'; const P = G.player; out.isle = G.isle; clearAll();
    P.x = 31.5 * 8; P.y = 29.5 * 8; const f = spawnEnemy('fnd', 31.5 * 8, 21.5 * 8, 'hellfire', Math.PI / 2); f.st = 'alert'; f.react = 0; f.cd = 0; f.lx = P.x; f.ly = P.y; f.seeT = 0; f.a = Math.atan2(P.y - f.y, P.x - f.x); let thrown = 0; for (let i = 0; i < 20 && !thrown; i++) { run(1); thrown = Math.max(thrown, G.fireballs.length); } out.fiendThrows = thrown > 0; run(30); out.fireballKills = P.dead;
    startLevel(L('THE TEMPLE')); G.state = 'pause'; clearAll(); const P2 = G.player; G.god = true;
    const fs = spawnEnemy('fnd', P2.x, P2.y - 80, 'hellfire', Math.PI / 2); fs.st = 'idle'; hurlFireball(fs, Math.PI / 2, 165); const fb = G.fireballs[0]; run(5); G.bullets.push({ x: fb.x, y: fb.y, px: fb.x, py: fb.y, vx: 0, vy: 0.01, owner: 'p', k: 'pistol', t: 0 }); run(1); out.shotDown = G.fireballs.length === 0;
    hurlFireball(fs, Math.PI / 2, 165); const fb2 = G.fireballs[0]; for (let i = 0; i < 40 && fb2.own === 'e' && G.fireballs.includes(fb2); i++) { IN.ax = fs.x; IN.ay = fs.y; P2.a = Math.atan2(fs.y - P2.y, fs.x - P2.x); if (Math.hypot(fb2.x - P2.x, fb2.y - P2.y) < 22) P2.swingT = 0.14; run(1); } out.returned = fb2.own === 'p'; fs.x = fb2.x + fb2.vx * 0.25; fs.y = fb2.y + fb2.vy * 0.25; fs.dazeT = 5; run(20); out.returnedKillsFiend = fs.st === 'dead';
    // demons come apart, they don't crawl
    const c0 = G.corpses.length, im = spawnEnemy('imp', P2.x + 30, P2.y, 'claw', 0); let crawled = 0; for (let i = 0; i < 20; i++) { const d = spawnEnemy('imp', P2.x + 40, P2.y + 10, 'claw', 0); killE(d, 'shot', 0, true, 'pistol'); if (d.st === 'down') crawled++; }
    killE(im, 'cut', 0, true, 'axe'); out.demonsNeverCrawl = crawled === 0; out.goreBodies = G.corpses.length - c0; out.fountains = G.fountains.length > 0; out.particles = G.parts.length; run(90); out.fountainsEnd = G.fountains.length === 0;
    out.clawsNotDropped = !G.items.some(i => i.k === 'claw' || i.k === 'hellfire');
    // Marrow: fire volleys, the pits open, he gets angry, and everything goes when he does
    startFloor(1); G.state = 'pause'; G.god = true; const B = G.ents.find(e => e.t === 'mrw'), P3 = G.player; for (const e of G.ents) if (e !== B) e.st = 'dead';
    B.st = 'alert'; B.sees = true; B.volT = 0.01; B.sumT = 99; G.fireballs = []; P3.x = B.x; P3.y = B.y + 60; run(1); out.volley = G.fireballs.length;
    B.sumT = 0.01; run(2); out.summoned = G.ents.filter(e => e.st !== 'dead' && e.t === 'imp').length;
    B.hp = 22; G.fireballs = []; run(1); out.rage = !!B.rage && G.fireballs.length >= 14;
    B.hp = 1; killE(B, 'shotgun', 0, true, 'rocket'); run(60); out.minionsGoWithHim = G.ents.every(e => e.st === 'dead'); out.bossCleared = G.cleared;
    // finishing the op: its own ending, and the story unlocks stay where they were
    const ul = unlocked(); G.li = L('THE TEMPLE'); levelDone(); out.unlockUntouched = unlocked() === ul;
    UI.li = L('THE TEMPLE'); act('next'); out.ending = document.querySelector('#pEnd .big').textContent; out.opMarked = !!store('opBLACK SAND');
    UI.li = L('THE LANDING'); act('next'); out.chainsToEstate = $('iWho').textContent.startsWith('THE ESTATE');
    G.god = false; return out; });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
