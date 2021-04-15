import Ffmpeg from './ffmpeg'
import { decodeUrl } from './protocol'

let players = null

const sendToPlayers = function (frame) {
  if (!players) {
    return 0
  }
  players.sendFrame(frame)
}

const context = {
  current: null,
  next: null
}

/**
 *
 * @param {string} url
 * @param {*} onFrameLoad
 * @returns {ffmpeg.FfmpegCommand}
 */
const loadVideo = function (url) {
  console.log(url)
  const fileUrl = decodeUrl(url)
  const ffInstance = new Ffmpeg(fileUrl, function (data) {
    sendToPlayers(data)
  }, true)
  setTimeout(() => {
    ffInstance.play()
  }, 1000)
  return ffInstance
}

export function setCurrent (url) {
  if (context.current && context.current.fileUrl === url) {
    return 0
  } else {
    if (context.current) {
      context.current.abort()
    }
    context.current = loadVideo(url)
  }
}
export function setNext () {}

export function setPlayers (_players) {
  players = _players
}

export function abort () {
  Object.keys(context).forEach(key => {
    const instance = context[key]
    if (instance) {
      instance.abort()
    }
    context[key] = null
  })
}

export default {
  setCurrent,
  setNext,
  setPlayers,
  abort
}
