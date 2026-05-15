const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    let page = pages[1] || pages[0];

    const targets = [
      { name: 'RTX 3090', query: 'RTX 3090 -damaged -rotto -defekt' },
      { name: 'RTX 4090', query: 'RTX 4090 -damaged -rotto -defekt' },
      { name: 'RX 7900 XTX', query: 'RX 7900 XTX -damaged -rotto -defekt' },
      { name: 'Intel Arc A770 16GB', query: 'Intel Arc A770 16GB' }
    ];

    const results = {};

    for (const target of targets) {
      console.log(`Checking eBay.de for ${target.name}...`);
      await page.goto(`https://www.ebay.de/sch/i.html?_nkw=${encodeURIComponent(target.query)}&LH_BIN=1&_sop=15`, { waitUntil: 'load' });
      await page.waitForTimeout(3000);
      results[target.name] = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.s-item__info')).map(item => {
          const title = item.querySelector('.s-item__title')?.innerText;
          const price = item.querySelector('.s-item__price')?.innerText;
          return { title, price };
        }).filter(i => i.title && i.price && !i.title.includes('Shop on eBay')).slice(0, 3);
      });
    }

    console.log("REAL_MARKET_DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("REAL_MARKET_DATA_END");

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
