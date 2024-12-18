const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

// console.log(path.resolve(__dirname, "assets", "js"));
// __dirname: 작업하고 있는 해당 프로젝트의 전체 경로 찾아와 줌
// resolve: 내가 원하는 맞춤형 경로로 만들어 줌

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorder: "./src/client/js/recorder.js",
  },
  mode: "development",
  watch: true,
  plugins: [new MiniCssExtractPlugin({ filename: "css/style.css" })],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // 오른쪽부터 먼저 시작
      },
    ],
  },
};
