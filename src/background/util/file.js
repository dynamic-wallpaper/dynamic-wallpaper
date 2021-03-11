/* eslint-disable no-unused-vars */
/**
 * 本地文件管理
 */
import fs, { fstatSync } from 'fs'
import path from 'path'
import { app } from 'electron'
const { DownloaderHelper } = require('node-downloader-helper')

const basePath = app.getPath('userData')

export default class {
  /**
     *
     * @param {string} directory
     */
  constructor (directory) {
    if (!directory) {
      throw new Error('directory 必须指定')
    }
    this.rootDir = path.join(basePath, directory)
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
      if (fstatSync(targetPath).isDirectory()) {
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

  downloadFile (url, onProgress, options) {
    const dl = new DownloaderHelper('url', this.rootDir)
    dl.start()
    if (onProgress && typeof onProgress === 'function') {
      dl.on('progress.500', onProgress)
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
    function getStructure (dirPath = this.rootDir) {
      return Object.fromEntries(fs.readdirSync(dirPath)
        .map(subPath => {
          const fullPath = path.join(dirPath, subPath)
          const isDir = fs.fstatSync(fullPath).isDirectory()
          return [subPath, isDir ? getStructure(fullPath) : fullPath]
        }))
    }
    return getStructure()
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
