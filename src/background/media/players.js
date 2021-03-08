import { screen } from 'electron'
import createBrowser from '@/background/util/browser'
const isDevelopment = process.env.NODE_ENV !== 'production'

function setUrl (win, url) {
  return win.webContents.send('setUrl', url)
}

/**
 * 播放器列表
 */
export default class Players {
  constructor () {
    /**
     * @type {Map<number, Electron.BrowserWindow>} playerMap
     */
    this.playerMap = new Map()
    this.inited = false
    this.url = ''
  }

  /**
 *
 * @param {Electron.Display} display
 */
  destoryPlayer (display) {
    const { playerMap } = this
    const { id } = display
    if (playerMap.has(id)) {
      playerMap.get(id).destroy()
      playerMap.delete(id)
    }
  }

  /**
   *
   * @param {Electron.Display} display
   * @returns
   */
  async createPlayer (display) {
    const { id, workAreaSize, bounds } = display
    const { x, y } = bounds
    const { width, height } = workAreaSize

    const winConfig = {
      width,
      height,
      x,
      y,
      frame: false,
      transparent: true,
      resizable: false,
      z: 0,
      type: 'desktop'
    }

    if (isDevelopment) {
      delete winConfig.type
      delete winConfig.transparent
    }

    const win = await createBrowser('player.html', winConfig)
    win.setIgnoreMouseEvents(!isDevelopment)
    this.playerMap.set(id, win)
    setUrl(win, this.url)
    return win
  }

  async createPlayers () {
    if (this.inited) {
      return Promise.resolve()
    }

    /**
     * screen变动
     */
    screen.on('display-added', (event, display) => {
      this.createPlayer(display)
    })

    screen.on('display-removed', (event, display) => {
      this.destoryPlayer(display)
    })

    screen.on('display-metrics-changed', (event, display) => {
      this.destoryPlayer(display)
      this.createPlayer(display)
    })
    this.inited = true

    const displays = screen.getAllDisplays()

    // if (isDevelopment) {
    //   displays = [screen.getPrimaryDisplay()]
    // }

    return Promise.all(displays.map(display => this.createPlayer(display)))
  }

  async setUrl (url) {
    const { playerMap } = this
    if (playerMap.size === 0) {
      await this.createPlayers()
    }
    for (const win of playerMap.values()) {
      setUrl(win, url)
    }
  }
}
