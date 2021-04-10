<template>
  <canvas ref="canvas" style="width: 100%; height: 100%;" />
</template>

<script>
import renderer from './renderer'
import throttle from 'lodash/throttle'
const ipcRenderer = window.ipcRenderer
const URL = window.URL || window.webkitURL

export default {
  extends: renderer,
  name: 'canvasRenderer',
  data () {
    const vm = this
    return {
      video: {
        width: 0,
        height: 0
      },
      screen: {
        offsetWidth: 0,
        offsetHeight: 0
      },
      frameHandler: function (e, data) {
        vm.draw(data)
      }
    }
  },
  computed: {
    /**
     * 参数根据具体值来算，通过缓存数据保证最大限度节省资源
     */
    drawImageArgs ({ screen, video }) {
      const videoWidth = video.width
      const videoHeight = video.height
      const { offsetWidth, offsetHeight } = screen

      let offsetX = 0
      let offsetY = 0

      if (videoWidth / videoHeight > offsetWidth / offsetHeight) {
        const maxVideoWidth = offsetWidth * videoHeight / offsetHeight
        offsetX = (videoWidth - maxVideoWidth) / 2
      } else {
        const maxVideoHeight = offsetHeight * videoWidth / offsetWidth
        offsetY = (videoHeight - maxVideoHeight) / 2
      }
      return [offsetX, offsetY, videoWidth - offsetX, videoHeight - offsetY, 0, 0, offsetWidth, offsetHeight]
    }
  },
  methods: {
    getScreenSize: throttle(function () {
      const { offsetWidth, offsetHeight } = document.body
      this.screen.offsetWidth = offsetWidth
      this.screen.offsetHeight = offsetHeight
    }, 100),
    draw (arrayBuffer) {
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })
      const src = URL.createObjectURL(blob)
      // const src = 'data:image/jpeg;base64,' + arrayBuffer

      let img = new Image()
      img.src = src
      img.onload = () => {
        const { drawImageArgs, screen } = this
        const canvas = this.$refs.canvas
        const context = canvas.getContext('2d')
        this.video.width = img.width
        this.video.height = img.height
        const { offsetWidth, offsetHeight } = screen

        canvas.width = offsetWidth
        canvas.height = offsetHeight

        context.drawImage(img, ...drawImageArgs)
        img = null
        URL.revokeObjectURL(src)
      }
    }
  },
  mounted () {
    this.getScreenSize()
    window.addEventListener('resize', this.getScreenSize)
    ipcRenderer.on('player:frame', this.frameHandler)
  },
  destroyed () {
    window.removeEventListener('resize', this.getScreenSize)
    ipcRenderer.off('player:frame', this.frameHandler)
  }
}
</script>

<style>
</style>
