const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    const boards = ['MSI MEG X570 UNIFY', 'ASUS Pro WS X570-ACE'];
    for (const b of boards) {
      console.log(`Searching Amazon for ${b}...`);
      await page.goto(`https://www.amazon.de/-/en/s?k=${encodeURIComponent(b)}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const results = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]'));
        return items.map(el => {
          const title = el.querySelector('[data-cy="title-recipe"] a.a-link-normal')?.textContent.trim() || '';
          const priceWhole = el.querySelector('.a-price-whole')?.textContent.trim().replace(/,/g, '') || '';
          return { title, price: priceWhole };
        }).filter(i => i.title.includes('X570')).slice(0, 3);
      });
      console.log(JSON.stringify(results, null, 2));
    }
    
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();