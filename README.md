# electron-vue

* [git 地址](https://github.com/SimulatedGREG/electron-vue)
* [中文文档](https://electron.org.cn/doc/index.html)

> **起步**
 

> 安装 vue-cli 和 脚手架样板代码
```
npm install -g vue-cli
vue init simulatedgreg/electron-vue my-project
```
> 安装依赖并运行你的程序
```
cd my-project
yarn # 
yarn run dev #
```
> 当前系统位版本
```
yarn run build # 
```

* 保证项目的依赖及运行打包使用yarn
   1. yarn的安装,，使用npm安装依赖打包成应用会报错，所以一律使用yarn，安装方法 ``` cnpm install yarn --save-dev```
   2. 如果出现 ```Cannot find modules: xxx```情况，尝试更新node版本
   
  
* 优先保证运行系统在build过程中能获得最高管理权限，因为过程中需要下载winSignCode，不然会抛出错误，优先保证系统为正版。

* 生成应用过程一部分资源从亚马逊云中下载，会出现timeout的错误，多试几次能下载下来。不行的进行手动下载 [资源](https://github.com/electron-userland/electron-builder/issues/1859)

* 在build版本加入开发者工具方法，如下面操作

>In ```src/main/index.js``` add the line  ``` mainWindow.webContents.openDevTools()``` after ``` mainWindow.loadURL(winURL)```, with this open the devtools after builded.

# spjy

> An electron-vue project

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[de85f81](https://github.com/SimulatedGREG/electron-vue/tree/de85f81890c01500113738bfe57bef136f9fbf52) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).