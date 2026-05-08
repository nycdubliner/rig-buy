const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = contexts[0].pages()[0];
    
    console.log("--- Searching Caseking for In-Stock DDR5 ---");
    // Sort by price ascending (sSort=3) or popularity
    await page.goto('https://www.caseking.de/en/search?sSearch=32GB+DDR5+6000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    const ckResults = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-tile'));
      return items.map(el => {
        const title = el.querySelector('.pdp-link a.link')?.textContent.trim();
        const priceText = el.querySelector('.js-unit-price')?.textContent.trim() || '';
        const url = el.querySelector('.pdp-link a.link')?.href;
        
        // Parse price to float
        let price = 9999;
        const match = priceText.match(/([\d,.]+)/);
        if (match) {
            price = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
        }

        // Check stock status
        const availability = el.querySelector('.availability-msg')?.textContent.trim() || '';
        const inStock = availability.toLowerCase().includes('in stock') || availability.toLowerCase().includes('lagernd');

        return { title, price: priceText, priceNum: price, url, inStock, availability };
      }).filter(item => item.inStock && item.priceNum < 200).slice(0, 3);
    });
    
    console.log(JSON.stringify(ckResults, null, 2));

    console.log("\n--- Searching Paradigit for In-Stock DDR5 ---");
    await page.goto('https://www.paradigit.ie/search?q=32GB+DDR5+6000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const pdResults = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-list-item, .product-card'));
      return items.map(el => {
        const title = el.querySelector('.title, .product-name')?.textContent.trim();
        const priceText = el.querySelector('.price, .current-price')?.textContent.trim() || '';
        const url = el.querySelector('a')?.href;
        
        // Paradigit stock usually indicated by green dot or "In stock" text
        const stockText = el.querySelector('.stock-status, .availability')?.textContent.trim() || '';
        const inStock = !stockText.toLowerCase().includes('out of stock') && !stockText.toLowerCase().includes('sold out');

        let price = 9999;
        const match = priceText.match(/([\d,.]+)/);
        if (match) {
            price = parseFloat(match[1].replace(/,/g, '')); // Paradigit usually uses € 120.00
        }

        return { title, price: priceText, priceNum: price, url, inStock, stockText };
      }).filter(item => item.priceNum < 200).slice(0, 3);
    });

    console.log(JSON.stringify(pdResults, null, 2));

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
