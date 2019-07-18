<template>
  <div>
    <div class="layout" @click="areaCode_active = false">
      <div class="top"></div>
      <div class="close" @click="closePage">{{$t('reg.Close')}}</div>
      <div class="navbar">
        <span :class="{'active':class_active}" @click="to_Phone_Login">{{$t('reg.Mobile')}}</span>
        <span :class="{'active':!class_active}" @click="to_Email_Login">{{$t('reg.Email')}}</span>
      </div>

      <div class="login-box">
        <!--手机号-->
        <div v-if="!e_active" class="phone noraml">
          <span class="p_code" @click="getAreaCode">{{area_code}}</span>
          <input type="tel" maxlength="11" :placeholder="$t('reg.Your_Mobile_Number')" v-model="target">
          <i v-if="close" class="close" @click="clearnum"></i>
        </div>
        <!--手机区号-->
        <!--<ul v-if="areaCode_active" class="areacode">-->
        <!--<li v-for="item in areaCode_data" @click="changeAreaCode(item)">-->
        <!--{{item.area}} - {{item.code}}-->
        <!--</li>-->
        <!--</ul>-->

        <!--邮箱账号-->
        <div v-if="e_active" class="phone noraml">
          <input type="text" :placeholder="$t('reg.Your_Email_Address')" v-model="target">
          <i v-if="close" class="close" @click="clearnum"></i>
        </div>
        <!--短信验证码-->
        <div v-if="!active" class="message">
          <div class="msg noraml">
            <input type="text" :placeholder="$t('reg.Verification_Code')" maxlength="6" v-model="verification_code">
          </div>
          <span v-show="sendAuthCode" @click="getAuthCode">{{$t('reg.Send_Code')}}</span>
          <span v-show="!sendAuthCode">{{auth_time}}s</span>
        </div>
        <!--密码-->
        <div v-if="active" class="phone noraml password">
          <input type="password" :placeholder="$t('reg.Your_Password')" ref="password" v-model="password">
          <i v-if="pass_type" class="show" @click="changePassType"></i>
          <i v-if="!pass_type" class="hide" @click="changePassType"></i>
        </div>
        <!--邀请码-->
        <div v-if="registered==0 && yqm" class="phone noraml yqm">
          <span class="p_code">{{$t('reg.Invitation_Code')}}</span>
          <input type="text" :placeholder="$t('reg.Optional')" v-model="invitation_code">
          <i v-if="err_yqm" class="warning">{{$t('reg.Error')}}</i>
        </div>

        <div class="login_btn" @click="login">
          {{$t('reg.LOGIN_AXONOMY')}}
        </div>
        <div class="use_pass">
          <span v-if="!active" class="forget_pass"> </span>   <!--保证flex布局-->
          <span v-if="!active" @click="To_passlogin">{{$t('reg.Use_Password')}}</span>
          <span v-if="active" @click="To_yzmlogin">{{$t('reg.Use_SMS_Code')}}</span>
        </div>

      </div>
      <div class="bottom">
        <!--
        <div class="other_login">
          <div>
            <span class="to_wx"></span>
            <span class="to_telegram"></span>
          </div>
        </div>
        -->
        <div class="agree">
          <span>{{$t('reg.Agree_With')}}</span> <a :href="$t('setting.User_Service_Protocol_File')">{{$t('reg.Axonomy_s_User_Protocol')}}</a>
        </div>
      </div>
    </div>
    <areaCode
        v-if="areaCode_active"
        :data="areaCode_data"
        @close="closeAreaCode"
        @choose="changeAreaCode"
    />
  </div>

</template>

