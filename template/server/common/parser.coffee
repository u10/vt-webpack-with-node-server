pkgObj = require('../../package.json')
ArgumentParser = require('argparse').ArgumentParser

parser = new ArgumentParser(
  version: pkgObj.version
  addHelp: true
  description: '{{ description }}'
  prog: '{{ name }}'
)

args = [
  ['-a', '--addr']
  help: '指定监听IP'
  defaultValue: '0.0.0.0'
  ['-p', '--port']
  help: '指定监听端口。'
  defaultValue: 3000
  ['-n', '--name']
  help: '指定应用名称。'
  defaultValue: ''
]

parser.addArgument(args[i * 2], args[i * 2 + 1]) for i in [0...args.length / 2]

module.exports = parser
