<template>
  <div class="layout">
    <header class="head">
      <div>
        <p @click="toWK" :class="{'active':WK}">{{$t('axonomy.Mining')}}</p>
        <p @click="toYQ" :class="{'active':YQ}">{{$t('mining_invite.Invite')}}</p>
      </div>
      <i class="icon" @click="toMy"></i>
    </header>
    <keep-alive>
      <component :is="currentView"></component>
    </keep-alive>
    <Footer></Footer>
  </div>
</template>

<script>
  import wk from './wk'
  import invite from './invite'
  import Footer from '@/components/footer'
  export default {
    data(){
      return {
        WK: true,
        YQ: false,
        type:this.$route.query.type,
        currentView:'wk'
      }
    },
    methods: {
      toMy() {
        this.$router.push('/my');
      },
      toWK(){
        this.WK = true;
        this.YQ = false;
        this.currentView = wk;
      },
      toYQ(){
        this.WK = false;
        this.YQ = true;
        this.currentView = invite;

      },
    },
    components: {
      wk,
      invite,
      Footer
    },
    mounted() {
      // this.$nextTick(() => {
      //   if(this.type=='yq'){
      //     this.toYQ();
      //   }
      // });
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/mixin";
  .content{
    margin-top: 80px;
  }
  .head {
    z-index: 99999;
    background: #ffffff;
    border-bottom:1px solid #eee;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    div {

      display: flex;
      justify-content: space-around;
      padding: 0 160px;
    }

    p {
      margin: 0 33px;
      height: 82px;
      line-height: 82px;
      font-size: 36px;
      font-weight: 400;
      color: rgba(152, 149, 172, 1);

      &.active {
        color: @color;
        border-bottom: 3px solid @color;
      }
    }

    .icon {
      position: absolute;
      width: 50px;
      height: 50px;
      right: 30px;
      top: 14px;
      .bg-image("../../assets/img/defi/my");
      b{
        width:8px;
        height:8px;
        background-color:red;
        position:absolute;
        top:0rem;
        right:-16px;
        border-radius:50%;
      }
    }

  }
</style>
