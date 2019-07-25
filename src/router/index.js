import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
Vue.use(Router)

let routes = [];
const routerContext = require.context("./", true, /index\.js$/);
routerContext.keys().forEach(route => {
  if (route.startsWith("./index")) return;
  const routerModule = routerContext(route);
  routes = [...routes, ...(routerModule.default || routerModule)];
});


const router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  //可以做 loadong 开始加载 效果
  //store.state.token = localStorage.getItem('token'); //获取本地存储的token
  if (to.meta.title) { //判断是否有标题  该操作可以再监听路由时候处理 watch:{'$route'(to,from){xxx操作}}
    document.title = to.meta.title
  }
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (store.state.token) { // 通过vuex state获取当前的token是否存
      console.log('有token时候', to, from, next)
      next();
    } else {
      console.log('没有token时候', to)
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
})

export default router

