<template>
  <el-tabs class="bilibili-my-fav-category" v-if="folders.length > 0" tab-position="left">
    <el-tab-pane
      class="bilibili-my-fav-category"
      lazy
      v-for="folder of folders"
      :key="folder.id"
      :label="folder.title"
    >
      <bilibili-fav-folder-category v-bind="$props" :id="folder.id">
        <template slot-scope="scope">
          <slot v-bind="scope" />
        </template>
      </bilibili-fav-folder-category>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
/**
 * 最基础的分类
 */
import baseCategoryRenderer from './baseCategory'
import bilibiliModel from '@/models/bilibili'
import bilibiliFavFolderCategory from './bilibiliMyFavCategory/bilibiliFavFolderCategory'

export default {
  extends: baseCategoryRenderer,
  name: 'bilibiliMyFavCategoryRenderer',
  components: {
    bilibiliFavFolderCategory
  },
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
<style lang="scss" scoped>
.bilibili-my-fav-category {
  height: 100%;
  &::v-deep .el-tabs__content {
    height: 100%;
  }
}
</style>
