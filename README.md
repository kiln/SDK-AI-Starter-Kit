# Flourish SDK AI Starter

A starter kit for building basic [Flourish](https://flourish.studio) templates with AI coding agents. So far this has been succesfully tested with Codex and Claude code.

## What's included

- **Starter Templates/** — three working templates to copy and build from
- **Reference/** — a reference template showing advanced patterns (facets, filter controls)
- **STARTING_PROMPT.txt** — the main instruction file for your AI
- **SDK_BASICS_FOR_AI.txt** — SDK rules, module wiring patterns, and common gotchas

## Getting started

1. Install the Flourish SDK:
   ```
   npm install -g @flourish/sdk
   ```

2. Clone or download this repo.

3. Point your AI at `STARTING_PROMPT.txt`:
   - **Codex / Claude Code / Cursor** — open the repo and start a prompt. Ask the AI to start by reading STARTING_PROMPT.txt


## Writing your prompt

A single sentence works — *"Build me a bubble chart"* — but it's more of a lottery. More detail gets you closer first time. What helps most:

- **Include an image** — a screenshot or sketch of what you want is the fastest way to communicate layout, labels, and chart shape
- **Add sample data** — paste 3–5 rows with column headers, or describe the column structure and types
- **Describe key behaviour** — "colour by category", "filter by region", "animate on slide change"

You don't need all of these. A sentence plus an image is usually enough.

## What to expect

- **Time:** 7–35 minutes per template depending on the model and chart complexity
- **Permission requests:** expect 10–20 prompts to allow terminal access, curl, file reads, etc.
- **Success rate:** Codex has a success rate of roughly 3/5 first time when given an image, Claude code 2/5, CoPilot 0% first time. Codex currently works the best I think
because it regularly takes screenshots to track progress. Claude code does this a bit
but not as succesfully.
