# AGENTS.md — building this Flourish template

You are helping build a **Flourish SDK template** — a reusable interactive chart or
visualisation that runs inside Flourish. A template is a JavaScript bundle plus a
`template.yml` config file. Once published, non-technical users create and update
visualisations from it without touching code.

This file is the source of truth for how Flourish templates must be structured.
Do not rely on general knowledge about Flourish — the rules and gotchas below are
specific and easy to get wrong. The user may not be a developer; explain steps
clearly and check things actually render before reporting success.

---

## 0. Check the user is set up

Before any template work, confirm the prerequisites (walk the user through any
that are missing):

1. **Node.js** (v18+): `node --version` — install from https://nodejs.org
2. **Flourish SDK**: `flourish --version` — install with `npm install -g @flourish/sdk`
3. **Logged in**: `flourish whoami` — log in with `flourish login`

To cut down on approval prompts, batch related shell commands into one call. If
prompts are still frequent, offer to set up an allowlist file for the user's tool.

---

## 1. Core contract — `data` / `state` / `draw` / `update`

Every template exports four things (see `src/index.js`):

```js
export const data  = { data: [] };   // Flourish populates this from data tables
export const state = {};             // current values of all settings
export function draw()  { ... }      // called once on load — create the DOM here
export function update() { ... }     // called on every settings/data change
```

Rules:

- `draw()` **must call `update()` at the end** so the first render reflects initial state.
- `update()` must be safe to call **many times** — no DOM creation, only updates.
- `update()` also fires on every slide change in the Flourish story editor — make
  transitions work when triggered repeatedly, not just on first load.
- `state` must be JSON-serialisable (no functions, DOM nodes, date objects).
- Pre-initialise `data` with its shape: `export const data = { data: [] }`. An
  empty `{}` can make `show_if`/`hide_if` conditions misfire before data loads.
- The validator warns if `update()` takes parameters — use an internal wrapper if
  you need to pass flags.
- Optional 5th export `screenshot(opt, takeScreenshot)`: only if the DOM must be
  prepared before Flourish captures a static image.

### `template.yml` ↔ `state` alignment (do this every time)

- Every property in `template.yml` `settings` must exist in `state` with a default.
- Every `state` property the user should control must appear in `template.yml`.
- When you add a setting, add it to **both files at the same time**.
- If `state` and `template.yml` disagree on a default, Flourish uses the **state**
  default for rendering — keep them in sync.

---

## 2. Build in stages (do not skip)

**Stage 0 — Grill an ambiguous from-scratch request.** When the request is a
one-liner with no detail ("build me a bubble chart", "make a bar chart race"),
stop and ask before building — a vague brief is a lottery, and one round of
questions gets a far better first result than guessing. Ask for the few things
that most change the outcome:

- **A reference image** — a screenshot, sketch, or link to a chart you like. This
  is the single fastest way to pin down layout, labels, and overall shape. Ask for
  it first.
- **Sample data** — a paste of 3–5 rows with column headers, or a description of
  the columns and their types (see Stage 1).
- **Key behaviour** — colour by category? filter by group? animate on slide
  change? tooltips on hover? Anything interactive or conditional.

Grill **once**, concisely, then proceed — don't interrogate turn after turn. If
the user says "just build it", they're running unattended, or the answers are
already implied, pick sensible defaults, state your assumptions inline, and build
a minimum working version they can react to. A rough chart to correct beats a
long questionnaire.

**Stage 1 — Clarify the data.** Data shape drives every binding decision. If the
user already gave column names/types or a sample, proceed. If it's genuinely
unclear, ask for a paste of 3–5 sample rows with headers. If they have no data,
agree column names first, then generate a representative sample CSV. Don't invent
column names and run.

**Assume users always upload their own data.** The baked-in dataset in `data/`
is only a replaceable sample — the user will swap in their
own data once published. So never hard-code column names or row counts: drive
everything through bindings, handle missing/empty values gracefully, and don't
assume a fixed number of rows.

