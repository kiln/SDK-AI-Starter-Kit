// All Flourish module instances are created once here at module scope and
// shared across the template. DOM attachment (appendTo, etc.) happens later
// in createDom() once the layout sections exist in the page.
import initLayout from "@flourish/layout";
import createColors from "@flourish/colors";
import { createLegendContainer, createDiscreteColorLegend, createContinuousColorLegend } from "@flourish/legend";
import initPopup from "@flourish/info-popup";
import initLocalization from "@flourish/number-localization";
import initFormatter from "@flourish/number-formatter";
import initFacets from "@flourish/facets";
import { createControlsContainer, createControls } from "@flourish/controls";
import { createGeneralControlsStyle, createDropdownStyle } from "@flourish/ui-styles";
import state from "./state";

const layout = initLayout(state.layout);
const colors = createColors(state.color);
const legend_container = createLegendContainer(state.legend_container);
const legend_categorical = createDiscreteColorLegend(state.legend_categorical);
const legend_continuous = createContinuousColorLegend(state.legend_continuous);
const popup = initPopup(state.popup);
const localization = initLocalization(state.localization);

const getXFormatter = initFormatter(state.x_format);
const getYFormatter = initFormatter(state.y_format);

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
  popup, localization, getXFormatter, getYFormatter,
  facets, facet_control, controls_container, controls_style, dropdown_style
};
