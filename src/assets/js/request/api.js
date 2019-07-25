import requset from './http'
// eg:
export const apiPOST = params => requset('post','/public/user/login', params);
//获取手机区号与地区
export const api_getAreaCode = params => requset('get','/public/sms/areacode', params||{})
// 获取验证码
export const api_getAuthCode = params => requset('post','/public/sms/sendcode2', params)
//获取用户信息
export const api_getUserInfo = params => requset('get','/api/v1/user/meta', params)
// 登录
export const api_register = params => requset('post','/public/user/newregister', params)
export const api_login = params => requset('post','/public/user/login', params)
// footer
export const api_getTab = params => requset('get','/public/common/tab', params||{})

// Defi
// banner 图
export const api_getBanner = params => requset('get','/public/project/banner/voteslice', params||{})
// 获取列表
export const api_getList = params => requset('post','/public/finance/goods/items', params)
// defi-details
// 获取产品介绍
export const api_getGoods = (params, id) => requset('get',`/public/finance/goods/${id}`, params||{})
//获取项目评分
export const api_getRating = (params, id) => requset('get',`/api/v1/project/${id}/rating`, params||{})
// 获取评分的列表
export const api_getPFlist = (params, id) => requset('get',`/api/v1/project/${id}/viewpoints`, params||{})

// Score
//获取自己的名称和ID
export const api_getMyInfo = params => requset('post',`/public/user/meta`, params||{})


// ReplyBOx
// 发布观点
export const api_toSubmit = (params,id) => requset('post',`/api/v1/resource/${id}/comments`, params||{})


// 挖矿页面
// /wk 页面 获取挖矿信息
export const api_getWkInfo = (params) => requset('get',`/api/v1/user/me/mineral/mining/info`, params||{})

