const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Debugging Amazon CPU...");
    await page.goto('https://www.amazon.de/-/en/dp/B09VCHR1VH/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const amzHtml = await page.evaluate(() => {
        const btn = document.querySelector('input[name="submit.add-to-cart"], button:has-text("Add to Basket"), #add-to-cart-button');
        if (btn) return "Button found: " + btn.outerHTML;
        return "Not found. Body: " + document.body.innerHTML.substring(0, 1000);
    });
    console.log("Amazon:", amzHtml);

    console.log("Debugging eBay Mobo...");
    await page.goto('https://www.ebay.ie/sch/i.html?_nkw=ASUS+ROG+Strix+X570-E+Gaming+motherboard&LH_BIN=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const mLink = page.locator('li.s-item .s-item__link, li.s-card .s-card__link').nth(1);
    if (await mLink.count() > 0) {
        const moboUrl = await mLink.getAttribute('href');
        await page.goto(moboUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        const ebayHtml = await page.evaluate(() => {
            const btn = document.querySelector('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart")');
            if (btn) return "Button found: " + btn.outerHTML;
            return "Not found. Body: " + document.body.innerHTML.substring(0, 1000);
        });
        console.log("eBay:", ebayHtml);
    }

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
