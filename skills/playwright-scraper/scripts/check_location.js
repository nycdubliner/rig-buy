const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Checking eBay Motherboard location...");
    await page.goto('https://www.ebay.ie/sch/i.html?_nkw=ASUS+ROG+Strix+X570-E+Gaming+motherboard&LH_BIN=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const mLink = page.locator('li.s-item .s-item__link, li.s-card .s-card__link').nth(1);
    if (await mLink.count() > 0) {
        const moboUrl = await mLink.getAttribute('href');
        await page.goto(moboUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        const location = await page.evaluate(() => {
            const locEl = document.querySelector('.ux-labels-values--itemLocation .ux-textspans--BOLD');
            if (locEl) return locEl.innerText;
            // Alternative selector for item location
            const locEl2 = document.querySelector('div[data-testid="ux-labels-values"] span.ux-textspans--BOLD');
            const allText = document.body.innerText;
            const match = allText.match(/Located in:\s*(.+)/i);
            if (match) return match[1];
            return 'Location not found';
        });
        console.log(`Motherboard Location: ${location}`);
    } else {
        console.log("Motherboard not found.");
    }

    console.log("\nChecking GMKtec EU store shipping...");
    await page.goto('https://de.gmktec.com/policies/shipping-policy', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const shippingInfo = await page.evaluate(() => {
        return document.body.innerText.substring(0, 1000);
    });
    console.log(`GMKtec Shipping Info: ${shippingInfo}`);

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
