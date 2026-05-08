const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Searching CeX Ireland for X570 motherboards...");
    await page.goto('https://ie.webuy.com/search?stext=X570', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[class^="ProductCard"]'));
      return items.map(el => {
        const title = el.querySelector('h1, h2, h3, a')?.textContent.trim();
        const price = el.querySelector('.price, p')?.textContent.trim();
        return { title, price };
      }).filter(i => i.title);
    });

    console.log(JSON.stringify(results.slice(0, 5), null, 2));

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();