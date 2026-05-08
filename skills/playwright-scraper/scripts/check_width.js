const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    await page.goto('http://127.0.0.1:8000/build-quote.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const dims = await page.evaluate(() => {
      const table = document.querySelector('table');
      const section = document.querySelector('section.card');
      const grid = document.querySelector('.grid');
      const gridStyle = window.getComputedStyle(grid);
      
      return {
        windowWidth: window.innerWidth,
        tableWidth: table ? table.offsetWidth : 0,
        sectionWidth: section ? section.offsetWidth : 0,
        gridTemplateColumns: gridStyle.gridTemplateColumns
      };
    });

    console.log("DOM Measurements:", dims);
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
