// finds Playwright and a Chrome to drive, plus the paths the test scripts use
const path = require('path'), fs = require('fs');
let pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/npm-tools/node_modules/playwright'); }
const chrome = process.env.CHROME || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(p => fs.existsSync(p));
const ROOT = path.resolve(__dirname, '..');
module.exports = { chromium: { launch: (o = {}) => pw.chromium.launch(Object.assign({}, o, { executablePath: o.executablePath || chrome })) }, GAME: 'file://' + path.join(ROOT, 'dist', 'index.html'), ROOT: ROOT };
