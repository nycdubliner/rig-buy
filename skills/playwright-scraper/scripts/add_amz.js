const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("--- Amazon Cart Updates ---");

    // Handle cookies first
    await page.goto('https://www.amazon.de/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const cookieBtn = page.locator('input#sp-cc-accept, button#sp-cc-accept').first();
    if (await cookieBtn.count() > 0) {
        console.log("Accepting Amazon cookies...");
        await cookieBtn.click({force: true}).catch(()=>{});
        await page.waitForTimeout(2000);
    }

    // 1. Add CPU
    console.log("\nAdding Ryzen 5 5600...");
    await page.goto('https://www.amazon.de/-/en/dp/B09VCHR1VH/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let amzAdd = page.locator('#add-to-cart-button, input[name="submit.add-to-cart"]').first();
    if (await amzAdd.count() > 0) {
        await amzAdd.click({force: true}).catch(()=>{});
        await page.waitForTimeout(2000);
        console.log("-> CPU added to Amazon cart.");
    } else {
        console.log("-> Could not find Add to Cart for CPU.");
    }

    // 2. Add 64GB DDR4 RAM
    console.log("\nSearching for 64GB DDR4 3200 on Amazon...");
    await page.goto('https://www.amazon.de/-/en/s?k=Corsair+Vengeance+LPX+64GB+DDR4+3200', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const rLink = page.locator('div[data-component-type="s-search-result"] [data-cy="title-recipe"] a.a-link-normal').first();
    let ramPrice = "Unknown";
    
    if (await rLink.count() > 0) {
        const pWhole = await page.locator('div[data-component-type="s-search-result"] .a-price-whole').first().textContent().catch(()=>'');
        if (pWhole) ramPrice = "€" + pWhole.trim().replace(/,/g, '');
        
        let ramUrl = await rLink.getAttribute('href');
        if (!ramUrl.startsWith('http')) ramUrl = 'https://www.amazon.de' + ramUrl;
        
        console.log(`Navigating to RAM page: ${ramUrl} (Est. Price: ${ramPrice})`);
        await page.goto(ramUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        
        let ramAdd = page.locator('#add-to-cart-button, input[name="submit.add-to-cart"]').first();
        if (await ramAdd.count() > 0) {
            await ramAdd.click({force: true}).catch(()=>{});
            await page.waitForTimeout(2000);
            console.log("-> RAM added to Amazon cart.");
            require('fs').writeFileSync('ram_found.json', JSON.stringify({ url: ramUrl, price: ramPrice }));
        } else {
            console.log("-> Could not find Add to Cart button for RAM.");
        }
    } else {
        console.log("RAM not found in search.");
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
