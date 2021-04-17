<template>
  <div class="renderer-container">
    <div class="thumbnail">
      <iframe :src="value.value" border="0" frameborder="no" scrolling="no" />
    </div>
    <div class="control-container">
      <div class="control-description">
        <label>{{ value.label }}</label>
        <div class="description">{{ value.description }}</div>
      </div>
      <div class="control-button">
        <el-button :disabled="isSelected" @click="select" size="mini" type="text">设为壁纸</el-button>
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
    },
    eventBus: {
      type: Object
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
  flex: 1;

  .thumbnail {
    background: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 148px;
    pointer-events: none;
    overflow: hidden;
    flex-shrink: 0;
    & > * {
      min-width: 100%;
      width: 100%;
      max-height: 100%;
    }
  }

  .control-container {
    position: relative;
    flex: 1;
    padding: 8px;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    max-height: 100%;
    overflow: visible;
  }

  .control-description {
    transition: height 0.1s linear;
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

  &:hover {
    .control-description {
      height: fit-content;
      max-height: 230px;
      label {
        overflow: visible;
        word-break: break-all;
        -webkit-line-clamp: initial;
      }

      .description {
        flex: 1;
        height: 100%;
        overflow: auto;
        word-break: break-all;
        -webkit-line-clamp: initial;
      }
    }

    .control-button {
      background: rgba(0, 0, 0, 0.5);
    }
  }

  .control-button {
    // padding: 4px;
    // box-sizing: border-box;
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    top: -28px;
    left: 0;
    padding: 0 4px;
    box-sizing: border-box;
    * {
      color: #ffffff;
      text-shadow: 0px 0px 3px #000000;
      &.is-disabled {
        color: #c0c4cc;
        &:hover,
        &:focus {
          color: #c0c4cc;
        }
      }
    }
  }
}
</style>
