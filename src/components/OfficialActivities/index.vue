<template>
  <div @click="To_detail" class="activityBox">
    <div class="head" v-if="list.type!=2">
      <img class="avatar" :src="list.author.avatar" @click.stop="jumpHome(list.author.id)">
      <div class="title">
        <div class="user">
          {{list.author.name}}
          <img
            v-if="list.author.is_official"
            src="../../assets/img/trends/v.png"
          >
          <img v-else-if="list.author.is_kol" src="../../assets/img/trends/kol.png">
          <img v-if="list.author.country.icon" class="country" :src="list.author.country.icon">
        </div>
        <span>{{list.create_at_str}}</span>
      </div>
    </div>
    <div class="head" v-else>
      <img class="avatar" :src="list.project.logo" @click.stop="jumpProject(list.project.id)">
      <div class="title">
        <div class="user">{{list.project.name}}</div>
        <span>{{list.create_at_str}}</span>
      </div>
    </div>
    <star v-if="score>=0" class="star" :score="score" :size="36"></star>
    <h4 v-if="true">{{list.title}}</h4>
    <div class="wrap">
      <div class="txt2" v-html="changeHtml(list.content,list.format)"></div>
    </div>
    <div class="dianzan">
      <div class="trans" v-if="list.lang!='nol'&&list.lang!=lang" @click.stop="To_detail(lang)">{{$t('common.View_Translation')}}</div>
      <div v-else></div>
      <div>
        <span class="zan" :class="{'active':hasZan}" @click.stop="likeFun"></span>
        <span class="msg" @click.stop="writeComment(list.comments)"></span>
      </div>
    </div>
    <!--觉得赞-->
    <div class="feelgood" v-if="userArr.length">
      <span class="zan" :class="{'active':list.likes.total_count>0?true:false}"></span>
      <div>
        <span>
          <a
            @click.stop="jumpHome(likes_item.user_id)"
            v-for="(likes_item,index) in userArr"
            :key="index"
          >
            <i v-if="index!=userArr.length-1" v-html="subStrFun(likes_item.user_name,',')"></i>
            <i v-else v-html="subStrFun(likes_item.user_name,'')"></i>
          </a>
          <b
            v-if="list.likes.total_count>10"
          >{{$t('project.and')}} {{totalCount}} {{$t('project.others_liked')}}</b>
          <b v-else>{{$t('project.tip_Liked_by_X')}}</b>
        </span>
      </div>
    </div>
    <!--评论-->
    <div class="comment">
      <ul>
        <li v-for="comment_item in list.comments.items.slice(0,10)">
          <!--是否有回复别人-->
          <div
            v-if="comment_item.refer_comment&&comment_item.refer_comment.author"
            @click.stop="isSelfComment(comment_item,comment_item.id,$event,list.comments)"
          >
            <a
              @click.stop="jumpHome(String(comment_item.author.id))"
              v-html="subStrFun(comment_item.author.name)"
            ></a>
            <b>回复</b>
            <a
              @click.stop="jumpHome(String(comment_item.refer_comment.author.id))"
              v-html="subStrFun(comment_item.refer_comment.author.name)"
            ></a> :
            <span v-html="comment_item.content"></span>
          </div>
          <!--是否有评论-->
          <div
            v-else="comment_item.author"
            @click.stop="isSelfComment(comment_item,comment_item.id,$event,list.comments)"
          >
            <a
              @click.stop="jumpHome(String(comment_item.author.id))"
              v-html="subStrFun(comment_item.author.name)"
            ></a> :
            <span v-html="comment_item.content"></span>
          </div>
        </li>
      </ul>
      <router-link
        class="more"
        v-if="commentlength>10"
        :to="{path:'/project/score_detail', query:{view_id:list.id,type:list.type}}"
      >{{$t('project.tip_See_More')}}</router-link>
    </div>
  </div>
</template>

