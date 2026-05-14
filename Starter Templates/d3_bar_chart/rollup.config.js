import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: {
    format: "iife",
    name: "template",
    file: "template.js",
    sourcemap: true,
  },
  plugins: [
    // If adding @flourish/facets: pin "d3-selection" to "^1.4.2" in package.json
    // and add dedupe here — nodeResolve({ dedupe: ["d3-selection"] }) — otherwise
    // two d3-selection copies end up in the bundle and facets' render callbacks
    // never fire. See SDK_BASICS_FOR_AI.txt gotcha [11] for the full explanation.
    nodeResolve(),
    commonjs(),
    terser(),
  ],
  /* Cyclic dependencies are allowed in ES6, and such imports occur
     in many d3 components, so suppress those rollup warnings. */
  onwarn: function (warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  }
};
