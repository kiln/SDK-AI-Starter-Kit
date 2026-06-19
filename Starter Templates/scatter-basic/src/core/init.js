// All module instances at module scope — created once, shared across files.
// DOM attachment (e.g. legend_container.appendTo()) happens later in createDom()
// once layout sections exist. See SDK_BASICS [3].
import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { createLegendContainer, createDiscreteColorLegend, createContinuousColorLegend } from "@flourish/legend";
import initPopup from "@flourish/info-popup";
import { initNumberFormatter, getFormatter } from "@flourish/formatters";
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
// respects the user's Number-formatting settings (prefix, decimals, etc.). The
// number formatter throws on non-number columns, so datetime columns use the
// general getFormatter and categorical/string columns are left unformatted.
const getXNumberFormatter = initNumberFormatter(state.x_format);
const getYNumberFormatter = initNumberFormatter(state.y_format);

// Build a ready-to-use format function for one axis binding. Reads the column
// metadata lazily (it isn't populated until Flourish loads the data) and guards
// every branch so a missing format id never throws. Used for both axis ticks
// (chart.js) and popup values (popup.js).
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

export { layout, colors, legend_container, legend_categorical, legend_continuous, popup, xFormat, yFormat };
