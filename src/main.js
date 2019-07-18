import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import 'lib-flexible'
import "@/assets/less"
import {setCookie,getI18n} from "@/assets/js/utils/tool";
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);
let langMessages = {
  cn: require('../static/lang/cn.json'),
  en: require('../static/lang/en.json')
}

//默认
let locale = getI18n()||'en';
const i18n = new VueI18n({
  locale: locale, // 语言标识
  messages: langMessages
});

let t = 1000*1000*30*60;
setCookie('axon',i18n.locale,t);

Vue.config.productionTip = false


/*ios键盘顶起页面底部不恢复 */
// let setScrollTop = function () {
//   let top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
//   window.scrollTo(0, top + 1)
//   setTimeout(() => {
//     window.scrollTo(0, top)
//   },300)
// }
///iPhone/gi.test(navigator.userAgent) && document.addEventListener('focusout', setScrollTop, false);
//  if(/iPhone/gi.test(navigator.userAgent)){
//      document.addEventListener('focusout', setScrollTop, false);
//  }
//
//
// if (/Android/gi.test(navigator.userAgent)) {
//   window.addEventListener("resize", function() {
//     if (
//       document.activeElement.tagName === "INPUT" ||
//       document.activeElement.tagName === "TEXTAREA"
//     ) {
//       window.setTimeout(function() {
//         document.activeElement.scrollIntoViewIfNeeded();
//       }, 0);
//     }
//   });
// }
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
