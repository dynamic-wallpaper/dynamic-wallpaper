/* eslint-disable no-template-curly-in-string */
module.exports = {
  pages: {
    index: 'src/pages/main/index.js',
    player: 'src/pages/player/index.js'
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/pages/preload.js',
      mainProcessFile: 'src/background/index.js',
      mainProcessWatch: ['src/background/**/*'],
      builderOptions: {
        appId: 'top.mizuka.dynamicWallpaper',
        publish: ['github'],
        artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
        extraResources: ['./ffmpeg/${platform}-${arch}'],
        afterSign: 'electron-builder-notarize',
        mac: {
          hardenedRuntime: true,
          icon: './public/icons/mac/icon.icns',
          target: {
            arch: ['arm64', 'x64'],
            target: 'default'
          }
        }
      }
    }
  }

}
