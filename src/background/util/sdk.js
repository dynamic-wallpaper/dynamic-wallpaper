/**
 * 后台和接口的访问api
 */
import { ipcMain } from 'electron'
import express from 'express'
import { IpcServer } from 'ipc-express'

const expressApp = express()
const ipc = new IpcServer(ipcMain)

ipc.listen(expressApp)

export default expressApp
