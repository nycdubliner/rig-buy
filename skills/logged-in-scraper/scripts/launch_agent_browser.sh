#!/bin/bash
# launch_agent_browser.sh
# Spawns a dedicated Chrome instance for Agentic Scraping

AGENT_PROFILE_DIR="$HOME/.gemini/agent-chrome-profile"
mkdir -p "$AGENT_PROFILE_DIR"

# Check for Chrome Canary or Chromium to provide a visually distinct dock icon.
# Fallback to standard Chrome if they are not installed.
if [ -d "/Applications/Google Chrome Canary.app" ]; then
    CHROME_PATH="/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
    echo "Using Chrome Canary (Yellow Icon) for distinct Agent separation."
elif [ -d "/Applications/Chromium.app" ]; then
    CHROME_PATH="/Applications/Chromium.app/Contents/MacOS/Chromium"
    echo "Using Chromium (Blue Icon) for distinct Agent separation."
else
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    echo "Using standard Google Chrome. Note: App switcher icon will match your main browser."
    echo "Tip: Install Chrome Canary to get a distinct Yellow icon for the agent."
fi

echo "Launching Agent Browser on port 9222..."
nohup "$CHROME_PATH" --remote-debugging-port=9222 --user-data-dir="$AGENT_PROFILE_DIR" > /dev/null 2>&1 &
echo "Browser launched successfully. You can now use the mcp_chrome-devtools tools."