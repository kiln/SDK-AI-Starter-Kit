AI assistants: read STARTING_PROMPT.txt in the repo root before working with this template.

# Simple accordion — Flourish starter template

A single-file Flourish template for DOM/content-driven layouts (no chart library, no axes). Demonstrates the content-driven height pattern (SDK_BASICS height category C): the canvas height is computed from the rendered content — all headers plus the tallest panel — and set once in update(). It intentionally does NOT use the interactive-height pattern (category D); opening a panel does not resize the iframe.

See `src/index.js` for the annotated source. See `SDK_BASICS_FOR_AI.txt` in the repo root for SDK reference.
