// update() runs on every data, binding, or settings change.
// Call order matters: popup and legend run before layout.update() so the layout
// module can measure populated sections and show/hide them. updateChart() runs
// last because it needs the final primary-section dimensions. See SDK_BASICS [2].
import "d3-transition";
import { layout, colors } from "./init";
import { updateChart } from "../lib/chart";
import { updateLegend } from "../lib/legend";
import { updatePopup } from "../lib/popup";
import data from "./data";

function update() {
  // Rebuild the color scale from current data so getColor() and the legend
  // both reflect any change to the bound color column.
  colors.updateColorScale((data.data || []).map(d => d.color));
  updatePopup();
  updateLegend();
  layout.update();
  updateChart();
}

export default update;
