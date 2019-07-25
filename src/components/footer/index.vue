<template>
  <div class="tabbar">
    <ul>
      <li v-for="(item,index) in icon" @click="changeIcon(index)">
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
      changeIcon(i){
        this.active = i;
        if (this.active === 0) {
          this.$router.push({
            path: 'defi',
            replace: true
          })
        } else if (this.active === 1) {
          this.$router.push({
            path: 'wk',
            replace: true
          })
        } else if (this.active === 2) {
          this.$router.push({
            path: 'project',
            replace: true
          })
        } else if (this.active === 3) {
          this.$router.push({
            path: 'trends',
            replace: true
          })
        } else if (this.active === 4) {
          this.$router.push({
            path: 'money',
            replace: true
          })
        }
      },
    },
    mounted() {
      this.getTag()
      /**
       * 判断当前页面是哪个页面,解决刷新时,tab默认为 1 的bug
       */
      const CURRENTHREF = window.location.hash.substr(1)
      console.log(CURRENTHREF);
      if (CURRENTHREF.includes('/defi')) {
        this.active = 0
      } else if (CURRENTHREF.includes('/wk')) {
        this.active = 1
      } else if (CURRENTHREF.includes('/project')) {
        this.active = 2
      } else if (CURRENTHREF.includes('/trends')) {
        this.active = 3
      } else if (CURRENTHREF.includes('/money')) {
        this.active = 4
      }
    },
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