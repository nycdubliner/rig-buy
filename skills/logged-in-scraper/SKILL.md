---
name: logged-in-scraper
description: Scrape authenticated sites (eBay, Amazon, FB Marketplace, Adverts) without getting blocked by captchas by hooking into the user's active, logged-in Chrome browser via MCP.
---

# Logged-In Scraper

This skill provides the procedural workflow for bypassing cloudflare/bot protection on major retailers and marketplaces by hijacking the user's active Chrome session.

## The Strategy
Automated headless scrapers (like bare curl or raw playwright) are instantly blocked by Amazon and eBay. By using the `mcp_chrome-devtools` tools, you act as a ghost driving the user's actual Chrome window. Since the browser already has the user's authentic cookies, login state, and human fingerprint, you bypass bot protection entirely.

## Connection Setup & Pre-flight
If the Chrome MCP tools throw a connection error, it means the browser isn't listening on the debug port. The user has two options for granting the agent access to a browser. Instruct the user to run one of the following bundled scripts based on their preference:

### Option A: Hijack Main Browser (Recommended for Context)
Use this if the user says "As you can see I am logged into eBay in my main browser." This script gracefully restarts their primary Chrome instance with the debug port open, preserving all their active tabs and logins.
```bash
bash ~/.gemini/skills/logged-in-scraper/scripts/hijack_main_chrome.sh
```

### Option B: Isolated Agent Browser (Chrome of Chrome)
Use this for background scraping tasks where the user doesn't want their main browsing disrupted. This script launches a completely separate profile (`~/.gemini/agent-chrome-profile`).
```bash
bash ~/.gemini/skills/logged-in-scraper/scripts/launch_agent_browser.sh
```
**Visual Differentiation:** To visually distinguish this isolated browser, the script attempts to launch **Chrome Canary** (yellow icon) or **Chromium** (blue icon). You can also instruct the user to install a bright neon Chrome Theme in this profile so the agent's window borders are instantly recognizable.

## The Workflow

1. **Navigation:** Use `mcp_chrome-devtools_navigate_page` to drive the browser to the search URL (e.g., `https://www.ebay.com/sch/i.html?_nkw=rtx+3090`).
2. **Handle Modals First:** 
   - Marketplaces aggressively push Cookie banners and Login nags. 
   - Always run `mcp_chrome-devtools_take_snapshot` immediately. Look for "Accept All Cookies" or "Close" buttons. 
   - Use `mcp_chrome-devtools_click` to dismiss them before trying to parse the grid of items.
3. **Data Extraction (Two Methods):**
   - **Method A (The Snapshot):** The snapshot provides a clean, accessibility-tree view of the DOM. This is often enough to read titles and prices directly without writing code.
   - **Method B (DOM Evaluation):** If the page structure is dense, use `mcp_chrome-devtools_evaluate_script` to inject vanilla JavaScript. This is highly effective for returning clean JSON arrays. Example:
     ```javascript
     () => {
       return Array.from(document.querySelectorAll('.s-item')).map(item => ({
         title: item.querySelector('.s-item__title')?.innerText,
         price: item.querySelector('.s-item__price')?.innerText
       })).filter(i => i.title && i.price);
     }
     ```
4. **Human Fallback:** Because you are controlling the user's visible screen, if you hit a hard CAPTCHA ("Click to prove you are human"), you can pause your loop and ask the user in chat: "Please click the Captcha on your screen so I can continue scraping." Once they confirm, resume the loop.