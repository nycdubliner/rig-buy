const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    
    // Use an existing page or open a new one in the background
    const page = await context.newPage();
    
    console.log("Searching Amazon.ie for budget AM4 motherboards...");
    await page.goto("https://www.amazon.ie/s?k=B550+motherboard&rh=p_36%3A-12000&language=en_GB", { waitUntil: 'domcontentloaded' });
    
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.s-result-item'));
      return items.map(item => {
        const title = item.querySelector('h2')?.innerText;
        const price = item.querySelector('.a-price-whole')?.innerText;
        const link = item.querySelector('h2 a')?.href;
        return { title, price, link };
      }).filter(i => i.title && i.price && (i.title.includes('B550') || i.title.includes('B450')));
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
