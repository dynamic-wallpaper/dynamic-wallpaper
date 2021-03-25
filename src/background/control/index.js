/**
 * 控制器页面
 */
import { ipcMain, Menu } from 'electron'
import createBrowser from '@/background/util/browser'
import initSdk from './sdk'
import initTray from './tray'

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
    win = await createBrowser()
    context.win = win
    win.moveTop()
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
  app.dock.hide()

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
  await createControlBrowser(store)
}

export default initControl