Key questions (ask only what isn't already clear):
- Column names and data types?
- Roughly how many rows — a handful or thousands?

Assume tooltips are wanted for any template with discrete marks (dots, bars,
candlesticks): add `@flourish/info-popup`. Only omit if the user says no tooltips.

**Stage 2 — Write a short plan and get approval** (unless the request is already a
complete spec, the user says to just build, or you're running unattended — then
state the plan inline and proceed). Decide modules as part of the plan, not as
polish. Cover:
- Which `@flourish` modules are needed vs dropped (a module that isn't used in
  rendering should not be imported — it still clutters the settings panel).
- For `@flourish/colors` and `@flourish/facets`: explicitly say "yes, because…"
  or "not needed, because…".
- Data binding structure (dataset name, binding key names).
- Which settings appear in `template.yml`.
- The rendering approach in one sentence.
- Mobile aspect ratio and whether marks/labels must scale or hide at narrow widths.

The first build is a **minimum working version** that renders correctly with the
sample data. Polish and edge cases come later.

---

## 3. Settings (`template.yml`)

Setting types: `color` (single hex), `colors` (palette array), `number`
(add `min`/`max`/`step`), `string` (add a `choices:` block for a dropdown —
order is **`[label, value]`**), `text` (textarea), `boolean`
(`choices: [[Yes, true],[No, false]]` for a button group), `font`, `code`, `url`,
`html`, `hidden`. There is **no `type: choices`** — `choices` is always a modifier
on `type: string`.

- Section headings are plain strings (no `property`).
- Conditional display: `show_if: my_bool`, `hide_if: my_bool`, or
  `show_if: { my_prop: value }`.
- `new_section: true` (rule) or `new_section: "Subheading"` is a **field on a
  setting entry**, not a standalone item — it needs a `property` or the SDK rejects it.
- Widths: `full` (default), `three quarters`, `half`, `quarter`. Keep names short
  for half/quarter width.
- `optional: true` adds a null/none option (only on single bindings/colors).

### Importing module settings

```yaml
settings:
  - import: "@flourish/layout"
    property: layout
```

Section order convention: **[Chart name] → Colors → Axes → Legends → Popups →
Chart background → Number formatting → Layout**.

- The **first section is named after the chart type** ("Scatter", "Bar chart",
  "Box plot") — never "Size" or anything generic.
- Height/size settings (`height_mode`, `aspect_ratio`) go at the **bottom of the
  chart-name section** — no separate section.
- **"Layout" is reserved** for `@flourish/layout` (it generates its own heading) —
  don't name a custom section "Layout".
- Aim for 6–8 sections. Use `new_section: "Subheading"` to group within a section.
- Narrow broad module imports deliberately: for any imported module with multiple
  modes (colors, legend, axis min/max), hide unused modes with `show_if: false`.

---

## 4. Data bindings (`template.yml`)

Each binding maps a user column to a key in `data.<dataset>`:

```yaml
data:
  - dataset: data
    key: label
    name: Label
    type: column        # single column
    column: "Data::A"
    data_type: [string]
```

- Access data through bindings — **never hard-code column names**. The accessor
  matches the `dataset:` name; the skeleton uses `dataset: data`, so it's
  `data.data` (e.g. `data.data.map(d => d.label)`), **not** `data.values`.
- `data.data.column_names` maps key → the user's original header (use for axis
  labels: `const x_label = data.data.column_names.x || "X"`).
- `type: columns` (plural) binds many columns at once; the value is an array of
  column names. For "no default" use `columns: "Data::"` (sheet + no letter);
  `""` errors. **`optional: true` is only valid on `type: column` (singular)** —
  never on `type: columns`.
- **"Info for popups" pattern**: instead of one binding per tooltip field, use a
  single `type: columns` binding keyed `metadata`. Then call
  `popup.setColumnNames(data.data.column_names).update()` once so the popup renders
  "Header: value" pairs.
