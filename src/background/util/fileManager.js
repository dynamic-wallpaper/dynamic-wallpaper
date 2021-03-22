/* eslint-disable no-unused-vars */
/**
 * 本地文件管理
 */
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
const { DownloaderHelper } = require('node-downloader-helper')

export const BASE_PATH = path.join(app.getPath('userData'), 'resource')

if (!fs.existsSync(BASE_PATH)) {
  fs.mkdirSync(BASE_PATH)
}

export default class {
  /**
     *
     * @param {string} directory
     */
  constructor (directory) {
    if (!directory) {
      throw new Error('directory 必须指定')
    }
    this.rootDir = path.join(BASE_PATH, directory)
    if (!fs.existsSync(this.rootDir)) {
      fs.mkdirSync(this.rootDir)
    }
  }

  /**
   * 从地址转真实地址
   * @param {*} filePath
   * @returns
   */
  getFullPath (filePath = '') {
    return path.join(this.basePath, ...filePath.split('/'))
  }

  /**
   * 获取一个文件
   * @param {*} filePath
   * @param {*} readAsString
   * @returns
   */
  getFile (filePath, readAsString = false) {
    if (this.fileIsExist(filePath)) {
      return fs.readFileSync(
        this.getFullPath(filePath),
        readAsString
          ? {
              encoding: 'utf8'
            }
          : null
      )
    } else {
      return null
    }
  }

  /**
   * 删除文件
   * @param {*} filePath
   */
  deleteFile (filePath) {
    if (this.fileIsExist(filePath)) {
      const targetPath = this.getFullPath(filePath)
      if (fs.statSync(targetPath).isDirectory()) {
        if (fs.readdirSync(targetPath).length !== 0) {
          throw new Error('无法直接删除文件夹')
        } else {
          fs.rmdirSync(targetPath)
        }
      } else {
        fs.unlinkSync(targetPath)
      }
    }
  }

  /**
   * url文件
   * @param {*} url
   * @param {*} onProgress
   * @param {*} options
   * @returns
   */
  downloadFile (url, onProgress, options = {}) {
    console.log(url)
    const dl = new DownloaderHelper(encodeURI(url), this.rootDir, {
      override: true,
      fileName: path.basename(url),
      ...options
    })
    dl.start()
    if (onProgress && typeof onProgress === 'function') {
      dl.on('progress.throttled', onProgress)
      dl.on('end', () => onProgress({
        progress: 100
      }))
    }
    return dl
  }

  /**
   * 获取目录结构
   */
  get structure () {
    function getStructure (dirPath) {
      return Object.fromEntries(fs.readdirSync(dirPath)
        .map(subPath => {
          const fullPath = path.join(dirPath, subPath)
          const isDir = fs.statSync(fullPath).isDirectory()
          return [subPath, isDir ? getStructure(fullPath) : fullPath]
        }))
    }
    return getStructure(this.rootDir)
  }

  /**
   * 文件地址
   * @param {string} filePath
   * @returns boolean
   */
  fileIsExist (filePath) {
    const structure = this.structure
    const paths = filePath.split('/')
    // 判断文件是否存在
    return !!paths.reduce(
      (dirStructure, subPath) => dirStructure && dirStructure[subPath],
      structure)
  }
}
