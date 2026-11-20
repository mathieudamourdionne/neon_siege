// ---------- ACT 3: THE TOWER - Lockdown, The Lobby, The Stack, The Director ----------
LEVELS.push(
  {
    name: 'LOCKDOWN', sub: 'ACT 3 - CURFEW IN DISTRICT 1', par: 260, music: 8, bgHue: 25, act: 3,
    msg: { who: 'ACT 3: THE TOWER  //  NADIA REN', text: "THE TAPES ARE OUT. EVERY SCREEN IN PORT OSTRA IS PLAYING THEM.\nORISON'S ANSWER: A CURFEW, AND DRONES OVER EVERY STREET.\n\nDRONES SWEEP WITH SEARCHLIGHTS. IF ONE LOCKS ON, IT CALLS THE STREET AND OPENS FIRE.\nTWO HITS BRING ONE DOWN. GET TO THE SPIRE." },
    floors: [
      { name: 'CURFEW STREETS', w: 64, h: 40, wall: ['#5a4a3a', '#c8b898'], tip: 'STAY OUT OF THE DRONE SEARCHLIGHTS - OR SHOOT THEM DOWN FIRST.',
        fires: [[24, 18], [47, 21], [32, 31]],
        build(b) {
          b.r(2, 16, 60, 7, 'asph').r(28, 2, 8, 36, 'asph').st(4, 19, 'r');
          b.r(4, 4, 14, 11, 'tile').d(10, 15, 'h').o('shelf', 5, 5).o('shelf', 5, 9).o('shelf', 11, 9).o('counter', 11, 4).o('vend', 16, 12);
          b.r(37, 4, 23, 11, 'wood').d(36, 9, 'v').d(46, 15, 'h').o('bar', 40, 4).o('table', 41, 9).o('table', 47, 9).o('table', 53, 6).o('piano', 55, 11);
          b.r(4, 24, 23, 13, 'conc').d(12, 23, 'h').d(27, 30, 'v').o('car', 6, 27).o('crate', 18, 26).o('crate', 21, 32).o('drum', 8, 34).o('gen', 14, 33);
          b.r(37, 24, 23, 13, 'tile').d(36, 30, 'v').d(48, 23, 'h').o('bed', 40, 26).o('bed', 44, 26).o('bed', 48, 26).o('desk', 54, 32).o('shelf', 40, 35);
          b.t(55, 34, "CLINIC NOTICE\nBY ORDER OF ORISON CIVIL SECURITY:\nTREATING CURFEW VIOLATORS IS A CRIME.", 'NOTICE');
          b.o('jersey', 10, 18).o('jersey', 40, 18).o('jersey', 50, 20).o('car', 21, 17).o('car', 44, 20).o('dumpster', 29, 3).o('car', 30, 30).o('jersey', 29, 10).o('jersey', 31, 25);
          b.drone(16, 19, [[8, 19], [26, 19]]).drone(31, 9, [[31, 4], [33, 14]]).drone(48, 19, [[38, 17], [57, 21]]).drone(31, 33, [[30, 26], [33, 36]]);
          b.e('grd', 12, 8, 'pistol', 'r').e('grd', 7, 12, 'pipe', 'u').e('grd', 44, 7, 'smg', 'l').e('brc', 52, 12, 'pump', 'u').e('grd', 57, 6, 'pistol', 'l');
          b.e('grd', 13, 30, 'machete', 'r').e('hnd', 22, 29, null, 'l').e('grd', 45, 31, 'pistol', 'r').e('rio', 52, 28, 'pistol', 'l');
          b.e('grd', 33, 20, 'pistol', 'u').e('grd', 56, 18, 'smg', 'l').e('hnd', 32, 6, null, 'd');
          b.i('pipe', 6, 21).i('silp', 14, 6);
          b.ex(58, 17, 4, 5, 'THE SPIRE PLAZA');
          b.sp(31, 3).sp(31, 37).sp(61, 21);
        } }
    ]
  },
  {
    name: 'THE LOBBY', sub: 'ACT 3 - ORISON SPIRE, GROUND FLOOR', par: 240, music: 5, bgHue: 200, act: 3,
    msg: { who: 'NADIA REN // RADIO', text: "THE SPIRE'S LOBBY IS A KILL BOX. AUTO-TURRETS IN THE FLOOR, RIOT TEAMS AT THE GATES.\nTURRETS TRACK YOU ONCE YOU'RE IN THEIR SIGHT LINE. SHOOT THEM, BLOW THEM UP,\nOR CUT THEIR POWER IN THE SECURITY OFFICE ON THE LEFT.\n\nTHE EXECUTIVE ELEVATORS ARE AT THE BACK." },
    floors: [
      { name: 'ATRIUM', w: 64, h: 40, wall: ['#3a4a5a', '#c8d8e8'], tip: 'THE BREAKER IN THE SECURITY OFFICE (LEFT) SHUTS EVERY TURRET DOWN.',
        onUse(s) { if (s.kind === 'breaker') { G.turretsOff = true; banner('TURRETS OFFLINE', '#5dff9a'); sfx('power'); } },
        build(b) {
          b.r(26, 34, 12, 4, 'conc').st(31, 36, 'u').r(10, 12, 44, 21, 'marble').d(28, 33, 'h').d(34, 33, 'h');
          b.o('pillar', 16, 16).o('pillar', 46, 16).o('pillar', 16, 27).o('pillar', 46, 27).o('counter', 27, 21).o('counter', 27, 25).o('plant', 10, 12).o('plant', 53, 12).o('plant', 10, 32).o('plant', 53, 32).o('bench', 20, 30).o('bench', 40, 30).o('statue', 31, 17);
          b.turret(20, 18, 1.2).turret(43, 18, 1.9).turret(31, 14, 1.57).turret(13, 24, 0).turret(50, 24, 3.14);
          b.r(2, 12, 7, 10, 'dark').d(9, 17, 'v').sw(3, 13, 'breaker', 'TURRET POWER').o('desk', 5, 18).o('tvwall', 4, 12);
          b.r(55, 12, 7, 21, 'tile').d(54, 22, 'v').o('table', 57, 15).o('table', 57, 26).o('vend', 59, 31);
          b.r(18, 2, 28, 9, 'plate').r(26, 2, 12, 3, 'lift').d(24, 11, 'h').d(39, 11, 'h').ex(27, 2, 10, 3, 'EXECUTIVE ELEVATORS');
          b.t(44, 9, "SPIRE SECURITY BULLETIN\nTHE INTRUDER FROM THE ISLAND IS IN THE CITY.\nDIRECTOR HALE AUTHORIZES LETHAL FORCE.", 'BULLETIN');
          b.e('rio', 26, 31, 'pistol', 'u').e('rio', 37, 31, 'pistol', 'u').e('grd', 22, 22, 'pistol', 'r').e('grd', 41, 23, 'pipe', 'l').e('grd', 31, 23, 'bat', 'd');
          b.e('grd', 5, 15, 'pistol', 'r').e('grd', 6, 20, 'pipe', 'u').e('fat', 57, 20, 'pump', 'l').e('grd', 59, 28, 'pistol', 'u');
          b.e('grd', 22, 6, 'smg', 'd').e('cln', 41, 6, 'pistol', 'd').e('snp', 31, 9, 'rifle', 'd');
          b.i('pump', 33, 36).i('baton', 31, 36);
          b.sp(31, 37).sp(60, 30).sp(20, 3);
        } }
    ]
  },
  {
    name: 'THE STACK', sub: 'ACT 3 - FLOORS 40 TO 60', par: 300, music: 9, bgHue: 265, act: 3,
    msg: { who: 'NADIA REN // RADIO', text: "THE MIDDLE FLOORS: SERVERS, LABS, AND THE CLEAN ONES' BARRACKS.\nORISON IS RESTORING A BACKUP OF THE TAPES TO PROVE THEY'RE FAKE. WIPE IT.\n\nTHEY'RE CUTTING THE POWER FLOOR BY FLOOR. IN A BLACKOUT THEY ONLY SEE\nWHAT THEIR FLASHLIGHTS HIT. THAT'S WHEN YOU MOVE." },
    floors: [
      { name: 'SERVER FLOOR', w: 64, h: 40, wall: ['#3a2a5a', '#b8a8e8'], blackout: { light: 16, dark: 9 }, tip: 'DURING A BLACKOUT GUARDS ONLY SEE IN THEIR FLASHLIGHT BEAMS.',
        objs: [{ k: 'rack', n: 6, label: 'WIPE THE BACKUP' }],
        build(b) {
          b.r(2, 17, 6, 6, 'lift').st(4, 19, 'r').r(9, 17, 46, 5, 'grate').d(8, 19, 'v', 0, 'grate');
          b.r(9, 3, 22, 13, 'dark').d(20, 16, 'h').rack(12, 6).rack(19, 6).rack(12, 11).o('server', 25, 4).o('server', 25, 12);
          b.r(32, 3, 23, 13, 'tile').d(43, 16, 'h').o('tank', 35, 5).o('tank', 44, 5).o('console', 40, 12).o('desk', 49, 11).o('locker', 54, 3);
          b.t(52, 7, "RESTORE JOB 4471\nSOURCE: OFFSITE BACKUP\nTARGET: PRESS RELEASE - 'DEEPFAKE FOOTAGE'", 'LAB TERMINAL');
          b.r(9, 23, 22, 14, 'dark').d(20, 22, 'h').rack(12, 27).rack(19, 27).rack(24, 32).o('server', 11, 33).o('server', 26, 25);
          b.r(32, 23, 23, 14, 'conc').d(43, 22, 'h').o('crate', 34, 25).o('crate', 38, 31).o('shelf', 45, 24).o('shelf', 45, 34).o('cart', 51, 28);
          b.r(56, 15, 6, 9, 'lift').d(55, 18, 'v', 0, 'lift').ex(57, 16, 4, 6, 'BARRACKS');
          b.e('grd', 30, 19, 'pistol', 'r', { p: [[30, 19], [50, 19]] }).e('tec', 15, 9, null, 'r').e('grd', 26, 8, 'smg', 'l').e('grd', 38, 9, 'pistol', 'r').e('cln', 50, 6, 'smart', 'l');
          b.e('grd', 15, 30, 'pistol', 'r').e('tec', 27, 30, null, 'l').e('grd', 36, 28, 'pipe', 'r').e('brc', 49, 33, 'pump', 'l').e('cln', 40, 34, 'pistol', 'u');
          b.i('silp', 5, 21);
          b.sp(58, 20).sp(10, 36).sp(54, 4);
        } },
      { name: 'BARRACKS', w: 64, h: 40, wall: ['#3a2a5a', '#b8a8e8'], blackout: { light: 14, dark: 10 }, tip: 'THE ARMORY IS ON THE RIGHT.',
        build(b) {
          b.r(2, 2, 6, 6, 'lift').st(4, 4, 'r').r(9, 2, 46, 6, 'conc').d(8, 4, 'v', 0, 'conc');
          b.r(9, 9, 14, 12, 'conc').d(15, 8, 'h').d(15, 21, 'h').o('bunk', 10, 10).o('bunk', 13, 10).o('bunk', 10, 16).o('bunk', 13, 16).o('locker', 21, 10);
          b.r(24, 9, 16, 12, 'tile').d(31, 8, 'h').d(31, 21, 'h').o('ltable', 26, 12).o('ltable', 26, 17).o('counter', 34, 9);
          b.r(41, 9, 14, 12, 'conc').d(47, 8, 'h').d(47, 21, 'h').o('shelf', 42, 9).o('shelf', 49, 9).o('crate', 43, 17).o('crate', 51, 17);
          b.r(9, 22, 46, 6, 'conc').o('pillar', 22, 23).o('pillar', 40, 23);
          b.r(9, 29, 22, 9, 'tile').d(20, 28, 'h').o('shower', 10, 30).o('shower', 13, 30).o('shower', 16, 30).o('sink', 26, 36).o('sink', 28, 36);
          b.r(32, 29, 23, 9, 'conc').d(43, 28, 'h').o('bench', 35, 32).o('bench', 44, 32).o('drum', 52, 30);
          b.r(56, 22, 6, 6, 'lift').d(55, 24, 'v', 0, 'lift').ex(57, 23, 4, 4, 'ROOF STAIRS');
          b.e('cln', 30, 4, 'smg', 'r', { p: [[30, 4], [50, 4]] }).e('grd', 12, 13, 'pistol', 'r').e('cln', 18, 18, 'pistol', 'l');
          b.e('grd', 28, 14, 'machete', 'r').e('grd', 36, 18, 'pistol', 'l').e('fat', 32, 11, 'pipe', 'd');
          b.e('cln', 46, 13, 'smart', 'r').e('grd', 52, 19, 'smg', 'l').e('hnd', 30, 25, null, 'r');
          b.e('grd', 14, 34, 'pistol', 'r').e('cln', 27, 32, 'smg', 'l').e('brc', 40, 35, 'pump', 'r').e('rio', 50, 33, 'pistol', 'l');
          b.i('ar', 45, 13).i('frag', 51, 12).i('flare', 44, 11).i('glaunch', 46, 11);
          b.sp(58, 26).sp(10, 36).sp(53, 3);
        } }
    ]
  },
  {
    name: 'THE DIRECTOR', sub: 'ACT 3 - THE SPIRE ROOF', par: 220, music: 12, bgHue: 15, act: 3,
    msg: { who: 'NADIA REN // RADIO', text: "DIRECTOR HALE RUNS ORISON SECURITY. HE SIGNED EVERY CLEANUP ORDER.\nHE'S ON THE HELIPAD WITH A RAIL LANCE. WHEN THE RED LINE APPEARS, GET OFF IT -\nIT GOES THROUGH WALLS.\n\nHE KNOWS WHERE THE BOARD MEETS. END THIS." },
    floors: [
      { name: 'THE HELIPAD', w: 56, h: 40, wall: ['#6a6862', '#b4b2aa'], barrier: true, helipad: [27, 18], tip: 'A RED LINE MEANS THE RAIL LANCE IS COMING. STEP OFF THE LINE.',
        build(b) {
          b.r(2, 2, 52, 34, 'roof').r(24, 37, 8, 2, 'conc').d(27, 36, 'h').st(28, 38, 'u');
          b.o('ac', 6, 5).o('ac', 45, 5).o('ac', 6, 29).o('ac', 45, 29).o('crate', 16, 11).o('crate', 37, 11).o('crate', 16, 25).o('crate', 37, 25).o('gen', 25, 4).o('dish', 47, 16).o('xmit', 6, 17).o('jersey', 22, 31).o('jersey', 30, 31);
          b.e('dir', 27, 15, 'ar', 'd');
          b.e('cln', 12, 9, 'smg', 'r').e('cln', 42, 22, 'smart', 'l').e('grd', 20, 28, 'bat', 'u').e('grd', 36, 28, 'machete', 'u');
          b.drone(10, 18, [[8, 10], [8, 26]]).drone(46, 26, [[47, 30], [40, 22]]);
          b.ex(24, 15, 7, 7, 'THE BOARD');
          b.sp(4, 4).sp(51, 4).sp(4, 33).sp(51, 33);
        } }
    ]
  }
);
