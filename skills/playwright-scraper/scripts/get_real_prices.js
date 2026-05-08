const { chromium } = require('playwright');

const parts = [
  'Sapphire Pulse Radeon RX 7800 XT',
  'ASUS ProArt X670E-Creator',
  'Corsair RM1200x Shift',
  'Lian Li Lancool III Black',
  'ARCTIC Liquid Freezer III 360 Black'
];

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    const results = {};

    for (const part of parts) {
      console.log(`Looking up: ${part}`);
      const searchUrl = `https://geizhals.eu/?fs=${encodeURIComponent(part)}&in=`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const html = await page.evaluate(() => document.body.innerHTML);
      require('fs').writeFileSync('geizhals_debug.html', html);
      console.log("Wrote geizhals_debug.html");
      break;
    }

    console.log("\n--- LIVE GEIZHALS PRICES ---");
    console.log(JSON.stringify(results, null, 2));

    await browser.close();
  } catch (e) {
    console.error("Scraping error:", e);
  }
})();
