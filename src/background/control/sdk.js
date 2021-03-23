/**
 * 和客户端交互的部分
 */
import { service as mediaService } from '@/background/media'
import { MEDIA_PROTOCOL } from '@/configs/protocol'
import sdk from '@/background/util/sdk'
import FileManager, { BASE_PATH } from '@/background/util/fileManager'
import videoModel from '@/models/video'
import path from 'path'
import { Notification } from 'electron'
// import MD5 from 'md5'

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

      category.value.forEach(video => {
        video.value = `${MEDIA_PROTOCOL}://${path.join(BASE_PATH, video.value)}`
        const fileName = path.basename(video.value)
        /**
         * 校验文件，正确的保留
         */
        video.isDownloaded = fileName in structure
      })
    })
    res.send(categories)
  })

  sdk.post('media/download', async (req, res) => {
    const { category, url, label } = req.body
    const { categoryMap } = mediaService
    if (!categoryMap.has(category)) {
      res.status(404).send('无有效的频道管理器')
    } else {
      /**
       * @type FileManager
       */
      const fileManager = categoryMap.get(category)
      fileManager.downloadFile(url, function ({ progress, filePath, data }) {
        if (context.win && !context.win.isDestroyed()) {
          context.win.webContents.send('media:progress', {
            progress,
            category,
            url
          })
        }
        const fileName = path.basename(url)
        if (progress === 100) {
          /**
           * 计算md5
           */
          setImmediate(() => {
            // const fileMd5 = MD5(fileManager.getFile(fileName))
            // console.log('下载', filePath, fileManager.getFile(fileName), MD5(fileManager.getFile(fileName)), md5)
            // if (md5 === fileMd5) {
            res.send('下载完成')
            new Notification({
              title: '下载完成',
              body: label
            }).show()
            // } else {
            //   fileManager.deleteFile(fileName)
            //   res.status(500).send('下载失败')
            // }
          })
        } else if (progress === -1) {
          new Notification({
            title: '下载失败',
            body: label
          }).show()
          fileManager.deleteFile(fileName)
          res.status(500).send(data)
        }
      })
    }
  })
}
