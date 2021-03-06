import { BrowserWindow } from 'electron'

export default async function (path = '', options = {}) {
  const baseURL = process.env.WEBPACK_DEV_SERVER_URL || 'app://./index.html/'
  const url = `${baseURL}${path}`

  const { webPreferences = {} } = options
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    ...options,
    webPreferences: {
      ...webPreferences,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  await win.loadURL(url)
  if (!process.env.IS_TEST && path === '') win.webContents.openDevTools()
  return win
}
