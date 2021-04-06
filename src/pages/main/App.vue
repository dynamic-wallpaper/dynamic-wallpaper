<template>
  <el-container id="app">
    <el-aside class="side-bar">
      <el-menu
        :default-active="selected.category"
        @select="selectCategory"
        class="side-bar"
        v-bind="sidebar"
      >
        <el-menu-item :index="category.key" :key="category.key" v-for="category of categories">
          <el-tooltip :content="category.label" class="item" effect="dark" placement="right">
            <div class="category-label">{{ category.label }}</div>
          </el-tooltip>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- <el-header></el-header> -->
      <el-main :key="selected.category" v-if="category">
        <component :is="categoryRenderer" :videos="category.value" class="option-container">
          <el-card
            class="option"
            body-style="padding: 0;height: 100%;"
            shadow="hover"
            slot-scope="{data}"
          >
            <!-- 选中标签 -->
            <div class="selected" v-if="selected.key === data.value">
              <img :src="selectedIcon" />
            </div>
            <!-- 渲染 -->
            <component
              :category="selected.category"
              :is="renderer"
              :selected="selected"
              :value="data"
              @select="selectOption"
            />
          </el-card>
        </component>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import websiteConfig from '@/configs/website'
import selectedIcon from './assets/selected.png'
import throttle from 'lodash/throttle'
// import { UP } from '@/configs/bilibili'
const renderers = require.context('./renderer', false, /\.vue/)
const categorys = require.context('./category', false, /\.vue/)
const { ipcRenderer, serverSDK } = window

export default {
  name: 'App',
  components: Object.assign(
    {},
    // 选择器的渲染器
    Object.fromEntries(renderers.keys().map(key => {
      const component = renderers(key).default
      return [component.name, component]
    })),
    // 分类加载器
    Object.fromEntries(categorys.keys().map(key => {
      const component = categorys(key).default
      return [component.name, component]
    }))
  ),
  data () {
    const vm = this
    return {
      selectedIcon,
      sidebar: {
        backgroundColor: '#6a6da9',
        textColor: '#ffffff',
        activeTextColor: '#6a6da9'
      },
      websiteCategory: websiteConfig,
      mediaCategories: [],
      /**
       * 刷新本地数据
       */
      refreshMediaCategory: throttle(function (e, { progress }) {
        if (progress === 100) {
          vm.getMediaCategories()
        }
      }, 500)
    }
  },
  computed: {
    categories ({ websiteCategory, mediaCategories }) {
      return [
        ...mediaCategories,
        websiteCategory
      ]
    },
    category ({ selected, categories }) {
      return categories.find(item => item.key === selected.category) || {}
    },
    options ({ category }) {
      return category.value || []
    },
    categoryRenderer ({ category }) {
      return category.categoryRenderer || 'baseCategoryRenderer'
    },
    renderer ({ category }) {
      return category.renderer || 'renderer'
    },
    selected: {
      get ({ $store }) {
        return $store.state.selected
      },
      set (selected) {
        this.$store.commit('set:selected', selected)
      }
    }
  },
  methods: {
    async getMediaCategories () {
      const { data } = await serverSDK.get('media/categories')
      this.mediaCategories = data
    },
    selectCategory (category) {
      this.selected = {
        ...this.selected,
        category
      }
    },
    selectOption (key, url) {
      this.selected.key = key
      this.selected.url = url
      ipcRenderer.send('selectResource', key, url)
    }
  },
  async created () {
    // await this.getMediaCategories()
    ipcRenderer.on('media:progress', this.refreshMediaCategory)
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
