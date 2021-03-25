/**
 * vuex的注入插件
 */
import { getState, schema } from './schema'
import Vuex from 'vuex'
import throttle from 'lodash/throttle'

export default function (ipcRenderer) {
  const syncToBackground = throttle(function (state) {
    ipcRenderer.send('vuex:sync', state)
  }, 500)

  return new Vuex.Store({
    state: getState(schema),
    mutations: {
      /**
       * 和后台同步
       */
      'vuex:sync': function (state, electronStore) {
        Object.assign(state, electronStore)
      },
      // 自动遍历生成mutations
      ...Object.fromEntries(Object.keys(schema).map(key => [`set:${key}`, function (state, payload) {
        state[key] = payload
      }]))
    },
    plugins: [(store) => {
      /**
       * vuex:init事件相关，告诉后台已经初始化，需要同步
       */
      ipcRenderer.send('vuex:init')
      ipcRenderer.on('vuex:sync', (e, state) => {
        store.commit('vuex:sync', state)
      })

      /**
       * 像后台推送变化
       */
      store.subscribe((mutation, state) => {
        if (mutation.type === 'vuex:sync') {
          return
        }

        syncToBackground(state)
      })
    }]
  })
}
