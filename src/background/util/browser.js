import { BrowserWindow } from 'electron'
import nodePath from 'path'

export default async function (path = 'index.html', options = {}) {
  const baseURL = process.env.WEBPACK_DEV_SERVER_URL || 'app://./'
  const url = `${baseURL}${path}`

  const { webPreferences = {} } = options
  const win = new BrowserWindow({
    width: 1080,
    height: 760,
    ...options,
    webPreferences: {
      ...webPreferences,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: false,
      preload: nodePath.join(__dirname, 'preload.js')
    }
  })

  await win.loadURL(url)
  // eslint-disable-next-line no-constant-condition
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  return win
}
