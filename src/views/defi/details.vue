<template>
  <div class="layout">
    <!--<v-head class="head" :title="title"></v-head>-->
    <Scroll ref="scroll" class="scroll">
      <div class="wrapper">
        <div class="header">
          <h4>{{item_js.name}}</h4>
          <p v-if="locale == 'cn'" class="provider">由{{item_js.provider}}提供</p>
          <p v-if="locale == 'en'" class="provider">{{$t('axonomy.Provided_by_X')}} {{item_js.provider}}</p>
          <div class="box">
            <div class="left">
              <h5>{{$t('axonomy.Investment_income')}}</h5>
              <p class="num">{{item_js.revenue_forcast_value}}</p>
              <span>{{item_js.revenue_forcast}}</span>
            </div>
            <div class="right">
              <h5>{{$t('axonomy.Mining_income')}}</h5>
              <p class="num">{{item_js.mine_revenue}}</p>
              <span>{{item_js.mine_revenue_desc}}</span>
            </div>
          </div>
          <div v-if="item_js.tags.length" class="tag">
            <span v-for="item in item_js.tags ">{{item}}</span>
          </div>
        </div>
        <div class="contain">
          <header class="tag">
            <div>
              <p @click="toJS" :class="{'active':JS}">{{$t('project.tab_Introduction')}}</p>
              <p @click="toPF" :class="{'active':PF}">{{$t('project.tab_Rating')}}</p>
            </div>
          </header>
          <div v-if="JS" class="introduce">
            <img @load="loadImage" :src="item_js.detail_image" alt="">
          </div>
          <Score
              class="pf"
              v-if="PF"
              :project_id="id"
              :items="items_pf"
              :rating="rating"
              :topicid="topicid"
              @sortChange="sortChange"
          ></Score>
        </div>
      </div>
    </Scroll>
    <div v-if="JS">
      <div v-if="item_js.issell==0" class="btn btn_end">{{item_js.btntext}}</div>
      <div v-if="item_js.issell==2" class="btn btn_will">{{item_js.btntext}}</div>
      <div v-if="item_js.issell==1" class="btn btn_start" @click="toBuy">{{item_js.btntext}}</div>
    </div>
    <reply-box
        v-if="showComment"
        class="replybox"
        @toChangeListItems="ABC"
        @toChangeListItemsLengthDel="toChangeListItemsLengthDel"
    ></reply-box>
    <dialogPop :args="dislogData" v-if="popisshow"></dialogPop>
  </div>
</template>

