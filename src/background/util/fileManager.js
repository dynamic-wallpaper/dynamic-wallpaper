/* eslint-disable no-unused-vars */
/**
 * 本地文件管理
 */
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { DownloaderHelper, DH_STATES } from 'node-downloader-helper'

// 一些特殊下载方案的部分
import bilibiliHelper from './bilibili'

// 最大可同时下载数量
const DOWNLOAD_NUMBER = 10

// 基础资源地址
export const BASE_PATH = path.join(app.getPath('userData'), 'resource')

if (!fs.existsSync(BASE_PATH)) {
  fs.mkdirSync(BASE_PATH)
}

/**
 * 下载队列
 */
const downloadQueue = new Map()

function startDownload () {
  let downloadingNumber = 0
  for (const dl of downloadQueue.values()) {
    if (downloadingNumber >= DOWNLOAD_NUMBER) {
      break
    }

    const { state } = dl
    if (state === DH_STATES.IDLE) {
      dl.start()
    }
    downloadingNumber++
  }
}

/**
 * 获取正确的下载地址
 * @param {string} url
 */
async function getDownloadConfig (url) {
  const protocol = url.replace(/:\/\/.*/, '')
  switch (protocol) {
    case bilibiliHelper.BILIBILI_PROTOCOL: {
      const downloadConfig = await bilibiliHelper.getDownloadConfig(url)
      return downloadConfig
    }
    default: {
      return {
        headers: null,
        url: decodeURI(url)
      }
    }
  }
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
    return path.join(this.rootDir, ...filePath.split('/'))
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
  async downloadFile (url, onProgress, options = {}) {
    try {
      const filename = path.basename(url)
      const key = path.join(this.rootDir, filename)

      if (!downloadQueue.has(key)) {
        const downloadConfig = await getDownloadConfig(url)
        downloadQueue.set(key, new DownloaderHelper(downloadConfig.url, this.rootDir, {
          override: true,
          fileName: `${filename}.tmp`,
          headers: downloadConfig.headers || {},
          ...options
        }))
      }

      const dl = downloadQueue.get(key)
      if (onProgress && typeof onProgress === 'function') {
        dl.on('progress.throttled', onProgress)
        dl.on('end', (data) => {
          const { filePath } = data
          fs.renameSync(filePath, filePath.replace(/\.tmp$/, ''))
          onProgress({
            progress: 100
          })
          // 开始新一轮的下载
          if (downloadQueue.has(key)) {
            downloadQueue.delete(key)
          }
          startDownload()
        })
        dl.on('error', (e) => {
          console.error('error', e)
          const downloadPath = dl.getDownloadPath()
          if (fs.existsSync(downloadPath)) {
            fs.unlinkSync(dl.getDownloadPath())
          }
          onProgress({
            progress: -1,
            data: e
          })
          // 开始新一轮的下载
          if (downloadQueue.has(key)) {
            downloadQueue.delete(key)
          }
          startDownload()
        })
      }

      startDownload()

      return dl
    } catch (e) {
      onProgress({
        progress: -1,
        data: e
      })
    }
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
