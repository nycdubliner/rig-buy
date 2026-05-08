const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Checking user-provided eBay link...");
    await page.goto('https://www.ebay.ie/itm/176474512035', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const itemDetails = await page.evaluate(() => {
        const title = document.querySelector('h1')?.innerText || 'Unknown Title';
        
        // Find Item Location
        const allText = document.body.innerText;
        const locMatch = allText.match(/Located in:\s*(.+)/i);
        const location = locMatch ? locMatch[1] : 'Location not found';
        
        // Check postage
        const postageEl = document.querySelector('.ux-labels-values--shipping');
        const postage = postageEl ? postageEl.innerText.replace(/\n/g, ' ') : 'Postage info not found';

        return { title, location, postage };
    });

    console.log(JSON.stringify(itemDetails, null, 2));

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
