/**
 * 控制器页面
 */
import createBrowser from '@/background/util/browser'

/**
 * @type {Electron.BrowserWindow}
 */
let win = null

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

  app.on('activate', async () => {
    if (win.isDestroyed()) {
      win = await createBrowser()
    } else {
      win.show()
    }
  })
}

export default initControl
