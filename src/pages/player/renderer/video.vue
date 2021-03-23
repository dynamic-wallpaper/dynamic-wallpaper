<template>
  <video
    :src="src"
    :style="style"
    autoplay
    loop
    muted
    ref="video"
  ></video>
</template>

<script>
import renderer from './renderer'
export default {
  extends: renderer,
  name: 'videoRenderer',
  data () {
    return {
      style: {
        position: 'absolute'
      }
    }
  },
  mounted () {
    /**
      * 大小调整
      */
    const video = this.$refs.video
    video.addEventListener('canplay', () => {
      const { videoWidth, videoHeight } = video
      const { offsetWidth, offsetHeight } = document.body
      /**
       * 判断是高高于宽还是宽大于高，使用不同的适配
       */
      let fitConfig = {
        videoWidth,
        videoHeight,
        offsetWidth,
        offsetHeight,
        widthScale: videoWidth / offsetWidth,
        heightScale: videoHeight / offsetHeight,
        fitTargetProp: '',
        otherProp: '',
        offsetProp: ''
      }

      /**
       * 根据宽高比，切换不同的适配方案
       */
      if (fitConfig.widthScale < fitConfig.heightScale) {
        fitConfig = {
          ...fitConfig,
          fitTargetProp: 'width',
          otherProp: 'Height',
          offsetProp: 'top'
        }
      } else {
        fitConfig = {
          ...fitConfig,
          fitTargetProp: 'height',
          otherProp: 'Width',
          offsetProp: 'left'
        }
      }

      const offset = fitConfig[`${fitConfig.fitTargetProp}Scale`] / fitConfig[`offset${fitConfig.otherProp}`]
      this.style = {
        ...this.style,
        width: 'auto',
        height: 'auto',
        left: 0,
        top: 0,
        [fitConfig.fitTargetProp]: '100%',
        [fitConfig.offsetProp]: offset / 2 + 'px'
      }
    })
  }
}
</script>

<style>
</style>
