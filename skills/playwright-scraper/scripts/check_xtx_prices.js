const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const page = contexts[0].pages()[1] || contexts[0].pages()[0];
    
    console.log("Checking eBay.de for RX 7900 XTX prices...");
    await page.goto("https://www.ebay.de/sch/i.html?_nkw=RX+7900+XTX+-damaged+-rotto+-defekt&LH_BIN=1&_sop=15&_udlo=600&_ipg=60", { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    
    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.s-item__info')).map(item => ({
        title: item.querySelector('.s-item__title')?.innerText,
        price: item.querySelector('.s-item__price')?.innerText,
      })).filter(i => i.title && i.price && !i.title.includes('Shop on eBay')).slice(0, 5);
    });

    console.log("XTX_DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("XTX_DATA_END");
    await browser.close();
  } catch (e) { console.error(e.message); }
})();
