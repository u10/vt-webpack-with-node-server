require('shelljs/global')
const path = require('path')
const webpack = require('webpack')
const ora = require('ora')
const fs = require('fs')
const pkgSrc = require('../package.json')
const projectRoot = path.resolve(__dirname, '../')

const spinner = ora('building for production...')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

spinner.start()

const pkg = {
  dependencies: {}
}

for (var k of [
  'version',
  'name',
  'description',
  'author',
  'main'
]) {
  pkg[k] = pkgSrc[k]
}

const dist = path.join(projectRoot, 'dist')
const node_modules = path.join(dist, 'node_modules')
rm('-rf', node_modules)
rm('-rf', path.join(dist, 'bin'))
rm('-rf', path.join(dist, 'server'))
mkdir('-p', dist)
cp('-R', path.join(projectRoot, 'bin'), path.join(dist, 'bin'))
const nodeModules = {
  '../package.json': 'commonjs ../package.json',
  path: 'commonjs path',
  http: 'commonjs http',
  fs: 'commonjs fs'
}

for (var mod of Object.keys(pkgSrc.dependencies)) {
  pkg.dependencies[mod] = pkgSrc.dependencies[mod]
  nodeModules[mod] = 'commonjs ' + mod
}

fs.writeFileSync(path.join(dist, 'package.json'), JSON.stringify(pkg, null, '  '))

webpack({
  entry: {
    main: path.join(projectRoot, 'server', 'main.js')
  },
  output: {
    path: path.join(projectRoot, 'dist', 'server'),
    filename: '[name].js'
  },
  node: {
    process: false,
    __filename: false,
    __dirname: false
  },
  externals: nodeModules,
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('server')]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('server')]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ],
}, function (err, stats) {
  spinner.stop()
  if (err) {
    throw err
  }
  process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
})
