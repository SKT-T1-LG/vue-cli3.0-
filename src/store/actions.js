import * as types from './mutation-types'

export const selectReply = function({commit, state}, {list, index}){
  commit(types.SET_SHOWCOMMENT, list.showComment)
  commit(types.SET_NEWCOMMENT, list.newComment)
  commit(types.SET_TOREPLY, list.toReply)
  commit(types.SET_SELFCOMMENT, list.selfComment)
  commit(types.SET_PLUGARGUMENTS, list.plugArguments)
  commit(types.SET_COMMIT_INDEX, index)
}

export const commentArr = function({commit ,state},{arr, index}){
  commit(types.SET_COMMENT_ARR, arr)
  commit(types.SET_COMMIT_INDEX, index)
}

export const getLoginInInfo = function ({commit}, token) {
  console.log(token);
  commit(types.LOGIN_IN, token)
}

export const getLoginOutInfo = function ({commit}, token) {
  commit('LOGIN_OUT', token)
}