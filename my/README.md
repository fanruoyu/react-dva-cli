# excerses
> A React.js project

## Build Setup

``` bash
# install dependencies
npm install


# 1. scripts:
## 1> start this project: npm run start / npm start // 项目启动
## 2> build this project: npm run build // 项目打包

# 2. proxy: file .roadhogrc proxy // 解决跨域问题

# 3. project Directory: 
├── public  项目index.html 入口
└── src
   ├── assets  存储静态文件 (eg: image / js)
   ├── models 存储数据容器redux
   ├── routes 路由页面js、css
   ├── services 数据容器异步请求操作
     ├── index.css Common Css
     ├── index.js  项目入口文件
     ├── routerConfig.js  路由router配置
   └── utils 公共类封装
          ├── Constants.js  请求头部
            └──  request.js  请求模块封装


