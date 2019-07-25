<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <footer-bar v-if="showTab"></footer-bar>
  </div>
</template>

<script>

  import footerBar from '@/components/footer'
  export default {
    name: 'App',
    components:{footerBar},
    data(){
      return {
        showTab: false
      }
    },
    watch: {
      /**
       * 侦听路由的变化,控制底部tabbar的显示
       */
      '$route' (to, from) {
        if (to.path === '/defi' || to.path === '/wk' || to.path === '/project' || to.path === '/trends' || to.path === '/money') {
          this.showTab = true
        } else {
          this.showTab = false
        }
      }
    },
    methods: {
    }
  }
</script>