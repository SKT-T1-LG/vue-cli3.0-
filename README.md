# axonomy - vue-cli 3.0 移动端从0到1搭建配置（持续完善）

<span id="top">目录</span>

- [√ 安装 @vue/cli并初始化](#install)


### <span id="install">☞ 安装@vue/cli并初始化</span>
```
npm install -g @vue/cli
```
等待安装完成之后开始初始化项目
```
vue create vue-cli3
```
1.选择预设<br/>
&emsp;&emsp;可以选择默认预设，默认预设包含了 `babel`,`eslint`;<br/>
&emsp;&emsp;这里我选择的是更多功能 `Manually select features`，回车以后选择你需要的插件<br/>

2.选择插件<br/>
&emsp;&emsp;这边选择了 `Babel`、`Router`、`Vuex`、`cCSS Pre-processors`【css预处理器】

3.路由模式选择<br/>
&emsp;&emsp;是否使用 `history` 模式的路由 (No)，这里我选的是 `hash`模式的路由

4.选择一个css预处理器<br/>
&emsp;&emsp;这里我选择的是less

5.选择一个eslint配置<br/>
&emsp;&emsp;这边选择 ` ESLint + Standard config`，个人比较喜欢这个代码规范

6.选择将这些配置文件写入到什么地方<br/>
&emsp;&emsp;这里我选择 `In dedicated config files`（独立文件放置），当然你也可以选择 `In package.json`（package.json放置）<br/>

7.是否保存这份预设配置？<br/>
&emsp;&emsp;选Y的话，下次创建一个vue项目，可以直接使用这套预设配置文件，而无需再进行配置<br/>

[▲ 返回目录](#top)

### <span id="env">☞ 配置多环境变量</span>

官方文档介绍了各种情况的配置 [查看文档](https://cli.vuejs.org/zh/guide/mode-and-env.html) <br/>

相对于 vue-cli2 版本来说 3.0 版本删除了之前存放变量的config目录， 改成：
```
.env                        #在所有的环境中被载入
.env.local                  #在所有的环境中被载入，但会被git忽略
.env.[mode]                 #只在指定的模式中被载入
.env.[mode].local           #只在指定的模式中被载入，但会被git忽略
```
依次创建  `.env.dev`、`.env.production` 文件， key = value 形势写入环境变量

#### .env.dev serve 默认的环境变量
```
NODE_ENV = 'development'
VUE_APP_ENV = dev
VUE_APP_BASE_API = 'https://eapis.axonomy.pro'
```
##### .env.production build 默认的环境变量
```
NODE_ENV = 'production'
VUE_APP_ENV = pro
VUE_APP_BASE_API = 'https://defi.axonomy.pro'
```

注意：**一定记得要以 `VUE_APP_ ` 开头命名变量，不然不会写入到 `process.env`**，以 *`VUE_APP_`* 开头命名的变量 *`VUE_APP_*`* 就可以在项目中愉快的使用 *`process.env.VUE_APP_*`* 访问了。<br/>

在assets的js目录下面创建一个 baseUrl.js 文件，用来统一管理线上和测试环境的 api接口
```` javascript
let baseUrl = ''
switch (process.env.NODE_ENV){
  case 'development':
    baseUrl = 'https://eapis.axonomy.pro'
    break;
  case 'production':
    baseUrl = 'https://defi.axonomy.pro'
    break;
}

export default baseUrl
````
[▲ 返回目录](#top)

### <span id="alias">☞ 添加别名 alias</span>
创建 import 或 require 的别名，来确保模块引入变得更简单,[resolve.alias 文档地址](https://doc.webpack-china.org/configuration/resolve/#resolve-alias)。
````javascript
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("router", resolve("src/router"))
      .set("store", resolve("src/store"))
      .set("icons", resolve("src/icons"))
      .set("views", resolve("src/views"));
   }
}
 ````

[▲ 返回目录](#top)
 
### <span id="sass">☞ 为 less 配置全局变量</span>
我的less目录
````
|-- assets
    |-- img
    |-- js
    |-- less
        |-- index.js
        |-- fonts
        |-- font.less           //字体样式引入文件
        |-- reset.less          //清除浏览器默认样式
        |-- variable.less       //根据设计规范提取颜色、字体等less变量
        |-- mixin.less          //mixin类
 ````
1.准备存放全局样式变量的less文件variable.less
```` less
/*颜色定义规范*/
@color_primary:#6A4EFF;  //主题色
@color_background:#FFFFFF;  //页面背景色1
@color_background2:#F9FAFB;  //页面背景色2
@color_text: #333;  //页面通用字体色
@color_text2: #A7A4B6;  //页面通用字体色
@color_link:#4A90E2;  //链接文字颜色
@color_border:#E0E0E0;  //边框颜色
@color_gradients:linear-gradient(90deg,rgba(163,134,255,1) 0%,rgba(106,78,255,1) 100%); // 渐变色

@title-font-size-large:46px;
@title-font-size-middle:36px;
@title-font-size-normal:30px;

@left-right-padding:30px;
@btn-height:88px;
@input-height:72px;
````
2.配置loader
````javascript
module.exports = {
  css: {
    // 是否使用css分离插件
    extract: true,
    loaderOptions: {
      // 配置scss全局变量
      less: {
        data: `@import "@/assets/less/mixin.less";
               @import "@/assets/less/variable.less";` //!!!切记;不能丢
      }
    }
  }
}
````
[▲ 返回目录](#top)

### <span id="px2rem">☞ 布局方案以及px自动转换rem</span>
使用loader:px2rem-loader、lib-flexible
````javascript
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
        .rule('css')
        .test(/\.css$/)
        .oneOf('vue')
        .resourceQuery(/\?vue/)
        .use('px2rem')
        .loader('px2rem-loader')
        .options({
          remUnit: 75
        })
  }
}
````
&emsp;&emsp;修改我们的 `postcss.config.js`

````javascript
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ["> 0.01%", "Android >= 4.0", "Firefox ESR", "Ios >= 8.0"]
    },
    //更多配置参考：https://github.com/ant-tool/postcss-plugin-px2rem
    "postcss-plugin-px2rem": {
      rootValue: 75,
      unitPrecision: 5,
      propWhiteList: [],
      propBlackList: [
        "border-bottom",
        "border-top",
        "border-left",
        "border-right",
        "border",
        "filter"
      ],
      exclude:/(node_module)/,
      selectorBlackList: ["ignore"],
      ignoreIdentifier: false,
      replace: true,
      mediaQuery: false,
      minPixelValue: 3
    },
  }
};

