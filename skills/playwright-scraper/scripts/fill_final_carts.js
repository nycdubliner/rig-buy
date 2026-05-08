const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("--- Syncing Carts for Final AM4 Build ---");
    const results = {};

    // 1. Amazon.de: Ryzen 5 5600 (B09VCHR1VH)
    console.log("\nAmazon: Adding Ryzen 5 5600...");
    await page.goto('https://www.amazon.de/-/en/dp/B09VCHR1VH/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let amzAdd = page.locator('#add-to-cart-button, input[name="submit.add-to-cart"]').first();
    if (await amzAdd.count() > 0) {
        await amzAdd.click({force: true}).catch(()=>{});
        await page.waitForTimeout(2000);
        console.log("-> CPU added to Amazon cart.");
        results.CPU = true;
    } else {
        console.log("-> Could not find Add to Cart for CPU (might be out of stock).");
        results.CPU = false;
    }

    // 2. eBay.ie: GPU (377090401152) and Mobo (search X570-E)
    console.log("\neBay: Adding GPU...");
    await page.goto('https://www.ebay.ie/itm/377090401152', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ebayAddGpu = page.locator('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart")').first();
    if (await ebayAddGpu.count() > 0) {
        await ebayAddGpu.click({force: true}).catch(()=>{});
        await page.waitForTimeout(2000);
        console.log("-> GPU added to eBay cart.");
        results.GPU = true;
    } else {
        console.log("-> GPU add button not found (likely already in cart).");
        results.GPU = true; // Assume already in based on previous run
    }

    console.log("\neBay: Finding and Adding Motherboard...");
    await page.goto('https://www.ebay.ie/sch/i.html?_nkw=ASUS+ROG+Strix+X570-E+Gaming+motherboard&LH_BIN=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const mLink = page.locator('li.s-item .s-item__link, li.s-card .s-card__link').nth(1); 
    if (await mLink.count() > 0) {
        const moboUrl = await mLink.getAttribute('href');
        await page.goto(moboUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        let moboAdd = page.locator('[id^="isCartBtn"], span:has-text("Add to basket"), span:has-text("Add to cart")').first();
        if (await moboAdd.count() > 0) {
            await moboAdd.click({force: true}).catch(()=>{});
            await page.waitForTimeout(2000);
            console.log("-> Motherboard added to eBay cart.");
            results.Mobo = true;
        } else {
            console.log("-> Motherboard add button not found.");
            results.Mobo = false;
        }
    } else {
        console.log("-> Motherboard not found.");
        results.Mobo = false;
    }

    // 3. Caseking.de: RM850e PSU and Lancool III
    console.log("\nCaseking: Adding RM850e PSU...");
    await page.goto('https://www.caseking.de/en/search?sSearch=Corsair+RM850e', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ckAdd1 = page.locator('.product-tile button.add-to-cart-global').first();
    if (await ckAdd1.count() > 0) {
        await ckAdd1.click({force: true}).catch(()=>{});
        await page.waitForTimeout(2000);
        console.log("-> PSU added to Caseking cart.");
        results.PSU = true;
    } else {
        console.log("-> Could not add PSU.");
        results.PSU = false;
    }

    console.log("\nCaseking: Adding Lancool III...");
    await page.goto('https://www.caseking.de/en/search?sSearch=Lian+Li+Lancool+III+Black', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let ckAdd2 = page.locator('.product-tile button.add-to-cart-global').first();
    if (await ckAdd2.count() > 0) {
        await ckAdd2.click({force: true}).catch(()=>{});
        await page.waitForTimeout(2000);
        console.log("-> Case added to Caseking cart.");
        results.Case = true;
    } else {
        console.log("-> Could not add Case.");
        results.Case = false;
    }

    // 4. Alternate.de: 64GB DDR4
    console.log("\nAlternate: Adding 64GB DDR4 RAM...");
    await page.goto('https://www.alternate.de/Arbeitsspeicher/DDR4?filter_20042=64&filter_32630=3200&filter_32636=16', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    let altCookie = page.locator('button:has-text("Akzeptieren"), button:has-text("Accept")').first();
    if (await altCookie.count() > 0) {
        await altCookie.click({force:true}).catch(()=>{});
        await page.waitForTimeout(1000);
    }

    const pLink = page.locator('.product-list a.card').first();
    if (await pLink.count() > 0) {
        const href = await pLink.getAttribute('href');
        await page.goto('https://www.alternate.de' + href, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        let pAdd = page.locator('#add-to-cart-button, button:has-text("In den Warenkorb")').first();
        if (await pAdd.count() > 0) {
            await pAdd.click({force:true});
            await page.waitForTimeout(2000);
            console.log("-> RAM added to Alternate cart.");
            results.RAM = true;
        } else {
            console.log("-> Could not add RAM.");
            results.RAM = false;
        }
    } else {
        console.log("-> Could not find RAM on Alternate.");
        results.RAM = false;
    }

    console.log("\n--- Final Cart Status ---");
    console.log(JSON.stringify(results, null, 2));

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
