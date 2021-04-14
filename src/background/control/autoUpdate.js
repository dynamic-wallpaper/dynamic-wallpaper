import { autoUpdater } from 'electron-updater'

export default function () {
  autoUpdater.checkForUpdatesAndNotify()
}
