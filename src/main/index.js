// import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import {app, BrowserWindow, Menu, ipcMain, globalShortcut, screen, Tray} from 'electron'
import {autoUpdater} from 'electron-updater'

const OS = require('os')
console.log('OS::: ', OS.homedir())

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const iconURL = process.env.NODE_ENV === 'development'
  ? 'build/icons/logo.png'
  : `${__dirname}/static/image/logo.png`

let tray
let contextMenu
let isTray = false
//nodejs中的path模块
const path = require('path')
const fs = require('fs')

function createWindow() {
  const SIZE = screen.getPrimaryDisplay().workAreaSize
  console.log('size::: ', SIZE)
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    show: false,
    width: SIZE.width,
    height: SIZE.height,
    center: true,
    frame: false,
    transparent: true,
    maximizable: true,
    minimizable: true,
    resizable: false,         // 不允许改变窗口size
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    backgroundColor: '#fff',
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: true
    },
    allowDisplayingInsecureContent: true,
    allowRunningInsecureContent: true,
    download: false,
    icon: iconURL
  })
  const fs = require('fs')
  //---------------------xxc-------------//
  let command
  let downloadUrl
  ipcMain.on('download', (evt, args) => {
    let url = JSON.parse(args)
    downloadUrl = url.versionUrl,
      command = url.command
    //开始下载
    if (command === 'startDownload') {
      this.download = true,
        mainWindow.webContents.downloadURL(downloadUrl)
      return
    }
    if (command === 'cancelDownload') {
      this.download = false
      return
    }
  })

  mainWindow.webContents.session.on('will-download', async (event, item) => {
    // 设置保存路径,使Electron不提示保存对话框。
    this.downloaditem = item
    const fileName = item.getFilename()
    const url = item.getURL()
    const time = item.getStartTime()
    const startTime = time.toString().split('.')[0]
    const initialState = item.getState()
    const downloadPath = OS.homedir()   //暂时存放路径

    let fileNum = 0
    let savePath = path.join(downloadPath, fileName)
    // savePath基础信息
    const ext = path.extname(savePath)
    const name = path.basename(savePath, ext)
    const dir = path.dirname(savePath)

    // 文件存在删除
    if (fs.existsSync(savePath)) {
      fs.unlinkSync(savePath)
    }
    item.setSavePath(savePath)
    item.on('updated', (event, state) => {
      mainWindow.webContents.send('download-item-updated', {
        startTime,
        state,
        totalBytes: item.getTotalBytes(),
        receivedBytes: item.getReceivedBytes(),
        paused: item.isPaused()
      })
    })
    item.once('done', (event, state) => {
      if (!this.download)
        return
      mainWindow.webContents.send('download-item-done', {
        savePath,
        startTime,
        state
      })
      if (state === 'completed') {
        var cp = require('child_process')
        var update = cp.execFile(savePath)
      }
    })
  })

  // 初始化父窗口最大化
  ipcMain.on('max', e => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  // 监听父窗体事件
  ipcMain.on('main-minimize', e => {
    if (!isTray) {
      mainWindow.minimize()
    } else {
      mainWindow.hide()
    }
  })
  ipcMain.on('main-maximize', e => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.on('main-close', e => mainWindow.destroy())
  ipcMain.on('main-exit', e => mainWindow.destroy())

  // 监听子窗口事件
  ipcMain.on('min', e => loginWin.minimize())
  ipcMain.on('close', (e, arg) => {
    // if (!arg) {// 0(登录成功) / null(自动登录)
    //   mainWindow.reload()
    // } else {
    //   mainWindow.webContents.send('dataFromChildWindow', arg)
    // }

    mainWindow.webContents.send('dataFromChildWindow', arg)

    loginWin.destroy()
  })
  ipcMain.on('loginInit', (e) => {
    mainWindow.webContents.send('loginInit')
  })

  ipcMain.on('force-exit', e => {
    loginWin.destroy()
    mainWindow.destroy()
  })

  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    // mainWindow.maximize()
  }
  mainWindow.loadURL(winURL)

  mainWindow.webContents.openDevTools()  // 打包后可打开调试窗口

  // 监听添加系统托盘
  ipcMain.on('put-in-tray', e => {
    //系统托盘图标
    tray = process.env.NODE_ENV === 'development'
      ? new Tray('build/icons/logo.png')
      : new Tray(`${__dirname}/static/image/logo.png`)

    //为托盘图标添加上下文菜单
    contextMenu = Menu.buildFromTemplate([
      // { label: '打开', click: () => {mainWindow.show()} },
      {label: '退出', click: () => {mainWindow.destroy()}} //我们需要在这里有一个真正的退出（这里直接强制退出）
    ])
    tray.setToolTip('连币')
    tray.setContextMenu(contextMenu)

    isTray = true

    tray.on('click', function () {
      mainWindow.show()
    })

  })

  //监听移除系统托盘
  ipcMain.on('remove-tray', e => {
    if (tray) tray.destroy()
    contextMenu = null
    isTray = false
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    openLoginWindow()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  globalShortcut.register('F5', () => false)

  // 菜单隐藏
  Menu.setApplicationMenu(null)

  updateHandle()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  if (tray) tray.destroy()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// app.dock.hide() // 苹果隐藏

/***eletron 自动更新处理***/
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  }
  const uploadUrl = 'http://106.54.70.76/' // 下载地址，不加后面的**.exe
  autoUpdater.setFeedURL(uploadUrl)
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  })
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  })
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  })
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    mainWindow.webContents.send('updateDownloaded')
  })

  ipcMain.on('isUpdateNow', (e, arg) => {
    console.log(arguments)
    console.log('开始更新')
    //some code here to handle event
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('checkForUpdate', () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates()
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}

/***eletron 自动更新处理 结束***/

// 定义login窗体
let loginWin

// 创建loginWin窗口方法
function openLoginWindow() {
  // 使用hash对子页面跳转，这是vue的路由思想
  const modalPath = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080/#/login'
    : `file://${__dirname}/index.html#login`

  const SIZE = screen.getPrimaryDisplay().workAreaSize

  loginWin = new BrowserWindow({
    show: false,          // 优雅的加载页面
    width: SIZE.width,
    height: SIZE.height,
    // width: 736,
    // minHeight: 544,
    center: true,
    frame: false,
    transparent: true,
    resizable: false,
    parent: mainWindow,   // mainWindow是主窗口
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: false
    },
    model: true    // 模态框
  })

  loginWin.loadURL(modalPath)
  loginWin.show()
}
