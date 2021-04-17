<template>
  <div class="control-header">
    <div>
      <!-- 订阅管理 -->
      <div></div>

      <!-- 循环 -->
    </div>

    <div>
      <!-- 登陆页面 -->
      <el-popover :width="cookie ? 200 : 500" placement="bottom-end" ref="popover">
        <!-- 未登录显示webview -->
        <webview ref="webview" style="height: 600px;" :src="src" v-if="!cookie"></webview>
        <div v-else>
          <el-popconfirm title="确定切换用户吗吗？" @confirm="logout">
            <el-button type="text" slot="reference">切换用户</el-button>
          </el-popconfirm>
        </div>
        <!-- 占位 -->
        <div class="control-item" slot="reference">
          <div class="avatar">
            <img
              v-if="bilibiliUserInfo.avatar"
              :src="bilibiliUserInfo.avatar"
              referrerpolicy="no-referrer"
              alt="avatar"
            />
            <em v-else class="el-icon-user-solid" />
          </div>
          <span class="username">{{ bilibiliUserInfo.userName || '登录' }}</span>
        </div>
      </el-popover>
    </div>
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
        mid: '',
        avatar: '',
        userName: ''
      },
      async loginHandler () {
        const { data } = await serverSDK.get(
          'cookie',
          'https://www.bilibili.com'
        )
        vm.$refs.popover.doClose()
        vm.cookie = data
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
  methods: {
    logout () {
      this.bilibiliUserInfo.avatar = ''
      this.bilibiliUserInfo.userName = ''
      this.cookie = ''
    }
  },
  watch: {
    cookie: {
      immediate: true,
      async handler (cookie) {
        // 已登陆，自动获取最新用户名信息
        if (cookie) {
          // 移除webview
          const webview = this.$refs.webview
          if (webview) {
            webview.removeEventListener('will-navigate', this.loginHandler)
          }
          const { data } = await bilibiliModel.getMyInfo(cookie)
          const { name, face, mid } = data
          this.bilibiliUserInfo.mid = mid
          this.bilibiliUserInfo.avatar = face
          this.bilibiliUserInfo.userName = name
        } else {
          this.bilibiliUserInfo.mid = ''
          this.bilibiliUserInfo.avatar = ''
          this.userName = ''
          // 未登录，自动加载方法去监听cookie
          this.$nextTick(() => {
            const webview = this.$refs.webview
            webview.addEventListener('will-navigate', this.loginHandler)
          })
        }
        this.$emit('input', this.bilibiliUserInfo.mid)
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
  justify-content: space-between;

  .control-item {
    display: flex;
    align-items: center;
    height: 100%;

    & + .control-item {
      margin-left: 8px;
    }
  }

  $avatar-size: 22px;

  .avatar {
    cursor: pointer;
    border-radius: 100px;
    overflow: hidden;
    width: $avatar-size;
    height: $avatar-size;
    margin-right: 6px;
    background: #909399;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
    em {
      color: #ffffff;
      font-size: 16px;
    }
  }

  .username {
    color: #606266;
    font-size: 14px;
  }
}
</style>
