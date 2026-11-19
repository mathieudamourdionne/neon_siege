// safehouse, shop, perks, loadout, job planning and cash: node tools/safehouse_test.js
const { chromium, GAME, ROOT } = require('./pw');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined }); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  await p.goto(GAME); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const G = NS.G, M = NS.M, IN = NS.IN, out = {}; localStorage.clear(); refreshPerks();
    // walk into the safehouse and use every station
    act('safehouse'); out.inHub = !!hubDef() && G.state === 'play'; out.noEnemies = G.ents.length === 0;
    const st = hubDef().stations, P = G.player; out.stations = {};
    for (const s of st) { P.x = (s.x + 0.5) * CELL; P.y = (s.y + 0.5) * CELL; const u = nearUsable(); out.stations[s.k] = u ? u.text : 'NONE'; if (u) { IN.exec = true; updPlayer(1 / 30); out.stations[s.k] += ' -> ' + [...document.querySelectorAll('.panel')].filter(e => e.style.display !== 'none' && e.offsetParent).map(e => e.id).join(','); act('hubBack'); } }
    out.backInHub = G.state === 'play' && !!hubDef();
    // broke: can't buy
    WALLET.add(-1e9); openShop('weapons'); const c0 = [...document.querySelectorAll('#shopCards .card')]; c0[c0.length - 1].onclick(); out.brokeBuyBlocked = !owned('w_ar');
    // earn, then buy an assault rifle (auto-equips), a perk and a jacket
    WALLET.add(100000); openShop('weapons'); const cards = [...document.querySelectorAll('#shopCards .card')]; cards[cards.length - 1].onclick(); out.boughtAR = owned('w_ar') && store('loadout') === 'ar'; out.cashAfterAR = WALLET.get();
    openShop('perks'); [...document.querySelectorAll('#shopCards .card')][4].onclick(); out.kevlar = PERKS.kevlar; out.cashAfterKevlar = WALLET.get();
    openShop('jackets'); [...document.querySelectorAll('#shopCards .card')][1].onclick(); out.jacket = store('jacket'); out.jacketColour = GFX.ch.player.c && GFX.ch.player.c.jacket;
    act('hubBack');
    // a story level now starts with the rifle and kevlar soaks one hit
    showPanel(null); startLevel(1); G.state = 'pause'; out.startWeapon = G.player.wpn + ' ' + G.player.ammo; const P2 = G.player; out.kevlarSaves = hurtPlayer(null, 0) === false && !P2.dead; P2.inv = 0; out.secondHitKills = hurtPlayer(null, 0) === true;
    restartFloor(); out.restartKeepsWeapon = G.player.wpn;
    // planning: buy a keycard copy for the bank
    WALLET.add(-WALLET.get() + 20000); const ti = LEVELS.findIndex(l => l.name === 'TIDEWATER VAULT'); openIntro(ti); act('toImplant'); const pc = [...document.querySelectorAll('#planCards .card')]; out.planCards = pc.length; pc[2].onclick(); pc[3].onclick(); out.planTitle = $('planTitle').textContent;
    act('go'); out.cashAfterPlanning = WALLET.get(); out.keyAtStart = G.hasKey && G.obj.find(o => o.k === 'key').have === 1; out.drillFaster = Math.round(G.drills[0].secs) + 's ' + G.drills[0].jams.length + ' jam';
    // finishing a level pays into the wallet
    const w0 = WALLET.get(); G.stats.loot = 30000; levelDone(); clearInterval(UI.tallyT); out.jobPaid = WALLET.get() - w0; out.rows = UI.lastRows.slice(-5).map(r => r.join(' ')).join(' | ');
    showPanel(null); startLevel(2); const w1 = WALLET.get(); G.score = 20000; G.stats.kills = 10; levelDone(); clearInterval(UI.tallyT); out.storyPaid = WALLET.get() - w1;
    return out; });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.length ? 'ERRORS\n' + [...new Set(errs)].join('\n') : 'no errors'); await b.close();
})();