<script>
import star from "@/components/Star";
// import marked from "marked";
import { Toast } from "vant";
import { mapActions, mapState, mapGetters } from "vuex";
import {getCookie,hasToken,getI18n} from "@/assets/js/utils/tool";
//import func from './vue-temp/vue-editor-bridge';
export default {
  data() {
    return {
      lang:getI18n(),
      commentData: [], //评论数据
      hasZan: false, // 是否有点赞
      page: 0,
      page_size: 20,
      score: 0, // 真实的 rating/2 数字
      userArr: this.list.likes.items, // 觉得赞的用户
      totalCount: this.list.likes.total_count, //数目
      commentlength: "",
      isSendMeta: false,
      canDZ: true, // 是否能点赞
      token:hasToken(),
    };
  },
  props: ["list", "project_id", "index"], //2、 list : 传入的评价列表
  components: {
    star
  },
  computed: {},
  methods: {
    ...mapGetters([
      "showComment",
      "newComment",
      "toReply",
      "selfComment",
      "plugArguments"
    ]),
    ...mapActions(["selectReply"]),
    subStrFun(str, biao) {
      biao = biao || "";
      str = str.substr(0, 9);
      return str + biao;
    },
    //获取自己的名称和ID
    getMyInfo() {
      if (!this.token) {
        return;
      }
      if (this.$storage.get("isSendMeta")) {
        this.plugArguments.mySelfInfoData = this.$storage.get("isSendMeta");
        return false;
      }
      this.$mayAjax({
        data: {},
        url: "/public/user/meta",
        success: function(e) {
          if (e.data.code == "200") {
            e.__this.plugArguments.mySelfInfoData = e.data.data;
            e.__this.$storage.set("isSendMeta", e.data.data);
          }
        }
      });
    },
    //点击点赞
    likeFun() {
      //判断是否登录
      if (!this.token) {
        this.$router.push({
          name: "login",
          query: {
            pagefrom: "trends",
            argument: this.$objToStr(this.$route.query)
          }
        });
        return false;
      } else {
        if (this.hasZan) {
          //取消点赞
          this.$mayAjax({
            method: "delete",
            data: {},
            url: "/api/v1/resource/" + this.list.id + "/likes",
            success: function(e) {
              if (e.data.code == 200) {
                e.__this.hasZan = false;
                e.__this.totalCount--;
                // 点赞用户减一位
                e.__this.userArr = e.__this.userArr.filter(user => {
                  return (
                    user.user_id !=
                    e.__this.plugArguments.mySelfInfoData.user_id
                  );
                });
              }
            }
          });
        } else {
          //点赞
          if (this.canDZ) {
            this.canDZ = false;
            this.$mayAjax({
              method: "post",
              data: {},
              url: "/api/v1/resource/" + this.list.id + "/likes",
              success: function(e) {
                if (e.data.code == "200") {
                  e.__this.canDZ = true;
                  e.__this.hasZan = true;
                  e.__this.totalCount++;
                  // 点赞用户增加一位
                  e.__this.userArr.unshift({
                    user_id: e.__this.plugArguments.mySelfInfoData.user_id,
                    user_name: e.__this.plugArguments.mySelfInfoData.username
                  });
                }
              },
              failed: function(e) {
                e.__this.canDZ = true;
              }
            });
          }
        }
      }
    },
    //写评论
    writeComment(arr) {
      if (!this.token) {
        this.$router.push({
          name: "login",
          query: {
            pagefrom: "trends",
            argument: this.$objToStr(this.$route.query)
          }
        });
        return false;
      } else {
        this.showComment = true;
        this.newComment = true; //新建评论
        this.toReply = false;
        this.selfComment = false;
        this.plugArguments.ID = this.list.id;
        this.plugArguments.othersINfoData = "";
        this.plugArguments.cachListCommentItems = arr;

        let obj = {
          showComment: this.showComment,
          newComment: this.newComment,
          toReply: this.toReply,
          selfComment: this.selfComment,
          plugArguments: this.plugArguments
        };
        this.selectReply({
          list: obj,
          index: this.index
        });
      }
    },
    // 判断是否是自己的评论
    isSelfComment(item, id, $event, arr) {
      if (item.i_delete == 1) {
        //证明是自己的评论，此时可以删除
        this.showComment = true;
        this.newComment = false;
        this.toReply = false;
        this.selfComment = true;
        this.plugArguments.ID = item.id;
        this.plugArguments.othersINfoData = [];
      } else {
        // 不是自己的，可以回复别人
        this.showComment = true;
        this.newComment = false;
        this.toReply = true;
        this.selfComment = false;
        this.plugArguments.ID = id;
        this.plugArguments.othersINfoData = item.author;
        this.plugArguments.cachListCommentItems = arr;
      }
      let obj = {
        showComment: this.showComment,
        newComment: this.newComment,
        toReply: this.toReply,
        selfComment: this.selfComment,
        plugArguments: this.plugArguments
      };
      this.selectReply({
        list: obj,
        index: this.index
      });
    },
    //跳转home页面
    jumpHome(id) {
      if (!id) {
        return;
      }
      this.$router.push({ path: "/home?user_id=" + id });
    },
    jumpProject(id, lang) {
      if (!id || id == "45") {
        return;
      }
      this.$router.push({ path: "/project/details?project_id=" + id});
    },
    // 跳转详情页
    To_detail(lang) {
      if(typeof lang !="string"){
        this.$router.push({
          path: "/project/score_detail",
          query: { view_id: this.list.id, type: this.list.type }
        });
      }else{
        this.$router.push({
          path: "/project/score_detail",
          query: { view_id: this.list.id, type: this.list.type, lang }
        });
      }
    },
    //转化成html格式
    changeHtml(content, type) {
      let _html = "";
      if (type == 2 || type == 1) {
        _html = content;
      }
      if (type == 3) {
        _html = marked(content, { sanitize: true });
      }
      return _html;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.score = this.list.rating / 2;
      this.hasZan = this.list.i_like ? true : false;
      this.getMyInfo();
      this.commentlength = this.list.comments.items.length;
    });
  },
  updated() {
    let doms = document.querySelectorAll(".txt2 img");
    if (doms.length <= 0) {
      return;
    }
    for (var i = doms.length - 1; i >= 0; i--) {
      doms[i].style.cssText =
        "margin:0 auto;display:block;max-width:10rem;max-height:10rem;";
    }
  }
};
</script>

