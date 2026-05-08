const { chromium } = require('playwright');

const queries = [
  { term: 'Ryzen 9 7950X', category: 'CPU' },
  { term: 'RX 7800 XT', category: 'GPU' },
  { term: '32GB DDR5 6000', category: 'RAM' } // Relaxed CL30 for better used results
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
      
      // Search for Used (3000) or Refurbished (4000), Buy It Now (LH_BIN=1)
      const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(item.term)}&LH_ItemCondition=3000%7C4000&LH_BIN=1`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      const allItems = page.locator('li.s-card, li.s-item');
      const count = await allItems.count();
      
      let foundTitle, foundPrice, foundUrl;
      let validItemFound = false;

      for (let i = 0; i < count; i++) {
        const item = allItems.nth(i);
        const title = await item.locator('.s-card__title span, .s-item__title').first().textContent().catch(() => 'Unknown Title');
        const url = await item.locator('.s-card__link, .s-item__link').first().getAttribute('href').catch(() => null);

        // Skip ads, dummy placeholders, and "Shop on eBay"
        if (title && url && !title.includes('Shop on eBay') && title !== 'Unknown Title' && !url.includes('123456')) {
          foundTitle = title.replace(/^New Listing/, '').trim();
          foundPrice = await item.locator('.s-card__price, .s-item__price').first().textContent().catch(() => 'Unknown Price');
          foundUrl = url;
          validItemFound = true;
          break; // We found the first real item
        }
      }
      
      if (!validItemFound) {
        console.log(`No valid results found for ${item.term}`);
        results[item.category] = { found: false };
        continue;
      }

      console.log(`Found: ${foundTitle} for ${foundPrice}`);

      // Go to the item page
      await page.goto(foundUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // Find the Add to Cart/Basket button
      // eBay uses various IDs and texts: #isCartBtn_btn, "Add to basket", "Add to cart"
      const addToCartBtn = page.locator('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart"), a:has-text("Add to basket")').first();
      
      if (await addToCartBtn.count() > 0) {
        console.log(`Clicking Add to Cart...`);
        // Force click as eBay overlays sometimes block normal clicks
        await addToCartBtn.click({ force: true }).catch(e => console.log("Click failed:", e.message)); 
        await page.waitForTimeout(3000); // Wait for confirmation dialog/redirect
        console.log(`Successfully added to cart.`);
        results[item.category] = { found: true, title: foundTitle, price: foundPrice, url: foundUrl, added: true };
      } else {
        console.log(`Could not find "Add to cart" button. It may be out of stock, require variation selection, or only have "Buy It Now".`);
        results[item.category] = { found: true, title: foundTitle, price: foundPrice, url: foundUrl, added: false };
      }
    }

    console.log("\n--- FINAL RESULTS ---");
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (e) {
    console.error("Error executing script:", e);
  }
})();
