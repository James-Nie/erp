'use strict'

import { app, BrowserWindow } from 'electron'

/**
 * 在生产中设置“__static”路径到静态文件
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  // global.__static = '/static'
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
/**
 *  如果是在开发环境(process.env.NODE_ENV === 'development') winURL: `http://localhost:9080`,
 *  生产环境 winURL: `file://${__dirname}/index.html`,
 */

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : 'http://120.55.51.97/sipuERP/index.html'
// const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : 'http://120.26.243.47:3006/sipuERP/index.html'
// const winURL = 'http://localhost:9080'

function createWindow () {
  /**
   * 初始窗口选项
   * 创建和控制浏览器窗口
   */
  mainWindow = new BrowserWindow({
    // frame: false,
    // 窗口宽度,单位像素. 默认是 800
    width: 1366,
    // 窗口高度,单位像素. 默认是 600
    height: 768,
    // 窗口最小宽度，默认为 0
    minWidth: 1366,
    // 窗口最小高度，默认为 0
    minHeight: 768,
    // 窗口默认title. 默认 "Electron"
    title: '思普锯业ERP',
    // 使用web网页size, 这意味着实际窗口的size应该包括窗口框架的size，稍微会大一点
    useContentSize: true,
    show: false
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


// import { autoUpdater } from 'electron-updater'
//
// autoUpdater.on('update-downloaded', () => {
// autoUpdater.quitAndInstall()
// })
//
// pp.on('ready', () => {
// if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })\n
