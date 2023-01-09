const { mergeWithRules } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require("./webpack.common");

module.exports = mergeWithRules({
  module: {
    rules: {
      test: "match",
      use: {
        loader: "match",
        options: "replace",
      },
    },
  },
})(common, {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  "postcss-preset-env",
                  "postcss-deadcss",
                  "postcss-import",
                  "cssnano",
                ],
              },
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
});
