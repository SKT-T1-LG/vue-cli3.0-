const path = require('path');
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV); //是否生产环境
const resolve = dir => path.join(__dirname, dir);

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
  },
  // devServer: {
  //   port: 8080, // 端口号
  //   host: 'localhost',
  //   https: false, // https:{type:Boolean}
  //   open: true, //配置自动启动浏览器
  //   // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
  //   proxy: {
  //     '/api': {
  //       target: 'https://x.aceport.com',
  //       ws: true,
  //       changeOrigin: true
  //     }
  //   }
  // }
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