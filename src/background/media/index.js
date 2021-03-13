/**
 * 视频服务，播放服务器
 */
import Players from './players'
import createMediaProtocol from './protocol'
import 
import sdk from '@/background/util/sdk'

let players = null

export const RTMP_PORT = 1983
export const PORT = 9031

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
