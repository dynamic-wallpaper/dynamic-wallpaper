<template>
  <div id="app">
    <video muted :src="url" autoplay loop />
    <!-- <iframe :src="url" /> -->
  </div>
</template>

<script>
import { MEDIA_PROTOCOL } from '../../configs/protocol'
const ipcRenderer = window.ipcRenderer

const RENDER = {
  [MEDIA_PROTOCOL]: 'video'
}

export default {
  name: 'App',
  data () {
    return {
      url: ''
    }
  },
  computed: {
    type ({ url }) {
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
</style>
