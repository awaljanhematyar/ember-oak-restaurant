/**
 * Browser assertions and visual captures for the dark responsive layout, circular imagery, and loaded demo map.
 */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
require('node:fs').mkdirSync('test-results', {recursive:true});
(async () => {
  // ========================================
  // BROWSER SETUP
  // ========================================
  const browser = await chromium.launch({channel:'msedge', headless:true});
  const page = await browser.newPage({viewport:{width:375,height:900}});
  const base = process.env.TEST_URL || 'http://localhost:5173';

  // ========================================
  // RESPONSIVE HOME PAGE
  // ========================================
  await page.goto(base, {waitUntil:'domcontentloaded'});
  await page.locator('h1').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),375);
  await page.screenshot({path:'test-results/redesign-mobile-viewport.png'});
  await page.setViewportSize({width:1440,height:1000});await page.goto(base);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
  await page.screenshot({path:'test-results/redesign-desktop.png',fullPage:true});
  assert.equal(await page.locator('body').evaluate(()=>getComputedStyle(document.documentElement).backgroundColor),'rgb(13, 13, 13)');
  assert.ok(await page.locator('.hero-visual').evaluate(el=>el.getBoundingClientRect().left>innerWidth/2));

  // ========================================
  // DEMO MAP INTEGRATION
  // ========================================
  await page.goto(base+'/contact',{waitUntil:'domcontentloaded'});await page.locator('iframe').waitFor();
  assert.ok(await page.locator('.contact-map').textContent().then(t=>t.includes('DEMO LOCATION')&&t.includes('fictional')));
  assert.ok((await page.locator('iframe').getAttribute('src')).includes('maps.google.com'));
  await page.locator('iframe').scrollIntoViewIfNeeded();await page.waitForTimeout(2000);
  await page.frameLocator('iframe').locator('body').waitFor({timeout:20000});
  const map = page.frames().find(frame=>frame.url().includes('google.com/maps'));
  assert.ok(map, 'Google Maps frame must navigate to Google');
  await map.waitForFunction(()=>document.body.innerText.includes('Google'), undefined, {timeout:30000});
  console.log('PASS: Google Maps provider interface loaded inside the demo-labelled Toronto frame');
  await page.screenshot({path:'test-results/redesign-contact-map.png'});

  // ========================================
  // CIRCULAR MENU IMAGES
  // ========================================
  await page.setViewportSize({width:375,height:900});await page.goto(base+'/menu');await page.locator('.dish-card').first().waitFor();
  assert.ok(await page.locator('.dish-photo img').first().evaluate(el=>getComputedStyle(el).borderRadius==='50%'));
  await page.screenshot({path:'test-results/redesign-menu-mobile.png'});
  console.log('PASS: requested background, right-hand desktop hero, circular cards and demo-labelled Google map');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
