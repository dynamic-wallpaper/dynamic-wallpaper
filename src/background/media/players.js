import { screen } from 'electron'
import createBrowser from '../util/browser'
const isDevelopment = process.env.NODE_ENV !== 'production'

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

  async createPlayer (display) {
    const { bounds, id } = display
    const { x, y, width, height } = bounds

    const winConfig = {
      width,
      height,
      x,
      y,
      frame: false,
      transparent: true,
      resizable: false,
      type: 'desktop'
    }

    if (isDevelopment) {
      delete winConfig.type
      delete winConfig.transparent
    }

    const win = await createBrowser('player', winConfig)
    win.setIgnoreMouseEvents(!isDevelopment)
    this.playerMap.set(id, win)
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

    screen.on('display-metrics-changed', event, display => {
      this.destoryPlayer(display)
      this.createPlayer(display)
    })
    this.inited = true

    const displays = screen.getAllDisplays()
    return Promise.all(displays.map(display => this.createPlayer(display)))
  }

  async setUrl (url) {
    const { playerMap } = this
    if (playerMap.size === 0) {
      await this.createPlayers()
    }
    for (const win of playerMap.values()) {
      win.webContents.send('setUrl', url)
    }
  }
}
