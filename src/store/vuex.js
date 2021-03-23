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
      console.log(store, ipcRenderer)
    }]
  })
}