````
参考链接

https://blog.csdn.net/weixin_41424247/article/details/80867351 <br/>
https://github.com/ant-tool/postcss-plugin-px2rem <br/>
https://segmentfault.com/q/1010000016226191/a-1020000017063073 <br/>

[▲ 返回目录](#top)

### <span id="router">☞ 路由拆分模块、懒加载以及自动引入</span>

 在此前的项目中，路由文件都是写在一个router.js中，这样做到后期路由有三四十个，很不利于维护，因此在项目开始前，我们就要考虑好路由的拆分，我的拆分原则是根据页面和业务功能模块拆分。
 ```
 |-- router
    |-- error              //404、500等错误提示页面路由
        |-- index.js
    |-- home               //首页相关页面路由
        |-- index.js
    |-- defi               //defi相关页面路由
        |-- index.js
    |-- wk                 //挖矿相关页面路由
        |-- index.js
    |-- index.js           //用来导入所有的路由子模块
 ```
 例如：404、500等相关页面路由
 ```javascript
 /**
 * @file 404、500等相关路由 (暂未配置)
 */
export default [
  {
    path: "/500",
    name: "500",
    component: resolve => {
      require.ensure(
        ["@/views/error/500.vue"],
        () => {
          resolve(require("@/views/error/500.vue"));
        },
        "500"
      );
    },
    meta: {
      docTitle: "500",
      keepAlive: false
    }
  },
  {
    path: "*",
    name: "404",
    component: resolve => {
      require.ensure(
        ["@/views/error/404.vue"],
        () => {
          resolve(require("@/views/error/404.vue"));
        },
        "404"
      );
    },
    meta: {
      docTitle: "页面未找到"
    }
  }
];
 ```

在根 index.js中自动导入所有子模块

```javascript
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

let routes = [];
const routerContext = require.context("./", true, /index\.js$/);
routerContext.keys().forEach(route => {
  if (route.startsWith("./index")) return;  //根目录的 index.js 不处理
  const routerModule = routerContext(route);
  routes = [...routes, ...(routerModule.default || routerModule)];
});

export default new Router({
  //mode: "history",
  linkActiveClass: "active",
  routes: routes
});

```
[▲ 返回目录](#top)
