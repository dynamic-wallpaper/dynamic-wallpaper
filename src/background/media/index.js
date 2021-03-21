/* eslint-disable no-unused-vars */
/**
 * 视频服务，播放服务器
 */
import Players from './players'
import createMediaProtocol from './protocol'
import FileManager from '@/background/util/fileManager'
import videoModel from '@/models/video'
import sdk from '@/background/util/sdk'

let players = null

const categoryMap = new Map()

export function setUrl (url) {
  if (!players) {
    return
  }
  players.setUrl(url)
}

sdk.get('mediaCategories', async (req, res) => {
  const categories = await videoModel.getCategories()
  /**
   * 创建category对应的文件
   */
  categories.forEach(category => {
    if (!categoryMap.has(category.key)) {
      categoryMap.set(category.key, new FileManager(category.key))
    }
    const fileManager = categoryMap.get(category.key)
    console.log('structure', fileManager.structure)
  })
  res.send(categories)
})

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
