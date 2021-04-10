<script>
/**
 * b站视频分类
 */
import baseCategoryRenderer from './baseCategory'
import bilibiliModels from '@/models/bilibili'
import { PROTOCOL } from '@/configs/bilibili'
import { MEDIA_PROTOCOL } from '@/configs/protocol'

const { serverSDK } = window

export default {
  extends: baseCategoryRenderer,
  name: 'bilibiliCategoryRenderer',
  data () {
    return {
      pageNumer: 0,
      pageSize: 30,
      totalNumber: 99999,
      exitedVideo: {}
    }
  },
  computed: {
    mid ({ category }) {
      const { key = '' } = category
      return key.replace('bilibiliUp', '')
    }
  },
  methods: {
    loadMore () {
      this.pageNumer++
      if (this.pageNumer * this.pageNumer < this.totalNumber) {
        this.fetchList(this.pageNumer)
      }
    },
    async fetchList (pageNum = 1) {
      const { data } = await bilibiliModels.getUserVideos(this.mid, pageNum)
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
    }
  },
  created () {
    serverSDK.get(`category/${this.category.key}`)
      .then(res => res.data)
      .then(exitedVideo => {
        this.exitedVideo = exitedVideo
      })
  }
}
</script>
