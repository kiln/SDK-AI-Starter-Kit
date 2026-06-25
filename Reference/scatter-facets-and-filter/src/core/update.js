// update() runs every time something changes — data, bindings, or settings.
// updateControls() and updatePopup() run before layout.update() so the layout
// module can measure populated sections (controls bar, legend, etc.).
// updateChart() runs last because it needs the final primary-section dimensions.
import "d3-transition";
import { layout, colors } from "./init";
import { updateChart } from "../lib/chart";
import { updateLegend } from "../lib/legend";
import { updatePopup } from "../lib/popup";
import { updateControls } from "../lib/controls";
import data from "./data";

function update() {
  // Use all rows for the color scale so colors stay consistent across facets
  // and match the legend regardless of which facet filter is active.
  colors.updateColorScale((data.data || []).map(d => d.color));
  updateControls();
  updatePopup();
  updateLegend();
  layout.update();
  updateChart();
}

export default update;
