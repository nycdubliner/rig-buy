const { chromium } = require('playwright');

(async () => {
  try {
    console.log("Connecting to main Chrome on 9222...");
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    if (contexts.length === 0) return console.log("No contexts");
    const pages = contexts[0].pages();
    
    let azPage = pages.find(p => p.url().includes('amazon.de'));
    if (!azPage) azPage = await contexts[0].newPage();

    const queries = [
      { q: 'Ryzen 5 5600 processor', type: 'CPU' },
      { q: '64GB DDR4 3200 desktop memory', type: 'RAM' }
    ];

    const results = {};

    for (const item of queries) {
      console.log(`Navigating to Amazon.de for ${item.q}...`);
      await azPage.goto(`https://www.amazon.de/-/en/s?k=${encodeURIComponent(item.q)}`, { waitUntil: 'domcontentloaded' });
      await azPage.waitForTimeout(3000);

      const product = await azPage.evaluate(() => {
        const items = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]'));
        for (const el of items) {
          const titleEl = el.querySelector('[data-cy="title-recipe"] a.a-link-normal');
          const title = titleEl ? titleEl.textContent.trim() : '';
          const priceWhole = el.querySelector('.a-price-whole');
          const priceFraction = el.querySelector('.a-price-fraction');
          
          if (title && priceWhole) {
              const price = priceWhole.textContent.trim().replace(/,/g, '') + (priceFraction ? priceFraction.textContent.trim() : '');
              return {
                 title,
                 price,
                 url: titleEl.href
              };
          }
        }
        return null;
      });

      if (product) {
        console.log(`Found: ${product.title} for ${product.price}`);
        results[item.type] = product;
      } else {
        console.log("No match found.");
        results[item.type] = { title: 'Not found', price: 'N/A', url: '#' };
      }
    }
    
    console.log("\n--- RESULTS ---");
    console.log(JSON.stringify(results, null, 2));
    
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
