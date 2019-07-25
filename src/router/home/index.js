/**
 * 主页相关路由
 */
export default [
  {
    path: "/index",
    redirect: "/"
  },
  {
    path: "/",
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


    ]
  }
];
