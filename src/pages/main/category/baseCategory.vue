<template>
  <div v-infinite-scroll="loadMore">
    <template v-if="list.length > 0">
      <template v-for="item of list">
        <slot :data="item" />
      </template>
    </template>
    <div v-else class="empty">
      <em class="el-icon-box" />暂无内容,敬请期待
    </div>
  </div>
</template>

<script>
/**
 * 最基础的分类
 */
export default {
  name: 'baseCategoryRenderer',
  props: {
    category: {
      type: Object,
      default () {
        return {
          key: '',
          value: [],
          label: ''
        }
      }
    }
  },
  data () {
    const defaultValue = this.category.value || []
    return {
      list: [...defaultValue]
    }
  },
  methods: {
    loadMore () {}
  }
}
</script>
<style scoped>
.empty {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  color: #303133;
  font-size: 18px;
}

.empty em {
  font-size: 24px;
}
</style>
