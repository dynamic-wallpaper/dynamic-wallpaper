<template>
  <div class="renderer-container">
    <iframe class="thumbnail" frameborder="no" border="0" scrolling="no" :src="value.value" />
    <div class="control-container">
      <div class="control-description">
        <label>{{ value.label }}</label>
        <div class="description">{{ value.description }}</div>
      </div>
      <div class="control-button">
        <el-button :disabled="isSelected" type="text" size="mini" @click="select">设为壁纸</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'renderer',
  props: {
    selected: {
      type: Object,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    category: {
      type: String
    }
  },
  data () {
    return {}
  },
  computed: {
    isSelected ({ selected, value }) {
      return selected.key === value.value
    }
  },
  methods: {
    select () {
      this.$emit('select', this.value.value, this.value.value)
    }
  }
}
</script>

<style scoped lang="scss">
.renderer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  // transition: height 1s linear;

  .thumbnail {
    width: 100%;
    height: 140px;
    pointer-events: none;
  }

  .control-container {
    padding: 8px;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    max-height: 100%;
    overflow: hidden;
  }

  .control-description {
    flex: 1;
    width: 100%;
    outline: 0;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    label {
      font-weight: 500;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;
    }

    .description {
      font-size: 14px;
      line-height: 20px;
      word-break: keep-all;
      color: #aaaaaa;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;
    }
  }

  .control-button {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
  }

  &:hover {
    height: 330px;

    .control-description {
      label {
        overflow: initial;
        -webkit-line-clamp: initial;
      }

      .description {
        flex: 1;
        height: 100%;
        overflow: scroll;
        -webkit-line-clamp: initial;
      }
    }
  }
}
</style>
