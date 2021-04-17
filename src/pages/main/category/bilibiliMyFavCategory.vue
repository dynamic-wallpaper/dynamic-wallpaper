<template>
  <el-tabs tab-position="left">
    <el-tab-pane v-for="folder of folders" :key="folder.id" :label="folder.title">hello</el-tab-pane>
  </el-tabs>
</template>

<script>
/**
 * 最基础的分类
 */
import baseCategoryRenderer from './baseCategory'
import bilibiliModel from '@/models/bilibili'

export default {
  extends: baseCategoryRenderer,
  name: 'bilibiliMyFavCategoryRenderer',
  data () {
    const { category } = this
    return {
      mid: category.mid,
      /**
       * id: , fid: , mid: , attr: , title:
       */
      folders: []
    }
  },
  methods: {
    loadMore () {},
    async getUserCreatedFavFolder () {
      const { mid } = this
      const folders = await bilibiliModel.getUserCreatedFavFolder(mid)
      this.folders = folders
    }
  },
  created () {
    this.getUserCreatedFavFolder()
  }
}
</script>
