// scatter-facets reference template — demonstrates @flourish/facets + @flourish/controls
// alongside the full module stack from scatter-basic.
const state = {
  // Scatter settings
  dot_radius: 5,
  dot_color: "#e84a4a",
  animation_duration: 750,
  height_mode: "auto",
  aspect_ratio: 0.62,
  aspect_ratio_mobile: 1,
  aspect_breakpoint: 500,

  // Controls — selected_facet tracks the currently active filter value
  selected_facet: "All",
  controls_container: {},
  facet_control: { control_type: "dropdown" },
  controls_style: {},
  dropdown_style: {},

  // Colors module
  color: {},

  // Legend modules
  legend_container: {},
  legend_categorical: { max_width: 100 },
  legend_continuous: {},

  // Popup, number formatting and localization
  popup: {},
  localization: {},
  x_format: {},
  y_format: {},

  // Chart layout modules
  x: {},
  y: {},
  chart_bg: {},

  // Facets module — controls grid layout, column count, titles
  facets: {},

  layout: {}
};

export default state;
