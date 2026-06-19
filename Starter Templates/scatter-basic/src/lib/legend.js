// Shows the correct legend type based on whether the color column is
// categorical (strings) or sequential (numbers).
import { colors, legend_container, legend_categorical, legend_continuous } from "../core/init";
import data from "../core/data";

function updateLegend() {
  if (!legend_container) return;

  const rows = data.data || [];

  // Determine the color column type. metadata may not always be populated,
  // so fall back to inferring the type from the actual values.
  let color_type = null;
  if (data.data && data.data.metadata && data.data.metadata.color) {
    color_type = data.data.metadata.color.type;
  } else if (rows.length) {
    const color_values = rows.map(d => d.color).filter(v => v !== undefined && v !== null && v !== "");
    if (color_values.length > 0) {
      color_type = isNaN(+color_values[0]) ? "string" : "number";
    }
  }

  if (color_type === "string") {
    const unique_values = [...new Set(rows.map(d => d.color))].filter(v => v !== undefined && v !== null && v !== "");
    legend_categorical.visible(true).data(unique_values, colors.getColor);
    legend_continuous.visible(false);
  } else if (color_type === "number") {
    const values = rows.map(d => +d.color).filter(v => !isNaN(v));
    legend_continuous.visible(true).data([Math.min(...values), Math.max(...values)], colors.getColor);
    legend_categorical.visible(false);
  }
  // When color_type is null (no color column bound, or data not yet loaded),
  // we do not call visible(false) on either legend. The legend module's own
  // show_legend setting controls visibility in that case, and calling
  // visible(false) here would latch the _visible flag to false, preventing
  // the legend from appearing on the next update. See SDK_BASICS_FOR_AI.txt [4].

  // legend_container.update() must always be called — it propagates font,
  // color and layout settings to all legends inside the container.
  legend_container.update();
}

export { updateLegend };
