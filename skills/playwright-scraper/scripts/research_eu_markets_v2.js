const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    // Reuse Tab 1
    let page = pages[1] || pages[0];
    console.log(`Using tab: ${page.url()}`);

    const results = {};

    const sites = [
      { name: 'Germany_Kleinanzeigen', url_4090: 'https://www.kleinanzeigen.de/s-pc-zubehoer-software/rtx-4090/k0c225', url_ram: 'https://www.kleinanzeigen.de/s-pc-zubehoer-software/64gb-ddr5/k0c225' },
      { name: 'France_LeBonCoin', url_4090: 'https://www.leboncoin.fr/recherche?category=15&text=rtx%204090', url_ram: 'https://www.leboncoin.fr/recherche?category=15&text=64go%20ddr5' },
      { name: 'Spain_Wallapop', url_4090: 'https://es.wallapop.com/app/search?keywords=rtx%204090', url_ram: 'https://es.wallapop.com/app/search?keywords=64gb%20ddr5' },
      { name: 'Italy_Subito', url_4090: 'https://www.subito.it/annunci-italia/vendita/usato/?q=rtx+4090', url_ram: 'https://www.subito.it/annunci-italia/vendita/usato/?q=64gb+ddr5' },
      { name: 'Poland_OLX', url_4090: 'https://www.olx.pl/oferty/q-rtx-4090/', url_ram: 'https://www.olx.pl/oferty/q-64gb-ddr5/' }
    ];

    for (const site of sites) {
      console.log(`Checking ${site.name} (4090)...`);
      try {
        await page.goto(site.url_4090, { waitUntil: 'load', timeout: 45000 });
        await page.waitForTimeout(5000);
        results[`${site.name}_4090`] = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('article, .item, .ad-item, .card, a')).map(i => ({
            text: i.innerText?.substring(0, 150).replace(/\n/g, ' '),
          })).filter(i => i.text && (i.text.toLowerCase().includes('4090')) && (i.text.includes('€') || i.text.includes('zł'))).slice(0, 5);
        });
      } catch (e) { console.log(`Failed 4090 ${site.name}`); }

      console.log(`Checking ${site.name} (RAM)...`);
      try {
        await page.goto(site.url_ram, { waitUntil: 'load', timeout: 45000 });
        await page.waitForTimeout(5000);
        results[`${site.name}_ram`] = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('article, .item, .ad-item, .card, a')).map(i => ({
            text: i.innerText?.substring(0, 150).replace(/\n/g, ' '),
          })).filter(i => i.text && (i.text.toLowerCase().includes('64') || i.text.toLowerCase().includes('gb')) && (i.text.includes('€') || i.text.includes('zł'))).slice(0, 5);
        });
      } catch (e) { console.log(`Failed RAM ${site.name}`); }
    }

    console.log("MARKET_DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("MARKET_DATA_END");

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
