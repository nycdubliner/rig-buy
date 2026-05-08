const { chromium } = require('playwright');

(async () => {
  try {
    console.log("Connecting to main Chrome on 9222...");
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    if (contexts.length === 0) return console.log("No contexts");
    const pages = contexts[0].pages();
    
    let ghPage = pages.find(p => p.url().includes('geizhals.eu'));
    if (!ghPage) ghPage = await contexts[0].newPage();

    console.log("Navigating to Geizhals for 32GB DDR5 6000 CL30...");
    await ghPage.goto('https://geizhals.eu/?cat=ramddr3&xf=1454_16384%7C15903_DDR5%7C253_32768%7C254_6000%7C255_30&sort=p', { waitUntil: 'domcontentloaded' });
    await ghPage.waitForTimeout(3000);

    const html = await ghPage.evaluate(() => document.body.innerHTML);
    require('fs').writeFileSync('gh_debug.html', html);
    console.log("HTML written to gh_debug.html");
    
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
