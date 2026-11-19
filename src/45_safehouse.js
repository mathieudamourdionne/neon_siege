// ---------- the safehouse: money from levels and jobs, spent on starting weapons, upgrades, jackets and job planning ----------
const WALLET = { get: () => store('cash') || 0, add(n) { store('cash', Math.max(0, Math.round(WALLET.get() + n))); updateCashUI(); } };
const owned = k => !!(store('own') || {})[k];
function setOwned(k) { const o = store('own') || {}; o[k] = 1; store('own', o); }
const PERKS = {};
function refreshPerks() { for (const p of SHOP.perks) PERKS[p.k] = owned('perk_' + p.k); }
const SHOP = {
  weapons: [['pipe', 2000], ['bat', 4000], ['machete', 5000], ['pistol', 8000], ['flare', 10000], ['silp', 12000], ['axe', 15000], ['sledge', 18000], ['pump', 20000], ['ar', 30000]],
  perks: [
    { k: 'pockets', name: 'DEEP POCKETS', desc: 'FULL GUNS YOU PICK UP GET 50% MORE AMMO', cost: 20000 },
    { k: 'brawler', name: 'BRAWLER RIG', desc: 'MELEE SWINGS 20% FASTER', cost: 25000 },
    { k: 'steady', name: 'STEADY HANDS', desc: 'YOUR GUNS SPREAD 35% LESS', cost: 30000 },
    { k: 'feet', name: 'LIGHT FEET', desc: 'MOVE 8% FASTER', cost: 35000 },
    { k: 'kevlar', name: 'KEVLAR LINING', desc: 'SHRUG OFF ONE HIT ON EVERY FLOOR', cost: 40000 },
    { k: 'fence', name: 'FENCE CONTACT', desc: '+20% ON ALL SECURED LOOT', cost: 50000 }],
  jackets: [
    { k: 'street', name: 'STREET', col: '#1fb7c9', cost: 0 }, { k: 'crimson', name: 'CRIMSON', col: '#c8202a', cost: 5000 }, { k: 'desert', name: 'DESERT', col: '#c8a070', cost: 5000 },
    { k: 'toxic', name: 'TOXIC', col: '#5ad02a', cost: 6000 }, { k: 'midnight', name: 'MIDNIGHT', col: '#25253a', stripe: '#33ffff', cost: 7000 }, { k: 'chrome', name: 'CHROME', col: '#b8c0cc', stripe: '#3a3a4a', cost: 8000 },
    { k: 'neon', name: 'NEON', col: '#ff3bd8', stripe: '#33ffff', cost: 8000 }, { k: 'gold', name: 'GOLD', col: '#d8a830', stripe: '#fff6a0', cost: 25000 }],
};
function jacketLook() { const j = SHOP.jackets.find(q => q.k === (store('jacket') || 'street')) || SHOP.jackets[0]; return j.k === 'street' ? {} : Object.assign({ jacket: j.col }, j.stripe ? { stripe: j.stripe } : {}); }
// job planning: bought before a job, used up when it starts
const ASSETS = {
  stash: { name: 'INSIDE STASH', desc: 'AN ASSAULT RIFLE HIDDEN NEAR THE START', cost: 6000, apply() { stashNear('ar'); } },
  nades: { name: 'GRENADE CRATE', desc: 'TWO FRAGS WAITING AT THE START', cost: 5000, apply() { stashNear('frag'); stashNear('frag'); } },
  keycopy: { name: 'KEYCARD COPY', desc: 'START WITH THE SECURITY KEYCARD', cost: 8000, apply() { G.hasKey = true; for (const e of G.ents) e.key = 0; objHit('key'); } },
  drill2: { name: 'BETTER DRILL', desc: 'DRILLS 35% FASTER AND ONLY JAMS ONCE', cost: 10000, apply() { for (const d of G.drills) { d.secs *= 0.65; d.jams = d.jams.slice(0, 1); } } },
  fastvan: { name: 'FASTER VAN', desc: 'THE VAN ARRIVES 25 SECONDS SOONER', cost: 8000, apply() { G.vanFast = 25; } },
  cutline: { name: 'CUT THE ALARM LINE', desc: 'THE TACTICAL TEAM ARRIVES 30 SECONDS LATER', cost: 10000, apply() { if (G.police) G.police.t += 30; } },
  tipoff: { name: 'TIP-OFF', desc: 'CARTEL REINFORCEMENTS COME 30 SECONDS LATER', cost: 8000, apply() { if (G.aslAt !== null) G.aslAt += 30; } },
  winch: { name: 'FAST WINCH', desc: 'THE RIG LOWERS IN 30 SECONDS INSTEAD OF 50', cost: 10000, apply() { G.winchFast = 1; } },
};
function stashNear(k) {
  const s = M.b.start, W = M.W; for (let r = 2; r < 7; r++) for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { if (Math.max(Math.abs(i), Math.abs(j)) !== r) continue; const cx = s[0] + i, cy = s[1] + j, c = cy * W + cx;
    if (cx < 1 || cy < 1 || cx >= W - 1 || cy >= M.H - 1 || !M.fl[c] || cellBlocked(c)) continue; const x = (cx + 0.5) * CELL, y = (cy + 0.5) * CELL; if (G.items.some(it => Math.hypot(it.x - x, it.y - y) < 10)) continue;
    G.items.push({ k: k, x: x, y: y, ammo: WEAPONS[k] ? (WEAPONS[k].ammo || 0) : 2, a: rr(0, 6.28) }); return; }
}
function applyAssets() { G.vanFast = 0; G.winchFast = 0; for (const k of (G.assets || [])) if (ASSETS[k]) ASSETS[k].apply(); }
function applyLoadout() { const k = store('loadout'); const P = G.player; if (!k || !WEAPONS[k] || P.wpn || !owned('w_' + k)) return; P.wpn = k; P.ammo = WEAPONS[k].ammo || 0; if (PERKS.pockets && !WEAPONS[k].melee) P.ammo = Math.ceil(P.ammo * 1.5); }
// ---------- the safehouse level ----------
LEVELS.push({
  name: 'SAFEHOUSE', hub: true, sub: '', par: 999, music: 2, bgHue: 285, msg: { who: '', text: '' },
  floors: [{
    name: 'THE NEST', w: 34, h: 24, hub: true, noDest: true, wall: ['#5a3a4a', '#d8b8c8'], tip: 'WALK UP TO SOMETHING AND PRESS E.',
    stations: [{ k: 'stash', x: 4, y: 16, label: 'STASH', text: 'THE STASH - STARTING WEAPON' }, { k: 'bench', x: 9, y: 17, label: 'WORKBENCH', text: 'WORKBENCH - UPGRADES' },
      { k: 'wardrobe', x: 21, y: 4, label: 'WARDROBE', text: 'WARDROBE - JACKETS' }, { k: 'board', x: 20, y: 16, label: 'JOB BOARD', text: 'JOB BOARD - PICK A JOB' }, { k: 'door', x: 29, y: 20, label: 'STORY', text: 'THE STREET - STORY CHAPTERS' }],
    build(b) {
      b.r(2, 2, 16, 11, 'wood').r(19, 2, 13, 11, 'carpet').r(2, 14, 14, 8, 'conc').r(17, 14, 15, 8, 'asph');
      b.d(18, 6, 'v').d(7, 13, 'h').d(16, 17, 'v').d(25, 13, 'h').st(10, 9, 'd');
      b.o('tvwall', 4, 2).o('sofa', 4, 7).o('table', 4, 4).o('counter', 11, 2).o('table', 13, 7).o('plant', 2, 12).o('plant', 17, 2).o('lamp', 2, 2);
      b.t(9, 2, "PORT OSTRA NEWS: ORISON SHARES UP 4% AFTER 'LOWER CITY CLEANUP'.\nPOLICE BLAME GANG WAR FOR LAST NIGHT'S BODIES.\nWEATHER: ACID RAIN TILL THURSDAY.", 'NEWS FEED');
      b.o('locker', 20, 2).o('locker', 21, 2).o('bed', 29, 3).o('shelf', 24, 2).o('plant', 31, 12);
      b.o('locker', 2, 15).o('locker', 2, 17).o('desk', 8, 14).o('crate', 13, 19).o('drum', 14, 14);
      b.o('tvwall', 18, 14).o('van', 22, 17).o('cart', 30, 15).o('drum', 31, 14);
    }
  }]
});
function hubDef() { const d = floorDef(); return d && d.hub ? d : null; }
function hubUsable(P) { const d = hubDef(); if (!d) return null; for (const s of d.stations) if (Math.hypot((s.x + 0.5) * CELL - P.x, (s.y + 0.5) * CELL - P.y) < 18) return { kind: 'heist', text: s.text, act: () => openStation(s.k) }; return null; }
function enterHub() { const hi = LEVELS.findIndex(l => l.hub); G.implant = store('implant') || 'none'; G.assets = new Set(); UI.fromHub = false; showPanel(null); startLevel(hi); }
function returnToHub() { UI.fromHub = false; if (!hubDef()) { enterHub(); return; } showPanel(null); G.state = 'play'; }
function openStation(k) {
  UI.fromHub = true; sfx('pickup');
  if (k === 'stash') openShop('weapons'); else if (k === 'bench') openShop('perks'); else if (k === 'wardrobe') openShop('jackets');
  else if (k === 'board') { openJobs(); G.state = 'shop'; } else if (k === 'door') { act('levels'); G.state = 'shop'; }
}
function updateCashUI() { const t = money(WALLET.get()); for (const id of ['tCash', 'shopCash', 'jobCash']) { const el = $(id); if (el) el.textContent = 'CASH ' + t; } }
function wpnIcon(k) { const c = GFX.wpn[k]; if (!c) return ''; try { return '<img src="' + c.toDataURL() + '" style="width:72px;height:auto;image-rendering:pixelated;display:block;margin:0 auto 6px">'; } catch (e) { return ''; } }
function openShop(tab) { G.state = 'shop'; UI.shopTab = tab; renderShop(); showPanel('pShop'); }
function renderShop() {
  const tab = UI.shopTab, box = $('shopCards'), cash = WALLET.get(); box.innerHTML = ''; updateCashUI();
  $('shopTitle').textContent = tab === 'weapons' ? 'THE STASH - START EVERY LEVEL HOLDING ONE' : tab === 'perks' ? 'WORKBENCH - UPGRADES' : 'WARDROBE - JACKETS';
  const card = (html, cls, onclick) => { const c = document.createElement('div'); c.className = 'card ' + cls; c.innerHTML = html; c.onclick = onclick; box.appendChild(c); };
  const buy = (key, cost, then) => { if (cash < cost) { sfx('noway'); return; } WALLET.add(-cost); setOwned(key); sfx('cash'); then && then(); refreshPerks(); renderShop(); };
  if (tab === 'weapons') {
    const eq = store('loadout') || '';
    card('EMPTY HANDS<small>' + (eq ? 'TAP TO EQUIP' : 'EQUIPPED') + '</small>', eq ? '' : 'sel', () => { store('loadout', ''); sfx('pickup'); renderShop(); });
    for (const [k, cost] of SHOP.weapons) { const W = WEAPONS[k], own = owned('w_' + k), on = eq === k;
      card(wpnIcon(k) + W.name + '<small>' + (own ? (on ? 'EQUIPPED' : 'OWNED - TAP TO EQUIP') : money(cost)) + '</small>', (on ? 'sel' : '') + (!own && cash < cost ? ' lock' : ''),
        () => { if (own) { store('loadout', on ? '' : k); sfx('pickup'); renderShop(); } else buy('w_' + k, cost, () => store('loadout', k)); }); }
  } else if (tab === 'perks') {
    for (const p of SHOP.perks) { const own = owned('perk_' + p.k); card(p.name + '<small>' + p.desc + '<br><br>' + (own ? 'INSTALLED' : money(p.cost)) + '</small>', (own ? 'sel' : '') + (!own && cash < p.cost ? ' lock' : ''), () => { if (!own) buy('perk_' + p.k, p.cost); }); }
  } else {
    const eq = store('jacket') || 'street';
    for (const j of SHOP.jackets) { const own = j.cost === 0 || owned('j_' + j.k), on = eq === j.k;
      card('<div style="height:34px;margin:0 auto 6px;width:60px;border:3px solid #140c10;background:linear-gradient(90deg,' + j.col + ' 70%,' + (j.stripe || '#ff2a8a') + ' 70%)"></div>' + j.name + '<small>' + (own ? (on ? 'WEARING' : 'OWNED - TAP TO WEAR') : money(j.cost)) + '</small>', (on ? 'sel' : '') + (!own && cash < j.cost ? ' lock' : ''),
        () => { const wear = () => { store('jacket', j.k); GFX.ch.player = playerSet(G.implant, false); }; if (own) { wear(); sfx('pickup'); renderShop(); } else buy('j_' + j.k, j.cost, wear); }); }
  }
}
// job planning cards on the implant screen
function renderPlanning() {
  const lv = LEVELS[UI.li], box = $('planCards'), t = $('planTitle'); box.innerHTML = '';
  if (!lv.job || !lv.assets) { box.style.display = t.style.display = 'none'; return; } box.style.display = t.style.display = '';
  UI.plan = UI.plan || new Set(); const cash = WALLET.get(), spent = [...UI.plan].reduce((a, k) => a + ASSETS[k].cost, 0);
  t.textContent = 'PLANNING - ' + money(spent) + ' OF ' + money(cash);
  for (const k of lv.assets) { const A = ASSETS[k], on = UI.plan.has(k), afford = spent + A.cost <= cash; const c = document.createElement('div'); c.className = 'card' + (on ? ' sel' : '') + (!on && !afford ? ' lock' : '');
    c.innerHTML = A.name + '<small>' + A.desc + '<br><br>' + money(A.cost) + '</small>'; c.onclick = () => { if (on) UI.plan.delete(k); else if (afford) UI.plan.add(k); else { sfx('noway'); return; } sfx('pickup'); renderPlanning(); }; box.appendChild(c); }
}
function hubHud(x, u, W, H) {
  const d = hubDef(); if (!d) return;
  pxText(x, money(WALLET.get()), W - u * 0.8, u * 1.5, u * 0.2, { al: 'right', top: '#ffffff', bot: '#5dff9a', ext: '#1a6a3a' });
  for (const s of d.stations) { const [sx, sy] = worldToScreen((s.x + 0.5) * CELL, (s.y + 0.5) * CELL - 14); if (sx > 0 && sy > 0 && sx < W && sy < H) htxt(x, s.label, sx, sy + Math.sin(G.time * 3 + s.x) * u * 0.1, u * 0.5, '#ffe14d', 'center', 0, '#000'); }
}
refreshPerks();
