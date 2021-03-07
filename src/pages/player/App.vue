<template>
  <div id="app">
    <video muted :src="url" autoplay loop />
    <!-- <iframe :src="url" /> -->
  </div>
</template>

<script>
// import flvjs from 'flv.js'
const ipcRenderer = window.ipcRenderer
export default {
  name: 'App',
  data () {
    return {
      url: ''
    }
  },
  components: {},
  created () {
    ipcRenderer.on('setUrl', (e, url) => {
      this.url = url
    })
  }
  // mounted() {
  //   const videoElement = document.getElementById('videoElement')
  //   const flvPlayer = flvjs.createPlayer({
  //     type: 'flv',
  //     url: 'http://example.com/flv/video.flv'
  //   })
  //   flvPlayer.attachMediaElement(videoElement)
  //   flvPlayer.load()
  //   flvPlayer.play()
  // }
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
