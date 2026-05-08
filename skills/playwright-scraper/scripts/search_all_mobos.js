const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const boards = [
  'ASUS ROG Strix X570-E',
  'MSI MEG X570 UNIFY',
  'ASUS Pro WS X570-ACE',
  'MSI MEG X570 ACE'
];

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    let allResults = [];

    for (const board of boards) {
      console.log(`\nSearching for: ${board}`);
      // LH_BIN=1 (Buy It Now), LH_PrefLoc=3 (European Union)
      const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(board)}&LH_BIN=1&LH_PrefLoc=3`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const items = await page.evaluate(() => {
        const results = [];
        const nodes = document.querySelectorAll('li.s-item, li.s-card');
        for (let i = 1; i < Math.min(nodes.length, 6); i++) { // skip index 0
          const el = nodes[i];
          const title = el.querySelector('.s-item__title, .s-card__title span')?.textContent.trim() || '';
          const price = el.querySelector('.s-item__price, .s-card__price')?.textContent.trim() || '';
          const url = el.querySelector('.s-item__link, .s-card__link')?.href || '';
          const location = el.querySelector('.s-item__itemLocation, .s-item__location')?.textContent.trim() || 'Unknown';
          
          if (title && url && !title.includes('Shop on eBay') && !url.includes('123456')) {
             const t = title.toLowerCase();
             if (!t.includes('waterblock') && !t.includes('faulty') && !t.includes('defekt') &&
                 !t.includes('ram') && !t.includes('memory') && !t.includes('shield') &&
                 !t.includes('bios') && !t.includes('ssd') && !t.includes('bezel') && !t.includes('cooler')) {
                results.push({
                   title: title.replace(/^New Listing/, '').trim(),
                   price,
                   url,
                   location
                });
             }
          }
        }
        return results;
      });

      console.log(`Found ${items.length} potential items for ${board}.`);
      
      // Parse prices
      for (const item of items) {
         let priceNum = 9999;
         const match = item.price.match(/[\d,.]+/);
         if (match) {
             priceNum = parseFloat(match[0].replace(/,/g, ''));
         }
         console.log(`Raw price: ${item.price}, Parsed: ${priceNum}`);
         if (priceNum > 100 && priceNum < 500) {
             item.priceNum = priceNum;
             item.boardType = board;
             allResults.push(item);
         }
      }
    }

    // Sort all results by price
    allResults.sort((a, b) => a.priceNum - b.priceNum);
    const topResults = allResults.slice(0, 6);

    for (const item of topResults) {
        console.log(`Checking location for: ${item.title}`);
        await page.goto(item.url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        
        const loc = await page.evaluate(() => {
            const allText = document.body.innerText;
            const match = allText.match(/Located in:\s*(.+)/i);
            return match ? match[1] : 'Unknown';
        });
        item.actualLocation = loc;
        console.log(` -> Location: ${loc}`);
    }

    console.log("\n--- TOP CHEAPEST BOARDS W/ LOCATION ---");
    console.log(JSON.stringify(topResults, null, 2));

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
