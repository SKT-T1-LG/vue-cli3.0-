/**
 * defi 页面路由
 */
export default [
  {
    path: "/defi",
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
    },
  },
  {
    path: "/defi/project_details",
    name: "index",
    component: resolve => {
      require.ensure(
        ["@/views/defi/details.vue"],
        () => {
          resolve(require("@/views/defi/details.vue"));
        },
        "details"
      );
    },
    meta: {
      title: "details",
      keepAlive: false,
      requireAuth: false
    },
  }
];
