<template>
  <div class="score">
    <div class="top">
      <div class="left">
        <div class="has_score" v-if="rating.rating>0">
          <h3>{{rating.rating}}</h3>
          <star :score="score" :size="36"></star>
        </div>
        <div class="no_score" v-else>{{$t('project.No_Ratings')}}</div>
      </div>
      <div class="right">
        <ul>
          <li>
            <div class="left">
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
            </div>
            <div class="right">
              <span :style="{width:liLen(0)}"></span>
            </div>
          </li>
          <li>
            <div class="left">
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
            </div>
            <div class="right">
              <span :style="{width:liLen(1)}"></span>
            </div>
          </li>
          <li>
            <div class="left">
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
            </div>
            <div class="right">
              <span :style="{width:liLen(2)}"></span>
            </div>
          </li>
          <li>
            <div class="left">
              <span class="iconfont icon-xingxing"></span>
              <span class="iconfont icon-xingxing"></span>
            </div>
            <div class="right">
              <span :style="{width:liLen(3)}"></span>
            </div>
          </li>
          <li>
            <div class="left">
              <span class="iconfont icon-xingxing"></span>
            </div>
            <div class="right">
              <span :style="{width:liLen(4)}"></span>
            </div>
          </li>
        </ul>
        <span class="num" v-if="rating.total_count && rating.total_count>20">{{Rating}}</span>
        <span class="num" v-else>{{$t('project.Less_than_20_Ratings')}}</span>
      </div>
    </div>
    <div class="toast">
      <i></i>
      <p>{{$t('project.KYC_users_can_rate_multiple_times_according_with_project_prog')}}</p>
    </div>
    <div class="tag">
      <div class="left">
        <div class="default-select" @click.stop.prevent="selectType">
          {{selectedName}}
          <i class="icon"></i>
        </div>
        <div class="slt_list" v-if="showSelect">
          <span @click="selectByType(1)">{{$t('subject_01.Latest_reply')}}</span>
          <span @click="selectByType(0)">{{$t('project.Newest')}}</span>
          <span @click="selectByType(2)">{{$t('project.Hottest')}}</span>
        </div>
      </div>
      <div class="right">
        <i></i>
        <span @click="To_pf">{{$t('project.Rate_')}}</span>
      </div>
    </div>
    <div class="item_list" v-for="(item,index) in items">
      <offcial-activity :list="item" :project_id="project_id" :index="index"></offcial-activity>
    </div>
    <!--无评分-->
    <div class="txt" v-if="!items.length">{{$t('project.Be_the_First_to_Rate')}}</div>
    <div class="kycWindow" v-if="isShowRatWindow" @click="hideRatWindowFun">
      <div class="inner">
        <p class="des">
          <img
            src="../../assets/img/newProject/alert_cn.jpg"
            alt
            v-if="this.$storage.get('locale') == 'cn'"
          >
          <img src="../../assets/img/newProject/alert_en.jpg" alt v-else>
        </p>
        <p class="kycbtn">
          <span class="esc" @click="jumpPublishStar" v-if="this.$storage.get('locale') == 'cn'">直接评分</span>
          <span class="esc" @click="jumpPublishStar" v-else>Rate</span>
          <span class="sue" @click="jumpAvStar" v-if="this.$storage.get('locale') == 'cn'">有奖评分</span>
          <span class="sue" @click="jumpAvStar" v-else>Reward Rating</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import star from "./star/star";
