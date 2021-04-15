import { protocol as protocolRegister } from 'electron'
import { MEDIA_PROTOCOL } from '@/configs/protocol'
import { BASE_PATH } from '@/background/util/fileManager'
import path from 'path'
import fs from 'fs'

const regexp = /(?<protocol>.*):\/\/(?<url>.*)/

/**
 * 解码url
 * @param {string} sourceUrl
 * @param {Regexp} regexp
 * @param {string} basePath
 * @returns {string}
 */
export const decodeUrl = function (sourceUrl = '') {
  const { protocol, url } = (regexp.exec(sourceUrl) || {}).groups || {}
  const basePath = protocol === MEDIA_PROTOCOL ? BASE_PATH : ''
  // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
  const filePath = path.join(basePath, ...decodeURI(url).split('/'))
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

/**
 * 注册文件路径
 * @param {string} protocol
 * @param {string} basePath
 */
export function registerProtocol (protocol) {
  protocolRegister.registerFileProtocol(protocol,
    (request, callback) => {
      const url = decodeUrl(request.url)
      callback(url)
    })
}

export default registerProtocol
