const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("--- Clearing Carts ---");

    // 1. Clear eBay Cart
    console.log("Clearing eBay Cart...");
    await page.goto('https://cart.payments.ebay.ie/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ebayRemoves = await page.locator('button[data-test-id="cart-remove-item"]').all();
    for (let i = 0; i < 5 && ebayRemoves.length > 0; i++) { // Max 5 loops to prevent infinite
        await ebayRemoves[0].click({force: true}).catch(()=>{});
        await page.waitForTimeout(2000);
        ebayRemoves = await page.locator('button[data-test-id="cart-remove-item"]').all();
    }
    console.log("eBay Cart Cleared.");

    // 2. Clear Amazon Cart
    console.log("Clearing Amazon Cart...");
    await page.goto('https://www.amazon.de/-/en/cart', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let amzRemoves = await page.locator('input[value="Delete"]').all();
    for (let btn of amzRemoves) {
        await btn.click({force: true}).catch(()=>{});
        await page.waitForTimeout(1000);
    }
    console.log("Amazon Cart Cleared.");

    // 3. Clear Caseking Cart
    console.log("Clearing Caseking Cart...");
    await page.goto('https://www.caseking.de/en/checkout/cart', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ckRemoves = await page.locator('.btn-remove').all();
    for (let btn of ckRemoves) {
        await btn.click({force: true}).catch(()=>{});
        await page.waitForTimeout(1000);
    }
    console.log("Caseking Cart Cleared.");

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
