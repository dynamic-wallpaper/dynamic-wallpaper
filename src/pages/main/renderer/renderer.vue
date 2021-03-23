<template>
  <div class="renderer-container">
    <iframe class="thumbnail" frameborder="no" border="0" scrolling="no" :src="value.value" />
    <div class="control-container">
      <el-popover
        class="control-description"
        placement="top"
        :title="value.label"
        width="300"
        trigger="hover"
      >
        <div slot="reference" class="control-description">
          <label>{{ value.label }}</label>
          <div class="description">{{ value.description }}</div>
        </div>
        <p>{{ value.description }}</p>
      </el-popover>
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

<style scoped>
.renderer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.thumbnail {
  width: 100%;
  height: 140px;
  pointer-events: none;
}

.control-container {
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.control-description {
  flex: 1;
  width: 100%;
  outline: 0;
}

.control-button {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
}

.control-description label {
  font-weight: 500;
}

.control-description .description {
  font-size: 14px;
  line-height: 20px;
  word-break: keep-all;
  text-overflow: ellipsis;
  color: #aaaaaa;
  overflow: hidden;
}
</style>
