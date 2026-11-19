// level fairness analyzer: node tools/analyze.js [levelIndex]
// prints per-floor numbers and writes overview maps to shots/maps/
const { chromium, GAME, ROOT } = require('./pw');
const fs = require('fs');
(async () => {
  const only = process.argv[2] !== undefined ? +process.argv[2] : -1;
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(500);
  const res = await p.evaluate((only) => {
    const G = NS.G, M = NS.M, out = [];
    LEVELS.forEach((lv, li) => lv.floors.forEach((f, fi) => {
      if (only >= 0 && li !== only) return;
      showPanel(null); G.implant = 'none'; startLevel(li); if (fi) startFloor(fi, null); G.state = 'pause'; G.banner = G.toast = null;
      const P = G.player, sx = P.x, sy = P.y, flow = flowFrom(sx, sy), cell = (x, y) => Math.floor(y / 8) * M.W + Math.floor(x / 8);
      const ens = G.ents.filter(e => e.st !== 'dead'), gun = e => e.wpn && !WEAPONS[e.wpn].melee, gunners = ens.filter(gun);
      const sees = ens.filter(e => Math.hypot(e.x - sx, e.y - sy) < 280 && los(e.x, e.y, sx, sy));
      const pd = ens.map(e => flow[cell(e.x, e.y)]).filter(d => d >= 0), unreach = ens.filter(e => flow[cell(e.x, e.y)] < 0 && !e.gated).length;
      let maxG = 0, hot = 0, cells = 0;
      for (let y = 1; y < M.H; y += 2) for (let x = 1; x < M.W; x += 2) { const c = y * M.W + x; if (!M.fl[c] || M.solid[c]) continue; cells++; const px = x * 8 + 4, py = y * 8 + 4; let n = 0; for (const e of gunners) if (Math.hypot(e.x - px, e.y - py) < 280 && los(e.x, e.y, px, py)) n++; maxG = Math.max(maxG, n); if (n >= 3) hot++; }
      const rooms = M.b.rooms.map(r => ens.filter(e => e.x >= r[0] * 8 && e.x < (r[0] + r[2]) * 8 && e.y >= r[1] * 8 && e.y < (r[1] + r[3]) * 8).length);
      const ex = M.b.exit, exR = ex ? flow[cell((ex.x + ex.w / 2) * 8, (ex.y + ex.h / 2) * 8)] >= 0 || !!f.exitGated : false;
      const objR = (M.b.sws || []).concat(M.b.cages, M.b.wits).every(o => { const c = Math.floor(o.y) * M.W + Math.floor(o.x); for (const [i, j] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [0, 2], [2, 0], [-1, 1], [1, -1]]) if (flow[c + j * M.W + i] >= 0) return true; return !!o.gated; });
      // overview map
      const S = 3, [cv, x] = (() => { const c = document.createElement('canvas'); c.width = M.W * 8 * S; c.height = M.H * 8 * S; return [c, c.getContext('2d')]; })(); x.imageSmoothingEnabled = false;
      x.fillStyle = '#111'; x.fillRect(0, 0, cv.width, cv.height); x.drawImage(M.floorC, 0, 0, cv.width, cv.height); x.drawImage(M.wallC, 0, 0, cv.width, cv.height);
      x.save(); x.scale(S, S);
      for (const d of M.doors) { const e = doorEnds(d); x.strokeStyle = '#c87a3a'; x.lineWidth = 2; x.beginPath(); x.moveTo(e[0], e[1]); x.lineTo(e[2], e[3]); x.stroke(); }
      for (const e of sees) { x.strokeStyle = 'rgba(255,40,40,0.8)'; x.lineWidth = 1; x.beginPath(); x.moveTo(sx, sy); x.lineTo(e.x, e.y); x.stroke(); }
      for (const e of ens) { x.fillStyle = ETYPE[e.t].dog ? '#b04aff' : e.t === 'wkr' ? '#ffd23c' : gun(e) ? '#ff2a3a' : '#ff9a2a'; x.beginPath(); x.arc(e.x, e.y, e.t === 'fat' || e.t === 'twin' ? 6 : 4, 0, 6.29); x.fill(); x.strokeStyle = '#000'; x.lineWidth = 1; x.stroke(); x.beginPath(); x.moveTo(e.x, e.y); x.lineTo(e.x + Math.cos(e.a) * 9, e.y + Math.sin(e.a) * 9); x.stroke(); if (e.p) { x.strokeStyle = 'rgba(255,154,42,0.6)'; x.beginPath(); x.moveTo(e.p[0][0], e.p[0][1]); for (const q of e.p) x.lineTo(q[0], q[1]); x.stroke(); } }
      for (const it of G.items) { x.fillStyle = '#4ff'; x.fillRect(it.x - 2, it.y - 2, 4, 4); }
      x.fillStyle = '#3f8'; x.beginPath(); x.arc(sx, sy, 6, 0, 6.29); x.fill(); x.strokeStyle = '#000'; x.stroke();
      if (ex) { x.strokeStyle = '#3f8'; x.lineWidth = 2; x.strokeRect(ex.x * 8, ex.y * 8, ex.w * 8, ex.h * 8); }
      for (const o of (M.b.sws || [])) { x.strokeStyle = '#ff0'; x.lineWidth = 2; x.strokeRect(o.x * 8 - 2, o.y * 8 - 2, 12, 12); }
      x.restore();
      const wl = (x, y) => M.wall[y * M.W + x] === 1, badDoors = M.b.doors.filter(d => !(d.o === 'h' ? wl(d.x - 1, d.y) && wl(d.x + 2, d.y) : wl(d.x, d.y - 1) && wl(d.x, d.y + 2))).length;
      out.push({ id: li + '.' + fi, badDoors: badDoors, name: lv.name + ' / ' + f.name, enemies: ens.length, gunners: gunners.length, seeStart: sees.length, nearestPath: pd.length ? Math.min(...pd) : -1, unreachable: unreach, maxGunnersOnASpot: maxG, crossfireCells: Math.round(hot / cells * 100) + '%', maxPerRoom: Math.max(0, ...rooms), exitReachable: exR, objReachable: objR, png: cv.toDataURL('image/png') });
    }));
    return out;
  }, only);
  fs.mkdirSync(ROOT + '/shots/maps', { recursive: true });
  for (const r of res) { fs.writeFileSync(`${ROOT}/shots/maps/L${r.id.replace('.', 'F')}.png`, Buffer.from(r.png.split(',')[1], 'base64')); delete r.png; }
  console.table(res);
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no errors'); await b.close();
})();
