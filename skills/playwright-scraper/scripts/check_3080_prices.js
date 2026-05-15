const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const page = contexts[0].pages()[1] || contexts[0].pages()[0];
    const results = {};

    const search = async (name, query) => {
      console.log(`Checking ${name}...`);
      await page.goto(`https://www.ebay.de/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_BIN=1&_sop=15`, { waitUntil: 'load' });
      await page.waitForTimeout(3000);
      return await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.s-item__info')).map(item => ({
          title: item.querySelector('.s-item__title')?.innerText,
          price: item.querySelector('.s-item__price')?.innerText,
        })).filter(i => i.title && i.price && !i.title.includes('Shop on eBay')).slice(0, 3);
      });
    };

    results.v10gb = await search('3080 10GB', 'RTX 3080 10GB -damaged -rotto -defekt');
    results.v12gb = await search('3080 12GB', 'RTX 3080 12GB -damaged -rotto -defekt');

    console.log("DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("DATA_END");
    await browser.close();
  } catch (e) { console.error(e.message); }
})();
