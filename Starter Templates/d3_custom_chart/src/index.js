// d3_custom_chart starter — use for charts with no x/y axes (radial, polar,
// treemap, network, chord, etc.). Single-file structure. The demo below is a
// simple bar chart, but treat it as a worked example to replace, not the point.
// This starter only covers layout and color. If you also need popups, legends,
// or number formatting, read scatter-basic's src/ files or the module wiring
// cheatsheet in SDK_BASICS_FOR_AI.txt section 5.
//
// For radial/polar charts (pie, donut, rose, radial bar): keep the layout,
// color, and height sections — replace renderChart() entirely with your own
// polar coordinate drawing code. Remove the axis imports and axis <g> elements.
//
// Section names below match the separate files in scatter-basic (init.js,
// state.js, etc.) so you can compare the two approaches side by side.

// d3-* sub-packages rather than the full "d3" meta-package keeps the bundle
// small. Only import what the chart actually uses.

import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { max } from "d3-array";


// --- DATA ---
// Flourish populates data.data before draw(), replacing [] with row objects
// keyed by the binding names in template.yml: [{ label: "A", value: 0.08 }, ...]
// The accessor is data.<dataset_name>; all starters use dataset: data → data.data.

export const data = { data: [] };


// --- STATE ---

export const state = {
  color_mode: "single",
  color:      {},

  // Height settings — kept at the bottom of the first section in template.yml.
  // height_mode "auto" gives this chart a sensible rectangular default.
  // For radial/circular charts change the auto branch in getChartHeight() to
  // W * shape_height_ratio (circle = W * 1, hexagon = W * √3/2, etc.).
  // See SDK_BASICS section 6, height category A vs B.
  height_mode:          "auto",
  aspect_ratio:         1.6,
  aspect_ratio_mobile:  1,
  aspect_breakpoint:    500,

  layout: {}
};


// --- INIT ---
// SDK_BASICS [3]: module instances at module scope, not inside draw() or update().

const layout = initLayout(state.layout);
const colors = createColors(state.color);


// --- CREATE DOM ---
// Build the SVG skeleton once in draw(). update() resizes and repaints it —
// selecting existing nodes is cheaper than rebuilding them on every change.

let svg, g;

function createDom() {
  const primary = layout.getSection("primary");
  primary.innerHTML = "";

  svg = select(primary).append("svg");

  g = svg.append("g");
  g.append("g").attr("class", "axis axis--x");
  g.append("g").attr("class", "axis axis--y");
}


// --- DRAW ---

export function draw() {
  createDom();
  update();
  window.onresize = update; // Flourish runs in an iframe; fires when the embed is resized
}


// --- UPDATE ---
// layout.update() first so getPrimaryWidth() / getPrimaryHeight() return the
// correct dimensions before renderChart() reads them.

export function update() {
  const color_keys = state.color_mode === "by_bar"
    ? (data.data || []).map(function(d) { return d.label; })
    : ["bar"];
  colors.updateColorScale(color_keys);
  layout.update();
  renderChart();
}


// --- HEIGHT ---

// Returns the canvas height in pixels and calls layout.setHeight() as a side-
// effect to keep the iframe in sync.
// - auto   → rectangular default capped at 28rem. For radial/circular charts
//             replace with W * shape_height_ratio (circle: W*1, hexagon: W*√3/2).
//             See SDK_BASICS section 6, height category A vs B.
// - aspect → width / aspect_ratio with desktop/mobile breakpoint
// In a fixed-height context (fixed iframe, /preview, /embed) Flourish.fixed_height
// is true; setHeight() is a no-op but we call setHeight(null) to clear any
// height set by a previous update. "off" mode works the same way and is
// supported in the code but not exposed in template.yml by default.
// See SDK_BASICS_FOR_AI.txt section 6 for the canonical pattern.
function getChartHeight(W) {
  if (Flourish.fixed_height || state.height_mode === "off") {
    layout.setHeight(null);
    return layout.getPrimaryHeight();
  }
  if (state.height_mode === "aspect") {
    const aspect = window.innerWidth < (+state.aspect_breakpoint || 500)
      ? (+state.aspect_ratio_mobile || 1)
      : (+state.aspect_ratio       || 1.6);
    const H = W / Math.max(aspect, 0.1);
    layout.setHeight(H);
    return H;
  }
  // auto: cap at 28rem so the chart never gets absurdly tall on wide screens.
  const H = Math.min(W * 0.65, layout.remToPx(28));
  layout.setHeight(H);
  return H;
}


// --- CHART ---
// bottom margin is larger than top to leave room for x-axis tick labels.

const margin = { top: 20, right: 20, bottom: 40, left: 50 };

function renderChart() {
  if (!svg) return;

  const W = layout.getPrimaryWidth();
  const H = getChartHeight(W);

  const width  = W - margin.left - margin.right;
  const height = H - margin.top  - margin.bottom;

  svg
    .attr("width",  W)
    .attr("height", H);

  g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const rows = data.data || [];

  const x = scaleBand()
    .domain(rows.map(function(d) { return d.label; }))
    .rangeRound([0, width])
    .padding(0.1);

  const y = scaleLinear()
    .domain([0, max(rows, function(d) { return +d.value; })])
    .rangeRound([height, 0])
    .nice();

  g.select(".axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(axisBottom(x));

  g.select(".axis--y")
    .call(axisLeft(y).ticks(5));

  const bars       = g.selectAll(".bar").data(rows, function(d) { return d.label; });
  const bars_enter = bars.enter().append("rect").attr("class", "bar");

  bars.merge(bars_enter)
    .attr("fill",   function(d) { return colors.getColor(state.color_mode === "by_bar" ? d.label : "bar"); })
    .attr("x",      function(d) { return x(d.label); })
    .attr("width",  x.bandwidth())
    .attr("y",      function(d) { return y(+d.value); })
    .attr("height", function(d) { return height - y(+d.value); });

  bars.exit().remove();
}
