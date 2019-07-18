<template>
  <div class="home">
      <router-view />
      <footer-bar></footer-bar>
  </div>
</template>

<script>

  import footerBar from '@/components/footer'
  export default {
    name: 'home',
    components:{footerBar},
    data(){
      return {

      }
    },
    methods: {
    }
  }
</script>
