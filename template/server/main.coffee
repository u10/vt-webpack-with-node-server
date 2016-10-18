fs = require 'fs'
http = require 'http'
express = require('express')
favicon = require('serve-favicon')
paths = require('./common/paths')(__dirname + '/..')

args = require('./common/parser').parseArgs()
args.name = '/' + args.name if args.name

rest = express()
server = http.createServer(rest)

rest.use "#{args.name}/", favicon(paths.wwwroot('static', 'img', 'favicon.ico'))
rest.use "#{args.name}/", express.static(paths.wwwroot())

server.listen args.port, args.addr, (err) ->
  if err
    console.log(err)
    return
  console.log("server at http://#{args.addr}:#{args.port}#{args.name}")
  return
