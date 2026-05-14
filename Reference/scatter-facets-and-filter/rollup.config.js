import nodeResolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const production = process.env.NODE_ENV === "production";

export default {
  input: "src/index.js",
  output: {
    format: "iife",
    name: "template",
    file: "template.js",
    sourcemap: true,
  },
  plugins: [
    // @flourish/facets ^4.x uses d3-selection v3 internally, which matches our
    // own d3-selection dependency — no dedupe needed. (Older facets v1.x had a
    // d3-selection v1/v3 conflict; see SDK_BASICS_FOR_AI.txt gotcha [11].)
    nodeResolve({ preferBuiltins: false, mainFields: ["module"] }),
    commonJS(),
    production && terser(),
  ],
  onwarn: function(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    if (warning.code === "THIS_IS_UNDEFINED") return;
    warn(warning);
  }
};
