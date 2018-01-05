"use strict";

import clean from "rollup-plugin-clean";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import git from "git-rev-sync";
import typescript from "rollup-plugin-typescript2";
import replace from 'rollup-plugin-replace';
import screeps from "rollup-plugin-screeps";

let cfg;
const i = process.argv.indexOf("--dest") + 1;
if (i == 0) {
    console.log("No destination specified - code will be compiled but not uploaded");
} else if (i >= process.argv.length || (cfg = require("./screeps")[process.argv[i]]) == null) {
    throw new Error("Invalid upload destination");
}

export default {
    input: "src/Main.ts",
    output: {
        file: "dist/main.js",
        format: "cjs",
        name: "kuminet",
        sourcemap: true
    },

    plugins: [
        clean(),
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
