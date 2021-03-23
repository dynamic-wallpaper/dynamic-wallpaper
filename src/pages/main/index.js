import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import getStore from '@/store/vuex'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI, {
  size: 'mini'
})
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store: getStore(window.ipcRenderer)
}).$mount('#app')
