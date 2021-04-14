import os from 'os'
import path from 'path'
import EventEmitter from 'events'
import { spawn } from 'child_process'

const SIG = {
  PAUSE: 'SIGSTOP',
  RESUME: 'SIGCONT'
}

const STATUS = {
  ERROR: -1,
  CANPLAY: 0,
  PLAYING: 1,
  PAUSED: 2,
  END: 3,
  STOP: 4
}

const PRESET = {
  ultrafast: 'ultrafast',
  superfast: 'superfast',
  veryfast: 'veryfast',
  faster: 'faster',
  fast: 'fast',
  medium: 'medium',
  slow: 'slow',
  slower: 'slower',
  veryslow: 'veryslow',
  placebo: 'placebo'
}

// const TUNE = {
//   film: 'film',
//   animation: 'animation',
//   grain: 'grain',
//   stillimage: 'stillimage',
//   fastdecode: 'fastdecode',
//   zerolatency: 'zerolatency'
// }

/**
 * 因为返回的data不完整，需要拼接
 */
const SOI = Buffer.from([0xff, 0xd8])
const EOI = Buffer.from([0xff, 0xd9])

const platofrm = os.platform()
const arch = os.arch()
const basePath = path.join(__static, '..', 'ffmpeg')

const ffmpegPath = path.join(basePath, `${platofrm}-${arch}`, `ffmpeg${platofrm === 'win32' ? '.exe' : ''}`)

export default class Ffmpeg {
  constructor (filePath, onFrame, loop = false) {
    this.status = STATUS.CANPLAY
    this.filePath = filePath
    this.loop = loop
    this.chunks = []
    this.commands = [
      '-re', // 实时输出
      '-hwaccel', 'videotoolbox', // gpu加速
      '-i', filePath, // 输入
      // '-vf', 'scale=2560*1440',
      '-b:v', '10000k',
      // '-tune', TUNE.animation,
      '-preset', PRESET.ultrafast, // 快速解码
      '-f', 'image2pipe', // 强制为图片输出
      '-threads', 1, // 多线程
      'pipe:1'
    ]
    console.log('ffmpeg----------------')
    console.info(ffmpegPath, this.commands.map(item => ('' + item).replace(' ', '\\ ')).join(' '))
    console.log('----------------')

    this.process = null
    this.events = new EventEmitter()

    this.onFrame = onFrame || function (frame) {
      console.info(frame)
    }
  }

  /**
   * 将读取的自动合成成图片发送
   * @param {*} chunk
   */
  handleFfmpegOutputData (chunk) {
    const chunks = this.chunks
    const eoiPos = chunk.indexOf(EOI)
    const soiPos = chunk.indexOf(SOI)
    if (eoiPos === -1) {
      // No EOI - just append to chunks.
      chunks.push(chunk)
    } else {
      // EOI is within chunk. Append everything before EOI to chunks
      // and send the full frame.
      const part1 = chunk.slice(0, eoiPos + 2)
      if (part1.length) {
        chunks.push(part1)
      }
      if (chunks.length) {
        this.generateFrame(chunks)
      }
      // Reset chunks.
      chunks.splice(0)
    }
    if (soiPos > -1) {
      chunks.splice(0)
      const part2 = chunk.slice(soiPos)
      chunks.push(part2)
    }
  }

  generateFrame (frameChunks) {
    const bufferData = Buffer.concat([...frameChunks])
    this.onFrame(bufferData)
  }

  play () {
    switch (this.status) {
      case STATUS.CANPLAY: {
        this.process = spawn(ffmpegPath, this.commands)
        this.process.stdout.on('data', (data) => {
          this.handleFfmpegOutputData(data)
        })
        this.process.on('error', () => {
          this.status = STATUS.ERROR
        })
        this.process.on('exit', () => {
          this.events.emit('ended')
          if (this.status !== STATUS.STOP) {
            this.status = STATUS.END
            if (this.loop) {
              this.play()
            }
          }
        })
        this.status = STATUS.PLAYING
        break
      }
      case STATUS.END: {
        this.status = STATUS.CANPLAY
        this.play()
        break
      }
      case STATUS.STOP: {
        this.status = STATUS.CANPLAY
        this.play()
        break
      }
      case STATUS.PAUSED: {
        this.resume()
        break
      }
    }
  }

  pause () {
    if (this.status === STATUS.PLAYING) {
      this.process.kill(SIG.PAUSE)
      this.status = STATUS.PAUSED
    }
  }

  resume () {
    if (this.status === STATUS.PAUSED) {
      this.process.kill(SIG.RESUME)
      this.status = STATUS.PLAYING
    }
  }

  abort () {
    this.status = STATUS.STOP
    spawn('kill', [this.process.pid])
  }
}
