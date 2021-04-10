import { protocol } from 'electron'
import { MEDIA_PROTOCOL } from '@/configs/protocol'
import { BASE_PATH } from '@/background/util/fileManager'
import path from 'path'
import fs from 'fs'

export const PROTOCOL = MEDIA_PROTOCOL
// eslint-disable-next-line
const regexp = new RegExp(`^${PROTOCOL}:\/\/`)

export const decodeUrl = function (sourceUrl = '') {
  const url = sourceUrl.replace(regexp, '')
  // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
  const filePath = path.join(BASE_PATH, ...decodeURI(url).split('/'))
  try {
    /**
     * 从保存的地方获取
     */
    if (fs.existsSync(filePath)) {
      return filePath
    } else {
      throw new Error('no such file ' + filePath)
    }
  } catch (error) {
    console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    return null
  }
}

export function registerProtocol () {
  protocol.registerFileProtocol(PROTOCOL,
    (request, callback) => {
      callback(decodeUrl(request.url))
    })
}

export default registerProtocol
