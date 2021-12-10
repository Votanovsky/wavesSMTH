const path = require('path')

module.exports = {
    entry: {
        index: "./index.js"
    },
    module: {
        rules: [
            { test: /\.jp(e?)g$/, use: [
                'file-loader',
                {
                  loader: 'image-webpack-loader',
                  options: {
                    mozjpeg: {
                      progressive: true,
                    },
                    optipng: {
                      enabled: false,
                    },
                    pngquant: {
                      quality: [0.65, 0.90],
                      speed: 4
                    },
                    gifsicle: {
                      interlaced: false,
                    },
                    webp: {
                      quality: 75
                    }
                  }
                },
              ]},
            { test: /\.glsl$/, use: "webpack-glsl-loader" }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js'
    },
    mode: "development"
}