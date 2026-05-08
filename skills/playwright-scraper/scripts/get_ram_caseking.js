const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    
    // Using a more specific query for a standard 32GB DDR5 6000 kit
    await page.goto('https://www.caseking.de/en/search?sSearch=32GB+DDR5-6000+Corsair+Vengeance', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-tile'));
      return items.slice(0, 3).map(el => {
        return {
          title: el.querySelector('.pdp-link a.link')?.textContent.trim(),
          price: el.querySelector('.js-unit-price')?.textContent.trim(),
          url: el.querySelector('.pdp-link a.link')?.href
        };
      });
    });
    
    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
