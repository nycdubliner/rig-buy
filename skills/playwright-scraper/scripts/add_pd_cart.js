const { chromium } = require('playwright');

(async () => {
  try {
    console.log("Connecting to main Chrome on 9222...");
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    if (contexts.length === 0) return console.log("No contexts");
    const pages = contexts[0].pages();
    
    let pdPage = pages.find(p => p.url().includes('paradigit.ie'));
    if (!pdPage) pdPage = await contexts[0].newPage();

    console.log("Navigating to Paradigit for Kingston FURY Beast 32GB DDR5 6000 CL30...");
    await pdPage.goto('https://www.paradigit.ie/search?q=Kingston+FURY+Beast+32GB+DDR5+6000+CL30', { waitUntil: 'domcontentloaded' });
    await pdPage.waitForTimeout(3000);

    const product = await pdPage.evaluate(() => {
      const el = document.querySelector('.product-list-item, .product-card');
      if (!el) return null;
      const title = el.querySelector('.title, .product-name')?.textContent.trim();
      const price = el.querySelector('.price, .current-price')?.textContent.trim();
      const url = el.querySelector('a')?.href;
      return { title, price, url };
    });

    if (product && product.url) {
      console.log(`Found: ${product.title} for ${product.price}`);
      console.log(`Going to product page...`);
      await pdPage.goto(product.url, { waitUntil: 'domcontentloaded' });
      await pdPage.waitForTimeout(3000);
      
      const addBtn = pdPage.locator('.add-to-cart, button.btn-add-to-cart, button:has-text("Add to cart")').first();
      if (await addBtn.count() > 0) {
          await addBtn.click({ force: true }).catch(() => {});
          await pdPage.waitForTimeout(2000);
          console.log("Successfully clicked Add to Cart on Paradigit!");
      } else {
          console.log("Could not find Add to Cart button.");
      }
    } else {
      console.log("No matching product found on Paradigit.");
    }
    
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();