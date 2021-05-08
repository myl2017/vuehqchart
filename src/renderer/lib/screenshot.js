// let subdir = './PrintScr.exe'.replace(/\//g, '\\')
let basedir = __dirname.substring(0, __dirname.indexOf('app'))

const FILEURL = process.env.NODE_ENV === 'development'
  ? 'static/lib/PrintScr.exe'
  : `${basedir}PrintScr.exe`


// 调用QQ库，截屏
export function ScreenShot() {
  var cp = require('child_process')
  var screen_window = cp.execFile(FILEURL)

  // screen_window.on('exit', function (code) {
  //   // 执行成功返回 1，返回 0 没有截图
  //   if (code) mainWindow.webContents.paste()
  // })
}
