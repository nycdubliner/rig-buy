const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    const url = 'https://www.ebay.ie/itm/318262050465'; // The MSI MEG X570 UNIFY for 170.24
    console.log(`Checking shipping for ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const details = await page.evaluate(() => {
        const title = document.querySelector('h1')?.innerText || 'Unknown Title';
        const price = document.querySelector('.x-price-primary')?.innerText || 'Unknown Price';
        const shipping = document.querySelector('.ux-labels-values--shipping')?.innerText.replace(/\n/g, ' ') || 'Shipping info not found';
        const location = document.querySelector('.ux-labels-values--itemLocation')?.innerText.replace(/\n/g, ' ') || 'Location not found';
        return { title, price, shipping, location };
    });

    console.log(JSON.stringify(details, null, 2));
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