import OffcialActivity from "./official_activities/index";
import {getCookie,hasToken} from "@/assets/js/utils/tool";
import {api_getMyInfo} from "@/assets/js/request/api"
export default {
  props: ["project_id", "rating", "items", "topicid"],
  data() {
    return {
      mySelfInfoData: {}, // 个人信息
      //Rating:0,
      isShowRatWindow: false,
      selectedName: this.$t("subject_01.Latest_reply"),
      showSelect: false,
      sort: 1,
      map: {
        "0": this.$t("project.Newest"),
        "2": this.$t("project.Hottest"),
        "1": this.$t("subject_01.Latest_reply")
      },
      token:hasToken(),
      title:this.$route.query.title
    };
  },
  methods: {
    hideRatWindowFun() {
      this.isShowRatWindow = false;
    },
    //获取自己的名称和ID
    async getMyInfo() {
      const {data,code} = await api_getMyInfo();
      if (!this.token) {
        return;
      }
      if (code == "200") {
        this.mySelfInfoData = data.data;
      }
    },
    To_pf() {
      //判断是否登录
      if (!this.token) {
        this.$router.push({
          name: "login",
          query: {
            pagefrom: "details",
            argument: this.$objToStr(this.$route.query)
          }
        });
        return false;
      } else {
        if (this.mySelfInfoData && this.mySelfInfoData.user_id) {
          if (this.topicid) {
            this.isShowRatWindow = true;
          } else {
            this.$router.push({
              path: "/project/give_stars",
              query: { project_id: this.project_id , title: this.title}
            });
          }
          //先注释掉
          // if(this.mySelfInfoData.kyc == 1){
          //   // kyc 认证
          //   if( this.topicid ){
          //     this.isShowRatWindow = true;
          //   }else{
          //     this.$router.push({path:'/project/give_stars', query:{project_id:this.project_id}});
          //   }
          // }else{
          //   this.$router.push({path:'/robotKyc'})
          // }
        }
      }
    },
    jumpPublishStar() {
      this.$router.push({
        path: "/project/give_stars",
        query: { project_id: this.project_id }
      });
    },
    jumpAvStar() {
      this.$router.push({ path: "/projectTopics" });
    },
    selectType() {
      this.showSelect = true;
    },
    selectByType(type) {
      this.showSelect = false;
      this.selectedType = type;
      this.selectedName = this.map[type];
      this.sort = type;
      this.$emit("sortChange", this.sort);
    }
  },
  mounted() {
    this.getMyInfo();
  },
  computed: {
    score() {
      return this.rating.rating / 2;
    },
    liLen() {
      return function(rate) {
        if (this.rating.dist&&this.rating.dist.length <= 0) {
          return false;
        }
        return this.rating.dist && this.rating.dist[rate].ratio * 100 + "%";
      };
    },
    Rating() {
      return this.$t("project.X_Ratings").replace("X", this.rating.total_count);
    }
  },
  components: {
    star,
    OffcialActivity,

  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/font.less";
.score {
  margin-top: 20px;
  .default-select {
    height: 48px;
    font-size: 34px;
    font-weight: 400;
    color: #333;
    line-height: 48px;
    margin-right: 6px;
    .icon {
      width: 24px;
      height: 24px;
      margin-top: 12px;
      margin-left: 16px;
      vertical-align: top;
      //background: url(../../assets/img/down.png) no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
  .slt_list {
    position: absolute;
    top: 0;
    span {
      z-index: 1;
      background: #fff;
      color: #000000;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
      box-sizing: border-box;
      display: block;
      width: 150px;
      height: 60px;
      font-size: 34px;
    }
  }

  .top {
    display: flex;
    justify-content: space-between;
    .left {
      .has_score {
        h3 {
          height: 96px;
          font-size: 120px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          line-height: 96px;
          margin-bottom: 24px;
        }
      }
      .no_score {
        height: 104px;
        font-size: 28px;
        font-weight: 400;
        color: rgba(167, 164, 182, 1);
        line-height: 104px;
        padding: 0 40px;
        background: rgba(239, 237, 246, 1);
        border-radius: 12px;
        opacity: 0.5299;
      }
    }
    .right {
      font-size: 0;
      li {
        display: flex;
        justify-content: flex-end;
        //margin-bottom: 6px;
        .left {
          text-align: right;
          width: 100px;
          .icon-xingxing {
            display: inline-block;
            font-size: 20px;
            width: 20px;
            height: 20px;
            color: #e0ddee;
          }
        }

        .right {
          margin-top: 12px;
          width: 340px;
          height: 10px;
          background: #e0ddee;
          margin-left: 10px;
          border-radius: 2px;
          span {
            border-radius: 2px;
            display: block;
            width: 200px;
            height: 10px;
            background: #f5a623;
          }
        }
      }
      .num {
        display: block;
        margin-top: 22px;
        text-align: right;
        height: 36px;
        font-size: 26px;
        font-weight: 400;
        color: rgba(167, 164, 182, 1);
        line-height: 36px;
      }
    }
  }
  .toast {
    display: flex;
    margin-top: 42px;
    i {
      flex: 0 0 26px;
      width: 26px;
      height: 26px;
      //background-image: url("../../assets/img/program_official/wenhao.png");
      background-size: 100% 100%;
      margin-right: 4px;
      margin-top: 4px;
    }
    p {
      font-size: 24px;
      line-height: 34px;
      font-weight: 400;
      color: rgba(167, 164, 182, 1);
      white-space: normal;
    }
  }
  .tag {
    margin-top: 40px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    i,
    span {
      display: inline-block;
    }
    .left {
      font-size: 0;
      position: relative;
      span {
        height: 48px;
        font-size: 34px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 48px;
      }
      i {
        margin-left: 8px;
        margin-top: 12px;
        width: 24px;
        height: 24px;
      }
    }
    .right {
      i {
        width: 30px;
        height: 30px;
        //background-image: url("../../assets/img/program_official/btn.png");
        background-size: 100% 100%;
        margin-top: 10px;
      }
      span {
        height: 34px;
        font-size: 34px;
        font-weight:bold;
        color: rgba(106, 78, 255, 1);
        line-height: 52px;
        float: right;
        margin-left: 2px;
      }
    }
  }
  .txt {
    height: 200px;
    font-size: 24px;
    font-weight: 400;
    color: rgba(167, 164, 182, 1);
    line-height: 200px;
    text-align: center;
  }
  .kycWindow {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .inner {
      width: 600px;
      height: 510px;
      text-align: center;
      font-size: 34px;

      position: fixed;
      top: 50%;
      left: 50%;
      margin-top: -255px;
      margin-left: -300px;
      .des {
        background-color: #fff;
        color: #333;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        img {
          width: 600px;
          height: 422px;
          overflow: hidden;
          display: block;
        }
      }
      .kycbtn {
        height: 88px;
        line-height: 88px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        overflow: hidden;
        .esc {
          background-color: #fff;
          width: 50%;
          text-align: center;
          color: #333;
          font-size: 32px;
          float: left;
        }
        .sue {
          width: 50%;
          background: rgba(106, 78, 255, 1);
          border-radius: 0px 0px 8px 0px;
          color: #fff;
          font-size: 32px;
          float: left;
        }
      }
    }
  }
}
</style>
