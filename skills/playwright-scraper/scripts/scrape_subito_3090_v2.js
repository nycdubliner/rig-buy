const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    let page = pages[1] || pages[0];
    console.log(`Using background tab: ${page.url()}`);

    console.log("Searching Subito.it for RTX 3090...");
    await page.goto("https://www.subito.it/annunci-italia/vendita/usato/?q=rtx+3090", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000); 

    const deals = await page.evaluate(() => {
      // Find all elements that look like a price or a title
      const elements = Array.from(document.querySelectorAll('.ItemsList_item__mY9d3, a, h2, span'));
      const results = [];
      
      // Look for text that looks like a price near '3090'
      const items = Array.from(document.querySelectorAll('[class*="item"], article, .card'));
      return items.map(item => ({
        text: item.innerText.replace(/\n/g, ' ').substring(0, 150)
      })).filter(i => i.text.toLowerCase().includes('3090') && i.text.includes('€')).slice(0, 10);
    });

    if (deals.length === 0) {
      console.log("No deals found, taking screenshot for debugging...");
      await page.screenshot({ path: 'debug_subito.png' });
    }

    console.log("DEAL_DATA_START");
    console.log(JSON.stringify(deals, null, 2));
    console.log("DEAL_DATA_END");

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
