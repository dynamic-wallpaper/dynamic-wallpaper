/**
 * store
 */
import { app, ipcMain } from 'electron'
import Store from 'electron-store'
import schema from './schema'

export const EVENT = {
  INIT: 'vuex:init',
  SYNC: 'vuex:sync'
}

/**
 * 已经链接上的vuex
 * @type {Set<Electron.WebContents>}
 */
const senderSet = new Set()

const store = new Store({
  schema,
  defaults: {
    selected: {
      url: '',
      key: '',
      category: ''
    },
    openAtLogin: false,
    lastSelectFileDirPath: app.getPath('home')
  }
})

store.onDidAnyChange((newValue, oldValue) => {
  console.log('store change', newValue, oldValue)
})

export default function () {
  /**
   * 任何一个页面store初始化的时候都需要同步一下最新的仓库信息
   */
  ipcMain.on(EVENT.INIT, ({ sender }) => {
    senderSet.add(sender)
    sender.send(EVENT.SYNC, store.store)
  })
  ipcMain.on(EVENT.SYNC, ({ sender }, state) => {
    store.store = state
    /**
     * @type {Electron.WebContents}
     */
    senderSet.forEach((_sender) => {
      if (_sender.id !== sender.id) {
        if (_sender.isDestroyed()) {
          senderSet.delete(_sender)
        } else {
          _sender.send(EVENT.SYNC, state)
        }
      }
    })
  })
  return store
}
