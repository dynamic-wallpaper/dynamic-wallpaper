/**
 * 控制器页面
 */
import { ipcMain } from 'electron'
import createBrowser from '@/background/util/browser'
import mediaService from '../media/index'

/**
 * @type {Electron.BrowserWindow}
 */
let win = null

/**
 *
 * @param {Electron.App} app
 * @returns
 */
function initApp (app) {
  // 控制窗口
  app.on('activate', async () => {
    if (win.isDestroyed()) {
      win = await createBrowser()
    } else {
      win.show()
    }
  })
}

function initIpc () {
  ipcMain.on('select', (e, url) => {
    mediaService.setUrl(url)
  })
}

/**
 *
 * @param {Electron.App} app
 * @returns
 */
export async function initControl (app) {
  if (win) {
    return
  }
  win = await createBrowser()
  win.setAlwaysOnTop(true)

  initApp(app)
  initIpc()
}

export default initControl
