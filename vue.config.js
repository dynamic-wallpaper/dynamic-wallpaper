module.exports = {
  pages: {
    index: 'src/pages/main/index.js',
    player: 'src/pages/player/index.js'
  },
  pluginOptions: {
    electronBuilder: {
      appId: 'top.mizuka.dynamicWallpaper',
      preload: 'src/pages/preload.js',
      mainProcessFile: 'src/background/index.js',
      mainProcessWatch: ['src/background/**/*'],
      chainWebpackMainProcess: (config) => {
        config.plugin('define').tap(definitions => {
          definitions[0] = {
            ...definitions[0],
            'process.env.FLUENTFFMPEG_COV': false
          }
          return definitions
        })
      },
      builderOptions: {
        // eslint-disable-next-line no-template-curly-in-string
        artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
        // extraFiles: [
        //   './node_modules/ffmpeg-static/ffmpeg*'
        // ],
        mac: {
          icon: './public/icons/mac/icon.icns',
          target: {
            arch: ['arm64', 'x64'],
            target: 'dmg'
          }
        }
      }
    }
  }

}
