<template>
  <div class="wrapper">
    <van-nav-bar
        title="国家区号"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <van-index-bar :index-list="[]">
      <van-index-anchor v-for="item in data" index="item">
        <div class="title">{{item.index}}</div>
        <van-cell v-for="aa in item.items" @click="chooseArea(aa.code)">{{aa.code}}-{{aa.area}}</van-cell>
      </van-index-anchor>
    </van-index-bar>
  </div>
</template>

<script>
  import { IndexBar, IndexAnchor, Cell, NavBar} from 'vant';
  //Vue.use(IndexBar).use(IndexAnchor);
  export default {
    //name: "areaCode"
    props:{
      data:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
        indexList:[],
        titleList:[]
      }
    },
    methods:{
      onClickLeft(){
        this.$emit('close');
      },
      chooseArea(code){
        this.$emit('choose',code)
      }
    },
    components:{
      [IndexBar.name]:IndexBar,
      [IndexAnchor.name]:IndexAnchor,
      [Cell.name]:Cell,
      [NavBar.name]:NavBar
    },
    mounted() {
      this.data.forEach((item) => {
        this.indexList.push(item.index)
      })
      this.titleList = this.data.items
    }
  }
</script>

<style lang="less" scoped>
  .wrapper{
    background-color: #ffffff;
    position: relative;
    overflow: auto;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .title{
      color: #ffffff;
      background-color: #4A90E2;
    }
  }
</style>