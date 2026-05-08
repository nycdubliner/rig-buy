const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const pages = contexts[0].pages();
    
    let advertsPage = pages.find(p => p.url().includes('adverts.ie'));
    let donedealPage = pages.find(p => p.url().includes('donedeal.ie'));

    if (advertsPage) {
      console.log("--- ADVERTS.IE RESULTS ---");
      const results = await advertsPage.evaluate(() => {
         const items = Array.from(document.querySelectorAll('.sr-grid-cell'));
         return items.map(el => {
             const titleEl = el.querySelector('.title a');
             const priceEl = el.querySelector('.price a');
             return {
                 title: titleEl ? titleEl.textContent.trim() : null,
                 price: priceEl ? priceEl.textContent.trim() : null,
                 url: titleEl ? titleEl.href : null
             };
         }).filter(i => i.title);
      });
      console.log(JSON.stringify(results.slice(0, 5), null, 2));
    }

    if (donedealPage) {
      console.log("\n--- DONEDEAL.IE RESULTS ---");
      const results = await donedealPage.evaluate(() => {
         // DoneDeal uses dynamic classes, let's grab standard links that look like ads
         const links = Array.from(document.querySelectorAll('a[href*="/pc-mac/"], a[href*="/desktop"]'));
         return links.map(el => {
             const container = el.closest('li') || el;
             const textElements = Array.from(container.querySelectorAll('p'));
             // Try to guess title and price based on length and characters
             let title = '', price = '';
             textElements.forEach(p => {
                 const text = p.textContent.trim();
                 if (text.includes('€') || text.match(/^[\d,.]+$/)) price = text;
                 else if (text.length > 15 && text.length < 100) title = text;
             });
             return {
                 title: title || el.textContent.replace(/€.*/, '').trim(),
                 price: price || 'Unknown',
                 url: el.href
             };
         }).filter(i => i.url && i.title.length > 5);
      });
      // Deduplicate by URL
      const unique = Array.from(new Map(results.map(item => [item.url, item])).values());
      console.log(JSON.stringify(unique.slice(0, 5), null, 2));
    }

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
