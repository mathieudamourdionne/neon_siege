// ---------- rendering ----------
const R = {};
function initRender() {
  R.view = $('view'); R.vx = R.view.getContext('2d'); R.vx.imageSmoothingEnabled = false;
  [R.buf, R.bx] = mkCanvas(VW, VH); [R.tr, R.trx] = mkCanvas(VW, VH); [R.tc, R.tcx] = mkCanvas(VW, VH);
  R.hud = $('hud'); R.hx = R.hud.getContext('2d');
  const ov = document.createElement('div'); ov.id = 'crt'; ov.style.cssText = 'position:fixed;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.16) 0 1px,transparent 1px 3px),radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)';
  document.body.insertBefore(ov, R.hud); R.crt = ov;
}
function layout() {
  const nv = clamp(Math.round(VH * innerWidth / innerHeight), 533, 854);
  if (nv !== VW || R.view.width !== VW) { VW = nv; R.view.width = VW; R.vx = R.view.getContext('2d'); R.vx.imageSmoothingEnabled = false; [R.buf, R.bx] = mkCanvas(VW, VH); [R.tr, R.trx] = mkCanvas(VW, VH); [R.tc, R.tcx] = mkCanvas(VW, VH); }
  const W = innerWidth, H = innerHeight, s = Math.min(W / VW, H / VH), w = Math.round(VW * s), h = Math.round(VH * s), l = Math.round((W - w) / 2), t = Math.round((H - h) / 2);
  for (const el of [R.view, R.crt]) Object.assign(el.style, { left: l + 'px', top: t + 'px', width: w + 'px', height: h + 'px' });
  const dpr = Math.min(2, devicePixelRatio || 1); R.hud.width = W * dpr; R.hud.height = H * dpr; R.dpr = dpr; R.s = s; R.l = l; R.t = t; R.W = W; R.H = H;
}
function camXf() {
  const P = G.player, dead = P && P.dead, rot = (UI.sway !== false ? Math.sin(G.time * 0.42) * 0.055 + Math.sin(G.time * 1.1) * 0.012 : 0) + (G.storm ? Math.sin(G.time * 0.7) * 0.045 : 0) + (dead ? Math.min(0.12, G.deadT * 0.05) : 0), zoom = 2 + (dead ? Math.min(0.48, G.deadT * 0.34) : 0) + (G.slowT > 0 ? 0.11 : 0) + (G.zp || 0) * 1.38;
  const sh = G.shake * 3; return { rot: rot, zoom: zoom, x: Math.round(G.cam.x + (G.offX || 0) + (G.kx || 0) + rr(-sh, sh)), y: Math.round(G.cam.y + (G.offY || 0) + (G.ky || 0) + rr(-sh, sh)) };
}
function worldToScreen(x, y) { const X = R.xf, dx = (x - X.x) * X.zoom, dy = (y - X.y) * X.zoom, c = Math.cos(X.rot), s = Math.sin(X.rot); return [R.l + (VW / 2 + dx * c - dy * s) * R.s, R.t + (VH / 2 + dx * s + dy * c) * R.s]; }
// cursor offset from the view centre, in world units (rotation + zoom undone, shake and kick ignored so aim never jitters)
function cursorVec() { const X = R.xf || { rot: 0, zoom: 2 }, vx = (UI.msx - R.l) / R.s - VW / 2, vy = (UI.msy - R.t) / R.s - VH / 2, c = Math.cos(-X.rot), s = Math.sin(-X.rot); return [(vx * c - vy * s) / X.zoom, (vx * s + vy * c) / X.zoom]; }
function cursorWorld() { const [wx, wy] = cursorVec(); return [G.cam.x + (G.offX || 0) + wx, G.cam.y + (G.offY || 0) + wy]; }
function screenToWorld(sx, sy) { const X = R.xf || { rot: 0, zoom: 1, x: 0, y: 0 }, vx = (sx - R.l) / R.s - VW / 2, vy = (sy - R.t) / R.s - VH / 2, c = Math.cos(-X.rot), s = Math.sin(-X.rot); return [X.x + (vx * c - vy * s) / X.zoom, X.y + (vx * s + vy * c) / X.zoom]; }
// finished sprites are handed to the GPU as ImageBitmaps the first time they're drawn (canvases that were read back stay on the CPU and re-upload every draw)
function gpuOf(img) { if (img._bm) return img._bm; if (!img._bmP && !img.live && typeof createImageBitmap === 'function') { img._bmP = 1; createImageBitmap(img).then(bm => { img._bm = bm; }).catch(() => { }); } return img; }
function dRot(x, img, px, py, a) { const k = img.hd || 1, w = img.width / k, h = img.height / k; x.save(); x.translate(Math.round(px * 2) / 2, Math.round(py * 2) / 2); x.rotate(a); x.drawImage(gpuOf(img), -w / 2, -h / 2, w, h); x.restore(); }
function drawBg(x) {
  const lv = LEVELS[G.li], h = (lv.bgHue + Math.sin(G.time * 0.15) * 14 + 360) % 360, g = x.createLinearGradient(0, 0, 0, VH);
  g.addColorStop(0, hsl(h, 45, 22)); g.addColorStop(1, hsl((h + 25) % 360, 50, 11)); x.fillStyle = g; x.fillRect(0, 0, VW, VH);
}
// which body frame an entity shows right now: [weapon, pose, frame, extra torso twist]
function bodyPose(e, mv) {
  const w = e.wpn, W = w && WEAPONS[w], a = e.atk;
  if (e.kind === 'p' && e.mount) return [w, a && a.k === 'smash' && a.t < a.d * 0.55 ? 'slam' : 'raise', 0, 0];
  if (a) {
    const t = Math.min(0.999, a.t / a.d);
    if (a.k === 'wind') return W && W.melee ? [w, 'sF', 0, 0.5 + Math.sin(G.time * 40) * 0.05] : W ? [w, 'walk', 0, 0] : [null, 'pR', 0, 0.35];
    if ((a.k === 'pR' || a.k === 'pL') && !W) return [null, a.k, Math.floor(t * 3), (a.k === 'pR' ? -0.3 : 0.3) * Math.sin(t * Math.PI)];
    if ((a.k === 'sF' || a.k === 'sB') && W && W.melee) return [w, a.k, Math.floor(t * 6), (a.k === 'sF' ? 1 : -1) * lerp(0.42, -0.42, easeO(t))];
    if ((a.k === 'rec' || a.k === 'pump') && W && !W.melee) return [w, a.k, a.k === 'pump' ? (t < 0.5 ? 0 : 1) : 0, a.k === 'rec' ? rr(-0.04, 0.04) : 0];
  }
  return [w, 'walk', W && !W.melee ? 0 : mv ? Math.floor(e.legT * 2) & 7 : 0, 0];
}
function drawChar(x, e) {
  const S = GFX.ch[e.t];
  if (!ETYPE[e.t] || !ETYPE[e.t].camo) { x.fillStyle = 'rgba(0,0,0,0.35)'; x.beginPath(); x.ellipse(Math.round(e.x) + 2, Math.round(e.y) + 2, e.r + 1, e.r + 1, 0, 0, 6.29); x.fill(); }
  if (S.dog) { if (ETYPE[e.t].camo) { const P = G.player, v = clamp((95 - Math.hypot(P.x - e.x, P.y - e.y)) / 45, 0, 1); x.globalAlpha = 0.06 + 0.94 * v; dRot(x, S.dog[Math.floor(e.legT * 1.6) % 6], e.x, e.y, e.a); if (v < 0.5 && Math.hypot(e.vx, e.vy) > 20) { x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.18; dRot(x, tint(S.dog[Math.floor(e.legT * 1.6) % 6], '#3ff'), e.x + rr(-1, 1), e.y, e.a); x.globalCompositeOperation = 'source-over'; } x.globalAlpha = 1; return; } dRot(x, S.dog[Math.floor(e.legT * 1.6) % 6], e.x, e.y, e.a); return; }
  const mv = Math.hypot(e.vx, e.vy) > 8, mount = e.kind === 'p' && e.mount;
  const lg = S.legs[mount ? 9 : mv ? Math.floor(e.legT * 2) & 7 : 8], la = mount || !mv ? e.a : (e.ma !== undefined ? e.ma : Math.atan2(e.vy, e.vx)); dRot(x, lg, e.x, e.y, la); e.lastLeg = lg; e.lastLa = la;
  const [w, pose, f, tw] = bodyPose(e, mv), img = bodyFrame(e.t, w, pose, f), ang = e.a + tw + (mv && !mount ? Math.sin(e.legT * Math.PI / 2) * 0.07 : 0);
  dRot(x, img, e.x, e.y, ang);
  if (e.hitT > 0) { x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.75; dRot(x, img, e.x, e.y, ang); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; }
  if (e.flashT > 0 && w && !WEAPONS[w].melee) { const W = WEAPONS[w], tip = muzzleOff(w) + (mount ? 2 : 0) + 3; dRot(x, GFX.flash[W.pellets > 1 ? 1 : 0], e.x + Math.cos(e.a) * tip, e.y + Math.sin(e.a) * tip, e.a); }
  e.lastImg = img; e.lastAng = ang;
  if (e.hacked > 0) { x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.2 + 0.12 * Math.sin(G.time * 18); dRot(x, tint(img, '#ff3bd8'), e.x, e.y, ang); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.strokeStyle = '#ff3bd8'; x.lineWidth = 1.5; x.beginPath(); x.arc(e.x, e.y, 9, -Math.PI / 2, -Math.PI / 2 + 6.283 * e.hacked / 6); x.stroke(); }
}
// a door: dark-edged wooden plank with a lit edge, hinge and handle
function drawDoor(x, d) {
  const a = d.base + d.ang; x.save(); x.translate(d.hx, d.hy); x.rotate(a);
  x.fillStyle = '#140c10'; x.fillRect(-0.5, -1.75, d.L + 1, 3.5); x.fillStyle = '#7a4420'; x.fillRect(0, -1.25, d.L, 2.5); x.fillStyle = '#a8642e'; x.fillRect(0, -1.25, d.L, 0.5); x.fillStyle = '#5a3016'; x.fillRect(0, 0.75, d.L, 0.5);
  x.fillStyle = '#8a8f99'; x.fillRect(0.25, -1, 1, 2); x.fillStyle = '#d8b048'; x.fillRect(d.L - 3, -2.25, 1, 1); x.fillRect(d.L - 3, 1.25, 1, 1); x.restore();
}
// coloured silhouette of a sprite (cached)
function tint(img, col) { const T = img._tint || (img._tint = {}); if (!T[col]) { const [c, cx] = mkCanvas(img.width, img.height); cx.drawImage(img, 0, 0); cx.globalCompositeOperation = 'source-in'; cx.fillStyle = col; cx.fillRect(0, 0, img.width, img.height); c.hd = img.hd; T[col] = c; } return T[col]; }
const SAND_COL = ['#5dff9a', '#ff3bd8', '#ffe14d', '#3ff'];
function drawGhosts(x) {
  x.globalCompositeOperation = 'lighter';
  for (const g of G.ghosts) { const k = 1 - g.t / (g.life || 0.16); if (g.col) { x.globalAlpha = 0.55 * k; if (g.lg) dRot(x, tint(g.lg, g.col), g.x, g.y, g.la); dRot(x, tint(g.img, g.col), g.x, g.y, g.a); } else { x.globalAlpha = 0.45 * k; dRot(x, g.img, g.x, g.y, g.a); } }
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
}
// reflex boost look: washed-out green world, you and your afterimages stay vivid on top
function drawSand(x) {
  const k = Math.min(1, (SAND_T - G.slowT) * 6, G.slowT * 3), P = G.player, X = R.xf;
  x.globalCompositeOperation = 'saturation'; x.fillStyle = `rgba(128,128,128,${0.75 * k})`; x.fillRect(0, 0, VW, VH);
  x.globalCompositeOperation = 'multiply'; x.fillStyle = `rgba(150,255,210,${k})`; x.fillRect(0, 0, VW, VH);
  x.globalCompositeOperation = 'source-over';
  x.save(); x.translate(VW / 2, VH / 2); x.rotate(X.rot); x.scale(X.zoom, X.zoom); x.translate(-X.x, -X.y); drawGhosts(x); if (!P.dead) drawChar(x, P); x.restore();
  x.strokeStyle = `rgba(93,255,154,${0.35 * k})`; x.lineWidth = 4; x.strokeRect(2, 2, VW - 4, VH - 4);
}
function drawFx(x) {
  for (const f of G.fx) {
    const p = f.t / f.d;
    if (f.k === 'arc') {
      const lo = lerp(f.a0, f.a1, Math.max(0, p * 2 - 1)), hi = lerp(f.a0, f.a1, Math.min(1, p * 2)), a0 = Math.min(lo, hi), a1 = Math.max(lo, hi);
      x.strokeStyle = `rgba(255,255,255,${0.6 * (1 - p)})`; x.lineWidth = 2.5; x.beginPath(); x.arc(f.e.x, f.e.y, f.r, a0, a1); x.stroke();
      x.strokeStyle = `rgba(255,255,255,${0.25 * (1 - p)})`; x.lineWidth = 1; x.beginPath(); x.arc(f.e.x, f.e.y, f.r - 3, a0, a1); x.stroke();
    } else if (f.k === 'boom') {
      const r = f.r * (0.4 + 0.8 * p); x.fillStyle = `rgba(255,230,120,${0.7 * (1 - p)})`; x.beginPath(); x.arc(f.x, f.y, r * 0.7, 0, 6.29); x.fill(); x.strokeStyle = `rgba(255,140,40,${1 - p})`; x.lineWidth = 3; x.beginPath(); x.arc(f.x, f.y, r, 0, 6.29); x.stroke();
    } else if (f.k === 'beam') {
      x.strokeStyle = `rgba(160,255,255,${1 - p})`; x.lineWidth = 3 * (1 - p) + 0.5; x.beginPath(); x.moveTo(f.x0, f.y0); x.lineTo(f.x1, f.y1); x.stroke(); x.strokeStyle = `rgba(255,255,255,${1 - p})`; x.lineWidth = 1; x.beginPath(); x.moveTo(f.x0, f.y0); x.lineTo(f.x1, f.y1); x.stroke();
    } else if (f.k === 'ring') {
      const r = f.inv ? 140 * (1 - p) : 10 + p * (f.pink ? 140 : 170); x.strokeStyle = f.emp ? `rgba(80,200,255,${0.9 * (1 - p)})` : f.pink ? `rgba(255,59,216,${0.8 * (1 - p)})` : `rgba(160,255,200,${0.8 * (1 - p)})`; x.lineWidth = 3; x.beginPath(); x.arc(f.x, f.y, r, 0, 6.29); x.stroke(); x.strokeStyle = `rgba(255,59,216,${0.5 * (1 - p)})`; x.lineWidth = 1.5; x.beginPath(); x.arc(f.x, f.y, r * 0.85, 0, 6.29); x.stroke();
    } else if (f.k === 'link') {
      x.strokeStyle = `rgba(255,59,216,${1 - p})`; x.lineWidth = 2; x.beginPath(); x.moveTo(f.x0, f.y0); for (let i = 1; i < 8; i++) { const q = i / 8; x.lineTo(lerp(f.x0, f.e.x, q) + rr(-4, 4), lerp(f.y0, f.e.y, q) + rr(-4, 4)); } x.lineTo(f.e.x, f.e.y); x.stroke();
    } else if (f.k === 'hit') {
      const r = 2 + p * 7; x.strokeStyle = `rgba(255,255,255,${1 - p})`; x.lineWidth = 1.5; x.beginPath(); x.arc(f.x, f.y, r, 0, 6.29); x.stroke();
      x.fillStyle = `rgba(255,255,255,${1 - p})`; for (let k = 0; k < 4; k++) { const a = f.a + (k - 1.5) * 0.7, d = r + 2; x.fillRect(Math.round(f.x + Math.cos(a) * d), Math.round(f.y + Math.sin(a) * d), 2, 2); }
    }
  }
}
function drawMech(x) {
  const X = R.xf, vx0 = X.x - VW / X.zoom, vx1 = X.x + VW / X.zoom, vy0 = X.y - VH / X.zoom, vy1 = X.y + VH / X.zoom;
  // electrified water shimmer
  if (M.live && M.waterCells) { x.fillStyle = `rgba(140,230,255,${0.08 + 0.06 * Math.sin(G.time * 23)})`; for (const c of M.waterCells) { const cx = (c % M.W) * CELL, cy = ((c / M.W) | 0) * CELL; if (cx > vx0 && cx < vx1 && cy > vy0 && cy < vy1) x.fillRect(cx, cy, CELL, CELL); } }
  // cages, containers and the people inside
  for (const c of M.b.cages) {
    const px = c.x * CELL, py = c.y * CELL;
    if (c.kind === 'cont') { dImg(x, OBJSPR.cont, px, py); if (c.open) { x.fillStyle = '#0a0806'; x.fillRect(px + 59, py + 2, 5, 20); x.fillStyle = '#7a3a10'; x.fillRect(px + 64, py, 6, 2); x.fillRect(px + 64, py + 22, 6, 2); } else { x.fillStyle = '#ffe14d'; x.fillRect(px + 61, py + 10, 2, 4); } continue; }
    if (!c.open) { const kid = c.kind === 'kids'; x.fillStyle = '#2a2018'; x.fillRect(px, py, 16, 16); for (let i = 0; i < c.n; i++) dRot(x, bodyFrame(kid ? (i % 2 ? 'kid2' : 'kid') : (i % 2 ? 'mig2' : 'mig'), null, 'walk', 0), px + 4 + i * 4, py + 6 + (i % 2) * 5, Math.PI / 2 + (i - 1) * 0.5); dImg(x, GFX.cageBars, px, py); }
    else dImg(x, GFX.cageOpen, px, py);
  }
  // racks
  for (const p of G.props) { const S = p.k === 'rack' ? GFX.rack : GFX[p.k]; if (!p.dead || p.k === 'rack') { x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(p.x * CELL + 2, p.y * CELL + 2, p.w * CELL, p.h * CELL); } dImg(x, S[p.dead ? 1 : 0], p.x * CELL, p.y * CELL); if (p.hitT > 0) { x.globalCompositeOperation = 'lighter'; x.globalAlpha = 0.6; dImg(x, S[0], p.x * CELL, p.y * CELL); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; } }
  // finished switches go dark
  for (const s of M.b.sws) if (s.done) { const O = OBJ[s.kind]; x.fillStyle = 'rgba(0,0,0,0.45)'; x.fillRect(s.x * CELL, s.y * CELL, O.w * CELL, O.h * CELL); }
  // flood water
  if (G.flood) { const F = G.flood; x.fillStyle = 'rgba(40,120,210,0.5)'; for (let cy = Math.max(0, Math.floor(vy0 / CELL)); cy < Math.min(M.H, Math.ceil(vy1 / CELL)); cy++) for (let cx = Math.max(0, Math.floor(vx0 / CELL)); cx < Math.min(M.W, Math.ceil(vx1 / CELL)); cx++) { const v = F.d[cy * M.W + cx]; if (v >= 0 && v < F.r) x.fillRect(cx * CELL, cy * CELL, CELL, CELL); }
    x.fillStyle = `rgba(160,220,255,${0.3 + 0.2 * Math.sin(G.time * 9)})`; for (let cy = Math.max(0, Math.floor(vy0 / CELL)); cy < Math.min(M.H, Math.ceil(vy1 / CELL)); cy++) for (let cx = Math.max(0, Math.floor(vx0 / CELL)); cx < Math.min(M.W, Math.ceil(vx1 / CELL)); cx++) { const v = F.d[cy * M.W + cx]; if (v >= 0 && v < F.r && v > F.r - 1.2) x.fillRect(cx * CELL, cy * CELL, CELL, CELL); } }
}
function drawCrane(x) {
  const C = G.crane, z = M.b.zone; if (!z || !C) return; const px = z.x * CELL, py = z.y * CELL, w = z.w * CELL, h = z.h * CELL;
  if (C.drop) { const k = C.drop.t / 0.75; x.fillStyle = `rgba(0,0,0,${0.15 + 0.5 * k})`; x.fillRect(px + w * 0.5 * (1 - k), py + h * 0.5 * (1 - k), w * k, h * k); x.strokeStyle = (G.time * 12 | 0) % 2 ? '#ff2a2a' : '#ffe14d'; x.lineWidth = 2; x.strokeRect(px + 1, py + 1, w - 2, h - 2); }
  if (C.box > 0) { x.globalAlpha = Math.min(1, C.box); const s = OBJSPR.contr, sc = Math.min(w / s.width, h / s.height); x.drawImage(s, px + (w - s.width * sc) / 2, py + (h - s.height * sc) / 2 - (1.4 - C.box) * 30 * (C.box < 0.6 ? 1 : 0), s.width * sc, s.height * sc); x.globalAlpha = 1; }
}
// watchers show where they look; aiming turns the laser hot. the player's rifle has one too
function drawLasers(x) {
  const ray = (e, a) => { let d = 6; while (d < 430 && !blockAt(e.x + Math.cos(a) * d, e.y + Math.sin(a) * d)) d += 3; return d; };
  for (const e of G.ents) {
    if (!ETYPE[e.t].sniper || e.st === 'dead' || e.st === 'down' || e.st === 'freed') continue; const d = ray(e, e.a), hot = e.aimT > 0;
    x.strokeStyle = hot ? (e.aimT < 0.25 && (G.time * 30 | 0) % 2 ? 'rgba(255,255,255,0.9)' : `rgba(255,40,60,${0.5 + 0.5 * (1 - e.aimT)})`) : 'rgba(255,40,60,0.25)'; x.lineWidth = hot ? 1.5 : 1;
    x.beginPath(); x.moveTo(e.x + Math.cos(e.a) * 8, e.y + Math.sin(e.a) * 8); x.lineTo(e.x + Math.cos(e.a) * d, e.y + Math.sin(e.a) * d); x.stroke();
  }
  const P = G.player; if (!P.dead && P.wpn === 'rifle' && !P.mount) { const d = ray(P, P.a); x.strokeStyle = 'rgba(255,40,60,0.55)'; x.lineWidth = 1; x.beginPath(); x.moveTo(P.x + Math.cos(P.a) * 8, P.y + Math.sin(P.a) * 8); x.lineTo(P.x + Math.cos(P.a) * d, P.y + Math.sin(P.a) * d); x.stroke(); }
}
// cheap view culling: only draw what can be on screen (rotation-safe margin)
function inView(px, py, m) { const X = R.xf, hw = VW / X.zoom * 0.62 + (m || 30), hh = VH / X.zoom * 0.62 + (m || 30); return Math.abs(px - X.x) < Math.max(hw, hh) && Math.abs(py - X.y) < Math.max(hw, hh); }
function drawWorld() {
  const x = R.bx, P = G.player; drawBg(x);
  const X = R.xf = camXf();
  x.save(); x.translate(VW / 2, VH / 2); x.rotate(X.rot); x.scale(X.zoom, X.zoom); x.translate(-X.x, -X.y);
  dImg(x, M.floorC, 0, 0); dImg(x, M.decC, 0, 0);
  const ex = M.b.exit; if (ex && G.cleared) { const p = 0.5 + 0.5 * Math.sin(G.time * 6); x.fillStyle = `rgba(80,255,170,${0.15 + p * 0.2})`; x.fillRect(ex.x * CELL, ex.y * CELL, ex.w * CELL, ex.h * CELL); x.strokeStyle = '#5dff9a'; x.lineWidth = 1; x.strokeRect(ex.x * CELL + 0.5, ex.y * CELL + 0.5, ex.w * CELL - 1, ex.h * CELL - 1); }
  drawMech(x); if (M.b.restrict && M.b.restrict.length) drawDisguise(x); if (G.birds && G.birds.length) drawBirds(x); drawGuests(x);
  for (const it of G.items) { if (!inView(it.x, it.y)) continue; const b = 1 + Math.sin(G.time * 5 + it.a) * 0.5; x.globalAlpha = 0.5; dRot(x, GFX.wpn[it.k], it.x + 1, it.y + 1, it.a); x.globalAlpha = 1; dRot(x, GFX.wpn[it.k], it.x, it.y - b * 0, it.a); }
  for (const c of G.corpses) if (inView(c.x, c.y)) dRot(x, c.spr, c.x, c.y, c.a);
  drawDest(x); drawHeist(x); drawAct2bLow(x);
  for (const e of G.ents) if (e.st === 'down' || e.st === 'freed') { const mo = P.mount === e, sit = e.st === 'freed' || (!e.crawl && e.downT < 0.4 && !mo), f = sit ? 3 : Math.floor((G.time + e.legT) * (mo ? 11 : 6)) % 3, j = e.hitT > 0 ? 1.2 : 0; dRot(x, GFX.ch[e.t].downF[f], e.x + rr(-j, j), e.y + rr(-j, j), e.a); if (e.bloody) { const hx = e.x + Math.cos(e.a) * 12, hy = e.y + Math.sin(e.a) * 12; x.fillStyle = '#7a0a12'; x.beginPath(); x.arc(hx, hy, 1.5 + e.bloody * 0.9, 0, 6.29); x.fill(); x.fillStyle = '#c0182a'; x.fillRect(Math.round(hx - 1), Math.round(hy - 1), 2, 2); } if (e.st === 'freed') { x.strokeStyle = '#5dff9a'; x.beginPath(); x.arc(e.x, e.y, 9, 0, 6.29); x.stroke(); } }
  for (const c of G.civs) if (!c.gone && c.st === 'run' && c.t0 > -0.01) { const wf = Math.floor(c.t0 * 16) & 7; x.globalAlpha = 1 - Math.min(1, (c.fade || 0) / 0.6); dRot(x, GFX.ch[c.t].legs[wf], c.x, c.y, c.a); dRot(x, bodyFrame(c.t, null, 'walk', wf), c.x, c.y, c.a); x.globalAlpha = 1; }
  for (const c of G.civs) if (!c.gone && c.st !== 'run') { if (c.st === 'held') dRot(x, GFX.ch.nadia.down, c.x, c.y, Math.PI); else { x.globalAlpha = Math.max(0, 1 - (c.t || 0) / 1.5); const wf = Math.floor((c.t || 0) * 14) & 7; dRot(x, GFX.ch.nadia.legs[wf], c.x, c.y - (c.t || 0) * 20, -Math.PI / 2); dRot(x, bodyFrame('nadia', null, 'walk', wf), c.x, c.y - (c.t || 0) * 20, -Math.PI / 2); x.globalAlpha = 1; } }
  for (const e of G.ents) if (e.st !== 'dead' && e.st !== 'down' && e.st !== 'freed' && inView(e.x, e.y)) drawChar(x, e);
  if (!P.dead) { drawGhosts(x); if (P.inv > 0 && (G.time * 20 | 0) % 2) x.globalAlpha = 0.5; else if (G.implant === 'ghost') x.globalAlpha = (G.time * 9 | 0) % 11 === 0 ? 0.45 : 0.9; drawChar(x, P); x.globalAlpha = 1; if (P.dashT > 0 && P.lastImg && G.state === 'play') G.ghosts.push({ x: P.x, y: P.y, a: P.lastAng, img: P.lastImg, t: 0 }); if (G.slowT > 0 && P.lastImg && G.state === 'play' && (G.sandGhost = (G.sandGhost || 0) - 1 / 60) <= 0) { G.sandGhost = 0.05; G.ghosts.push({ x: P.x, y: P.y, a: P.lastAng, img: P.lastImg, lg: P.lastLeg, la: P.lastLa, t: 0, life: 0.7, col: SAND_COL[(G.time * 9 | 0) % 4] }); } }
  drawCarried(x); drawAct2bHigh(x); drawSmoke(x);
  for (const d of M.doors) drawDoor(x, d);
  for (const t of G.thrown) dRot(x, GFX.wpn[t.k], t.x, t.y, t.a);
  drawProjectiles(x); drawFx(x); drawLasers(x); drawAimAids(x);
  x.lineWidth = 1; for (const b of G.bullets) { if (b.flare) { const k = 0.6 + 0.4 * Math.sin(G.time * 40); x.fillStyle = 'rgba(255,120,30,0.35)'; x.beginPath(); x.arc(b.x, b.y, 4 * k + 1, 0, 6.29); x.fill(); x.fillStyle = '#ffe680'; x.fillRect(b.x - 1, b.y - 1, 2, 2); continue; } if (b.trail && b.trail.length > 1) { x.strokeStyle = b.owner === 'e' ? 'rgba(255,120,60,0.7)' : 'rgba(80,255,255,0.75)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(b.trail[0][0], b.trail[0][1]); for (const q of b.trail) x.lineTo(q[0], q[1]); x.lineTo(b.x, b.y); x.stroke(); x.lineWidth = 1; continue; } x.strokeStyle = b.owner === 'p' ? '#fff6a0' : b.owner === 'h' ? '#ff9af0' : '#ffb060'; x.beginPath(); if (G.slowT > 0) { const l = Math.hypot(b.vx, b.vy) || 1; x.moveTo(b.x - b.vx / l * 9, b.y - b.vy / l * 9); } else x.moveTo(b.px, b.py); x.lineTo(b.x, b.y); x.stroke(); }
  if (P.wpn === 'smart' && !P.dead && P.ammo > 0) { let n = 0; for (const e of G.ents) { if (n >= 3 || e.st === 'dead' || e.st === 'down' || e.st === 'freed' || e.hacked > 0 || Math.hypot(e.x - P.x, e.y - P.y) > 200 || !los(P.x, P.y, e.x, e.y)) continue; n++; x.strokeStyle = 'rgba(80,255,255,0.8)'; x.lineWidth = 1; x.beginPath(); x.moveTo(e.x, e.y - 8); x.lineTo(e.x + 4, e.y - 12); x.lineTo(e.x, e.y - 16); x.lineTo(e.x - 4, e.y - 12); x.closePath(); x.stroke(); } }
  for (const p of G.parts) { if (!inView(p.x, p.y, 10)) continue; if (p.img) dRot(x, p.img, p.x, p.y, p.a); else { x.fillStyle = p.c; x.fillRect(Math.round(p.x * 2) / 2, Math.round(p.y * 2) / 2, p.s, p.s); } }
  dImg(x, M.wallC, 0, 0); drawCrane(x);
  x.restore();
  if (G.night) drawNight(x); if (G.storm) drawStorm(x);
  if (G.flash > 0) { x.fillStyle = `rgba(255,255,255,${G.flash * 0.5})`; x.fillRect(0, 0, VW, VH); }
  if (G.slowT > 0) drawSand(x);
  if (P.dead) { x.fillStyle = `rgba(120,0,20,${Math.min(0.35, G.deadT * 0.3)})`; x.fillRect(0, 0, VW, VH); }
}
function post() {
  const v = R.vx; v.globalCompositeOperation = 'copy'; v.drawImage(R.buf, 0, 0); v.globalCompositeOperation = 'source-over';
  const r = R.trx, c = R.tcx; r.globalCompositeOperation = 'copy'; r.drawImage(R.buf, 0, 0); r.globalCompositeOperation = 'multiply'; r.fillStyle = '#ff0000'; r.fillRect(0, 0, VW, VH);
  c.globalCompositeOperation = 'copy'; c.drawImage(R.buf, 0, 0); c.globalCompositeOperation = 'multiply'; c.fillStyle = '#00ffff'; c.fillRect(0, 0, VW, VH);
  const co = G.slowT > 0 ? 3 : 1; v.globalCompositeOperation = 'lighter'; v.globalAlpha = G.slowT > 0 ? 0.24 : 0.16; v.drawImage(R.tr, co, 0); v.drawImage(R.tc, -co, 0); v.globalAlpha = 1; v.globalCompositeOperation = 'source-over';
}
// ---------- HUD (full resolution) ----------
function htxt(x, s, X, Y, size, col, al, rot, ol) {
  x.save(); x.translate(X, Y); if (rot) x.rotate(rot); x.font = `italic 900 ${size}px "Arial Black","Arial Bold",Impact,sans-serif`; x.textAlign = al || 'left'; x.textBaseline = 'middle';
  x.fillStyle = '#000'; x.fillText(s, size * 0.07, size * 0.07); if (ol) { x.fillStyle = ol; x.fillText(s, -size * 0.04, -size * 0.03); } x.fillStyle = col; x.fillText(s, 0, 0); x.restore();
}
function drawHud() {
  const x = R.hx, d = R.dpr, W = R.W, H = R.H, P = G.player; x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W, H);
  if (G.state !== 'play' && G.state !== 'pause') return;
  const u = Math.max(14, Math.min(W, H * 1.6) / 40), hue = (G.time * 120) % 360;
  if (!hubDef()) pxText(x, G.score, W - u * 0.8, u * 1.5, u * 0.2, { al: 'right', top: '#ffffff', bot: hsl(hue, 100, 66), ext: '#ff2a8a', rot: -0.04 + Math.sin(G.time * 3) * 0.02 });
  if (G.combo > 1 && G.time - G.comboT < 3.4) { const k = 1 - (G.time - G.comboT) / 3.4; pxText(x, G.combo + 'X COMBO', W - u * 0.8, u * 3.1, u * 0.12, { al: 'right', top: '#ffffff', bot: '#ffd040', ext: '#8a1ab8', rot: -0.06, t: G.time, wob: 1 }); x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(W - u * 6.8, u * 3.75, u * 6, u * 0.18); x.fillStyle = '#ffd040'; x.fillRect(W - u * 0.8 - u * 6 * k, u * 3.75, u * 6 * k, u * 0.18); }
  htxt(x, LEVELS[G.li].name + ' - ' + floorDef().name, UI.touch ? u * 4.2 : u * 0.8, u * 1.2, u * 0.7, '#fff', 'left', 0);
  if (G.obj) G.obj.forEach((o, i) => { const done = o.have >= o.n; htxt(x, (done ? '✓ ' : '') + o.label + (o.n > 1 ? '  ' + o.have + '/' + o.n : ''), UI.touch ? u * 4.2 : u * 0.8, u * 2.2 + i * u * 0.9, u * 0.6, done ? '#5dff9a' : '#ffe14d', 'left', 0); });
  const tm = s => Math.floor(s / 60) + ':' + String(Math.ceil(s % 60) === 60 ? 0 : Math.ceil(s % 60)).padStart(2, '0');
  if (G.timer && !G.timer.off) htxt(x, G.timer.label + ' ' + tm(G.timer.t), W / 2, u * 1.6, u * 1.5, G.timer.t < 8 && (G.time * 4 | 0) % 2 ? '#fff' : '#ff3b4e', 'center', -0.03, '#000');
  if (G.hold && G.hold.started && !G.hold.done) htxt(x, 'HOLD ' + tm(Math.max(0, G.hold.need - G.hold.t)), W / 2, u * 1.6, u * 1.5, '#ff2a8a', 'center', -0.03, '#000');
  const bosses = G.ents.filter(e => ETYPE[e.t].boss && e.st !== 'dead'); bosses.forEach((e, i) => { const bn = ETYPE[e.t].name; const bw = Math.min(W * 0.3, u * 12), bx = W / 2 - bw - u * 0.5 + i * (bw + u), by = H - u * 1.6; x.fillStyle = 'rgba(0,0,0,0.7)'; x.fillRect(bx - 3, by - 3, bw + 6, u * 0.6 + 6); x.fillStyle = CHARS[e.t].jacket; x.fillRect(bx, by, bw * Math.max(0, e.hp) / ETYPE[e.t].hp, u * 0.6); htxt(x, bn, bx + bw / 2, by - u * 0.55, u * 0.55, '#fff', 'center', 0); });
  heistHud(x, u, W, H); hubHud(x, u, W, H);
  if (G.disguise && G.state === 'play') htxt(x, inRestricted(P.x, P.y) ? 'STAFF ONLY - GET OUT BEFORE THEY NOTICE' : 'UNDERCOVER', W / 2, u * 3.2, u * 0.7, inRestricted(P.x, P.y) ? '#ff2a8a' : '#5dff9a', 'center', 0);
  const W0 = P.wpn ? WEAPONS[P.wpn] : null;
  htxt(x, W0 ? W0.name : 'FISTS', u * 0.8, H - u * 2.3, u * 1.15, '#fff', 'left', -0.03, '#22e6ff');
  const unit = W0 ? (W0.knife ? ' KNIVES' : W0.rail ? ' SLUGS' : W0.rocket ? ' ROCKETS' : ' RNDS') : '';
  if (P.gren) htxt(x, NADES[P.gren.k].name + ' x' + P.gren.n + (UI.touch ? '' : ' [G]'), u * 0.8, H - u * 4.2, u * 0.55, '#ffe14d', 'left', 0);
  if (W0 && W0.rail && P.charge > 0) { x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(u * 0.8, H - u * 0.45, u * 6, u * 0.25); x.fillStyle = '#3ff'; x.fillRect(u * 0.8, H - u * 0.45, u * 6 * Math.min(1, P.charge / W0.charge), u * 0.25); }
  htxt(x, W0 ? (W0.melee ? 'MELEE' : P.ammo + unit) : (G.implant === 'od' ? 'OVERDRIVE' : 'KNOCKDOWN'), u * 0.8, H - u * 1.05, u * 0.8, W0 && !W0.melee && P.ammo === 0 ? '#ff3b4e' : '#ffe14d', 'left', -0.03);
  if (G.implant !== 'none') {
    const I = IMPLANTS.find(i => i.k === G.implant), key = UI.touch ? '' : ' [F]'; let st = '', col = '#4ff';
    if (G.implant === 'plating') { st = P.shield ? ' READY' : ' SPENT'; if (!P.shield) col = '#888'; }
    if (G.implant === 'dash') st = P.dashCd > 0 ? '' : key;
    if (G.implant === 'reflex') { st = G.slowT > 0 ? ' ACTIVE' : P.sandUsed ? ' SPENT' : ' READY' + key; col = G.slowT > 0 ? '#5dff9a' : P.sandUsed ? '#888' : '#5dff9a'; }
    if (G.implant === 'spike') { st = G.hackedE && G.hackedE.hacked > 0 ? ' LINKED ' + Math.ceil(G.hackedE.hacked) : P.spikeUsed ? ' SPENT' : ' READY' + key; col = P.spikeUsed && !(G.hackedE && G.hackedE.hacked > 0) ? '#888' : '#ff3bd8'; }
    htxt(x, I.name + st, u * 0.8, H - u * 3.4, u * 0.55, col, 'left', 0);
    if (G.slowT > 0) { const bw = u * 9; x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(u * 0.8, H - u * 4.4, bw, u * 0.35); x.fillStyle = '#5dff9a'; x.fillRect(u * 0.8, H - u * 4.4, bw * G.slowT / SAND_T, u * 0.35); }
  }
  for (const p of G.pops) { const [sx, sy] = worldToScreen(p.x, p.y), al = Math.min(1, (1.3 - p.t) * 4), pk = Math.min(1, p.t * 12), yy = sy - u * 1.2 - p.t * u * 1.6 - (p.lane || 0) * u * 1.3;
    if (p.pts) { if (p.label) pxText(x, p.label, sx, yy - u * 0.95, u * 0.085, { top: '#fff6a0', bot: '#ffb020', ext: '#c81e28', t: G.time + p.x, wob: 1, alpha: al, rot: -0.05 }); pxText(x, p.pts, sx, yy, u * (0.11 + 0.05 * (1 - pk) + Math.min(0.04, (p.combo - 1) * 0.008)), { top: '#ffffff', bot: p.combo > 2 ? '#ff8ad8' : '#2fd8c8', ext: p.combo > 2 ? '#6a1ab8' : '#ff2a8a', t: G.time + p.y, wob: 1, alpha: al, rot: -0.05 }); }
    else pxText(x, p.txt, sx, yy, u * 0.08, { top: '#ffffff', bot: p.c, ext: '#1a0a20', alpha: al, rot: -0.04 }); }
  if (!P.dead) {
    const dn = !P.mount && nearDowned(), us = nearUsable(); let pr = P.mount ? (UI.touch ? 'TAP FINISH TO SMASH! ' : 'CLICK TO SMASH! ') + P.mountHits + '/' + smashNeed(P) : dn ? (UI.touch ? 'FINISH' : 'SPACE - FINISH') : us ? (UI.touch ? 'USE: ' : 'E - ') + us.text : '';
    if (!pr && !P.wpn) { for (const it of G.items) if (WEAPONS[it.k] && Math.hypot(it.x - P.x, it.y - P.y) < 18) { pr = (UI.touch ? 'GRAB ' : 'RIGHT CLICK - ') + WEAPONS[it.k].name; break; } }
    if (pr) { const [sx, sy] = worldToScreen(P.x, P.y + 16); htxt(x, pr, sx, sy + u * 0.6, u * 0.6, '#fff', 'center', 0); }
  }
  if (G.cleared && M.b.exit && !P.dead) { const ex = M.b.exit, tx = (ex.x + ex.w / 2) * CELL, ty = (ex.y + ex.h / 2) * CELL, [sx, sy] = worldToScreen(tx, ty), [px, py] = worldToScreen(P.x, P.y), a = Math.atan2(sy - py, sx - px), dd = Math.hypot(sx - px, sy - py);
    if (dd > u * 5) { const r = Math.min(dd - u * 2, Math.min(W, H) * 0.4), ax = px + Math.cos(a) * r, ay = py + Math.sin(a) * r; x.save(); x.translate(ax, ay); x.rotate(a); x.fillStyle = hsl(140, 100, 60 + 10 * Math.sin(G.time * 8)); x.beginPath(); x.moveTo(u, 0); x.lineTo(-u * 0.6, -u * 0.7); x.lineTo(-u * 0.2, 0); x.lineTo(-u * 0.6, u * 0.7); x.fill(); x.restore(); } }
  if (!P.dead && !P.mount && !P.lock && G.state === 'play') { const W = P.wpn && WEAPONS[P.wpn], tg = W && !W.melee ? (P.ammo > 0 && UI.assist !== false ? gunTarget(P) : null) : (meleeTarget(P, W) || [])[0];
    if (tg) { const [sx, sy] = worldToScreen(tg.x, tg.y), r = u * 0.75, q = u * 0.32; x.strokeStyle = '#000'; x.lineWidth = 4.5; const br = () => { x.beginPath(); for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { x.moveTo(sx + i * r, sy + j * (r - q)); x.lineTo(sx + i * r, sy + j * r); x.lineTo(sx + i * (r - q), sy + j * r); } x.stroke(); }; br(); x.strokeStyle = '#ff3b4e'; x.lineWidth = 2.5; br(); } }
  if (P.lock && !P.dead) { const [sx, sy] = worldToScreen(P.lock.x, P.lock.y), r = u * 0.9, sp = G.time * 3; x.strokeStyle = '#ff2a8a'; x.lineWidth = 3; for (let k = 0; k < 4; k++) { const a = sp + k * Math.PI / 2; x.beginPath(); x.arc(sx, sy, r, a, a + 0.8); x.stroke(); } }
  if (G.banner) { const b = G.banner, k = Math.min(1, (2.2 - b.life) * 6); htxt(x, b.t, W / 2, H * 0.32, u * 2.4 * (0.6 + 0.4 * k), b.c, 'center', Math.sin(G.time * 2) * 0.05, '#ff2a8a'); }
  if (G.toast) htxt(x, G.toast.t, W / 2, H * 0.82, u * 0.62, '#fff', 'center', 0);
  if (G.lore) { const L = G.lore, lines = L.text.split('\n'), lh = u * 0.75, bh = lh * (lines.length + 1.8), bw = Math.min(W * 0.8, u * 26), bx = (W - bw) / 2, by = H * 0.56; x.fillStyle = 'rgba(0,0,0,0.75)'; x.fillRect(bx, by, bw, bh); x.fillStyle = '#ff2a8a'; x.fillRect(bx, by, u * 0.2, bh); htxt(x, L.who, bx + u, by + lh * 0.9, u * 0.7, '#ff2a8a', 'left', 0); x.font = `bold ${u * 0.55}px "Courier New",monospace`; x.fillStyle = '#dff'; x.textBaseline = 'middle'; lines.forEach((l, i) => x.fillText(l, bx + u, by + lh * (2 + i))); }
  if (P.dead && G.deadT > 0.5) { htxt(x, "YOU'RE DEAD", W / 2, H * 0.4, u * 3, '#ff3b4e', 'center', -0.06 + Math.sin(G.time * 3) * 0.03, '#000'); htxt(x, UI.touch ? 'TAP RESTART' : 'PRESS R TO RESTART', W / 2, H * 0.4 + u * 2.6, u * 1, '#fff', 'center', -0.03); }
  if (!UI.touch && UI.mouseIn) { const mx = UI.msx, my = UI.msy, r = u * 0.55; x.strokeStyle = '#000'; x.lineWidth = 4; x.beginPath(); x.arc(mx, my, r, 0, 6.29); x.stroke(); x.strokeStyle = hsl(hue, 100, 65); x.lineWidth = 2; x.beginPath(); x.arc(mx, my, r, 0, 6.29); x.stroke(); x.fillStyle = '#fff'; x.fillRect(mx - 1.5, my - 1.5, 3, 3); }
}
