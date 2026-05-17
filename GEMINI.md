# Project: Machine Build Quote

## Goal
Design and source a highly optimized, "bang for buck" dual RX 7800 XT AI workstation (AM4 platform) for delivery to Ireland, avoiding EU Tech Tax.

## Current State
- **Phase 2 Dual-GPU Build Assembled & Verified:** The rig is fully built and functional. (Total: €2,400.84).
- **Dual-GPU Verification Complete:** Successfully verified both RX 7800 XT GPUs using Ollama with the Qwen 2.5 Coder 32B model. Tensor splitting across both cards is working with ~12GB/12GB VRAM distribution.
- **AI Software Plan Expanded:** The documentation now includes a comparison of inference engines (Ollama, vLLM, llama.cpp), a "Bi-Weekly Maintenance Loop," and an interactive **Performance Visualizer**.
- **Benchmarking Tools Integrated:** A Python script (`scripts/benchmark_ollama.py`) is available for measuring Prefill and Decode TPS, establishing a baseline of ~393 t/s (Prefill) and ~10.4 t/s (Decode) for 32B models.
- **Upgraded Specs:** The build features a significant RAM upgrade to 128GB (Kingston Fury Renegade 3600MT/s) and a high-end FSP VITA GM 1000W ATX 3.1 PSU from GG Machines Dublin.
- **Documentation Complete:** The GitHub Pages site contains the quote, vendor intelligence, physical assembly guide, and the expanded AI Software Guide.
- **Agent Capabilities:** The `logged-in-scraper` skill is globally installed and the "Jem's Browser" desktop app is available for bypassing bot protection.
- Reusable skills live in `skills/`

## Next Steps
- Maintain the software stack using the [Bi-Weekly Maintenance Loop](ai-guide.html#monitoring).
- Periodically run `scripts/benchmark_ollama.py` to monitor for performance regressions after ROCm or engine updates.
- Utilize the [AI Software Setup Guide](ai-guide.html) and [RSS Feeds](ai-feeds.opml) to configure the OS and agentic workflows once built.

## Working Rule
- **Definition of Done:** A task is only considered complete once the changes have been pushed to the GitHub repository and are live on the GitHub Pages site. Local commits are not sufficient; "Nothing is real until it's public."
- **Build Locking:** The current dual-GPU AM4 build is locked in. Do not change the core parts unless the user explicitly requests an alteration.
- **Voice Usage:** Only use the Mac Voice skill (`bash skills/mac-voice/scripts/speak.sh "<message>"`) when explicitly asked by the user (e.g., "Tell me", "use your voice", or "uyv"). Do not trigger it autonomously.