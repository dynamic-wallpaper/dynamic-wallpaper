# 动态视频壁纸

基于`Electron`实现的一个MAC免费壁纸软件
支持使用网页

![Demo](./demo.jpg)

## 目前进度

目前仍在开发阶段，勉强可用

### 功能

- [x] 支持播放视频
- [x] 支持使用网页作为背景
- [x] 从后台下载视频到本地作为壁纸
- [x] 下载完成后通知
- [x] 开机自启动功能
- [x] 修复播放器位置偏移
- [x] 壁纸部分统一管理播放暂停等状态
- [x] 支持解析b站视频作为背景视频
- [x] 从本地读取视频作为背景
- [ ] 支持静态壁纸
- [ ] 支持视频排序播放
- [ ] 支持自动暂停
- [ ] 支持视频根据外部条件响应播放
- [x] 支持b站我的收藏
- [ ] 支持加载频道的时候将已经下载的视频提前
- [ ] 播放窗口销毁/ffmpeg进程退出问题捕获
- [ ] 增加网页壁纸窗口，增加订阅方案（待开仓库）
- [ ] 自定义b站订阅up主
- [ ] 检查为何下载视频会卡住

### 急需优化

- [x] ffmpeg支持gpu解码
- [ ] ffmpeg解码数据优化清晰度
- [ ] 适配宽高适配规则更新
- [ ] 多p视频下载规则更新，支持多p视频（b站分p信息只能一个个获取，看情况增加下载分p自动获取方案改为优先匹配分辨率）
- [ ] 下载视频分辨率提示，目前为取用户能下载的最高水平
- [ ] 从develop中移除开机自启动

## 实现原理

主要还是ffmpeg解析然后传递给播放页播放，支持了一定的b站api

### 控制部分

- element-ui
- 基于electron-store缓存状态

### 播放部分

- `electron browser window`创建的时候指定type为(window)
- 监听`electron.screen`相关事件，创建多个窗口到对应位置
- 统一管理，设置对应链接和对应`renderer`
