// HM-style environment, gore, destruction and points-font prototype (needs hmart.js)
(function () {
  const INK = '#140c10', ol = (c, col) => HM.hardOutline(c, col || INK);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // ================= POINTS FONT (original chunky italic pixel font) =================
  const F5 = {
    '0': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'], '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'], '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
    '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'], '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'], '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
    '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'], '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'], '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
    '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'], A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'], B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'], D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'], E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'], G: ['01110', '10001', '10000', '10111', '10001', '10001', '01111'], H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
    I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'], K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'], L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'], N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'], O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'], R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'], S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'], U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'], V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
    W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'], X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'], Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
    Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'], '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'], '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
    ',': ['00000', '00000', '00000', '00000', '00000', '00100', '01000'], ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'], '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  };
  const gm = {};
  function gmask(ch) { if (gm[ch]) return gm[ch]; const g = F5[ch] || F5[' ']; return gm[ch] = spr(10, 7, P => { for (let r = 0; r < 7; r++) { const sh = Math.floor((6 - r) / 2); for (let i = 0; i < 5; i++) if (g[r][i] === '1') { P.p(i + sh, r, '#fff'); P.p(i + 1 + sh, r, '#fff'); } } }); }
  function tint(m, fill) { const [c, x] = mkCanvas(m.width, m.height); x.drawImage(m, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = fill; x.fillRect(0, 0, m.width, m.height); return c; }
  // draw big text: u = size of one font pixel on screen; o = {top, bot, ext, depth, t, wob, align}
  function bigText(ctx, s, X, Y, u, o) {
    o = o || {}; const top = o.top || '#b8fff4', bot = o.bot || '#2fd8c8', ext = o.ext || '#ff2a8a', depth = o.depth === undefined ? 2 : Math.min(2, o.depth), adv = 8, w = s.length * adv;
    let x0 = X; if (o.align === 'center') x0 = X - w * u / 2; else if (o.align === 'right') x0 = X - w * u;
    const g = (() => { const [c, x] = mkCanvas(10, 7); const gr = x.createLinearGradient(0, 0, 0, 7); gr.addColorStop(0, top); gr.addColorStop(1, bot); return gr; })();
    ctx.save(); ctx.imageSmoothingEnabled = false;
    const pos = i => [x0 + i * adv * u, Y + Math.round(Math.sin((o.t || 0) * 7 + i * 0.9) * (o.wob || 0)) * u];
    const at = (img, i, dx, dy) => { const [px, py] = pos(i); ctx.drawImage(img, Math.round(px + dx * u), Math.round(py + dy * u), img.width * u, img.height * u); };
    [...s].forEach((ch, i) => { const m = tint(gmask(ch), INK); for (let d = 0; d <= depth; d++) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) at(m, i, dx + d, dy + d); at(m, i, depth + 1, depth + 1); });
    [...s].forEach((ch, i) => { for (let d = depth; d >= 1; d--) at(tint(gmask(ch), shade(ext, 1 - d * 0.12)), i, d, d); });
    [...s].forEach((ch, i) => { const [c, x] = mkCanvas(10, 7); x.drawImage(gmask(ch), 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = g; x.fillRect(0, 0, 10, 7); at(c, i, 0, 0); });
    ctx.restore();
  }
  // ================= FLOORS =================
  const noise = (P, w, h, n, cols) => { for (let i = 0; i < n; i++) P.p(rnd() * w | 0, rnd() * h | 0, cols[rnd() * cols.length | 0]); };
  function brick(base, mortar, hi, lo) { return spr(32, 16, P => { P.r(0, 0, 32, 16, base); noise(P, 32, 16, 40, [lo, shade(base, 1.08)]); for (const [y, o] of [[0, 0], [8, 8]]) { P.r(0, y + 7, 32, 1, mortar); for (let x = o; x < 32 + 16; x += 16) { P.r(x % 32, y, 1, 7, mortar); P.r((x + 1) % 32, y, 14, 1, hi); P.p((x + 1) % 32, y + 1, hi); } } }); }
  function stripes(a, b, w) { return spr(w * 2, 8, P => { for (let y = 0; y < 8; y++) for (let x = 0; x < w * 2; x++) { const base = x < w ? a : b; P.p(x, y, (x + y) % 2 ? base : (rnd() < 0.35 ? shade(base, 1.25) : shade(base, 0.85))); } P.r(w - 1, 0, 1, 8, shade(a, 0.6)); P.r(w * 2 - 1, 0, 1, 8, shade(b, 0.6)); }); }
  function checker(a, b, sz) { return spr(sz * 2, sz * 2, P => { for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) { const col = (x + y) % 2 ? a : b; P.r(x * sz, y * sz, sz, sz, col); P.r(x * sz, y * sz, sz, 1, shade(col, 1.25)); P.r(x * sz, y * sz, 1, sz, shade(col, 1.15)); P.r(x * sz, y * sz + sz - 1, sz, 1, shade(col, 0.7)); } noise(P, sz * 2, sz * 2, 10, [shade(a, 0.8)]); }); }
  const FLOOR = { redBrick: brick('#c8121c', '#4a0208', '#ee3a40', '#a80e16'), purpleBrick: brick('#8a1a6a', '#2a0420', '#b03a8e', '#741458'), tanBrick: brick('#c89858', '#5a3418', '#e8bc7a', '#b08048'),
    blueStripe: stripes('#1a3aa8', '#122a7a', 12), redStripe: stripes('#b81828', '#7a0e1a', 12), darkTile: checker('#2a2a30', '#34343c', 8), bathTile: checker('#3a6a62', '#467a72', 4) };
  // ================= WALLS (cream rails with dashed core) + posts =================
  function wallH(X, x, y, w) { X.fillStyle = INK; X.fillRect(x, y, w, 16); X.fillStyle = '#efe4cc'; X.fillRect(x, y + 1, w, 3); X.fillRect(x, y + 12, w, 3); X.fillStyle = '#fffaf0'; X.fillRect(x, y + 1, w, 1); X.fillRect(x, y + 12, w, 1); X.fillStyle = '#2a1410'; X.fillRect(x, y + 4, w, 8); for (let i = x + 1; i < x + w - 3; i += 7) { X.fillStyle = '#d8782a'; X.fillRect(i, y + 6, 5, 4); X.fillStyle = '#f4a858'; X.fillRect(i, y + 6, 5, 1); X.fillStyle = '#8a3a14'; X.fillRect(i, y + 9, 5, 1); } }
  function wallV(X, x, y, h) { X.save(); X.translate(x + 16, y); X.rotate(Math.PI / 2); wallH(X, 0, 0, h); X.restore(); }
  function post(X, x, y) { X.fillStyle = INK; X.fillRect(x - 2, y - 2, 20, 20); X.fillStyle = '#efe4cc'; X.fillRect(x - 1, y - 1, 18, 18); X.fillStyle = '#fffaf0'; X.fillRect(x - 1, y - 1, 18, 1); X.fillStyle = '#2a1410'; X.fillRect(x + 3, y + 3, 10, 10); X.fillStyle = '#efe4cc'; X.fillRect(x + 6, y + 6, 4, 4); }
  // window: glass in a frame inside a vertical wall segment; broken = jagged teeth
  function windowV(X, x, y, h, broken) {
    X.fillStyle = INK; X.fillRect(x + 5, y, 6, h); X.fillStyle = '#c8ccd4'; X.fillRect(x + 6, y, 1, h); X.fillRect(x + 9, y, 1, h);
    if (!broken) { X.fillStyle = 'rgba(150,230,255,0.9)'; X.fillRect(x + 7, y, 2, h); X.fillStyle = '#ffffff'; for (let i = 4; i < h - 4; i += 9) { X.fillRect(x + 7, y + i, 1, 3); X.fillRect(x + 8, y + i + 2, 1, 2); } }
    else { X.fillStyle = 'rgba(150,230,255,0.95)'; for (const [yy, d] of [[0, 1], [h, -1]]) for (let i = 0; i < 9; i++) { const L = 2 + (i * 7 % 5); X.fillRect(x + 7, yy + d * i - (d < 0 ? 1 : 0), 2, 1); if (i < L) X.fillRect(x + 7, yy + d * i - (d < 0 ? 1 : 0), 1, 1); } X.fillStyle = '#fff'; X.fillRect(x + 7, y + 2, 1, 2); X.fillRect(x + 8, y + h - 4, 1, 2); }
  }
  function shards(X, cx, cy, r, n, dir) { for (let i = 0; i < n; i++) { const a = dir + (rnd() - 0.5) * 2.2, d = rnd() * r, px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d; X.fillStyle = rnd() < 0.3 ? '#ffffff' : (rnd() < 0.5 ? '#9ee8ff' : '#5ab8d8'); const s = 1 + (rnd() * 2 | 0); X.fillRect(px | 0, py | 0, s, rnd() < 0.5 ? 1 : s); } }
  function neonDots(X, x, y, len, vert, col) { for (let i = 0; i < len; i += 7) { const px = vert ? x : x + i, py = vert ? y + i : y; X.fillStyle = shade(col, 0.4); X.globalAlpha = 0.35; X.fillRect(px - 2, py - 2, 7, 7); X.globalAlpha = 1; X.fillStyle = INK; X.fillRect(px - 1, py - 1, 5, 5); X.fillStyle = col; X.fillRect(px, py, 3, 3); X.fillStyle = '#e8fff0'; X.fillRect(px, py, 1, 1); } }
  // ================= PROPS =================
  const PROP = {
    couch: ol(spr(52, 22, P => { P.r(0, 0, 52, 22, '#1c1c24'); P.r(0, 0, 52, 6, '#141418'); P.r(1, 1, 50, 1, '#3a3a48'); P.r(0, 0, 6, 22, '#16161c'); P.r(46, 0, 6, 22, '#16161c'); P.p(2, 2, '#4a4a5a'); P.p(48, 2, '#4a4a5a'); for (let i = 0; i < 3; i++) { const x = 7 + i * 13; P.r(x, 7, 12, 13, '#2c2c38'); P.r(x, 7, 12, 1, '#55556a'); P.r(x, 7, 1, 13, '#44445a'); P.r(x + 11, 7, 1, 13, '#1a1a22'); P.p(x + 6, 13, '#1a1a22'); } P.r(6, 20, 40, 2, '#d8285a'); P.r(6, 20, 40, 1, '#ff5a8a'); })),
    glass: ol(spr(42, 24, P => { P.r(0, 0, 42, 24, '#9aa0a8'); P.r(1, 1, 40, 22, '#62c4e2'); P.r(1, 1, 40, 1, '#a8eaff'); for (let i = 0; i < 3; i++) P.ln(8 + i * 12, 20, 18 + i * 12, 3, '#d8f8ff', 2); P.ln(4, 21, 8, 15, '#ffffff', 1); P.r(1, 22, 40, 1, '#3a94b4'); })),
    glassBroken: ol(spr(42, 24, P => { P.r(0, 0, 42, 2, '#9aa0a8'); P.r(0, 22, 42, 2, '#9aa0a8'); P.r(0, 0, 2, 24, '#9aa0a8'); P.r(40, 0, 2, 24, '#9aa0a8'); P.r(2, 2, 38, 20, '#18141c'); for (const [x, y, d] of [[2, 2, 1], [40, 2, -1], [2, 22, 1], [40, 22, -1]]) for (let i = 0; i < 6; i++) P.r(d > 0 ? x : x - (6 - i), y + (y > 10 ? -i - 1 : i), 6 - i, 1, '#7ad4ee'); P.r(18, 2, 3, 4, '#7ad4ee'); P.p(19, 2, '#fff'); })),
    arcade: ol(spr(24, 28, P => { P.r(0, 0, 24, 28, '#26143a'); P.r(1, 1, 22, 15, '#3a1e56'); P.r(0, 0, 24, 1, '#ff2a8a'); P.r(0, 0, 1, 28, '#ff2a8a'); P.r(23, 0, 1, 28, '#c81e6a'); P.r(3, 3, 18, 8, '#0a1a24'); for (let y = 3; y < 11; y += 2) P.r(3, y, 18, 1, '#1aa8b8'); P.r(5, 5, 6, 3, '#ffe14d'); P.r(13, 6, 5, 2, '#ff3bd8'); P.r(1, 17, 22, 10, '#1a1a22'); P.r(1, 17, 22, 1, '#3a3a48'); P.d(6, 22, 2.2, 2.2, '#c81e28'); P.p(5, 21, '#ff8a8a'); P.r(11, 20, 3, 3, '#3ff'); P.r(15, 22, 3, 3, '#ffe14d'); P.r(19, 20, 3, 3, '#ff2a8a'); })),
    plant: ol(spr(38, 38, P => { const cx = 19, cy = 19; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + (i % 2) * 0.2, L = 13 + (i % 3) * 3; P.ln(cx, cy, cx + Math.cos(a) * L, cy + Math.sin(a) * L, '#14601e', 4); P.ln(cx, cy, cx + Math.cos(a) * (L - 1), cy + Math.sin(a) * (L - 1), '#2a9a34', 2); P.ln(cx + Math.cos(a) * 4, cy + Math.sin(a) * 4, cx + Math.cos(a) * (L - 3), cy + Math.sin(a) * (L - 3), '#7ae05a', 1); }
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + 0.4; P.ln(cx, cy, cx + Math.cos(a) * 8, cy + Math.sin(a) * 8, '#5ad04a', 3); } P.d(cx, cy, 3, 3, '#1a7a24'); })),
    pot: ol(spr(16, 16, P => { P.d(8, 8, 7, 7, '#b8582a'); P.d(8, 8, 5.5, 5.5, '#d8784a'); P.d(8, 8, 4.5, 4.5, '#3a2414'); })),
    table: ol(spr(34, 34, P => { for (const [x, y] of [[13, 0], [13, 28], [0, 13], [28, 13]]) { P.r(x, y, 7, 6, '#e0287a'); P.r(x, y, 7, 1, '#ff6aa8'); } P.d(17, 17, 11, 11, '#2a1238'); P.d(17, 17, 10, 10, '#4a1e5e'); P.d(16, 16, 8, 8, '#5a2a70'); P.d(13, 14, 2.2, 2.2, '#e8e8e8'); P.p(13, 14, '#a8d8ff'); P.d(21, 20, 2.2, 2.2, '#e8e8e8'); P.p(21, 20, '#ffd040'); P.r(17, 11, 4, 3, '#f0e0b0'); })),
    bar: ol(spr(100, 22, P => { P.r(0, 0, 100, 16, '#5a2e14'); P.r(0, 0, 100, 2, '#9a5a2a'); P.r(0, 14, 100, 2, '#3a1a0a'); for (let x = 4; x < 96; x += 6) { const c = ['#2a8a3a', '#c8a040', '#8a1a2a', '#3a6ab8', '#e8e8e8'][x / 6 % 5 | 0]; P.r(x, 4, 3, 5, c); P.p(x, 4, shade(c, 1.5)); } for (let x = 10; x < 96; x += 22) { P.r(x, 10, 6, 3, '#9aa0a8'); P.p(x, 10, '#fff'); } for (let x = 8; x < 100; x += 18) { P.d(x, 19, 3, 2.5, '#c81e28'); P.p(x - 1, 18, '#ff6a6a'); } })),
    barrel: ol(spr(18, 18, P => { P.d(9, 9, 8.5, 8.5, '#5a0808'); P.d(9, 9, 7.6, 7.6, '#d01c18'); P.d(9, 9, 6.2, 6.2, '#8a0e0e'); P.d(9, 9, 5.4, 5.4, '#c01816'); for (let a = 3.4; a < 4.6; a += 0.15) P.p(9 + Math.cos(a) * 7, 9 + Math.sin(a) * 7, '#ff6a5a');
      for (let dy = -4; dy <= 4; dy++) { const w = 4 - Math.abs(dy); P.r(9 - w - 1, 9 + dy, 2 * w + 3, 1, '#141414'); if (w > 0) P.r(9 - w, 9 + dy, 2 * w + 1, 1, '#ffd020'); } P.p(9, 7, '#141414'); P.r(8, 8, 3, 2, '#141414'); P.p(9, 10, '#141414'); P.p(10, 7, '#141414');
      P.d(4.5, 12.5, 1.4, 1.4, '#8a8f99'); P.p(4, 12, '#d8dce2'); })),
    barrelBlown: ol(spr(22, 22, P => { for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; P.ln(11, 11, 11 + Math.cos(a) * 10, 11 + Math.sin(a) * 10, '#3a3a3e', 3); P.ln(11, 11, 11 + Math.cos(a) * 9, 11 + Math.sin(a) * 9, i % 3 ? '#5a1a14' : '#8a2a1a', 1); } P.d(11, 11, 5, 5, '#0a0a0a'); P.d(11, 11, 2, 2, '#ff7a1a'); })),
    crate: ol(spr(18, 18, P => { P.r(0, 0, 18, 18, '#8a5a2a'); for (let y = 1; y < 18; y += 4) { P.r(1, y, 16, 3, '#b07a3a'); P.r(1, y, 16, 1, '#d09a54'); } P.ln(1, 1, 16, 16, '#5a3414', 2); P.r(0, 0, 18, 1, '#6a4018'); })),
    tv: ol(spr(26, 14, P => { P.r(0, 0, 26, 14, '#1a1a1e'); P.r(2, 2, 22, 9, '#2a3a3e'); for (let i = 0; i < 40; i++) P.p(2 + rnd() * 22, 2 + rnd() * 9, rnd() < 0.5 ? '#e8f0f0' : '#7a8a8e'); P.r(0, 12, 26, 2, '#3a3a44'); P.p(23, 12, '#f22'); })),
  };
  function fire(X, x, y, s, t) { for (let i = 0; i < 9; i++) { const a = rnd() * 6.28, d = rnd() * s * 0.5, fx = x + Math.cos(a) * d, fy = y + Math.sin(a) * d, r = s * (0.25 + rnd() * 0.25); X.fillStyle = 'rgba(255,90,20,0.85)'; X.beginPath(); X.ellipse(fx, fy, r, r * 1.4, 0, 0, 6.29); X.fill(); X.fillStyle = 'rgba(255,210,60,0.9)'; X.beginPath(); X.ellipse(fx, fy + r * 0.2, r * 0.55, r * 0.8, 0, 0, 6.29); X.fill(); X.fillStyle = '#fff6c0'; X.fillRect(fx | 0, fy | 0, 2, 2); } for (let i = 0; i < 14; i++) { X.fillStyle = rnd() < 0.5 ? '#ffd040' : '#ff7a1a'; X.fillRect(x + (rnd() - 0.5) * s * 2.4 | 0, y + (rnd() - 0.5) * s * 2.4 | 0, 1, 1); } }
  function scorch(X, x, y, r) { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(8,4,4,0.95)'); g.addColorStop(0.55, 'rgba(20,10,8,0.7)'); g.addColorStop(1, 'rgba(20,10,8,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, 6.29); X.fill(); for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, L = r * (0.8 + rnd() * 0.6); X.strokeStyle = 'rgba(10,6,6,0.75)'; X.lineWidth = 2; X.beginPath(); X.moveTo(x, y); X.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); X.stroke(); } }
  // ================= BLOOD =================
  function splat(X, cx, cy, r, dir, power) {
    power = power || 1; const C1 = '#d00812', C2 = '#9a0410', C3 = '#ff2a2a';
    for (let i = 0; i < 8; i++) { const a = rnd() * 6.28, d = rnd() * r * 0.5, rr = r * (0.3 + rnd() * 0.4); X.fillStyle = i % 3 ? C1 : C2; X.beginPath(); X.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rr, rr * 0.8, a, 0, 6.29); X.fill(); }
    for (let i = 0; i < 14 * power; i++) { const a = (dir === undefined ? rnd() * 6.28 : dir + (rnd() - 0.5) * 1.6), L = r * (1 + rnd() * 1.5 * power), w = 1 + rnd() * 2.5; X.fillStyle = C1; X.beginPath(); X.moveTo(cx + Math.cos(a + 1.57) * w, cy + Math.sin(a + 1.57) * w); X.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); X.lineTo(cx + Math.cos(a - 1.57) * w, cy + Math.sin(a - 1.57) * w); X.fill();
      const ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L; X.beginPath(); X.ellipse(ex, ey, w * 1.1, w * 0.9, a, 0, 6.29); X.fill(); }
    for (let i = 0; i < 30 * power; i++) { const a = (dir === undefined ? rnd() * 6.28 : dir + (rnd() - 0.5) * 2.2), L = r * (1.4 + rnd() * 2.4 * power), s = 1 + (rnd() * 2.5 | 0); X.fillStyle = rnd() < 0.2 ? C3 : (rnd() < 0.5 ? C1 : C2); X.fillRect(cx + Math.cos(a) * L | 0, cy + Math.sin(a) * L | 0, s, s); }
  }
  function pool(X, x0, y0, x1, y1, r) { const n = 7; for (let i = 0; i <= n; i++) { const t = i / n, x = lerp(x0, x1, t), y = lerp(y0, y1, t), rr = r * (0.7 + rnd() * 0.5); X.fillStyle = i % 2 ? '#c00810' : '#d80c16'; X.beginPath(); X.ellipse(x + (rnd() - 0.5) * r, y + (rnd() - 0.5) * r, rr, rr * 0.85, rnd() * 3, 0, 6.29); X.fill(); } X.fillStyle = 'rgba(255,90,90,0.5)'; for (let i = 0; i < 6; i++) X.fillRect(lerp(x0, x1, rnd()) | 0, lerp(y0, y1, rnd()) - 2 | 0, 3, 1); }
  // ================= GORE =================
  const PINK = '#f08aa8', PINKD = '#b84a6e', PINKL = '#ffc8d8', MEAT = '#8a0a14', MEATD = '#4a0208', BONE = '#f4ecdc';
  const brainBlob = (P, x, y, r) => { P.d(x, y, r + 0.8, r * 0.8 + 0.8, PINKD); P.d(x, y, r, r * 0.8, PINK); for (let i = -r + 1; i < r; i += 2) P.ln(x + i, y - r * 0.5, x + i + 1, y + r * 0.4, PINKD, 1); P.p(x - 1, y - 1, PINKL); };
  const guts = (P, pts) => { for (let i = 1; i < pts.length; i++) P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], PINKD, 4); for (let i = 1; i < pts.length; i++) { P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], PINK, 2); P.p(pts[i][0], pts[i][1] - 1, PINKL); } };
  const GIB = {
    brain: ol(spr(12, 10, P => brainBlob(P, 6, 5, 4)), '#5a1020'), brain2: ol(spr(8, 7, P => brainBlob(P, 4, 3, 2.6)), '#5a1020'),
    meat: ol(spr(8, 7, P => { P.d(4, 3, 3.5, 3, MEAT); P.p(3, 2, '#d02030'); P.p(5, 4, MEATD); }), MEATD), bone: ol(spr(10, 5, P => { P.r(2, 2, 6, 1, BONE); P.d(2, 2, 1.6, 1.6, BONE); P.d(8, 2, 1.6, 1.6, BONE); }), '#5a4a3a'),
    skull: ol(spr(8, 6, P => { P.d(4, 3, 3.5, 2.5, BONE); P.p(3, 2, '#fff'); P.r(2, 4, 4, 1, '#c8b8a0'); }), '#5a4a3a'),
  };
  // corpse with gore options: head 'n' | 'burst' | 'off' | 'crush', torso 'n' | 'shot', half, burnt
  function corpse(c0, o) {
    o = o || {}; const c = Object.assign({}, c0);
    if (o.burnt) Object.assign(c, { jacket: '#2a2220', legs: '#1e1a18', skin: '#3a2a22', hair: '#0e0c0c', vest: c.vest ? '#1e1a18' : null, collar: null, helmet: c.helmet ? '#1a1818' : null, visor: '#ff7a1a', pads: c.pads ? '#221e1c' : null, refl: null, hatCol: '#2a2420', boots: '#0e0e0e', glove: '#2a2220', cross: null, tie: null });
    const hv = o.half ? 16 : 0;
    return ol(spr(110, 56, P => {
      const J = c.jacket, Jd = shade(J, 0.66), Jl = shade(J, 1.3), S = c.skin || '#c68a5e', L = c.legs || '#333', Ll = shade(L, 1.4), B = c.boots === '#000' ? '#18181c' : c.boots, F = c.fat ? 1.2 : 1, my = 28, TW = Math.round(10 * F), ox = 4 + hv;
      const limb = (pts, w, col, hl) => { for (let i = 1; i < pts.length; i++) P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], INK, w + 2); for (let i = 1; i < pts.length; i++) { P.ln(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], col, w); if (hl) P.ln(pts[i - 1][0], pts[i - 1][1] - (w >> 1), pts[i][0], pts[i][1] - (w >> 1), hl, 1); } };
      const v = o.v, X = (p) => [p[0] + ox, p[1]], Xl = (p) => [p[0] + 4, p[1]];
      // ---- lower body (shifted away if cut in half)
      const legA = (v ? [[50, my - 5], [37, my - 9], [22, my - 9]] : [[50, my - 5], [36, my - 6], [21, my - 11]]).map(Xl);
      const legB = (v ? [[50, my + 5], [38, my + 10], [26, my + 16]] : [[50, my + 5], [36, my + 7], [22, my + 9]]).map(Xl);
      limb(legA, 7, L, Ll); limb(legB, 7, L, Ll);
      for (const lg of [legA, legB]) { const p = lg[lg.length - 1]; P.d(p[0] - 1, p[1], 4.6, 4.2, INK); P.d(p[0] - 1, p[1], 3.6, 3.2, B); P.r(p[0] - 4, p[1] - 1, 1, 3, shade(B === '#18181c' ? '#444' : B, 1.4)); P.r(p[0] - 2, p[1] - 2, 2, 1, shade(B === '#18181c' ? '#444' : B, 1.8)); }
      P.r(51, my - 8, 5, 16, INK); P.r(52, my - 7, 4, 14, '#1c1c1c'); P.r(53, my - 2, 2, 3, o.burnt ? '#5a4a2a' : '#d8b048'); P.r(51, my - 1, 1, 2, '#4a4a4a');
      if (o.half) { P.d(56, my, 3, 8, INK); P.d(56, my, 2, 7, MEAT); P.r(56, my - 4, 1, 8, '#d02030'); P.p(56, my, BONE); }
      // ---- upper body
      const armA = (v ? [[71, my - TW + 1], [77, my - TW - 7], [86, my - TW - 9]] : [[71, my - TW + 1], [63, my - TW - 6], [55, my - TW - 9]]).map(X);
      const armB = (v ? [[71, my + TW - 1], [62, my + TW + 5], [54, my + TW + 7]] : [[71, my + TW - 1], [77, my + TW + 7], [85, my + TW + 9]]).map(X);
      limb(armA, 5, J, Jl); limb(armB, 5, J, Jl);
      for (const a of [armA, armB]) { const p = a[a.length - 1], q = a[a.length - 2], dx = p[0] - q[0], dy = p[1] - q[1], Ln = Math.hypot(dx, dy) || 1; if (c.collar && c.collar !== '#141418' && !c.vest) { P.d(p[0] - dx / Ln * 3, p[1] - dy / Ln * 3, 2.6, 2.6, INK); P.d(p[0] - dx / Ln * 3, p[1] - dy / Ln * 3, 1.8, 1.8, c.collar); } P.d(p[0], p[1], 3.4, 3.4, INK); P.d(p[0], p[1], 2.6, 2.6, c.glove || S); P.p(p[0] + dx / Ln * 2, p[1] + dy / Ln * 2 - 1, shade(c.glove || S, 0.7)); P.p(p[0] - 1, p[1] - 1, shade(c.glove || S, 1.3)); }
      for (let x = 51; x <= 75; x++) { const t = (x - 51) / 24, hw = Math.round(lerp(7 * F, TW, Math.min(1, t * 1.6)) - (x > 73 ? 2 : 0)); P.r(x + ox, my - hw - 1, 1, hw * 2 + 2, INK); P.r(x + ox, my - hw, 1, hw * 2, J); P.p(x + ox, my - hw, Jl); P.p(x + ox, my + hw - 1, Jd); }
      P.ln(58 + ox, my - TW + 2, 64 + ox, my - TW + 5, Jd, 1); P.ln(58 + ox, my + TW - 2, 64 + ox, my + TW - 5, Jd, 1);
      if (c.vest) { P.r(55 + ox, my - 6 * F, 15, 12 * F, INK); P.r(56 + ox, my - 5 * F, 13, 10 * F, c.vest); P.r(56 + ox, my - 5 * F, 13, 1, shade(c.vest, 1.3)); if (c.pouches) for (const y of [-4, 1]) { P.r(57 + ox, my + y, 3, 3, shade(c.vest, 0.7)); P.r(62 + ox, my + y, 3, 3, shade(c.vest, 0.7)); } }
      else { const sh = c.collar && c.collar !== '#141418' ? c.collar : '#e0dccc'; P.r(62 + ox, my - 3, 12, 6, sh); P.ln(74 + ox, my - 5, 61 + ox, my - 1, INK, 1); P.ln(74 + ox, my + 5, 61 + ox, my + 1, INK, 1); P.r(70 + ox, my - 1, 4, 2, shade(sh, 0.8)); if (c.tie) { P.r(60 + ox, my - 1, 12, 2, c.tie); P.p(71 + ox, my - 1, shade(c.tie, 1.4)); } if (c.cross) { P.r(57 + ox, my - 1, 5, 2, c.cross); P.r(58 + ox, my - 2, 2, 4, c.cross); } }
      if (c.refl) { P.r(57 + ox, my - TW + 1, 2, 2 * TW - 2, c.refl); P.r(66 + ox, my - TW + 1, 2, 2 * TW - 2, c.refl); }
      if (c.pads) for (const y of [my - TW + 2, my + TW - 2]) { P.d(72 + ox, y, 4, 3.4, INK); P.d(72 + ox, y, 3, 2.6, c.pads); P.p(71 + ox, y - 1, shade(c.pads, 1.6)); }
      if (o.half) { P.d(51 + ox, my, 3, 8, INK); P.d(51 + ox, my, 2.2, 7, MEAT); P.r(50 + ox, my - 3, 1, 6, '#d02030'); guts(P, [[50 + ox, my - 2], [44 + ox, my - 7], [38 + ox, my - 4], [40 + ox, my + 2]]); guts(P, [[50 + ox, my + 3], [45 + ox, my + 8]]); P.p(51 + ox, my, BONE); }
      if (o.torso === 'shot') { const tx = 63 + ox; P.d(tx, my, 8, 6, INK); P.d(tx, my, 7, 5.2, MEATD); P.d(tx + 1, my - 1, 5, 3.6, MEAT); for (const dy of [-3, 0, 3]) P.ln(tx - 3, my + dy, tx + 4, my + dy - 1, BONE, 1); guts(P, [[tx - 2, my + 2], [tx - 7, my + 8], [tx - 2, my + 13], [tx + 5, my + 12]]);
        for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; P.p(tx + Math.cos(a) * 8.5, my + Math.sin(a) * 6.5, i % 2 ? J : INK); } for (const [x, y] of [[57, -6], [69, 6], [60, 7], [70, -7]]) { P.d(x + ox, my + y, 1.4, 1.4, MEATD); P.p(x + ox, my + y, '#d02030'); } }
      // ---- head
      const hx = 82 + ox, HR = 7;
      const face = () => { P.d(hx, my, HR + 1, HR + 1, INK); P.d(hx, my, HR, HR, S); P.d(hx + 3.5, my, HR - 3, HR + 0.3, c.hair || '#2a1a12'); if (c.hairStyle === 'pony') { P.d(hx + HR + 3, my - 3, 3.4, 2.6, INK); P.d(hx + HR + 3, my - 3, 2.6, 1.8, c.hair); }
        if (c.shades) { P.r(hx - 1, my - 4, 2, 3, c.shades); P.r(hx - 1, my + 1, 2, 3, c.shades); } else { P.r(hx - 1, my - 3, 1, 2, INK); P.r(hx - 1, my + 1, 1, 2, INK); } P.r(hx - 4, my - 1, 2, 2, shade(S, 0.68)); P.r(hx - 6, my - 2, 1, 4, '#7a1010'); P.p(hx - 6, my - 1, BONE); };
      if (o.head === 'off') { P.d(hx - 6, my, 4, 4.5, INK); P.d(hx - 6, my, 3, 3.5, MEAT); P.d(hx - 6, my, 1.6, 1.6, '#d02030'); P.p(hx - 6, my, BONE); P.p(hx - 5, my, BONE); }
      else if (o.head === 'crush') { for (let i = 0; i < 7; i++) { const a = rnd() * 6.28, d = rnd() * 6; P.d(hx + 2 + Math.cos(a) * d, my + Math.sin(a) * d * 1.3, 3, 2.4, i % 2 ? MEAT : '#c01020'); } for (let i = 0; i < 6; i++) P.p(hx + (rnd() - 0.3) * 12, my + (rnd() - 0.5) * 14, c.hair || '#2a1a12'); brainBlob(P, hx + 3, my - 3, 2.4); P.p(hx - 1, my + 2, BONE); P.p(hx + 1, my + 4, BONE); P.p(hx + 4, my + 3, '#fff'); }
      else if (c.hat === 'helmet' && o.head !== 'burst') { P.d(hx, my, HR + 1.6, HR + 1.6, INK); P.d(hx, my, HR + 0.6, HR + 0.6, c.helmet); P.r(hx - 3, my - 5, 3, 10, INK); P.r(hx - 2, my - 4, 2, 8, c.visor); P.d(hx + 2, my - 3, 2, 1.4, shade(c.helmet, 1.6)); }
      else if (c.hat === 'hood' && o.head !== 'burst') { P.d(hx, my, HR + 1.8, HR + 1.8, INK); P.d(hx, my, HR + 0.8, HR + 0.8, c.hood); P.d(hx - 1, my, HR - 2, HR - 2.4, '#18140e'); P.p(hx - 2, my - 2, c.goggles); P.p(hx - 2, my + 2, c.goggles); }
      else { if (c.hat === 'hard' && !o.burnt) { P.d(hx + 12, my + 9, 5, 5, INK); P.d(hx + 12, my + 9, 4, 4, c.hatCol); P.p(hx + 11, my + 7, '#fff6c8'); } face(); }
      if (o.head === 'burst') { // skull blown open at the crown: brain spilling out
        P.d(hx + 4, my, 5.5, 6.5, INK); P.d(hx + 4, my, 4.6, 5.6, MEAT); P.d(hx + 5, my, 3, 4, '#d02030');
        brainBlob(P, hx + 6, my - 2, 3.2); brainBlob(P, hx + 9, my + 3, 2.6); brainBlob(P, hx + 12, my - 1, 2.2);
        for (const [dx, dy] of [[1, -6], [2, 6], [7, -5], [6, 6], [10, -4]]) P.p(hx + dx, my + dy, BONE); P.p(hx + 1, my - 5, '#fff');
      }
      if (o.burnt) { for (let i = 0; i < 26; i++) P.p(30 + rnd() * 70, my - 12 + rnd() * 24, rnd() < 0.5 ? '#ff7a1a' : (rnd() < 0.5 ? '#ffd040' : '#3a3a3a')); }
      else if (!o.torso) for (const [x, y, r] of [[60, my - 3, 3], [67, my + 4, 2.2]]) { P.d(x + ox, y, r + 0.6, r + 0.6, MEATD); P.d(x + ox, y, r, r, '#b00a14'); P.p(x + ox - 1, y - 1, '#ff4a50'); }
    }));
  }
  // severed head (face up, stump at -x)
  function head(c) { return ol(spr(22, 20, P => { const S = c.skin || '#c68a5e', hx = 11, my = 10, HR = 7; if (c.hat === 'helmet') { P.d(hx, my, HR + 0.6, HR + 0.6, c.helmet); P.r(hx - 2, my - 4, 2, 8, c.visor); P.d(hx + 2, my - 3, 2, 1.4, shade(c.helmet, 1.6)); } else { P.d(hx, my, HR, HR, S); P.d(hx + 3.5, my, HR - 3, HR + 0.3, c.hair); P.r(hx - 1, my - 3, 1, 2, INK); P.r(hx - 1, my + 1, 1, 2, INK); P.r(hx - 4, my - 1, 2, 2, shade(S, 0.68)); } P.d(hx - 6, my, 2.4, 4.4, MEAT); P.r(hx - 7, my - 2, 2, 4, '#d02030'); P.p(hx - 7, my, BONE); })); }
  window.HME = { pool, bigText, FLOOR, wallH, wallV, post, windowV, shards, neonDots, PROP, fire, scorch, splat, GIB, corpse, head, rnd: () => rnd(), reseed: s => { seed = s; } };
})();
