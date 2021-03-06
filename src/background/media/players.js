import { screen } from 'electron'
import createBrowser from '../util/browser'

export const players = new Map()

/**
 * 创建所有播放器
 */
export function createPlayers () {
  const displays = screen.getAllDisplays()
  displays.forEach(display => createPlayer(display))
}

/**
 *
 * @param { Electron.Display } display
 */
export async function createPlayer (display) {
  const { workAreaSize, bounds, id } = display
  const { x, y } = bounds
  const { width, height } = workAreaSize
  const win = await createBrowser('player', { width, height, x, y })
  players.set(id, win)
}

export default createPlayers
