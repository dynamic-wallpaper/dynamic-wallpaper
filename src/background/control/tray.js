const { Menu, Tray } = require('electron')

let tray = null

export default function (store, openControlBrowser) {
  tray = new Tray(`${__static}/icons/png/16x16.png`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开菜单',
      click () {
        openControlBrowser(store)
      }
    }
  ])
  tray.setToolTip('动态壁纸')
  tray.setContextMenu(contextMenu)
}
