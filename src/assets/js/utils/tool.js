//创建随机数
export function createParam() {
  function UUID() {
    this.id = this.createUUID();
  }

  UUID.prototype.valueOf = function () {
    return this.id;
  };
  UUID.prototype.toString = function () {
    return this.id;
  };
  UUID.prototype.createUUID = function () {
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = UUID.getIntegerBits(t, 0, 31);
    var tm = UUID.getIntegerBits(t, 32, 47);
    var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
      UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
      UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
      UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
      UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last number is two octets long
    return tl + tm + thv + csar + csl + n;
  };
  UUID.getIntegerBits = function (val, start, end) {
    var base16 = UUID.returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
      quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
      if (!quadArray[i] || quadArray[i] == '') quadString += '0';
      else quadString += quadArray[i];
    }
    return quadString;
  };
  UUID.returnBase = function (number, base) {
    return (number).toString(base).toUpperCase();
  };
  UUID.rand = function (max) {
    return Math.floor(Math.random() * (max + 1));
  };
  return UUID.prototype.createUUID();
}

export function formatTime(str) {
  var date = '';
  if (str) {
    if (typeof (str) == 'object') {
      date = str
    } else {
      date = new Date(str)
    }
  } else {
    date = new Date();
  };
  var tempStr = '';
  tempStr += date.getFullYear();
  if (date.getMonth() < 9) {
    tempStr += '-0' + (date.getMonth() + 1);
  } else {
    tempStr += '-' + (date.getMonth() + 1);
  }
  tempStr += '-' + date.getDate();
  tempStr += ' ' + date.getHours();
  tempStr += ':' + date.getMinutes();
  tempStr += ':' + date.getSeconds();

  return tempStr
}

//封装localStorage
export const storage = {
  get(key) {
    if (key == null || typeof key !== "string") {
      return ""
    }
    try {
      return JSON.parse(localStorage.getItem(key)) || "";
    } catch (e) {
      return ""
    }
  },
  set(key, value) {
    if (value == null) {
      return localStorage.removeItem(key);
    }
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
};

//封装isPC
export function isPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

export function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ_/i) == '_sq_') {
    return true;
  } else {
    return false;
  }
}

export function isAndroid() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  if (isAndroid) {
    return true
  } else {
    return false
  }
}

export function isIOS() {
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS) {
    return true
  } else {
    return false
  }
}

export function isID(num) {
  var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
  if (reg.test(num) === false) {
    return false;
  }
  return true;
}

export function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    }
    else {
      len += 1;
    }
  }
  return len;
}
/**
 * 将数值四舍五入后格式化.
 *
 * @param num 数值(Number或者String)
 * @param cent 要保留的小数位(Number)
 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
 * @return 格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatNumber(num, cent, isThousand) {
  if (typeof num == 'string') {
    num = num.replace(/\$|\,/g, '');
  }
  //num = num.toString().replace(/\$|\,/g, '');

  // 检查传入数值为数值类型
  if (isNaN(num))
    num = "0";

  // 获取符号(正/负数)
  let sign = (num == (num = Math.abs(num)));

  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
  let cents = num % Math.pow(10, cent); // 求出小数位数值
  num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值
  cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度

  // 补足小数位到指定的位数
  while (cents.length < cent)
    cents = "0" + cents;

  if (isThousand) {
    // 对整数部分进行千分位格式化.
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
  }

  if (cent > 0)
    return (((sign) ? '' : '-') + num + '.' + cents);
  else
    return (((sign) ? '' : '-') + num);
}
//时间戳转换为 2017-10-20 10:00:00格式
export function getLocalTime(nS) {
  let now = new Date(parseInt(nS) * 1000);
  let yy = now.getYear();
  if (yy < 1900) yy = yy + 1900;
  let month = now.getMonth() + 1;
  if (month < 10) month = '0' + month;
  let date = now.getDate();
  if (date < 10) date = '0' + date;
  let hour = now.getHours();
  let minute = now.getMinutes();
  if (minute < 10) minute = '0' + minute;
  // let   second=now.getSeconds();
  return yy + "-" + month + "-" + date + "   " + hour + ":" + minute;
}

String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

//获取cookie、
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

//设置cookie
export function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setTime(exdate.getTime() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

//封装sessionStorage
export function getStorage() {
  return {
    get(key) {
      if (key == null || typeof key !== "string") {
        return ""
      }
      try {
        return JSON.parse(sessionStorage.getItem(key)) || "";
      } catch (e) {
        return ""
      }
    },
    set(key, value) {
      if (value == null) {
        return sessionStorage.removeItem(key);
      }
      sessionStorage.setItem(key, JSON.stringify(value));
      return value;
    }
  }
}

export function objToStr(o, isAnd) {
  let temp = '', and = '@';
  if (isAnd) {
    and = '&'
  };
  for (var i in o) {
    temp += i + '=' + o[i] + and
  }
  return temp
}
export function strToObj(s) {
  let temp = {};
  if(!s || typeof s != 'String'){
    return;
  }
  var a = s.split(/&|@/);
  for (var i = 0; i < a.length; i++) {
    if (a[i].split('=')[1]) {
      temp[a[i].split('=')[0]] = a[i].split('=')[1]
    }
  }
  return temp
}
export function isWebView() {
  let platform = getCookie('platform')
  if (platform == 'ios' || platform == 'android') {
    return true
  } else {
    return false
  }
  // return
  // let ua = navigator.userAgent.toLowerCase()
  // if (ua.match(/MicroMessenger/i) == 'micromessenger') { // 微信浏览器判断
  //     return false
  // } else if (ua.match(/QQ/i) == 'qq') { // QQ浏览器判断
  //     return false
  // } else if (ua.match(/WeiBo/i) == "weibo") {
  //     return false
  // } else {
  //     if (ua.match(/Android/i) != null) {
  //         return ua.match(/browser/i) == null
  //     } else if (ua.match(/iPhone/i) != null) {
  //         return ua.match(/safari/i) == null
  //     } else {
  //         return (ua.match(/macintosh/i) == null && ua.match(/windows/i) == null)
  //     }
  // }
}
export let Base64 = {

  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
  },

  // public method for decoding
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    }

    output = Base64._utf8_decode(output);

    return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c = 0, c1 = 0, c2 = 0, c3 = 0;

    while (i < utftext.length) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }

    return string;
  }

}
export function statistics() {
  window.addEventListener('load', function () {
    var _mtac = {};
    var mta = document.createElement("script");
    mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
    mta.setAttribute("name", "MTAH5");
    mta.setAttribute("sid", "500631097");
    mta.setAttribute("cid", "500631098");
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(mta, s);
  }, false);
}
export function language(_t, str) {
  _t.$i18n.locale = str;
  _t.locale = str;
  storage.set('locale',str);
  setCookie('axon',str,1000*1000*30*60);
}

export function hasToken(){
  let token = getCookie('tk')?unescape(getCookie('tk')):'';
  return token;
}

export function getI18n(){
  let locale = 'en';
  if(isWebView()){
    locale = getCookie("locale")||locale;
  }else{
    if(storage.get('locale')){
      locale = storage.get('locale');
    }else{
      locale = getCookie("axon")||locale;
    }
  }
  return locale;
}