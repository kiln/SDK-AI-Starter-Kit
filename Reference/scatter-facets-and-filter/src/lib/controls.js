// updateControls() rebuilds the facet filter dropdown options from the current
// data and syncs the selected index with state.selected_facet. The control is
// hidden when no facet binding is active (no column in data.data.metadata.facet).
import { facet_control, controls_container, controls_style, dropdown_style } from "../core/init";
import state from "../core/state";
import data from "../core/data";

function updateControls() {
  // ui-styles must update before the container so dropdown icon styling is correct
  controls_style.update();
  dropdown_style.update();
  controls_container.update();

  const rows = data.data || [];
  const has_facet = data.data && data.data.metadata && data.data.metadata.facet;

  if (!has_facet) {
    facet_control.visible(false).update();
    return;
  }

  const facet_values = [...new Set(rows.map(d => d.facet).filter(v => v != null && v !== ""))];
  const options = ["All", ...facet_values];

  // If the stored selection no longer exists in the options (e.g. after a data
  // reload), reset to "All" to avoid a blank selection.
  if (!options.includes(state.selected_facet)) {
    state.selected_facet = "All";
  }

  facet_control
    .visible(true)
    .options(options)
    .index(Math.max(0, options.indexOf(state.selected_facet)))
    .update();
}

export { updateControls };
