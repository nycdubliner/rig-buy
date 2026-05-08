const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    
    await page.goto('https://www.paradigit.ie/search?q=32GB+DDR5+6000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const results = await page.evaluate(() => {
      // Paradigit product list items
      const items = Array.from(document.querySelectorAll('.product-list-item, .product-card'));
      return items.slice(0, 3).map(el => {
        const titleEl = el.querySelector('.title, .product-name');
        const priceEl = el.querySelector('.price, .current-price');
        return {
          title: titleEl ? titleEl.textContent.trim() : 'Unknown',
          price: priceEl ? priceEl.textContent.trim() : 'Unknown',
        };
      });
    });
    
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
