<template>
  <div class="renderer-container">
    <img class="thumbnail" frameborder="no" border="0" scrolling="no" :src="value.thumbnail" />
    <div class="control-container">
      <el-popover
        class="control-description"
        placement="top"
        :title="value.label"
        width="300"
        trigger="hover"
      >
        <div slot="reference" class="control-description">
          <label>{{ value.label }}</label>
          <div class="description">{{ value.description }}</div>
        </div>
        <p>{{ value.description }}</p>
      </el-popover>
      <div class="control-button">
        <template v-if="isDownloaded">
          <el-button :disabled="isSelected" type="text" size="mini" @click="select">设为壁纸</el-button>
        </template>
        <template v-else>
          <el-progress
            v-if="percentage !== 0"
            :colors="colors"
            type="circle"
            :show-text="false"
            width="20"
            stroke-width="2"
            :percentage="percentage"
          ></el-progress>
          <el-button v-else type="text" @click="downloadVideo">下载到本地</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import renderer from './renderer'
const { serverSDK } = window
export default {
  extends: renderer,
  name: 'videoRenderer',
  data () {
    return {
      percentage: 0,
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    }
  },
  computed: {
    isDownloaded ({ value }) {
      return value.isDownloaded
    }
  },
  methods: {
    downloadVideo () {
      serverSDK.post('download', {
        category: this.category,
        value: this.value
      })
    }
  }
}
</script>