- Consistent key names (themes and tooling depend on them): `x, y, label, color,
  size, group, filter, facet, metadata, latitude, longitude, source, target,
  image`. The binding key is **`facet`** (singular); `state.facets` (plural) is the
  facets module config — different things.
- **Keep binding keys AND display `name:`s generic, not tied to the sample data.**
  Users will bind all kinds of datasets, so name bindings by their *role* in the
  chart, never after a column in the default CSV. Use `Label`, `X value` /
  `Y value`, `Size by`, `Colour by`, `Group by`, `Filter by`, `Facet by`, `Info
  for popups` — not `Country`, `Sales`, `Population`, etc. Same for keys: use `x`,
  `size`, `color` (the role), not `sales` or `year`.

---

## 5. Modules — pick before writing code

Install with `npm install --save @flourish/<name>`. **State property names matter**
(themes depend on them) — use exactly the name listed.

| Need | Module | state property |
|---|---|---|
| title, subtitle, header, footer/source, legend containers + responsive sizing — **ALWAYS** | `@flourish/layout` | `layout` |
| controls / filters — dropdowns, sliders, buttons, search | `@flourish/controls` + `@flourish/ui-styles` | per control |
| colour varies by data | `@flourish/colors` | `color` |
| discrete marks (dots, bars…) → tooltips | `@flourish/info-popup` | `popup` |
| labelled x/y axes + plot backgrounds | `@flourish/chart-layout` | `x`, `y`, `chart_bg` |
| legends | `@flourish/legend` | `legend_container`, `legend_categorical`, `legend_continuous`, `legend_size` |
| number / date formatting | `@flourish/formatters` | `x_format`, `y_format` |
| grid of charts / small multiples | `@flourish/facets` | `facets` |

If a module applies, use it — **do not hand-roll the equivalent** (palette arrays,
manual grids, custom HTML title/footer or `<select>` controls).

**Always include `@flourish/layout`.** It owns the title, subtitle, header,
footer/source line, legend container, and responsive sizing — never build these
with your own HTML. Import it, render into its sections
(`layout.getSection("header" | "footer" | "legend" | "controls" | "primary")`),
and call `layout.update()` in `update()` (see §6 for call order).

**Use `@flourish/controls` + `@flourish/ui-styles` for every control or filter**
(dropdown, slider, button group, search) — they give themed, accessible controls
that match Flourish. Wiring (instances at module scope):

```js
import { createControlsContainer, createControls } from "@flourish/controls";
import { createGeneralControlsStyle, createDropdownStyle } from "@flourish/ui-styles";
const my_control = createControls(state.my_control);
const controls_container = createControlsContainer(state.controls_container);
const controls_style = createGeneralControlsStyle(state.controls_style, ".fl-control");
const dropdown_style = createDropdownStyle(state.dropdown_style, ".fl-control-dropdown");
// in draw() — after layout sections exist:
controls_container.appendTo(layout.getSection("controls")).add([my_control]);
my_control.on("change", value => { state.my_value = value; update(); });
// in update() — styles BEFORE the container:
controls_style.update();
dropdown_style.update();
controls_container.update();
my_control.options(["All", ...values]).index(i).visible(show).update();
```

template.yml imports: `controls_container` → `"@flourish/controls/container"`,
`my_control` → `"@flourish/controls"`, `controls_style` →
`"@flourish/ui-styles/controls-style"`, `dropdown_style` →
`"@flourish/ui-styles/dropdown-style"`.

`@flourish/colors` is for colour that **varies by data** (a category, value, or
label); for a single fixed colour use `type: color` instead. Keep the state
property named exactly `color` so brand-theme colours inject automatically.

**Create module instances at module scope as constants** — never inside `draw()`
(ES module imports evaluate once; creating inside a function can break on circular
imports). Call e.g. `layout.update()` in `update()`.

