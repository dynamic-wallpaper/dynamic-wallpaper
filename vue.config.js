module.exports = {
  pages: {
    index: 'src/pages/main/index.js',
    player: 'src/pages/player/index.js'
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background/index.js',
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
        artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
        extraFiles: [
          'node_modules/ffmpeg-static/ffmpeg'
        ],
        mac: {
          target: {
            arch: 'universal',
            target: 'dmg'
          }
        }
      },
    }
  },
  
}