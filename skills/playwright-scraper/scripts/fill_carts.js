const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("\n--- Adding Items to Carts ---");

    // --- eBay Additions ---
    console.log("Adding GPU to eBay...");
    await page.goto('https://www.ebay.ie/itm/377090401152', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ebayAdd = page.locator('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart")').first();
    if (await ebayAdd.count() > 0) {
        await ebayAdd.click({force: true}).catch(e => console.log("eBay click failed:", e));
        await page.waitForTimeout(3000);
        console.log("GPU added.");
    } else {
        console.log("Could not find Add to Cart button for GPU.");
    }

    console.log("Searching and Adding Mobo to eBay...");
    await page.goto('https://www.ebay.ie/sch/i.html?_nkw=ASUS+ROG+Strix+X570-E+Gaming+motherboard&LH_BIN=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const mLink = page.locator('li.s-item .s-item__link, li.s-card .s-card__link').nth(1); // skip header
    if (await mLink.count() > 0) {
        const moboUrl = await mLink.getAttribute('href');
        await page.goto(moboUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        let moboAdd = page.locator('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart")').first();
        if (await moboAdd.count() > 0) {
            await moboAdd.click({force: true}).catch(()=>{});
            await page.waitForTimeout(3000);
            console.log("Mobo added.");
        } else {
            console.log("Could not find Add to Cart button for Mobo.");
        }
    } else {
        console.log("Mobo not found in search.");
    }

    // --- Amazon Additions ---
    console.log("Adding CPU to Amazon...");
    await page.goto('https://www.amazon.de/-/en/dp/B09VCHR1VH/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let amzAdd = page.locator('input#add-to-cart-button').first();
    if (await amzAdd.count() > 0) {
        await amzAdd.click({force: true}).catch(()=>{});
        await page.waitForTimeout(3000);
        console.log("CPU added.");
    } else {
        console.log("Could not find Add to Cart button for CPU.");
    }

    console.log("Searching and Adding RAM to Amazon...");
    await page.goto('https://www.amazon.de/-/en/s?k=64GB+DDR4+3200+CL16+kit', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const rLink = page.locator('div[data-component-type="s-search-result"] [data-cy="title-recipe"] a.a-link-normal').first();
    if (await rLink.count() > 0) {
        let ramUrl = await rLink.getAttribute('href');
        if (!ramUrl.startsWith('http')) ramUrl = 'https://www.amazon.de' + ramUrl;
        await page.goto(ramUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        let ramAdd = page.locator('input#add-to-cart-button').first();
        if (await ramAdd.count() > 0) {
            await ramAdd.click({force: true}).catch(()=>{});
            await page.waitForTimeout(3000);
            console.log("RAM added.");
        } else {
            console.log("Could not find Add to Cart button for RAM.");
        }
    } else {
        console.log("RAM not found in search.");
    }

    // --- Caseking Additions ---
    console.log("Adding PSU to Caseking...");
    await page.goto('https://www.caseking.de/en/search?sSearch=Corsair+RM1200e', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ckAdd1 = page.locator('.product-tile button.add-to-cart-global').first();
    if (await ckAdd1.count() > 0) {
        await ckAdd1.click({force: true}).catch(()=>{});
        await page.waitForTimeout(3000);
        console.log("PSU added.");
    } else {
        console.log("Could not find Add to Cart button for PSU.");
    }
    
    console.log("Adding Case to Caseking...");
    await page.goto('https://www.caseking.de/en/search?sSearch=Lian+Li+Lancool+III+Black', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ckAdd2 = page.locator('.product-tile button.add-to-cart-global').first();
    if (await ckAdd2.count() > 0) {
        await ckAdd2.click({force: true}).catch(()=>{});
        await page.waitForTimeout(3000);
        console.log("Case added.");
    } else {
        console.log("Could not find Add to Cart button for Case.");
    }

    console.log("\nFinished filling carts.");
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
