const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const queries = [
  'Ryzen 9 7950X',
  'Sapphire Pulse RX 7800 XT',
  'ASUS ProArt X670E',
  'RM1200x Shift',
  'G.Skill Flare X5 32GB 6000',
  'Lancool III Black',
  'Liquid Freezer III 360 Black'
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const results = {};

  for (const query of queries) {
    try {
      const url = `https://www.caseking.de/en/search?sSearch=${encodeURIComponent(query)}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000); // Let JS render prices

      const data = await page.evaluate(() => {
        const item = document.querySelector('.product-box');
        if (!item) return { title: 'Not found', price: 'Unknown', url: null };

        const titleEl = item.querySelector('.product-title');
        const priceEl = item.querySelector('.price');
        
        return {
          title: titleEl ? titleEl.textContent.trim() : 'Unknown',
          price: priceEl ? priceEl.textContent.trim() : 'Unknown',
          url: titleEl ? titleEl.href : null
        };
      });

      results[query] = data;

    } catch (error) {
      console.error(JSON.stringify({ query, error: error.message }));
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
