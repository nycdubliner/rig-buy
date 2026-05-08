const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Searching Amazon.de for 64GB DDR4 3200 CL16...");
    await page.goto('https://www.amazon.de/-/en/s?k=64GB+DDR4+3200+CL16+kit', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]'));
      return items.map(el => {
        const titleEl = el.querySelector('[data-cy="title-recipe"] a.a-link-normal');
        const priceWhole = el.querySelector('.a-price-whole');
        const priceFraction = el.querySelector('.a-price-fraction');
        
        if (titleEl && priceWhole) {
            const title = titleEl.textContent.trim();
            const price = priceWhole.textContent.trim().replace(/,/g, '') + (priceFraction ? priceFraction.textContent.trim() : '');
            
            // Filter out obviously wrong items
            if (title.toLowerCase().includes('64gb') && title.toLowerCase().includes('ddr4')) {
                return { title, price, url: titleEl.href };
            }
        }
        return null;
      }).filter(Boolean).slice(0, 5);
    });

    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();