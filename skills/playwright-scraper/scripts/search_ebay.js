const { chromium } = require('playwright');

const queries = [
  'Ryzen 9 7950X',
  'RX 7800 XT',
  '32GB DDR5 6000 CL30'
];

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    
    // Use the existing page or create a new one in the existing context
    let page = contexts[0].pages()[0];
    if (!page) {
        page = await contexts[0].newPage();
    }

    const results = {};

    for (const query of queries) {
      console.log(`Searching for: ${query}`);
      // Search for Used (3000) or Refurbished (4000), Buy It Now (LH_BIN=1)
      const searchUrl = `https://www.ebay.ie/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_ItemCondition=3000%7C4000&LH_BIN=1`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000); // Wait for images/prices to populate

      const data = await page.evaluate(() => {
        return document.body.innerText;
      });
      require('fs').writeFileSync('ebay_debug.txt', data);
      console.log("Debug Text written to ebay_debug.txt");
      break;
    }

    console.log("\n--- SCRAPING RESULTS ---");
    console.log(JSON.stringify(results, null, 2));
    
    await browser.close(); // Disconnects from CDP, does not kill browser
  } catch (error) {
    console.error("Error during scraping:", error);
  }
})();
