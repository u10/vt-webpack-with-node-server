import fs from 'fs'
import path from 'path'
const rootPath = path.join(__dirname, '..')

// 拼接路径
function createPathMaker (...base) {
  base = path.resolve(path.join(...base))
  return function (...args) {
    if (args[args.length - 1] === true) {
      args.length--
      return createPathMaker(base, ...args)
    } else {
      return path.resolve(path.join(base, ...args))
    }
  }
}

const root = createPathMaker(rootPath)

let nodeModules = root()
while (fs.readdirSync(nodeModules).indexOf('node_modules') === -1) {
  let parent = path.resolve(nodeModules + '/..')
  if (nodeModules === parent) {
    break
  }
  nodeModules = parent
}

nodeModules = createPathMaker(nodeModules, 'node_modules')

export default {
  resolve: path.resolve,
  join: path.join,
  normalize (str) {
    return path.normalize(str.replace(/\\|\//g, path.sep))
  },
  node_modules: nodeModules,
  root: root,
  data: root('data', true),
  wwwroot: root('wwwroot', true)
}
