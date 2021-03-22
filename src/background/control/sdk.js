/**
 * 和客户端交互的部分
 */
import { service as mediaService } from '@/background/media'
import { MEDIA_PROTOCOL } from '@/configs/protocol'
import sdk from '@/background/util/sdk'
import FileManager from '@/background/util/fileManager'
import videoModel from '@/models/video'
import path from 'path'
import fs from 'fs'
import MD5 from 'md5'

export default async function (context) {
  sdk.get('media/categories', async (req, res) => {
    const categoryMap = mediaService.categoryMap
    const categories = await videoModel.getCategories()
    /**
         * 创建category对应的文件
         */
    categories.forEach(category => {
      if (!categoryMap.has(category.key)) {
        categoryMap.set(category.key, new FileManager(category.key))
      }
      category.renderer = 'videoRenderer'
      /**
       * 分类管理器
       */
      const fileManager = categoryMap.get(category.key)
      const { structure } = fileManager
      /**
       * 是否已下载完成
       */
      category.value.forEach(video => {
        video.value = `${MEDIA_PROTOCOL}://${video.value}`
        const fileName = path.basename(video.value)
        const isDownloaded = fileName in structure
        /**
         * 校验文件，正确的保留
         */
        if (isDownloaded) {
          if (video.md5 !== MD5(fileManager.getFile(fileName))) {
            fileManager.deleteFile(fileName)
          } else {
            video.isDownloaded = true
          }
        }
      })
    })
    res.send(categories)
  })

  sdk.post('media/download', async (req, res) => {
    const { category, url, md5 } = req.body
    const { categoryMap } = mediaService
    if (!categoryMap.has(category)) {
      res.status(404).send('无有效的频道管理器')
    } else {
      /**
       * @type FileManager
       */
      const fileManager = categoryMap.get(category)
      fileManager.downloadFile(url, function ({ progress }) {
        if (context.win) {
          context.win.webContents.send('media:progress', {
            progress,
            category,
            url
          })
        }
        if (progress === 100) {
          /**
           * 计算md5
           */
          const fileName = path.basename(url)
          const fileMd5 = MD5(fileManager.getFile(fileName))

          if (md5 === fileMd5) {
            res.send('下载完成')
          } else {
            fileManager.deleteFile(fileName)
            res.status(500).send('下载失败')
          }
        }
      })
    }
  })
}
