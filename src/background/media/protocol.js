import { protocol } from 'electron'
import { MEDIA_PROTOCOL } from '@/configs/protocol'
import { BASE_PATH } from '@/background/util/fileManager'
import path from 'path'
import fs from 'fs'

export const PROTOCOL = MEDIA_PROTOCOL
// eslint-disable-next-line
const regexp = new RegExp(`^${PROTOCOL}:\/\/`)

export function registerProtocol () {
  protocol.registerFileProtocol(PROTOCOL, (request, callback) => {
    const url = request.url.replace(regexp, '')
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
    try {
      /**
       * 从保存的地方获取
       */
      const filePath = path.join(BASE_PATH, decodedUrl)
      if (fs.existsSync(filePath)) {
        callback(filePath)
      } else {
        throw new Error('no such file' + filePath)
      }
    } catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    }
  })
}

export default registerProtocol
