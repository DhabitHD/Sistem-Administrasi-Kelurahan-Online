const { chromium } = require('playwright');
const out = [];
(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 2600 } });
  p.on('pageerror', (e) => out.push('PAGEERROR: ' + e.message.split('\n')[0]));
  p.on('console', (m) => { if (m.type() === 'error') out.push('CONSOLE: ' + m.text().slice(0, 180)); });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 90000 }).catch((e) => out.push('GOTO1: ' + e.message.split('\n')[0]));
  await p.waitForTimeout(12000);
  out.push('HERO_LOC={count=' + (await p.locator('.hero-slide').count()) + ',track=' + (await p.locator('.hero-track').count()) + ',section=' + (await p.locator('.hero-carousel').count()) + ',h1=' + (await p.locator('.hero-content h1').count()) + '}');
  out.push('BODY_H1=' + (await p.locator('h1').allTextContents().then((a) => a.join(' | ')).catch(() => 'ERR')).slice(0, 200));
  out.push('BODY_TEXT=' + (await p.locator('body').innerText().catch(() => 'ERR')).slice(0, 400));
  await p.screenshot({ path: 'hero-shot.png', fullPage: true });
  await b.close();
  console.log(out.join('\n'));
})();
