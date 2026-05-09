const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const page = await context.newPage();
    
    console.log("Searching MemoryC for budget AM4 motherboards...");
    await page.goto("https://www.memoryc.ie/computer-components/motherboards/am4?orderby=price", { waitUntil: 'domcontentloaded' });
    
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-listing-item'));
      return items.map(item => {
        const title = item.querySelector('.product-title')?.innerText;
        const price = item.querySelector('.product-price')?.innerText;
        return { title, price };
      }).filter(i => i.title && i.price);
    });

    console.log("JSON_START");
    console.log(JSON.stringify(results.slice(0, 5)));
    console.log("JSON_END");

    await page.close();
    await browser.close();
  } catch (e) {
    console.error("Error: " + e.message);
  }
})();
