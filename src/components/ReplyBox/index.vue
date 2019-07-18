<template>
  <div class="replybox">
    <div class="mask" @click="del_close">
      <!--点击发表评论按钮-->
      <div>
        <div class="wrap" v-if="newComment" @click.stop>
          <div class="clickToReply">
            <textarea
              autofocus="autofocus"
              :placeholder="$t('project.Express_Your_Opinion')"
              maxlength="1000"
              v-model="text"
              @input="checkLength"
              ref="js_textarea"
              v-on:blur="inputOnBulr"
            ></textarea>
          </div>
          <span
            class="submit"
            :class="{'active':canSubmit}"
            @click.stop="To_submit"
          >{{$t('project.btn_Post')}}</span>
          <i class="num" :class="{'active':isOver}">{{num}}</i>
        </div>
        <!--点击回复按钮-->
        <div class="wrap" v-if="toReply" @click.stop>
          <div class="clickToReply">
            <textarea
              autofocus="autofocus"
              :placeholder="userName"
              maxlength="1000"
              v-model="text"
              @input="checkLength"
              ref="js_textarea"
              v-on:blur="inputOnBulr"
            ></textarea>
          </div>
          <span
            class="submit"
            :class="{'active':canSubmit}"
            @click="To_submit"
          >{{$t('project.btn_Post')}}</span>
          <i class="num" :class="{'active':isOver}">{{num}}</i>
        </div>
        <!--点击自己的评论-->
        <div class="wrap2" v-if="selfComment">
          <span class="delete" @click.stop="To_delete($event)">{{$t('project.pop_Delete')}}</span>
          <span class="cancel" @click="del_close">{{$t('project.pop_Cancel')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getByteLen, isIOS, isAndroid, isWeiXin } from "@/assets/js/utils/tool";
import {api_toSubmit} from "@/assets/js/request/api"

import { Toast } from "vant";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "index",
  data() {
    return {
      text: "",
      num: 0, //显示记录的数字
      isOver: false, //字数是否超出
      canSubmit: false, //是否能发布
      userName: "",
      cachData: "",
      timer: 0,
      isIos: ""
    };
  },
  computed:{
      ...mapGetters([
      "showComment",
      "newComment",
      "toReply",
      "selfComment",
      "plugArguments",
      "commit_index"
    ]),
  },
  created() {
  },
  methods: {
    toDou(item){
      return item<10?'0'+item:item
    },
    getTime(date){
      return `${date.getFullYear()}/${this.toDou(date.getMonth()+1)}/${this.toDou(date.getDate())} ${this.toDou(date.getHours())}:${this.toDou(date.getMinutes())}`
    },
    ...mapMutations({
        setShowComment:'SET_SHOWCOMMENT'
    }),
    checkLength() {
      let len = getByteLen(this.text);
      this.num = len;
      //是否能发布
      if (this.text.trim() != "") {
        this.canSubmit = true;
      } else {
        this.canSubmit = false;
      }
      //字数是否超出
      if (len > 1000) {
        this.isOver = true;
      } else {
        this.isOver = false;
      }
    },
    //关闭
    del_close(){
      this.setShowComment(false);
    },
    // 发布观点
    async To_submit() {
       // 获取当前时间
       var date = new Date();
       let time = this.getTime(date);
      if (this.canSubmit) {
        this.canSubmit = false;
        const params = {
          data: {
            content: this.text
          }
        }
        const {data,code} = await api_toSubmit(params, this.plugArguments.ID);
        if (code == 200) {
          this.canSubmit = true;
          let __list = [];
          if (
            this.plugArguments.othersINfoData &&
            this.plugArguments.othersINfoData.id
          ) {
            __list = [
              {
                author: {
                  avatar:this.plugArguments.mySelfInfoData.avatar,
                  id: this.plugArguments.mySelfInfoData.user_id,
                  name: this.plugArguments.mySelfInfoData.username,
                  country:{
                    icon:this.plugArguments.mySelfInfoData.flag
                  }
                },
                create_at_str:time,
                content: this.text,
                i_delete: 1,
                id: data.data.id,
                refer_comment: {
                  id:'1232',
                  author: {
                    id: this.plugArguments.othersINfoData.id,
                    name: this.plugArguments.othersINfoData.name,
                    country:{
                    }
                  }
                }
              }
            ];
          } else {
            __list = [
              {
                author: {
                  avatar:this.plugArguments.mySelfInfoData.avatar,
                  id: this.plugArguments.mySelfInfoData.user_id,
                  name: this.plugArguments.mySelfInfoData.username,
                  country:{
                    icon:this.plugArguments.mySelfInfoData.flag
                  }
                },
                create_at_str:time,
                i_delete: 1,
                id: data.data.id,
                content: this.text,
                refer_comment: null
              }
            ];
          }
          this.cachData = this.plugArguments.cachListCommentItems.items.concat(
            __list
          );
          this.$emit("toChangeListItems", this.cachData, this.commit_index);
          this.text = ""; //清空
          // 提交成功后需要让reply-box消失
          this.setShowComment(false);
          //this.$store.state.showComment = false; // 感觉两种都可以. 不推荐使用 mapAction 只传递一个值的改变
          Toast(data.message);
        }
      }
    },
    // 删除自己的评论
    To_delete() {
      this.$mayAjax({
        method: "DELETE",
        url: "/api/v1/comment/" + this.plugArguments.ID,
        success: function(e) {
          if (e.data.code == 200) {
            e.__this.$emit(
              "toChangeListItemsLengthDel",
              e.__this.plugArguments.ID ,
              e.__this.commit_index
            );
          }
          e.__this.setShowComment(false);
          Toast(e.data.message);
        },
        failed: function(e) {
          Toast(e.data.message);
        }
      });
    },
    inputOnFocus() {
      let dom = this.$refs.js_textarea;
      if (!dom) {
        return;
      }
      dom.focus();
    },
    inputOnBulr() {
      //this.closeMask();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.isIos = isIOS();
      this.userName =
        this.$t("project.pop_Reply_X").replace("X", this.plugArguments.othersINfoData.name) +
        ":";
      this.inputOnFocus();
    });
  }
};
</script>

