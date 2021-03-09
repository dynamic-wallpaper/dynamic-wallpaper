<template>
  <div class="renderer-container">
    <img class="thumbnail" frameborder="no" border="0" scrolling="no" :src="value.thumbnail" />
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
import renderer from './renderer'
export default {
  extends: renderer,
  name: 'videoRenderer'
}
</script>
