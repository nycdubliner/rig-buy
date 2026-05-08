const { chromium } = require('playwright');

(async () => {
  try {
    console.log("Attempting to connect to main Chrome browser on port 9222...");
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    
    const contexts = browser.contexts();
    if (contexts.length === 0) {
        console.log("Connected, but no browser contexts found.");
        return;
    }

    const pages = contexts[0].pages();
    console.log(`\nSuccess! Connected to browser.`);
    console.log(`Found ${pages.length} open pages:`);
    
    for (const page of pages) {
      const title = await page.title();
      const url = page.url();
      console.log(`- Title: ${title || '[No Title]'}`);
      console.log(`  URL: ${url}`);
    }
    
    await browser.close(); // Disconnects, doesn't kill the browser
  } catch (error) {
    console.error("\nFailed to connect. Error:", error.message);
  }
})();
