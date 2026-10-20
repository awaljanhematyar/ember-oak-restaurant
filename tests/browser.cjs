// Optional browser QA: PLAYWRIGHT_MODULE can point to an existing Playwright installation.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const base = process.env.TEST_URL || "http://127.0.0.1:5173";
  fs.mkdirSync("test-results", { recursive: true });
  async function readyImages() {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async image => {
        image.loading = 'eager';
        await image.decode().catch(() => {});
      }));
    });
  }
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/menu",
      "/order",
      "/reservations",
      "/cart",
      "/checkout",
      "/about",
      "/gallery",
      "/contact",
      "/not-found",
    ]) {
      await page.goto(base + route);
      await page
        .locator("h1")
        .waitFor({ timeout: 10000 })
        .catch((e) => {
          console.error({ route, width, errors });
          throw e;
        });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Overflow at ${width} ${route}`,
      );
      assert.equal(await page.locator("h1").count(), 1);
      const internalLinks = await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
      const routes = new Set(['/', '/menu', '/order', '/reservations', '/cart', '/checkout', '/about', '/gallery', '/contact']);
      assert.ok(internalLinks.every(href => routes.has(href)), `Unknown internal link on ${route}`);
    }
  }
  console.log(
    "PASS: ten routes, four widths, one h1 and no horizontal overflow",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await readyImages();
  assert.equal(await page.locator('.mobile-toggle').isVisible(), false);
  for (const name of ['dining','steak','salad','pasta','dessert','drinks','room']) {
    const response = await page.request.get(`${base}/images/${name}.jpg`);
    assert.equal(response.status(),200);
    assert.ok(response.headers()['content-type'].startsWith('image/'));
  }
  console.log('PASS: seven bundled images return HTTP 200 and desktop mobile toggle is hidden');
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.goto(base + "/menu");
  await page.getByRole("button", { name: "Mains", exact: true }).click();
  await page.getByLabel("Vegan", { exact: true }).check();
  await page.getByLabel("Gluten-free", { exact: true }).check();
  await page.getByRole("searchbox").fill("cauliflower");
  assert.equal(await page.locator(".dish-card").count(), 1);
  await page.getByRole("searchbox").fill("impossible");
  assert.equal(await page.locator(".dish-card").count(), 0);
  await page.getByRole("button", { name: "Clear all filters" }).click();
  assert.equal(await page.locator(".dish-card").count(), 24);
  await page
    .getByRole("button", { name: "Add Oak-fired Ribeye to cart", exact: true })
    .click();
  await page.goto(base + "/cart");
  await page
    .getByRole("button", { name: "Increase Oak-fired Ribeye quantity" })
    .click();
  await page.reload();
  assert.equal(
    await page.getByLabel("Quantity 2", { exact: true }).textContent(),
    "2",
  );
  assert.ok((await page.locator(".summary").textContent()).includes("$108.48"));
  await page.getByRole('button', {name:'Decrease Oak-fired Ribeye quantity'}).click();
  assert.equal(await page.getByLabel('Quantity 1', {exact:true}).textContent(), '1');
  assert.ok((await page.locator('.summary').textContent()).includes('$54.24'));
  await page.getByRole('button', {name:'Increase Oak-fired Ribeye quantity'}).click();
  await page.goto(base + '/menu');
  await page.getByRole('button', {name:'Add House Sourdough to cart',exact:true}).click();
  await page.goto(base + '/cart');
  await page.getByRole('button', {name:'Remove House Sourdough',exact:true}).click();
  assert.equal(await page.locator('.cart-row').count(), 1);
  assert.ok((await page.locator('.summary').textContent()).includes('$108.48'));
  console.log(
    "PASS: filter combinations, empty state, quantity, totals and reload persistence",
  );
  await page.goto(base + "/checkout");
  await page.getByRole("button", { name: "Complete demo checkout" }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 2);
  await page.getByLabel("Sample name", { exact: true }).fill("Alex Guest");
  await page
    .getByLabel("Sample email", { exact: true })
    .fill("alex@example.com");
  await page.getByLabel("Delivery · $5.00").check();
  await page.getByRole("button", { name: "Complete demo checkout" }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 2);
  await page.getByLabel("Sample address").fill("123 Demo St, Toronto");
  await page.getByLabel("Sample postal code").fill("M5V 2T6");
  assert.ok((await page.locator(".summary").textContent()).includes("$114.13"));
  await page.getByRole("button", { name: "Complete demo checkout" }).click();
  await page
    .getByRole("heading", { name: "A little taste of the experience." })
    .waitFor();
  assert.ok(
    (await page.locator("main").textContent()).includes("No order was sent"),
  );
  await page.goto(base + "/cart");
  await page
    .getByRole("heading", { name: "Your cart is waiting for something good." })
    .waitFor();
  console.log(
    "PASS: checkout validation, delivery summary, simulation receipt and cart clearing",
  );
  await page.goto(base + '/menu');
  await page.getByRole('button', {name:'Add House Sourdough to cart',exact:true}).click();
  await page.goto(base + '/checkout');
  await page.getByLabel('Sample name',{exact:true}).fill('Sample Guest');
  await page.getByLabel('Sample email',{exact:true}).fill('sample@example.com');
  assert.ok((await page.locator('.summary').textContent()).includes('$10.17'));
  assert.equal(await page.getByLabel('Sample address').count(),0);
  await page.getByRole('button',{name:'Complete demo checkout'}).click();
  await page.getByRole('heading',{name:'A little taste of the experience.'}).waitFor();
  assert.ok((await page.locator('main').textContent()).includes('Pickup simulation'));
  console.log('PASS: decrease/remove controls and pickup checkout');
  await page.goto(base + "/reservations");
  await page.getByRole("button", { name: "Save demo request" }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 4);
  await page.getByLabel("Sample name", { exact: true }).fill("Alex Guest");
  await page
    .getByLabel("Sample email", { exact: true })
    .fill("alex@example.com");
  await page.getByLabel("Date (Toronto)").fill("2020-01-01");
  await page.getByLabel("Dinner time").selectOption("18:00");
  await page.getByRole("button", { name: "Save demo request" }).click();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 1);
  await page.getByLabel("Date (Toronto)").fill("2099-10-21");
  await page.getByRole("button", { name: "Save demo request" }).click();
  await page
    .getByRole("heading", { name: "Demo request saved locally." })
    .waitFor();
  const saved = await page.evaluate(() =>
    localStorage.getItem("eo-reservation-v1"),
  );
  assert.ok(!saved.includes("Alex") && !saved.includes("example.com"));
  console.log(
    "PASS: reservation invalid fields/date, successful local request and minimal saved data",
  );
  await page.goto(base + "/gallery");
  const first = page.locator(".gallery-tile").first();
  await first.click();
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Close gallery",
  );
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Next photograph",
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Close gallery",
  );
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").count(), 0);
  assert.ok(await first.evaluate((el) => el === document.activeElement));
  console.log(
    "PASS: modal initial focus, Tab trap, arrow navigation, Escape and focus restoration",
  );
  await page.goto(base + "/contact");
  await page.getByLabel("Sample name").fill("Alex Guest");
  await page.getByLabel("Sample email").fill("alex@example.com");
  await page
    .getByLabel("Sample message")
    .fill("An imaginary anniversary dinner.");
  await page.getByRole("button", { name: "Try demo submission" }).click();
  await page
    .getByRole("heading", { name: "Demo message completed." })
    .waitFor();
  await page.goto(base + "/menu");
  await page.evaluate(() => {
    localStorage.setItem("eo-cart-v1", "broken");
  });
  await page.reload();
  assert.equal(await page.locator(".dish-card").count(), 24);
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(base);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Menu", exact: true })
    .click();
  assert.equal(new URL(page.url()).pathname, "/menu");
  await page.goto(base);
  await readyImages();
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.goto(base + "/menu");
  await page.evaluate(
    () =>
      (document.querySelector(".dish-photo img").src =
        "/intentionally-missing.jpg"),
  );
  await page.waitForFunction(() => {
    const image = document.querySelector(".dish-photo img");
    return image.src.endsWith("/images/fallback.svg") && image.complete && image.naturalWidth > 0;
  });
  assert.ok(
    await page
      .locator(".dish-photo img")
      .first()
      .evaluate((i) => i.complete && i.naturalWidth > 0),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: contact simulation, corrupt storage, mobile navigation, image fallback; no runtime page errors",
  );
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
