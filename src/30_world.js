// ---------- floor builder (cells of 8px), runtime map, pre-rendered layers ----------
const DIRS = { r: 0, d: Math.PI / 2, l: Math.PI, u: -Math.PI / 2 };
class Builder {
  constructor(w, h) { this.w = w; this.h = h; this.fl = new Uint8Array(w * h); this.doors = []; this.objs = []; this.ens = []; this.items = []; this.cages = []; this.terms = []; this.wits = []; this.start = [2, 2, 0]; this.exit = null; this.rooms = []; this.sws = []; this.props = []; this.sps = []; this.zone = null; this.lamps = []; this.birds = []; this.guests = []; this.restrict = []; }
  r(x, y, w, h, f) { this.rooms.push([x, y, w, h]); const id = FL_IDS.indexOf(f) + 1; for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 1 && j >= 1 && i < this.w - 1 && j < this.h - 1) this.fl[j * this.w + i] = id; return this; }
  // door across a wall: 'v' = wall runs vertically (door at column x, rows y..y+1); 'h' = wall runs horizontally (row y, cols x..x+1)
  d(x, y, o, hinge, f) {
    const nb = o === 'v' ? [this.fl[y * this.w + x - 1], this.fl[y * this.w + x + 1]] : [this.fl[(y - 1) * this.w + x], this.fl[(y + 1) * this.w + x]];
    const fid = f ? FL_IDS.indexOf(f) + 1 : (nb[0] || nb[1] || 1);
    if (o === 'v') { this.fl[y * this.w + x] = fid; this.fl[(y + 1) * this.w + x] = fid; } else { this.fl[y * this.w + x] = fid; this.fl[y * this.w + x + 1] = fid; }
    this.doors.push({ x: x, y: y, o: o, hinge: hinge || 0 }); return this;
  }
  gap(x, y, o, f) { const nb = o === 'v' ? this.fl[y * this.w + x - 1] || this.fl[y * this.w + x + 1] : this.fl[(y - 1) * this.w + x] || this.fl[(y + 1) * this.w + x]; const fid = f ? FL_IDS.indexOf(f) + 1 : nb || 1; if (o === 'v') { this.fl[y * this.w + x] = fid; this.fl[(y + 1) * this.w + x] = fid; } else { this.fl[y * this.w + x] = fid; this.fl[y * this.w + x + 1] = fid; } return this; }
  o(k, x, y) { this.objs.push({ k: k, x: x, y: y }); return this; }
  e(t, x, y, w, dir, opt) { this.ens.push(Object.assign({ t: t, x: x, y: y, w: w, a: DIRS[dir || 'd'] }, opt || {})); return this; }
  i(w, x, y) { this.items.push({ k: w, x: x, y: y }); return this; }
  // captives: 'adult' cage, 'kids' cage, or 'cont' shipping container (opened from its right-hand end)
  cage(x, y, kind) { kind = kind || 'adult'; const c = kind === 'cont' ? { x: x, y: y, kind: kind, ux: (x + 8.5) * 8, uy: (y + 1.5) * 8, n: 4 } : { x: x, y: y, kind: kind, ux: (x + 1) * 8, uy: (y + 1) * 8, n: kind === 'kids' ? 3 : 3 }; this.cages.push(c); this.objs.push({ k: kind === 'cont' ? 'cont' : kind === 'kids' ? 'cagek' : 'cagec', x: x, y: y, cage: 1 }); return this; }
  // switches (breakers, valves, transmitters, crane console) used with E
  sw(x, y, kind, label) { const O = OBJ[kind]; this.sws.push({ x: x, y: y, kind: kind, label: label, ux: (x + O.w / 2) * 8, uy: (y + O.h / 2) * 8 }); this.objs.push({ k: kind, x: x, y: y }); return this; }
  rack(x, y) { this.props.push({ k: 'rack', x: x, y: y, w: 3, h: 1 }); return this; }
  sp(x, y) { this.sps.push([x, y]); return this; }
  lamp(x, y, r) { this.lamps.push([(x + 0.5) * 8, (y + 0.5) * 8, r || 56]); this.objs.push({ k: 'lamp', x: x, y: y }); return this; }
  bird(x, y, n) { for (let i = 0; i < (n || 4); i++) this.birds.push([(x + 0.5) * 8 + (srnd() - 0.5) * 18, (y + 0.5) * 8 + (srnd() - 0.5) * 14]); return this; }
  guest(x, y) { this.guests.push([(x + 0.5) * 8, (y + 0.5) * 8]); return this; }
  restrictZone(x, y, w, h) { this.restrict.push([x, y, w, h]); return this; }
  zn(x, y, w, h) { this.r(x, y, w, h, 'hazard'); this.zone = { x: x, y: y, w: w, h: h }; return this; }
  wit(x, y) { this.wits.push({ x: x, y: y }); return this; }
  t(x, y, text, who) { this.terms.push({ x: x, y: y, text: text, who: who }); this.objs.push({ k: 'term', x: x, y: y }); return this; }
  st(x, y, dir) { this.start = [x, y, DIRS[dir || 'r']]; return this; }
  ex(x, y, w, h, label) { this.exit = { x: x, y: y, w: w, h: h, label: label }; return this; }
}
const M = {}; // runtime map
function loadFloorMap(def) {
  const b = new Builder(def.w, def.h); SEED = 1000 + def.w * 7 + def.h; def.build(b);
  const W = b.w, H = b.h, N = W * H; M.W = W; M.H = H; M.b = b; M.def = def;
  M.fl = b.fl; M.wall = new Uint8Array(N); M.solid = new Uint8Array(N); M.tall = new Uint8Array(N); M.water = new Uint8Array(N); M.live = !!def.live;
  const wid = FL_IDS.indexOf('water') + 1; for (let i = 0; i < N; i++) if (b.fl[i] === wid) M.water[i] = 1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (b.fl[y * W + x]) continue; let n = false;
    for (let j = -1; j <= 1 && !n; j++) for (let i = -1; i <= 1; i++) { const X = x + i, Y = y + j; if (X >= 0 && Y >= 0 && X < W && Y < H && b.fl[Y * W + X]) { n = true; break; } }
    if (n) { M.wall[y * W + x] = 1; M.solid[y * W + x] = 1; }
  }
  for (const o of b.objs) { const O = OBJ[o.k]; if (O.solid) for (let j = 0; j < O.h; j++) for (let i = 0; i < O.w; i++) { M.solid[(o.y + j) * W + o.x + i] = 1; if (O.tall) M.tall[(o.y + j) * W + o.x + i] = 1; } }
  for (const p of b.props) for (let j = 0; j < p.h; j++) for (let i = 0; i < p.w; i++) { M.solid[(p.y + j) * W + p.x + i] = 1; M.tall[(p.y + j) * W + p.x + i] = 1; }
  M.doors = b.doors.map(d => {
    const px = d.x * CELL, py = d.y * CELL;
    if (d.o === 'v') return d.hinge ? { hx: px + 4, hy: py + 16, base: -Math.PI / 2, ang: 0, w: 0, L: 16 } : { hx: px + 4, hy: py, base: Math.PI / 2, ang: 0, w: 0, L: 16 };
    return d.hinge ? { hx: px + 16, hy: py + 4, base: Math.PI, ang: 0, w: 0, L: 16 } : { hx: px, hy: py + 4, base: 0, ang: 0, w: 0, L: 16 };
  });
  prerender(def);
}
function prerender(def) {
  const W = M.W, H = M.H, b = M.b, T = CELL * HDK;
  const [fc, fx] = mkCanvas(W * T, H * T), [wc, wx] = mkCanvas(W * T, H * T), [dc, dx] = mkCanvas(W * T, H * T);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const f = b.fl[y * W + x]; if (!f) continue; const pat = GFX.floor[FL_IDS[f - 1]]; fx.drawImage(pat, (x * T) % 32, (y * T) % 32, T, T, x * T, y * T, T, T); }
  // object shadows + objects
  fx.fillStyle = 'rgba(0,0,0,0.35)'; for (const o of b.objs) { const O = OBJ[o.k]; if (O.solid) fx.fillRect(o.x * T + 4, o.y * T + 4, O.w * T, O.h * T); }
  for (const o of b.objs) if (!o.cage) fx.drawImage(OBJSPR[o.k], o.x * T, o.y * T);
  // wall shadows, then the walls themselves
  fx.fillStyle = 'rgba(0,0,0,0.42)'; for (let i = 0; i < W * H; i++) if (M.wall[i]) fx.fillRect((i % W) * T + 6, ((i / W) | 0) * T + 6, T, T);
  drawWallsHD(wx, def);
  // later drawing on the floor decals and walls (blood, scorch marks) uses world units
  dx.setTransform(HDK, 0, 0, HDK, 0, 0); wx.setTransform(HDK, 0, 0, HDK, 0, 0); fc.hd = wc.hd = dc.hd = HDK; fc.live = wc.live = dc.live = 1;
  M.floorC = fc; M.wallC = wc; M.decC = dc; M.decX = dx;
}
// live (electrified) water blocks movement but not sight or bullets
function cellBlocked(c) { return M.solid[c] === 1 || !M.fl[c] || (M.live && M.water[c] === 1); }
function solidAt(px, py) { const x = Math.floor(px / CELL), y = Math.floor(py / CELL); return x < 0 || y < 0 || x >= M.W || y >= M.H || cellBlocked(y * M.W + x); }
function wallAt(px, py) { const x = Math.floor(px / CELL), y = Math.floor(py / CELL); return x < 0 || y < 0 || x >= M.W || y >= M.H || M.wall[y * M.W + x] === 1 || !M.fl[y * M.W + x]; }
// walls and tall furniture (lockers, crates, racks...) block sight and bullets; low furniture doesn't
function blockAt(px, py) { const x = Math.floor(px / CELL), y = Math.floor(py / CELL); return x < 0 || y < 0 || x >= M.W || y >= M.H || M.wall[y * M.W + x] === 1 || M.tall[y * M.W + x] === 1 || !M.fl[y * M.W + x]; }
function doorEnds(d) { const a = d.base + d.ang; return [d.hx, d.hy, d.hx + Math.cos(a) * d.L, d.hy + Math.sin(a) * d.L]; }
// line of sight: walls block, closed-ish doors block
function los(x0, y0, x1, y1) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), n = Math.ceil(L / 3);
  for (let i = 1; i < n; i++) if (blockAt(x0 + dx * i / n, y0 + dy * i / n)) return false;
  for (const d of M.doors) { const e = doorEnds(d); if (segX(x0, y0, x1, y1, e[0], e[1], e[2], e[3]) >= 0) return false; }
  return true;
}
// circle vs solid cells
function collide(e) {
  const r = e.r, x0 = Math.floor((e.x - r) / CELL), x1 = Math.floor((e.x + r) / CELL), y0 = Math.floor((e.y - r) / CELL), y1 = Math.floor((e.y + r) / CELL);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!(x < 0 || y < 0 || x >= M.W || y >= M.H || cellBlocked(y * M.W + x))) continue;
    const cx = clamp(e.x, x * CELL, x * CELL + CELL), cy = clamp(e.y, y * CELL, y * CELL + CELL), dx = e.x - cx, dy = e.y - cy, d = Math.hypot(dx, dy);
    if (d < r) { if (d > 0.001) { e.x += dx / d * (r - d); e.y += dy / d * (r - d); } else { e.x -= Math.sign(e.vx || 1) * 0.5; } }
  }
}
// push a character out of door panels (keeps it on the side it came from)
function doorPush(c, ox, oy) {
  for (const d of M.doors) {
    const s = doorEnds(d), [dd, qx, qy] = segDist(c.x, c.y, s[0], s[1], s[2], s[3]), m = c.r + 1;
    if (dd >= m) continue;
    const dx = s[2] - s[0], dy = s[3] - s[1], L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L, ny = dx / L; const side = (ox - s[0]) * nx + (oy - s[1]) * ny; if (side < 0) { nx = -nx; ny = -ny; }
    if (dd > 0.01 && (c.x - qx) * nx + (c.y - qy) * ny > 0) { nx = (c.x - qx) / dd; ny = (c.y - qy) / dd; }
    c.x = qx + nx * m; c.y = qy + ny * m;
  }
}
// last known good spot: if a character's centre ever ends up inside a wall or outside the map, put it back
function safePos(c) { if (solidAt(c.x, c.y)) { if (c.sx !== undefined) { c.x = c.sx; c.y = c.sy; c.vx *= -0.2; c.vy *= -0.2; } } else { c.sx = c.x; c.sy = c.y; } }
// sub-stepped movement (2px steps) so dashes, knockbacks and slides can't tunnel through walls or doors
function moveEnt(c, dx, dy) {
  const n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 2));
  for (let i = 0; i < n; i++) { const ox = c.x, oy = c.y; c.x += dx / n; c.y += dy / n; collide(c); doorPush(c, ox, oy); }
  safePos(c);
}
// small sliding things (bodies, dropped weapons): stop at walls and closed doors
function slideObj(o, dt, fr) {
  const sp = Math.hypot(o.vx || 0, o.vy || 0); if (sp < 3) { o.vx = o.vy = 0; return false; }
  const dx = o.vx * dt, dy = o.vy * dt, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 2)), ux = o.vx / sp, uy = o.vy / sp, m = o.m || 3;
  for (let i = 0; i < n; i++) {
    const nx = o.x + dx / n, ny = o.y + dy / n; let hit = blockAt(nx + ux * m, ny + uy * m);
    if (!hit) for (const d of M.doors) { const s = doorEnds(d); if (segX(o.x, o.y, nx + ux * m, ny + uy * m, s[0], s[1], s[2], s[3]) >= 0) { hit = true; break; } }
    if (hit) { o.vx *= -0.2; o.vy *= -0.2; if (o.va) o.va *= 0.5; o.bump = 1; break; }
    o.x = nx; o.y = ny;
  }
  const k = Math.exp(-dt * fr); o.vx *= k; o.vy *= k; if (o.va) { o.a += o.va * dt; o.va *= k; } return true;
}
// BFS flow field toward a cell
function flowFrom(px, py, out) {
  const W = M.W, H = M.H, f = out || new Int16Array(W * H); f.fill(-1);
  const q = new Int32Array(W * H); let h = 0, t = 0; const c0 = Math.floor(py / CELL) * W + Math.floor(px / CELL); f[c0] = 0; q[t++] = c0;
  while (h < t) { const c = q[h++], d = f[c], x = c % W, y = (c / W) | 0; for (const [i, j] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; const n = Y * W + X; if (f[n] >= 0 || cellBlocked(n)) continue; f[n] = d + 1; q[t++] = n; } }
  return f;
}