**Never write to `state.<module>.X` that the user controls.** Flourish owns those
properties and repopulates them from the settings panel; writing to them in
`update()` silently clobbers the user's input on every render. Only write to a
module sub-property if you've hidden it from the panel with `show_if: false`, or
pass computed overrides directly (e.g. `facets.gutter_w(px).update()`).

`@flourish/facets` and other module gutter/padding units are **rem, not px**
(`gutter_w: 1` ≈ 16px). Use `layout.remToPx()` to convert.

---

## 6. Height & sizing — call order is everything

**This is the #1 cause of a clipped/cut-off chart.** The chart's size and draw
step must run **LAST in `update()`**, after `layout.update()` and after the
header/footer/legend/controls sections are populated. `layout.getPrimaryWidth()`
and `layout.getPrimaryHeight()` return the area left for the chart **after** the
layout chrome is measured — so reading them before `layout.update()` gives stale
dimensions and the chart overflows or clips.

Correct `update()` order (mirrors the production scatter template):

```js
function update() {
  colors.updateColorScale(/* … */);   // 1. update colour scale
  updatePopup();                       // 2. fill popup
  updateLegend();                      // 3. fill the legend section
  layout.update();                     // 4. measure & show/hide sections — MUST be here
  updateChart();                       // 5. size + draw LAST, using primary dimensions
}
```

`updateChart()` reads the final dimensions, sizes the SVG, then draws:

```js
function updateChart() {
  const width  = layout.getPrimaryWidth();   // read AFTER layout.update()
  const height = getChartHeight(width);       // computes height + calls setHeight()
  svg.attr("width", width).attr("height", height);
  // draw within width × height (e.g. chart_layout.width(width).height(height)…)
}
```

`getChartHeight(W)` computes the height for each mode and calls
`layout.setHeight()` as a side-effect:

```js
function getChartHeight(W) {
  if (Flourish.fixed_height || state.height_mode === "off") {
    layout.setHeight(null);               // reset any previously set height
    return layout.getPrimaryHeight();     // fill the container Flourish gave us
  }
  if (state.height_mode === "aspect") {
    const aspect = window.innerWidth < state.aspect_breakpoint
      ? state.aspect_ratio_mobile : state.aspect_ratio;
    const H = W / Math.max(+aspect || 1, 0.1);
    layout.setHeight(H);
    return H;
  }
  const H = Math.min(W * 0.65, layout.remToPx(28));   // rectangular auto default
  layout.setHeight(H);
  return H;
}
```

In a fixed-height embed (and `/preview`), **both height modes are ignored** —
`Flourish.fixed_height` is `true`, `setHeight()` is a no-op, and the chart must
fill the container via `layout.getPrimaryHeight()` (the first branch above). If
your code skips that branch, the chart won't size to the container and will clip.

Categories: **rectangular** (scatter, bar, line) → `min(W*0.65, 28rem)`;
**circular/radial** (pie, rose, radar) → `W * shape_ratio` (circle 1, hexagon √3/2)
— not a fixed rem, which leaves dead space; **content-driven** (lists, tables,
accordion) → measure rendered content and `layout.setHeight(that)`.

