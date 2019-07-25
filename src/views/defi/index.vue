<template>
  <div class="layout">
    <div class="top">
      <div class="toApp word-break" v-if="platform!='android'">
        <div class="left">
          <i class="logo"></i>
          <span class="word-break">Axonomy App</span>
        </div>
        <div class="right word-break" @click="openMask">{{$t('to_app.Download_ljdk')}}</div>
      </div>
      <my-header :title="title"></my-header>
    </div>

    <Scroll :pullup="true" class="wrapper" @scrollToEnd="scrollToEnd">
      <div>
        <div class="banner frame" v-if="bannerArr.length>0">
          <van-swipe :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(image, index) in bannerArr" :key="index" height="230">
              <img :src="image.image_url" width="100%" height="230" />
            </van-swipe-item>
          </van-swipe>
        </div>
        <!--<div @click="toRank" class="rank">-->
        <!--<p><i></i>每周收益排行榜</p>-->
        <!--<span>每周日00:00更新</span>-->
        <!--</div>-->
        <div class="title">
          <span @click="toALL" :class="{'active': ALL}">{{$t('axonomy.All')}}</span>
          <span @click="toJiJin" :class="{'active': JIJIN}">{{$t('axonomy.Fund')}}</span>
          <span @click="toBUY" :class="{'active': BUY}">{{$t('axonomy.Trading')}}</span>
          <span @click="toMONEY" :class="{'active': MONEY}">{{$t('axonomy.Investment')}}</span>
        </div>
        <div v-if="!ALL" class="list">
          <ul>
            <li @click="toDetail(item)" v-for="item in list">
              <div class="top1">
                <h4>{{item.name}}</h4>
                <span v-if="item.category == 1">{{$t('axonomy.New')}}</span>
                <span class="end" v-if="item.category == 3">{{$t('axonomy.Sold_out')}}</span>
              </div>
              <div class="box">
                <div class="left">
                  <p>{{item.revenue_forcast_value}}</p>
                  <span>{{item.revenue_forcast}}</span>
                </div>
                <div class="right">
                  <p>{{item.feature}}</p>
                  <span>{{item.desc}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="list">
          <h3 v-if="newlist.length">{{$t('axonomy.New_products')}}</h3>
          <ul>
            <li v-if="newlist" @click="toDetail(item)" v-for="item in newlist">
              <div class="top1">
                <h4>{{item.name}}</h4><span>{{$t('axonomy.New')}}</span>
              </div>
              <div class="box">
                <div class="left">
                  <p>{{item.revenue_forcast_value}}</p>
                  <span>{{item.revenue_forcast}}</span>
                </div>
                <div class="right">
                  <p>{{item.feature}}</p>
                  <span>{{item.desc}}</span>
                </div>
              </div>
            </li>
          </ul>
          <h3>{{$t('axonomy.Hot_products')}}</h3>
          <ul>
            <li @click="toDetail(item)" v-for="item in hotlist">
              <div class="top1">
                <h4>{{item.name}}</h4>
              </div>
              <div class="box">
                <div class="left">
                  <p>{{item.revenue_forcast_value}}</p>
                  <span>{{item.revenue_forcast}}</span>
                </div>
                <div class="right">
                  <p>{{item.feature}}</p>
                  <span>{{item.desc}}</span>
                </div>
              </div>
            </li>
          </ul>
          <h3>{{$t('axonomy.Past_products')}}</h3>
          <ul>
            <li @click="toDetail(item)" v-for="item in endlist">
              <div class="top1">
                <h4>{{item.name}}</h4><span class="end">{{$t('axonomy.Sold_out')}}</span>
              </div>
              <div class="box">
                <div class="left">
                  <p>{{item.revenue_forcast_value}}</p>
                  <span>{{item.revenue_forcast}}</span>
                </div>
                <div class="right">
                  <p>{{item.feature}}</p>
                  <span>{{item.desc}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>

</template>

<script>
  import { Swipe, SwipeItem } from 'vant';
  import Scroll from '@/components/Scroll'
  import myHeader from '@/components/Header'
  import { mapMutations } from 'vuex'
  import {getI18n,getCookie} from "@/assets/js/utils/tool";
  import {api_getBanner,api_getList} from '@/assets/js/request/api'
  export default {
    name: 'defi',
    data() {
      return {
        title:[getI18n()=='en' ? 'DeFi' : '开放金融'],
        ALL:true,
        BUY:false,
        MONEY:false,
        JIJIN: false,
        bannerArr: [],
        list: [], // 列表
        allList:[], // 存一下上面的list
        type:null , //商品类型: 不传表示全部, 产品类型, {0,1,2,3},{理财,质押,挖矿,分红}
        page:1,
        page_size: 10,
        has_more:true, // 是否还有更多，用于上拉加载
        platform:getCookie('platform'),
        newlist:[],
        hotlist:[],
        endlist:[]
      }
    },
    components: {
      Scroll,
      myHeader,
      [Swipe.name]:Swipe,
      [SwipeItem.name]:SwipeItem,
    },

    methods: {
      toRank(){
        this.$router.push('/defi/ranklist');
      },
      openMask(){
        this.$router.push({path:'/toApp'});
      },
      ...mapMutations({
        setTitle:'SET_TITLE'
      }),
      toALL(){
        this.ALL = true;
        this.BUY = false;
        this.MONEY = false;
        this.JIJIN = false;
        this.type = null;
        this.page = 1
        this.list=[];
        this.getList()
      },
      toBUY(){
        this.ALL = false;
        this.BUY = true;
        this.MONEY = false;
        this.JIJIN = false;
        this.type = 0
        this.page = 1
        this.list=[];
        this.getList()
      },
      toMONEY(){
        this.ALL = false;
        this.BUY = false;
        this.JIJIN = false;
        this.MONEY = true;
        this.type = 1
        this.page = 1
        this.list=[];
        this.getList()

      },
      toJiJin(){
        this.ALL = false;
        this.BUY = false;
        this.JIJIN = true;
        this.MONEY = false;
        this.type = 3
        this.page = 1
        this.list=[];
        this.getList()
      },
      // banner 图
      async getBanner(){
        const { data } = await api_getBanner();
        this.bannerArr = data;
      },
      // banner 图 跳转
      jumpHref(h){
        if(!h){return;}
        window.location.href = h;
      },
      toDetail(item){
        //腾讯点击上报
        //let MtaH5Id = String(item.id).replace(/\-/g, "_");
        //MtaH5.clickStat(MtaH5Id);
        this.setTitle(item.name);
        this.$router.push({
          path:`/defi/project_details`,
          query:{
            title:item.name,
            id:item.id
          }
        })
      },
      scrollToEnd(){
        if(this.has_more){
          this.page++;
          this.getList();
        }
      },
      // 获取列表
      async getList() {
        const params = {
          "version":'0',
          "data": {
            "type": this.type,
            "page": this.page,
            "page_size": this.page_size
          },
        }
        const {data} = await api_getList(params);
        if(!this.ALL){
          this.list = this.list.concat(data.items);
          this.has_more = data.has_more;
        }else{
          if(this.page == 1){
            this.newlist = data.items.filter((item) => {
              return item.category == 1
            })
            this.hotlist = data.items.filter((item) => {
              return item.category == 2
            })
            this.endlist = data.items.filter((item) => {
              return item.category == 3
            })
          }else if(this.page>1){
            this.endlist = this.endlist.concat(data.items)
          }
          this.has_more = data.has_more
        }
      },
    },
    mounted() {
      this.getBanner();
      this.getList();
      console.log(getCookie('tk'),"登录后的tk")
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/mixin";
  .top{
    position: fixed !important;
    width: 100%;
    z-index: 99999;
  }
  .layout{
    background-color: #F9FAFB;
    @scroll();
    .toApp{
      background-color: #F9FAFB;
      box-shadow:0 5px 0px #E8E6F2 ;
      display: flex;
      padding: 12px 30px;
      justify-content: space-between;
      height: 104px;
      box-sizing: border-box;
      .left{
        display: flex;
        i{
          width: 80px;
          height: 80px;
          .bg-image("../../assets/img/defi/logo");
          margin-right: 19px;
        }
        span{
          display: block;
          line-height: 80px;
          color: #333333;
          font-size: 30px;
          font-weight:500;
        }
      }
      .right{
        margin-top: 10px;
        padding: 0 28px;
        font-size: 28px;
        line-height: 60px;
        height: 60px;
        box-sizing: border-box;
        color:#6A4EFF ;
        font-weight:500;
        border: 1px solid #6A4EFF;
        border-radius: 50px;
      }
    }
  }
  .wrapper{
    position: absolute;
    left: 0;
    top: 180px;
    height: 100%;
    width: 100%;
  }
  .rank{
    margin-top: 20px;
    height:80px;
    line-height: 80px;
    background:linear-gradient(270deg,rgba(255,97,97,0.5) 0%,rgba(241,96,81,1) 100%);
    padding: 0 30px;
    color:rgba(255,255,255,1);
    display: flex;
    justify-content: space-between;
    p{
      font-size:30px;
      font-weight:500;
      display: flex;
      align-items: center;
    }
    i{
      display: inline-block;
      //.bg-image('../../assets/img/defi/icon');
      width: 57px;
      height: 57px;
      margin-right: 20px;
    }
    span{
      font-size:24px;
      font-weight:400;
    }
  }
  .title{
    background: #ffffff;
    display: flex;
    padding: 0 30px;
    span{
      line-height: 88px;
      color: #9895AC;
      font-size: 30px;
      font-weight: 600;
      margin-right: 60px;
      &.active{
        color: @color;
        border-bottom: 2px solid @color;
      }
    }
  }
  .banner{
    height:260px;
    overflow: hidden;
    padding: 0 30px;
    padding-top: 20px;
    img{
      display: inline-block;
      height: auto;
      width:auto;
      overflow: hidden;
      border-radius:5px;
    }
  }
  .list{
    padding-bottom: 300px;
    h3{
      margin: 37px 0 37px 30px;
      height:36px;
      font-size:30px;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:36px;
    }
    li{
      box-shadow: 0px 5px 30px 0px #E4E9EF;
      margin: 20px 30px 0;
      padding: 4px 30px 34px;
      border-radius: 8px;
      background: #ffffff;
      @overflow();
      .top1{
        display: flex;
        width: 630px;
        h4{
          height: 86px;
          line-height: 86px;
          font-size: 30px;
          font-weight: 400;
          color: @color;
          max-width: 540px;
          @overflow();
        }
        span{
          margin-top: 22px;
          margin-left: 22px;
          // width:83px;
          height:36px;
          font-size: 22px;
          font-weight: 600;
          line-height: 32px;
          text-align: center;
          color: #DD4F4F;
          background:rgba(221,79,79,0.1);
          border-radius:2px;
          border:1px solid rgba(221,79,79,1);
          padding: 0 12px;
          &.end{
            //max-width: 120px;
            background:rgba(167,164,182,1);
            border:1px solid rgba(167,164,182,1);
            color: #ffffff;
          }
        }
      }

      .box{
        display: flex;
        //@overflow();
        .left, .right{
          display: flex;
          flex-direction: column;
          p{
            height: 40px;
            line-height: 40px;
            font-size: 40px;
            font-weight: bold;
            color: #DD4F4F;
            margin-bottom: 10px;
            max-width: 400px;
            @overflow();
          }
          span{
            display:block;
            width: 400px;
            max-height: 50px;
            font-size:24px;
            font-weight:400;
            color:rgba(152,149,172,1);
            line-height:26px;
            @changeline();
            white-space:pre-wrap;
            overflow: hidden;
          }
        }
        .left{
          flex: 0 0 220px;
          @overflow();
        }
        .right{
          flex: 0 0 400px;
          @overflow();
        }
        .right p{
          color: @color;
          font-size:34px;
        }
      }
    }

  }
</style>
