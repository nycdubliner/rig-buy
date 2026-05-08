const { chromium } = require('playwright');

const queries = [
  { term: 'RX 7800 XT', category: 'GPU' },
  { term: '64GB DDR4', category: 'RAM_AM4' } 
];

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    const results = {};

    for (const item of queries) {
      console.log(`\nSearching for: ${item.term}`);
      
      const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(item.term)}&LH_ItemCondition=3000%7C4000&LH_BIN=1`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      const allItems = page.locator('li.s-card, li.s-item');
      const count = await allItems.count();
      
      let foundTitle, foundPrice, foundUrl;
      let validItemFound = false;

      for (let i = 0; i < count; i++) {
        const el = allItems.nth(i);
        const title = await el.locator('.s-card__title span, .s-item__title').first().textContent().catch(() => 'Unknown Title');
        const url = await el.locator('.s-card__link, .s-item__link').first().getAttribute('href').catch(() => null);

        if (title && url && !title.includes('Shop on eBay') && title !== 'Unknown Title' && !url.includes('123456')) {
          foundTitle = title.replace(/^New Listing/, '').trim();
          foundPrice = await el.locator('.s-card__price, .s-item__price').first().textContent().catch(() => 'Unknown Price');
          
          // Basic sanity check for GPU to avoid waterblocks/boxes
          if (item.category === 'GPU' && (foundTitle.toLowerCase().includes('water block') || foundTitle.toLowerCase().includes('box only'))) {
              continue;
          }

          foundUrl = url;
          validItemFound = true;
          break;
        }
      }
      
      if (!validItemFound) {
        console.log(`No valid results found for ${item.term}`);
        results[item.category] = { found: false };
        continue;
      }

      console.log(`Found: ${foundTitle} for ${foundPrice}`);
      results[item.category] = { found: true, title: foundTitle, price: foundPrice, url: foundUrl };
    }

    console.log("\n--- FINAL RESULTS ---");
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (e) {
    console.error("Error executing script:", e);
  }
})();
