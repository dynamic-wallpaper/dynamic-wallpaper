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
 * @param {import('electron-store')} store
 */
async function createControlBrowser (store) {
  win = await createBrowser()
  win.setAlwaysOnTop(true)
  const selected = store.get('selected')
  win.webContents.send('selected', selected.key, selected.url)
}

/**
 *
 * @param {Electron.App} app
 * @param {import('electron-store')} store
 * @returns
 */
function initApp (app, store) {
  // 控制窗口
  app.on('activate', async () => {
    if (win.isDestroyed()) {
      createControlBrowser(store)
    } else {
      win.show()
    }
  })
}

/**
 * @param {import('electron-store')} store
 */
function initIpc (store) {
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
export async function initControl (app, store) {
  if (win) {
    return
  }
  createControlBrowser(store)

  initApp(app, store)
  initIpc(store)
}

export default initControl
