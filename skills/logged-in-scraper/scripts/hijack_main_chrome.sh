#!/bin/bash
# hijack_main_chrome.sh
# Gracefully closes the user's main Chrome browser and restarts it with the remote debugging port enabled.

echo "============================================================"
echo "⚠️  WARNING: Hijacking Main Chrome Session"
echo "This will safely quit your current Google Chrome browser."
echo "Please save any work. Chrome will restart automatically with"
echo "all your tabs restored."
echo "============================================================"
read -p "Press [Enter] to restart Chrome in debug mode, or Ctrl+C to cancel..."

echo "Gracefully quitting Google Chrome..."
osascript -e 'quit app "Google Chrome"'

# Wait a moment for the process to fully terminate to avoid port binding errors
sleep 2

echo "Relaunching Google Chrome with remote debugging enabled on port 9222..."
# Omitting the --user-data-dir flag forces Chrome to use the default profile, 
# ensuring all the user's logins and active tabs are preserved.
nohup "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 > /dev/null 2>&1 &

echo "Done! The Gemini agent can now see and interact directly with your main browser tabs."