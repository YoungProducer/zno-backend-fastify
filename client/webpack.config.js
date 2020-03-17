const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./src/index.tsx",
  devtool: "source-map",
  // node: {
  //   fs: "empty"
  // },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".test.ts", ".test.tsx"],
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers'),
      routes: path.resolve(__dirname, 'src/routes'),
      store: path.resolve(__dirname, 'src/store'),
      public: path.resolve(__dirname, 'public'),
      types: path.resolve(__dirname, 'src/types'),
      utils: path.resolve(__dirname, 'src/utils'),
      modals: path.resolve(__dirname, 'src/modals'),
      api: path.resolve(__dirname, 'src/api'),
      theme: path.resolve(__dirname, 'src/theme'),
      img: path.resolve(__dirname, 'src/img'),
    }
  },
  output: {
    path: path.join(__dirname, "/build"),
    filename: "bundle.min.js",
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'tslint-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: [{ 
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader"
          },
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader?name=fonts/[name].[ext]",
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?limit=10000',
          'img-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new CopyPlugin([
      {
        from: './public/images',
        to: './img/[name].[ext]',
        toType: 'template'
      }
    ]),
    new Dotenv({
      path: '.env', // load this now instead of the ones in '.env'
      // safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      // systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
    })
  ]
};
