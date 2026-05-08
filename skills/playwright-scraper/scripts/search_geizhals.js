const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const queries = [
  'Ryzen 9 7950X',
  'Sapphire Pulse Radeon RX 7800 XT',
  'ASUS ProArt X670E-CREATOR',
  'Corsair RM1200x Shift',
  'G.Skill Flare X5 32GB 6000 CL30',
  'Lian Li Lancool III Black',
  'ARCTIC Liquid Freezer III 360 Black'
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-GB,en;q=0.9'
    }
  });
  const page = await context.newPage();

  const results = {};

  for (const query of queries) {
    try {
      const searchUrl = `https://geizhals.eu/?fs=${encodeURIComponent(query)}&in=`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);

    const html = await page.evaluate(() => document.body.innerHTML);
    console.log(JSON.stringify({ query: queries[0], html: html.substring(0, 5000) }, null, 2));
    break; // Just do the first one for debugging

    } catch (error) {
      console.error(JSON.stringify({ query, error: error.message }));
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
