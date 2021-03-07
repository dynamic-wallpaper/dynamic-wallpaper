<template>
  <div id="app">
    <div class="empty" v-if="!renderer">出错啦</div>
    <component :is="renderer" muted :src="url" autoplay loop />
  </div>
</template>

<script>
import { MEDIA_PROTOCOL } from '../../configs/protocol'
const ipcRenderer = window.ipcRenderer

const RENDER = {
  [MEDIA_PROTOCOL]: 'video',
  http: 'iframe',
  https: 'iframe'
}

export default {
  name: 'App',
  data () {
    return {
      url: ''
    }
  },
  computed: {
    renderer ({ url }) {
      const protocol = url.replace(/:\/\/.*/, '')
      return RENDER[protocol]
    }
  },
  components: {},
  created () {
    ipcRenderer.on('setUrl', (e, url) => {
      this.url = url
    })
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

#app > iframe,
#app > video {
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

#app .empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
