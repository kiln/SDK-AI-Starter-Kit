import initChartLayout from "@flourish/chart-layout";
import { layout, colors, popup, localization, getXFormatter, getYFormatter } from "../core/init";
import { svg } from "./create-dom";
import state from "../core/state";
import data from "../core/data";

// chart_layout is initialised lazily on the first update that has data,
// because initChartLayout requires the SVG node to exist in the DOM.
let chart_layout;

// Returns the chart height in pixels and calls layout.setHeight() as a side-
// effect to keep the iframe in sync.
// - auto   → sensible rem-based default (scales with font size)
// - aspect → width / aspect_ratio (desktop/mobile breakpoint respected)
// In a fixed-height context (fixed iframe, /preview, /embed) Flourish.fixed_height
// is true; setHeight() is a no-op but we call setHeight(null) to clear any
// height set by a previous update. "off" mode works the same way and is
// supported in the code but not exposed in template.yml by default.
// See SDK_BASICS_FOR_AI.txt section 6 for the canonical pattern.
function getChartHeight(width) {
  if (Flourish.fixed_height || state.height_mode === "off") {
    layout.setHeight(null);
    return layout.getPrimaryHeight();
  }
  if (state.height_mode === "aspect") {
    const aspect = window.innerWidth < state.aspect_breakpoint
      ? state.aspect_ratio_mobile
      : state.aspect_ratio;
    const h = width / Math.max(+aspect || 1, 0.1);
    layout.setHeight(h);
    return h;
  }
  // auto: 30rem default, scales with page font size
  const h = layout.remToPx(30);
  layout.setHeight(h);
  return h;
}

function updateChart() {
  const width = layout.getPrimaryWidth();
  const height = getChartHeight(width);

  svg
    .attr("width", width)
    .attr("height", height);

  if (!data.data || !data.data.length) return;

  // Pass the axis and background state objects to chart-layout. Only
  // initialise once — re-initialising on every update would reset user
  // interactions like zoom and pan.
  const props = { x: state.x, y: state.y, background: state.chart_bg };
  if (!chart_layout) {
    chart_layout = initChartLayout(svg.node(), props);
    // Dots render in an unclipped sibling group so they can visually overflow
    // the axis line into the tick-label margin. data_foreground has a clip-path
    // that cuts off any mark whose centre sits on the plot edge (e.g. y = 0).
    // Use data_foreground for gridlines, reference lines, hulls — anything that
    // should be clipped to the plot area.
    chart_layout.dots_overlay = chart_layout.chart.append("g").attr("class", "dots-overlay");
  }

  // Rebuild format functions each update so number formatting and locale
  // setting changes take effect immediately.
  const locale_fn = localization.getFormatterFunction();

  // First pass: render with inner_margins zeroed so axes sit exactly at the
  // data min/max. Then measure how much dots overflow the plot edges and apply
  // inner_margins ONLY for overflow that the existing tick-label margins can't
  // absorb. For typical dot sizes (5–10px) and typical axis margins (30–40px)
  // the residual is 0, so axes stay at the data edge and a zero gridline
  // coincides correctly with the x-axis.
  // (xPadding/yPadding stretch the scale domain instead, which shifts y_scale(0)
  // away from the axis line and produces two parallel lines at y = 0.)
  chart_layout
    .xFormat(getXFormatter(locale_fn))
    .yFormat(getYFormatter(locale_fn))
    .width(width)
    .height(height)
    .xData(data.data, d => +d.x)
    .yData(data.data, d => +d.y)
    .update({ inner_margins: { top: 0, right: 0, bottom: 0, left: 0 } });

  const x_scale = chart_layout.xScale();
  const y_scale = chart_layout.yScale();

  const x_range = x_scale.range();
  const y_range = y_scale.range();
  const r = state.dot_radius;
  const exceed = { left: 0, right: 0, top: 0, bottom: 0 };
  data.data.forEach(d => {
    const x = x_scale(+d.x);
    const y = y_scale(+d.y);
    if (isNaN(x) || isNaN(y)) return;
    exceed.left   = Math.max(exceed.left,   x_range[0] - (x - r));
    exceed.right  = Math.max(exceed.right,  (x + r) - x_range[1]);
    exceed.top    = Math.max(exceed.top,    y_range[1] - (y - r));
    exceed.bottom = Math.max(exceed.bottom, (y + r) - y_range[0]);
  });
  const m = chart_layout.margins;
  const residual = {
    top:    Math.max(0, exceed.top    - m.top),
    right:  Math.max(0, exceed.right  - m.right),
    bottom: Math.max(0, exceed.bottom - m.bottom),
    left:   Math.max(0, exceed.left   - m.left)
  };
  // Scatter-only: this overflow guard is only needed for circular marks that
  // can bleed past the axis edge. Remove this block for line, area, bar, or
  // lollipop charts — those marks don't overflow the plot boundary.
  if (residual.top || residual.right || residual.bottom || residual.left) {
    chart_layout.update({ inner_margins: residual });
  }

  const circles = chart_layout.dots_overlay
    .selectAll("circle")
    .data(data.data, (d, i) => d.label !== undefined ? d.label : i)
    .join("circle")
    // IDs are used by the popup locking mechanism to retrieve a node by its
    // locked_id. Fall back to index when the label binding is not set.
    .attr("id", (d, i) => "dot-" + (d.label !== undefined ? d.label : i))
    .on("mouseover", function() { popup.mouseover(this, this.__data__); })
    .on("mouseout", function() { popup.mouseout(); })
    .on("click", function() { popup.click(this, this.__data__, this.id); });

  circles
    .transition()
    .duration(400)
    .attr("cx", d => x_scale(+d.x))
    .attr("cy", d => y_scale(+d.y))
    .attr("r", state.dot_radius)
    // ESSENTIAL: getColor() must be called here in the render loop — importing
    // @flourish/colors and calling updateColorScale() alone have no visual effect.
    // Use the color scale when a color column is bound; fall back to dot_color.
    .style("fill", d => d.color !== undefined ? colors.getColor(d.color) : state.dot_color);

  // Clicking the SVG background (not a dot) dismisses any locked popup.
  svg.on("click", function(event) {
    if (event.target === this) popup.clickout();
  });
}

export { updateChart };
