// Optional: run with an existing Playwright install and a local preview server.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: 'test-results', size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  const base = process.env.TEST_URL || 'http://127.0.0.1:5173';
  const pause = () => page.waitForTimeout(5000);
  await page.goto(base); await pause();
  await page.locator('main').evaluate(el => el.querySelector('.featured').scrollIntoView()); await pause();
  await page.goto(base + '/menu'); await page.getByRole('button', { name: 'Mains', exact: true }).click(); await pause();
  await page.getByRole('button', { name: 'Add Oak-fired Ribeye to cart', exact: true }).click();
  await page.goto(base + '/cart'); await pause();
  await page.goto(base + '/checkout'); await page.getByLabel('Delivery · $5.00').check(); await pause();
  await page.goto(base + '/reservations'); await pause();
  await page.goto(base + '/gallery'); await page.locator('.gallery-tile').first().click(); await pause();
  const video = page.video(); await context.close();
  await fs.copyFile(await video.path(), 'test-results/walkthrough.webm');
  await browser.close();
  console.log('Saved test-results/walkthrough.webm (approximately 35 seconds, silent)');
})().catch(error => { console.error(error); process.exit(1); });
