/**
 * 和客户端交互的部分
 */
import { service as mediaService } from '@/background/media'
import sdk from '@/background/util/sdk'
import FileManager from '@/background/util/fileManager'
import videoModel from '@/models/video'

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
      const fileManager = categoryMap.get(category.key)
      console.log('structure', fileManager.structure)
    })
    res.send(categories.map(category => {
      category.renderer = 'videoRenderer'
      return category
    }))
  })

  sdk.post('media/download', async (req, res) => {
    const { category, url } = req.body
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
          res.send('下载完成')
        }
      })
    }
  })
}
