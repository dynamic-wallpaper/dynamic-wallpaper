/**
 * 控制器页面
 */
import { ipcMain, Menu } from 'electron'
import createBrowser from '@/background/util/browser'
import initTray from './tray'

/**
 * @type {Electron.BrowserWindow}
 */
let win = null

/**
 * @param {import('electron-store')} store
 */
async function createControlBrowser (store) {
  if (!win || win.isDestroyed()) {
    win = await createBrowser()
    win.setAlwaysOnTop(true)
    const selected = store.get('selected')
    win.webContents.send('selected', selected.key, selected.url)
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
    createBrowser(store)
  })
}

/**
 * @param {import('electron-store')} store
 */
function initIpc (store, mediaService) {
  ipcMain.on('select', (e, key, url) => {
    mediaService.setUrl(url)
    store.set('selected', {
      key,
      url
    })
  })
}

/**
 *
 * @param {Electron.App} app
 * @param {import('electron-store')} store
 * @returns
 */
export async function initControl (app, store, mediaService) {
  if (win) {
    return
  }
  createControlBrowser(store)

  initApp(app, store)
  initIpc(store, mediaService)
  initTray(app, store, createControlBrowser)
}

export default initControl
