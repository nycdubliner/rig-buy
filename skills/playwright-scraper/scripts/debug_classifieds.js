const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    if (contexts.length === 0) return console.log("No contexts");
    const pages = contexts[0].pages();
    
    let advertsPage = pages.find(p => p.url().includes('adverts.ie'));
    let donedealPage = pages.find(p => p.url().includes('donedeal.ie'));

    if (advertsPage) {
      console.log("--- Found ADVERTS.IE ---");
      const html = await advertsPage.evaluate(() => {
         const items = document.querySelectorAll('.sr-grid-cell, .search-result');
         return items.length > 0 ? items[0].innerHTML : document.body.innerHTML.substring(0, 2000);
      });
      require('fs').writeFileSync('adverts_debug.html', html);
      console.log("Wrote adverts_debug.html");
    } else {
      console.log("No Adverts.ie tab found.");
    }

    if (donedealPage) {
      console.log("--- Found DONEDEAL.IE ---");
      const html = await donedealPage.evaluate(() => {
         const items = document.querySelectorAll('li[class*="SearchListings"], ul[data-testid="search-results"] li, .card-collection li');
         return items.length > 0 ? items[0].innerHTML : document.body.innerHTML.substring(0, 2000);
      });
      require('fs').writeFileSync('donedeal_debug.html', html);
      console.log("Wrote donedeal_debug.html");
    } else {
      console.log("No DoneDeal.ie tab found.");
    }

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
