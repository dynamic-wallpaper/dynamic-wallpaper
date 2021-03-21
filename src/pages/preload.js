import { ipcRenderer } from 'electron'
import { IpcClient } from 'ipc-express'

window.ipcRenderer = ipcRenderer
window.serverSDK = new IpcClient(ipcRenderer)
