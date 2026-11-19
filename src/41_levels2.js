// ---------- Act 1, levels 3-8 (from the design doc), top-down ----------
const RADIO = (text, life) => { G.lore = { who: 'NADIA REN // RADIO', text: text, life: life || 8 }; };
LEVELS.push(
  {
    name: 'RUNOFF', sub: 'STORM DRAINS UNDER DISTRICT 9', par: 200, music: 3, bgHue: 200,
    msg: { who: 'NADIA REN // RADIO', text: "THE STORM DRAINS RUN UNDER THE WHOLE CITY.\nTHE WATER IS LIVE - ORISON ELECTRIFIES IT TO KEEP PEOPLE OUT.\n\nFIND THE PUMP BREAKERS AND CUT THE POWER." },
    floors: [
      { name: 'DRAIN JUNCTION', w: 64, h: 40, wall: ['#5a6a70', '#9ab0b8'], live: true, tip: 'THE WATER IS LIVE. CROSS ON THE GRATES.',
        objs: [{ k: 'breaker', n: 2, label: 'CUT THE PUMP BREAKERS' }],
        onDone() { M.live = false; mapChanged(); banner('POWER CUT', '#5dff9a'); RADIO("POWER'S OUT. THE WATER IS SAFE.\n...DO YOU HEAR THAT? HOUNDS.", 6); spawnWave([['hnd'], ['hnd'], ['hnd']]); },
        build(b) {
          b.r(2, 2, 8, 6, 'dark').st(5, 4, 'd').t(8, 3, "PUMP STATION 9 - LIVE WATER PROTOCOL\nCONTACT WITH THE CHANNELS IS FATAL.\nTHAT IS THE POINT.", 'MAINTENANCE LOG');
          b.r(2, 9, 10, 27, 'grate').d(5, 8, 'h', 0, 'grate');
          b.r(13, 9, 38, 23, 'dark').d(12, 12, 'v').d(12, 27, 'v');
          b.r(13, 18, 38, 5, 'water').r(21, 18, 3, 5, 'grate').r(39, 18, 3, 5, 'grate');
          b.o('pump', 16, 10).o('pump', 30, 10).o('pump', 44, 10).o('barrels', 36, 12);
          b.o('tank', 25, 26).o('crate', 35, 27).o('drum', 17, 29).o('drum', 48, 30);
          // banks of the channel lined with crates and pumps - you can only see across at the bridges
          for (const x of [14, 16, 18, 25, 27, 29, 31, 33, 35, 44, 46, 48]) { b.o('crate', x, 16); b.o('crate', x, 23); }
          b.r(52, 3, 10, 11, 'conc').d(51, 10, 'v').sw(60, 5, 'breaker', 'CUT BREAKER A').o('locker', 53, 11).o('shelf', 54, 4);
          b.r(52, 24, 10, 12, 'conc').d(51, 27, 'v').sw(60, 33, 'breaker', 'CUT BREAKER B').o('crate', 54, 33).o('locker', 52, 24);
          b.r(13, 33, 14, 5, 'dark').d(18, 32, 'h').sp(15, 35).sp(24, 35).sp(20, 36).ex(13, 33, 4, 5, 'OUTFLOW');
          b.e('grd', 7, 24, null, 'd', { p: [[7, 24], [7, 33], [4, 33], [4, 24]] });
          b.e('grd', 22, 13, 'pipe', 'r').e('grd', 40, 13, 'pistol', 'l');
          b.e('grd', 31, 29, 'pistol', 'u').e('brc', 43, 28, 'pump', 'l');
          b.e('grd', 56, 8, 'pistol', 'd').e('grd', 59, 12, null, 'l');
          b.e('grd', 55, 30, 'machete', 'u').e('grd', 59, 26, 'pistol', 'l');
          b.i('pipe', 3, 10);
        } },
      { name: 'OUTFLOW', w: 64, h: 36, wall: ['#4a5a60', '#8aa0a8'], tip: 'HOUNDS ARE FAST BUT DIE TO ONE HIT. SWING EARLY.',
        build(b) {
          b.r(2, 14, 6, 6, 'grate').st(4, 16, 'r');
          b.r(9, 12, 20, 10, 'dark').d(8, 16, 'v', 0, 'grate').r(9, 15, 20, 3, 'water');
          b.r(18, 2, 22, 9, 'conc').d(22, 11, 'h').o('crate', 25, 5).o('crate', 32, 7).o('shelf', 35, 2);
          b.r(30, 12, 14, 10, 'dark').d(29, 18, 'v').d(34, 11, 'h').o('barrels', 35, 18).o('drum', 41, 13);
          b.r(9, 23, 35, 6, 'grate').d(14, 22, 'h').d(36, 22, 'h').o('pillar', 24, 24).o('pillar', 32, 25);
          b.r(45, 8, 16, 22, 'dark').d(44, 16, 'v').d(44, 25, 'v').r(45, 17, 16, 3, 'water').o('tank', 51, 9).o('crate', 49, 26).o('pump', 56, 22);
          b.ex(57, 17, 3, 3, 'OUTFLOW GATE');
          b.e('hnd', 24, 13, null, 'l').e('hnd', 25, 20, null, 'l');
          b.e('grd', 30, 4, 'pistol', 'd').e('grd', 36, 8, 'pipe', 'l');
          b.e('hnd', 40, 14, null, 'l').e('grd', 41, 19, 'smg', 'l');
          b.e('hnd', 20, 25, null, 'r').e('hnd', 30, 26, null, 'l').e('grd', 41, 26, 'pistol', 'l');
          b.e('brc', 55, 12, 'pump', 'l').e('grd', 57, 26, 'pistol', 'u').e('grd', 50, 21, 'pipe', 'l', { p: [[50, 21], [50, 14]] });
          b.i('pipe', 10, 13).i('smart', 31, 3).i('frag', 21, 3);
        } }
    ]
  },
  {
    name: 'DRY DISTRICT', sub: 'DISTRICT 9 SLUMS', par: 230, music: 4, bgHue: 30,
    msg: { who: 'NADIA REN // RADIO', text: "DISTRICT 9. THE RIVER USED TO RUN RIGHT THROUGH HERE.\nPEOPLE WEAR ORISON WORK IMPLANTS FOR WATER RATIONS.\n\nIF THEY ATTACK YOU, IT ISN'T THEM.\nKNOCK THEM DOWN AND LEAVE THEM - THE IMPLANT RESETS." },
    floors: [
      { name: 'SHANTY ROW', w: 64, h: 40, wall: ['#8a6a4a', '#d8c0a0'], tip: 'SCRAPPERS IN HARD HATS RUSH YOU. KEEP MOVING.',
        build(b) {
          b.r(2, 26, 8, 8, 'wood').st(5, 30, 'u').o('mattress', 3, 27);
          b.r(2, 17, 60, 8, 'asph').d(5, 25, 'h', 0, 'asph');
          b.o('car', 12, 18).o('dumpster', 24, 22).o('car', 38, 21).o('drum', 31, 18).o('drum', 50, 19).o('dumpster', 54, 18);
          b.r(2, 4, 10, 12, 'dirt').d(6, 16, 'h').o('mattress', 3, 5).o('drum', 10, 13);
          b.r(13, 4, 12, 12, 'wood').d(18, 16, 'h').d(12, 8, 'v').o('shelf', 14, 4).o('table', 19, 5);
          b.r(26, 4, 14, 12, 'dirt').d(32, 16, 'h').o('mattress', 37, 5).o('crate', 27, 12);
          b.r(41, 4, 21, 12, 'conc').d(46, 16, 'h').d(40, 10, 'v').o('tank', 52, 5).o('tank', 57, 5).o('crate', 44, 12);
          b.t(59, 13, "RATION DEPOT 9\nIMPLANT COMPLIANCE: 97%\nNON-COMPLIANT: NO WATER.", 'DEPOT TERMINAL');
          b.r(11, 26, 12, 11, 'wood').d(16, 25, 'h').o('mattress', 12, 33).o('table', 18, 27);
          b.r(24, 26, 16, 11, 'dirt').d(30, 25, 'h').o('mattress', 37, 32).o('crate', 25, 27);
          b.r(41, 26, 13, 11, 'wood').d(46, 25, 'h').o('shelf', 49, 35);
          b.r(55, 26, 7, 11, 'asph').d(57, 25, 'h', 0, 'asph').ex(56, 33, 5, 3, 'THE PIPE');
          b.e('wkr', 5, 9, 'pipe', 'r').e('wkr', 8, 12, 'machete', 'u');
          b.e('wkr', 16, 7, 'pipe', 'd').e('grd', 22, 10, 'pistol', 'l');
          b.e('wkr', 30, 8, 'pipe', 'r').e('wkr', 36, 12, 'pipe', 'l');
          b.e('grd', 50, 11, 'smg', 'l').e('grd', 58, 13, 'pipe', 'l').e('wkr', 44, 7, 'machete', 'r');
          b.e('wkr', 14, 30, 'pipe', 'u').e('wkr', 20, 34, 'pipe', 'l');
          b.e('grd', 34, 31, 'machete', 'l').e('wkr', 27, 34, 'machete', 'r');
          b.e('grd', 47, 32, 'pistol', 'u').e('wkr', 51, 28, 'pipe', 'l');
          b.e('grd', 30, 20, 'pipe', 'r', { p: [[30, 20], [48, 20], [48, 19], [20, 19]] });
          b.i('pipe', 8, 28).i('katana', 36, 13).i('emp', 7, 32);
        } },
      { name: 'THE PIPELINE', w: 64, h: 40, wall: ['#6a6a70', '#b8b8c0'], tip: 'CLEANERS (BLACK SUITS) SIDESTEP WHILE THEY SHOOT. AIM ASSIST LEADS THEM.',
        build(b) {
          b.r(2, 2, 8, 7, 'conc').st(5, 5, 'r');
          b.r(11, 2, 40, 6, 'plate').d(10, 4, 'v', 0, 'plate').o('pillar', 24, 3).o('pillar', 34, 4).o('crate', 44, 2);
          b.r(11, 10, 40, 18, 'asph').d(16, 8, 'h').d(44, 8, 'h');
          b.o('gen', 18, 13).o('car', 27, 15).o('dumpster', 40, 13).o('crate', 22, 22).o('barrels', 35, 22).o('drum', 45, 24);
          b.r(2, 10, 8, 18, 'wood').d(10, 14, 'v').d(10, 23, 'v').o('shelf', 3, 26).o('mattress', 6, 11);
          b.r(11, 29, 30, 9, 'conc').d(20, 28, 'h').d(34, 28, 'h').o('shelf', 14, 31).o('shelf', 14, 35).o('shelf', 24, 31).o('shelf', 24, 35).o('shelf', 33, 32);
          b.r(52, 2, 10, 36, 'plate').d(51, 4, 'v').d(51, 18, 'v').o('pump', 54, 10).o('pump', 54, 26).o('tank', 58, 18);
          b.t(57, 3, "PIPELINE 9 > ORISON COOLING STATION 4\nFLOW: 100% OF DISTRICT 9 RIVER.", 'FLOW METER');
          b.ex(54, 33, 7, 4, 'PIPE ACCESS');
          b.e('wkr', 20, 4, 'pipe', 'r').e('cln', 40, 5, 'pistol', 'l');
          b.e('grd', 24, 12, 'pistol', 'd').e('wkr', 32, 19, 'machete', 'l').e('wkr', 14, 24, 'pipe', 'u').e('hnd', 46, 18, null, 'l').e('grd', 38, 25, 'machete', 'u');
          b.e('wkr', 5, 15, 'pipe', 'r').e('grd', 6, 24, 'pipe', 'u');
          b.e('cln', 30, 33, 'pistol', 'l').e('grd', 18, 33, 'pipe', 'r').e('wkr', 37, 35, 'machete', 'u');
          b.e('brc', 57, 14, 'pump', 'l').e('grd', 58, 30, 'smg', 'u');
          b.i('pistol', 3, 12).i('emp', 7, 20);
        } }
    ]
  },
  {
    name: 'INTAKE', sub: 'ORISON COOLING STATION 4', par: 240, music: 5, bgHue: 170,
    msg: { who: 'NADIA REN // RADIO', text: "THIS IS WHERE THE RIVER ENDS - COOLING ORISON'S SERVERS.\n\nSET CHARGES ON THE INTAKE VALVES, THEN OPEN THE MAIN VALVE\nDOWNSTAIRS. THE WHOLE SERVER FLOOR GOES UNDER.\nBUT GET OUT FAST." },
    floors: [
      { name: 'PUMP HALL', w: 60, h: 40, wall: ['#7a8a96', '#c8d6e0'], tip: 'JUGGERNAUTS SHRUG OFF PUNCHES. 3 BULLETS, A SAW, OR A DOOR.',
        objs: [{ k: 'valve', n: 2, label: 'SET CHARGES ON THE VALVES' }],
        build(b) {
          b.r(2, 30, 6, 7, 'grate').st(4, 33, 'u');
          b.r(2, 14, 6, 15, 'plate').d(4, 29, 'h', 0, 'plate');
          b.r(9, 8, 32, 22, 'grate').d(8, 17, 'v').d(8, 25, 'v');
          b.o('tank', 13, 11).o('tank', 13, 23).o('tank', 24, 17).o('tank', 34, 11).o('tank', 34, 23).o('pump', 20, 12).o('pump', 28, 25);
          b.r(9, 2, 20, 5, 'plate').d(16, 7, 'h').sw(25, 3, 'valve', 'SET CHARGE').o('crate', 18, 2);
          b.r(42, 8, 16, 10, 'plate').d(41, 12, 'v').sw(54, 9, 'valve', 'SET CHARGE').o('crate', 45, 9).o('pump', 45, 14);
          b.r(42, 20, 16, 10, 'conc').d(41, 24, 'v').o('desk', 47, 21).o('server', 52, 21).o('server', 52, 27).o('shelf', 44, 28);
          b.t(55, 22, "COOLING STATION 4\nSOURCE: DISTRICT 9 RIVER\nRESIDENTS: NOT NOTIFIED.", 'CONTROL');
          b.r(52, 31, 6, 6, 'stairs').d(54, 30, 'h', 0, 'conc').ex(53, 32, 4, 4, 'STAIRS DOWN');
          b.e('grd', 5, 16, 'pipe', 'u');
          b.e('cln', 19, 20, 'pistol', 'l').e('grd', 30, 15, 'pipe', 'd').e('grd', 37, 19, 'smg', 'l').e('fat', 22, 27, 'pipe', 'u');
          b.e('grd', 12, 4, 'pistol', 'r').e('grd', 21, 5, 'machete', 'l');
          b.e('brc', 50, 15, 'pump', 'l').e('grd', 55, 13, 'pistol', 'u');
          b.e('grd', 50, 24, 'pistol', 'l').e('grd', 55, 27, 'pipe', 'u');
          b.i('pipe', 3, 32).i('smart', 6, 27).i('frag', 5, 22);
        } },
      { name: 'SERVER FLOOR', w: 60, h: 40, wall: ['#6a7a86', '#b8c8d4'], clear: 'obj', exitText: 'GET BACK TO THE SHAFT!',
        objs: [{ k: 'valve', n: 1, label: 'OPEN THE MAIN VALVE' }],
        onDone() {
          G.timer = { t: 30, label: 'GET OUT', lose: 'THE SERVER FLOOR WENT UNDER. SO DID YOU.' }; floodStart([[53, 18], [54, 18], [53, 19], [54, 19]], 34, 4.5, 4.5);
          banner('FLOOD!', '#3ff'); sfx('alarm'); RADIO("THE WHOLE DATA CENTER IS GOING UNDER.\nGET TO THE MAINTENANCE SHAFT!", 5);
          spawnWave([['cln', 'pistol'], ['grd', 'pipe'], ['grd', 'pistol']]);
        },
        build(b) {
          b.r(2, 2, 6, 6, 'grate').st(4, 4, 'r').ex(2, 2, 6, 6, 'THE SHAFT');
          b.r(9, 2, 40, 5, 'plate').d(8, 4, 'v', 0, 'plate').o('pillar', 22, 3).o('pillar', 36, 4).sp(46, 4);
          b.r(9, 8, 40, 22, 'plate').d(14, 7, 'h').d(40, 7, 'h');
          for (const y of [11, 15, 19, 23]) for (const x of [12, 15, 18, 26, 29, 32, 39, 42, 45]) b.o('server', x, y);
          b.r(50, 8, 8, 22, 'plate').d(49, 12, 'v').d(49, 24, 'v').sw(53, 18, 'valve', 'OPEN THE MAIN VALVE').o('pump', 51, 9).o('tank', 54, 25);
          b.r(9, 31, 40, 6, 'grate').d(20, 30, 'h').d(40, 30, 'h').o('pillar', 28, 32).sp(11, 33).sp(46, 34);
          b.t(47, 27, "SERVER FLOOR B - 4,096 RACKS\nCURRENT JOB: FEED_GENERATION\nTARGET: INMATE 4471 (YOU)", 'RACK MONITOR');
          b.e('grd', 30, 4, 'pipe', 'r', { p: [[30, 4], [44, 4], [44, 5], [16, 5]] });
          b.e('cln', 23, 13, 'smart', 'd').e('grd', 36, 21, 'pistol', 'l').e('grd', 16, 25, 'machete', 'u').e('brc', 44, 17, 'pump', 'l').e('hnd', 30, 27, null, 'l');
          b.e('grd', 55, 11, 'smg', 'd').e('fat', 52, 27, 'pipe', 'u');
          b.e('grd', 30, 34, 'pistol', 'l');
          b.i('pistol', 3, 6);
        } }
    ]
  },
  {
    name: 'SIGNAL FARM', sub: 'ORISON MEDIA - ANNEX 2', par: 260, music: 6, bgHue: 280,
    msg: { who: 'NADIA REN // RADIO', text: "EVERY SCREEN IN THE CITY IS PLAYING YOUR 'MURDER'.\nTHIS BUILDING IS WHERE THE LIE COMES FROM -\nRACKS OF PHONES RUNNING A MILLION FAKE ACCOUNTS.\n\nTEAR IT DOWN." },
    floors: [
      { name: 'CONTENT FLOOR', w: 64, h: 40, wall: ['#5a4a7a', '#b8a8e0'], tip: 'HIT OR SHOOT THE PHONE RACKS TO WRECK THEM.',
        objs: [{ k: 'rack', n: 10, label: 'WRECK THE PHONE RACKS' }],
        build(b) {
          b.r(2, 17, 5, 6, 'lift').st(4, 19, 'r');
          b.r(8, 14, 12, 12, 'carpet').d(7, 19, 'v', 0, 'carpet').o('sofa', 9, 15).o('plant', 18, 15).o('desk', 12, 20).o('vend', 17, 25);
          b.r(8, 2, 26, 11, 'tile').d(14, 13, 'h').d(27, 13, 'h'); for (const [x, y] of [[11, 5], [17, 5], [23, 5], [11, 9], [17, 9], [23, 9]]) b.rack(x, y); b.o('tvwall', 28, 2);
          b.r(8, 27, 26, 11, 'tile').d(14, 26, 'h').d(27, 26, 'h'); for (const [x, y] of [[11, 30], [17, 30], [23, 30], [11, 34], [17, 34], [23, 34]]) b.rack(x, y); b.o('tvwall', 28, 37);
          b.r(21, 14, 13, 12, 'carpet').d(20, 19, 'v').o('tvwall', 24, 14).o('pillar', 26, 19);
          b.r(35, 2, 22, 16, 'carpet').d(34, 7, 'v').d(34, 15, 'v').o('desk', 39, 4).o('desk', 47, 4).o('desk', 39, 10).o('desk', 47, 10).o('shelf', 51, 15).o('pillar', 53, 7);
          b.r(58, 2, 4, 6, 'stairs').d(57, 4, 'v', 0, 'carpet').ex(58, 3, 4, 4, 'ROOF ACCESS');
          b.r(35, 19, 27, 19, 'tile').d(34, 22, 'v').d(46, 18, 'h'); for (const [x, y] of [[38, 22], [38, 26], [44, 22], [44, 26]]) b.rack(x, y); b.o('tvwall', 52, 37).o('pillar', 50, 30);
          b.t(59, 20, "CAMPAIGN: 4471\nACCOUNTS ONLINE: 1,204,551\nSENTIMENT: GUILTY (94%)", 'CAMPAIGN DESK');
          b.e('grd', 15, 17, null, 'r').e('grd', 11, 23, 'pipe', 'u');
          b.e('cln', 29, 4, 'pistol', 'l').e('grd', 20, 7, 'pipe', 'r');
          b.e('grd', 29, 32, 'pistol', 'l').e('grd', 20, 36, 'machete', 'u');
          b.e('brc', 31, 19, 'pump', 'l').e('grd', 24, 23, 'pistol', 'u');
          b.e('cln', 45, 6, 'smart', 'd').e('grd', 40, 14, 'pipe', 'r').e('grd', 55, 12, null, 'l');
          b.e('grd', 53, 24, 'pistol', 'l').e('cln', 57, 33, 'pistol', 'u').e('grd', 42, 34, 'machete', 'r');
          b.i('pipe', 9, 24);
        } },
      { name: 'ROOFTOP', w: 64, h: 40, wall: ['#4a4a56', '#9a9aa8'], tip: 'WATCHERS (GREEN VISOR) SNIPE. MOVE WHEN THEIR LASER TURNS HOT.',
        objs: [{ k: 'xmit', n: 2, label: 'CUT THE TRANSMITTERS' }],
        onDone() { RADIO("SCREENS ARE GOING DARK ALL OVER THE CITY.\nGET TO THE HELIPAD.", 6); },
        build(b) {
          b.r(2, 2, 6, 6, 'conc').st(4, 4, 'd');
          // west roof wraps around a stair housing (the hole in the middle)
          b.r(2, 9, 24, 11, 'roof').r(2, 26, 24, 12, 'roof').r(2, 20, 8, 6, 'roof').r(16, 20, 10, 6, 'roof').d(4, 8, 'h', 0, 'roof');
          b.o('ac', 6, 12).o('tank', 13, 13).o('ac', 20, 16).o('ac', 18, 28).o('ac', 6, 33).o('dish', 19, 10).o('tank', 10, 30);
          b.r(27, 9, 35, 9, 'roof').r(27, 28, 35, 10, 'roof').r(27, 18, 12, 10, 'roof').r(46, 18, 16, 10, 'roof').gap(26, 15, 'v').gap(26, 30, 'v');
          b.r(51, 11, 7, 6, 'lift').ex(52, 12, 5, 4, 'HELIPAD');
          b.sw(33, 12, 'xmit', 'CUT TRANSMITTER').sw(55, 32, 'xmit', 'CUT TRANSMITTER');
          b.o('ac', 30, 22).o('tank', 38, 12).o('tank', 44, 13).o('ac', 49, 22).o('ac', 36, 32).o('dish', 44, 30).o('ac', 56, 24).o('ac', 30, 34).o('tank', 50, 30).o('tank', 33, 18);
          b.e('grd', 20, 22, 'pistol', 'r').e('grd', 20, 33, 'pipe', 'u').e('grd', 5, 18, null, 'd');
          b.e('snp', 59, 10, 'rifle', 'l').e('snp', 40, 36, 'rifle', 'u');
          b.e('cln', 48, 16, 'pistol', 'l').e('grd', 34, 25, 'pipe', 'l').e('brc', 52, 34, 'pump', 'l').e('grd', 31, 15, 'pipe', 'd');
          b.i('pistol', 7, 5).i('rail', 4, 36);
        } }
    ]
  },
  {
    name: 'THE PIT', sub: 'BELOW THE BRIGHTWELL CLEAN ENERGY PLANT', par: 260, music: 7, bgHue: 20,
    msg: { who: 'NADIA REN // RADIO', text: "THE 'CLEAN ENERGY' PLANT UPSTAIRS RUNS ON THIS MINE.\nTHEY'RE USING KIDS IN THE SEAMS.\n\nFIND THEM. ALL OF THEM." },
    floors: [
      { name: 'THE SEAMS', w: 64, h: 40, wall: ['#5a4030', '#a07a58'], tip: 'STAND AT A CAGE AND PRESS E TO FREE THE KIDS.',
        objs: [{ k: 'cage', n: 4, label: 'FREE THE KIDS' }],
        build(b) {
          b.r(2, 2, 6, 6, 'lift').st(4, 4, 'r');
          b.r(9, 3, 44, 4, 'rail').d(8, 4, 'v', 0, 'rail').o('beam', 15, 3).o('beam', 25, 6).o('beam', 38, 3).o('beam', 46, 6);
          b.r(9, 8, 16, 12, 'mud').d(13, 7, 'h').cage(20, 10, 'kids').o('beam', 15, 13).o('beam', 11, 10).o('cart', 21, 15);
          b.r(27, 8, 14, 12, 'mud').d(33, 7, 'h').cage(37, 16, 'kids').o('cart', 28, 9).o('beam', 35, 11);
          b.r(43, 8, 18, 12, 'mud').d(48, 7, 'h').cage(57, 10, 'kids').o('cart', 54, 15).o('beam', 46, 13);
          b.r(9, 21, 52, 4, 'rail').d(15, 20, 'h').d(34, 20, 'h').d(50, 20, 'h').o('beam', 25, 21).o('beam', 42, 24);
          b.r(9, 26, 30, 12, 'mud').d(20, 25, 'h').cage(12, 34, 'kids').o('beam', 18, 30).o('beam', 30, 29).o('cart', 33, 30);
          b.r(40, 26, 21, 12, 'plate').d(46, 25, 'h').d(39, 30, 'v').r(55, 28, 5, 5, 'lift').ex(55, 28, 5, 5, 'THE LIFT').o('crate', 44, 33).o('gen', 49, 28);
          b.t(23, 34, "SEAM 4 - SHIFT ROSTER\nWORKERS: 19 (UNDER 14: 19)\n'SMALL HANDS, SMALL TUNNELS.'", 'FOREMAN TABLET');
          b.e('grd', 20, 5, 'pipe', 'r', { p: [[20, 5], [48, 5], [48, 4], [14, 4]] });
          b.e('grd', 12, 15, 'pistol', 'r').e('hnd', 18, 17, null, 'u');
          b.e('fat', 32, 13, 'pipe', 'l').e('grd', 29, 17, null, 'u');
          b.e('brc', 52, 13, 'pump', 'l').e('grd', 47, 18, 'pistol', 'u');
          b.e('hnd', 30, 23, null, 'l').e('grd', 56, 22, 'pistol', 'l');
          b.e('fat', 25, 32, 'belt', 'u').e('grd', 34, 35, 'machete', 'l').e('grd', 15, 29, 'pistol', 'r');
          b.e('grd', 52, 31, 'smg', 'l').e('cln', 57, 35, 'smart', 'u');
          b.i('pipe', 3, 6).i('machete', 10, 18);
        } },
      { name: 'THE LANDING', w: 60, h: 36, wall: ['#5a4030', '#a07a58'], clear: 'obj', exitText: 'GET IN THE ELEVATOR!',
        objs: [{ k: 'console', n: 1, label: 'CALL THE ELEVATOR' }, { k: 'hold', n: 1, label: 'HOLD THE LANDING' }],
        hold: { t: 40, every: 5, doneText: 'THE ELEVATOR IS HERE', waves: [[['hnd'], ['hnd']], [['grd', 'pipe'], ['grd', null]], [['hnd'], ['grd', 'pistol']], [['fat', 'pipe']], [['hnd'], ['hnd'], ['grd', 'machete']], [['brc', 'pump']], [['grd', 'pipe'], ['hnd']], [['hnd'], ['grd', null]]] },
        onStart() { RADIO("THAT'S ALL OF THEM. THE ELEVATOR NEEDS A MINUTE\nTO BRING THEM UP. CALL IT, THEN HOLD THE LANDING.\nDON'T LET ANYTHING THROUGH.", 8); },
        build(b) {
          b.r(2, 15, 14, 6, 'rail').st(4, 17, 'r');
          b.r(2, 8, 14, 4, 'rail').sp(3, 9).sp(3, 10);
          b.r(17, 8, 25, 20, 'plate').d(16, 17, 'v', 0, 'plate').gap(16, 9, 'v');
          b.r(26, 2, 8, 5, 'lift').gap(29, 7, 'h').ex(27, 2, 6, 4, 'ELEVATOR');
          b.sw(36, 8, 'console', 'CALL THE ELEVATOR');
          b.o('crate', 20, 11).o('crate', 37, 22).o('cart', 22, 20).o('pillar', 29, 16).o('barrels', 38, 13).o('beam', 25, 25).o('beam', 34, 25);
          b.r(43, 10, 16, 4, 'rail').gap(42, 11, 'v').sp(57, 11).sp(57, 12);
          b.r(26, 29, 6, 6, 'rail').gap(28, 28, 'h').sp(28, 33).sp(29, 33);
          b.e('grd', 25, 12, 'pipe', 'l').e('grd', 36, 24, 'pistol', 'l').e('hnd', 47, 12, null, 'l').e('grd', 20, 24, null, 'u');
          b.i('pistol', 5, 19).i('machete', 9, 16).i('rocket', 13, 18).i('frag', 11, 19);
        } }
    ]
  },
  {
    name: 'CONTAINERS', sub: 'PORT OSTRA CONTAINER TERMINAL', par: 280, music: 8, bgHue: 210,
    msg: { who: 'NADIA REN // RADIO', text: "THE PORT. ORISON SHIPS PEOPLE IN THESE CONTAINERS LIKE CARGO.\n\nOPEN THEM ALL, THEN GET ON THE CARGO SHIP.\nIT SAILS FOR THE RETREAT TONIGHT." },
    floors: [
      { name: 'CONTAINER YARD', w: 64, h: 40, wall: ['#3a4a5a', '#8aa0b8'], tip: 'OPEN EACH CONTAINER FROM ITS DOORS (THE YELLOW LATCH).',
        objs: [{ k: 'cage', n: 4, label: 'OPEN THE CONTAINERS' }],
        build(b) {
          b.r(2, 2, 7, 6, 'conc').st(5, 4, 'd').t(7, 3, "MANIFEST - BERTH 6\nCARGO: 'LABOUR UNITS' x 48\nDESTINATION: THE RETREAT", 'GATEHOUSE');
          b.r(2, 9, 60, 29, 'asph').d(5, 8, 'h', 0, 'asph');
          for (const [k, x, y] of [['contb', 12, 11], ['contr', 12, 23], ['contg', 12, 29], ['contr', 26, 11], ['contb', 26, 17], ['contg', 26, 23], ['contb', 40, 17], ['contr', 40, 29]]) b.o(k, x, y);
          b.cage(12, 17, 'cont').cage(26, 29, 'cont').cage(40, 11, 'cont').cage(40, 23, 'cont');
          b.o('crate', 54, 20).o('crate', 52, 30).o('barrels', 6, 25).o('drum', 56, 12);
          b.ex(56, 34, 5, 3, 'THE GANTRY');
          b.e('grd', 22, 15, 'pistol', 'd').e('grd', 36, 20, 'pipe', 'l').e('cln', 36, 32, 'smart', 'u').e('brc', 50, 14, 'pump', 'l');
          b.e('grd', 22, 27, 'machete', 'r').e('hnd', 8, 31, null, 'u').e('hnd', 50, 34, null, 'l').e('snp', 59, 24, 'rifle', 'l').e('grd', 8, 20, 'pistol', 'r');
          b.i('pipe', 3, 11).i('belt', 58, 30);
        } },
      { name: 'THE GANTRY', w: 64, h: 40, wall: ['#3a4a5a', '#8aa0b8'], crane: true, tip: 'PRESS E AT THE CRANE CONSOLE WHEN THE TWINS ARE ON THE STRIPES.',
        onStart() { RADIO("TWO JUGGERNAUTS. YOU CAN'T OUTGUN THEM - USE THE CRANE.\nTHE CONSOLE IS BY THE GATE. LURE THEM ONTO\nTHE STRIPED ZONE AND DROP A CONTAINER.", 10); },
        build(b) {
          b.r(2, 16, 6, 8, 'conc').st(4, 19, 'r');
          b.r(9, 6, 40, 28, 'asph').d(8, 19, 'v', 0, 'asph').zn(24, 14, 12, 10);
          b.sw(12, 7, 'console', 'DROP A CONTAINER');
          b.o('crate', 14, 27).o('crate', 41, 9).o('drum', 18, 11).o('drum', 44, 30).o('barrels', 30, 29);
          b.r(50, 10, 12, 20, 'deck').gap(49, 18, 'v').ex(55, 15, 6, 10, 'THE SHIP');
          b.e('grd', 20, 30, 'pistol', 'u').e('grd', 40, 28, 'pipe', 'l');
          b.e('twin', 44, 17, 'saw', 'l').e('twin2', 45, 24, 'smg', 'l');
          b.i('pump', 5, 21).i('pistol', 12, 31).i('rail', 5, 17).i('rocket', 3, 17);
        } }
    ]
  }
);
