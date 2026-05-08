const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Searching Alternate.de for 64GB DDR4...");
    await page.goto('https://www.alternate.de/Arbeitsspeicher/DDR4?filter_20042=64', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-list a.card'));
      return items.map(el => {
        const titleEl = el.querySelector('.product-name, .title');
        const priceEl = el.querySelector('.price');
        if (titleEl && priceEl) {
            return {
                title: titleEl.textContent.trim(),
                price: priceEl.textContent.trim(),
                url: el.href
            }
        }
        return null;
      }).filter(Boolean).slice(0, 3);
    });

    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();