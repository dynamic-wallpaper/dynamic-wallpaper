/**
 * 和客户端交互的部分
 */
import { service as mediaService } from '@/background/media'
import sdk from '@/background/util/sdk'
import FileManager from '@/background/util/fileManager'
import path from 'path'
import { Notification, session } from 'electron'
// import MD5 from 'md5'

/**
 * 获取内部保存的categoryMap
 * @param {*} context
 */
export default async function (context) {
  sdk.get('category/:category', async (req, res) => {
    const category = req.params.category
    const fileManager = mediaService.getCategory(category)
    res.send(fileManager.structure)
  })

  sdk.post('media/download', async (req, res) => {
    const { category, url, label } = req.body
    const { categoryMap } = mediaService

    /**
     * 未生成管理器则生成一个
     */
    if (!categoryMap.has(category)) {
      categoryMap.set(category, new FileManager(category))
      // return res.status(404).send('无有效的频道管理器')
    }

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
  })

  sdk.get('cookie', async (req, res) => {
    const url = req.body

    try {
      const cookies = await session.defaultSession.cookies.get({
        url
      })
      const cookie = cookies
        .map(({ name, value }) => `${name}=${value}`)
        .join(';')
      res.send(cookie)
    } catch (e) {
      console.error(e)
      res.status(500).send('can not get cookie')
    }
  })

  sdk.post('media/delete', async (req, res) => {
    const { category, file } = req.body || {}
    const fileManager = mediaService.getCategory(category)
    if (fileManager.fileIsExist(file)) {
      fileManager.deleteFile(file)
      res.send('success')
    } else {
      res.statusCode(500).send('file not existed')
    }
  })
}
