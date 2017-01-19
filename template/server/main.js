import {version} from '../package.json'
import program from 'commander'
import http from 'http'
import express from 'express'
import favicon from 'serve-favicon'
import paths from './paths'

program
.version(version)
.option('-a, --addr <value>', '指定监听IP', '127.0.0.1')
.option('-p, --port <n>', '指定监听端口', 8888)
.option('-n, --name <value>', '指定应用名称', '')
.parse(process.argv)

if (program.name) {
  program.name = '/' + program.name
}

const rest = express()
const server = http.createServer(rest)

rest.use(`${program.name}/`, favicon(paths.wwwroot('static', 'img', 'favicon.ico')))
rest.use(`${program.name}/`, express.static(paths.wwwroot()))

server.listen(program.port, program.addr, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log(`server at http://${program.addr}:${program.port}${program.name}`)
})
