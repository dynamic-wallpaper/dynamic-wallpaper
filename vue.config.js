module.exports = {
  pages: {
    index: 'src/pages/main/index.js',
    player: 'src/pages/player/index.js'
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background/index.js',
      builderOptions: {
        artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
        mac: {
          target: {
            arch: 'universal',
            target: 'dmg'
          }
        }
      },
    }
  }
}