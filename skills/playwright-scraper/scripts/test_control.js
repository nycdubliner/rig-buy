const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const pages = contexts[0].pages();
    for (const page of pages) {
      if (page.url().includes('amazon.ie')) {
        await page.bringToFront();
        console.log("Successfully brought Amazon tab to front. Title: " + await page.title());
        break;
      }
    }
    await browser.close();
  } catch (e) {
    console.error(e.message);
  }
})();
