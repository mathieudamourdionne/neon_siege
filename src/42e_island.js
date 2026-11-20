// ---------- SPECIAL OP: BLACK SAND - Marrow Key (opened from the JOBS screen, not part of the story count) ----------
LEVELS.push(
  {
    name: 'THE LANDING', sub: 'SPECIAL OP - MARROW KEY, DUSK', par: 260, music: 10, bgHue: 200, special: 'BLACK SAND',
    pitch: "MARROW KEY. TAKE THE BLACKMAIL AND GET THE KIDS OUT. THREE LEVELS - AND SOMETHING UNDER THE TEMPLE.",
    msg: { who: 'NADIA REN // RADIO', text: "MARROW KEY. SILAS MARROW'S PRIVATE ISLAND - ORISON'S MONEY MAN.\nTHE CITY'S RICH AND POWERFUL FLY IN, AND HE FILMS ALL OF THEM. THAT'S HIS LEVERAGE.\n\nAND THE KIDS WHO WENT MISSING FROM THE LOWER CITY SHELTERS ARE HERE.\nGET THE BLACKMAIL. GET THE KIDS OUT. I'LL HOLD THE BOAT." },
    floors: [
      { name: 'THE BEACH', w: 64, h: 40, wall: ['#1e1e24', '#4a4a52'], tip: 'KEY SECURITY WEARS WHITE. THE HOUSE IS UP THE ROAD AT THE TOP RIGHT.',
        build(b) {
          b.r(2, 31, 12, 7, 'deck').st(11, 33, 'u').o('boat', 3, 34);
          b.r(2, 16, 60, 14, 'bsand').gap(9, 30, 'h', 'deck').gap(11, 30, 'h', 'deck');
          for (const [x, y] of [[6, 19], [16, 25], [24, 19], [34, 24], [41, 18], [50, 25], [58, 20]]) b.o('palm', x, y);
          b.o('boulder', 12, 21).o('boulder', 28, 26).o('boulder', 46, 21);
          b.r(16, 31, 13, 7, 'wood').d(21, 30, 'h').o('lifeboat', 17, 35).o('crate', 26, 32).o('barrels', 17, 31);
          b.r(30, 31, 14, 7, 'plate').gap(35, 30, 'h', 'plate').gap(37, 30, 'h', 'plate').o('gen', 31, 32).o('crate', 41, 35);
          b.r(45, 31, 17, 7, 'bsand').gap(50, 30, 'h', 'bsand').gap(52, 30, 'h', 'bsand').o('palm', 55, 34).o('boulder', 59, 32);
          b.r(2, 2, 18, 13, 'rock').gap(8, 15, 'h', 'rock').gap(10, 15, 'h', 'rock').o('boulder', 5, 4).o('boulder', 15, 9).o('boulder', 8, 11);
          b.r(22, 2, 14, 8, 'wood').r(27, 11, 4, 5, 'dirt').d(28, 10, 'h').o('table', 24, 3).o('bunk', 33, 2).o('locker', 22, 7);
          b.r(38, 2, 12, 8, 'tile').r(42, 11, 4, 5, 'dirt').d(43, 10, 'h').o('desk', 40, 3).o('tvwall', 44, 2).o('locker', 49, 6);
          b.t(48, 3, "GUEST MANIFEST - MARROW KEY\nARRIVALS THIS WEEK: 14. NAMES REDACTED BY REQUEST.\nCAMERAS IN EVERY SUITE. ALL FOOTAGE TO MR. MARROW. NO COPIES.", 'SECURITY DESK');
          b.r(52, 2, 10, 13, 'dirt').gap(55, 15, 'h', 'dirt').gap(57, 15, 'h', 'dirt').ex(54, 2, 6, 4, 'THE ESTATE');
          b.e('isl', 20, 22, 'pistol', 'r', { p: [[20, 22], [38, 22]] }).e('isl', 13, 18, 'pipe', 'd').e('hnd', 31, 27, null, 'l').e('isl', 44, 20, 'smg', 'l').e('isl', 27, 17, 'machete', 'd').e('isl', 55, 26, 'pistol', 'l');
          b.e('isl', 19, 34, 'bat', 'r').e('isl', 25, 36, 'pump', 'l');
          b.e('isl', 39, 34, 'pistol', 'l').e('hnd', 33, 36, null, 'r');
          b.e('isl', 25, 6, 'pistol', 'r').e('isl', 32, 7, 'machete', 'l');
          b.e('isl', 46, 5, 'smg', 'l').e('isl', 40, 7, 'pistol', 'r');
          b.e('isl', 57, 8, 'pistol', 'd').e('hnd', 55, 12, null, 'd').e('isl', 12, 6, 'revolver', 'r');
          b.i('machete', 12, 36).i('frag', 27, 36);
          b.sp(4, 20).sp(60, 28).sp(24, 4).sp(58, 4);
        } }
    ]
  },
  {
    name: 'THE ESTATE', sub: 'SPECIAL OP - THE HOUSE ON THE HILL', par: 300, music: 11, bgHue: 320, special: 'BLACK SAND',
    msg: { who: 'NADIA REN // RADIO', text: "MARROW SPLITS HIS BLACKMAIL BETWEEN THREE WALL SAFES. TAKE ALL THREE DRIVES.\nTHE KIDS ARE IN THE CELLAR UNDER THE HOUSE. OPEN THE CAGES AND THEY'LL RUN\nBACK THROUGH THE SEA CAVE TO MY BOAT.\n\nNOBODY IN THERE IS GOING TO TOUCH THEM. I'LL MAKE SURE OF IT." },
    floors: [
      { name: 'THE HOUSE', w: 64, h: 40, wall: ['#b8a880', '#f4e8c8'], tip: 'THE WALL SAFES ARE IN THE STUDY, THE MEDIA ROOM AND MARROW\'S OFFICE. PRESS E AT EACH ONE.',
        objs: [{ k: 'wsafe', n: 3, label: 'TAKE THE BLACKMAIL DRIVES' }],
        on(k, n) { if (k !== 'wsafe') return; if (n < 3) banner('DRIVE ' + n + ' OF 3', '#ffe14d'); else { banner('ALL OF HIS BLACKMAIL', '#5dff9a'); toast('NADIA: GOOD. NOW THE CELLAR - THE STAIRS ARE PAST THE MEDIA ROOM.'); } },
        build(b) {
          b.r(26, 33, 12, 5, 'bsand').st(31, 36, 'u').o('palm', 27, 34).o('palm', 35, 34);
          b.r(20, 22, 24, 10, 'marble').d(31, 32, 'h').o('statue', 22, 24).o('statue', 41, 24).o('plant', 20, 31).o('plant', 43, 31).o('piano', 35, 27);
          b.r(2, 22, 17, 10, 'wood').d(19, 26, 'v').sw(3, 22, 'wsafe', 'TAKE THE DRIVE').o('desk', 8, 25).o('shelf', 13, 22).o('sofa', 11, 30).o('plant', 18, 31);
          b.r(45, 22, 17, 10, 'carpet').d(44, 26, 'v').sw(59, 22, 'wsafe', 'TAKE THE DRIVE').o('tvwall', 49, 22).o('sofa', 48, 27).o('sofa', 54, 27).o('bar', 50, 31);
          b.r(2, 13, 60, 8, 'carpet').d(25, 21, 'h').d(36, 21, 'h').d(9, 21, 'h').d(53, 21, 'h').o('plant', 2, 13).o('plant', 61, 20).o('statue', 31, 16);
          b.r(2, 2, 14, 10, 'tile').d(8, 12, 'h').o('desk', 3, 3).o('tvwall', 9, 2).o('locker', 15, 6);
          b.t(4, 9, "VAULT ROTATION - MARROW KEY\nSTUDY, MEDIA ROOM, OFFICE. ONE DRIVE EACH.\nIF THE HOUSE IS BREACHED, MR. MARROW GOES TO THE TEMPLE. NOBODY FOLLOWS.", 'SECURITY');
          b.r(17, 2, 22, 10, 'marble').d(27, 12, 'h').o('ltable', 22, 5).o('ltable', 30, 5).o('bar', 18, 2).o('plant', 38, 11);
          b.r(40, 2, 22, 10, 'rug').d(50, 12, 'h').sw(58, 2, 'wsafe', 'TAKE THE DRIVE').o('desk', 46, 4).o('sofa', 42, 9).o('shelf', 52, 2).o('plant', 61, 11);
          b.r(50, 33, 12, 5, 'conc').d(55, 32, 'h').ex(53, 34, 7, 3, 'THE CELLAR');
          b.e('isl', 28, 30, 'pistol', 'u');
          b.e('cln', 24, 26, 'smart', 'r').e('isl', 39, 29, 'smg', 'l').e('isl', 31, 24, 'pipe', 'd');
          b.e('isl', 6, 28, 'pistol', 'r').e('brc', 15, 25, 'pump', 'l');
          b.e('cln', 52, 25, 'smg', 'l').e('isl', 58, 29, 'machete', 'l');
          b.e('isl', 20, 16, 'pistol', 'r', { p: [[20, 16], [44, 16]] }).e('hnd', 50, 18, null, 'l').e('isl', 8, 17, 'bat', 'r');
          b.e('isl', 6, 6, 'smg', 'r').e('isl', 12, 9, 'pistol', 'l');
          b.e('cln', 21, 9, 'pistol', 'r').e('isl', 35, 8, 'machete', 'l');
          b.e('fat', 47, 7, 'pump', 'r').e('cln', 56, 8, 'smart', 'l');
          b.e('isl', 58, 35, 'pistol', 'l');
          b.i('axe', 4, 30).i('ar', 36, 3).i('frag', 60, 19);
          b.sp(3, 16).sp(60, 14).sp(30, 3).sp(5, 3);
        } },
      { name: 'THE CELLAR', w: 64, h: 40, wall: ['#3a3430', '#7a706a'], tip: 'STAND AT A CAGE AND PRESS E. THE KIDS RUN STRAIGHT BACK TO THE BOAT - NOTHING IN HERE CAN HURT THEM.',
        objs: [{ k: 'cage', n: 4, label: 'FREE THE KIDS' }],
        on(k, n) { if (k !== 'cage') return; if (n < 4) banner(n + ' OF 4 CAGES OPEN', '#5dff9a'); else { banner('ALL THE KIDS ARE OUT', '#5dff9a'); toast("NADIA: I'VE GOT THEM. EVERY ONE. MARROW RAN FOR THE TEMPLE - THE PATH IS AT THE EAST END."); } },
        build(b) {
          b.r(2, 12, 12, 14, 'rock').r(2, 20, 6, 6, 'water').o('boat', 2, 21).r(8, 16, 5, 6, 'deck').st(10, 18, 'r');
          b.r(14, 17, 8, 4, 'rock');
          b.r(22, 14, 38, 10, 'conc').o('pillar', 33, 16).o('pillar', 47, 16).o('crate', 26, 21).o('barrels', 53, 15);
          b.r(22, 3, 14, 10, 'dark').d(28, 13, 'h').cage(31, 5, 'kids').o('mattress', 23, 4).o('sink', 35, 11);
          b.r(37, 3, 14, 10, 'dark').d(43, 13, 'h').cage(46, 5, 'kids').o('mattress', 38, 4).o('sink', 50, 11);
          b.r(52, 3, 8, 10, 'tile').d(55, 13, 'h').o('bunk', 52, 3).o('locker', 59, 3).o('table', 56, 8);
          b.t(58, 11, "HOLDING - CELLAR\nINTAKE FROM THE LOWER CITY SHELTERS. NUMBERS, NO NAMES.\nMR. MARROW'S ORDERS: NOBODY LEAVES THE KEY.", 'GUARD ROOM');
          b.r(22, 25, 14, 10, 'dark').d(28, 24, 'h').cage(31, 31, 'kids').o('mattress', 23, 31).o('sink', 35, 25);
          b.r(37, 25, 14, 10, 'dark').d(43, 24, 'h').cage(46, 31, 'kids').o('mattress', 38, 31).o('sink', 50, 25);
          b.r(52, 25, 8, 10, 'rock').d(55, 24, 'h').ex(53, 30, 6, 4, 'THE TEMPLE PATH');
          b.e('isl', 30, 15, 'pistol', 'r', { p: [[30, 15], [50, 15]] }).e('cln', 40, 21, 'smg', 'l').e('hnd', 56, 19, null, 'l').e('isl', 27, 23, 'pipe', 'r');
          b.e('isl', 25, 7, 'machete', 'r').e('isl', 40, 9, 'pistol', 'r');
          b.e('isl', 26, 30, 'bat', 'r').e('cln', 40, 28, 'smart', 'r');
          b.e('isl', 54, 7, 'smg', 'd').e('brc', 58, 10, 'pump', 'l');
          b.e('isl', 56, 31, 'pistol', 'u').e('isl', 24, 15, 'pipe', 'r');
          b.i('silp', 11, 24).i('frag', 57, 5);
          b.sp(58, 20).sp(23, 15).sp(57, 33);
        } }
    ]
  },
  {
    name: 'THE TEMPLE', sub: 'SPECIAL OP - THE HILL, AND UNDER IT', par: 300, music: 12, bgHue: 0, special: 'BLACK SAND',
    endBig: 'THE KEY<br>BURNS',
    endMsg: "THE KIDS ARE HOME. EVERY ONE OF THEM IS BACK WITH FAMILY,\nOR WITH SOMEONE NADIA TRUSTS.\n\nMARROW'S DRIVES WENT OUT TO EVERY NEWSROOM IN PORT OSTRA.\nA LOT OF POWERFUL PEOPLE ARE SUDDENLY VERY QUIET.\n\nNADIA ASKED WHAT HAPPENED IN THE TEMPLE. YOU DIDN'T HAVE AN ANSWER.\nTHE ISLAND IS STILL BURNING.",
    msg: { who: 'NADIA REN // RADIO (BREAKING UP)', text: "THE KIDS ARE ON THE BOAT. ALL OF THEM. WE'RE PULLED BACK FROM THE BEACH.\nMARROW RAN UP TO THAT TEMPLE ON THE HILL. MY SCANNER IS PICKING UP... I DON'T KNOW WHAT.\n\nWHATEVER WAS AT HIS PARTIES, THEY'RE NOT PEOPLE ANYMORE.\nSOME OF THEM THROW FIRE - SHOOT IT DOWN, OR SWING AT IT TO KNOCK IT BACK." },
    floors: [
      { name: 'THE HILL TEMPLE', w: 64, h: 40, wall: ['#1a0e10', '#5a2a2a'], pits: [[10, 24], [53, 24]], tip: 'IMPS ARE FAST. FIENDS THROW FIRE. BRUTES SHRUG OFF MELEE - SHOOT THEM OR USE THE AXE.',
        build(b) {
          b.r(26, 33, 12, 5, 'bsand').st(31, 36, 'u').o('palm', 27, 34).o('palm', 35, 34);
          b.r(4, 18, 56, 14, 'hell').gap(30, 32, 'h', 'hell').gap(32, 32, 'h', 'hell');
          b.o('pillar', 16, 21).o('pillar', 46, 21).o('pillar', 16, 28).o('pillar', 46, 28).o('brazier', 24, 20).o('brazier', 39, 20).o('brazier', 24, 30).o('brazier', 39, 30).o('statue', 6, 19).o('statue', 57, 19);
          b.r(16, 3, 32, 14, 'hell').gap(30, 17, 'h', 'hell').gap(32, 17, 'h', 'hell');
          b.o('altar', 30, 8).o('brazier', 28, 8).o('brazier', 35, 8).o('pillar', 20, 6).o('pillar', 42, 6).o('pillar', 20, 12).o('pillar', 42, 12);
          b.ex(29, 3, 6, 3, 'DOWN INTO THE DARK');
          b.r(2, 3, 13, 13, 'rock').d(15, 8, 'v').o('brazier', 4, 5).o('statue', 12, 4).o('boulder', 6, 11);
          b.r(49, 3, 13, 13, 'rock').d(48, 8, 'v').o('brazier', 59, 5).o('statue', 51, 4).o('boulder', 56, 11);
          b.e('imp', 14, 23, 'claw', 'r').e('imp', 48, 24, 'claw', 'l').e('imp', 22, 26, 'claw', 'u').e('imp', 42, 26, 'claw', 'u').e('fnd', 22, 19, 'hellfire', 'r').e('hbr', 9, 29, 'claw', 'r').e('fnd', 55, 29, 'hellfire', 'l');
          b.e('fnd', 23, 5, 'hellfire', 'r').e('fnd', 40, 5, 'hellfire', 'l').e('imp', 26, 13, 'claw', 'd').e('imp', 38, 13, 'claw', 'd').e('hbr', 36, 12, 'claw', 'd');
          b.e('imp', 6, 6, 'claw', 'r').e('imp', 10, 13, 'claw', 'r').e('fnd', 56, 7, 'hellfire', 'l').e('imp', 53, 13, 'claw', 'l');
          b.i('pump', 28, 35).i('axe', 35, 35).i('frag', 3, 4).i('ar', 60, 14).i('flare', 58, 4);
          b.sp(6, 30).sp(57, 30).sp(18, 4).sp(45, 4);
        } },
      { name: 'BENEATH THE KEY', w: 60, h: 40, wall: ['#14080a', '#4a1a1a'], pits: [[12, 12], [47, 12], [12, 27], [47, 27]], tip: 'MARROW TAKES A LOT. ROCKETS, SHOTGUNS AND HIS OWN FIREBALLS KNOCKED BACK AT HIM. THE PITS KEEP OPENING UNTIL HE DIES.',
        build(b) {
          b.r(26, 35, 8, 4, 'rock').st(30, 37, 'u');
          b.r(6, 6, 48, 28, 'hell').gap(28, 34, 'h', 'hell').gap(30, 34, 'h', 'hell');
          b.r(26, 1, 8, 4, 'rock').gap(29, 5, 'h', 'rock').ex(27, 1, 6, 3, 'THE WAY OUT');
          b.o('altar', 28, 9).o('pillar', 18, 14).o('pillar', 40, 14).o('pillar', 18, 24).o('pillar', 40, 24).o('brazier', 8, 8).o('brazier', 51, 8).o('brazier', 8, 31).o('brazier', 51, 31).o('statue', 24, 7).o('statue', 35, 7);
          b.e('mrw', 30, 14, 'claw', 'd').e('imp', 16, 19, 'claw', 'r').e('imp', 44, 19, 'claw', 'l').e('fnd', 20, 9, 'hellfire', 'r');
          b.i('rocket', 27, 37).i('pump', 33, 37).i('frag', 8, 20).i('frag', 51, 20).i('ar', 30, 30);
          b.sp(12, 12).sp(47, 12).sp(12, 27).sp(47, 27);
        } }
    ]
  }
);
