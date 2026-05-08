const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    // Check Caseking Search
    await page.goto(`https://www.caseking.de/en/search?sSearch=Ryzen+5+7600X`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    let html = await page.evaluate(() => {
       const box = document.querySelector('.product-box, .product, .article, .listing');
       return box ? box.innerHTML : document.body.innerText.substring(0, 1000);
    });
    require('fs').writeFileSync('caseking_debug.html', html);
    
    // Check Paradigit Search
    await page.goto(`https://www.paradigit.ie/search?q=Sapphire+7800+XT`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    let html2 = await page.evaluate(() => {
       const box = document.querySelector('.product-list-item, .product-card, .list-item, .search-result');
       return box ? box.innerHTML : document.body.innerText.substring(0, 1000);
    });
    require('fs').writeFileSync('paradigit_debug.html', html2);

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();