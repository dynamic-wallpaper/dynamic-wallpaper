/**
 * store
 */
import { app } from 'electron'
import Store from 'electron-store'
import schema from './schema'

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

export default store
