// ---------- JOBS: loud heists, played from the JOBS menu (kept after the story levels so chapter numbers don't move) ----------
const COPS = { grd: ['grd', 'smg'], grdp: ['grd', 'pistol'], brc: ['brc', 'pump'], rio: ['rio', 'pistol'], fat: ['fat', 'pump'], hnd: ['hnd', null], cln: ['cln', 'smg'] };
const W_ = (...k) => k.map(q => COPS[q]);
LEVELS.push(
  {
    name: 'TIDEWATER VAULT', job: true, assets: ['stash', 'nades', 'keycopy', 'drill2'], fee: 15000, sub: 'BANK JOB - DRILL THE VAULT, BAG THE MONEY', par: 330, music: 3, bgHue: 200,
    pitch: 'A PRIVATE BANK THAT WASHES ORISON MONEY. KEYCARD, DRILL, BAGS, VAN.',
    msg: { who: 'JOB  //  TIDEWATER VAULT', text: "TIDEWATER PRIVATE BANK. ORISON WASHES ITS MONEY HERE.\nTHE MANAGER'S BODYGUARD CARRIES THE KEYCARD FOR THE SECURITY GATE.\nSET THE DRILL ON THE VAULT DOOR - IT WILL JAM, FIX IT.\n\nBAG THE MONEY, CARRY IT TO THE VAN. BAGS SLOW YOU DOWN.\nE TO BAG, E AGAIN TO THROW. MORE BAGS, BIGGER CUT." },
    floors: [
      { name: 'THE BANK', w: 60, h: 38, wall: ['#7a5a3a', '#c8a878'], clear: 'obj', noWeak: true, exitText: 'GRAB MORE BAGS FOR A BIGGER CUT - OR GET IN THE VAN',
        tip: 'KILL THE BODYGUARD IN THE MANAGER\'S OFFICE (LEFT) FOR THE KEYCARD.',
        objs: [{ k: 'key', n: 1, label: 'GET THE KEYCARD' }, { k: 'gate', n: 1, label: 'OPEN THE SECURITY GATE' }, { k: 'drill', n: 1, label: 'DRILL THE VAULT' }, { k: 'bag', n: 4, label: 'SECURE THE BAGS' }],
        assault: { at: 70, every: 6, cap: 8, len: 30, rest: 18, waves: [W_('grd', 'grdp'), W_('brc', 'grdp'), W_('grdp', 'grd', 'hnd'), W_('grd', 'grd', 'brc')], heavy: W_('fat', 'rio') },
        on(k) { if (k === 'drillStart') startAssault(); },
        build(b) {
          b.r(2, 2, 11, 8, 'lino').r(14, 2, 14, 8, 'conc').r(29, 2, 14, 8, 'plate').r(28, 4, 1, 3, 'plate').r(44, 2, 14, 8, 'dark');
          b.r(2, 11, 56, 4, 'check');
          b.r(2, 16, 11, 13, 'carpet').r(14, 16, 30, 13, 'marble').r(45, 16, 13, 13, 'lino');
          b.r(2, 30, 56, 6, 'asph');
          b.d(6, 10, 'h').d(50, 10, 'h').gap(20, 10, 'h').gate('sec', 20, 10, 2, 1, 'key').gate('vault', 28, 4, 1, 3, 'vault').drill(26, 5, 'vault', 45);
          b.d(7, 15, 'h').d(20, 15, 'h').d(37, 15, 'h').d(51, 15, 'h').d(13, 22, 'v').d(44, 22, 'v').d(26, 29, 'h').d(31, 29, 'h').d(51, 29, 'h');
          // staff room, antechamber, vault, servers
          b.o('table', 5, 4).o('vend', 2, 2).o('locker', 11, 2).o('locker', 12, 2);
          b.o('crate', 15, 7).o('drum', 18, 3).o('drum', 24, 8);
          b.o('shelf', 31, 2).o('shelf', 37, 2).loot(31, 5, 'cash', 2).loot(35, 5, 'gold', 2).loot(39, 5, 'cash', 2).loot(33, 8, 'bonds', 1).loot(38, 8, 'gold', 1);
          b.o('server', 46, 3).o('server', 46, 6).o('server', 52, 3).o('server', 52, 6);
          // manager's office, lobby, security
          b.i('bat', 4, 20).o('desk', 5, 18).o('sofa', 3, 26).o('shelf', 8, 27).o('plant', 12, 16).t(3, 18, "VAULT DOOR: CLASS 9 BOLTWORK.\nA THERMAL DRILL GETS THROUGH IN UNDER A MINUTE.\nIT OVERHEATS. SOMEONE HAS TO KICK IT.", 'MANAGER\'S NOTES');
          b.o('counter', 17, 19).o('counter', 35, 19).o('pillar', 25, 23).o('pillar', 32, 23).o('bench', 17, 25).o('bench', 38, 25).o('plant', 14, 28).o('plant', 43, 28).o('plant', 14, 16).o('plant', 43, 16);
          b.o('desk', 48, 18).o('tvwall', 52, 16).o('locker', 57, 20).o('locker', 57, 23).o('table', 50, 24);
          // the street and the van
          b.o('van', 5, 31).secure(2, 31, 3, 3, 'LOAD HERE').ex(11, 31, 2, 3, 'THE VAN').o('car', 20, 33).o('car', 42, 30).o('dumpster', 54, 30).st(30, 33, 'u');
          b.e('grd', 35, 31, 'pistol', 'r');
          b.e('grd', 20, 17, 'pistol', 'd').e('grd', 38, 17, 'smg', 'd').e('grd', 29, 26, 'pipe', 'l').e('brc', 16, 27, 'pump', 'r');
          b.e('grd', 9, 21, 'pistol', 'l', { key: 1 }).e('grd', 4, 23, 'machete', 'r');
          b.e('grd', 49, 21, 'smg', 'l').e('grd', 54, 26, 'pistol', 'u');
          b.e('grd', 12, 12, 'pistol', 'r').e('brc', 45, 13, 'pump', 'l');
          b.e('fat', 23, 6, 'pipe', 'l').e('grd', 16, 4, 'pistol', 'r').e('grd', 8, 6, 'pipe', 'l').e('grd', 49, 5, 'pistol', 'r');
          b.sp(57, 32).sp(57, 35).sp(2, 12).sp(57, 12).sp(40, 35);
        } }
    ]
  },
  {
    name: 'CONVOY BREACH', job: true, assets: ['stash', 'nades', 'fastvan'], fee: 12000, sub: 'ARMORED TRUCK - ON THE ELEVATED HIGHWAY', par: 300, music: 5, bgHue: 25,
    pitch: 'AN ORISON ARMORED TRUCK STOPPED ON THE OVERPASS. BLOW THE DOORS, DROP THE CASES.',
    msg: { who: 'JOB  //  CONVOY BREACH', text: "AN ORISON CASH TRUCK IS STUCK ON THE EAST OVERPASS. THE ESCORT IS STILL ON IT.\nPLANT THE CHARGE ON THE REAR DOORS, THEN BACK OFF.\n\nTHROW THE CASH CASES OVER THE RAIL AT THE DROP ZONE - OUR BOAT IS UNDERNEATH.\nTHE VAN NEEDS TIME TO GET UP THE RAMP. HOLD THE OVERPASS." },
    floors: [
      { name: 'EAST OVERPASS', w: 72, h: 30, wall: ['#6a6862', '#b4b2aa'], barrier: true, lanes: [[9.5, 2, 70], [14.5, 2, 70, 1], [20.5, 2, 70]], clear: 'obj', vanArrives: true, exitText: 'THE VAN IS ON THE RAMP - GET IN',
        tip: 'PLANT THE CHARGE AT THE BACK OF THE ARMORED TRUCK (E), THEN GET CLEAR.',
        objs: [{ k: 'c4', n: 1, label: 'BLOW THE TRUCK DOORS' }, { k: 'bag', n: 4, label: 'DROP THE CASES' }, { k: 'van', n: 1, label: 'HOLD FOR THE VAN' }],
        assault: { at: 60, every: 5.5, cap: 9, len: 32, rest: 16, waves: [W_('grd', 'grdp'), W_('brc', 'grd'), W_('grdp', 'grdp', 'hnd'), W_('rio', 'grd')], heavy: W_('fat', 'rio', 'cln') },
        on(k) { if (k === 'c4') { heistCount({ t: 75 - (G.vanFast || 0), label: 'VAN ETA', k: 'van', doneText: 'THE VAN IS HERE' }); startAssault(); } },
        build(b) {
          b.r(2, 4, 68, 22, 'asph').st(5, 17, 'r').i('flare', 7, 19);
          b.o('atruck', 32, 13).gate('truck', 0, 0, 0, 0, 'virtual').c4(31, 14, 'truck').loot(29, 15, 'case', 4, 'truck');
          for (const x of [12, 24, 46, 58]) b.o('jersey', x, 9); for (const x of [18, 34, 52, 63]) b.o('jersey', x, 20);
          b.o('car', 22, 5).o('car', 44, 22).o('car', 40, 5).o('car', 11, 22).o('car', 60, 14).o('car', 20, 14);
          b.o('crate', 30, 6).o('drum', 28, 22).o('drum', 57, 17).o('pillar', 50, 12).o('crate', 66, 6).o('barrels', 37, 23);
          b.secure(52, 4, 6, 2, 'DROP ZONE').ex(3, 10, 7, 5, 'THE VAN');
          b.e('rio', 27, 12, 'pistol', 'r').e('grd', 28, 8, 'pipe', 'r').e('grd', 30, 11, 'smg', 'r').e('grd', 30, 18, 'pistol', 'r');
          b.e('grd', 44, 11, 'pistol', 'r').e('brc', 43, 17, 'pump', 'u').e('hnd', 32, 23, null, 'r');
          b.e('fat', 56, 15, 'pump', 'l').e('grd', 62, 7, 'smg', 'l').e('grd', 64, 23, 'machete', 'l').e('snp', 68, 13, 'rifle', 'l');
          b.sp(69, 6).sp(69, 24).sp(69, 15).sp(2, 5).sp(2, 24);
        } }
    ]
  },
  {
    name: 'GLASS HOUSE', job: true, assets: ['stash', 'nades', 'cutline'], fee: 10000, sub: 'SMASH AND GRAB - BEAT THE TACTICAL TEAM', par: 200, music: 7, bgHue: 300,
    pitch: 'A NEON JEWELRY STORE. SMASH THE CASES, GRAB THE JEWELS, BEAT THE CLOCK.',
    msg: { who: 'JOB  //  GLASS HOUSE', text: "GLASS HOUSE - THE JEWELER THAT SELLS TO ORISON'S BOARD.\nNO PLAN, NO SUBTLETY. SMASH THE CASES, WALK OVER THE JEWELS.\n\nTHE ALARM IS WIRED STRAIGHT TO A TACTICAL TEAM. YOU HAVE A MINUTE.\nAFTER THAT IT GETS UGLY. THE STOCK ROOM HAS BONDS IF YOU'RE GREEDY." },
    floors: [
      { name: 'THE SHOWROOM', w: 56, h: 34, wall: ['#4a2a5a', '#c87ae0'], clear: 'obj', police: 60, policeText: 'TACTICAL TEAM IN', exitText: 'GO GO GO - GET TO THE VAN',
        tip: 'SHOOT OR HIT THE GLASS CASES. WALK OVER THE JEWELS TO GRAB THEM.',
        objs: [{ k: 'gem', n: 20, label: 'GRAB THE JEWELS' }],
        assault: { every: 4.5, cap: 10, len: 40, rest: 12, waves: [W_('grd', 'grd', 'brc'), W_('rio', 'grd', 'grdp'), W_('brc', 'brc', 'grd'), W_('cln', 'grd')], heavy: W_('fat', 'rio', 'cln') },
        build(b) {
          b.r(2, 2, 7, 24, 'conc').r(47, 2, 7, 24, 'conc').r(2, 26, 52, 6, 'asph');
          b.r(10, 10, 36, 15, 'pink').r(10, 2, 16, 7, 'carpet').r(27, 2, 19, 7, 'conc');
          b.d(25, 25, 'h').d(29, 25, 'h').d(14, 9, 'h').d(26, 4, 'v').d(40, 9, 'h').d(9, 17, 'v').d(46, 17, 'v');
          for (const y of [13, 17, 21]) for (const x of [13, 18, 35, 40]) b.jcase(x, y);
          b.jcase(24, 15).jcase(29, 15).jcase(24, 19).jcase(29, 19);
          b.o('counter', 25, 10).o('plant', 10, 24).o('plant', 45, 24).o('plant', 10, 10).o('plant', 45, 10);
          b.i('sledge', 15, 4).o('desk', 12, 3).o('sofa', 18, 7).o('plant', 25, 2).t(22, 3, "INSURED VALUE ON THE FLOOR: 2.1M.\nSTOCK ROOM: BEARER BONDS FOR THE BOARD.\nTACTICAL RESPONSE TIME: 60 SECONDS.", 'STORE LEDGER');
          b.o('shelf', 28, 2).o('shelf', 40, 2).o('crate', 43, 6).o('locker', 45, 2).loot(31, 5, 'bonds', 2).loot(36, 5, 'gold', 1);
          b.o('van', 44, 27).secure(41, 27, 3, 3, 'LOAD HERE').ex(50, 27, 2, 3, 'THE VAN').o('car', 10, 28).o('dumpster', 4, 22).st(27, 29, 'u');
          b.e('grd', 22, 12, 'pistol', 'd').e('grd', 33, 12, 'pistol', 'd').e('grd', 16, 20, 'pipe', 'r').e('grd', 38, 19, 'smg', 'l').e('brc', 27, 22, 'pump', 'u');
          b.e('grd', 20, 5, 'pistol', 'l').e('cln', 12, 6, 'pistol', 'r').e('grd', 34, 4, 'smg', 'r').e('fat', 42, 4, 'pipe', 'l');
          b.e('hnd', 5, 8, null, 'd').e('grd', 50, 10, 'pistol', 'd');
          b.sp(2, 30).sp(53, 30).sp(5, 3).sp(50, 3).sp(2, 27);
        } }
    ]
  },
  {
    name: 'COLD STORAGE', job: true, assets: ['stash', 'nades', 'tipoff'], fee: 14000, sub: 'CARTEL WAREHOUSE - DESTROY OR STEAL THE GUNS', par: 300, music: 9, bgHue: 190,
    pitch: 'A CARTEL FREEZER WAREHOUSE AT THE DOCKS. THE GUNS ARE IN WITH THE FISH.',
    msg: { who: 'JOB  //  COLD STORAGE', text: "THE ESTRELLA CARTEL MOVES ORISON'S OFF-BOOK WEAPONS THROUGH A FISH FREEZER AT THE DOCKS.\nTHE CRATES ARE IN THE FREEZERS ON THE EAST SIDE.\n\nSMASH THEM, OR BAG THE LOOSE ONES AND LOAD THEM ON OUR TRUCK FOR A CUT.\nTHEIR BOATS WILL KEEP COMING. WHEN IT'S DONE, FIGHT YOUR WAY OUT." },
    floors: [
      { name: 'THE FREEZERS', w: 64, h: 40, wall: ['#4a5a66', '#a8c0d0'], clear: 'obj', exitText: 'GET TO THE TRUCK',
        tip: 'WEAPON CRATES TAKE A FEW HITS OR ONE GRENADE. LOOSE CRATES CAN BE BAGGED (E) FOR MONEY.',
        objs: [{ k: 'crates', n: 6, label: 'DESTROY OR STEAL CRATES' }],
        assault: { at: 35, every: 6, cap: 9, len: 30, rest: 18, waves: [[['wkr', 'machete'], ['wkr', 'pipe'], ['grd', 'pistol']], [['brc', 'pump'], ['wkr', 'pipe']], [['hnd', null], ['hnd', null], ['grd', 'smg']], [['grd', 'pistol'], ['grd', 'smg']]], heavy: [['fat', 'pump'], ['cln', 'revolver']] },
        onDone() { banner('FIGHT YOUR WAY OUT', '#ff3b4e'); sfx('alarm'); spawnWave([['brc', 'pump'], ['wkr', 'machete'], ['grd', 'smg'], ['fat', 'pump']]); },
        build(b) {
          b.r(2, 2, 40, 23, 'conc').r(43, 2, 19, 11, 'tile').r(43, 14, 19, 11, 'tile');
          b.r(2, 26, 13, 12, 'lino').r(16, 26, 26, 12, 'asph').r(43, 26, 19, 12, 'deck');
          b.r(20, 25, 8, 1, 'asph').r(42, 29, 1, 5, 'deck');
          b.d(42, 6, 'v').d(42, 18, 'v').d(51, 13, 'h').d(7, 25, 'h').d(15, 31, 'v').d(56, 25, 'h');
          // warehouse: shelving rows and loose stock
          for (const y of [5, 10, 15]) for (const x of [5, 11, 17]) b.o('shelf', x, y);
          b.o('crate', 26, 4).o('crate', 33, 8).o('crate', 27, 14).o('crate', 35, 18).o('cart', 38, 3).o('drum', 30, 21).o('pillar', 23, 9);
          // the freezers: weapon crates (smash) and loose crates (bag)
          b.wcrate(45, 4).wcrate(49, 9).wcrate(55, 4).o('shelf', 47, 2).loot(59, 5, 'crate', 2);
          b.wcrate(45, 16).wcrate(52, 21).wcrate(58, 16).loot(47, 22, 'crate', 2);
          // office, loading bay with our truck, the cartel's dock
          b.i('flare', 6, 30).o('desk', 4, 28).o('table', 9, 33).o('locker', 14, 27).o('sofa', 3, 37).t(3, 35, "ORISON ORDER 77-C: 40 CRATES, NO SERIALS.\nKEEP THEM COLD AND KEEP THEM QUIET.\nTHE BOATS COME EVERY HOUR.", 'SHIPPING LOG');
          b.o('van', 28, 31).secure(25, 31, 3, 3, 'LOAD HERE').ex(34, 31, 2, 3, 'THE TRUCK').o('dumpster', 18, 27).o('drum', 40, 36).st(17, 36, 'r');
          b.o('boat', 54, 33).o('drum', 46, 36).o('crate', 44, 27);
          b.e('wkr', 8, 8, 'machete', 'r').e('grd', 14, 13, 'pistol', 'l').e('brc', 31, 12, 'pump', 'r').e('wkr', 14, 20, 'pipe', 'u').e('grd', 36, 6, 'smg', 'l').e('hnd', 8, 20, null, 'r');
          b.e('grd', 53, 6, 'smg', 'l').e('wkr', 58, 10, 'machete', 'l').e('fat', 53, 18, 'pump', 'l').e('grd', 48, 20, 'pistol', 'r');
          b.e('grd', 48, 30, 'pistol', 'r').e('brc', 55, 29, 'pump', 'd').e('snp', 60, 28, 'rifle', 'l');
          b.e('grd', 10, 30, 'pistol', 'r').e('cln', 5, 34, 'revolver', 'u').e('wkr', 39, 28, 'pipe', 'u');
          b.sp(61, 28).sp(61, 37).sp(3, 3).sp(40, 3);
        } }
    ]
  },
  {
    name: 'SKYLINE SAFE', job: true, assets: ['stash', 'nades', 'winch'], fee: 20000, sub: 'PENTHOUSE - CARRY THE SAFE TO THE RIG', par: 330, music: 11, bgHue: 260,
    pitch: 'A PENTHOUSE SAFE TOO HEAVY TO RUN WITH. GET IT ON THE WINDOW-WASHER RIG.',
    msg: { who: 'JOB  //  SKYLINE SAFE', text: "THE TOP FLOOR OF THE MERIDIAN TOWER. AN ORISON DIRECTOR KEEPS HIS SAFE IN THE BEDROOM.\nIT'S TOO HEAVY TO CRACK HERE AND TOO HEAVY TO RUN WITH.\n\nCARRY IT UP TO THE ROOF AND PUT IT ON THE WINDOW-WASHER RIG.\nYOU CAN'T FIGHT WHILE YOU CARRY IT - CLEAR THE WAY FIRST.\nDEFEND THE RIG WHILE IT LOWERS, THEN TAKE THE ZIPLINE." },
    floors: [
      { name: 'THE PENTHOUSE', w: 60, h: 40, wall: ['#3a3a4a', '#d8d0e8'], barrier: true, clear: 'obj', rig: true, zipline: true, exitText: 'TAKE THE ZIPLINE - TOP LEFT OF THE ROOF',
        tip: 'THE SAFE IS IN THE BEDROOM (LEFT). E TO LIFT IT, E TO SET IT DOWN.',
        objs: [{ k: 'safe', n: 1, label: 'GET THE SAFE TO THE RIG' }, { k: 'rig', n: 1, label: 'DEFEND THE RIG' }],
        assault: { at: 45, every: 6, cap: 9, len: 32, rest: 16, waves: [W_('grd', 'grdp'), W_('cln', 'grd'), W_('brc', 'grdp', 'hnd'), W_('rio', 'grd')], heavy: W_('fat', 'cln', 'rio') },
        on(k) { if (k === 'safe') { G.rigSafe = 1; heistCount({ t: G.winchFast ? 30 : 50, label: 'RIG LOWERING', k: 'rig', doneText: 'THE SAFE IS DOWN', stall: { x: 29 * CELL, y: 3.5 * CELL, r: 60 } }); startAssault(); } },
        build(b) {
          b.r(2, 2, 56, 12, 'roof');
          b.r(2, 15, 11, 22, 'carpet').r(14, 15, 32, 12, 'wood').r(47, 15, 11, 22, 'marble').r(14, 28, 32, 9, 'marble').r(28, 37, 4, 2, 'lift');
          b.d(6, 14, 'h').d(18, 14, 'h').d(40, 14, 'h').d(51, 14, 'h').d(13, 19, 'v').d(13, 31, 'v').d(20, 27, 'h').d(38, 27, 'h').d(46, 19, 'v').d(46, 31, 'v');
          // the roof: plant, dish, the rig on the north edge, the zipline in the corner
          b.i('axe', 52, 12).o('ac', 8, 5).o('ac', 15, 9).o('ac', 44, 5).o('dish', 50, 9).o('gen', 36, 9).o('xmit', 20, 4).o('drum', 33, 5).o('crate', 54, 4);
          b.secure(26, 2, 6, 3, 'THE RIG').ex(2, 2, 3, 3, 'THE ZIPLINE');
          // bedroom with the safe
          b.o('bed', 8, 16).o('plant', 2, 15).o('sofa', 3, 24).o('locker', 12, 33).o('locker', 12, 35).o('table', 7, 28).loot(4, 34, 'safe', 1);
          // living room, elevator lobby, study
          b.o('sofa', 22, 20).o('sofa', 29, 20).o('table', 25, 22).o('piano', 38, 17).o('bar', 26, 15).o('statue', 15, 16).o('plant', 45, 15).o('plant', 14, 26);
          b.o('plant', 14, 28).o('plant', 45, 28).o('bench', 22, 32).o('bench', 35, 32).o('counter', 15, 36).st(30, 38, 'u');
          b.o('desk', 50, 17).o('shelf', 53, 15).o('table', 50, 30).o('locker', 57, 27).loot(52, 24, 'cash', 2).loot(55, 33, 'gold', 1).t(56, 17, "SAFE: 340 KG. DO NOT MOVE WITHOUT THE CREW.\nWINDOW CREW: RIG IS ON THE NORTH PARAPET.", 'BUILDING MEMO');
          b.e('cln', 18, 31, 'pistol', 'u').e('grd', 42, 33, 'smg', 'u');
          b.e('cln', 27, 18, 'smg', 'd').e('grd', 17, 22, 'pistol', 'r').e('hnd', 35, 24, null, 'l').e('brc', 43, 20, 'pump', 'l');
          b.e('cln', 7, 24, 'pistol', 'd').e('grd', 4, 30, 'pipe', 'r');
          b.e('grd', 51, 21, 'pistol', 'l').e('fat', 53, 30, 'pipe', 'u');
          b.e('snp', 55, 3, 'rifle', 'l').e('grd', 30, 7, 'pistol', 'd').e('grd', 10, 11, 'smg', 'r');
          b.sp(28, 38).sp(31, 38).sp(56, 3).sp(3, 12).sp(57, 36);
        } }
    ]
  }
);
