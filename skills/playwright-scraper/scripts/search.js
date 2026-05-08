const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const query = process.argv.slice(2).join(' ');

if (!query) {
  console.error("Please provide a search query.");
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    const searchUrl = `https://www.amazon.de/s?k=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Wait for either search results or bot challenge to appear
    await page.waitForTimeout(2000); 

    const isBotChallenge = await page.$('text="Type the characters you see in this image:"') || await page.$('text="Geben Sie die Zeichen unten ein"');
    if (isBotChallenge) {
        console.error(JSON.stringify({ error: "Bot challenge encountered. Stealth failed or IP is flagged." }));
        await browser.close();
        process.exit(1);
    }

    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]'));
      return items.slice(0, 3).map(item => {
        const linkEl = item.querySelector('[data-cy="title-recipe"] a');
        const priceEl = item.querySelector('.a-price-whole');
        
        let url = linkEl ? linkEl.href : null;
        if (url && url.includes('/dp/')) {
            const dpMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
            if (dpMatch) url = `https://www.amazon.de/dp/${dpMatch[1]}/`;
        }

        return {
          title: linkEl ? linkEl.textContent.trim() : 'Unknown',
          url: url,
          price: priceEl ? priceEl.textContent.trim() : 'Unknown'
        };
      });
    });

    console.log(JSON.stringify({ query: query, results: products }, null, 2));

  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
  } finally {
    await browser.close();
  }
})();
