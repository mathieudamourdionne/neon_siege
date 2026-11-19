// ---------- core helpers ----------
'use strict';
let VW = 640; const VH = 360, CELL = 8;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t;
const rr = (a, b) => a + Math.random() * (b - a), ri = (a, b) => Math.floor(rr(a, b + 1)), pick = a => a[Math.floor(Math.random() * a.length)];
const angDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
let SEED = 1; const srnd = () => { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; };
const $ = id => document.getElementById(id);
function store(k, v) { try { if (v === undefined) { const s = localStorage.getItem('ns2_' + k); return s === null ? undefined : JSON.parse(s); } localStorage.setItem('ns2_' + k, JSON.stringify(v)); } catch (e) { return undefined; } }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return [c, x]; }
// crisp pixel painter (no antialiasing)
function spr(w, h, fn) {
  const [c, x] = mkCanvas(w, h);
  const P = {
    x: x, w: w, h: h,
    r(X, Y, W, H, col) { x.fillStyle = col; x.fillRect(Math.round(X), Math.round(Y), Math.round(W), Math.round(H)); },
    p(X, Y, col) { x.fillStyle = col; x.fillRect(Math.round(X), Math.round(Y), 1, 1); },
    d(cx, cy, rx, ry, col) { x.fillStyle = col; for (let y = -Math.ceil(ry); y <= Math.ceil(ry); y++) { const t = 1 - (y / (ry + 0.5)) ** 2; if (t <= 0) continue; const hw = rx * Math.sqrt(t) + 0.25; const x0 = Math.round(cx - hw), x1 = Math.round(cx + hw); if (x1 > x0) x.fillRect(x0, Math.round(cy + y), x1 - x0, 1); } },
    ln(x0, y0, x1, y1, col, wd) { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) || 1; x.fillStyle = col; wd = wd || 1; for (let i = 0; i <= n; i++) x.fillRect(Math.round(x0 + (x1 - x0) * i / n - (wd - 1) / 2), Math.round(y0 + (y1 - y0) * i / n - (wd - 1) / 2), wd, wd); }
  };
  fn(P); return c;
}
function shade(hex, k) { const n = parseInt(hex.slice(1), 16), r = clamp(((n >> 16) & 255) * k, 0, 255) | 0, g = clamp(((n >> 8) & 255) * k, 0, 255) | 0, b = clamp((n & 255) * k, 0, 255) | 0; return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1); }
function hsl(h, s, l, a) { return `hsla(${h},${s}%,${l}%,${a === undefined ? 1 : a})`; }
// segment intersection (returns t along first segment or -1)
function segX(ax, ay, bx, by, cx, cy, dx, dy) {
  const rX = bx - ax, rY = by - ay, sX = dx - cx, sY = dy - cy, den = rX * sY - rY * sX; if (Math.abs(den) < 1e-9) return -1;
  const t = ((cx - ax) * sY - (cy - ay) * sX) / den, u = ((cx - ax) * rY - (cy - ay) * rX) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? t : -1;
}
function segDist(px, py, ax, ay, bx, by) { const vx = bx - ax, vy = by - ay, L = vx * vx + vy * vy || 1, t = clamp(((px - ax) * vx + (py - ay) * vy) / L, 0, 1), qx = ax + vx * t, qy = ay + vy * t; return [Math.hypot(px - qx, py - qy), qx, qy]; }
