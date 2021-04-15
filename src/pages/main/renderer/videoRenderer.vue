<template>
  <div class="renderer-container">
    <div class="thumbnail">
      <img :alt="value.thumbnail" :src="value.thumbnail" referrerpolicy="no-referrer" />
    </div>
    <div class="control-container">
      <div class="control-description">
        <label>{{ value.label }}</label>
        <div class="description">{{ value.description }}</div>
      </div>
      <div class="control-button">
        <template v-if="isDownloaded">
          <el-popconfirm
            placement="top-start"
            @confirm="deleteVideo"
            style="flex: 1;"
            title="确认移除该视频嘛"
          >
            <el-button
              style
              :disabled="isSelected"
              slot="reference"
              type="text"
              icon="el-icon-delete"
            />
          </el-popconfirm>
          <el-button :disabled="isSelected" @click="select" size="mini" type="text">设为壁纸</el-button>
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
          <el-button @click="downloadVideo" type="text" v-else>下载到本地</el-button>
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
    const vm = this
    return {
      onMediaProgress (e, data) {
        if (data.url === vm.value.downloadUrl) {
          this.downloading = true
          vm.percentage = data.progress
        }
      },
      downloading: false,
      percentage: vm.value.isDownloaded ? 100 : 0,
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
    isDownloaded ({ percentage }) {
      return percentage === 100
    }
  },
  methods: {
    async downloadVideo () {
      this.downloading = true
      try {
        await serverSDK.post('media/download', {
          category: this.category,
          url: this.value.downloadUrl,
          label: this.value.label,
          md5: this.value.md5
        })
      } catch (e) {
        console.error(e)
        this.$message.error('下载视频出错啦')
      }
      this.downloading = false
    },
    deleteVideo () {
      const { category, value } = this
      const { id } = value
      const deleteTargetFile = `${id}.mp4`
      serverSDK.post('media/delete', {
        category,
        file: deleteTargetFile
      })
        .then(() => {
          this.percentage = 0
          this.downloading = false
          this.$message.success('移除成功')
        })
    }
  }
}
</script>
