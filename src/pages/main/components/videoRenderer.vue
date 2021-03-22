<template>
  <div class="renderer-container">
    <img
      :alt="value.thumbnail"
      :src="value.thumbnail"
      class="thumbnail"
    />
    <div class="control-container">
      <el-popover
        :title="value.label"
        class="control-description"
        placement="top"
        trigger="hover"
        width="300"
      >
        <div
          class="control-description"
          slot="reference"
        >
          <label>{{ value.label }}</label>
          <div class="description">{{ value.description }}</div>
        </div>
        <p>{{ value.description }}</p>
      </el-popover>
      <div class="control-button">
        <template v-if="isDownloaded">
          <el-button
            :disabled="isSelected"
            @click="select"
            size="mini"
            type="text"
          >设为壁纸</el-button>
        </template>
        <template v-else>
          <el-progress
            :color="colors"
            :percentage="percentage"
            :show-text="false"
            :stroke-width="3"
            :width="20"
            type="circle"
            v-if="downloading"
          ></el-progress>
          <el-button
            @click="downloadVideo"
            type="text"
            v-else
          >下载到本地</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import renderer from './renderer'
const { serverSDK, ipcRenderer } = window

export default {
  extends: renderer,
  name: 'videoRenderer',
  data () {
    const vm = this
    return {
      onMediaProgress (e, data) {
        if (data.url === vm.value.downloadUrl) {
          vm.percentage = data.progress
        }
      },
      downloading: false,
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
      return value.downloaded || this.percentage === 100
    }
  },
  methods: {
    async downloadVideo () {
      this.downloading = true
      try {
        await serverSDK.post('media/download', {
          category: this.category,
          url: this.value.downloadUrl,
          md5: this.value.md5
        })
      } catch (e) {

      }
      this.downloading = false
    }
  },
  created () {
    ipcRenderer.on('media:progress', this.onMediaProgress)
  },
  beforeDestroy () {
    ipcRenderer.off('media:progress', this.onMediaProgress)
  }
}
</script>
