import { screen, ipcMain, BrowserWindow } from 'electron'
import createBrowser from '@/background/util/browser'
import { OFFSET } from '@/configs/players'
const isDevelopment = process.env.NODE_ENV !== 'production'

function setUrl (win, url) {
  const webContents = win instanceof BrowserWindow ? win.webContents : win
  return webContents.send('player:setUrl', url)
}

function sendFrame (win, frame) {
  const webContents = win instanceof BrowserWindow ? win.webContents : win
  return webContents.send('player:frame', frame)
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
    this.isInit = false
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
    // eslint-disable-next-line no-unused-vars
    const { id, workAreaSize, workArea } = display
    const { x, y } = workArea
    const { width, height } = workAreaSize

    /**
     * @type {Electron.BrowserWindowConstructorOptions}
     */
    const winConfig = {
      width,
      height: height + OFFSET * 2,
      x,
      y: y - OFFSET,
      hasShadow: false,
      frame: false,
      transparent: true,
      enableLargerThanScreen: true,
      resizable: false,
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
    if (!this.isInit) {
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

      ipcMain.on('player:getUrl', (e) => {
        setUrl(e.sender, this.url)
      })

      this.isInit = true
    }

    let displays = screen.getAllDisplays()
    for (const playerId of this.playerMap.keys()) {
      const player = this.playerMap.get(playerId)
      player.destroy()
      this.playerMap.delete(playerId)
    }

    if (isDevelopment) {
      displays = [screen.getPrimaryDisplay()]
    }

    return Promise.all(displays.map(display => this.createPlayer(display)))
  }

  async sendFrame (frame) {
    const { playerMap } = this
    if (playerMap.size === 0) {
      await this.createPlayers()
    }
    for (const win of playerMap.values()) {
      if (win.isDestroyed()) {
        continue
      }
      sendFrame(win, frame)
    }
  }

  async setUrl (url) {
    const { playerMap } = this
    if (playerMap.size === 0) {
      await this.createPlayers()
    }
    for (const win of playerMap.values()) {
      setUrl(win, url)
    }
    this.url = url
  }
}
