const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    // Find a "New tab" to reuse
    let page = pages.find(p => p.url() === 'chrome://newtab/' || p.url().includes('about:blank'));
    if (!page) page = await context.newPage();

    const results = {};

    // 1. Search Adverts.ie for RTX 3090
    console.log("Searching Adverts.ie for RTX 3090...");
    await page.goto("https://www.adverts.ie/for-sale/q_rtx+3090/sortby_best_match-desc", { waitUntil: 'domcontentloaded' });
    results.adverts_3090 = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.search-item')).map(item => ({
        title: item.querySelector('.title a')?.innerText,
        price: item.querySelector('.price a')?.innerText,
      })).filter(i => i.title && i.price).slice(0, 5);
    });

    // 2. Search eBay.de for 7900 XTX
    console.log("Searching eBay.de for RX 7900 XTX...");
    await page.goto("https://www.ebay.de/sch/i.html?_nkw=RX+7900+XTX&_sacat=0&LH_BIN=1&_sop=15", { waitUntil: 'domcontentloaded' });
    results.ebay_7900xtx = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.s-item')).map(item => ({
        title: item.querySelector('.s-item__title')?.innerText,
        price: item.querySelector('.s-item__price')?.innerText,
      })).filter(i => i.title && i.price && !i.title.includes('Shop on eBay')).slice(0, 5);
    });

    // 3. Search Amazon.de for Mac Studio M2 Ultra
    console.log("Searching Amazon.de for Mac Studio M2 Ultra...");
    await page.goto("https://www.amazon.de/s?k=Mac+Studio+M2+Ultra&language=en_GB", { waitUntil: 'domcontentloaded' });
    results.amazon_mac = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.s-result-item')).map(item => ({
        title: item.querySelector('h2')?.innerText,
        price: item.querySelector('.a-price-whole')?.innerText,
      })).filter(i => i.title && i.price && i.title.includes('M2 Ultra')).slice(0, 3);
    });

    console.log("RESULT_DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("RESULT_DATA_END");

    await page.close();
    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
