const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    if (contexts.length === 0) {
      console.log("No browser contexts found.");
      return;
    }
    const pages = contexts[0].pages();
    
    const findPage = (urlSnippet) => pages.find(p => p.url().includes(urlSnippet));
    
    let casekingPage = findPage('caseking.de');
    if (!casekingPage) casekingPage = await contexts[0].newPage();

    const results = {
      AM5: { Caseking: [] },
      AM4: { eBay: [] }
    };

    // --- CASEKING (AM5 Focus: Mobo, PSU, Case, Cooler, RAM if possible) ---
    console.log("--- Searching Caseking ---");
    const ckQueries = [
      { q: 'Ryzen 5 7600', type: 'CPU' },
      { q: 'ASUS ProArt X670E', type: 'Mobo' },
      { q: 'Corsair RM1200x Shift', type: 'PSU' },
      { q: 'Lancool III Black', type: 'Case' },
      { q: 'Liquid Freezer III 360', type: 'Cooler' },
      { q: 'DDR5 6000 32GB', type: 'RAM' }
    ];

    for (const item of ckQueries) {
      console.log(`CK: ${item.q}`);
      await casekingPage.goto(`https://www.caseking.de/en/search?q=${encodeURIComponent(item.q)}`, { waitUntil: 'domcontentloaded' });
      await casekingPage.waitForTimeout(2000);
      
      const product = await casekingPage.evaluate(() => {
        const el = document.querySelector('.product-tile');
        if (!el) return null;
        const titleEl = el.querySelector('.pdp-link a.link');
        const priceEl = el.querySelector('.js-unit-price');
        const addBtn = el.querySelector('button.add-to-cart-global');
        
        return {
          title: titleEl ? titleEl.textContent.trim() : 'Unknown',
          price: priceEl ? priceEl.textContent.trim() : 'Unknown',
          url: titleEl ? titleEl.href : null,
          hasAddBtn: !!addBtn
        };
      });

      if (product && product.url) {
        console.log(`Found: ${product.title} - ${product.price}`);
        if (product.hasAddBtn) {
           const btn = casekingPage.locator('.product-tile button.add-to-cart-global').first();
           await btn.click({ force: true }).catch(() => {});
           await casekingPage.waitForTimeout(2000);
           console.log(`Added to Caseking cart.`);
           product.added = true;
        } else {
           console.log(`No add button on search page, going to product page...`);
           await casekingPage.goto(product.url, { waitUntil: 'domcontentloaded' });
           await casekingPage.waitForTimeout(2000);
           const btn = casekingPage.locator('.add-to-cart-global').first();
           if (await btn.count() > 0) {
              await btn.click({ force: true }).catch(() => {});
              await casekingPage.waitForTimeout(2000);
              console.log(`Added to Caseking cart.`);
              product.added = true;
           } else {
              console.log(`Could not add to cart.`);
              product.added = false;
           }
        }
        results.AM5.Caseking.push({ type: item.type, ...product });
      } else {
        console.log(`Not found.`);
      }
    }

    // eBay AM4
    console.log("\n--- Searching eBay for AM4 ---");
    let ebayPage = findPage('ebay.ie');
    if (!ebayPage) ebayPage = await contexts[0].newPage();

    const ebayQueries = [
      { q: 'X570 motherboard', type: 'Mobo' },
      { q: 'Ryzen 5 5600', type: 'CPU' },
      { q: '32GB DDR4 3600', type: 'RAM' }
    ];
    for (const item of ebayQueries) {
      console.log(`eBay: ${item.q}`);
      const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(item.q)}&LH_ItemCondition=3000%7C4000&LH_BIN=1`;
      await ebayPage.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await ebayPage.waitForTimeout(2000);

      const product = await ebayPage.evaluate(() => {
        const items = document.querySelectorAll('li.s-card, li.s-item');
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            const title = el.querySelector('.s-card__title span, .s-item__title')?.textContent.trim() || '';
            const price = el.querySelector('.s-card__price, .s-item__price')?.textContent.trim() || '';
            const url = el.querySelector('.s-card__link, .s-item__link')?.href || null;
            if (title && url && !title.includes('Shop on eBay') && !url.includes('123456')) {
                return { title: title.replace(/^New Listing/, '').trim(), price, url };
            }
        }
        return null;
      });

      if (product && product.url) {
        console.log(`Found: ${product.title} - ${product.price}`);
        results.AM4.eBay.push({ type: item.type, ...product });
      }
    }

    require('fs').writeFileSync('cart_results.json', JSON.stringify(results, null, 2));
    console.log("\nFinished scraping carts. Results saved to cart_results.json");
    await browser.close();

  } catch (error) {
    console.error("Error:", error);
  }
})();
