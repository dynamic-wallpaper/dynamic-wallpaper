const { Menu, Tray } = require('electron')
const ex = process.execPath
let tray = null
const context = {
  store: null,
  openControlBrowser: null,
  app: null
}

/**
 * 构建菜单
 */
function buildContextMenu () {
  const { app, openControlBrowser, store } = context
  const openAtLogin = store.get('openAtLogin')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '选择桌面',
      async click () {
        await openControlBrowser(store)
      }
    },
    {
      label: '开机自启动',
      type: 'checkbox',
      checked: openAtLogin,
      click () {
        app.setLoginItemSettings({
          openAtLogin: !openAtLogin,
          path: ex,
          args: []
        })
        store.set('openAtLogin', !openAtLogin)
        buildContextMenu()
      }
    },
    {
      type: 'separator'
    },
    {
      label: '退出',
      click () {
        app.exit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
}

/**
 * 初始化Tray
 * @param {Electron.App} app
 * @param {import('electron-store')} store
 * @param {*} openControlBrowser
 */
export default function (app, store, openControlBrowser) {
  tray = new Tray(`${__static}/icons/png/16x16.png`)

  context.app = app
  context.store = store
  context.openControlBrowser = openControlBrowser

  tray.setToolTip('动态壁纸')
  buildContextMenu()
}
