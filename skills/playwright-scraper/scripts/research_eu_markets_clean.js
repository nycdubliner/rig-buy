const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    let page = pages[1] || pages[0];

    const results = {};
    const brokenKeywords = [
      'rotto', 'danneggiato', 'funzionante', 'difettoso', 'ricambi', 'scatola', 'box', 'cerco', 'non',
      'cassé', 'endommagé', 'défectueux', 'pièces', 'ne',
      'defekt', 'kaputt', 'beschädigt', 'ersatzteile'
    ];

    const searchAndFilter = async (name, url, minPrice) => {
      console.log(`Researching ${name}...`);
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(5000);
        
        return await page.evaluate(({ brokenKeywords, minPrice }) => {
          const items = Array.from(document.querySelectorAll('article, .item-card, .ItemsList_item__mY9d3, a'));
          return items.map(item => {
            const text = item.innerText.replace(/\n/g, ' ').toLowerCase();
            const priceText = (text.match(/(\d+[\.,]?\d*)\s?€/) || [])[1];
            const priceVal = priceText ? parseInt(priceText.replace(/[^\d]/g, '')) : 0;
            return { text, priceVal };
          }).filter(i => {
            const hasKeyword = brokenKeywords.some(k => i.text.includes(k));
            const isTooCheap = i.priceVal < minPrice;
            const containsGPU = i.text.includes('3090');
            return containsGPU && !hasKeyword && !isTooCheap && i.priceVal < 1000;
          }).slice(0, 3);
        }, { brokenKeywords, minPrice });
      } catch (e) {
        console.log(`Error in ${name}: ${e.message}`);
        return [];
      }
    };

    results.italy = await searchAndFilter('Subito.it (Italy)', "https://www.subito.it/annunci-italia/vendita/usato/?q=rtx+3090", 750);
    results.france = await searchAndFilter('LeBonCoin (France)', "https://www.leboncoin.fr/recherche?category=15&text=rtx%203090", 750);

    console.log("CLEAN_DATA_START");
    console.log(JSON.stringify(results, null, 2));
    console.log("CLEAN_DATA_END");

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
