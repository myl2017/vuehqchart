## jw_electron_vuehqchart       矩网Electron 桌面端行情Chart


## electron 打包慢问题：配置淘宝镜像
```console
npm config set ELECTRON_MIRROR "https://npm.taobao.org/mirrors/electron/"
```

---
## electron-vue 加密打包 cli
安装依赖:
```console
npm install --save bytenode
```

Or globally:
```console
sudo npm install -g bytenode
```

首先生成dist目录: 
```console
npm run pack
```

其次生成加密文件:
```console
npm run start
```

electron打包集成sqlite3:
```console
npm run postinstall  (执行配置 "postinstall": "install-app-deps")
```

最后打包应用:
```console
npm run start:build
```
* 注意: package.json文件，  "main": "./dist/electron/main.js" 配置， 当生成dist目录 main配置为"./dist/electron/main.js", 当加密文件main配置为项目根目录下的main.js,
       打包为exe时main配置为"./dist/electron/main.js"
---

项目中使用sqlite:
```console
https://github.com/kripken/sql.js/
```

