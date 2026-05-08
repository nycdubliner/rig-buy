const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    let page = await contexts[0].newPage();

    console.log("Loading local build quote...");
    await page.goto('http://127.0.0.1:8000/build-quote.html', { waitUntil: 'domcontentloaded' });
    
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => a.href).filter(href => href.startsWith('http'));
    });

    console.log(`Found ${links.length} links to test.\n`);
    
    // Deduplicate
    const uniqueLinks = [...new Set(links)];

    let allGood = true;

    for (const link of uniqueLinks) {
      console.log(`Testing: ${link}`);
      try {
        const response = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 15000 });
        if (response) {
            const status = response.status();
            if (status >= 400) {
                console.log(`❌ FAILED (Status ${status}): ${link}`);
                allGood = false;
            } else {
                // Additional check for Amazon "Page Not Found"
                const title = await page.title();
                if (title.includes('Page Not Found') || title.includes('404')) {
                    console.log(`❌ FAILED (Amazon 404): ${link}`);
                    allGood = false;
                } else {
                    console.log(`✅ OK: ${link}`);
                }
            }
        } else {
             console.log(`⚠️ NO RESPONSE: ${link}`);
        }
      } catch (err) {
        console.log(`❌ FAILED (Error: ${err.message}): ${link}`);
        allGood = false;
      }
    }

    if (allGood) {
      console.log("\nAll links successfully verified!");
    } else {
      console.log("\nSome links failed verification.");
    }
    
    await page.close();
    await browser.close();
  } catch (error) {
    console.error("Error executing script:", error);
  }
})();
