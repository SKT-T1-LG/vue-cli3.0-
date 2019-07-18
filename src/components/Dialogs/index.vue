<template>
  <!--<div>
    //调用方式
    引入组件 html
    <dialogPop :args="dislogData" v-if="popisshow"></dialogPop>
    js
    import dialogPop from '../common/dialogs';
    //传的参数
    this.dislogData = {
      title:'弹窗标题TXT',
      content:'*遮罩层为#000000，透明度45% 1.默认点击周围不可关闭 ',
      leftBtnText:'取消',
      rightBtnText:'确定',
      leftBtnCallBack:this.escFun,
      rightBtnCallBack:this.sueFun
    };
    title 不传不展示
    rightBtnText 不传就展示一个按钮
  </div>-->
  <div class="popup">
    <div class="inner">
      <div class="title" v-html="args.title" v-if="args.title"></div>
      <div class="content" v-html="args.content"></div>
      <div class="btn-wrap" v-if="args.leftBtnText&&args.rightBtnText">
        <div class="lf" @click="leftBtnCallFun">{{args.leftBtnText}}</div>
        <div class="rt" @click="rightBtnCallFun">{{args.rightBtnText}}</div>
      </div>
      <div class="btn-wrap" v-else>
        <div class="btn" @click="leftBtnCallFun">{{args.leftBtnText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialogs',
  data() {
    return {
      isShow:true,
    }
  },
  props: {
    args:{
      type:Object,
      title:'弹窗标题',
      content:'弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      leftBtnText:'副操作',
      rightBtnText:'主操作',
      leftBtnCallBack:{
        type:Function,
        callback:() => {
          // if(typeof callback == "function"){
          //   console.log(1111);
          //   this.callback();
          // }
        }
      },
      rightBtnCallBack:{
        type:Function,
        callback:() => {
          if(typeof callback == "function"){
            this.callback();
          }
        }
      }
    }
  },
  methods: {
    leftBtnCallFun(){
      this.args.leftBtnCallBack();

    },
    rightBtnCallFun(){
      this.args.rightBtnCallBack();
    }
  }
}
</script>

<style lang='less' scoped>
.popup{
  position: fixed;
  z-index: 998;
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  .inner{
    width:600px;
    overflow: hidden;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate3d(-50%,-50%,0);
    border-radius:10px;
    background-color:#fff;
    .title{
      font-size:36px;
      font-family:PingFangSC-Medium;
      font-weight:bold;
      color:rgba(51,51,51,1);
      height:98px;
      line-height:98px;
      text-align: center;
      border-bottom:1px solid #e0e0e0;
    }
    .content{
      font-size:30px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:40px;
      padding:58px 60px 98px 60px;
    }
    .btn-wrap{
      border-top:1px solid #e0e0e0;
      overflow: hidden;
      height:98px;
      line-height:98px;
      text-align:center;
      font-size:36px;
      font-family:PingFangSC-Medium;
      font-weight:bold;
      .lf{
        width:50%;
        float: left;
        color:#333;
      }
      .rt{
        width:49%;
        border-left:1px solid #e0e0e0;
        color:#6A4EFF;
        float: left;
      }
      .btn{
        width:100%;
        color:#6A4EFF;
      }
    }
  }
}
</style>
