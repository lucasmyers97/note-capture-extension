import path from "node:path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";

// in case you run into any TypeScript error when configuring `devServer`
import "webpack-dev-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config: webpack.Configuration = {
  entry: {
    background: "./src/add-on/background.ts",
    popup: "./src/add-on/popup.ts",
    options: "./src/add-on/options.ts"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist/add-on"),
    filename: "[name].js",
    clean: true,
  },
  mode: 'none',

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "static" },
        { from: "src/add-on/manifest.json" },
        { from: "src/add-on/icons", to: "icons" },
        { from: "src/add-on/liquid.js"} // workaround before I use the actual Liquid module
      ],
    }),
  ],
};

export default config;
