<template>
  <el-container id="app">
    <el-aside class="side-bar">
      <el-menu
        @select="key => targetCategory = key"
        v-bind="sidebar"
        :default-active="targetCategory"
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
      <el-main :key="targetCategory">
        <div class="option-container">
          <el-card class="option" shadow="hover" v-for="(option, index) of options" :key="index">
            <component :is="renderer" :value="option" />
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import websiteConfig from '@/configs/website'
const renderers = require.context('./components', false, /\.vue/)

export default {
  name: 'App',
  components: {
    ...Object.fromEntries(renderers.keys().map(key => {
      const component = renderers(key).default
      return [component.name, component]
    }))
  },
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
      targetCategory: websiteConfig.key
    }
  },
  computed: {
    category ({ targetCategory, categories }) {
      return categories.find(item => item.key === targetCategory) || {}
    },
    options ({ category }) {
      return category.value || []
    },
    renderer ({ category }) {
      return category.renderer || 'renderer'
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
  max-width: 140px !important;
}

.side-bar .el-menu-item.is-active {
  background: #ffffff !important;
}

.option-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
}

.option {
  width: 200px;
  flex-grow: 0;
  height: 200px;
}

.option + .option {
  margin-left: 20px;
}
</style>
