const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    
    let page = pages[1] || pages[0];

    console.log("Locating Hall Of Fame link on Subito.it...");
    await page.goto("https://www.subito.it/annunci-italia/vendita/usato/?q=rtx+3090", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000); 

    const link = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('a'));
      const hofLink = items.find(a => a.innerText.toLowerCase().includes('hall of fame') && a.innerText.toLowerCase().includes('3090'));
      return hofLink ? hofLink.href : null;
    });

    if (link) {
      console.log(`Found link: ${link}`);
      await page.goto(link, { waitUntil: 'load' });
      await page.bringToFront();
      console.log("Opened listing and brought browser to front.");
    } else {
      console.log("Could not find the specific Hall Of Fame link.");
      // Just bring the search results to front as fallback
      await page.bringToFront();
    }

    await browser.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
