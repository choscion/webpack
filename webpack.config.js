const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const apiMocker = require("connect-api-mocker");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    main: "./src/app.js",
    result: "./src/result.js"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
    sourceMapFilename: "[name].js.map"
  },
  devtool: "source-map",
  devServer: {
    overlay: true,
    stats: "errors-only",
    before: app => {
      app.use(apiMocker("/api", "mocks/api"));
    },
    hot: true
  },
  optimization: {
    minimizer:
      mode === "production"
        ? [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true // 콘솔 로그를 제거한다
                }
              }
            })
          ]
        : [],
    splitChunks: {
      chunks: "all"
    }
  },
  externals: {
    axios: "axios"
  },
  module: {
    rules: [
      {
        test: /\.css$/, //js 확장자를 가진 모든 파일을 로더로 돌리겠다
        use: [
          // 사용할 로더를 명시함
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader" // 방금 만든 로더를 적용한다
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          publicPath: "./dist/", // prefix를 아웃풋 경로로 지정
          name: "[name].[ext]?[hash]", // 파일명 형식
          limit: 20000 //2kb 미만 파일만 data url로 처리
        }
      }
      // {
      //   test: /\.js$/,
      //   loader: "babel-loader",
      //   exclude: /node_modules/
      // }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Author: ${childProcess.execSync("git config user.name")}
      `
    }),
    new webpack.DefinePlugin({
      TWO: JSON.stringify("1+1"),
      "api.domain": JSON.stringify("http://dev.api.domain.com")
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 템플릿 경로를 지정
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(dev)" : ""
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, // 빈칸 제거
              removeComments: true // 주석 제거
            }
          : false
    }),
    new CleanWebpackPlugin(), // 빌드 이전 결과물을 제거하는 플러그인
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: "[name].css" })]
      : []), // 나머지 연산자
    new CopyPlugin([
      {
        from: "./node_modules/axios/dist/axios.min.js",
        to: "./axios.min.js" // 목적지 파일에 들어간다
      }
    ])
  ]
};
