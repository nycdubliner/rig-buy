const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    // Use Tab 1 (chrome://new-tab-page/) as our dedicated research tab
    let page = pages[1] || pages[0];
    console.log(`Using tab ${pages.indexOf(page)}: ${page.url()}`);

    const results = {};

    const searchSite = async (name, url, evalFn) => {
      try {
        console.log(`Searching ${name}...`);
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(5000); // More time for background throttling
        
        const data = await page.evaluate(evalFn);
        if (data.length === 0) {
          console.log(`No results for ${name}, taking debug screenshot...`);
          await page.screenshot({ path: `debug_${name}.png` });
        }
        results[name] = data;
      } catch (e) {
        console.log(`Failed to search ${name}: ${e.message}`);
        results[name] = [];
      }
    };

    await searchSite('adverts_3090', "https://www.adverts.ie/for-sale/q_3090/?sortby=price-asc", () => {
      // Broad search for anything with a price and 3090 in title
      const items = Array.from(document.querySelectorAll('div, a, li')).filter(el => {
        const text = el.innerText || "";
        return text.includes('3090') && (text.includes('€') || text.includes('EUR'));
      });
      return items.slice(0, 5).map(i => ({ text: i.innerText.substring(0, 100) }));
    });

    await searchSite('ebay_7900xtx', "https://www.ebay.de/sch/i.html?_nkw=Radeon+7900+XTX+-case+-mount&_sacat=0&LH_BIN=1&_sop=15", () => {
      const items = Array.from(document.querySelectorAll('.s-item__wrapper, .s-item'));
      return items.map(item => ({
        title: item.querySelector('.s-item__title')?.innerText,
        price: item.querySelector('.s-item__price')?.innerText,
      })).filter(i => i.title && i.title.toLowerCase().includes('7900') && !i.title.includes('Shop on eBay')).slice(0, 5);
    });

    await searchSite('amazon_mac', "https://www.amazon.de/s?k=Mac+Studio+M2+Ultra+192GB+-stand+-mount&language=en_GB", () => {
      const items = Array.from(document.querySelectorAll('.s-result-item'));
      return items.map(item => ({
        title: item.querySelector('h2')?.innerText,
        price: item.querySelector('.a-price-whole')?.innerText,
      })).filter(i => i.title && i.title.toLowerCase().includes('studio') && i.title.toLowerCase().includes('ultra')).slice(0, 3);
    });

    console.log("RESULT_DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("RESULT_DATA_END");

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
