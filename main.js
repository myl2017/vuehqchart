'use strict'

const bytenode = require('bytenode')
const fs = require('fs')
const v8 = require('v8')

v8.setFlagsFromString('--no-flush-bytecode')


const input = `${__dirname}/dist/electron/main.js`
const output = `${__dirname}/dist/electron/main.jsc`

// prod env
if (!fs.existsSync('./dist/electron/main.jsc')) {
  bytenode.compileFile(input, output)
}

const content = '\'use strict\'\n\nrequire(\'bytenode\')\nrequire(`${__dirname}/main.jsc`)'

//写入内容
fs.writeFile(input, content, function (error) {
  console.log(error)
})

require(output)  //导出jsc模块
