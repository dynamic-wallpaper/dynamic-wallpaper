/* eslint-disable no-unused-vars */
/**
 * 视频服务，播放服务器
 */
import Players from './players'
import createMediaProtocol from './protocol'

let players = null

const categoryMap = new Map()

export function setUrl (url) {
  if (!players) {
    return
  }
  players.setUrl(url)
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
  service.setUrl(defaultUrl)

  return service
}
