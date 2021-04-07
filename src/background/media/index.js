/* eslint-disable no-unused-vars */
/**
 * 视频服务，播放服务器
 */
import Players from './players'
import createMediaProtocol from './protocol'
import createBilibiliProtocol from './bilibili'
import mediaService from './mediaServer'
import { MEDIA_PROTOCOL } from '@/configs/protocol'

let players = null

const categoryMap = new Map()

export function setUrl (url) {
  if (!players) {
    return
  }
  const protocol = url.replace(/:\/\/.*/, '')
  switch (protocol) {
    case MEDIA_PROTOCOL: {
      mediaService.setCurrent(url)
      players.setUrl('')
      break
    }
    default: {
      mediaService.abort()
      players.setUrl(url)
    }
  }
}

/**
 * 对外输出的service
 */
export const service = {
  categoryMap,
  setUrl
}

/**
 * @param {Electron.App} app
 * @param {import('electron-store')} store
 */
export default function (app, store) {
  if (players) {
    return false
  }
  const defaultUrl = store.get('selected').url
  // 注册获取视频文件的protocol
  createMediaProtocol()
  // 注册自动下载b站文件的protocol
  createBilibiliProtocol()
  players = new Players()
  mediaService.setPlayers(players)
  service.setUrl(defaultUrl)

  return service
}
