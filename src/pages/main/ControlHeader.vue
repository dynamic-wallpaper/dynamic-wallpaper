<template>
  <div class="control-header">
    <!-- 循环 -->

    <!-- 登陆页面 -->
    <el-popover width="500" placement="bottom-end" ref="popover">
      <!-- 未登录显示webview -->
      <webview
        ref="webview"
        style="height: 600px;"
        :src="src"
        v-if="!cookie"
      ></webview>
      <div v-else>已登陆</div>
      <!-- 占位 -->
      <div class="control-item" slot="reference">
        <el-avatar
          size="small"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
        <span>用户名</span>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { LOGIN_URL } from '@/configs/bilibili'
import bilibiliModel from '@/models/bilibili'
const { serverSDK } = window

export default {
  data () {
    const vm = this
    return {
      src: LOGIN_URL,
      bilibiliUserInfo: {
        avatar: '',
        userName: ''
      },
      async loginHandler () {
        const cookie = await serverSDK.get('cookie', 'http://www.bilibili.com')
        vm.$refs.popover.doClose()
        vm.cookie = cookie
      }
    }
  },
  computed: {
    cookie: {
      get () {
        return this.$store.state.cookie
      },
      set (cookie) {
        this.$store.commit('set:cookie', cookie)
      }
    }
  },
  watch: {
    cookie: {
      immediate: true,
      handler (cookie) {
        // 已登陆，自动获取最新用户名信息
        if (cookie) {
          // 移除webview
          const webview = this.$refs.webview
          if (webview) {
            webview.removeEventListener('will-navigate', this.loginHandler)
          }
          bilibiliModel.getMyInfo(cookie).then(data => {
            console.log(data)
          })
        } else {
          // 未登录，自动加载方法去监听cookie
          this.$nextTick(() => {
            const webview = this.$refs.webview
            webview.addEventListener('will-navigate', this.loginHandler)
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.control-header {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 4px 18px;
  border-bottom: 1px solid #eeeeee;
  box-sizing: border-box;
  justify-content: flex-end;

  .control-item {
    display: flex;
    align-items: center;
    height: 100%;

    & + .control-item {
      margin-left: 8px;
    }
  }
}
</style>
