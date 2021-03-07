const { Menu, Tray } = require('electron')

let tray = null

export default function (store, openControlBrowser) {
  tray = new Tray('/path/to/my/icon')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开菜单',
      type: 'radio',
      click () {
        openControlBrowser(store)
      }
    }
  ])
  tray.setToolTip('动态壁纸')
  tray.setContextMenu(contextMenu)
}
