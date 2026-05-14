// updateChart() manages the facet grid and per-facet scatter rendering.
// Each facet gets its own @flourish/chart-layout instance stored directly on
// facet.node.__chart_layout (see comment below on why, not in a dict).
// The two-pass inner_margins approach keeps axes flush with the data edge
// while preventing dots from being clipped at the plot boundary.
import initChartLayout from "@flourish/chart-layout";
import { layout, colors, popup, localization, getXFormatter, getYFormatter, facets } from "../core/init";
import { svg } from "./create-dom";
import state from "../core/state";
import data from "../core/data";

// Returns the data groups to render. Groups by the facet binding when active,
// otherwise returns all rows in a single unnamed group.
// When state.selected_facet is not "All", only that group is returned —
// producing a single full-width panel instead of the full grid.
function getFacetGroups() {
  const rows = data.data || [];
  if (!rows.length) return [];

  const has_facet = data.data && data.data.metadata && data.data.metadata.facet;
  if (!has_facet) {
    // No facet binding: single panel. Empty string name hides the facet title.
    return [{ name: "", rows }];
  }

  // Group rows by facet value
  const groups = new Map();
  rows.forEach(d => {
    const key = d.facet != null ? String(d.facet) : "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(d);
  });

  const selected = state.selected_facet;
  if (selected && selected !== "All") {
    const filtered = groups.get(selected);
    return filtered ? [{ name: selected, rows: filtered }] : [];
  }

  return Array.from(groups.entries()).map(([name, rows]) => ({ name, rows }));
}

// Returns the height for a single-panel chart (no facet binding, or filtered
// to one panel). Calls layout.setHeight() as a side-effect to size the iframe.
// For multi-panel mode, height is computed via facetAspect instead — see below.
function getSinglePanelHeight(width) {
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
  const h = layout.remToPx(30);
  layout.setHeight(h);
  return h;
}

