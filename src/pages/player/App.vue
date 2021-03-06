<template>
  <div id="app">
    <!-- <video id="videoElement"></video> -->
    播放器！{{ url }}
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
    console.log(ipcRenderer)
    ipcRenderer.on('setUrl', (e, url) => {
      console.log(url)
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
}
</style>
