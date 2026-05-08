const { chromium } = require('playwright');

const queries = [
  { q: 'AMD Ryzen 5 5600', type: 'CPU' },
  { q: '64GB DDR4 3200', type: 'RAM' }
];

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("--- eBay Cart Updates (NEW Components) ---");
    const results = {};

    for (const item of queries) {
      console.log(`\nSearching eBay for NEW: ${item.q}...`);
      // LH_ItemCondition=1000 is Brand New. LH_BIN=1 is Buy It Now.
      const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(item.q)}&LH_ItemCondition=1000&LH_BIN=1`;
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
          
          // Sanity check CPU
          if (item.type === 'CPU' && (foundTitle.toLowerCase().includes('5600g') || foundTitle.toLowerCase().includes('5600x'))) continue;

          foundUrl = url;
          validItemFound = true;
          break;
        }
      }
      
      if (!validItemFound) {
        console.log(`-> No valid results found for ${item.q}`);
        results[item.type] = { found: false };
        continue;
      }

      console.log(`Found: ${foundTitle} for ${foundPrice}`);
      await page.goto(foundUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      let addBtn = page.locator('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart")').first();
      if (await addBtn.count() > 0) {
        await addBtn.click({force: true}).catch(()=>{});
        await page.waitForTimeout(3000);
        console.log(`-> Added ${item.type} to eBay cart.`);
        results[item.type] = { found: true, title: foundTitle, price: foundPrice, url: foundUrl, added: true };
      } else {
        console.log(`-> Could not find Add to Cart button for ${item.type}.`);
        results[item.type] = { found: true, title: foundTitle, price: foundPrice, url: foundUrl, added: false };
      }
    }

    require('fs').writeFileSync('ebay_new_results.json', JSON.stringify(results, null, 2));
    console.log("\n--- Final Status ---");
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
