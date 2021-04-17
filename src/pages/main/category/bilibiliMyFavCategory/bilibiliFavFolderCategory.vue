<script>
/**
 * 用户收藏夹内的视频，基本逻辑和外面的b站分类渲染一致，修改了调用接口和获取mid方案
 */
import bilibiliModel from '@/models/bilibili'
import bilibiliCategory from '../bilibiliCategory'
import { PROTOCOL } from '@/configs/bilibili'
import { MEDIA_PROTOCOL } from '@/configs/protocol'

export default {
  name: 'bilibiliFavFolderCategoryRenderer',
  extends: bilibiliCategory,
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  methods: {
    async fetchList (pageNum = 1) {
      this.isLoading = true
      try {
        const { data } = await bilibiliModel.getFavResources(this.id, pageNum)
        console.log(data)
        const { list, page } = data
        this.totalNumber = page.count
        this.pageNumer = page.pn

        list.vlist.forEach(video => {
          if (!this.list.find(item => item.id === video.bvid)) {
            const videoKey = `${video.bvid}.mp4`
            const thumbnail = video.pic.includes('http')
              ? video.pic
              : `https:${video.pic}`
            this.list.push({
              id: video.bvid,
              thumbnail,
              value: `${MEDIA_PROTOCOL}://${this.category.key}/${videoKey}`,
              label: video.title,
              description: video.description,
              downloadUrl: `${PROTOCOL}://${videoKey}`,
              isDownloaded: videoKey in this.exitedVideo
            })
          }
        })
      } catch (e) {
        this.$message.error('获取数据错误')
      }
      this.isLoading = false
    }
  }
}
</script>
