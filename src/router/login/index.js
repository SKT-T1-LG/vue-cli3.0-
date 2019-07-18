/**
 * 主页相关路由
 */
export default [
  {
    path: "/login",
    name: "index",
    component: resolve => {
      require.ensure(
        ["@/views/login/index.vue"],
        () => {
          resolve(require("@/views/login/index.vue"));
        },
        "index"
      );
    },
    // children:[
    //   {
    //     path:'area',
    //     component:resolve => {
    //       require.ensure(
    //         ["@/components/areaCode/index.vue"],
    //         () => {
    //           resolve(require("@/components/areaCode/index.vue"));
    //         },
    //         "index"
    //       );
    //     }
    //   }
    // ],
    meta: {
      //docTitle: "登录",
      keepAlive: true
    }
  }
];
