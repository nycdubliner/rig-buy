const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const pages = contexts[0].pages();
    
    console.log("--- Checking Alternate.de Tabs ---");
    const altPages = pages.filter(p => p.url().includes('alternate.de'));
    
    if (altPages.length === 0) {
        console.log("No Alternate.de tabs found.");
        process.exit(0);
    }

    for (const p of altPages) {
        console.log(`\nURL: ${p.url()}`);
        
        const results = await p.evaluate(() => {
            return document.body.innerText.substring(0, 1500);
        });
        console.log(results);
    }

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
