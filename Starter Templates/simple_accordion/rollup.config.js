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
    nodeResolve(),
    commonjs(),
    terser(),
  ],
  onwarn: function (warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  }
};
