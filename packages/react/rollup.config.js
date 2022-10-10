import externals from "rollup-plugin-node-externals";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/bundles/bundle.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/bundles/bundle.esm.min.js",
      format: "esm",
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: "dist/bundles/bundle.umd.js",
      format: "umd",
      name: "SignalWireCommunityReact",
      sourcemap: true,
    },
    {
      file: "dist/bundles/bundle.umd.min.js",
      format: "umd",
      name: "SignalWireCommunityReact",
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  plugins: [
    externals(),
    resolve(),
    typescript({
      tsconfig: "./tsconfig.json",
      target: "ES2015",
      declaration: false,
    }),
  ],
};
