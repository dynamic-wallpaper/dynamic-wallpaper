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
          <div class="category-label">{{ category.label }}</div>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <control-header v-model="currentUserMid" />
      </el-header>
      <el-main>
        <div :key="selected.category" class="container" v-if="category">
          <component :category="category" :is="categoryRenderer" ref="option-container">
            <div class="option" slot-scope="{ data }">
              <el-card class="option-card" shadow="hover">
                <!-- 选中标签 -->
                <div class="selected" v-if="selected.key === data.value">
                  <img :src="selectedIcon" alt="selected" />
                </div>
                <!-- 渲染 -->
                <component
                  :category="selected.category"
                  :is="renderer"
                  :selected="selected"
                  :value="data"
                  @select="selectOption"
                  ref="optionCard"
                />
              </el-card>
            </div>
          </component>
        </div>
      </el-main>
      <!-- <el-footer></el-footer> -->
    </el-container>
  </el-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import websiteConfig from '@/configs/website'
import selectedIcon from './assets/selected.png'
import throttle from 'lodash/throttle'
import { UP } from '@/configs/bilibili'
import ControlHeader from './ControlHeader'
const renderers = require.context('./renderer', false, /\.vue/)
const categorys = require.context('./category', false, /\.vue/)
const { ipcRenderer, serverSDK } = window

export default {
  name: 'App',
  components: Object.assign(
    {
      ControlHeader
    },
    // 选择器的渲染器
    Object.fromEntries(
      renderers.keys().map(key => {
        const component = renderers(key).default
        return [component.name, component]
      })
    ),
    // 分类加载器
    Object.fromEntries(
      categorys.keys().map(key => {
        const component = categorys(key).default
        return [component.name, component]
      })
    )
  ),
  data () {
    const vm = this
    return {
      currentUserMid: '', // 当前用户在b站的mid
      selectedIcon,
      sidebar: {
        backgroundColor: '#6a6da9',
        textColor: '#ffffff',
        activeTextColor: '#6a6da9'
      },
      websiteCategory: websiteConfig,
      /**
       * 代理下发所有的更新事件
       */
      updateCategoryVideoProgress: throttle(function (e, data) {
        /**
         * 获取card列表，目前ref不可用
         */
        const container = vm.$refs['option-container']
        const optionCards = container.$children.map(card => card.$children[0])
        optionCards.forEach(item => {
          if (item.onMediaProgress) {
            item.onMediaProgress(e, data)
          }
        })
      }, 200)
    }
  },
  computed: {
    categories ({ websiteCategory, currentUserMid }) {
      const categories = [
        // b站的标签
        ...Object.entries(UP).map(([label, mid]) => ({
          label,
          key: `bilibiliUp${mid}`,
          renderer: 'videoRenderer',
          categoryRenderer: 'bilibiliCategoryRenderer'
        })),
        websiteCategory
      ]

      if (currentUserMid) {
        categories.push({
          label: '我的收藏',
          mid: currentUserMid,
          key: `bilibiliUser:${currentUserMid}`,
          renderer: 'videoRenderer',
          categoryRenderer: 'bilibiliMyFavCategoryRenderer'
        })
      }

      return categories
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
  watch: {
    categories (categories) {
      const category = this.category
      if (categories.length === 0) {
        return 0
      }
      if (!category || !categories.find(({ key }) => category.key === key)) {
        const firstCategory = categories[0]
        this.selectCategory(firstCategory)
      }
    }
  },
  async destroyed () {
    ipcRenderer.off('media:progress', this.updateCategoryVideoProgress)
  },
  async created () {
    ipcRenderer.on('media:progress', this.updateCategoryVideoProgress)
  }
}
</script>

<style lang="scss">
$option-card-width: 260px;
$option-card-height: 268px;

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  background: #ffffff;
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
  .container {
    width: 100%;
    height: 100%;
  }
}

.category-label {
  width: 100%;
  overflow: hidden;
  word-break: keep-all;
  text-overflow: ellipsis;
}

.option {
  width: $option-card-width;
  flex-grow: 0;
  height: $option-card-height;
  position: relative;
  margin: 8px;

  .el-card__body {
    padding: 0;
    height: 100%;
    min-height: $option-card-height;
    position: relative;
    width: 100%;
    overflow: visible;
    display: flex;
    flex-direction: column;
  }

  .option-card {
    $scale: 1.05;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    height: 100%;
    &:hover {
      transform: scale($scale);
      min-height: 100%;
      height: auto;
      position: absolute;
      z-index: 2;
    }
  }

  .selected {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
