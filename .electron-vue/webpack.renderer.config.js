'use strict'

// process.env属性返回一个包含用户环境信息的对象 babel环境变量
process.env.BABEL_ENV = 'renderer'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

// 使用 Babili 取代 UglifyJS 2，这是一款基于 Babel 的压缩工具
const BabiliWebpackPlugin = require('babili-webpack-plugin')
// 拷贝资源插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
// 白名单
let whiteListedModules = ['vue', 'element-ui']

// 渲染配置
let rendererConfig = {
  // 此选项控制是否生成，以及如何生成 source map
  devtool: '#cheap-module-eval-source-map',
  // 入口文件
  entry: {
    // /src/renderer/main.js
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  // 外部环境 防止将某些 import 包(package)打包到 bundle 中，而是在运行
  // 时(runtime)再去从外部获取这些扩展包
  externals: [
    /**
     * 生产环境下依赖 dependencies
     * "axios": "^0.16.1",
     * "chart.js": "^2.7.0",
     * "element-ui": "^1.4.7",
     * "moment": "^2.19.1",
     * "vue": "^2.3.3",
     * "vue-electron": "^1.0.6",
     * "vue-router": "^2.5.3",
     * "vuex": "^2.3.1"
     */ 
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          // 加载器, 当CSS没有被提取时应该使用
          fallback: 'style-loader',
          // 应该用于将资源转换为CSS导出模块的加载程序
          use: 'css-loader'
        })
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: process.env.NODE_ENV === 'production',
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  /**
   *  mainConfig.node['__dirname'] = process.env.NODE_ENV !== 'production'
   *  mainConfig.node['__filename'] = process.env.NODE_ENV !== 'production' 
   */
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    // 提取物 - 文本的WebPack-插件 
    new ExtractTextPlugin('styles.css'),
    // HTML-的WebPack-插件, 生成一个HTML文件
    new HtmlWebpackPlugin({
      // 生成 html 文件的文件名
      filename: 'index.html',
      // /src/index.ejs 根据自己的指定的模板文件来生成特定的 html 文件 需要提前安装对应的 loader
      template: path.resolve(__dirname, '../src/index.ejs'),
      /**
       * minify 的作用是对 html 文件进行压缩，minify 的属性值是一个压缩选项或者 false 。默认
       * 值为false, 不对生成的 html 文件进行压缩。
       */
      minify: {
        // 折叠在文档树中空白区域
        collapseWhitespace: true,
        // 移除属性的引号
        removeAttributeQuotes: true,
        // 移除html注释
        removeComments: true
      },
      // 在开发的环境nodeModules指'/node_modules'路径, 生成环境false
      nodeModules: process.env.NODE_ENV !== 'production'
        ? path.resolve(__dirname, '../node_modules')
        : false
    }),
    /**
     * 模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替
     * 换、添加或删除模块，而无需重新加载整个页面
     */
    new webpack.HotModuleReplacementPlugin(),
    // 启用此插件后，webpack 进程遇到错误代码将不会退出
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    // 输出 /dist/electron/renderer.js
    filename: '[name].js',
    // library 的导出格式 "commonjs2" - 通过 module.exports：module.exports = xxx 导出
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  // 解析规则
  resolve: {
    /**
     * 别名
     * '@': '/src/renderer',
     * 'vue$': 'vue/dist/vue.esm.js' 仅运行时版本
     */
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    // 默然扩展解析顺序
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
   //目标 electron-renderer渲染进程
  target: 'electron-renderer'
}

/**
 * 调整开发设置的rendererConfig
 */
if (process.env.NODE_ENV !== 'production') {
  rendererConfig.plugins.push(
    /**
     * 允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建
     * 允许不同的行为非常有用。比如,你可能会用一个全局的常量来决定 log 在开发模式触发而不是发布模式
     * 插件直接做的文本替换,给定的值必须包含字符串本身内的实际引号
     */
    new webpack.DefinePlugin({
      // '__static': '"/static"' 路径中出現'\', '\\'替换'\'
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * 调整生产设置的rendererConfig
 */
if (process.env.NODE_ENV === 'production') {
  // 生产环境下不生成 source map
  rendererConfig.devtool = ''

  rendererConfig.plugins.push(
    // 基于 Babel 的压缩工具
    new BabiliWebpackPlugin(),
    // 在webpack中拷贝文件和文件夹
    new CopyWebpackPlugin([
      {
        // 定义要拷贝的源目录 /static
        from: path.join(__dirname, '../static'),
        // 定义要拷贝到的目标目录 /dist/electron/static
        to: path.join(__dirname, '../dist/electron/static'),
        // 忽略拷贝指定的文件
        ignore: ['.*']
      }
    ]),
    /**
     * 允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建
     * 允许不同的行为非常有用。比如,你可能会用一个全局的常量来决定 log 在开发模式触发而不是发布模式
     * 插件直接做的文本替换,给定的值必须包含字符串本身内的实际引号
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    // 通过这个插件配置全局/共享的 loader 配置，使所有的 loader 都能收到这些配置
    new webpack.LoaderOptionsPlugin({
      // loader 将切换到优化模式
      minimize: true
    })
  )
}

module.exports = rendererConfig
