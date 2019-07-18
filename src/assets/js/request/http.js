/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
// import QS from 'qs';
import {Toast} from 'vant';
import store from '@/store/index'
import router from '@/router/index'
import {createParam, getCookie, storage, getI18n} from "../utils/tool"
import crypto from '../utils/crypto'

let pathReg = /retrieve|login|register/;
let headers = {}
if (location.hash.search(pathReg) == '-1') {
  headers['Content-Type'] = 'application/json';
}
let locale = 'en';
if (getCookie('axon')) {
  locale = getCookie('axon')
}
// tmid ：设备id
if (storage.get('tmid')) {
  // 如果有tmid 请求头带上tmid
  headers.tmid = storage.get('tmid')
} else {
  // 如果没有tmid 生成之后 存入本地 在带上
  let tmid = createParam();
  storage.set('tmid', tmid);
  headers.tmid = tmid
}

//国际化
headers.lang = getI18n() || 'en';
headers.terminal = 'web';

let instance = axios.create({
  headers,
  timeout: 5000
})

function createKey() {
  let temp = createParam();
  return [temp.slice(0, 16), temp.slice(16, 32)]
}

var tmpCreateKey = createKey();

export function creatEncryptData(obj) {
  obj = JSON.stringify(obj)
  return crypto.encryptData(obj, tmpCreateKey[0], tmpCreateKey[1])
}

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = store.getters.token;
    console.log(token);
    token && (config.headers.Authorization = token);
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      const { data } = response.data;
      const decryptedData = crypto.decryptData(data, tmpCreateKey[0], tmpCreateKey[1]);
      return Promise.resolve({ ...response.data, data: decryptedData }) ;
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    console.log(error.data);
    if (error.data.code) {
      switch (error.data.code) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          if( getCookie('platform') == 'ios' ){
            window.location.href = 'dba://login';
          }else if( getCookie('platform') == 'android' ){
            window.android.goLogin();
          }else{
            router.replace({
              path: '/login',
              query: {redirect: router.currentRoute.fullPath}
            });
          }
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          Toast({
            message: '登录过期，请重新登录',
            duration: 1000,
            forbidClick: true
          });
          // 清除token
          //localStorage.removeItem('token');
          store.commit('LOGIN_OUT', null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
          break;
        // 404请求不存在
        case 404:
          Toast({
            message: '网络请求不存在',
            duration: 1500,
            forbidClick: true
          });
          break;
        // 其他错误，直接抛出错误提示
        default:
          Toast({
            message: error.response.data.message,
            duration: 1500,
            forbidClick: true
          });
      }
      return Promise.reject(error.response);
    }
  }
);

const createData = (data) => {
  return {
    version: 1,
    type: '0',
    data: creatEncryptData(data) + '.' + crypto.encryptKey(tmpCreateKey[0] + tmpCreateKey[1])
  };
}
// 环境的切换
const api = process.env.NODE_ENV == 'development' ? 'https://eapis.axonomy.pro' : 'https://defi.axonomy.pro';

export default function request(method, url, data) {
  url = api + url;
  if(url.search('/public/') == '-1' || url.search('/public/user/meta') != '-1'){
    //console.log(token);
    data["token"] = store.getters.token;
  }
  data = createData(data); // 加密
  data = {...data,request_id:createParam()};
  method = method.toLocaleLowerCase();
  if (method === 'post') {
    return instance.post(url, data)
  } else if (method === 'get') {
    return instance.get(url, {
      params: data
    })
  } else if (method === 'delete') {
    return instance.delete(url, {
      params: data
    })
  }
}