function updateChart() {
  const width = layout.getPrimaryWidth();

  // Set width upfront; height is set after facets.update() because for
  // multi-panel mode we use facetAspect and let the module compute the total.
  svg.attr("width", width);

  const facet_groups = getFacetGroups();
  if (!facet_groups.length) return;

  const locale_fn = localization.getFormatterFunction();

  // props is defined once outside the callback. chart-layout stores a live
  // reference to state.x / state.y so any settings change is reflected on the
  // next update() call without re-initialising the instance.
  const props = { x: state.x, y: state.y, background: state.chart_bg };

  // Height strategy (mirrors production template-scatter):
  // - Fixed-height embed: fill available space
  // - Multiple panels: facetAspect(1.2) — the module derives total grid height
  //   from (cell_width / 1.2) per panel, accounting for its own internal margins.
  //   Do NOT use .height(fixed_total): facets subtracts its internal margins from
  //   whatever you pass and divides the remainder equally, so cells end up smaller
  //   than expected — especially on narrow screens. facetAspect avoids this because
  //   the module computes the total from cell shape, not from a top-down budget.
  //   Read facets.height() AFTER .update() to get the computed total.
  //   1.2 = slightly wider than tall; same ratio production scatter uses for grids.
  // - Single panel: height_mode (auto / aspect ratio), same as scatter-basic.
  const is_multi = facet_groups.length > 1;

  // duration is shared so panel repositioning and dot transitions stay in sync.
  const duration = state.animation_duration;

  // For non-rectangular grids (triangle, diagonal, custom layouts) the facets
  // module supports a custom_positions array — see node_modules/@flourish/facets/
  // settings.yml for the full spec. Not demonstrated here; add it via state.facets
  // overrides and pass positions as [{ name, x, y, width, height }, ...].
  let facets_chain = facets
    .width(width)
    .duration(duration)
    .data(facet_groups, d => d.name);

  if (Flourish.fixed_height) {
    facets_chain = facets_chain.height(layout.getPrimaryHeight());
  } else if (is_multi) {
    facets_chain = facets_chain.facetAspect(1.2);
  } else {
    facets_chain = facets_chain.height(getSinglePanelHeight(width));
  }

  facets_chain
    .update((facet, i) => {
      const rows = facet.data.rows;
      if (!rows || !rows.length) return;

      // Store chart_layout on the node itself, not in a { [facet.name]: cl } dict.
      // When the filter changes from "All" → "Europe", the facets module REMOVES
      // the <g> nodes for the hidden panels. When switching back to "All" it creates
      // FRESH <g> nodes — the old nodes (and their __chart_layout) are gone.
      // A name-keyed dict would still hold the stale chart_layout pointing at the
      // detached node, so cl.update() would render into a ghost — blank panels.
      // Storing on the node means a fresh node always gets a fresh chart_layout.
      if (!facet.node.__chart_layout) {
        facet.node.__chart_layout = initChartLayout(facet.node, props);
        // dots_overlay is an unclipped sibling so dots can visually overflow the
        // axis lines into the tick-label margin. data_foreground has a clip-path
        // that trims marks at the plot boundary; use it for gridlines and hulls.
        facet.node.__chart_layout.dots_overlay = facet.node.__chart_layout.chart
          .append("g").attr("class", "dots-overlay");
      }
      const cl = facet.node.__chart_layout;

      // First pass: zero inner_margins so axes sit exactly at the data min/max.
      // Then measure dot overflow and add only the residual that the existing
      // tick-label margins can't absorb. For typical dot sizes (5–10 px) and
      // axis margins (30–40 px) the residual is zero and this pass is skipped.
      cl
        .xFormat(getXFormatter(locale_fn))
        .yFormat(getYFormatter(locale_fn))
        .width(facet.width)
        .height(facet.height)
        .xData(rows, d => +d.x)
        .yData(rows, d => +d.y)
        .update({ inner_margins: { top: 0, right: 0, bottom: 0, left: 0 } });

      const x_scale = cl.xScale();
      const y_scale = cl.yScale();
      const x_range = x_scale.range();
      const y_range = y_scale.range();
      const r = state.dot_radius;

      const exceed = { left: 0, right: 0, top: 0, bottom: 0 };
      rows.forEach(d => {
        const x = x_scale(+d.x);
        const y = y_scale(+d.y);
        if (isNaN(x) || isNaN(y)) return;
        exceed.left   = Math.max(exceed.left,   x_range[0] - (x - r));
        exceed.right  = Math.max(exceed.right,  (x + r) - x_range[1]);
        exceed.top    = Math.max(exceed.top,    y_range[1] - (y - r));
        exceed.bottom = Math.max(exceed.bottom, (y + r) - y_range[0]);
      });
      const m = cl.margins;
      const residual = {
        top:    Math.max(0, exceed.top    - m.top),
        right:  Math.max(0, exceed.right  - m.right),
        bottom: Math.max(0, exceed.bottom - m.bottom),
        left:   Math.max(0, exceed.left   - m.left)
      };
      if (residual.top || residual.right || residual.bottom || residual.left) {
        cl.update({ inner_margins: residual });
      }

      // Circle IDs are prefixed with the facet name so they are unique across
      // panels — the popup locking mechanism uses getElementById to re-anchor
      // after a resize, and duplicate IDs would give it the wrong element.
      cl.dots_overlay
        .selectAll("circle")
        .data(rows, (d, i) => d.label !== undefined ? d.label : i)
        .join("circle")
        .attr("id", (d, i) => "dot-" + facet.name + "-" + (d.label !== undefined ? d.label : i))
        .on("mouseover", function() { popup.mouseover(this, this.__data__); })
        .on("mouseout", function() { popup.mouseout(); })
        .on("click", function() { popup.click(this, this.__data__, this.id); })
        .transition()
        .duration(duration)
        .attr("cx", d => x_scale(+d.x))
        .attr("cy", d => y_scale(+d.y))
        .attr("r", state.dot_radius)
        .style("fill", d => d.color !== undefined ? colors.getColor(d.color) : state.dot_color);
    });

  // After facets.update(), the module has computed the total grid height from
  // facetAspect. Set the SVG and iframe to match. For single-panel, height was
  // already set by getSinglePanelHeight() so this is a no-op for that case.
  const final_height = facets.height() || layout.remToPx(30);
  if (!Flourish.fixed_height && is_multi) layout.setHeight(final_height);
  svg.attr("height", final_height);

  svg.on("click", function(event) {
    if (event.target === this) popup.clickout();
  });
}

export { updateChart };
