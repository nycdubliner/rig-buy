const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("--- Fixing Motherboard in eBay Cart ---");

    await page.goto('https://cart.payments.ebay.ie/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Find all cart items
    const items = page.locator('.cart-bucket .item-title');
    const count = await items.count();
    
    for (let i = 0; i < count; i++) {
        const title = await items.nth(i).textContent();
        if (title && (title.includes('X570-E') || title.includes('X570-ACE') || title.includes('ASUS'))) {
            console.log(`Found old board: ${title}`);
            // The remove button is usually inside the same item container
            const removeBtn = items.nth(i).locator('..').locator('..').locator('..').locator('..').locator('button[data-test-id="cart-remove-item"]');
            if (await removeBtn.count() > 0) {
                await removeBtn.first().click({force: true}).catch(()=>{});
                console.log("Removed old board from cart.");
                await page.waitForTimeout(3000);
            }
        }
    }

    console.log("Adding MSI MEG X570 Unify (Germany)...");
    await page.goto('https://www.ebay.ie/itm/168151690758', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    let addBtn = page.locator('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart")').first();
    if (await addBtn.count() > 0) {
        await addBtn.click({force: true}).catch(()=>{});
        await page.waitForTimeout(3000);
        console.log("New motherboard added to eBay cart.");
    } else {
        console.log("Could not find Add to Cart button for the new motherboard.");
    }

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();