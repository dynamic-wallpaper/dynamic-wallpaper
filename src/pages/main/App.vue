<template>
  <el-container id="app">
    <el-aside class="side-bar">
      <el-menu
        @select="key => currentCategory = key"
        v-bind="sidebar"
        :default-active="currentCategory"
        class="side-bar"
      >
        <el-menu-item
          :key="category.key"
          :index="category.key"
          v-for="category of categories"
        >{{ category.label }}</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- <el-header></el-header> -->
      <el-main></el-main>
    </el-container>
  </el-container>
</template>

<script>
import websiteConfig from '@/configs/website'
export default {
  name: 'App',
  data () {
    return {
      sidebar: {
        backgroundColor: '#6a6da9',
        textColor: '#ffffff',
        activeTextColor: '#6a6da9'
      },
      categories: [
        websiteConfig
      ],
      currentCategory: websiteConfig.key
    }
  }
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
}

.side-bar {
  height: 100%;
  max-width: 200px !important;
}

.side-bar .el-menu-item.is-active {
  background: #ffffff !important;
}
</style>
