const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    // Reuse Tab 1 (chrome://new-tab-page/)
    let page = pages[1] || pages[0];
    console.log(`Using background tab: ${page.url()}`);

    console.log("Searching Subito.it for RTX 3090 (sorted by price)...");
    // Search for RTX 3090, sorted by price ascending
    await page.goto("https://www.subito.it/annunci-italia/vendita/usato/?q=rtx+3090&order=price-asc", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000); // Wait for results

    const deals = await page.evaluate(() => {
      // Find all item cards
      const cards = Array.from(document.querySelectorAll('.ItemsList_item__mY9d3, .item-card, article'));
      
      return cards.map(card => {
        const title = card.querySelector('h2, .item-title, .title')?.innerText;
        const price = card.querySelector('.price, .item-price, .Price_price__GfGkM')?.innerText;
        const location = card.querySelector('.location, .item-location, .Town_town__V0o3s')?.innerText;
        return { title, price, location };
      }).filter(item => {
        if (!item.title || !item.price) return false;
        const titleLower = item.title.toLowerCase();
        const priceVal = parseInt(item.price.replace(/[^\d]/g, ''));
        
        // Filter: Must contain 3090, must not be "box" or "wanted", price must be > 300 (to avoid scams/cables)
        return titleLower.includes('3090') && 
               !titleLower.includes('scatola') && 
               !titleLower.includes('cerco') &&
               priceVal > 300 &&
               priceVal < 1000; // Target underpriced ones
      }).slice(0, 5);
    });

    console.log("DEAL_DATA_START");
    console.log(JSON.stringify(deals, null, 2));
    console.log("DEAL_DATA_END");

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
