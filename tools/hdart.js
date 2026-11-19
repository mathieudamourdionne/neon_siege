// HD art prototype (2x pixel density): characters with real proportions + outlines, weapons with readable shapes
(function () {
  const OL = '#08080c';
  // dark 1px outline around everything opaque (reads cleanly on any floor)
  function outline(c, col) {
    const x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H), a = d.data, o = new Uint8ClampedArray(a), rgb = [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
    for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) { const k = (y * W + i) * 4; if (a[k + 3] > 0) continue; let n = false; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = i + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H && a[(Y * W + X) * 4 + 3] > 0) { n = true; break; } } if (n) { o[k] = rgb[0]; o[k + 1] = rgb[1]; o[k + 2] = rgb[2]; o[k + 3] = 255; } }
    x.putImageData(new ImageData(o, W, H), 0, 0); return c;
  }
  const sprO = (w, h, fn, ol) => outline(spr(w, h, fn), ol || OL);
  function rrect(P, x, y, w, h, r, col) { for (let j = 0; j < h; j++) { const dy = Math.min(j, h - 1 - j), ins = dy < r ? Math.round(r - Math.sqrt(Math.max(0, r * r - (r - dy - 0.5) ** 2))) : 0; P.r(x + ins, y + j, w - ins * 2, 1, col); } }
  // ---------- weapons: 32x12, pointing +x, grip at x~4 ----------
  const WD = {
    knife: P => { P.r(2, 5, 6, 3, '#4a2e1c'); P.p(3, 6, '#6a4228'); P.r(8, 3, 2, 7, '#aab2bc'); for (let i = 0; i < 10; i++) { const h = i < 7 ? 3 : 3 - (i - 6); P.r(10 + i, 5 + (3 - h) / 2 | 0, 1, Math.max(1, h), '#dfe6ee'); } P.r(10, 5, 9, 1, '#ffffff'); },
    pipe: P => { P.r(2, 5, 24, 3, '#7a828c'); P.r(2, 5, 24, 1, '#aab2bc'); P.r(9, 4, 3, 5, '#5a626b'); P.r(19, 4, 3, 5, '#5a626b'); P.p(14, 7, '#8a5a3a'); P.p(24, 6, '#8a5a3a'); },
    machete: P => { P.r(2, 5, 7, 3, '#1a1a1a'); P.p(4, 6, '#333'); P.r(9, 4, 1, 5, '#555'); P.r(10, 3, 14, 5, '#c8ced6'); P.r(24, 4, 2, 4, '#c8ced6'); P.r(10, 7, 15, 1, '#ffffff'); P.r(10, 3, 13, 1, '#8a9099'); },
    katana: P => { for (let i = 0; i < 8; i++) P.p(2 + i, 6, i % 2 ? '#e8e8e8' : '#1a1a1a'); P.r(2, 5, 8, 1, '#111'); P.r(2, 7, 8, 1, '#111'); P.r(10, 3, 2, 7, '#c8a040'); P.r(12, 5, 17, 2, '#d8dee6'); P.r(12, 5, 17, 1, '#ffffff'); P.p(29, 5, '#ffffff'); },
    saw: P => { P.r(2, 5, 9, 3, '#3a3a3a'); P.d(17, 6, 5.5, 5.5, '#ff8a1c'); P.d(17, 6, 4, 4, '#c8c8c8'); P.d(17, 6, 1.5, 1.5, '#444'); for (let a = 0; a < 6.28; a += 0.8) P.p(17 + Math.cos(a) * 6, 6 + Math.sin(a) * 6, '#ffd040'); },
    pistol: P => { P.r(3, 6, 3, 5, '#2a2d33'); P.r(2, 4, 12, 3, '#3a3e46'); P.r(2, 4, 12, 1, '#5a5e66'); P.r(6, 7, 3, 2, '#1a1a1a'); P.p(13, 5, '#111'); P.p(5, 5, '#4ff'); },
    smart: P => { P.r(3, 6, 3, 5, '#1e2a3a'); P.r(2, 3, 13, 4, '#2e3a4e'); P.r(2, 3, 13, 1, '#4a5a6e'); P.r(5, 4, 5, 1, '#3ff'); P.r(14, 4, 2, 2, '#111'); P.r(6, 7, 3, 2, '#1a1a1a'); },
    revolver: P => { P.r(2, 6, 3, 5, '#5a3a22'); P.r(4, 4, 4, 4, '#8a8f99'); P.p(5, 5, '#c8ccd2'); P.r(8, 5, 8, 2, '#9aa0a8'); P.r(8, 5, 8, 1, '#d8dce2'); P.p(15, 4, '#9aa0a8'); P.p(3, 5, '#ffe14d'); },
    nailer: P => { P.r(3, 6, 4, 5, '#2a2a2a'); P.r(2, 3, 12, 5, '#d8b21c'); P.r(2, 3, 12, 1, '#f0d040'); P.r(14, 5, 4, 2, '#222'); P.r(7, 8, 5, 2, '#888'); },
    smg: P => { P.r(2, 5, 5, 3, '#2a2a2a'); P.r(7, 3, 8, 6, '#33363d'); P.r(7, 3, 8, 1, '#5a5e66'); for (const y of [4, 6, 8]) P.r(15, y - 1, 10, 1, '#4a4e56'); P.r(15, 3, 2, 6, '#ff8a1c'); P.r(9, 9, 3, 3, '#222'); },
    pump: P => { P.r(1, 5, 6, 4, '#7a4a2a'); P.r(1, 5, 6, 1, '#9a6a44'); P.r(7, 4, 6, 4, '#3a3d44'); P.r(13, 5, 15, 2, '#4a4e56'); P.r(13, 5, 15, 1, '#7a7e86'); P.r(15, 7, 7, 2, '#8a5a34'); P.r(8, 8, 2, 2, '#222'); },
    twin: P => { P.r(1, 5, 7, 4, '#8a5a2a'); P.r(1, 5, 7, 1, '#aa7a4a'); P.r(8, 4, 4, 5, '#2a2a2a'); P.r(12, 4, 14, 2, '#3a3a3a'); P.r(12, 6, 14, 2, '#3a3a3a'); P.r(12, 4, 14, 1, '#6a6a6a'); P.r(12, 6, 14, 1, '#5a5a5a'); },
    rifle: P => { P.r(1, 5, 7, 4, '#3a4a2e'); P.r(8, 4, 8, 4, '#2e3a2e'); P.r(16, 5, 14, 2, '#2a2a2a'); P.r(9, 2, 8, 2, '#111'); P.p(16, 2, '#ff3b4e'); P.r(10, 8, 2, 3, '#222'); },
    belt: P => { P.r(1, 4, 6, 5, '#26262a'); P.r(7, 3, 9, 6, '#3a3a40'); P.r(7, 3, 9, 1, '#5a5a62'); P.r(16, 4, 13, 3, '#2a2a2e'); for (let x = 17; x < 28; x += 3) P.p(x, 5, '#111'); for (let i = 0; i < 5; i++) P.r(9 + i * 2, 9 + (i % 2), 1, 2, '#c8a040'); },
    rail: P => { P.r(1, 5, 7, 4, '#2e3a4a'); P.r(8, 3, 6, 6, '#3a4a5e'); P.r(14, 5, 15, 2, '#5a6a7e'); for (let x = 15; x < 28; x += 4) P.r(x, 3, 2, 6, '#3ff'); P.r(8, 3, 6, 1, '#6a7a8e'); },
    rocket: P => { P.r(2, 4, 24, 5, '#3a4a2e'); P.r(2, 4, 24, 1, '#5a6a44'); P.r(26, 3, 3, 7, '#2a2a2a'); P.r(27, 5, 3, 3, '#ff3b4e'); P.r(8, 9, 2, 3, '#222'); P.r(14, 9, 2, 2, '#222'); },
    frag: P => { P.d(14, 6, 4.5, 5, '#2e4a22'); for (let y = 2; y < 11; y += 2) P.r(10, y, 9, 1, '#3e5e2e'); P.r(13, 0, 3, 2, '#888'); P.p(17, 1, '#ccc'); },
    emp: P => { P.r(10, 2, 9, 9, '#1e3a6a'); P.r(10, 2, 9, 1, '#3a5a8a'); P.r(10, 6, 9, 1, '#3ff'); P.r(12, 0, 5, 2, '#888'); },
  };
  WD.knives = WD.knife;
  const HDW = {}; for (const k in WD) HDW[k] = sprO(32, 12, WD[k]);
  // ---------- characters: 48x48, facing +x, centre 24,24 ----------
  // ---------- characters v3: 72x72 canvas (2 px per world px), centre 36, facing +x ----------
  const INK = '#0c0b10', CV = 72, C = 36;
  function hdLegs(c, f) {
    return sprO(CV, CV, P => {
      const B = c.boots === '#000' ? '#161616' : c.boots, Bh = shade(B === '#161616' ? '#333' : B, 1.9), L = c.legs || '#333', K = c.kid ? 0.74 : 1, F = c.fat ? 1.25 : 1;
      const s = f === 8 ? 0 : Math.sin(f / 8 * Math.PI * 2), fy = 4.5 * K * F;
      const foot = (fx, y) => { P.ln(C - 2, y, fx - 2, y, INK, 5); P.ln(C - 2, y, fx - 2, y, L, 3); P.d(fx, y, 3.6 * K, 2.6 * K, INK); P.d(fx, y, 2.8 * K, 1.8 * K, B); P.p(fx + 1, y - 1, Bh); };
      const a = f === 8 ? C + 3 : C + 1 + s * 8 * K, b = f === 8 ? C + 1 : C + 1 - s * 8 * K;
      foot(Math.round(a), Math.round(C - fy)); foot(Math.round(b), Math.round(C + fy));
    });
  }
  function hdBody(c, k, f) {
    const W = k && WEAPONS[k];
    return sprO(CV, CV, P => {
      const J = c.jacket, Jd = shade(J, 0.6), Jl = shade(J, 1.35), S = c.skin || '#c68a5e', G = c.glove || S, K = c.kid ? 0.74 : 1, F = c.fat ? 1.3 : 1;
      const SH = Math.round(11 * K * F), x0 = C - Math.round(6 * F * K), x1 = C + Math.round(4 * K), R = Math.round(3.5 * K * F), mx = (x0 + x1) / 2, hd = (x1 - x0) / 2;
      const s = f === 8 ? 0 : Math.sin(f / 8 * Math.PI * 2);
      // coat tails / long hair go under the torso
      if (c.coat) { P.d(x0 - 1, C, 4, SH - 1, INK); P.d(x0 - 1, C, 3, SH - 2, shade(J, 0.8)); }
      // torso: stadium shape across the shoulders
      const torso = (col, g) => { P.r(x0 - g, C - SH + R, x1 - x0 + 2 * g, 2 * (SH - R), col); P.d(mx, C - SH + R, hd + g, R + g, col); P.d(mx, C + SH - R, hd + g, R + g, col); };
      torso(J, 0);
      P.r(x0, C - SH + R, 2, 2 * (SH - R), Jd); P.d(mx - 0.5, C - SH + R - 1, hd - 1.5, R - 1.5, Jl); P.d(mx - 0.5, C + SH - R - 1, hd - 1.5, R - 2, shade(J, 1.15));
      if (c.vest) { P.r(x0 + 1, C - SH + R - 1, x1 - x0 - 2, 2 * (SH - R) + 2, c.vest); P.r(x0 + 1, C - SH + R - 1, 1, 2 * (SH - R) + 2, shade(c.vest, 0.7)); for (const y of [C - 4, C + 3]) P.r(x0 + 2, y, x1 - x0 - 4, 1, shade(c.vest, 0.75)); }
      if (c.stripe && !c.vest && !c.coat && !c.refl) P.r(x0 + 1, C - SH + R, 2, 2 * (SH - R), c.stripe);
      if (c.refl) { P.r(x0 + 1, C - SH + 3, 2, 2 * SH - 6, '#f4f0d0'); P.r(x1 - 2, C - SH + 3, 1, 2 * SH - 6, '#f4f0d0'); }
      if (c.cross) { P.r(x0 - 1, C - 3, 5, 7, INK); P.r(x0, C - 2, 3, 5, '#2fd070'); P.r(x0 - 1, C - 1, 5, 3, INK); P.r(x0, C - 1, 3, 3, '#2fd070'); P.r(x0 - 1 + 1, C - 1, 3, 3, '#2fd070'); }
      if (c.pads) for (const y of [C - SH + R - 1, C + SH - R + 1]) { P.d(mx, y, hd + 0.5, R + 1, INK); P.d(mx - 0.5, y, hd - 0.5, R, c.pads); P.r(mx - 3, y - 1, 4, 1, shade(c.pads, 1.5)); }
      // arms + weapon
      const Ls = [C - 1, C - SH + 3], Rs = [C - 1, C + SH - 3];
      let la, ra, gun = null, wa = 0;
      if (!W) { la = [C + 6 + s * 3, C - SH + 2]; ra = [C + 6 - s * 3, C + SH - 2]; }
      else if (W.melee) { ra = [C + 9, C + SH - 3]; la = [C + 5 + s * 2, C - SH + 2]; wa = -0.55; }
      else if (W.two) { gun = [C + 1, C - 3]; ra = [C + 9, C + 5]; la = [C + 19, C + 4]; }
      else { ra = [C + 13, C + 4]; la = [C + 4 + s * 2, C - SH + 2]; gun = [C + 9, C - 2]; }
      const arm = (sh, h) => { P.ln(sh[0], sh[1], h[0], h[1], INK, 5); P.ln(sh[0], sh[1], h[0], h[1], shade(J, 0.85), 3); P.ln(sh[0], sh[1] - 0.6, h[0] - 1, h[1] - 0.6, Jl, 1); };
      const Gd = G === '#1c1c22' || G === '#111' || G === '#222' ? '#34343e' : G, hand = h => { P.d(h[0], h[1], 2.6, 2.6, INK); P.d(h[0], h[1], 1.8, 1.8, Gd); P.p(h[0] - 1, h[1] - 1, shade(Gd, 1.5)); };
      const x = P.x;
      arm(Ls, la);
      if (W && HDW[k]) { x.save(); x.imageSmoothingEnabled = false; if (W.melee) { x.translate(Math.round(ra[0]), Math.round(ra[1])); x.rotate(wa); x.drawImage(HDW[k], -4, -6); } else { x.translate(gun[0], gun[1]); x.drawImage(HDW[k], 0, 0); } x.restore(); }
      arm(Rs, ra); hand(la); hand(ra);
      // head
      const HR = 4.3 * K * (c.fat ? 1.1 : 1), hx = C + 1, hy = C;
      if (c.longhair) { P.d(hx - HR - 2, hy + 1, 4.5, 3.5, INK); P.d(hx - HR - 2, hy + 1, 3.5, 2.5, c.hair); P.p(hx - HR - 3, hy, shade(c.hair, 1.5)); }
      if (c.helmet && !c.hood) {
        P.d(hx, hy, HR + 1.4, HR + 1.4, INK); P.d(hx, hy, HR + 0.4, HR + 0.4, c.visor); P.d(hx - 1.3, hy, HR, HR + 0.4, c.helmet);
        P.d(hx - 2.2, hy - 1.6, HR - 3, HR - 3.4, shade(c.helmet, 1.5)); P.r(hx - HR, hy, HR, 1, shade(c.helmet, 0.75)); P.p(hx + HR, hy - 2, '#ffffff');
      } else if (c.hood) {
        P.d(hx - 0.5, hy, HR + 2, HR + 2, INK); P.d(hx - 0.5, hy, HR + 1, HR + 1, c.hood); P.d(hx - 1.5, hy - 1, HR - 1.5, HR - 1.8, shade(c.hood, 1.3));
        P.r(hx + HR - 1, hy - 3, 2, 2, c.goggles); P.r(hx + HR - 1, hy + 1, 2, 2, c.goggles); P.p(hx + HR, hy - 3, '#fff');
      } else if (c.hat) {
        P.d(hx, hy, HR + 2.2, HR + 2.2, INK); P.d(hx + 1, hy, HR + 1.2, HR + 1.2, shade(c.hat, 0.78)); P.d(hx - 0.3, hy, HR + 0.9, HR + 1, c.hat);
        P.r(hx - HR, hy - 1, 2 * HR + 1, 2, shade(c.hat, 1.3)); P.d(hx - 2, hy - 2.5, 1.6, 1.2, '#fff6c0');
      } else {
        P.d(hx, hy, HR + 1.2, HR + 1.2, INK); P.d(hx, hy, HR, HR, S); P.d(hx - 1.6, hy, HR - 0.1, HR + 0.2, c.hair);
        P.d(hx - 2.6, hy - 1.6, HR - 3, HR - 3.2, shade(c.hair, c.hair === '#d8d8d8' ? 1.15 : 1.9));
        if (c.eyes) { P.p(hx + HR - 1, hy - 2, c.eyes); P.p(hx + HR - 1, hy + 1, c.eyes); }
        if (c.implant) { P.p(hx - 1, hy - HR + 1, c.implant); P.p(hx, hy - HR + 1, c.implant); }
      }
    });
  }
  // HD looks per character (same palettes, more detail)
  const HDC = {
    player: {}, grd: { vest: '#36425a', glove: '#1c1c22' }, brc: { pads: '#5c1c22', glove: '#1c1c22' }, cln: {}, wkr: { hat: '#f0c020', refl: 1, glove: '#6a4a2a', jacket: '#e8862a' },
    fat: { pads: '#4a4e58', vest: '#4e525c', glove: '#222' }, snp: { hood: '#2e3a2e', goggles: '#5dff9a', glove: '#111' }, rio: { vest: '#1a2028' }, hdl: {}, tec: { cross: 1, coat: 1 },
    nadia: { longhair: 1 }, kid: { kid: 1 }, guest2: { longhair: 1 }, twin: { pads: '#1a1a1a' },
  };
  window.HD = { outline, HDW, hdLegs, hdBody, CV, charOf: k => Object.assign({}, CHARS[k], HDC[k] || {}), rrect, sprO };
})();