<script>
  import Scroll from '@/components/Scroll'
  import Score from "@/components/Score";
  import Share from "@/components/Share";
  import dialogPop from '@/components/Dialogs';
  import replyBox from "@/components/ReplyBox";
  import {getI18n,getCookie,hasToken} from "@/assets/js/utils/tool";
  import {api_getGoods,api_getRating,api_getPFlist} from "@/assets/js/request/api"
  import { mapGetters,mapMutations } from "vuex";

  export default {
    name:'defidetails',
    data() {
      return {
        title: this.$t('axonomy.Details'),
        JS: true,
        PF: false,
        sort:0,
        item_js:{},
        items_pf:[],
        id:this.$route.query.id,
        req_js:true,  // 请求介绍接口
        req_pf:true,  // 请求评分接口
        page:1,
        page2:0,
        page_size:10,
        rating:{},
        topicid:'',
        popisshow:false,
        dislogData:{},
        locale: getI18n(),
        platform: getCookie("platform"),
        token : hasToken(),
      }
    },
    computed: {
      ...mapGetters(["showComment"])
    },
    methods: {
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      ...mapMutations({
        setShowComment:'SET_SHOWCOMMENT'
      }),
      // 删除评论
      toChangeListItemsLengthDel(ID, sIndex) {
        let a = this.items_pf[sIndex].comments.items.filter(item => {
          return item.id != ID;
        });
        this.items_pf[sIndex].comments.items = a;
      },
      // 回复数据处理
      ABC(data, sIndex) {
        this.items_pf.forEach((item, index) => {
          if (sIndex == index) {
            this.items_pf[index].comments.items = data;
          }
        });
      },
      toJS() {
        this.JS = true;
        this.PF = false;
      },
      toPF() {
        this.JS = false;
        this.PF = true;
        if(this.req_pf){
          this.getRating();
          this.getPFlist();
        }
      },
      toLinke(){
        this.popisshow = false;
        if(this.item_js.popup.url){
          window.location.href = this.item_js.popup.url;
        }
      },
      toBayJump(){
        this.popisshow = false;
        //腾讯点击上报
        let MtaH5Id = String(this.item_js.id).replace(/\-/g, "_")+'_sku';
        console.log(MtaH5Id);
        MtaH5.clickStat(MtaH5Id);
        console.log(this.item_js.type)
        if(this.item_js.type == 0){  // 购买
          this.$router.push({path:'/pay/sku', query:{goods_id:this.item_js.id}})
        }
        if(this.item_js.type == 1){  // 质押
          this.$router.push({path:'/pay/deposit', query:{goods_id:this.item_js.id}})
        }
        if(this.item_js.type == 2){  // 兑换
          this.$router.push({path:'/exchange/index', query:{goods_id:this.item_js.id}})
        }
        if(this.item_js.type == 3){//基金
          this.$router.push({path:'/fund/nbuy', query:{goods_id:this.item_js.id}});
        }
        if(this.item_js.type==4){
          this.$router.push({
            path:'/pledge/buy',
            query:{
              goods_id:this.item_js.id,
              multi:1//多币种
            }
          });
        }
        if(this.item_js.type==5){
          this.$router.push({
            path:'/pledge/buy',
            query:{
              goods_id:this.item_js.id,
              multi:0//单币种
            }
          });
        }
      },
      isThereAre(){
        let isThere = false;
        let arr = this.$storage.get('riskWarning')||[];
        arr.forEach(element => {
          if(this.id==element){
            isThere = true;
          }
        });
        return isThere;
      },
      toBuy(){
        if(!hasToken()){
          this.$router.push({
            name: 'login',
            query: {}
          });
          return;
        }
        //风险提示
        if(this.isThereAre()){
          this.toBayJump();
        }else{
          let title = (this.locale=="cn") ? "风险提示":"Risk Warning";
          let content = (this.locale=="cn") ? "数字货币本身的市场价格波动可能很剧烈，请您务必明确知晓并愿意承担相关风险。<br/>Axonomy平台中的所有产品，均由第三方开放金融服务方提供，请您仔细阅读产品服务条款，并确认产品供应方。":"Cryptocurrency’s price has high volatility, please make sure you understand and is willing to take the risk.<br/>All products on Axonomy’s platform are provided by third party financial parties.  Please confirm product details and product provider.";
          let btnText = (this.locale=="cn") ? "我已知晓投资风险":"I understand";
          this.dislogData = {
            title:title,
            content:content,
            leftBtnText:btnText,
            //rightBtnText:'确定',
            leftBtnCallBack:this.toBayJump,
            //rightBtnCallBack:this.sueFun
          };
          this.popisshow = true;
          let arr = this.$storage.get('riskWarning') || [];
          arr.push(this.id);
          this.$storage.set('riskWarning',arr);
        }
      },
      sortChange(type) {
        this.sort = type;
        this.items_pf = [];
        this.getPFlist();
      },
      // 获取产品介绍
      async getGoods() {
        const {data, code} = await api_getGoods({}, this.id)
        if(code == 200){
          this.item_js = data.data;
          this.req_js = false;
          //分享 
          this.shareInfoFun();
        }
      },
      //获取项目评分
      async getRating() {
        const {data, code} = await api_getRating({}, this.id)
        if (code == 200) {
          this.rating = data.data;
          this.req_pf = false;
        }
      },
      // 获取评分的列表
      async getPFlist() {
        const params = {
          data: {
            page: this.page2,
            page_size: this.page_size,
            sort: this.sort
          }
        };
        const {data, code} = await api_getPFlist(params, this.id)
        this.Load = false;

        if (code == 200) {
          let page_count = Math.ceil(
            data.data.total_count / this.page_size
          );
          if (this.page2 < page_count) {
            this.hasMore = true;
          } else {
            this.hasMore = false;
          }
          this.showBottomTip = true;
          if(this.hasMore){
            this.pullupMsg = this.$t('common.Loading');
          }else{
            this.pullupMsg = this.$t('common.No_more_data');
          }
          this.items_pf = this.items_pf.concat(data.data.items);
        }else{
          setTimeout(() => {
            this.Load = true;
          }, 200);
        }
      },
      shareInfoFun() {
        let self = this;
        if (self.platform == "ios" || self.platform == "android") {
          return;
        }
        let url = window.location.href;
        Share({
          title: self.item_js.name,
          link: url,
          imgUrl: 'https://img.aceport.com/goodsShareIcon.png',
          desc: self.item_js.desc,
          fn: function() {}
        });
      },
    },
    mounted(){
      if(this.req_js){
        this.getGoods();
      }
    },
    beforeDestroy(){
      this.setShowComment(false);
    },
    components: {
      Scroll,
      Score,
      dialogPop,
      replyBox
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/mixin";
  .layout {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @scroll()
  }
  .replybox{
    position: fixed;
    z-index: 1000;
  }
  .scroll {
    @scroll()
  }
  .wrapper {
    padding-bottom: 200px;
    background-color: #F9FAFB;
  }

  .head {
    background: #ffffff;
  }

  .header {
    background: #ffffff;
    padding: 43px 30px 47px;
    h4{
      font-size:30px;
      font-weight:500;
      color:rgba(51,51,51,1);
      line-height:40px;
    }
    .provider{
      font-size:25px;
      font-weight:400;
      color:rgba(167,164,182,1);
      line-height:36px;
      margin-bottom: 53px;
      margin-top: 11px;
    }

    h2 {
      padding-top: 38px;
      height: 80px;
      font-size: 80px;
      font-weight:bold;
      color: rgba(221, 79, 79, 1);
      line-height: 80px;
    }

    .box{
      display: flex;
      padding: 0;
      .right{
        border-left: 1px solid #e0e0e0;
        padding-left: 30px;
      }
      .left, .right{
        flex:1;
        h5{
          height:26px;
          font-size:26px;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:26px;
          margin-bottom: 10px;
        }
        p{
          height:80px;
          font-size:46px;
          font-weight:600;
          color:rgba(221,79,79,1);
          line-height:80px;
          margin-bottom: 0;
        }
        span{
          display: inline-block;
          //height:26px;
          font-size:25px;
          font-weight:400;
          color:rgba(167,164,182,1);
          line-height:26px;
          @changeline();
        }
      }
    }
    .tag{
      margin-top: 40px;
      span{
        display: inline-block;
        height:36px;
        background:rgba(106,78,255,0.06);
        border-radius:4px;
        border:1px solid rgba(190,179,252,1);
        font-size:22px;
        font-weight:400;
        color:rgba(106,78,255,1);
        line-height:36px;
        margin-right: 20px;
        padding: 0 12px;
      }
    }
  }

  .box {
    background: #ffffff;
    display: flex;
    padding: 23px 60px 0 20px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: column;

      p {
        margin-bottom: 3px;
      }


    }
  }
  .link{
    background-color: #fff;
    padding-left: 20px;
    padding-bottom: 23px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
    a {
      color: #4A90E2;
    }
  }
  .contain {
    //padding-top: 18px;
    padding:10px 0 0 0;
  }
  .introduce img{
    width: 92%;
    height: auto;
    margin: 0 auto;
    display: block;
  }
  .tag {

    background: #ffffff;

    div {
      display: flex;
      justify-content: center;
    }

    p {
      height: 82px;
      line-height: 82px;
      font-size: 34px;
      font-weight: 400;
      color: rgba(152, 149, 172, 1);
      &:nth-of-type(1){
        margin-right: 68px;
      }
      &:nth-of-type(2){
        margin-left: 68px;
      }
      &.active {
        font-weight: 600;
        color: #333333;
        border-bottom: 6px solid #333333;
      }
    }

  }
  .pf{
    padding: 0 30px;
  }
  .btn {
    position: fixed;
    z-index: 10;
    bottom: 40px;
    left: 30px;
    border-radius: 44px;
    width: 92%;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-weight: 600;
    color: #ffffff;
    font-size: 32px;
    background: linear-gradient(90deg, rgba(213, 212, 221, 1) 0%, rgba(152, 149, 172, 1) 100%);

    &.btn_start {
      background: linear-gradient(90deg, rgba(158, 141, 255, 1) 0%, rgba(106, 78, 255, 1) 100%);
    }
  }
</style>
