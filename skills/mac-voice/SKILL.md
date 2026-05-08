---
name: mac-voice
description: Allows the agent to use macOS voice synthesis to speak messages aloud. Use this to request human assistance, notify of task completion, or signal errors during long-running background tasks.
---

# Mac Voice

This skill allows you to communicate audibly using the macOS `say` command.

## Usage

Use the provided script to speak a message. This is particularly useful when running in a loop or background process and you need to alert the user in the physical room.

### Basic Speech

```bash
bash skills/mac-voice/scripts/speak.sh "I need help with this task."
```

### Common Phrases

- "Can I have some help?" - Use when a physical intervention or specific user decision is needed.
- "Task complete." - Use to signal completion of a long-running batch job.
- "Error encountered." - Use to signal a critical failure that requires attention.

## Heuristics

- Do not use this for every turn; only for significant events or requests for help.
- Keep messages concise to ensure clarity.
- Prefer this over `ask_user` when you are running in a mode where you expect the user to be away from the keyboard but nearby (e.g., in a `/ralph-loop`).
