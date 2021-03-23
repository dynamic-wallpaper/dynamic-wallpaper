# 动态视频壁纸

基于`Electron`实现的一个跨端免费壁纸软件

![Demo](./demo.jpg)

## 目前进度

- [x] 支持播放视频
- [x] 支持使用网页作为背景
- [x] 从后台下载视频到本地作为壁纸
- [x] 下载完成后通知
- [x] 开机自启动功能
- [ ] 修复播放器位置偏移
- [ ] 壁纸部分统一管理播放暂停等状态
- [ ] 支持解析b站视频作为背景视频
- [ ] 从本地读取视频作为背景
- [ ] 支持静态壁纸
- [ ] 支持视频排序播放
- [ ] 支持自动暂停
- [ ] 支持视频根据外部条件响应播放

## 实现原理

### 控制部分

- element-ui
- 基于electron-store缓存状态

### 播放部分

- `electron browser window`创建的时候指定type为(window)
- 监听`electron.screen`相关事件，创建多个窗口到对应位置
- 统一管理，设置对应链接和对应`renderer`
