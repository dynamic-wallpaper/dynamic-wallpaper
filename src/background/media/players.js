import { screen } from 'electron'
import createBrowser from '../util/browser'
const isDevelopment = process.env.NODE_ENV !== 'production'

export const players = new Map()

/**
 *
 * @param {Electron.Display} display
 */
function destoryPlayer (display) {
  const { id } = display
  if (players.has(id)) {
    players.get(id).destroy()
    players.delete(id)
  }
}

/**
 * 创建所有播放器
 */
export function createPlayers () {
  const displays = screen.getAllDisplays()
  displays.forEach(display => createPlayer(display))

  /**
   * screen变动
   */
  screen.on('display-added', (event, display) => {
    createPlayer(display)
  })

  screen.on('display-removed', (event, display) => {
    destoryPlayer(display)
  })

  screen.on('display-metrics-changed', event, display => {
    destoryPlayer(display)
    createPlayer(display)
  })
}

/**
 *
 * @param { Electron.Display } display
 */
export async function createPlayer (display) {
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
  players.set(id, win)
}

export default createPlayers
