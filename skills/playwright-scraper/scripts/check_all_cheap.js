const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    const urls = [
      'https://www.ebay.ie/itm/186286512324', // Pro WS X570-ACE (198)
      'https://www.ebay.ie/itm/176474512035', // Pro WS X570-ACE (198)
      'https://www.ebay.ie/itm/157867365654', // Pro WS X570-ACE (218)
      'https://www.ebay.ie/itm/406890058237', // ROG Strix X570-E (184)
      'https://www.ebay.ie/itm/227304358471'  // MEG X570 ACE (240)
    ];

    const results = [];

    for (const url of urls) {
      console.log(`Checking ${url}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      const details = await page.evaluate((currentUrl) => {
          const title = document.querySelector('h1')?.innerText || 'Unknown Title';
          const price = document.querySelector('.x-price-primary')?.innerText || 'Unknown Price';
          const shippingInfo = document.querySelector('.ux-labels-values--shipping')?.innerText.replace(/\n/g, ' ') || 'Unknown Shipping';
          return { title, price, shippingInfo, url: currentUrl };
      }, url);

      results.push(details);
    }

    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
