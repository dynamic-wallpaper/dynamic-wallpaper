/* eslint-disable no-unused-vars */
/**
 * 视频服务，播放服务器
 */
import Players from './players'
import createMediaProtocol from './protocol'
import mediaService from './mediaServer'
import { MEDIA_PROTOCOL, LOCOL_FILE_PROTOCOL } from '@/configs/protocol'
import FileManager from '../util/fileManager'

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
    case LOCOL_FILE_PROTOCOL: {
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
  setUrl,
  /**
   *
   * @param {string} category
   * @returns {FileManager}
   */
  getCategory (category) {
    if (category) {
      if (!categoryMap.has(category)) {
        categoryMap.set(category, new FileManager(category))
      }
      return categoryMap.get(category)
    }
  },
  setCategory (category, fileManager) {
    return categoryMap.set(category, fileManager)
  },
  hasCategory (category) {
    return categoryMap.has(category)
  },
  deleteCategory (category) {
    if (category) {
      return categoryMap.delete(category)
    }
    return 0
  }
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
  createMediaProtocol(MEDIA_PROTOCOL)
  // 本地文件用的url
  createMediaProtocol(LOCOL_FILE_PROTOCOL)

  players = new Players()
  mediaService.setPlayers(players)
  service.setUrl(defaultUrl)

  return service
}
