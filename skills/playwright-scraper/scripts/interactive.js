const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const path = require('path');

(async () => {
  const userDataDir = path.join(__dirname, '../user-data');
  
  console.log("Starting interactive Playwright session. Please log in to eBay.");
  console.log("Close the browser window when you are done.");

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false, // Visible to the user
    viewport: null,  // Let the OS handle window sizing
    args: ['--start-maximized']
  });

  const page = await context.newPage();
  await page.goto('https://www.ebay.ie');

  // The process will naturally stay open as long as the browser is open.
  context.on('close', () => {
    console.log("Browser closed. Exiting.");
    process.exit(0);
  });
})();
