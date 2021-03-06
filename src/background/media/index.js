/**
 * 视频服务，播放服务器
 */
import initPlayers, { players } from './players'
// import NodeMediaServer from 'node-media-server'
// import ffmpegStatic from 'ffmpeg-static'
// import FFMPEG from 'fluent-ffmpeg'
const defaultVideo = 'app://big_buck_bunny.mp4'

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

export default {
  PORT,
  RTMP_PORT,
  play () {},
  pause () {},
  setUrl (url = defaultVideo) {
    // 初始化，需要在app.ready做
    if (players.size === 0) {
      initPlayers()
    }

    for (const win of players.values()) {
      const { webContents } = win
      console.log(webContents)
    }
    // const command = FFMPEG(url)
    // .videoCodec('copy')
    // .audioCodec('copy')
    // .output(`rtmp://127.0.0.1:${RTMP_PORT}/live/a`)
    // .run()
    // console.log(command)
  }
}
