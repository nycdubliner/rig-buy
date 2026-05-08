const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    const query = 'Ryzen 9 7950X';
    const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_ItemCondition=3000%7C4000&LH_BIN=1`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const items = document.querySelectorAll('li.s-card');
      if (items.length > 0) {
        return items[0].innerHTML;
      }
      return 'No li.s-card found';
    });

    require('fs').writeFileSync('ebay_debug.html', data);
    console.log("Debug written");
    
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
