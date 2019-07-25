<template>
  <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
  />
</template>

<script>
  import { NavBar } from 'vant';
  export default {
    components:{
      [NavBar.name]:NavBar
    },
    methods: {
      onClickLeft() {
        window.history.go(-1)
      },
    }
  }
</script>
