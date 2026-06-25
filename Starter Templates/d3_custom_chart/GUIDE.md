# D3 custom chart

This starter uses a simple bar chart only as a minimal D3 example. For normal rectangular bar, column, scatter, line, or axis-based charts, start from scatter-basic instead. Use this starter when the chart needs custom SVG logic that does not fit a standard x/y plot layout, such as radial, network, timeline, bespoke annotation, or non-Cartesian charts.

## Data

One row per bar. Two columns:

| Column | Description |
|--------|-------------|
| Label  | Category name shown on the x axis |
| Value  | Numeric value shown on the y axis  |

## Key settings

- **Color mode** — Single color (all bars share the first palette colour) or Color by bar (each bar gets its own palette colour with custom per-bar overrides available).
- **Colors** — Categorical palette picker. Wires up automatically to Flourish brand themes.
- **Layout** — Header, footer, and sizing controls.
