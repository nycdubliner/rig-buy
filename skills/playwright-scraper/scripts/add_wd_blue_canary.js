const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    // Find the Amazon tab
    let page = pages.find(p => p.url().includes('amazon.ie'));
    
    if (!page) {
      console.log("Amazon tab not found, opening new tab...");
      page = await context.newPage();
    } else {
      console.log(`Found Amazon tab: ${page.url()}`);
      await page.bringToFront();
    }

    // 1. Navigate to WD Blue SN5100 2TB
    const wdBlueUrl = "https://www.amazon.ie/WD-Blue-SN5100-2TB-NVMe/dp/B0DNMCY7B3/";
    console.log(`Navigating to: ${wdBlueUrl}`);
    await page.goto(wdBlueUrl, { waitUntil: 'domcontentloaded' });

    // 2. Add to Basket
    console.log("Checking for Add to Basket button...");
    try {
      const addToBasketBtn = await page.waitForSelector('#add-to-cart-button, #add-to-basket-button, input[name="submit.add-to-cart"], #buy-now-button', { timeout: 15000 });
      await addToBasketBtn.click();
      console.log("Clicked Add to Basket");
    } catch (e) {
      console.log("Button not found with primary selectors, searching by text...");
      const buttons = await page.$$('button, input[type="button"], input[type="submit"]');
      let clicked = false;
      for (const btn of buttons) {
        const text = await btn.innerText();
        const val = await btn.getAttribute('value');
        if ((text && text.includes('Add to')) || (val && val.includes('Add to'))) {
          await btn.click();
          console.log(`Clicked button with text/value: ${text || val}`);
          clicked = true;
          break;
        }
      }
      if (!clicked) {
        await page.screenshot({ path: 'debug_amazon_fail.png' });
        throw new Error("Could not find Add to Basket button. Screenshot saved to debug_amazon_fail.png");
      }
    }

    // 3. Go to Cart
    await page.waitForTimeout(2000);
    await page.goto("https://www.amazon.ie/gp/cart/view.html?ref_=nav_cart");
    console.log("Navigated to Cart");

    // 4. Proceed to Checkout
    const proceedBtn = await page.waitForSelector('input[name="proceedToRetailCheckout"], #hlb-ptc-btn-native', { timeout: 10000 });
    await proceedBtn.click();
    console.log("Clicked Proceed to Checkout");

    // Wait for the next page to load to see if it's the sign-in or address selection
    await page.waitForTimeout(3000);
    console.log(`Final URL: ${page.url()}`);
    console.log(`Final Page Title: ${await page.title()}`);

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
