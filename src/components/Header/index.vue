<template>
  <div class="head">
    <div class="title">
      <h1 v-for="item in title" :key="item.id">{{item}}</h1>
    </div>
    <i class="icon" @click="toMy"><b v-if="isnews"></b></i>
    <!--<redDot @setRedDot="setRedDot"></redDot>-->
  </div>
</template>

<script>
  import {hasToken} from "@/assets/js/utils/tool";
  export default {
    data(){
      return{
        token: hasToken(),
        isnews:false
      }
    },
    props:["title"],
    methods:{
      toMy(){
        if(hasToken()){
          this.$router.push('/my');
        }else{
          this.$router.push({
            name: "login",
            query: {
            }
          });
          return false;
        }
      },
      setRedDot(status){
        this.isnews = status;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/mixin";
  .head{
    background: #ffffff;
    position: relative;

    .title{
      display: flex;
      justify-content: space-around;
      h1{
        height: 78px;
        text-align: center;
        line-height: 78px;
        font-size:36px;
        font-weight: 600;
        color: @color;
        flex: 1;
        text-align: center;
      }
    }
    .icon{
      position: absolute;
      right: 30px;
      top: 14px;
      width: 50px;
      height: 50px;
      .bg-image("../../assets/img/defi/my");
      b{
        width:8px;
        height:8px;
        background-color:red;
        position:absolute;
        top:0px;
        right:-16px;
        border-radius:50%;
      }
    }
  }
</style>
