<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png">
    <div class="box"></div>
    <!--<van-button class="btn" type="primary">主要按钮</van-button>-->
    <Button type="primary" @click="aa">123</Button>
  </div>
</template>

<script>
  import {Button} from 'vant';
  import {apiPOST} from '@/assets/js/request/api'
  import store from '@/store/index'
  export default {
    name: 'home',
    components: {
      //[Button.name]:Button
      Button
    },
    methods: {
      async aa() {
        let data = await apiPOST({
          "target": "17888809072",
          "password": "960401lmw"
        })
        console.log(data);
        store.commit('LOGIN_IN',data.data.token)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/assets/less/mixin";

  .box {
    width: 750px;
    height: 100px;
    background-color: red;
    @overflow();
  }

  .btn {
    background-color: blue;

  }
</style>
