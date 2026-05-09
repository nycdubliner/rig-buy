# Project: Machine Build Quote

## Goal
Design and source a highly optimized, "bang for buck" dual RX 7800 XT AI workstation (AM4 platform) for delivery to Ireland, avoiding EU Tech Tax.

## Current State
- **Phase 2 Dual-GPU Build Finalized:** The build is fully specced and parts are purchased/ordered. (Total: ~€1,961.76).
- **Documentation Complete:** The GitHub Pages site contains the quote, vendor intelligence, architecture animations, and the AI Software Setup Guide.
- **Agent Capabilities:** The `logged-in-scraper` skill is globally installed and the "Jem's Browser" desktop app is available for bypassing bot protection.
- Reusable skills live in `skills/`

## Next Steps
- Wait for physical component delivery and begin the actual machine assembly.
- Utilize the [AI Software Setup Guide](ai-guide.html) and [RSS Feeds](ai-feeds.opml) to configure the OS and agentic workflows once built.

## Working Rule
- **Definition of Done:** A task is only considered complete once the changes have been pushed to the GitHub repository and are live on the GitHub Pages site. Local commits are not sufficient; "Nothing is real until it's public."
- **Build Locking:** The current dual-GPU AM4 build is locked in. Do not change the core parts unless the user explicitly requests an alteration.
- **Voice Usage:** Only use the Mac Voice skill (`bash skills/mac-voice/scripts/speak.sh "<message>"`) when explicitly asked by the user (e.g., "Tell me", "use your voice", or "uyv"). Do not trigger it autonomously.