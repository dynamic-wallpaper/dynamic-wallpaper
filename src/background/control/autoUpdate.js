import { autoUpdater } from 'electron-updater'
import { app, dialog } from 'electron'
import logger from 'electron-log'

autoUpdater.logger = logger
autoUpdater.autoDownload = false

export default function () {
  if (process.env.NODE_ENV === 'development') {
    return
  }
  autoUpdater.checkForUpdates()

  // listen for update found
  autoUpdater.on('update-available', () => {
    // prompt user to start download
    dialog.showMessageBox({
      type: 'info',
      title: '升级版本',
      message: '发现了新版本，你是否现在可以升级？',
      buttons: [
        '现在升级',
        '以后再说'
      ]
    })
      .then(answer => {
        const buttonIndex = answer.response
        if (buttonIndex === 0) autoUpdater.downloadUpdate()
      })
      .catch(error => {
        console.error(error, 'error in update-available')
      })
  })

  // listen for download being ready
  autoUpdater.on('update-downloaded', () => {
    // prompt user to install update
    dialog.showMessageBox({
      type: 'info',
      title: '已准备好升级',
      message: '是否立马重启？',
      buttons: [
        '重启',
        '取消'
      ]
    })
      .then(answer => {
        const buttonIndex = answer.response

        if (buttonIndex === 0) {
          autoUpdater.quitAndInstall(false, true)
          setTimeout(() => {
            app.quit()
          }, 500)
        }
      })
      .catch(error => {
        console.error(error, 'error in update-downloaded')
      })
  })
}
