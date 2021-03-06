import {getCookie, getI18n} from "../assets/js/utils/tool";
export const showComment = state => state.showComment

export const newComment = state => state.newComment

export const toReply = state => state.toReply

export const selfComment = state => state.selfComment

export const plugArguments = state => state.plugArguments

export const contact = state => state.contact

export const commit_index = state => state.commit_index

export const comment_arr = state => state.comment_arr

export const setTitle = state => state.set_title
// 获取本地语言
export const locale = state =>state.locale || getI18n()
// 获取userinfo
export const userinfo = state => state.userinfo||localStorage.getItem('userinfo')
export const token = state =>  state.token || getCookie('tk')
