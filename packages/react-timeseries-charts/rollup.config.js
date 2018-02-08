import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import uglify from "rollup-plugin-uglify";
import json from "rollup-plugin-json";
import postcss from "rollup-plugin-postcss";

const shared = {
    input: `compiled/entry.js`,
    external: ["react"]
};

export default [
    Object.assign({}, shared, {
        output: {
            name: "ReactTimeseriesCharts",
            format: "umd",
            sourcemap: true,
            file:
                process.env.NODE_ENV === "production"
                    ? "./dist/charts.umd.min.js"
                    : "./dist/charts.umd.js",
            globals: {
                react: "React"
            }
        },

        plugins: [
            postcss({ extensions: [".css"] }),
            json(),
            resolve(),
            replace({
                exclude: "node_modules/**",
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
            }),
            commonjs({
                include: ["/node_modules/"],
                namedExports: {
                    lodash: [
                        "merge",
                        "indexOf",
                        "isString",
                        "isFunction",
                        "isArray",
                        "isNull",
                        "isUndefined",
                        "uniqueId",
                        "isFinite",
                        "isObject",
                        "isNaN",
                        "map",
                        "reduce",
                        "has",
                        "forEach",
                        "moment"
                    ],
                    moment: ["duration"],
                    "moment-timezone": ["tz"]
                }
            }),
            sourceMaps(),
            process.env.NODE_ENV === "production" && filesize(),
            process.env.NODE_ENV === "production" &&
                uglify({
                    output: { comments: false },
                    compress: {
                        keep_infinity: true,
                        pure_getters: true
                    },
                    warnings: true,
                    ecma: 5,
                    toplevel: false
                })
        ]
    }),

    Object.assign({}, shared, {
        output: [
            {
                file: "dist/charts.es6.js",
                format: "es",
                sourcemap: true,
                globals: {
                    react: "React"
                }
            },
            {
                file: "dist/charts.js",
                format: "cjs",
                sourcemap: true,
                globals: {
                    react: "React"
                }
            }
        ],
        plugins: [
            resolve(),
            commonjs({
                include: /node_modules/,
                namedExports: {
                    lodash: [
                        "merge",
                        "indexOf",
                        "isString",
                        "isFunction",
                        "isArray",
                        "isNull",
                        "isUndefined",
                        "uniqueId",
                        "isFinite",
                        "isObject",
                        "isNaN",
                        "map",
                        "reduce",
                        "has",
                        "forEach",
                        "moment"
                    ],
                    moment: ["duration"],
                    "moment-timezone": ["tz"]
                }
            }),
            sourceMaps()
        ]
    })
];
