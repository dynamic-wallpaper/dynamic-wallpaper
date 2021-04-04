<template>
  <div id="app">
    <component :is="renderer" :src="url" class="renderer" />
  </div>
</template>

<script>
import { MEDIA_PROTOCOL } from '@/configs/protocol'
const ipcRenderer = window.ipcRenderer
const renderers = require.context('./renderer', false, /\.vue/)

const RENDER = {
  [MEDIA_PROTOCOL]: 'videoRenderer',
  http: 'websiteRenderer',
  https: 'websiteRenderer',
  '': 'canvasRenderer'
}

export default {
  name: 'App',
  components: {
    ...Object.fromEntries(renderers.keys().map(key => {
      const component = renderers(key).default
      return [component.name, component]
    }))
  },
  data () {
    return {
      url: '',
      style: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    }
  },
  computed: {
    renderer ({ url }) {
      const protocol = url.replace(/:\/\/.*/, '')
      return RENDER[protocol]
    }
  },
  created () {
    ipcRenderer.on('player:setUrl', (e, url) => {
      this.url = url || ''
    })
    ipcRenderer.send('player:getUrl')
  }
}
</script>

<style>
html,
body,
#app {
  background: transparent;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

#app {
  position: relative;
}

.renderer {
  min-width: 100%;
  min-height: 100%;
  width: 100%;
  height: 100%;
}

#app .empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
