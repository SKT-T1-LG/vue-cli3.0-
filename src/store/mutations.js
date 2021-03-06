import * as types from './mutation-types'
import {setCookie} from "../assets/js/utils/tool";

const mutations = {
  // flag : true | false
  [types.SET_SHOWCOMMENT](state, flag){
    state.showComment = flag
  },
  [types.SET_NEWCOMMENT](state, flag){
    state.newComment = flag
  },
  [types.SET_TOREPLY](state, flag){
    state.toReply = flag
  },
  [types.SET_SELFCOMMENT](state, flag){
    state.selfComment = flag
  },

  [types.SET_PLUGARGUMENTS](state, res){
    state.plugArguments = res
  },
  [types.CONTACT](state, res){
    state.contact = res
  },
  // index
  [types.SET_COMMIT_INDEX](state, index){
    state.commit_index = index
  },
  // arr
  [types.SET_COMMENT_ARR](state, arr){
    state.comment_arr = arr
  },
  [types.SET_TITLE](state, str){
    //console.log(str);
    state.set_title = str
  },
  // token
  //登入
  [types.LOGIN_IN](state, token) {
    state.token = token;
    //localStorage.setItem('token', token);
    setCookie('tk',token,1000 * 1000 * 60 * 30)
  },
  //登出 or 退出登入
  [types.LOGIN_OUT](state, token) {
    //localStorage.removeItem("token", token);
    setCookie('tk', token)
    state.token = token;
  },
  [types.SET_LOCALE](state, locale){
    state.locale = locale
  },
  [types.SET_USERINFO](state, userinfo){
    localStorage.setItem('userinfo', userinfo)
    state.userinfo = userinfo
  },
}
export default mutations
