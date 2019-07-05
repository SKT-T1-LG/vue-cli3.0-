const state = {
  showComment:false,  // 显示评论框
  newComment:false, // 新建评论
  toReply:false, // 回复评论
  selfComment:false, // 自己的评论
  commit_index:null, // 评论的index
  comment_arr:[],  // 记录评论数组
  plugArguments:{
    ID:0,   // 传给 reply-box 的 id
    othersINfoData:{},  // 回复的人的相关信息
    cachListCommentItems:[], // 临时评论数组
    mySelfInfoData:{}  // 自己相关信息
  },
  contact:{},
  set_title:'',
  token:localStorage.getItem('token') ? localStorage.getItem('token') : '' // 设置token
}
export default state
