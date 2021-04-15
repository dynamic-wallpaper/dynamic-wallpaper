import { Menu, Tray, dialog, app as electronApp, nativeImage } from 'electron'
import { service } from '@/background/media/index'
import { MEDIA_PROTOCOL } from '@/configs/protocol'
import About from 'electron-about'
import path from 'path'

let tray = null
const context = {
  store: null,
  openControlBrowser: null,
  app: null
}

const separator = {
  type: 'separator'
}

const aboutMenu = {
  ...About.makeMenuItem('MAC动态壁纸', {
    icon: nativeImage.createFromPath(path.join(__static, 'icons', 'png', '32x32.png')).toDataURL(),
    appName: '动态壁纸',
    version: `Version ${electronApp.getVersion()}`,
    copyright: '© mizuka.wu'
  }),
  label: '关于'
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
      label: '选择本地资源',
      async click () {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: '选择本地资源文件',
          defaultPath: store.get('lastSelectFileDirPath') || app.getPath('home'),
          buttonLabel: '打开',
          filters: [{ name: '视频', extensions: ['mp4'] }],
          properties: ['openFile']
        })
        if (!canceled) {
          const [filePath] = filePaths
          store.set('lastSelectFileDirPath', path.dirname(filePath))
          /**
           * store更新
           */
          const resourceFilePath = `${MEDIA_PROTOCOL}://${filePath}`
          store.set('selected.key', '')
          store.set('selected.url', resourceFilePath)
          service.setUrl(resourceFilePath)
        }
      }
    },
    separator,
    {
      label: '开机自启动',
      type: 'checkbox',
      checked: openAtLogin,
      click () {
        const exeName = path.basename(process.execPath)
        app.setLoginItemSettings({
          openAtLogin: !openAtLogin,
          path: process.execPath,
          args: [
            '--processStart', `"${exeName}"`
          ]
        })
        store.set('openAtLogin', !openAtLogin)
        buildContextMenu()
      }
    },
    aboutMenu,
    separator,
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
