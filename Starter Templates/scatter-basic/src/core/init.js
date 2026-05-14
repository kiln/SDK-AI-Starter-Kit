// All module instances at module scope — created once, shared across files.
// DOM attachment (e.g. legend_container.appendTo()) happens later in createDom()
// once layout sections exist. See SDK_BASICS [3].
import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { createLegendContainer, createDiscreteColorLegend, createContinuousColorLegend } from "@flourish/legend";
import initPopup from "@flourish/info-popup";
import initLocalization from "@flourish/number-localization";
import initFormatter from "@flourish/number-formatter";
import state from "./state";

const layout = initLayout(state.layout);
const colors = createColors(state.color);
const legend_container = createLegendContainer(state.legend_container);
const legend_categorical = createDiscreteColorLegend(state.legend_categorical);
const legend_continuous = createContinuousColorLegend(state.legend_continuous);
const popup = initPopup(state.popup);
const localization = initLocalization(state.localization);

// initFormatter returns a factory function, not a formatter directly. Call it
// with localization.getFormatterFunction() at update time to get the final
// format function that respects the user's locale and formatting settings.
const getXFormatter = initFormatter(state.x_format);
const getYFormatter = initFormatter(state.y_format);

export { layout, colors, legend_container, legend_categorical, legend_continuous, popup, localization, getXFormatter, getYFormatter };
