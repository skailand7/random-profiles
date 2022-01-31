/** @type {import('webpack').Configuration} */ //autocompletado en el archivo wpack

const path = require("path"); //ayuda a traer el elemento, path esta en node y no hay q instalar dependencias
const HtmlWebpackPlugin = require("html-webpack-plugin"); //usar el plugin de html en webpack
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.js", //elemento inicial de la aplicacion
  output: {
    path: path.resolve(__dirname, "dist"), //para saber donde se encuentra el proyecto osea dist
    //resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo para no tener problemas
    //con windows, mac o linux
    filename: "[name].[contenthash].js", //antes main.js los hash se utilizan para identificar el build que vamos haciendo
    //y si hay cambios en seguida los cambia
    assetModuleFilename: "assets/images/[hash][ext][query]",
  },
  mode: "development",
  watch: true,
  resolve: {
    extensions: [".js"], //los archivos que puede interpretar
    alias: {
      "@utils": path.resolve(__dirname, "src/utils"),
      "@templates": path.resolve(__dirname, "src/templates"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@images": path.resolve(__dirname, "src/assets/images"),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, //testea todos los archivos de modulos de js o solo los js que pueden ser transformados
        exclude: /node_modules/, //excluye la carpeta de node modules para q no se corrompa la app
        use: {
          loader: "babel-loader", //usa el loader de babel / identifica el loader q sera usado para transformar archivos
        },
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"], //se puede usar use con arreglos o css segun sea el plugin
      },
      {
        test: /\.png/,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "javascript/auto",
        //type: "asset/resource",
        dependency: { not: ["url"] },
        generator: {
          filename: "assets/fonts/[hash][ext]",
        },
        // use: {
        //   loader: "url-loader",
        //   options: {
        //     limit: 10000,
        //     mimetype: "application/font-woff",
        //     name: "[name].[ext]",
        //     outputPath: "./assets/fonts/",
        //     publicPath: "./assets/fonts/",
        //     esModule: false,
        //   },
        // },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      //minifica el index html al igual q el index js
      inject: "body", // tipear body para que la inyeccion de css sea en el body y true en el header
      template: "./public/index.html", //toma el template y lo transforma con los elementos indicados
      //y lo pone en la carpeta dist con la configuracion html
      filename: "./index.html", //resultado
      // Por comentario adicional, este plugin nos permite personalizar la creación de nuestros archivos
      // HTML con la intención de ser servidos como bundles, los cuales, serán instancias de estandarización de archivo útiles plantillass lodash
    }),
    //Un plugin puede extender tareas especificas como optimizar paquetes, gestion de activos, inyeccion de variables.
    //una vez importado el plugin podemos personalizarlos a traves de opciones
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css", //hashes optimizacion //
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images",
        },
      ],
    }),
    new Dotenv(),
  ],
};
