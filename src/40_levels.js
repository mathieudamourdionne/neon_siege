// ---------- Act 1 levels (from the design doc), top-down ----------
const LEVELS = [
  {
    name: 'HOLDING', sub: 'ORISON DETENTION CENTER - 02:00', par: 160, music: 0, bgHue: 300,
    msg: { who: 'BLOCK D - 02:00', text: "THE CAMERAS IN YOUR BLOCK JUST WENT DARK.\n\nFOOTSTEPS IN THE CORRIDOR. THEY'RE COMING TO STAGE YOUR SUICIDE.\n\nYOU WERE ORISON'S CLEANER. YOU KNOW EXACTLY HOW THIS GOES.\nTHEY DON'T." },
    floors: [
      { name: 'CELL BLOCK D', w: 62, h: 36, wall: ['#d8d0c0', '#fff7e6'], tip: 'FISTS KNOCK THEM DOWN - SPACE TO GET ON THEM, CLICK TO SMASH', build(b) {
        b.r(4, 18, 52, 4, 'lino');
        for (const x0 of [6, 15, 24, 33, 42]) { b.r(x0, 9, 8, 8, 'cell'); b.d(x0 + 3, 17, 'h'); b.o('bed', x0 + 5, 10).o('toilet', x0 + 1, 10).o('sink', x0 + 1, 12); }
        b.r(4, 23, 16, 10, 'conc').d(10, 22, 'h').o('desk', 6, 25).o('desk', 13, 25).o('locker', 18, 24).o('locker', 18, 28).o('plant', 4, 31);
        b.t(7, 30, "SHIFT ORDER 02:00 - CAMERAS OFFLINE, BLOCK D.\nINMATE 4471 TO BE FOUND HANGED.\nCAUSE OF DEATH: SUICIDE.\n- ORISON CUSTODY SERVICES", 'GUARD TERMINAL');
        b.r(21, 23, 16, 10, 'tile').d(27, 22, 'h'); for (let x = 22; x < 37; x += 3) b.o('shower', x, 24); b.o('bench', 24, 30).o('bench', 30, 30);
        b.r(38, 23, 12, 10, 'wood').d(42, 22, 'h').o('sofa', 40, 24).o('table', 44, 28).o('plant', 48, 24).o('plant', 38, 31);
        b.r(57, 16, 4, 8, 'stairs').d(56, 19, 'v', 0, 'conc').ex(57, 16, 4, 8, 'STAIRS');
        b.st(8, 12, 'd');
        b.e('grd', 16, 20, 'pipe', 'r', { p: [[16, 20], [30, 20], [30, 19], [12, 19]] });
        b.e('grd', 46, 19, 'pistol', 'u').e('grd', 27, 12, 'pipe', 'u');
        b.e('grd', 8, 27, 'pistol', 'u').e('grd', 15, 30, 'pipe', 'l');
        b.e('grd', 31, 27, 'machete', 'l').e('grd', 35, 25, null, 'd');
        b.e('grd', 41, 27, 'pistol', 'r').e('grd', 46, 31, 'pipe', 'u');
        b.i('pipe', 18, 13).i('machete', 37, 13).i('pistol', 15, 27);
      } },
      { name: 'ADMINISTRATION', w: 60, h: 40, wall: ['#c9d6e3', '#f4fbff'], build(b) {
        // stairs -> security lobby -> corridor split by a gate door, so nothing can shoot you the moment you arrive
        b.r(2, 18, 4, 6, 'stairs').st(3, 20, 'r');
        b.r(7, 18, 8, 7, 'conc').d(6, 20, 'v', 0, 'conc').o('locker', 7, 18).o('vend', 11, 18).o('plant', 13, 23);
        b.r(16, 19, 13, 4, 'conc').d(15, 20, 'v', 0, 'conc').r(30, 19, 23, 4, 'conc').d(29, 20, 'v', 0, 'conc');
        b.r(7, 4, 24, 13, 'wood').d(10, 17, 'h').d(24, 18, 'h').o('ltable', 9, 7).o('ltable', 20, 7).o('shelf', 9, 12).o('shelf', 20, 12).o('pillar', 15, 9);
        b.r(32, 4, 20, 14, 'carpet').d(31, 10, 'v').d(40, 18, 'h').o('desk', 44, 8).o('sofa', 34, 5).o('plant', 50, 5).o('plant', 50, 16).o('locker', 32, 14).o('shelf', 36, 12);
        b.t(47, 8, "WARDEN'S MAIL:\nTHE CLEANER IN 4471 IS A LOOSE END.\nTHE FOOTAGE IS ALREADY ON EVERY CHANNEL.\nMAKE IT LOOK LIKE GUILT.", 'WARDEN TERMINAL');
        b.r(7, 26, 14, 10, 'conc').d(13, 25, 'h'); for (let x = 8; x < 20; x += 2) b.o('locker', x, 34); b.o('crate', 17, 27).o('bench', 9, 30);
        b.r(22, 24, 30, 13, 'asph').d(34, 23, 'h').o('van', 42, 30).o('barrels', 24, 33).o('crate', 30, 26).o('crate', 46, 25).o('pillar', 37, 27).ex(41, 33, 8, 3, 'THE VAN');
        b.e('grd', 21, 21, null, 'r', { p: [[21, 21], [27, 21], [27, 20], [17, 20]] });
        b.e('grd', 14, 10, 'pipe', 'r').e('grd', 26, 14, 'pistol', 'l').e('grd', 28, 5, 'machete', 'd');
        b.e('grd', 36, 7, 'pistol', 'r').e('brc', 48, 11, 'pump', 'l');
        b.e('grd', 44, 21, 'pipe', 'l', { p: [[44, 21], [33, 21]] });
        b.e('grd', 10, 28, 'pistol', 'u').e('grd', 18, 31, 'pipe', 'l');
        b.e('grd', 26, 29, 'pistol', 'd').e('grd', 39, 34, 'smg', 'u').e('grd', 50, 28, 'pipe', 'l');
        b.i('pipe', 9, 23).i('pistol', 12, 32);
      } }
    ]
  },
  {
    name: 'BLOCK C', sub: 'ORISON DETENTION CENTER - WEST WING', par: 200, music: 1, bgHue: 190,
    msg: { who: 'RADIO STATIC', text: "A WOMAN'S VOICE ON A STOLEN GUARD RADIO:\n\n'...WITNESS REN IS IN BLOCK C. CLEANER TEAM, FIFTEEN MINUTES. NO SURVIVORS.'\n\nSOMEONE ELSE ORISON WANTS DEAD.\nGET TO HER FIRST." },
    floors: [
      { name: 'MESS HALL', w: 60, h: 40, wall: ['#e6c8a8', '#fff0de'], tip: 'TALL STUFF (LOCKERS, PILLARS, COUNTERS) STOPS BULLETS. TABLES DO NOT.', build(b) {
        // you come up into the kitchen, not into the hall; pillars break up the hall
        b.r(2, 30, 4, 6, 'stairs').st(3, 32, 'r');
        b.r(7, 27, 16, 10, 'tile').d(6, 32, 'v', 0, 'tile').o('counter', 9, 29).o('counter', 9, 33).o('shelf', 18, 35).o('sink', 21, 28).o('sink', 21, 29).o('plant', 7, 35);
        b.t(16, 30, "TRANSFER ORDER: WITNESS N. REN\nBLOCK C - INTERROGATION, UPSTAIRS.\nCLEANER TEAM ETA 15 MIN.", 'KITCHEN TERMINAL');
        b.r(7, 10, 40, 16, 'check').d(15, 26, 'h', 0, 'tile');
        for (const [x, y] of [[15, 13], [26, 13], [37, 13], [15, 20], [26, 20], [37, 20]]) b.o('pillar', x, y);
        for (const [x, y] of [[9, 16], [19, 11], [30, 16], [19, 23], [40, 11], [40, 23]]) b.o('ltable', x, y);
        b.r(7, 2, 16, 7, 'tile').d(14, 9, 'h').o('sink', 21, 2).o('sink', 21, 3).o('locker', 7, 2);
        b.r(24, 2, 23, 7, 'conc').d(34, 9, 'h').d(23, 4, 'v'); for (let x = 25; x < 46; x += 2) b.o('locker', x, 2); b.o('bench', 28, 6).o('bench', 38, 6);
        b.r(48, 10, 9, 16, 'cell').d(47, 13, 'v').d(47, 21, 'v').o('bed', 54, 10).o('bed', 54, 20).o('toilet', 49, 10).o('toilet', 49, 24);
        b.r(48, 27, 6, 6, 'stairs').d(50, 26, 'h', 0, 'cell').ex(49, 28, 4, 4, 'STAIRS');
        b.e('grd', 19, 31, 'machete', 'u').e('grd', 12, 35, null, 'r');
        b.e('grd', 31, 11, 'pistol', 'd').e('grd', 9, 18, 'pipe', 'r', { p: [[9, 18], [44, 18]] }).e('brc', 44, 21, 'pump', 'l').e('grd', 11, 23, null, 'u');
        b.e('grd', 10, 4, 'machete', 'r').e('grd', 19, 6, null, 'l');
        b.e('grd', 30, 6, 'smg', 'r').e('brc', 43, 6, 'pump', 'l');
        b.e('grd', 52, 12, 'pistol', 'd').e('grd', 53, 23, 'pipe', 'u');
        b.i('machete', 8, 31).i('pistol', 21, 3).i('knife', 13, 31);
      } },
      { name: 'INTERROGATION', w: 58, h: 36, wall: ['#b8c0d8', '#eef2ff'], req: 'witness', build(b) {
        b.r(2, 15, 5, 6, 'stairs').st(4, 17, 'r');
        // corridor broken by a door at x=28 so the patrol can't see you from the far end
        b.r(8, 15, 20, 5, 'lino').d(7, 16, 'v', 0, 'lino').r(29, 15, 19, 5, 'lino').d(28, 16, 'v', 0, 'lino');
        b.r(8, 4, 12, 10, 'conc').r(21, 4, 12, 10, 'conc').r(34, 4, 14, 10, 'carpet').d(12, 14, 'h').d(26, 14, 'h').d(40, 14, 'h');
        b.o('table', 12, 8).o('table', 25, 8).o('desk', 38, 6).o('plant', 46, 12).o('locker', 8, 4).o('locker', 21, 4).o('shelf', 42, 10);
        b.r(49, 6, 5, 8, 'cell').d(48, 9, 'v').wit(51, 9);
        b.r(8, 21, 18, 11, 'carpet').d(16, 20, 'h').o('sofa', 10, 22).o('desk', 18, 27).o('server', 22, 22).o('pillar', 13, 27);
        b.r(27, 21, 21, 11, 'conc').d(36, 20, 'h').o('server', 28, 22).o('server', 30, 22).o('server', 32, 22).o('crate', 44, 28).o('desk', 38, 26).o('pillar', 33, 27);
        b.r(49, 21, 6, 11, 'asph').d(48, 25, 'v', 0, 'conc').ex(50, 27, 4, 4, 'TRANSFER BAY');
        b.t(23, 30, "INTERROGATION LOG:\n'WHO ELSE WAS AT THE RETREAT, MISS REN?'\n'YOU ALREADY HAVE THEIR NAMES. ON TAPE.'", 'OBSERVATION');
        b.e('grd', 22, 17, 'pipe', 'l', { p: [[22, 17], [10, 17]] }).e('grd', 40, 18, 'pistol', 'r', { p: [[40, 18], [46, 18], [46, 16], [31, 16]] });
        b.e('grd', 10, 6, 'pistol', 'r').e('grd', 17, 11, 'pipe', 'u');
        b.e('grd', 23, 7, 'pipe', 'r').e('grd', 30, 11, null, 'l');
        b.e('brc', 45, 7, 'pump', 'l').e('grd', 36, 11, 'pistol', 'r');
        b.e('grd', 12, 25, 'pistol', 'r').e('grd', 22, 29, 'pipe', 'u');
        b.e('grd', 30, 29, 'smg', 'r').e('grd', 42, 24, 'machete', 'd').e('brc', 45, 30, 'pump', 'u');
        b.i('pipe', 4, 19).i('revolver', 44, 8);
      } }
    ]
  }
];
const IMPLANTS = [
  { k: 'none', name: 'NO IMPLANT', desc: 'JUST YOU', lv: 0 },
  { k: 'od', name: 'OVERDRIVE', desc: 'PUNCHES KILL', lv: 0 },
  { k: 'dash', name: 'DASH', desc: 'F: QUICK DODGE', lv: 0 },
  { k: 'plating', name: 'SUBDERMAL PLATING', desc: 'SURVIVE ONE HIT', lv: 1 },
  { k: 'spike', name: 'NEURAL SPIKE', desc: 'F: HACK AN ENEMY - ONCE PER FLOOR', lv: 2 },
  { k: 'reflex', name: 'REFLEX BOOST', desc: 'F: SLOW THE WORLD - ONCE PER FLOOR', lv: 3 },
  { k: 'ghost', name: 'GHOST', desc: 'SILENT GUNSHOTS', lv: 4 },
  { k: 'blades', name: 'ARM BLADES', desc: 'FISTS CUT. F: LEAP AT AN ENEMY', lv: 0 },
];
