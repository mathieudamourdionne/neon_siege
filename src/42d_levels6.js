// ---------- ACT 4: THE BOARD - The Crown, Panic Protocol, The Board ----------
LEVELS.push(
  {
    name: 'THE CROWN', sub: 'ACT 4 - EXECUTIVE FLOORS 90 TO 99', par: 260, music: 10, bgHue: 45, act: 4,
    msg: { who: 'ACT 4: THE BOARD  //  NADIA REN', text: "HALE'S TABLET WAS RIGHT. THE BOARD MEETS ON FLOOR 100 TONIGHT - ALL OF THEM.\nTHE EXECUTIVE FLOORS ARE GUARDED BY ORISON'S BEST.\n\nLASER GRIDS CUT THE HALLS. THEY BLINK ON AND OFF - TIME YOUR RUN.\nOR FIND THE PANEL IN THE SECURITY ROOM AND KILL THE GRID." },
    floors: [
      { name: 'EXECUTIVE HALL', w: 64, h: 40, wall: ['#5a4a2a', '#e8d8a8'], tip: 'WATCH THE LASERS FLICKER BEFORE THEY FIRE UP. THEY CUT GUARDS TOO.',
        onUse(s) { if (s.kind === 'breaker') { G.lasersOff = true; banner('LASER GRID OFFLINE', '#5dff9a'); sfx('power'); } },
        build(b) {
          b.r(2, 17, 6, 6, 'lift').st(4, 19, 'r').r(9, 16, 46, 8, 'marble').d(8, 19, 'v', 0, 'marble');
          b.laser(18, 16, 18, 23, 2, 1.6, 0).laser(30, 16, 30, 23, 1.6, 1.6, 1.2).laser(42, 16, 42, 23, 2.2, 1.4, 0.6);
          b.o('plant', 9, 16).o('plant', 54, 23).o('statue', 24, 19).o('statue', 36, 20).o('statue', 48, 19);
          b.r(9, 3, 14, 12, 'carpet').d(15, 15, 'h').o('desk', 12, 5).o('shelf', 17, 3).o('sofa', 11, 12).o('plant', 22, 3);
          b.r(24, 3, 14, 12, 'wood').d(30, 15, 'h').o('ltable', 26, 6).o('bar', 31, 3).o('plant', 37, 14);
          b.r(39, 3, 16, 12, 'carpet').d(46, 15, 'h').o('desk', 44, 5).o('tvwall', 49, 3).o('sofa', 41, 12).o('tank', 50, 9);
          b.t(52, 6, "BOARD AGENDA - FLOOR 100\n1. THE LEAK. 2. CONTAINMENT. 3. THE CITY.\nATTENDANCE MANDATORY. THE CHAIR PRESIDING.", 'AGENDA');
          b.r(9, 25, 22, 12, 'carpet').d(19, 24, 'h').laser(9, 30, 30, 30, 1.8, 1.8, 0.3).o('sofa', 11, 27).o('sofa', 11, 34).o('piano', 24, 33).o('table', 16, 33);
          b.r(32, 25, 23, 12, 'tile').d(43, 24, 'h').sw(52, 26, 'breaker', 'LASER GRID').o('desk', 35, 27).o('tvwall', 38, 25).o('locker', 54, 31).o('locker', 54, 34);
          b.r(56, 16, 6, 8, 'lift').d(55, 19, 'v', 0, 'lift').ex(57, 17, 4, 6, 'THE CORE');
          b.e('cln', 24, 21, 'smart', 'l').e('grd', 36, 17, 'pistol', 'l').e('rio', 47, 21, 'pistol', 'l');
          b.e('grd', 13, 9, 'pistol', 'r').e('cln', 20, 12, 'smg', 'l').e('grd', 28, 9, 'machete', 'r').e('fat', 35, 11, 'pump', 'l').e('cln', 45, 8, 'smart', 'd').e('grd', 52, 13, 'pistol', 'l');
          b.e('grd', 14, 28, 'bat', 'r').e('cln', 26, 27, 'pistol', 'l').e('grd', 36, 32, 'smg', 'r').e('brc', 47, 29, 'pump', 'l').e('hnd', 40, 35, null, 'l');
          b.i('silp', 5, 21);
          b.sp(58, 21).sp(10, 36).sp(53, 3);
        } }
    ]
  },
  {
    name: 'PANIC PROTOCOL', sub: 'ACT 4 - THE CORE FLOORS', par: 240, music: 7, bgHue: 110, act: 4,
    msg: { who: 'NADIA REN // RADIO', text: "YOU TRIPPED THE SPIRE'S PANIC PROTOCOL. THE VENTS ARE PUMPING GAS INTO THE CORE.\nTHE GUARDS HAVE MASKS. YOU DON'T.\n\nCLOSE THE THREE VENT VALVES AND THE GAS STOPS SPREADING.\nA FEW SECONDS IN THE GREEN IS FINE. DON'T STAY THERE." },
    floors: [
      { name: 'THE CORE', w: 64, h: 40, wall: ['#2a4a2a', '#a8d8a8'], tip: 'CLOSE THE VENT VALVES (E). STANDING IN THE GAS FOR MORE THAN A SECOND KILLS YOU.',
        gas: { seeds: [[31, 18], [11, 5], [52, 34], [30, 34], [52, 5]], every: 0.5, chance: 0.2, max: 300, life: 16, expose: 1.1 },
        objs: [{ k: 'valve', n: 3, label: 'CLOSE THE VENT VALVES' }],
        on(k, n) { if (k === 'valve' && n >= 3) { G.gasOff = true; banner('GAS SHUT OFF', '#5dff9a'); toast('THE GAS WILL CLEAR IN A FEW SECONDS.'); } },
        build(b) {
          b.r(2, 17, 6, 6, 'lift').st(4, 19, 'r').r(9, 3, 46, 5, 'conc').r(9, 32, 46, 5, 'conc').r(9, 8, 5, 24, 'conc').r(50, 8, 5, 24, 'conc').d(8, 19, 'v', 0, 'conc');
          b.r(20, 14, 24, 12, 'grate').r(14, 19, 6, 2, 'grate').r(44, 19, 6, 2, 'grate').o('tank', 23, 16).o('tank', 38, 16).o('tank', 30, 21).o('pump', 25, 22).o('pump', 36, 22).o('console', 31, 15);
          b.r(15, 9, 10, 4, 'dark').d(19, 8, 'h').sw(16, 10, 'valve', 'VENT VALVE').o('server', 22, 9);
          b.r(39, 9, 10, 4, 'dark').d(43, 8, 'h').sw(47, 10, 'valve', 'VENT VALVE').o('server', 40, 9);
          b.r(15, 27, 10, 4, 'dark').d(19, 31, 'h').sw(16, 29, 'valve', 'VENT VALVE').o('server', 22, 30);
          b.r(39, 27, 10, 4, 'dark').d(43, 31, 'h').o('shelf', 40, 27).o('crate', 46, 28);
          b.t(32, 25, "PANIC PROTOCOL: ACTIVE\nAGENT: SEDATIVE GAS (LETHAL AT DOSE)\nSTAFF: MASKS ON. VALVES: MANUAL OVERRIDE ONLY.", 'CORE CONSOLE');
          b.r(56, 17, 6, 6, 'lift').d(55, 19, 'v', 0, 'lift').ex(57, 18, 4, 4, 'FLOOR 100');
          b.e('grd', 25, 5, 'pistol', 'r', { p: [[25, 5], [45, 5]] }).e('cln', 11, 14, 'smg', 'd').e('grd', 52, 13, 'pistol', 'd').e('tec', 29, 18, null, 'r');
          b.e('cln', 35, 24, 'smart', 'l').e('grd', 42, 17, 'pipe', 'l').e('grd', 21, 11, 'pistol', 'r').e('fat', 45, 10, 'pump', 'l');
          b.e('grd', 20, 29, 'machete', 'r').e('rio', 30, 34, 'pistol', 'u').e('cln', 46, 34, 'smg', 'l').e('grd', 45, 29, 'pistol', 'l').e('hnd', 52, 25, null, 'u');
          b.i('ar', 47, 29).i('frag', 41, 29);
          b.sp(58, 21).sp(10, 35).sp(53, 4);
        } }
    ]
  },
  {
    name: 'THE BOARD', sub: 'ACT 4 - THE BOARDROOM, FLOOR 100', par: 240, music: 12, bgHue: 0, act: 4,
    msg: { who: 'NADIA REN // RADIO', text: "FLOOR 100. THE BOARDROOM. THE CHAIR ISN'T RUNNING - HE'S WAITING FOR YOU\nIN A COMBAT SUIT ORISON BUILT FOR THE ARMY AND NEVER SOLD.\n\nRED CIRCLES ON THE FLOOR ARE INCOMING ROCKETS - GET OUT OF THEM.\nBREAK THE SUIT, THEN FINISH HIM. THIS ENDS TONIGHT." },
    floors: [
      { name: 'THE BOARDROOM', w: 60, h: 40, wall: ['#3a0a14', '#e8b8b8'], tip: 'THE SUIT TAKES A LOT OF HITS. EXPLOSIVES AND HEAVY WEAPONS HELP. STAY OUT OF THE RED CIRCLES.',
        build(b) {
          b.r(26, 35, 8, 4, 'lift').st(30, 37, 'u').r(6, 6, 48, 28, 'carpet').d(29, 34, 'h');
          for (let x = 20; x <= 38; x += 2) b.o('table', x, 18);
          b.o('pillar', 12, 12).o('pillar', 46, 12).o('pillar', 12, 26).o('pillar', 46, 26).o('statue', 8, 20).o('statue', 51, 20).o('plant', 6, 6).o('plant', 53, 6).o('plant', 6, 33).o('plant', 53, 33).o('bar', 7, 28).o('tvwall', 38, 6).o('sofa', 20, 29).o('sofa', 37, 29);
          b.r(26, 2, 8, 3, 'plate').d(29, 5, 'h').ex(27, 2, 6, 3, 'THE BROADCAST');
          b.e('chr', 30, 11, 'belt', 'd');
          b.e('brd', 22, 16, 'pistol', 'd').e('brd', 36, 16, null, 'd').e('brd', 22, 21, 'bottle', 'u').e('brd', 36, 21, 'revolver', 'u');
          b.o('pillar', 18, 9).o('pillar', 40, 9).o('pillar', 18, 30).o('pillar', 40, 30);
          b.e('cln', 10, 18, 'smg', 'r').e('cln', 49, 22, 'smart', 'l');
          b.i('rocket', 28, 33).i('frag', 32, 33);
          b.sp(7, 7).sp(52, 7).sp(7, 32).sp(52, 32);
        } }
    ]
  }
);
