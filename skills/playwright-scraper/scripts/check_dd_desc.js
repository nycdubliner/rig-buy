const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const contexts = browser.contexts();
    const pages = contexts[0].pages();
    
    const p = pages.find(p => p.url().includes('42042547'));
    if (p) {
        const desc = await p.evaluate(() => {
            const descEl = document.querySelector('[data-testid="description"], .description, p');
            // DoneDeal description is usually in a div with data-testid="ad-description" or similar
            const descDiv = document.querySelector('div[data-testid="ad-description"]') || document.querySelector('p');
            return descDiv ? descDiv.innerText : 'No description found';
        });
        console.log(`Description:\n${desc}`);
        
        const allText = await p.evaluate(() => document.body.innerText);
        const gigabyte = allText.toLowerCase().includes('gigabyte');
        const asus = allText.toLowerCase().includes('asus');
        const sapphire = allText.toLowerCase().includes('sapphire');
        const xfx = allText.toLowerCase().includes('xfx');
        const asrock = allText.toLowerCase().includes('asrock');
        const acer = allText.toLowerCase().includes('acer');
        const nitro = allText.toLowerCase().includes('nitro');
        const powercolor = allText.toLowerCase().includes('powercolor') || allText.toLowerCase().includes('hellhound') || allText.toLowerCase().includes('fighter');
        
        console.log("\nBrands detected in text:");
        console.log({gigabyte, asus, sapphire, xfx, asrock, acer, nitro, powercolor});

    }

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
