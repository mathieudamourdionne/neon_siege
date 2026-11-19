const { chromium, GAME, ROOT } = require('./tools/pw');
(async () => {
  const [prefix, listJson, w, h] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: +(w || 1280), height: +(h || 720) } });
  const errs = new Set(); p.on('pageerror', e => errs.add('ERR ' + e.stack.split('\n').slice(0, 3).join(' | ')));
  await p.goto(GAME); await p.waitForTimeout(700);
  for (const [name, expr, wait] of JSON.parse(listJson || '[]')) {
    try { const r = await p.evaluate(expr); if (r !== undefined) console.log(name, '=>', JSON.stringify(r)); } catch (e) { errs.add('EVAL ' + name + ': ' + e.message); }
    await p.waitForTimeout(wait || 200); await p.screenshot({ path: `${prefix}_${name}.png` });
  }
  console.log(errs.size ? [...errs].join('\n') : 'no errors'); await b.close();
})();