<style lang="less" scoped>
  @import "~@/assets/less/mixin";
.activityBox {
  background-color: #ffffff;
  padding: 30px;
  box-shadow: 0px 5px 30px 0px rgba(232, 230, 242, 1);
  border-radius: 10px;
  margin-bottom: 20px;
  .head {
    display: flex;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-size: 100% 100%;
    }
    .title {
      margin-left: 9px;
      .user {
        display: flex;
        height: 24px;
        font-size: 24px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 24px;
        margin-bottom: 10px;
        img {
          display: block;
          width: 24px;
          height: 24px;
          margin-left: 9px;
        }
        .country {
          // width: 30px;
          height:auto;
          display: inline-block;
        }
      }
      span {
        display: block;
        height: 24px;
        font-size: 24px;
        font-weight: 400;
        color: #a7a4b6;
        line-height: 24px;
        letter-spacing: 1px;
      }
    }
  }
  h4 {
    margin-top: 32px;
    font-size: 36px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 46px;
  }
  .star {
    margin-top: 20px;
  }
  .txt2 {
    margin-top: 20px;
    font-size: 30px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 46px;
    letter-spacing: 2px;
  }
  .dianzan {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .trans {
      color: rgba(153, 153, 153, 1);
    }
    span {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-right: 60px;
      background-size: 100% 100%;
      &.zan {
        .bg-image("../../assets/img/official/zan_off");
      }
      &.active {
        .bg-image("../../assets/img/official/zan");
      }
      &.msg {
        margin-right: 0;
        .bg-image("../../assets/img/official/message");
      }
    }
  }
  .feelgood {
    margin-top: 22px;
    display: flex;
    i {
      font-style: normal;
    }
    .zan {
      flex: 0 0 30px;
      margin-top: 4px;
      width: 30px;
      height: 30px;
      margin-right: 20px;
      .bg-image("../../assets/img/official/zan");
      background-size: 100% 100%;
    }
    div {
      font-size: 30px;
      font-weight:bold;
      color: rgba(129, 122, 168, 1);
      line-height: 40px;
      letter-spacing: 2px;
      b {
        color: #333333;
        font-weight: normal;
        word-wrap: break-word;
        word-break: normal;
      }
    }
  }
  .comment {
    //margin-right: 50px;
    margin-top: 12px;
    li {
      font-size: 30px;
      font-weight: 400;
      color: rgba(129, 122, 168, 1);
      line-height: 36px;
      letter-spacing: 2px;
      word-break: normal;
      word-wrap: break-word;
      margin-bottom: 12px;
      span {
        color: #333333;
      }
      a {
        color: #817aa8;
      }
      b {
        font-weight: normal;
        color: #333333;
      }
    }
    .more {
      display: block;
      height: 100px;
      line-height: 100px;
      font-size: 30px;
      font-weight:bold;
      letter-spacing: 1px;
      color: rgba(129, 122, 168, 1);
    }
  }
}
</style>