<script>
  import {Toast} from 'vant';
  import {
    api_getAreaCode,
    api_getCountryCode,
    api_getAuthCode,
    api_getUserInfo,
    api_register,
    api_login
  } from '@/assets/js/request/api'
  import areaCode from '@/components/areaCode'
  import {setCookie} from '@/assets/js/utils/tool'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'login',
    data() {
      return {
        class_active: true,
        e_active: false, // 邮箱 输入框状态
        areaCode_active: false,
        active: false,  //各种 输入框状态切换
        pass_type: false, //密码状态 默认不可见
        close: false, //输入手机号
        sendAuthCode: true,
        auth_time: 180,
        err_yqm: false,
        invitation_code: this.$route.query.invite || '', //邀请码
        type: 0,   // 0- 手机号， 1- 邮箱
        password: '', // 密码
        areaCode_data: [],  // 手机区号与地区
        target: '',   // 手机号、邮箱
        verification_code: '',   // 输入 获取到得验证码
        area_code: "0086",  // 区号
        fp: '', //	验证码指纹
        registered: null,  //0：新用户；>0: 已注册用户
        login_type: 0,    // 默认是验证码登录 ,需要密码登录的时候 type = 1
        yqm: false,
        auth_timetimer: ''
      }
    },
    watch: {
      target: function (newVlue, oldValue) {
        if (newVlue != '') {
          this.close = true;
        } else {
          this.close = false;
        }
      }
    },
    computed: {
      ...mapGetters(["locale","token"])
    },
    methods: {
      ...mapMutations({setUserInfo: 'SET_USERINFO', login_in:'LOGIN_IN'}),
      closePage() {
        this.$router.push({
          path: '/defi',
          query: {}
        });
      },
      //获取手机区号与地区
      async getAreaCode() {
        const {data} = await api_getAreaCode()
        const newArr = []
        const obj = {};
        data.map((item, index) => {
          let char = item.area.substr(0, 1); // 中 、美
          if (obj.hasOwnProperty(char)) {
            obj[char].push(item);
          } else {
            obj[char] = [item];
          }
        })

        function sortChinese(arr) { // 参数： 排序的数组
          arr.sort(function (item1, item2) {
            return item1.localeCompare(item2, 'zh-CN');
          })
          return arr;
        }

        const keys = sortChinese(Object.keys(obj));
        for (let key in keys) {
          newArr.push({
            index: keys[key],
            items: obj[keys[key]]
          })
        }
        this.areaCode_data = newArr;
        this.areaCode_active = true;
      },
      closeAreaCode() {
        this.areaCode_active = false;
      },
      // 更改手机号和地区
      changeAreaCode(code) {
        this.area_code = code;
        this.areaCode_active = false;
      },
      mySetInterval() {
        clearInterval(this.auth_timetimer);
        this.auth_time = 180;
        this.auth_timetimer = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            this.auth_time = 180;
            clearInterval(this.auth_timetimer);
          }
        }, 1000);
      },
      // 获取验证码
      async getAuthCode() {
        // console.log(this.invitation_code);
        if (this.type === 0) {
          //!(/^[0-9]*[1-9][0-9]*$/.test(this.target))
          if (this.target.trim() === '') {
            Toast(this.$t('reg.Wrong_Number'))
            return;
          }
        } else if (this.type === 1) {
          if (!(/^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/.test(this.target))) {
            Toast(this.$t('reg.Wrong_Email_Address'))
            return;
          }
        }
        this.sendAuthCode = false;
        this.mySetInterval();
        let args = {
          "type": this.type,
          "target": this.target,
          "area_code": this.area_code
        };
        const {data: {fp, registered}} = await api_getAuthCode(args)
        console.log(fp);
        this.fp = fp
        this.registered = registered;
        if (this.registered == 0) {
          this.yqm = true
        } else {
          this.yqm = false;
        }
      },
      //渠道
      sourcePost() {
        //if (this.$route.query.source) {
        // this.$mayAjax({
        //   data: {invitation_code: this.invitation_code, source: this.$route.query.source},
        //   method: 'post',
        //   url: '/public/user/inviteclick',
        //   success: function (e) {
        //     if (e.data.code != 200) {
        //     }
        //   }
        // })
      },

      //获取用户信息
      async getUserInfo() {
        console.log(this.token);
        let args = {"version": 0,  "token":this.token};
        const {data,code} = await api_getUserInfo(args);
        console.log(data, code);
        if(code == 200){
          let lang = data.lang == 0 ? 'cn' : 'en';
          let time = 1000 * 1000 * 30 * 60;
          setCookie('axon', lang, time);
          console.log(this.locale);
          if (this.locale != lang) {
            this.$i18n.locale = lang
          }
          this.setUserInfo(JSON.stringify(data))
        }

      },
      // 登录
      async login() {
        if (this.login_type === 0) {   //验证码登录
          this.registered = this.registered.toString();
          let args = {
            "verification_code": this.verification_code,
            "fp": this.fp,
            "registered": this.registered,  //
            "invitation_code": this.invitation_code  // 邀请码(选填)
          }
          const {data} = await api_register(args);
          this.login_in(data.token)
          this.getUserInfo();
        } else {     //密码登录
          let args = {
            "target": this.target,
            "password": this.password
          }
          const {code,data,message} = await api_login(args)
          console.log(data);
          this.login_in(data.token)
          if(code == 200){
            this.login_in(data.token)
            this.getUserInfo();
            this.$router.push('/defi')
          }
        }

      }
      ,
      //清除填写的手机号
      clearnum() {
        this.target = '';
      }
      ,
      // 改变密码状态
      changePassType() {
        this.pass_type = !this.pass_type;
        this.$refs.password.type = this.pass_type ? 'text' : 'password';
      }
      ,
      to_Phone_Login() {
        this.class_active = !this.class_active;
        this.e_active = false;
        this.type = 0;
        // 清空之前填写的手机号/ 邮箱
        this.target = '';
        this.sendAuthCode = true;
        this.mySetInterval();
      }
      ,
      to_Email_Login() {
        this.class_active = !this.class_active;
        this.e_active = true;
        this.type = 1;
        // 清空之前填写的手机号/ 邮箱
        this.target = '';
        this.yqm = false;
        this.sendAuthCode = true;
        this.mySetInterval();
      }
      ,
      // 去密码登录
      To_passlogin() {
        this.active = !this.active;
        this.login_type = 1;
        this.yqm = false;
      }
      ,
      // 去验证码登录
      To_yzmlogin() {
        this.active = !this.active;
        this.login_type = 0;
      }
      ,
    },
    components: {
      areaCode
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/mixin";

  .layout {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .top {
      position: absolute;
      .bg-image("../../assets/img/login/newlogin");
      height: 246px;
      width: 100%;
    }

    .close {
      position: absolute;
      font-size: 30px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 34px;
      right: 67px;
      top: 67px;
    }

    .navbar {
      position: absolute;
      left: 58px;
      top: 228px;
      vertical-align: bottom;
      font-size: 0;
      color: rgba(51, 51, 51, 1);

      span {
        font-weight: 400;
        font-size: 36px;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        margin-right: 48px;
      }

      .active {
        font-size: 66px;
        height: 66px;
        line-height: 66px;
        font-weight: bold;
      }
    }

    .login-box {
      position: relative;
      width: 630px;
      margin: 393px auto 0 auto;

      .noraml {
        line-height: 50px;
        height: 50px;
        padding: 19px 0;
        border-radius: 8px;

        input {
          font-size: 30px;
          color: #333333;
          padding-left: 19px;
          width: 70%;
          margin-right: 30px;

        }
      }

      .areacode {
        position: absolute;
        z-index: 100;
        top: -60px;
        width: 300px;
        border: 1px solid #666666;
        font-size: 30px;
        background: #ffffff;
        padding-left: 20px;

        li {
          padding-bottom: 20px;
        }
      }

      .phone {
        position: relative;
        display: flex;
        flex-flow: row;
        border: 1PX solid #E9E6F8;
        box-shadow: 0 5px 20px #E8E6F2;
        margin-bottom: 30px;
        height: 88px;

        .p_code {
          flex: 0 0 158px;
          text-align: center;
          font-size: 30px;
          color: #333333;
          border-right: 1px solid #A7A4B6;
        }

        .close {
          position: absolute;
          .bg-image("../../assets/img/login/close");;
          width: 30px;
          height: 30px;
          background-size: 100% 100%;
          top: 30px;
          left: 570px;
        }

        .warning {
          font-style: normal;
          position: absolute;
          right: 23px;
          height: 88px;
          color: #F83131;
          font-size: 28px;
          font-weight: 400;
        }
      }

      .message {
        display: flex;
        justify-content: space-between;

        .msg {
          border: 1px solid #E9E6F8;
          box-shadow: 0 5px 0.75rem #E8E6F2;
          width: 400px;
          height: 88px;

          input {
            padding-left: 29px;
          }
        }

        span {
          box-sizing: border-box;
          width: 200px;
          color: #6A4EFF;
          font-size: 28px;
          height: 88px;
          line-height: 88px;
          text-align: center;
          padding: 0 19px;
          border-radius: 8px;
          font-weight: 400;
          border: 1px solid #E9E6F8;
          box-shadow: 0 5px 0.75rem #E8E6F2;
        }
      }

      .yqm {
        margin-top: 30px;

        .p_code {
          //padding: 0 29px;
        }

        input {
          width: 40%;
        }
      }

      .password {
        position: relative;
        margin-top: 30px;

        i {
          position: absolute;
          right: 30px;
          top: 30px;
          width: 30px;
          height: 30px;
          background-size: 100% 100%;

          &.show {
            .bg-image("../../assets/img/login/show");
          }

          &.hide {
            .bg-image("../../assets/img/login/hide");
          }
        }
      }

      input::-webkit-input-placeholder {
        color: #A7A4B6;
      }

      input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #A7A4B6;
      }

      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #A7A4B6;
      }

      input:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #A7A4B6;
      }

      .login_btn {
        margin-top: 60px;
        text-align: center;
        font-size: 34px;
        height: 88px;
        line-height: 88px;
        color: #ffffff;
        font-weight: bold;
        border-radius: 80px;
        background: linear-gradient(#8A75FB, #6A4EFE);
        background: -webkit-linear-gradient(#8A75FB, #6A4EFE); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(#8A75FB, #6A4EFE); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(#8A75FB, #6A4EFE); /* Firefox 3.6 - 15 */
      }

      .use_pass {
        margin-top: 38px;
        display: flex;
        justify-content: space-between;

        span {
          font-size: 30px;
          font-weight: 400;
          color: #666666;
        }

        .forget_pass {
          color: #A7A4B6;
        }

      }

      .other_login {
        display: flex;
        justify-content: space-between;
        width: 280px;
        margin: 0 auto;
        margin-top: 188px;

        /*span {
          width: 80px;
          height: 80px;

          &.to_wx {
            background-image: url("../../assets/img/login/wx.png");
            background-size: 100% 100%;
          }

          &.to_telegram {
            background-image: url("../../assets/img/login/telegram.png");
            background-size: 100% 100%;
          }
        }*/
      }

    }

    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 246px;
      width: 100%;
      .bg-image('../../assets/img/login/bottom');

      .other_login {
        margin-top: 51px;
        width: 100%;
        position: absolute;

        div {
          display: flex;
          justify-content: space-between;
          width: 280px;
          margin: 0 auto;
        }

        /*span {
          width: 80px;
          height: 80px;

          &.to_wx {
            background-image: url("../../assets/img/login/wx.png");
            background-size: 100% 100%;
          }

          &.to_telegram {
            background-image: url("../../assets/img/login/telegram.png");
            background-size: 100% 100%;
          }
        }*/
      }
    }

    .agree {
      width: 100%;
      margin-top: 190px;
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      line-height: 26px;

      img {
        height: 123px !important;
      }

      span {
        color: #A7A4B6;
      }

      a {
        font-style: normal;
        font-weight: 400;
        color: #333333;
        text-decoration-line: underline;
      }
    }
  }
</style>