<style lang="less" scoped>
.mask {
  position: fixed;
  z-index: 6666;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .replyList {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .wrap {
    display: flex;
    position: fixed;
    z-index: 7777;
    bottom: 0;
    width: 100%;
    background-color: #fafafa;
    border-top: 1px solid #a7a4b6;
    span {
      &.submit {
        margin-top: 136px;
        height: 60px;
        font-size: 30px;
        font-weight: 400;
        color: rgba(167, 164, 182, 1);
        line-height: 60px;
      }
      &.active {
        color: #6a4eff;
      }
    }
    i {
      &.num {
        position: absolute;
        top: 20px;
        right: 30px;
        font-style: normal;
        height: 34px;
        font-size: 24px;
        font-weight: 400;
        color: rgba(167, 164, 182, 1);
        line-height: 34px;
      }
      &.active {
        color: #ff4646;
      }
    }
  }
  //点击回复按钮
  textarea {
    width: 600px;
    height: 180px;
    margin: 16px 30px;
    resize: none;
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 40px;
    font-size: 30px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 48px;
    border: 1px solid #e0ddee;
    border-radius: 3px;

    textarea::-webkit-input-placeholder {
      color: #e0ddee;
    }
    textarea::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #e0ddee;
    }
    textarea:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #e0ddee;
    }
    textarea:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #e0ddee;
    }
  }
  //点击自己评论
  .wrap2 {
    position: fixed;
    z-index: 2000;
    bottom: 0;
    width: 100%;
    background-color: #fafafa;
    .delete,
    .cancel {
      display: block;
      width: 100%;
      height: 120px;
      background: #ffffff;
      text-align: center;
      line-height: 120px;
      font-weight: 400;
      font-size: 34px;
    }
    .delete {
      display: block;
      color: #e84848;
      margin-bottom: 10px;
    }
    .cancel {
      color: #333333;
    }
  }
  input,
  textarea {
    -webkit-appearance: none;
  }
}
</style>
