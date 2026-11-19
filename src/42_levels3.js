// ---------- Act 2: The Retreat, levels 9-12 (from the design doc) ----------
LEVELS.push(
  {
    name: 'CROSSING', sub: 'ACT 2 - THE CARGO SHIP, IN A STORM', par: 240, music: 9, bgHue: 220, act: 2,
    msg: { who: 'ACT 2: THE RETREAT  //  NADIA REN', text: "YOU'RE IN THE HOLD OF THE SHIP BOUND FOR THE RETREAT.\nTHE CREW ARE ORISON SECURITY. THE STORM WILL COVER THE NOISE.\n\nWATCH FOR RIOT UNITS - SHIELDS UP FRONT.\nGET TO THE BRIDGE BEFORE WE MAKE LANDFALL." },
    floors: [
      { name: 'CARGO HOLD', w: 64, h: 40, wall: ['#5a6068', '#9aa2ac'], tip: 'RIOT UNITS BLOCK HITS FROM THE FRONT. FLANK THEM, OR USE A DOOR, A GRENADE OR THE RAIL GUN.',
        build(b) {
          b.r(2, 2, 10, 8, 'plate').st(6, 6, 'd').o('bunk', 3, 3).o('locker', 10, 2).i('frag', 9, 8);
          b.r(2, 11, 10, 27, 'plate').d(6, 10, 'h', 0, 'plate');
          b.r(13, 2, 22, 17, 'deck').d(12, 6, 'v').d(12, 14, 'v').o('contb', 15, 4).o('contr', 25, 4).o('crate', 16, 12).o('crate', 22, 14).o('crate', 29, 11).o('barrels', 32, 15);
          b.r(36, 2, 26, 17, 'deck').d(35, 10, 'v').o('cont', 38, 4).o('contg', 50, 4).o('crate', 40, 12).o('crate', 54, 13).i('belt', 59, 16);
          b.r(13, 20, 49, 8, 'grate').d(20, 19, 'h').d(48, 19, 'h').d(12, 24, 'v').o('pump', 17, 21).o('pump', 28, 25).o('gen', 40, 21).o('tank', 52, 22);
          b.r(13, 29, 20, 8, 'plate').d(18, 28, 'h').o('shelf', 15, 31).o('shelf', 22, 34).i('rail', 31, 35);
          b.r(50, 29, 12, 8, 'plate').d(55, 28, 'h').ex(56, 31, 5, 5, 'DECK HATCH');
          b.t(3, 9, "CARGO: GALA SUPPLIES\n200 BOTTLES, 40 STAFF UNIFORMS,\n1 'GUEST LIST' (SEALED).", 'MANIFEST');
          b.e('grd', 6, 30, 'pipe', 'd', { p: [[6, 30], [6, 36], [9, 36], [9, 30]] });
          b.e('rio', 24, 10, 'pistol', 'l').e('grd', 18, 16, 'pipe', 'u').e('grd', 31, 17, 'pistol', 'l');
          b.e('fat', 46, 10, 'pipe', 'l').e('grd', 58, 8, 'smg', 'l').e('rio', 52, 15, 'pistol', 'l');
          b.e('grd', 24, 23, 'machete', 'r').e('brc', 45, 25, 'pump', 'l').e('grd', 58, 26, 'pistol', 'u');
          b.e('grd', 16, 33, null, 'r').e('grd', 28, 32, 'pistol', 'l');
        } },
      { name: 'UPPER DECK', w: 64, h: 40, wall: ['#4a5058', '#8a929c'], storm: true, tip: 'IT IS POURING. WATCHERS STILL SEE YOU IN THE LIGHTNING.',
        build(b) {
          b.r(2, 16, 6, 6, 'plate').st(4, 18, 'r');
          b.r(9, 4, 44, 30, 'deck').d(8, 18, 'v', 0, 'plate');
          // container rows split the deck into three lanes; you cross between them at the gaps
          b.o('contb', 12, 10).o('contr', 24, 10).o('cont', 40, 10).o('contg', 12, 26).o('contb', 24, 26).o('contr', 40, 26);
          b.o('lifeboat', 14, 5).o('lifeboat', 30, 31).o('crane2', 34, 17).o('crate', 18, 16).o('crate', 28, 21).o('barrels', 44, 19).o('crate', 46, 5).o('crate', 46, 30);
          b.r(54, 10, 8, 18, 'plate').d(53, 18, 'v').o('desk', 56, 11).o('console', 59, 20).o('shelf', 55, 26).ex(55, 14, 6, 5, 'THE BRIDGE');
          b.e('grd', 20, 6, 'pipe', 'r').e('snp', 50, 6, 'rifle', 'l');
          b.e('rio', 30, 15, 'pistol', 'l').e('rio', 30, 22, 'pistol', 'l').e('grd', 44, 16, 'machete', 'l');
          b.e('brc', 44, 31, 'pump', 'l').e('grd', 22, 31, 'pistol', 'u');
          b.e('grd', 58, 13, 'pistol', 'd').e('cln', 59, 24, 'smart', 'u');
          b.i('frag', 5, 20);
        } }
    ]
  },
  {
    name: 'LANDFALL', sub: 'ACT 2 - THE ISLAND SHORE, NIGHT', par: 240, music: 10, bgHue: 240, act: 2,
    msg: { who: 'NADIA REN // RADIO', text: "THE ISLAND. ORISON'S PLAYGROUND FOR THE CITY'S ELITE.\nIT'S DARK: OUT OF THE LIGHT, GUARDS ONLY SEE WHAT THEIR FLASHLIGHT HITS.\n\nDON'T RUN PAST THE BIRDS. AND THE HOUNDS HERE WEAR CAMO -\nYOU WON'T SEE THEM UNTIL THEY'RE CLOSE." },
    floors: [
      { name: 'THE BEACH', w: 64, h: 40, wall: ['#2e3238', '#5a5e66'], night: true, tip: 'STAY OUT OF THE LAMP LIGHT AND FLASHLIGHT BEAMS. WALK PAST BIRDS - DON\'T RUN.',
        build(b) {
          b.r(2, 30, 10, 8, 'sand').st(6, 32, 'u').o('boat', 3, 35);
          b.r(2, 8, 58, 21, 'sand').gap(5, 29, 'h', 'sand');
          for (const [x, y] of [[10, 22], [18, 12], [26, 24], [34, 15], [42, 21], [50, 11], [14, 16], [56, 25], [30, 9]]) b.o('boulder', x, y);
          b.lamp(31, 12, 64).lamp(52, 22, 56);
          b.bird(16, 25, 5).bird(30, 19, 5).bird(44, 26, 4).bird(22, 10, 4).bird(8, 12, 4);
          b.r(24, 2, 12, 5, 'wood').d(29, 7, 'h').o('table', 25, 3).i('emp', 34, 3);
          b.r(52, 30, 10, 8, 'sand').gap(56, 29, 'h', 'sand').ex(55, 33, 6, 4, 'CLIFF PATH');
          b.e('grd', 20, 20, 'pistol', 'r', { p: [[20, 20], [36, 20], [36, 18], [20, 18]] }).e('grd', 30, 13, 'pipe', 'd').e('ghd', 40, 25, null, 'l').e('grd', 48, 15, 'pistol', 'l').e('ghd', 54, 19, null, 'u');
          b.e('grd', 27, 4, 'smg', 'r').e('grd', 33, 5, null, 'l');
          b.i('knife', 8, 33);
        } },
      { name: 'PERIMETER', w: 64, h: 40, wall: ['#2e3238', '#5a5e66'], night: true, tip: 'FLOODLIGHTS COVER THE GAPS IN THE FENCE. WATCHERS\' LASERS SHOW WHERE THEY LOOK.',
        build(b) {
          b.r(2, 2, 8, 8, 'rock').st(5, 5, 'd');
          b.r(2, 11, 24, 27, 'sand').gap(5, 10, 'h', 'sand').o('boulder', 8, 16).o('boulder', 16, 22).o('boulder', 6, 30).o('boulder', 18, 32).bird(10, 25, 4).bird(20, 15, 4).lamp(12, 13, 44);
          b.r(27, 4, 10, 34, 'conc').gap(26, 15, 'v', 'conc').gap(26, 30, 'v', 'conc').lamp(29, 16, 64).lamp(29, 31, 64).o('crate', 32, 8).o('pillar', 31, 25);
          b.r(38, 4, 24, 12, 'conc').d(37, 8, 'v').lamp(42, 12, 40).o('bunk', 48, 5).o('bunk', 51, 5).o('locker', 58, 12).o('crate', 40, 5);
          b.r(38, 17, 24, 8, 'asph').d(37, 20, 'v').d(45, 16, 'h').lamp(50, 21, 48).o('van', 44, 18).o('gen', 55, 22);
          b.r(38, 26, 24, 12, 'dirt').d(37, 30, 'v').d(45, 25, 'h').lamp(54, 31, 48).o('crate', 41, 33).o('barrels', 48, 28).o('crate', 57, 34);
          b.ex(59, 18, 3, 5, 'THE GATE');
          b.e('grd', 14, 26, 'pistol', 'r').e('ghd', 20, 34, null, 'u').e('grd', 16, 21, 'pipe', 'r', { p: [[16, 21], [23, 21]] });
          b.e('rio', 32, 22, 'pistol', 'l').e('grd', 33, 11, 'pipe', 'd');
          b.e('grd', 44, 8, 'smg', 'r').e('brc', 55, 10, 'pump', 'l').e('snp', 60, 5, 'rifle', 'l');
          b.e('grd', 51, 20, 'pistol', 'l');
          b.e('ghd', 44, 30, null, 'l').e('ghd', 51, 34, null, 'l').e('snp', 60, 36, 'rifle', 'l').e('grd', 56, 29, 'pistol', 'l');
          b.i('frag', 3, 12).i('revolver', 22, 36);
        } }
    ]
  },
  {
    name: 'THE GALA', sub: 'ACT 2 - THE RETREAT MANSION', par: 260, music: 11, bgHue: 320, act: 2,
    msg: { who: 'NADIA REN // RADIO', text: "THE GALA. THE CITY'S ELITE, ALL IN ONE ROOM.\nYOU'RE IN A STAFF UNIFORM. NOBODY LOOKS AT THE STAFF.\n\nSTAY OUT OF THE RED AREAS. A GUNSHOT, OR A KILL A GUARD SEES,\nBLOWS YOUR COVER. THE HANDLER RUNS THIS PARTY. FIND HIM." },
    floors: [
      { name: 'BALLROOM', w: 64, h: 40, wall: ['#c8b890', '#fff4d8'], disguise: true, tip: 'UNDERCOVER: GUARDS IGNORE YOU UNTIL YOU GIVE THEM A REASON. TAKE THEM OUT WHERE NOBODY CAN SEE.',
        build(b) {
          b.r(2, 26, 14, 11, 'tile').st(5, 30, 'r').o('counter', 4, 34).o('counter', 9, 27).o('sink', 14, 26).i('knife', 8, 32);
          b.r(2, 2, 14, 11, 'carpet').o('shelf', 3, 2).o('shelf', 9, 2).o('locker', 14, 6).o('locker', 14, 9);
          b.r(2, 14, 6, 11, 'tile').d(4, 13, 'h', 0, 'tile').d(4, 25, 'h', 0, 'tile');
          b.r(17, 8, 30, 22, 'marble').r(23, 13, 18, 12, 'rug').d(16, 28, 'v', 0, 'tile').d(16, 9, 'v', 0, 'carpet');
          b.o('piano', 19, 10).o('bar', 35, 9).o('statue', 18, 28).o('statue', 45, 28).o('ltable', 24, 26).o('ltable', 33, 26).o('pillar', 21, 19).o('pillar', 42, 19);
          for (const [x, y] of [[25, 14], [28, 17], [31, 13], [34, 18], [38, 15], [27, 22], [32, 23], [37, 22], [41, 24], [22, 24], [30, 20], [40, 12]]) b.guest(x, y);
          b.r(48, 8, 14, 9, 'conc').d(47, 12, 'v').restrictZone(48, 8, 14, 9).o('desk', 52, 9).o('server', 59, 13).o('server', 59, 15).i('rail', 60, 9);
          b.t(50, 15, "SECURITY NOTE: THE HANDLER WANTS EVERY\nGUEST FILMED IN SUITE 4 TONIGHT.\nCAMERAS 11-19 TO THE VIP WING.", 'SECURITY DESK');
          b.r(48, 18, 14, 12, 'rug').d(47, 24, 'v').o('sofa', 50, 19).o('sofa', 55, 28).o('plant', 60, 18).guest(52, 22).guest(56, 25).guest(59, 21);
          b.r(48, 31, 8, 6, 'stairs').d(51, 30, 'h', 0, 'rug').restrictZone(48, 31, 8, 6).ex(49, 32, 6, 4, 'VIP STAIRS');
          b.e('grd', 20, 15, 'pistol', 'r').e('grd', 44, 14, 'pipe', 'l').e('grd', 32, 10, 'pipe', 'd').e('cln', 43, 26, 'smart', 'u');
          b.e('grd', 55, 10, 'smg', 'l').e('grd', 58, 14, null, 'u').e('grd', 55, 19, 'pistol', 'd').e('grd', 6, 6, 'pipe', 'r');
        } },
      { name: 'VIP WING', w: 60, h: 36, wall: ['#b8a880', '#f4e8c8'], tip: 'THE HANDLER: TOUGH, FAST, SMART GUN. CLEAR HIS GUARDS FIRST.',
        build(b) {
          b.r(2, 15, 5, 6, 'stairs').st(4, 17, 'r');
          b.r(8, 14, 30, 8, 'marble').d(7, 17, 'v', 0, 'marble').o('statue', 14, 15).o('statue', 20, 20).o('statue', 26, 15).o('statue', 32, 20);
          b.r(8, 2, 14, 11, 'rug').d(14, 13, 'h').o('bed', 9, 3).o('sofa', 15, 10).r(23, 2, 15, 11, 'rug').d(30, 13, 'h').o('bed', 34, 3).o('sofa', 24, 10);
          b.r(8, 23, 30, 11, 'carpet').d(16, 22, 'h').d(30, 22, 'h').o('bar', 10, 24).o('piano', 32, 30).o('pillar', 22, 27);
          b.r(39, 4, 19, 29, 'rug').d(38, 17, 'v').d(38, 27, 'v').o('piano', 42, 6).o('sofa', 48, 8).o('sofa', 48, 28).o('statue', 40, 31).o('statue', 56, 5);
          for (const [x, y] of [[44, 13], [44, 21], [52, 13], [52, 21]]) b.o('pillar', x, y);
          b.t(23, 9, "SUITE 4 - RECORDING LOG\nGUEST 0291: 3H 12M\nGUEST 0377: 1H 48M\nALL FILES TO THE ARCHIVE.", 'SUITE CAMERA');
          b.ex(54, 29, 3, 3, 'SERVICE LIFT');
          b.e('grd', 24, 17, 'pistol', 'u').e('grd', 33, 18, 'pipe', 'l');
          b.e('tec', 12, 6, null, 'r').e('grd', 18, 9, 'pistol', 'l').e('brc', 28, 6, 'pump', 'r').e('grd', 34, 10, null, 'l');
          b.e('grd', 12, 30, 'smg', 'r').e('cln', 33, 27, 'smart', 'l').e('rio', 24, 26, 'pistol', 'u');
          b.e('hdl', 52, 18, 'smart', 'l').e('grd', 55, 10, 'pistol', 'l').e('grd', 55, 26, 'machete', 'l');
          b.i('frag', 5, 20).i('katana', 10, 19);
        } }
    ]
  },
  {
    name: 'STAFF QUARTERS', sub: 'ACT 2 - BELOW THE MANSION', par: 260, music: 12, bgHue: 100, act: 2,
    msg: { who: 'NADIA REN // RADIO', text: "UNDER THE MANSION: SERVICE TUNNELS WHERE THE STAFF LIVE AS PRISONERS.\nTHE REGISTRY PAGES DOWN HERE NAME THE PEOPLE WHO MATTER.\n\nFIELD TECHNICIANS CAN PATCH THE DEAD BACK UP.\nKILL THE TECHNICIANS FIRST. AND FREE THE STAFF." },
    floors: [
      { name: 'SERVICE TUNNELS', w: 64, h: 40, wall: ['#6a6a5a', '#b0b09a'], tip: 'FIELD TECHNICIANS (WHITE COATS) REVIVE BODIES. KILL THEM FIRST - OR LEAVE NOTHING TO REVIVE.',
        build(b) {
          b.r(2, 2, 6, 6, 'lift').st(4, 4, 'r');
          b.r(9, 2, 50, 5, 'conc').d(8, 4, 'v', 0, 'conc').o('pillar', 20, 3).o('pillar', 36, 4).o('pillar', 50, 3);
          b.r(9, 8, 16, 12, 'tile').d(14, 7, 'h').o('shelf', 10, 9).o('shelf', 16, 17).o('crate', 21, 9);
          b.r(26, 8, 18, 12, 'grate').d(32, 7, 'h').d(25, 13, 'v').o('tank', 28, 10).o('tank', 37, 14).o('pump', 39, 9);
          b.r(45, 8, 14, 12, 'tile').d(50, 7, 'h').d(44, 13, 'v').o('shelf', 46, 17).o('shelf', 53, 9);
          b.r(9, 21, 50, 5, 'conc').d(16, 20, 'h').d(35, 20, 'h').d(52, 20, 'h').o('pillar', 28, 22);
          b.r(9, 27, 50, 10, 'conc').d(20, 26, 'h').d(44, 26, 'h').o('crate', 14, 30).o('shelf', 24, 29).o('shelf', 24, 33).o('crate', 38, 32).o('shelf', 46, 34).ex(54, 28, 4, 4, 'DORMITORIES');
          b.e('grd', 28, 4, 'pipe', 'r', { p: [[28, 4], [46, 4], [46, 5], [14, 5]] }).e('tec', 44, 5, null, 'l');
          b.e('grd', 12, 15, 'pistol', 'r').e('grd', 21, 12, 'machete', 'l');
          b.e('fat', 34, 17, 'pipe', 'u').e('tec', 30, 18, null, 'r').e('grd', 41, 17, 'pistol', 'l');
          b.e('rio', 51, 14, 'pistol', 'l').e('grd', 56, 10, null, 'd');
          b.e('grd', 24, 23, 'pistol', 'l').e('tec', 46, 23, null, 'l');
          b.e('grd', 30, 31, 'smg', 'r').e('brc', 50, 33, 'pump', 'l');
          b.i('pipe', 5, 6).i('knife', 22, 4);
        } },
      { name: 'DORMITORIES', w: 64, h: 40, wall: ['#6a6a5a', '#b0b09a'], tip: 'STAND AT A CELL AND PRESS E TO LET THE STAFF OUT.',
        objs: [{ k: 'cage', n: 4, label: 'FREE THE STAFF' }],
        build(b) {
          b.r(2, 16, 6, 6, 'conc').st(4, 18, 'r');
          b.r(9, 15, 46, 8, 'conc').d(8, 18, 'v', 0, 'conc').o('pillar', 18, 16).o('pillar', 30, 20).o('pillar', 42, 16);
          b.r(9, 3, 14, 11, 'cell').d(15, 14, 'h').o('bunk', 10, 4).o('bunk', 13, 4).cage(19, 5);
          b.r(24, 3, 14, 11, 'cell').d(30, 14, 'h').o('bunk', 25, 4).o('bunk', 25, 9).cage(34, 9);
          b.r(39, 3, 16, 11, 'cell').d(46, 14, 'h').o('bunk', 40, 4).o('bunk', 44, 4).cage(50, 5);
          b.r(9, 24, 22, 13, 'tile').d(18, 23, 'h').o('ltable', 11, 27).o('ltable', 11, 32).cage(27, 33);
          b.r(32, 24, 23, 13, 'carpet').d(42, 23, 'h').o('desk', 36, 26).o('shelf', 46, 34).o('shelf', 51, 34).o('pillar', 44, 28);
          b.t(38, 26, "REGISTRY PAGE 14\nGUEST 0291 - COUNCILLOR A. VOSS\nLEVERAGE: FOOTAGE, SUITE 4. STATUS: COMPLIANT.\nGUEST 0377 - JUDGE M. OKAFOR. STATUS: PENDING.", 'REGISTRY');
          b.r(56, 15, 6, 8, 'lift').d(55, 18, 'v', 0, 'lift').ex(57, 16, 4, 6, 'OBSERVATION LIFT');
          b.e('grd', 25, 18, 'pipe', 'r', { p: [[25, 18], [38, 18]] }).e('tec', 40, 20, null, 'l');
          b.e('grd', 12, 10, 'pistol', 'r').e('fat', 28, 7, 'pipe', 'r').e('tec', 42, 10, null, 'r').e('grd', 52, 11, 'pistol', 'l');
          b.e('grd', 14, 30, 'machete', 'r').e('rio', 22, 28, 'pistol', 'u');
          b.e('cln', 48, 30, 'smart', 'l').e('grd', 36, 34, 'pistol', 'u').e('tec', 51, 27, null, 'd');
          b.i('emp', 5, 20).i('pump', 6, 17);
        } }
    ]
  }
);
