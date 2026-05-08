const { chromium } = require('playwright');

(async () => {
  try {
    console.log("Connecting to main Chrome on 9222...");
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    if (!page) page = await contexts[0].newPage();

    console.log("Navigating to GMKtec EU store...");
    await page.goto('https://de.gmktec.com/collections/all-products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const product = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const evoX2Link = links.find(l => l.href.includes('evo-x2') || l.innerText.includes('EVO-X2'));
        return evoX2Link ? evoX2Link.href : null;
    });

    if (product) {
        console.log(`Found product URL: ${product}`);
        await page.goto(product, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);

        const details = await page.evaluate(() => {
            const title = document.querySelector('h1')?.innerText || 'Unknown';
            const price = document.querySelector('.price, .price-item')?.innerText || 'Unknown';
            const addToCart = document.querySelector('button[name="add"], .add-to-cart');
            const inStock = addToCart && !addToCart.disabled && !addToCart.innerText.toLowerCase().includes('sold out');
            return { title, price, inStock };
        });

        console.log("Product Details:", details);
    } else {
        console.log("Could not find EVO-X2 on the EU store.");
    }

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
