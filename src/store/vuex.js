/**
 * vuex的注入插件
 */
import { getState, schema } from './schema'
import Vuex from 'vuex'

export default function (ipcRenderer) {
  return new Vuex.Store({
    state: getState(schema),
    mutations: {
      increment (state) {
        state.count++
      }
    },
    plugins: [(store) => {
      ipcRenderer.send('vuex:init')
      store.subscribe((mutation, state) => {
        // 每次 mutation 之后调用
        // mutation 的格式为 { type, payload }
        console.log(mutation, state, ipcRenderer)
      })
      ipcRenderer.on('vuex:mutation', (e, a) => {
        console.log(a)
      })
    }]
  })
}
