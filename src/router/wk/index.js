/**
 * wk 页面路由
 */
export default [
  {
    path: "/wk",
    name: "wk",
    component:resolve => {
      require.ensure(
        ["@/views/wakuang/index.vue"],
        () => {
          resolve(require("@/views/wakuang/index.vue"));
        },
        "wk"
      );
    },
    meta: {
      title: "wk",
      keepAlive: true,
      requireAuth: false
    },
  }
];
