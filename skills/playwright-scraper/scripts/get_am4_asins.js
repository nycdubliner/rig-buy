const { chromium } = require('playwright');

const asins = {
  CPU: 'B09VCHR1VH', // Ryzen 5 5600
  RAM: 'B07YV9VZY1'  // Corsair Vengeance LPX 64GB DDR4 3200
};

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    if (contexts.length === 0) return console.log("No contexts");
    const pages = contexts[0].pages();
    
    let azPage = pages.find(p => p.url().includes('amazon.de'));
    if (!azPage) azPage = await contexts[0].newPage();

    const results = {};

    for (const [type, asin] of Object.entries(asins)) {
      const url = `https://www.amazon.de/-/en/dp/${asin}/`;
      console.log(`Navigating to Amazon.de for ${type} (${asin})...`);
      await azPage.goto(url, { waitUntil: 'domcontentloaded' });
      await azPage.waitForTimeout(3000);

      const product = await azPage.evaluate(() => {
        const titleEl = document.querySelector('#productTitle');
        const priceWhole = document.querySelector('.a-price-whole');
        const priceFraction = document.querySelector('.a-price-fraction');
        
        if (titleEl && priceWhole) {
            const price = priceWhole.textContent.trim().replace(/,/g, '') + (priceFraction ? priceFraction.textContent.trim() : '');
            return {
               title: titleEl.textContent.trim(),
               price
            };
        }
        return null;
      });

      if (product) {
        console.log(`Found: ${product.title} for ${product.price}`);
        results[type] = { ...product, url };
      } else {
        console.log("No match found.");
        results[type] = { title: 'Not found', price: 'N/A', url };
      }
    }
    
    console.log("\n--- RESULTS ---");
    console.log(JSON.stringify(results, null, 2));
    
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
