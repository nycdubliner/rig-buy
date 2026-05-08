const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const asins = [
  'B0BBHD5D8Y', // 7950X
  'B0CGM19NMS', // 7800 XT
  'B0BFWLGZPQ', // ProArt X670E
  'B0BPSYHY41', // RM1200x Shift
  'B0C1TKSDKR', // Flare X5
  'B0B469JRGC', // Lancool III
  'B0DLWGG85P'  // Freezer III 360
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const results = {};

  for (const asin of asins) {
    try {
      const url = `https://www.amazon.de/dp/${asin}/`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000); 

      const isBotChallenge = await page.$('text="Type the characters you see in this image:"') || await page.$('text="Geben Sie die Zeichen unten ein"');
      if (isBotChallenge) {
          console.error(JSON.stringify({ error: `Bot challenge on ${asin}` }));
          continue;
      }

      const data = await page.evaluate(() => {
        const titleEl = document.querySelector('#productTitle');
        
        // Amazon has various price selectors on the product page
        const priceWhole = document.querySelector('.a-price-whole');
        const priceFraction = document.querySelector('.a-price-fraction');
        let price = 'Unknown';
        
        if (priceWhole && priceFraction) {
            price = priceWhole.textContent.trim().replace(/,/g, '') + priceFraction.textContent.trim();
        } else {
            // Try fallback
            const fallback = document.querySelector('#priceblock_ourprice, .a-color-price, #corePriceDisplay_desktop_feature_div .a-price');
            if (fallback) {
                price = fallback.textContent.trim();
            }
        }

        return {
          title: titleEl ? titleEl.textContent.trim() : 'Unknown',
          price: price
        };
      });

      results[asin] = data;

    } catch (error) {
      console.error(JSON.stringify({ asin, error: error.message }));
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
