"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import replace from "rollup-plugin-replace";
import screeps from "rollup-plugin-screeps";
import git from "git-rev-sync";

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true
  },

  plugins: [
    clear({
      targets: ["dist"]
    }),
    resolve(),
    commonjs(),
    replace({
      __REVISION__: JSON.stringify(git.short())
    }),
    typescript({
      tsconfig: "./tsconfig.json"
    }),
    screeps({
      config: cfg,
      dryRun: cfg == null
    })
  ]
}
