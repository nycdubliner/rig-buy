const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const pages = contexts[0].pages();
    
    console.log("--- DONEDEAL TABS ---");
    const donedealPages = pages.filter(p => p.url().includes('donedeal.ie'));
    
    for (const p of donedealPages) {
        console.log(`Title: ${await p.title()}`);
        console.log(`URL: ${p.url()}\n`);
        
        // Try to grab the main ad title if it's an ad page
        const adTitle = await p.evaluate(() => {
            const h1 = document.querySelector('h1');
            return h1 ? h1.innerText : 'No H1 found';
        });
        console.log(`Ad Title: ${adTitle}\n`);
    }

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
