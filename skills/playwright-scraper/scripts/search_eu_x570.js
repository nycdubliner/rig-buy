const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    console.log("Searching eBay for EU located Strix X570-E and Unify boards...");
    const queries = ['ASUS ROG Strix X570-E Gaming motherboard', 'MSI MEG X570 Unify motherboard'];
    const allItems = [];

    for (const q of queries) {
      const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(q)}&LH_BIN=1&LH_PrefLoc=3`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const items = await page.evaluate(() => {
        const results = [];
        const nodes = document.querySelectorAll('li.s-item, li.s-card');
        for (let i = 1; i < Math.min(nodes.length, 10); i++) {
          const el = nodes[i];
          const title = el.querySelector('.s-item__title, .s-card__title span')?.textContent.trim() || '';
          const price = el.querySelector('.s-item__price, .s-card__price')?.textContent.trim() || '';
          const url = el.querySelector('.s-item__link, .s-card__link')?.href || '';
          
          let priceNum = 0;
          const match = price.match(/[\d,.]+/);
          if (match) priceNum = parseFloat(match[0].replace(/,/g, ''));

          if (title && url && priceNum > 150) {
             const t = title.toLowerCase();
             if (!t.includes('ram') && !t.includes('memory') && !t.includes('faulty')) {
                 results.push({ title: title.replace(/^New Listing/, '').trim(), price, url });
             }
          }
        }
        return results;
      });
      allItems.push(...items);
    }

    const validItems = [];
    for (const item of allItems.slice(0, 3)) { // Check top 3
       console.log(`Checking ${item.url}...`);
       await page.goto(item.url, { waitUntil: 'domcontentloaded' });
       await page.waitForTimeout(2000);
       const details = await page.evaluate(() => {
          const location = document.querySelector('.ux-labels-values--itemLocation')?.innerText.replace(/\n/g, ' ') || 'Unknown';
          const shipping = document.querySelector('.ux-labels-values--shipping')?.innerText.replace(/\n/g, ' ') || 'Unknown';
          return { location, shipping };
       });
       validItems.push({ ...item, ...details });
    }

    console.log(JSON.stringify(validItems, null, 2));
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
