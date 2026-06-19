// All Flourish module instances are created once here at module scope and
// shared across the template. DOM attachment (appendTo, etc.) happens later
// in createDom() once the layout sections exist in the page.
import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { createLegendContainer, createDiscreteColorLegend, createContinuousColorLegend } from "@flourish/legend";
import initPopup from "@flourish/info-popup";
import { initNumberFormatter, getFormatter } from "@flourish/formatters";
import initFacets from "@flourish/facets";
import { createControlsContainer, createControls } from "@flourish/controls";
import { createGeneralControlsStyle, createDropdownStyle } from "@flourish/ui-styles";
import state from "./state";
import data from "./data";

const layout = initLayout(state.layout);
const colors = createColors(state.color);
const legend_container = createLegendContainer(state.legend_container);
const legend_categorical = createDiscreteColorLegend(state.legend_categorical);
const legend_continuous = createContinuousColorLegend(state.legend_continuous);
const popup = initPopup(state.popup);

// @flourish/formatters is type-aware. initNumberFormatter(state.x_format) returns
// a FACTORY: call it with a column's output_format_id to get a formatter that
// respects the user's Number-formatting settings. The number formatter throws on
// non-number columns, so datetime columns use the general getFormatter and
// categorical/string columns are left unformatted. Shared by every facet's
// axis ticks (chart.js) and by the popup (popup.js).
const getXNumberFormatter = initNumberFormatter(state.x_format);
const getYNumberFormatter = initNumberFormatter(state.y_format);

function makeAxisFormat(binding, getNumberFormatter) {
  return function(value) {
    const meta = data.data && data.data.metadata && data.data.metadata[binding];
    if (!meta || meta.type === "string" || !meta.output_format_id) return value;
    if (meta.type === "datetime") return getFormatter(meta.output_format_id)(value);
    return getNumberFormatter(meta.output_format_id)(value);
  };
}

const xFormat = makeAxisFormat("x", getXNumberFormatter);
const yFormat = makeAxisFormat("y", getYNumberFormatter);

// Facets manages the small-multiples grid layout
const facets = initFacets(state.facets);

// Controls — a single dropdown to filter by facet value
const facet_control = createControls(state.facet_control);
const controls_container = createControlsContainer(state.controls_container);

// ui-styles objects apply visual styling to the controls. They are initialized
// here but their .update() is called each render cycle in updateControls().
const controls_style = createGeneralControlsStyle(state.controls_style, ".fl-control");
const dropdown_style = createDropdownStyle(state.dropdown_style, ".fl-control-dropdown");

export {
  layout, colors,
  legend_container, legend_categorical, legend_continuous,
  popup, xFormat, yFormat,
  facets, facet_control, controls_container, controls_style, dropdown_style
};
