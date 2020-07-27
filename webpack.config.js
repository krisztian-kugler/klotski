const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      "@core": path.resolve(__dirname, "src/libs/core"),
      "@event-emitter": path.resolve(__dirname, "src/libs/event-emitter"),
      "@router": path.resolve(__dirname, "src/libs/router"),
      "@utils": path.resolve(__dirname, "src/libs/utils"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  devServer: {
    contentBase: [path.resolve(__dirname, "src")],
    historyApiFallback: true,
  },
};
