<template>
  <div class="control-header">
    <!-- 循环 -->

    <!-- 登陆页面 -->
    <el-popover width="500" placement="bottom-end">
      <!-- 未登录显示webview -->
      <webview style="height: 600px;" :src="src"></webview>
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
export default {
  data () {
    return {
      src: LOGIN_URL
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //     this.$refs.webview.addEventListener('will-navigate', () => {
    //       this.$refs.webview.getWebContents().session.cookies.get({url: 'http://www.bilibili.com'}, (err, cookies) => {
    //         this.$store.dispatch({
    //           type: 'UPDATE_COOKIE',
    //           cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';')
    //         })
    //         this.closeLoginModal()
    //       })
    //     })
    //   })
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
