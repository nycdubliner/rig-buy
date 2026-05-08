const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Navigating to GMKtec...");
    await page.goto('https://de.gmktec.com/en/products/gmktec-evo-x2-amd-ryzen%E2%84%A2-ai-max-395-mini-pc-1?variant=51106345058488', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const price = document.querySelector('.price, .price__regular, .price-item, .money')?.textContent.trim();
      const title = document.querySelector('h1')?.textContent.trim();
      return { title, price };
    });

    console.log(JSON.stringify(data, null, 2));

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();