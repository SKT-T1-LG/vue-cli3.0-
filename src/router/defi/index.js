/**
 * 主页相关路由
 */
export default [
  {
    path: "/defi",
    name: "index",
    component: resolve => {
      require.ensure(
        ["@/views/home/index.vue"],
        () => {
          resolve(require("@/views/home/index.vue"));
        },
        "index"
      );
    },
    meta: {
      title: "首页",
      keepAlive: true,
      requireAuth: false
    },
    children:[
      {
        path: "/",
        name: "defi",
        component: resolve => {
          require.ensure(
            ["@/views/defi/index.vue"],
            () => {
              resolve(require("@/views/defi/index.vue"));
            },
            "index"
          );
        },
        meta: {
          title: "defi",
          keepAlive: true,
          requireAuth: false,
          active:'/defi'
        },
      },
      {
        path: "wk",
        name: "wk",
        component: resolve => {
          require.ensure(
            ["@/views/wakuang/index.vue"],
            () => {
              resolve(require("@/views/wakuang/index.vue"));
            },
            "index"
          );
        },
        meta: {
          title: "wakuang",
          keepAlive: true,
          requireAuth: false,
          active:'/wk'
        },
      },
    ]
  }
];
