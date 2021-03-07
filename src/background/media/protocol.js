import { protocol } from 'electron'
import { MEDIA_PROTOCOL } from '@/configs/protocol'

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
      return callback(decodedUrl)
    } catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    }
  })
}

export default registerProtocol
