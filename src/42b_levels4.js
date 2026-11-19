// ---------- ACT 2, part 2: Observation, The Clean Ones, Mansion, The Host ----------
LEVELS.push(
  {
    name: 'OBSERVATION', sub: 'ACT 2 - THE SURVEILLANCE WING', par: 280, music: 6, bgHue: 160, act: 2,
    msg: { who: 'NADIA REN // RADIO', text: "THE LIFT GOES UP INTO THE OBSERVATION WING. EVERY ROOM IN THE MANSION IS WIRED TO THESE SCREENS.\nCAMERAS SWEEP THE HALLS. IF ONE SEES YOU, THE WHOLE WING COMES RUNNING - SHOOT THEM OUT FIRST.\n\nWIPE THE ARCHIVE SERVERS. THEN PULL THE MASTER DRIVE FROM THE VAULT. THAT'S OUR PROOF." },
    floors: [
      { name: 'MONITOR HALL', w: 64, h: 40, wall: ['#2a4a4a', '#8ad8c8'], tip: 'CAMERAS SEE IN A CONE. SHOOT OR SMASH THEM BEFORE THEY SPOT YOU.',
        objs: [{ k: 'rack', n: 8, label: 'WIPE THE ARCHIVE' }],
        build(b) {
          b.r(2, 17, 6, 6, 'lift').st(4, 19, 'r').r(9, 17, 46, 5, 'dark').d(8, 19, 'v', 0, 'dark');
          b.r(9, 3, 16, 13, 'dark').d(15, 16, 'h').o('tvwall', 11, 3).o('tvwall', 17, 3).o('console', 11, 8).o('console', 15, 8).o('console', 19, 8).o('desk', 12, 12);
          b.r(26, 3, 14, 13, 'plate').d(32, 16, 'h').rack(28, 5).rack(34, 5).rack(28, 10).rack(34, 10);
          b.r(41, 3, 14, 13, 'carpet').d(47, 16, 'h').o('desk', 44, 6).o('shelf', 50, 3).o('sofa', 43, 12).o('plant', 54, 15);
          b.t(52, 7, "OBSERVATION LOG\nSUITE 4: 31 GUESTS THIS SEASON.\nMASTER COPIES TO THE VAULT. NO EXCEPTIONS.\n- THE HOST", 'DUTY LOG');
          b.r(9, 23, 20, 14, 'plate').d(18, 22, 'h').rack(11, 26).rack(17, 26).rack(23, 26).rack(11, 31).rack(17, 31).rack(23, 31);
          b.r(30, 23, 12, 14, 'tile').d(35, 22, 'h').o('table', 32, 27).o('table', 37, 31).o('locker', 41, 24).o('locker', 41, 27).o('vend', 30, 35);
          b.r(43, 23, 12, 14, 'dark').d(48, 22, 'h').o('server', 45, 26).o('server', 50, 26).o('server', 45, 31).o('server', 50, 31);
          b.r(56, 15, 6, 9, 'lift').d(55, 18, 'v', 0, 'lift').ex(57, 16, 4, 6, 'THE VAULT');
          b.cam(9, 17, 0.15, 0.35).cam(54, 21, Math.PI + 0.15, 0.35).cam(24, 4, 2.4, 0.5).cam(39, 15, -2.4, 0.6).cam(28, 24, 2.4, 0.6).cam(43, 36, -0.8, 0.6);
          b.e('grd', 30, 19, 'pistol', 'r', { p: [[30, 19], [50, 19]] }).e('grd', 13, 6, 'smg', 'd').e('tec', 21, 12, null, 'l').e('grd', 18, 13, 'pipe', 'l');
          b.e('grd', 31, 8, 'pistol', 'r').e('fat', 37, 13, 'pipe', 'u').e('cln', 46, 9, 'smart', 'l').e('grd', 50, 12, 'pistol', 'u');
          b.e('grd', 14, 29, 'machete', 'r').e('rio', 21, 34, 'pistol', 'u').e('grd', 26, 29, 'smg', 'l');
          b.e('grd', 33, 25, 'pistol', 'r').e('brc', 38, 34, 'pump', 'l').e('grd', 47, 29, 'pistol', 'r').e('tec', 52, 34, null, 'l');
          b.i('silp', 5, 21).i('pipe', 6, 18);
          b.sp(60, 20).sp(10, 36).sp(54, 4);
        } },
      { name: 'THE VAULT', w: 52, h: 34, wall: ['#2a4a4a', '#8ad8c8'], tip: 'PULL THE DRIVE AT THE VAULT CONSOLE (E), THEN HOLD WHILE NADIA COPIES IT.',
        objs: [{ k: 'console', n: 1, label: 'PULL THE MASTER DRIVE' }, { k: 'hold', n: 1, label: 'HOLD WHILE IT COPIES' }],
        hold: { t: 30, every: 5, startText: 'COPYING - HOLD THE VAULT', doneText: 'DRIVE COPIED', waves: [[['grd', 'smg'], ['grd', 'pistol']], [['cln', 'smart'], ['grd', 'pistol']], [['brc', 'pump'], ['hnd', null]], [['cln', 'smg'], ['rio', 'pistol']]] },
        build(b) {
          b.r(2, 14, 6, 6, 'lift').st(4, 16, 'r').r(9, 13, 34, 8, 'marble').d(8, 16, 'v', 0, 'marble').o('pillar', 15, 14).o('pillar', 15, 18).o('pillar', 27, 14).o('pillar', 27, 18);
          b.r(30, 2, 14, 10, 'plate').d(36, 12, 'h').sw(36, 3, 'console', 'MASTER DRIVE').o('server', 31, 3).o('server', 41, 3).o('server', 31, 8).o('server', 41, 8);
          b.r(9, 2, 20, 10, 'dark').d(18, 12, 'h').o('tvwall', 12, 2).o('tvwall', 20, 2).o('console', 13, 6).o('console', 19, 6).o('desk', 23, 8);
          b.r(9, 22, 16, 10, 'carpet').d(16, 21, 'h').o('sofa', 11, 28).o('table', 17, 25).o('plant', 24, 31);
          b.r(26, 22, 17, 10, 'dark').d(33, 21, 'h').o('server', 28, 24).o('server', 33, 24).o('server', 38, 24).o('crate', 29, 29);
          b.r(44, 13, 6, 8, 'lift').d(43, 16, 'v', 0, 'lift').ex(45, 14, 4, 6, 'EAST WING');
          b.cam(9, 13, 0.25, 0.4).cam(43, 11, -2.4, 0.5).cam(42, 31, -2.2, 0.5);
          b.e('grd', 21, 16, 'pistol', 'r', { p: [[21, 16], [38, 16]] }).e('grd', 34, 6, 'smg', 'd').e('cln', 39, 9, 'smart', 'l');
          b.e('grd', 14, 9, 'pistol', 'r').e('tec', 24, 5, null, 'l').e('grd', 13, 25, 'machete', 'r').e('grd', 36, 28, 'pistol', 'l').e('hnd', 30, 27, null, 'r');
          b.sp(46, 18).sp(11, 30).sp(12, 3).sp(40, 30);
        } }
    ]
  },
  {
    name: 'THE CLEAN ONES', sub: 'ACT 2 - THE EAST WING, BURNING', par: 240, music: 7, bgHue: 15, act: 2,
    msg: { who: 'NADIA REN // RADIO', text: "ORISON SENT THE CLEAN ONES. THEY'RE BURNING THE EAST WING TO WIPE THE EVIDENCE -\nWITH THE STAFF STILL LOCKED IN THEIR ROOMS.\n\nGET THEM OUT BEFORE THE ROOF COMES DOWN. DON'T STAND IN THE FLAMES.\nCLEANERS ARE FAST AND THEY DON'T MISS. USE THE SMOKE - THEY CAN'T SEE THROUGH IT EITHER." },
    floors: [
      { name: 'EAST WING', w: 64, h: 40, wall: ['#5a3a2a', '#d8a878'], fireHurts: true, tip: 'FREE THE STAFF (E AT EACH CELL). FIRE SPREADS ROOM TO ROOM AND KILLS ON CONTACT.',
        blaze: { seeds: [[20, 30], [47, 28], [26, 9], [56, 19]], every: 0.5, chance: 0.18, max: 200, life: 14 },
        objs: [{ k: 'cage', n: 5, label: 'FREE THE STAFF' }],
        onStart() { G.timer = { t: 150, label: 'THE ROOF COMES DOWN', lose: 'THE ROOF CAME DOWN. SO DID YOU.' }; },
        build(b) {
          b.r(2, 17, 6, 6, 'conc').st(4, 19, 'r').r(9, 17, 50, 5, 'wood').d(8, 19, 'v', 0, 'wood').o('plant', 20, 17).o('plant', 40, 21);
          b.r(9, 3, 11, 13, 'carpet').d(14, 16, 'h').o('bed', 10, 4).o('locker', 18, 3).cage(16, 9);
          b.r(21, 3, 11, 13, 'carpet').d(26, 16, 'h').o('bed', 22, 4).o('locker', 30, 3).cage(28, 9);
          b.r(33, 3, 11, 13, 'carpet').d(38, 16, 'h').o('bed', 34, 4).o('locker', 42, 3).cage(40, 9);
          b.r(45, 3, 14, 13, 'carpet').d(51, 16, 'h').o('bed', 46, 4).o('desk', 53, 4).o('sofa', 47, 13);
          b.t(55, 8, "CLEANUP ORDER 7\nEAST WING: TOTAL LOSS. NO WITNESSES.\nINSURANCE CLAIM: ELECTRICAL FAULT.", 'CLEANER TABLET');
          b.r(9, 23, 24, 14, 'wood').d(20, 22, 'h').o('sofa', 11, 25).o('piano', 25, 25).o('table', 15, 30).cage(11, 33);
          b.r(34, 23, 25, 14, 'tile').d(45, 22, 'h').o('sink', 36, 24).o('sink', 38, 24).o('shower', 57, 24).o('crate', 40, 33).cage(53, 32);
          b.r(60, 15, 3, 9, 'conc').d(59, 18, 'v', 0, 'conc').ex(60, 16, 3, 6, 'SERVICE STAIRS');
          b.e('cln', 30, 19, 'flare', 'l').e('cln', 50, 19, 'smg', 'l').e('grd', 14, 12, 'pistol', 'd').e('cln', 25, 6, 'flare', 'r');
          b.e('grd', 37, 12, 'pipe', 'r').e('cln', 52, 8, 'smart', 'l').e('grd', 56, 13, 'pistol', 'l');
          b.e('cln', 18, 27, 'flare', 'r').e('grd', 28, 33, 'smg', 'l').e('tec', 13, 29, null, 'r');
          b.e('cln', 42, 28, 'pistol', 'r').e('grd', 50, 26, 'pistol', 'l').e('fat', 46, 34, 'pipe', 'u');
          b.i('ar', 5, 21).i('pipe', 6, 18);
          b.sp(61, 22).sp(10, 36).sp(57, 3);
        } }
    ]
  },
  {
    name: 'MANSION', sub: 'ACT 2 - THE MAIN HOUSE', par: 320, music: 11, bgHue: 330, act: 2,
    msg: { who: 'NADIA REN // RADIO', text: "THE MAIN HOUSE. THE GUESTS RAN - IT'S JUST THE HOST'S PRIVATE GUARD NOW.\nCHANDELIERS HANG OVER THE BIG ROOMS. SHOOT ONE AND IT COMES DOWN ON WHOEVER'S UNDER IT.\n\nTHE HOST IS ON THE TOP FLOOR. GO UP." },
    floors: [
      { name: 'GRAND HALL', w: 64, h: 40, wall: ['#4a2a3a', '#e8c8a8'], tip: 'SHOOT A CHANDELIER WHEN GUARDS ARE UNDER IT. DON\'T STAND UNDER ONE YOURSELF.',
        build(b) {
          b.r(28, 34, 8, 4, 'marble').st(31, 36, 'u').r(14, 14, 36, 19, 'marble').d(31, 33, 'h');
          b.o('pillar', 18, 17).o('pillar', 44, 17).o('pillar', 18, 28).o('pillar', 44, 28).o('statue', 31, 22).o('plant', 14, 14).o('plant', 49, 14).o('plant', 14, 32).o('plant', 49, 32);
          b.chand(23, 19).chand(40, 19).chand(23, 27).chand(40, 27).chand(31, 17);
          b.r(2, 14, 11, 19, 'carpet').d(13, 22, 'v').o('ltable', 4, 17).o('ltable', 4, 25).o('counter', 3, 31);
          b.r(51, 14, 11, 19, 'wood').d(50, 22, 'v').o('shelf', 53, 14).o('shelf', 57, 14).o('shelf', 53, 20).o('shelf', 57, 26).o('desk', 54, 29);
          b.r(14, 2, 36, 11, 'marble').d(24, 13, 'h').d(38, 13, 'h').o('piano', 18, 4).o('bar', 38, 2).o('sofa', 28, 9).o('sofa', 33, 9).chand(24, 7).chand(40, 7);
          b.r(2, 2, 11, 11, 'carpet').d(13, 7, 'v').o('plant', 2, 2).ex(3, 3, 5, 5, 'UP THE STAIRS');
          b.e('grd', 25, 18, 'pistol', 'r').e('grd', 39, 24, 'pipe', 'l').e('cln', 37, 19, 'smart', 'l').e('rio', 22, 24, 'pistol', 'r').e('grd', 41, 30, 'machete', 'l');
          b.o('sofa', 20, 22).o('sofa', 41, 22).o('table', 25, 29).o('table', 37, 29).o('table', 27, 15).o('table', 35, 15);
          b.e('grd', 5, 20, 'pistol', 'r').e('brc', 9, 28, 'pump', 'u').e('grd', 56, 18, 'machete', 'l').e('fat', 58, 30, 'pipe', 'l');
          b.e('grd', 22, 6, 'smg', 'r').e('cln', 30, 5, 'pistol', 'd').e('grd', 44, 8, 'pistol', 'l').e('hnd', 36, 11, null, 'l').e('snp', 47, 4, 'rifle', 'l');
          b.e('grd', 8, 9, 'pistol', 'd');
          b.sp(31, 37).sp(60, 31).sp(3, 31);
        } },
      { name: 'THE GALLERY', w: 64, h: 40, wall: ['#4a2a3a', '#e8c8a8'], tip: 'THE HOST\'S LIFT IS AT THE FAR END OF THE LOWER HALL.',
        build(b) {
          b.r(2, 2, 6, 6, 'lift').st(4, 4, 'r').r(9, 2, 46, 8, 'marble').d(8, 4, 'v', 0, 'marble');
          b.o('statue', 15, 3).o('statue', 27, 7).o('statue', 39, 3).o('statue', 51, 7).chand(19, 5).chand(31, 5).chand(44, 5);
          b.r(9, 11, 14, 12, 'carpet').d(15, 10, 'h').d(15, 23, 'h').o('bed', 10, 12).o('sofa', 18, 20).o('plant', 22, 11);
          b.r(24, 11, 16, 12, 'wood').d(31, 10, 'h').d(31, 23, 'h').o('bar', 26, 11).o('table', 27, 16).o('table', 34, 16).o('plant', 39, 22);
          b.r(41, 11, 14, 12, 'carpet').d(47, 10, 'h').d(47, 23, 'h').o('desk', 44, 14).o('shelf', 50, 11).o('tank', 43, 18);
          b.t(52, 15, "PRIVATE LEDGER\nVOSS - PAID. OKAFOR - PAID.\nTHE TAPES ARE INSURANCE. THE ISLAND IS MINE.\n- THE HOST", 'LEDGER');
          b.r(9, 24, 46, 6, 'marble').chand(20, 27).chand(40, 27).o('pillar', 30, 25);
          b.r(9, 31, 46, 7, 'carpet').d(20, 30, 'h').d(44, 30, 'h').o('sofa', 12, 36).o('sofa', 24, 36).o('piano', 34, 32).o('plant', 54, 37);
          b.r(56, 24, 6, 6, 'lift').d(55, 26, 'v', 0, 'lift').ex(57, 25, 4, 4, 'PENTHOUSE LIFT');
          b.e('grd', 22, 5, 'pistol', 'r', { p: [[22, 5], [48, 5]] }).e('cln', 36, 7, 'smg', 'l').e('grd', 52, 4, 'pistol', 'l');
          b.e('grd', 12, 16, 'pistol', 'r').e('brc', 20, 14, 'pump', 'l').e('grd', 29, 19, 'smg', 'r').e('rio', 36, 13, 'pistol', 'd').e('cln', 51, 20, 'smart', 'l').e('grd', 44, 21, 'pistol', 'u');
          b.e('grd', 16, 27, 'pistol', 'r').e('fat', 38, 27, 'pipe', 'l').e('hnd', 50, 26, null, 'l');
          b.e('grd', 16, 33, 'machete', 'r').e('cln', 30, 35, 'pistol', 'r').e('grd', 46, 34, 'smg', 'l');
          b.sp(58, 28).sp(10, 37).sp(53, 3);
        } }
    ]
  },
  {
    name: 'THE HOST', sub: 'ACT 2 - THE PENTHOUSE', par: 240, music: 12, bgHue: 345, act: 2,
    msg: { who: 'NADIA REN // RADIO', text: "THE HOST. HE OWNS THE ISLAND, THE PARTY AND EVERY PERSON ON THOSE TAPES.\nHE'S IN HIS PANIC ROOM BEHIND ARMORED GLASS.\n\nCUT THE THREE POWER LINES AND THE GLASS COMES DOWN. THEN FINISH IT." },
    floors: [
      { name: 'THE PENTHOUSE', w: 60, h: 40, wall: ['#3a1a2a', '#e8b8c8'], tip: 'CUT THE THREE POWER LINES (E AT EACH BREAKER). THE GLASS DROPS WHEN ALL THREE ARE OUT.',
        objs: [{ k: 'breaker', n: 3, label: 'CUT THE POWER LINES' }],
        on(k, n) { if (k !== 'breaker') return; if (n < 3) { banner('POWER LINE ' + n + ' OF 3', '#ffe14d'); spawnWave([['cln', 'smg'], ['grd', 'pistol']]); } else { openGate('glass'); banner('THE GLASS IS DOWN', '#ff3b4e'); G.shake = 0.6; for (const e of G.ents) if (e.t === 'hst') { e.st = 'alert'; e.lx = G.player.x; e.ly = G.player.y; } } },
        build(b) {
          b.r(27, 35, 6, 4, 'lift').st(30, 37, 'u').r(8, 8, 44, 26, 'marble').d(29, 34, 'h');
          b.r(24, 2, 12, 5, 'plate').r(26, 7, 8, 1, 'plate').gate('glass', 26, 7, 8, 1, 'glass').o('desk', 28, 2).o('server', 25, 2).o('server', 33, 2).ex(25, 3, 3, 3, 'THE ARCHIVE');
          b.r(2, 14, 5, 8, 'dark').d(7, 17, 'v').sw(3, 15, 'breaker', 'POWER LINE');
          b.r(53, 14, 5, 8, 'dark').d(52, 17, 'v').sw(55, 15, 'breaker', 'POWER LINE');
          b.r(40, 2, 10, 5, 'dark').d(44, 7, 'h').sw(46, 2, 'breaker', 'POWER LINE');
          b.o('pillar', 15, 13).o('pillar', 43, 13).o('pillar', 15, 26).o('pillar', 43, 26).o('sofa', 22, 20).o('sofa', 35, 20).o('tank', 28, 16).o('bar', 10, 9).o('piano', 46, 30).o('plant', 8, 33).o('plant', 51, 33).o('statue', 20, 30).o('statue', 39, 30);
          b.chand(20, 16).chand(39, 16).chand(29, 26).o('table', 12, 20).o('table', 46, 20).o('pillar', 22, 10).o('pillar', 36, 10).o('sofa', 27, 30);
          b.e('hst', 30, 4, 'smart', 'd');
          b.e('cln', 14, 18, 'smg', 'r').e('cln', 45, 22, 'smart', 'l').e('grd', 24, 12, 'pipe', 'd').e('grd', 36, 28, 'machete', 'u').e('rio', 30, 22, 'pistol', 'd').e('grd', 4, 19, 'pistol', 'r').e('grd', 55, 19, 'pistol', 'l').e('hnd', 46, 10, null, 'l').e('hnd', 12, 28, null, 'r');
          b.i('pump', 31, 33).i('frag', 28, 33);
          b.sp(30, 38).sp(9, 9).sp(50, 9).sp(9, 32).sp(50, 32);
        } }
    ]
  }
);
