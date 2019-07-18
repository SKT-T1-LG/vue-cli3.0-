<template>
  <div class="tabbar">
    <ul>
      <li v-for="(item,index) in icon" @click="toTab(index)">
        <router-link :to="item.path">
          <img :src="active == index?item.icon_active:item.icon" />
          <p :class="{'text_active':active == index}">{{item.title}}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import {api_getTab} from '@/assets/js/request/api'
  export default {
    components: {

    },
    data() {
      return {
        active:0,
        icon:[]
      }
    },
    methods:{
      async getTag(){
        const {data} = await api_getTab();
        console.log(data);
        this.icon = data;
      },
      toTab(i){
        this.active = i;
        console.log(this.$route.meta.active);
        switch (i) {
          case 0:
            this.active = 0;
            break;
          case 1:
            this.active = 1;
            break;
          case 2:
            this.active = 2;
            break;
          case 3:
            this.active = 3;
            break;
          case 4:
            this.active = 4;
            break;
        }
      }
    },
    mounted() {
      this.getTag()
    }
  }
</script>

<style lang="less" scoped>
  .tabbar{
    position: fixed;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background-color: #ffffff;
    border-top: 2px solid #e9e9e9;
  }
  ul{
    display: flex;
    width: 100%;
    position: relative;
  }
  li{
    padding: 10px 0 12px 0;
    height: 100px;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    img{
      display: block;
      width: 50px;
      height: 50px;
      margin: 0 auto;
    }
    p{
      text-align: center;
      height:20px;
      font-size:20px;
      font-weight:500;
      color:rgba(167,164,182,1);
      line-height:20px;
      margin-top: 8px;
      &.text_active{
        font-weight: 600;
        color: #333333;
      }
    }
  }
</style>