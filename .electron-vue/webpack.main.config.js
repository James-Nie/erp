'use strict'

// process.env属性返回一个包含用户环境信息的对象 babel环境变量
process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

// 使用 Babili 取代 UglifyJS 2，这是一款基于 Babel 的压缩工具
const BabiliWebpackPlugin = require('babili-webpack-plugin')

// 主要的配置
let mainConfig = {
  //　入口文件
  entry: {
    // /src/main/index.js
    main: path.join(__dirname, '../src/main/index.js')
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
    ...Object.keys(dependencies || {})
  ],
  module: {
    /**
     * 创建模块时，匹配请求的规则数组。这些规则能够修改模块的创建方式。这些规则能
     * 够对模块(module)应用加载器(loader)，或者修改解析器(parser)
     */
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        // 排除
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
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
  // 输出 /dist/electron/main.js
  output: {
    filename: '[name].js',
    // library 的导出格式 "commonjs2" - 通过 module.exports：module.exports = xxx 导出
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    // 启用此插件后，webpack 进程遇到错误代码将不会退出
    new webpack.NoEmitOnErrorsPlugin()
  ],
  // 解析规则
  resolve: {
    // 默认以.js, .json, .node结尾
    extensions: ['.js', '.json', '.node']
  },
  //目标 electron主进程
  target: 'electron-main'
}

/**
 * 调整开发设置的主配置
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    /**
     * 允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建
     * 允许不同的行为非常有用。比如,你可能会用一个全局的常量来决定 log 在开发模式触发而不是发布模式
     * 插件直接做的文本替换,给定的值必须包含字符串本身内的实际引号
     */
    new webpack.DefinePlugin({
      // '__static': '"/static"', 路径中出現'\', '\\'替换'\'
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * 调整生产设置的主配置
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    // 基于 Babel 的压缩工具
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig
