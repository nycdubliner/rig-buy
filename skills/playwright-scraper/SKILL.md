---
name: playwright-scraper
description: Use this skill to securely scrape product links and prices from Amazon or other retailers when standard requests or Chrome DevTools MCP trigger bot detection (e.g., Cloudflare blocks).
---

# Playwright Scraper

This skill uses a custom Playwright script wrapped with stealth plugins to bypass basic bot detection on retail websites (like Amazon.de). Use it when you need to fetch product URLs or prices and the `chrome-devtools` MCP is failing due to "Just a moment..." or CAPTCHA pages.

## Usage

Run the script via `run_shell_command` from the workspace root. Provide the search query as arguments.

```bash
node skills/playwright-scraper/scripts/search.js "ASRock X870E Taichi"
```

### Output
The script outputs JSON containing the top 3 results, including their cleaned URLs and prices.

Example output:
```json
{
  "query": "ASRock X870E Taichi",
  "results": [
    {
      "title": "ASRock X870E Taichi ATX Motherboard",
      "url": "https://www.amazon.de/dp/B0DGG6JJK2/",
      "price": "520,"
    }
  ]
}
```

## Error Handling

If the script returns a bot challenge error, you may need to rely on estimated prices or request the user to manually fetch the URL. However, the stealth plugin usually circumvents standard automated blocks.
