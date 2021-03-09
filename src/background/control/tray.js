const { Menu, Tray } = require('electron')

let tray = null

/**
 *
 * @param {Electron.App} app
 * @param {import('electron-store')} store
 * @param {*} openControlBrowser
 */
export default function (app, store, openControlBrowser) {
  tray = new Tray(`${__static}/icons/png/16x16.png`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '选择桌面',
      async click () {
        await openControlBrowser(store)
      }
    },
    {
      label: '退出',
      click () {
        app.exit()
      }
    }
  ])
  tray.setToolTip('动态壁纸')
  tray.setContextMenu(contextMenu)
}
