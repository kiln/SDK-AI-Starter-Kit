# Flourish SDK AI Starter

An experimental starter kit for building [Flourish](https://flourish.studio) templates with AI coding agents. So far this has been successfully tested with Codex and Claude Code.

Flourish is a platform for building interactive charts, maps, and data stories. A **template** is the reusable chart type behind a visualisation: build one, and you or your non-technical colleagues can create and update charts from it just by swapping in data, no code required. This kit gives an AI agent what it needs to build custom templates for you.

> **Heads up:** this is an early version. It can take a while to produce a
> template and the AI sometimes needs an extra round to fix bugs, treat
> it as a head start, not a one-click generator.

## What's included

- **Starter Templates/** — three working templates to copy and build from
- **Reference/** — a reference template showing advanced patterns (facets, filter controls)
- **STARTING_PROMPT.txt** — the main instruction file for your AI
- **SDK_BASICS_FOR_AI.txt** — SDK rules, module wiring patterns, and common gotchas

## Getting started

You'll need a [Flourish account](https://flourish.studio) to log in and publish.

1. Clone or download this repo.

2. Install the Flourish SDK and log in:
   ```
   npm install -g @flourish/sdk
   flourish login
   ```
   *This needs Node.js. If you don't have it set up, or the install doesn't work, don't worry — skip straight to step 3 and start the AI. It'll walk you through installing the SDK and any prerequisites, and works either way.*

3. Open your AI agent (Codex, Claude Code, Cursor, or similar), start a new conversation, and tell it to **read `STARTING_PROMPT.txt` first**. 
   - **If you opened the AI inside this repo folder:** say *"Start by reading STARTING_PROMPT.txt in this repo."*
   - **If you opened it somewhere else:** give the full path, e.g. *"Start by reading ~/Downloads/SDK-AI-Starter-Kit/STARTING_PROMPT.txt"* — the AI will read the other files from that same folder.

4. Describe what you want to build (see [Writing your prompt](#writing-your-prompt)) and let the AI take it from there. It'll build a first version and refine it with you until it looks right.

5. Preview it locally. The AI starts a preview for you, but you can run one yourself any time with:
   ```
   flourish run
   ```
   This serves the template at `http://localhost:1685` and reloads as changes are made.

6. When you're happy with the result, publish it to Flourish:
   ```
   flourish publish --prerelease   # test version — upload your own data in the Data tab
   flourish publish --release      # make it live
   ```
   On paid Flourish plans, the templates you publish can be kept private to you or your team. See the [Flourish SDK docs](FLOURISH_SDK_DOCS_URL) for more options — publishing, running on a different port, and other commands.

## Writing your prompt

A single sentence works — *"Build me a bubble chart"* — but it's more of a lottery. More detail gets you closer first time. What helps most:

- **Include an image** — a screenshot or sketch of what you want is the fastest way to communicate layout, labels, and chart shape
- **Add sample data** — paste 3–5 rows with column headers, or describe the column structure and types
- **Describe key behaviour** — "colour by category", "filter by region", "add a legend"

You don't need all of these. A sentence plus an image is usually enough.

## What to expect

- **Time:** 7–30 minutes per template depending on the model and chart complexity
- **Permission requests:** expect 10–20 prompts to allow terminal access, curl, file reads, etc.
- **Success rate:** Codex has a success rate of roughly 3/5 first time when given an image, Claude Code 2/5, CoPilot 0% first time. Codex currently works the best I think
because it regularly takes screenshots to track progress. Claude Code does this a bit
but not as successfully.

## Contributions & feedback

This repo is published **read-only**. It is not a project that takes outside contributions, issues are turned off and pull requests are limited to collaborators. If you'd like to fork it and change it for your own use, you're very welcome to.

We'd love to hear how it went for anyone who uses it — what you built, where you got stuck, and any suggestions:

👉 **[Share your feedback](https://forms.gle/JZCUxbnNecC68ryK8)**
