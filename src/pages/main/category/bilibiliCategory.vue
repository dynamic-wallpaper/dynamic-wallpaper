<template>
  <div>
    <template v-if="list.length > 0">
      <template v-for="item of list">
        <slot :data="item" />
      </template>
      <el-pagination :total="totalNumber" :current-page="pageNumer" :page-size="pageSize" layout></el-pagination>
    </template>
    <div v-else class="empty">
      <em class="el-icon-box" />暂无内容,敬请期待
    </div>
  </div>
</template>
<script>
/**
 * b站视频分类
 */
import baseCategoryRenderer from './baseCategory'
import bilibiliModels from '@/models/bilibili'
export default {
  extends: baseCategoryRenderer,
  name: 'bilibiliCategoryRenderer',
  data () {
    return {
      pageNumer: 1,
      pageSize: 30,
      totalNumber: 0
    }
  },
  computed: {
    mid ({ category }) {
      const { key = '' } = category
      return key.replace('bilibiliUp', '')
    }
  },
  methods: {
    async fetchList (pageNum = 1) {
      const { data } = await bilibiliModels.getUserVideos(this.mid, pageNum)
      const { list, page } = data
      this.totalNumber = page.count
      this.pageNumer = page.pn

      list.vlist.forEach(video => {
        this.list.push({
          thumbnail: `https:${video.pic}`,
          label: video.title,
          description: video.description,
          downloadUrl: video.bvid
        })
      })
    }
  },
  mounted () {
    this.fetchList()
  }
}
</script>
