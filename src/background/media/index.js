/**
 * 视频服务，播放服务器
 */
import Players from './players'
// import NodeMediaServer from 'node-media-server'
// import ffmpegStatic from 'ffmpeg-static'
// import FFMPEG from 'fluent-ffmpeg'
import createMediaProtocol from './protocol'
// const defaultVideo = `${PROTOCOL}://${__static}/big_buck_bunny.mp4`
let players = null

export const RTMP_PORT = 1983
export const PORT = 9031

// FFMPEG.setFfmpegPath(ffmpegStatic)

/**
 * node-rtmp服务器
 */
// const config = {
//   rtmp: {
//     port: RTMP_PORT,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 30,
//     ping_timeout: 60
//   },
//   http: {
//     port: PORT,
//     allow_origin: '*'
//   }
// };

// var nms = new NodeMediaServer(config)
// nms.run();

export function setUrl (url) {
  if (!players) {
    return
  }
  players.setUrl(url)
}

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
