const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    
    await page.goto('https://www.caseking.de/en/search?sSearch=Corsair+RM1000e', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const product1000 = await page.evaluate(() => {
      const el = document.querySelector('.product-tile');
      return el ? { title: el.querySelector('.pdp-link a.link')?.textContent.trim(), price: el.querySelector('.js-unit-price')?.textContent.trim() } : null;
    });

    await page.goto('https://www.caseking.de/en/search?sSearch=Corsair+RM850e', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const product850 = await page.evaluate(() => {
      const el = document.querySelector('.product-tile');
      return el ? { title: el.querySelector('.pdp-link a.link')?.textContent.trim(), price: el.querySelector('.js-unit-price')?.textContent.trim() } : null;
    });

    console.log("1000W:", JSON.stringify(product1000));
    console.log("850W:", JSON.stringify(product850));

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
