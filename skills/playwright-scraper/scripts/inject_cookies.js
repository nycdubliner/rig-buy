const { chromium } = require('playwright-extra');
const fs = require('fs');
const path = require('path');

const cookiesPath = path.join(__dirname, '../ebay-cookies.json');
const userDataDir = path.join(__dirname, '../user-data');

if (!fs.existsSync(cookiesPath)) {
  console.error("Error: ebay-cookies.json not found.");
  console.log("Please save your exported cookies to skills/playwright-scraper/ebay-cookies.json");
  process.exit(1);
}

(async () => {
  console.log("Loading cookies into persistent context...");
  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
  
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false
  });

  await context.addCookies(cookies);
  console.log("Cookies injected successfully!");

  const page = await context.newPage();
  await page.goto('https://www.ebay.ie');
  
  console.log("You should now be logged in. Close the browser to save the session.");
  
  context.on('close', () => {
    process.exit(0);
  });
})();