Prefer `layout.setHeight(px)` over `Flourish.setHeight()`. `Flourish.fixed_height`
is `true` at `/preview`, so responsive height only runs at the root URL
(http://localhost:1685/), **not** `/preview`.

**If the chart is cut off / clipped, check in this order:**
1. Is the chart sized and drawn **last**, after `layout.update()`? (Most common bug.)
2. Are you sizing the SVG/chart to `layout.getPrimaryWidth()` /
   `layout.getPrimaryHeight()` — not `window.innerHeight` or a hard-coded value?
3. In a fixed-height context, does `getChartHeight()` return
   `layout.getPrimaryHeight()` (it must — `setHeight()` is a no-op there)?
4. Are marks drawn within `[0, height]`? Anything below the SVG height is clipped.
5. Test responsive height at the **root URL**, not `/preview` (which is fixed-height).

---

## 7. Local development & verifying your work

- `flourish run` → dev server at http://localhost:1685. It **auto-watches and
  rebuilds** JS/CSS on save — no need to run `npm run build` / `npm run less`.
- **Stale-server trap**: do NOT trust an exit code or HTTP 200. Read the server
  output. "Running server at http://localhost:1685/" means it started; "Another
  process is already listening on port 1685" / "Failed to start server" means a
  leftover server is serving a **different** template and all your checks silently
  pass against the wrong build. Fix: `pkill -f "flourish run"` and restart, or use
  `flourish run --port 1686` and check that port.
- **HTTP 200 ≠ working**: if `update()` throws, the server still returns 200 while
  the chart is blank. Open `/preview` and confirm marks are actually visible. Check
  the browser console — a silent JS error leaves marks unrendered while axes/legends
  still appear.
- `template.yml` is validated **after** the JS+LESS build; scroll past "Build script
  finished" to check for "Failed to start server" from yml validation.

**Screenshot it yourself before reporting to the user.** Two URLs test different
things:
- `http://localhost:1685/` — the editor. The iframe **width is set by the toolbar**,
  not the browser window, so it's the wrong surface for width/mobile testing. It
  IS where responsive height runs.
- `http://localhost:1685/preview` — bare visualisation, width follows the viewport.
  Screenshot here and test narrow widths. (It's fixed-height, so it does **not**
  exercise the auto/aspect height path.)

If you have no screenshot tool, headless Chrome works without a download if Chrome
is installed (do NOT download a browser):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --screenshot=out.png --window-size=1000,700 --timeout=15000 \
  http://localhost:1685/preview
```

Wait for the rebuild to finish before capturing (the server log prints a
reload/build message) — screenshotting mid-reload catches half-sized marks that
look like bugs but aren't. Check on `/preview`: marks visible and correctly
positioned, axes/labels/legend render without overlap or clipping, and a 375px
capture (`--window-size=375,700`) still works. Fix what you can see, then tell the
user to open http://localhost:1685 and, when ready to test their own data, run
`flourish publish --prerelease` and upload via the Data tab (the local server only
shows the sample CSV).

---

## 8. Pre-build checklist (run before `flourish run`)

- `@flourish/colors` and `@flourish/facets` decisions were justified in the plan.
- Every custom setting in `template.yml` has a matching default in `state`.
- Every imported module is actually **called** in JS (importing without using adds
  panel clutter and no visual effect).
- For each imported module with multiple modes, unused modes are hidden with
  `show_if: false`.
- First settings section is named after the chart type, not "Size".
- Height settings sit at the bottom of the chart-name section.
- No custom section duplicates a module-generated heading ("Layout").
- `@flourish/colors` present only if marks are coloured by a data column.
- For bar/bullet/lollipop/waterfall charts, pass an explicit extent that **includes
  0** to `xData`/`yData` (see gotcha 5) — otherwise bars draw off-screen.
- For interactive controls (drag, slider, click toggle), test every interaction
  after first render and confirm overlays don't cover labels/axes (SVG stacking is
  DOM order, see gotcha 4).

---

## 9. Debugging — when the chart looks wrong

- Open the console (F12). A throw inside `update()` stops marks rendering while
  axes/legends may still show.
- Marks missing? `console.log(data.data)` at the top of `update()`. An empty array
  means bindings or the CSV path is wrong.
- Marks mis-positioned? Log `x_scale(knownValue)` / `y_scale(knownValue)`. Note
  `y_scale.range()[1]` is the chart **top** in SVG space, not 0.
- Setting has no effect? The `state` property name must match the `template.yml`
  property **exactly** — typos silently leave the default.
- Grep `src/` for hardcoded column names, `console.log`, or `TODO` before publishing.

---

## 10. Known gotchas (condensed)

1. **`data.data.<binding>.type` `show_if` conditions don't resolve in local
   `flourish run`** — every branch shows at once (colour categorical/numeric panels,
   numeric vs date axis Min/Max). They work once published. Use them anyway and tell
   the user to test type-dependent settings in a prerelease.
2. **`layout.update()` must be called LAST** in `update()` (after legend/popup/section
   fills) — empty sections get hidden, and content added after `layout.update()`
   stays invisible until the next cycle. Exception: templates with no collapsible
   sections can call it first.
3. **`legend.visible(false)` latches** — only call it when you know the other legend
   is active; never in a fallback/else branch, or the legend never appears.
4. **SVG stacking is DOM order, not z-index** — create stable named `<g>` layers in
   `draw()` (in paint order) and render each type into its own group. Don't append
   container groups in `update()` (they accumulate). `.raise()` what must stay on
   top; set `pointer-events: none` on non-interactive overlays.
5. **Bar charts: force 0 into the value-axis domain.** Pass an explicit
   `[Math.min(0,...values), Math.max(0,...values)]` extent to `xData`/`yData`, not
   the raw array — otherwise `x_scale(0)` is off-screen and the chart looks blank.
6. **`@flourish/colors` flips to numeric/sequential mode if `updateColorScale`
   receives any number.** For categorical-only data, coerce: `.map(d => String(d.label))`.
   For a string-OR-number colour column, pass raw values so the module can switch.
7. **`@flourish/formatters` `initNumberFormatter()` returns a factory** — call it
   with a format id to get a formatter. It **throws** on a non-number/undefined id,
   which blanks the chart. Guard string/datetime columns and missing metadata before
   calling. Format id is `data.data.metadata.<binding>?.output_format_id`.
8. **Access `data.data.metadata` with optional chaining** (`?.type`), not a fallback —
   `undefined === "string"` is correctly `false` (hidden until type is known).
9. **Don't guess module enum values** — read `node_modules/@flourish/<module>/settings.yml`
   for the `choices:` block. CSS words are wrong (e.g. `gridline_style` is
   `solid|dash|dot|dot_dash`, not `dashed`/`dotted`); a bad value can blank the chart.
10. **`chart_layout.chart` is SVG-absolute** — it has no margin transform. Use
    `x_scale(v)` / `y_scale(v)` directly; the chart top is `y_scale.range()[1]`, not 0.
11. **Line curves: `curveBasis` undershoots peaks** — prefer `curveMonotoneX` for
    time series (or `curveCatmullRom` for sparse data); reserve `curveBasis` for
    intentionally smoothed/estimated lines.
12. **Rollup circular-dependency warnings from D3 are harmless** — already suppressed
    in `rollup.config.js`.
13. **`layout.setLegendPosition()` was removed** in `@flourish/layout` v8+ — legend
    position comes from the layout settings.

---

## 11. File structure & publishing

- `template.yml` — config: `id`, `name`, `sdk_version`, `build`, `settings`, `data`.
  Set a **unique kebab-case `id`** before publishing — reusing an id overwrites that
  existing template in your account.
- `GUIDE.md` — shown on the template's overview page in Studio. Document what it's
  for, the expected data format, and key settings.
- `src/index.js` — entry point (single-file is fine; split into `src/core/` +
  `src/lib/` only when complexity warrants it). `template.js` is compiled output —
  never edit it directly.
- `less/style.less` → compiled to `static/style.css`. `static/` holds bundled assets
  (reference via `Flourish.static_prefix`). `data/` holds sample CSVs (filename
  becomes the data table name).

Publishing:
- `flourish publish --prerelease` — test in Studio (with a Data tab) without
  affecting any live release. Do this often; the local server has no Data tab.
- `flourish publish --release` — promote to a full release.
- Renaming a setting property or binding key is a **breaking change** — existing
  visualisations lose that stored value.
