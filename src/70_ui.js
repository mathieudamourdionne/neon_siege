// ---------- input, menus, loop ----------
const UI = { touch: false, msx: 0, msy: 0, mouseIn: false, panel: null, sel: 'none', li: 0 };
const K = {};
function showPanel(id) { for (const p of document.querySelectorAll('.panel')) p.classList.toggle('on', p.id === id); UI.panel = id; $('tc').classList.toggle('on', !id && G.state === 'play'); document.body.style.cursor = id ? 'default' : 'none'; }
function readInput() {
  if (UI.touch) return;
  IN.mx = (K.KeyD || K.ArrowRight ? 1 : 0) - (K.KeyA || K.ArrowLeft ? 1 : 0); IN.my = (K.KeyS || K.ArrowDown ? 1 : 0) - (K.KeyW || K.ArrowUp ? 1 : 0);
  // look-ahead is applied instantly from the cursor (no lag), so whatever is under the cursor stays under it
  const look = K.ShiftLeft || K.ShiftRight; G.lookK = lerp(G.lookK || 0.25, look ? 0.85 : 0.25, 0.12);
  const [wx, wy] = cursorVec(); G.offX = clamp(wx * G.lookK, -170, 170); G.offY = clamp(wy * G.lookK, -110, 110);
  const P = G.player; if (P) { if (P.lock && P.lock.st !== 'dead' && P.lock.st !== 'down') { IN.ax = P.lock.x; IN.ay = P.lock.y; } else { P.lock = null; IN.ax = G.cam.x + G.offX + wx; IN.ay = G.cam.y + G.offY + wy; } }
}
function setupInput() {
  addEventListener('keydown', e => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.code)) e.preventDefault();
    if (e.repeat) return; K[e.code] = true; audioInit();
    if (G.state === 'play') {
      if (e.code === 'KeyR') restartFloor();
      if (e.code === 'Space' || e.code === 'KeyE') IN.exec = true;
      if (e.code === 'KeyQ') IN.pick = true;
      if (e.code === 'KeyF') IN.abil = true;
      if (e.code === 'KeyG') IN.nade = true;
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') toggleLock();
      if (e.code === 'Escape' || e.code === 'KeyP') pauseGame();
    } else if (G.state === 'pause' && (e.code === 'Escape' || e.code === 'KeyP')) resumeGame();
  });
  addEventListener('keyup', e => { K[e.code] = false; });
  addEventListener('blur', () => { for (const k in K) K[k] = false; IN.fire = false; if (G.state === 'play') pauseGame(); });
  addEventListener('mousemove', e => { UI.msx = e.clientX; UI.msy = e.clientY; UI.mouseIn = true; });
  addEventListener('mousedown', e => { audioInit(); if (G.state !== 'play' || UI.touch) return; if (e.button === 0) { IN.fire = true; IN.fireEdge = true; } if (e.button === 2) IN.pick = true; if (e.button === 1) { e.preventDefault(); toggleLock(); } });
  addEventListener('mouseup', e => { if (e.button === 0) IN.fire = false; });
  addEventListener('contextmenu', e => e.preventDefault());
  // touch: twin stick
  const T = { L: null, R: null }, sL = $('sL'), sR = $('sR');
  const setStick = (el, x, y, kx, ky) => { el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.display = 'block'; el.firstChild.style.transform = `translate(${kx}px,${ky}px)`; };
  addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return; audioInit();
    if (!UI.touch) { UI.touch = true; document.body.classList.add('touch'); $('tc').classList.toggle('on', G.state === 'play' && !UI.panel); }
    if (G.state !== 'play') return;
    const id = e.target && e.target.id;
    if (id === 'bPick') { IN.pick = true; flash(id); return; } if (id === 'bExec') { IN.exec = true; flash(id); return; } if (id === 'bAbil') { IN.abil = true; flash(id); return; } if (id === 'bNade') { IN.nade = true; flash(id); return; }
    if (id === 'bPause') { pauseGame(); return; } if (id === 'bRestart') { restartFloor(); return; }
    if (e.clientX < innerWidth * 0.45 && !T.L) { T.L = { id: e.pointerId, x: e.clientX, y: e.clientY }; setStick(sL, e.clientX, e.clientY, 0, 0); }
    else if (!T.R) { T.R = { id: e.pointerId, x: e.clientX, y: e.clientY }; setStick(sR, e.clientX, e.clientY, 0, 0); }
    e.preventDefault();
  }, { passive: false });
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'touch') return; const R0 = innerHeight * 0.1;
    for (const k of ['L', 'R']) { const s = T[k]; if (!s || s.id !== e.pointerId) continue; let dx = e.clientX - s.x, dy = e.clientY - s.y; const l = Math.hypot(dx, dy); if (l > R0) { dx *= R0 / l; dy *= R0 / l; }
      setStick(k === 'L' ? sL : sR, s.x, s.y, dx, dy);
      if (k === 'L') { IN.mx = dx / R0; IN.my = dy / R0; } else { s.dx = dx / R0; s.dy = dy / R0; } }
  });
  const end = e => { if (T.L && T.L.id === e.pointerId) { T.L = null; IN.mx = IN.my = 0; sL.style.display = 'none'; } if (T.R && T.R.id === e.pointerId) { T.R = null; IN.fire = false; sR.style.display = 'none'; } };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  UI.T = T;
  document.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
}
function toggleLock() {
  const P = G.player; if (!P || P.dead) return; if (P.lock) { P.lock = null; sfx('click'); return; }
  const [wx, wy] = cursorWorld(); let best = null, bd = 70;
  for (const e of G.ents) { if (e.st === 'dead' || e.st === 'down' || e.st === 'freed') continue; const d = Math.hypot(e.x - wx, e.y - wy); if (d < bd && los(P.x, P.y, e.x, e.y)) { bd = d; best = e; } }
  if (!best) { bd = 1e9; for (const e of G.ents) { if (e.st === 'dead' || e.st === 'down' || e.st === 'freed') continue; const d = Math.hypot(e.x - P.x, e.y - P.y); if (d < bd && d < 260 && los(P.x, P.y, e.x, e.y)) { bd = d; best = e; } } }
  if (best) { P.lock = best; sfx('beep'); }
}
function flash(id) { const b = $(id); b.classList.add('act'); setTimeout(() => b.classList.remove('act'), 120); }
function touchAim() {
  const T = UI.T, P = G.player; if (!UI.touch || !P) return;
  const s = T.R; if (!s || s.dx === undefined) { IN.fire = false; return; }
  const l = Math.hypot(s.dx, s.dy); if (l < 0.15) return; let a = Math.atan2(s.dy, s.dx);
  let best = null, bd = 0.45; for (const e of G.ents) { if (e.st === 'dead' || e.st === 'freed' || e.st === 'down') continue; const d = Math.hypot(e.x - P.x, e.y - P.y); if (d > 220) continue; const da = Math.abs(angDiff(Math.atan2(e.y - P.y, e.x - P.x), a)); if (da < bd && los(P.x, P.y, e.x, e.y)) { bd = da; best = e; } }
  if (best) a = Math.atan2(best.y - P.y, best.x - P.x);
  IN.ax = P.x + Math.cos(a) * 60; IN.ay = P.y + Math.sin(a) * 60;
  const W = P.wpn && WEAPONS[P.wpn]; IN.fire = l > 0.6; if (IN.fire && P.cd <= 0 && ((W && !W.melee && !W.auto) || P.mount)) IN.fireEdge = true;
}
function pauseGame() { if (G.state !== 'play') return; G.state = 'pause'; IN.fire = false; showPanel('pPause'); }
function resumeGame() { G.state = 'play'; showPanel(null); }
function unlocked() { return 99; } // testing build: every chapter and implant is open
function act(a) {
  audioInit(); sfx('pickup');
  switch (a) {
    case 'start': UI.li = Math.min(unlocked(), STORY() - 1); if (unlocked() >= STORY()) UI.li = 0; openIntro(UI.li); break;
    case 'jobs': openJobs(); break;
    case 'safehouse': enterHub(); break;
    case 'hubBack': returnToHub(); break;
    case 'levels': { const L = $('lvList'); L.innerHTML = ''; LEVELS.forEach((lv, i) => { if (lv.job || lv.hub) return; const b = document.createElement('button'); b.className = 'm'; const ok = i <= unlocked(); b.innerHTML = (ok ? (i + 1) + '. ' + lv.name : '???') + '<small>' + (ok ? (store('best' + i) ? 'BEST ' + store('best' + i) : lv.sub) : 'LOCKED') + '</small>'; if (ok) b.onclick = () => { sfx('pickup'); openIntro(i); }; L.appendChild(b); }); showPanel('pLevels'); break; }
    case 'help': showPanel('pHelp'); break;
    case 'back': if (UI.fromHub) returnToHub(); else showPanel('pTitle'); break;
    case 'sway': UI.sway = !UI.sway; store('sway', UI.sway); $('bSway').textContent = 'CAMERA SWAY: ' + (UI.sway ? 'ON' : 'OFF'); break;
    case 'assist': UI.assist = !UI.assist; store('assist', UI.assist); $('bAssist').textContent = 'AIM ASSIST: ' + (UI.assist ? 'ON' : 'OFF'); break;
    case 'sound': AU.on = !AU.on; AU.mus = AU.on; if (AU.musG) AU.musG.gain.value = AU.mus ? 0.3 : 0; $('bSound').textContent = 'SOUND: ' + (AU.on ? 'ON' : 'OFF'); break;
    case 'toImplant': openImplants(); break;
    case 'go': { G.implant = UI.sel; store('implant', UI.sel); UI.fromHub = false; const lv = LEVELS[UI.li], plan = lv.job ? [...(UI.plan || [])].filter(k => (lv.assets || []).includes(k)) : [], cost = plan.reduce((a, k) => a + ASSETS[k].cost, 0); if (cost > WALLET.get()) plan.length = 0; else if (cost) WALLET.add(-cost); G.assets = new Set(plan); startLevel(UI.li); showPanel(null); } break;
    case 'resume': resumeGame(); break;
    case 'restart': resumeGame(); restartFloor(); break;
    case 'quit': toTitle(); break;
    case 'next': if (LEVELS[UI.li].job) openJobs(); else if (UI.li + 1 < STORY()) openIntro(UI.li + 1); else { showPanel('pEnd'); $('pEnd').querySelector('.big').innerHTML = 'THE<br>END'; $('endMsg').textContent = "THE BOARD IS GONE. THE BROADCAST WENT OUT FROM THEIR OWN TOWER:\nTHE TAPES, THE LEDGERS, THE CLEANUP ORDERS. EVERY NAME.\n\nPORT OSTRA WOKE UP TO IT. NADIA SAYS THE CITY IS ITS OWN AGAIN -\nNOBODY KNOWS WHAT THAT MEANS YET. THAT'S THE POINT.\n\nTHANKS FOR PLAYING NEON SIEGE."; } break;
  }
}
const STORY = () => LEVELS.filter(l => !l.job && !l.hub).length, money = n => '$' + Math.round(n).toLocaleString('en-US');
function openJobs() { G.state = 'menu'; updateCashUI(); const L = $('jobList'); L.innerHTML = ''; LEVELS.forEach((lv, i) => { if (!lv.job) return; const b = document.createElement('button'); b.className = 'm'; const best = store('jobpay' + lv.name); b.innerHTML = lv.name + '<small>' + lv.pitch + (best ? '<br>BEST TAKE ' + money(best) : '') + '</small>'; b.onclick = () => { sfx('pickup'); openIntro(i); }; L.appendChild(b); }); showPanel('pJobs'); musicStart(2); }
function openIntro(i) { UI.li = i; UI.plan = new Set(); G.state = 'menu'; const lv = LEVELS[i]; $('iWho').textContent = (lv.job ? '' : (i + 1) + '. ' + lv.name + '  //  ') + lv.msg.who; $('iMsg').textContent = lv.msg.text; showPanel('pIntro'); musicStart(2); }
function openImplants() {
  const box = $('impCards'); box.innerHTML = ''; const ul = unlocked();
  for (const I of IMPLANTS) { const c = document.createElement('div'), ok = I.lv <= Math.max(ul, UI.li); c.className = 'card' + (ok ? '' : ' lock') + (UI.sel === I.k ? ' sel' : ''); c.innerHTML = (ok ? I.name : 'LOCKED') + '<small>' + (ok ? I.desc : 'BEAT LEVEL ' + I.lv) + '</small>'; if (ok) c.onclick = () => { UI.sel = I.k; sfx('pickup'); openImplants(); }; box.appendChild(c); }
  if (!IMPLANTS.find(I => I.k === UI.sel && I.lv <= Math.max(ul, UI.li))) UI.sel = 'none';
  renderPlanning(); showPanel('pImplant'); $('bAbil').style.display = '';
}
function levelDone() {
  G.state = 'result'; musicStart(2); sfx('exit');
  const lv = LEVELS[G.li], t = G.levelTime, S = G.stats, flex = Object.keys(S.methods).length, deaths = G.levelDeaths || 0;
  const tm = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const bon = [['SPEED ' + tm(t), Math.max(0, Math.round((lv.par - t) * 15))], ['VARIETY ' + flex + ' WEAPONS', flex * 300], ['UNSEEN KILLS x' + (S.unseen || 0), (S.unseen || 0) * 150], ['BRUTALITY x' + (S.brutal || 0), (S.brutal || 0) * 100], ['DOOR SLAMS x' + (S.doors || 0), (S.doors || 0) * 200], ['MAX COMBO x' + G.comboMax, Math.max(0, G.comboMax - 1) * 250], [deaths ? 'DEATHS x' + deaths : 'NO DEATHS', deaths ? -Math.min(G.score * 0.3, deaths * 400) | 0 : 1500]];
  const total = Math.max(0, G.score + bon.reduce((a, b) => a + b[1], 0));
  const best = Math.max(store('best' + G.li) || 0, total); store('best' + G.li, best); store('unlocked', Math.max(unlocked(), G.li + 1));
  const rows = [['KILLS', S.kills], ['FINISHERS', S.execs], S.freed ? ['CAPTIVES FREED', S.freed] : null, ['KILL POINTS', G.score]].filter(Boolean).concat(bon.map(b => [b[0], (b[1] >= 0 ? '+' : '') + b[1]])).concat([['TOTAL', total]]);
  UI.lastRows = rows;
  const par0 = Math.max(1, S.kills) * 800, k0 = total / par0, gr0 = k0 > 2.1 ? 'S' : k0 > 1.7 ? 'A+' : k0 > 1.35 ? 'A' : k0 > 1.05 ? 'B' : k0 > 0.75 ? 'C' : 'D'; let earned = 0;
  if (lv.job) { const loot = S.loot || 0, cut = PERKS.fence ? Math.round(loot * 0.2) : 0, pay = loot + cut + lv.fee; rows.push(['LOOT SECURED', money(loot)]); if (cut) rows.push(['FENCE CUT +20%', money(cut)]); rows.push(['JOB FEE', money(lv.fee)], ['PAYOUT', money(pay)]); if (pay > (store('jobpay' + lv.name) || 0)) store('jobpay' + lv.name, pay); earned = pay; }
  else { earned = Math.round(total * 0.6 / 100) * 100; rows.push(['CASH EARNED', money(earned)]); }
  if (gr0 === 'S' && !store('sbonus' + lv.name)) { store('sbonus' + lv.name, 1); earned += 10000; rows.push(['FIRST S RANK BONUS', money(10000)]); }
  WALLET.add(earned); rows.push(['WALLET', money(WALLET.get())]);
  $('rName').textContent = lv.name + (lv.job ? ' - JOB DONE' : ' - COMPLETE'); $('rTable').innerHTML = ''; $('rGrade').textContent = ''; $('rGrade').className = 'grade';
  const par = Math.max(1, S.kills) * 800, k = total / par, gr = k > 2.1 ? 'S' : k > 1.7 ? 'A+' : k > 1.35 ? 'A' : k > 1.05 ? 'B' : k > 0.75 ? 'C' : 'D';
  showPanel('pResult'); clearInterval(UI.tallyT); let i = 0;
  UI.tallyT = setInterval(() => { if (G.state !== 'result') { clearInterval(UI.tallyT); return; }
    if (i < rows.length) { const r = rows[i++], tr = document.createElement('tr'); tr.innerHTML = `<td>${r[0]}</td><td>${r[1]}</td>`; if (String(r[1]).startsWith('-')) tr.lastChild.style.color = '#ff3b4e'; if (r[0] === 'TOTAL' || r[0] === 'PAYOUT') tr.className = 'tot'; if (['PAYOUT', 'LOOT SECURED', 'CASH EARNED', 'FIRST S RANK BONUS', 'FENCE CUT +20%', 'WALLET'].includes(r[0])) tr.lastChild.style.color = '#5dff9a'; if (r[0] === 'WALLET') tr.className = 'tot'; $('rTable').appendChild(tr); sfx('tink'); return; }
    clearInterval(UI.tallyT); $('rGrade').textContent = gr; $('rGrade').className = 'grade stamp g' + gr.replace('+', 'p'); sfx('explode'); }, 170);
}
function toTitle() { G.state = 'title'; UI.fromHub = false; updateCashUI(); showPanel('pTitle'); musicStart(2); attractSetup(); }
function attractSetup() { G.li = 0; G.implant = 'none'; G.stats = { kills: 0, execs: 0, saved: 0, freed: 0, methods: {} }; startFloor(0, null); G.state = 'title'; G.banner = null; G.toast = null; }
function attractTick(dt) { const P = G.player; G.time += dt; G.offX = G.offY = 0; for (const e of G.ents) { if (e.st === 'patrol') updEnemy(e, dt); } G.cam.x = P.x + Math.sin(G.time * 0.15) * 120; G.cam.y = P.y + 40 + Math.cos(G.time * 0.11) * 60; updDoors(dt); }
let last = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  try { frameBody(ts); } catch (err) { UI.errN = (UI.errN || 0) + 1; if (UI.errN < 5) console.error(err); if (!UI.errShown) { UI.errShown = 1; try { toast('SOMETHING GLITCHED - THE GAME KEPT RUNNING. PRESS R IF STUCK.'); } catch (e2) { } } }
}
function frameBody(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
  if (G.state === 'play') { readInput(); touchAim(); updateGame(dt); const P = G.player; G.cam.x = lerp(G.cam.x, P.x, Math.min(1, dt * 9)); G.cam.y = lerp(G.cam.y, P.y, Math.min(1, dt * 9)); if (UI.touch) { G.offX = lerp(G.offX || 0, clamp(IN.ax - P.x, -200, 200) * 0.25, Math.min(1, dt * 7)); G.offY = lerp(G.offY || 0, clamp(IN.ay - P.y, -130, 130) * 0.25, Math.min(1, dt * 7)); } $('bRestart').style.display = P.dead && G.deadT > 0.5 ? 'flex' : 'none'; $('bAbil').style.display = (G.implant === 'dash' || G.implant === 'reflex' || G.implant === 'spike' || G.implant === 'blades') ? 'flex' : 'none'; $('bAbil').textContent = G.implant === 'spike' ? 'HACK' : G.implant === 'reflex' ? 'SLOW' : G.implant === 'blades' ? 'LEAP' : 'DASH'; $('bNade').style.display = P.gren ? 'flex' : 'none'; }
  else if (G.state === 'title' || G.state === 'menu' || G.state === 'result') attractTick(dt);
  if (M.floorC) { drawWorld(); post(); }
  drawHud(); if (WARM.length) warmTick(3);
}
function boot() {
  UI.sway = store('sway') !== false; $('bSway').textContent = 'CAMERA SWAY: ' + (UI.sway ? 'ON' : 'OFF');
  UI.assist = store('assist') !== false; $('bAssist').textContent = 'AIM ASSIST: ' + (UI.assist ? 'ON' : 'OFF');
  genGfx(); initRender(); layout(); addEventListener('resize', layout); setupInput();
  const rot = () => $('rotate').classList.toggle('on', UI.touch && innerHeight > innerWidth); addEventListener('resize', rot);
  attractSetup(); showPanel('pTitle'); requestAnimationFrame(frame);
  window.NS = { G: G, startLevel: startLevel, act: act, IN: IN, M: M };
}
boot();
