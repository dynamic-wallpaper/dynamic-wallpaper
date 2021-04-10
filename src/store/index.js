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

export const store = new Store({
  schema,
  defaults: {
    selected: {
      url: '',
      key: '',
      category: ''
    },
    openAtLogin: false,
    lastSelectFileDirPath: app.getPath('home'),
    cookie: ''
  }
})

/**
 * electron-store变化的回调
 * @param {Object} state
 * @param {Electron.WebContents} [ignoreSender]
 */
const storeChangeHandler = function (state, ignoreSender) {
  senderSet.forEach((sender) => {
    if (!ignoreSender || sender.id !== ignoreSender.id) {
      if (sender.isDestroyed()) {
        senderSet.delete(sender)
      } else {
        sender.send(EVENT.SYNC, state)
      }
    }
  })
}

const subscribeStoreChange = function () {
  return store.onDidAnyChange((state) => {
    storeChangeHandler(state)
  })
}

// 解除监听
let unsubscribeStoreChange = subscribeStoreChange()

export default function () {
  /**
   * 任何一个页面store初始化的时候都需要同步一下最新的仓库信息
   */
  ipcMain.on(EVENT.INIT, ({ sender }) => {
    senderSet.add(sender)
    sender.send(EVENT.SYNC, store.store)
  })
  ipcMain.on(EVENT.SYNC, ({ sender }, state) => {
    /**
     * 如果是从页面开始进行同步的化，需要先让store停止监听，整体修改之后再进行监听
     * @todo 有多窗口同时处罚的隐患
     */
    unsubscribeStoreChange()
    store.store = state
    storeChangeHandler(state, sender)
    unsubscribeStoreChange = subscribeStoreChange()
  })
  return store
}
