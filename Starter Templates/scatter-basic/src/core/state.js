// scatter-basic starter — use for charts with x or y axes (scatter, line, bar,
// box plot, candlestick, heatmap, etc.). The default for most charts.
//
// Each property here corresponds to a setting in template.yml, or to the state
// object passed to a Flourish module. Flourish merges user-changed values into
// this object before each update() call.
const state = {
  // Scatter settings
  dot_radius: 5,
  dot_color: "#e84a4a",
  height_mode: "auto",
  aspect_ratio: 0.62,
  aspect_ratio_mobile: 1,
  aspect_breakpoint: 500,

  // Property name must be "color" for Flourish theme support to work.
  color: {},

  // legend_container is not in template.yml but must be in state so the module
  // can store its own settings (font size, alignment, etc.)
  legend_container: {},
  legend_categorical: {
    max_width: 100
  },
  legend_continuous: {},

  popup: {},
  x_format: {},
  y_format: {},

  x: {},
  y: {},
  chart_bg: {},

  // Kept last to mirror template.yml, where the Layout settings appear last.
  layout: {}
};

export default state;
