/**
 * 控制器页面
 */
import { ipcMain, Menu } from 'electron'
import createBrowser from '@/background/util/browser'
import initSdk from './sdk'
import initTray from './tray'
import autoUpdater from './autoUpdate'

/**
 * background上下文
 */
export const context = {
  /**
 * @type {Electron.BrowserWindow}
 */
  win: null
}

/**
 * @param {import('electron-store')} store
 */
async function createControlBrowser (store) {
  let win = context.win
  if (!win || win.isDestroyed()) {
    // 给win增加一个临时占位, 防止重复打开
    context.win = {
      isDestroyed () {
        return false
      },
      show () {

      }
    }
    win = await createBrowser('index.html', {
      show: false,
      webPreferences: {
        webSecurity: false,
        webviewTag: true
      }
    })
    context.win = win
    win.moveTop()

    // 初始化后再显示
    win.on('ready-to-show', function () {
      win.show()
    })

    win.on('close', e => {
      e.preventDefault()
      win.hide()
    })
  } else {
    win.show()
  }
}

/**
 *
 * @param {Electron.App} app
 * @param {import('electron-store')} store
 * @returns
 */
function initApp (app, store) {
  // 隐藏dock和菜单
  Menu.setApplicationMenu(null)
  if (app.dock) {
    app.dock.hide()
  }

  // 控制窗口
  app.on('activate', async () => {
    await createControlBrowser(store)
  })
}

/**
 * @param {import('electron-store')} store
 */
function initIpc (store, mediaService) {
  ipcMain.on('selectResource', (e, key, url) => {
    mediaService.setUrl(url)
    store.set('selected.key', key)
    store.set('selected.url', url)
  })
}

/**
 *
 * @param {Electron.App} app
 * @param {import('electron-store')} store
 * @returns
 */
export async function initControl (app, store, mediaService) {
  if (context.win) {
    return
  }
  initApp(app, store)
  initIpc(store, mediaService)
  /**
   * 托盘+控制页
   */
  initTray(app, store, createControlBrowser)
  /**
   * 和客户端的sdk
   */
  initSdk(context, app, store)

  // 检查更新
  autoUpdater()

  await createControlBrowser(store)
}

export default initControl
