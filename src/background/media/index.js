/* eslint-disable no-unused-vars */
/**
 * 视频服务，播放服务器
 */
import Players from './players'
import createMediaProtocol from './protocol'
import mediaService from './mediaServer'

let players = null

const categoryMap = new Map()

export function setUrl (url) {
  if (!players) {
    return
  }
  mediaService.setCurrent(url)
  players.setUrl('')
  // players.setUrl(url)
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
  createMediaProtocol()
  players = new Players()
  mediaService.setPlayers(players)
  service.setUrl(defaultUrl)

  return service
}
