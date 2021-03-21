<template>
  <el-container id="app">
    <el-aside class="side-bar">
      <el-menu
        @select="selectCategory"
        v-bind="sidebar"
        :default-active="targetCategory"
        class="side-bar"
      >
        <el-menu-item :key="category.key" :index="category.key" v-for="category of categories">
          <el-tooltip class="item" effect="dark" :content="category.label" placement="right">
            <div class="category-label">{{ category.label }}</div>
          </el-tooltip>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- <el-header></el-header> -->
      <el-main :key="targetCategory">
        <div class="option-container">
          <el-card
            :class="{option: true}"
            body-style="padding: 0;height: 100%;"
            shadow="hover"
            v-for="(option, index) of options"
            :key="index"
          >
            <!-- 选中标签 -->
            <div v-if="selected.key === option.value" class="selected">
              <img :src="selectedIcon" />
            </div>
            <!-- 渲染 -->
            <component :selected="selected" @select="selectOption" :is="renderer" :value="option" />
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import websiteConfig from '@/configs/website'
import selectedIcon from './assets/selected.png'
const renderers = require.context('./components', false, /\.vue/)
const { ipcRenderer, serverSDK } = window

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
      selectedIcon,
      sidebar: {
        backgroundColor: '#6a6da9',
        textColor: '#ffffff',
        activeTextColor: '#6a6da9'
      },
      categories: [
        websiteConfig
      ],
      targetCategory: '',
      selected: {
        url: '',
        key: ''
      }
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
  },
  methods: {
    selectCategory (targetCategory) {
      this.targetCategory = targetCategory
      ipcRenderer.send('selectCategory', targetCategory)
    },
    selectOption (key, url) {
      this.selected.key = key
      this.selected.url = url
      ipcRenderer.send('selectResource', key, url)
    }
  },
  async created () {
    const { data } = await serverSDK.get('mediaCategories')
    this.categories = [
      ...data,
      ...this.categories
    ]
  },
  async mounted () {
    ipcRenderer.on('selected', (e, key = '', url = '', category = '') => {
      this.selected = {
        key,
        url
      }
      this.targetCategory = category || this.categories[0].key
    })
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

.el-main {
  background: #ffffff;
}

.category-label {
  width: 100%;
  overflow: hidden;
  word-break: keep-all;
  text-overflow: ellipsis;
}

.option-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
}

.option {
  width: 260px;
  flex-grow: 0;
  height: 220px;
  position: relative;
  margin: 8px;
}

.option .selected {
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 20px;
}

.option .selected img {
  width: 100%;
  height: 100%;
}
</style>
