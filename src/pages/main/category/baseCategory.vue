<template>
  <div>
    <template v-for="item of list">
      <slot :data="item" />
    </template>
  </div>
</template>

<script>
/**
 * 最基础的分类
 */
export default {
  name: 'baseCategoryRenderer',
  props: {
    videos: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      list: this.videos
    }
  }
}
</script>
