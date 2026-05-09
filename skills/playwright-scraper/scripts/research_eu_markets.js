const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    // Reuse an existing "New tab"
    let page = pages.find(p => p.url() === 'chrome://newtab/' || p.url().includes('about:blank'));
    if (!page) {
      console.log("No empty tab found, using the last tab...");
      page = pages[pages.length - 1];
    }
    console.log(`Using tab: ${page.url()}`);

    const results = {};

    const sites = [
      { name: 'Germany_Kleinanzeigen', url: 'https://www.kleinanzeigen.de/s-pc-zubehoer-software/rtx-3090/k0c225', query: 'rtx 3090' },
      { name: 'France_LeBonCoin', url: 'https://www.leboncoin.fr/recherche?category=15&text=rtx%203090', query: 'rtx 3090' },
      { name: 'Spain_Wallapop', url: 'https://es.wallapop.com/app/search?keywords=rtx%203090&filters_source=search_box', query: 'rtx 3090' },
      { name: 'Italy_Subito', url: 'https://www.subito.it/annunci-italia/vendita/usato/?q=rtx+3090', query: 'rtx 3090' },
      { name: 'Poland_OLX', url: 'https://www.olx.pl/oferty/q-rtx-3090/', query: 'rtx 3090' }
    ];

    for (const site of sites) {
      console.log(`Checking ${site.name}...`);
      try {
        await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(5000); // Wait for content
        
        const listings = await page.evaluate(() => {
          // Broad evaluation to find prices and titles
          const items = Array.from(document.querySelectorAll('article, .item, .ad-item, .card, a'));
          return items.map(i => ({
            text: i.innerText?.substring(0, 200).replace(/\n/g, ' '),
          })).filter(i => i.text && i.text.toLowerCase().includes('3090') && (i.text.includes('€') || i.text.includes('zł')));
        });
        
        results[site.name] = listings.slice(0, 5);
      } catch (e) {
        console.log(`Failed ${site.name}: ${e.message}`);
        results[site.name] = [];
      }
    }

    console.log("MARKET_DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("MARKET_DATA_END");

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
