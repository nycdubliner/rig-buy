# Project: Machine Build Quote

## Goal
Design and source a highly optimized, "bang for buck" dual RX 7800 XT AI workstation (AM4 platform) for delivery to Ireland, avoiding EU Tech Tax.

## Current State
- **Phase 3 Dual 7900 XTX Upgrade In Progress:** Upgrading to Dual RX 7900 XTX cards (48GB VRAM total) and a 1500W PSU (parts ordered, arriving next week; physical slot clearance verified).
- **Phase 2 Dual-GPU Build Assembled & Verified:** The initial dual 7800 XT rig was fully built and functional (Total: €2,400.84).
- **Full Engine Benchmarking Complete:** Benchmarked Ollama and llama.cpp (ROCm 7.1) with Qwen 2.5 Coder 32B and Gemma 2 27B on the dual 7800 XT baseline.
- **Performance Insights:** llama.cpp achieved **16.3 t/s** decode on Qwen 32B (56% faster than Ollama), while Ollama excelled on Gemma 2 27B at **30.4 t/s**.
- **Automated Benchmarking Suite:** Added `scripts/benchmark_llamacpp.py` and `scripts/generate_graphs.py` to complement the Ollama suite.
- **Documentation Updated:** The AI Software Guide now features comparative performance graphs and engine recommendations.
- **Agent Capabilities:** The `logged-in-scraper` skill is globally installed and the "Jem's Browser" desktop app is available for bypassing bot protection.
- Reusable skills live in `skills/`

## Next Steps
- Maintain the software stack using the [Bi-Weekly Maintenance Loop](archive/2026-05-22/operations.html).
- Periodically run `scripts/benchmark_ollama.py` to monitor for performance regressions after ROCm or engine updates.
- Utilize the [AI Software Setup Guide](archive/2026-05-22/stack.html) and [RSS Feeds](archive/2026-05-22/knowledge.html#feeds) to configure the OS and agentic workflows once built.

## Working Rule
- **Definition of Done:** A task is only considered complete once the changes have been pushed to the GitHub repository and are live on the GitHub Pages site. Local commits are not sufficient; "Nothing is real until it's public."
- **Build Locking:** The current dual-GPU AM4 build is locked in. Do not change the core parts unless the user explicitly requests an alteration.
- **Voice Usage:** Only use the Mac Voice skill (`bash skills/mac-voice/scripts/speak.sh "<message>"`) when explicitly asked by the user (e.g., "Tell me", "use your voice", or "uyv"). Do not trigger it autonomously.