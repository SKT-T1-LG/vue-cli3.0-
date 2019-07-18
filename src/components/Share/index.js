
import { isWebView, isWeiXin, Base64,storage } from "@/assets/js/utils/tool";

/**
 *
 *
 *
 */
function Share(o) {
    o = o || {};
    let oArg = {
        title: '',
        link: '',
        imgUrl: '',
        desc: ''
    };

    for (let i in oArg) {
        if(!o[i]){
            o[i] = oArg[i]
        }
    };
    function fnShare(e) {
        if(!wx) return;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: e.appId, // 必填，公众号的唯一标识
            timestamp: e.timestamp, // 必填，生成签名的时间戳
            nonceStr: e.nonceStr, // 必填，生成签名的随机串
            signature: e.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function(){
            wx.onMenuShareTimeline({
                title: o.title, // 分享标题
                link: o.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: o.imgUrl, // 分享图标
                success: function () {
                // 用户点击了分享后执行的回调函数
                    if(o.fn){
                        o.fn()
                    }
                }
            });
            wx.onMenuShareAppMessage({
                title: o.title, // 分享标题
                desc: o.desc, // 分享描述
                link: o.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: o.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                // 用户点击了分享后执行的回调函数
                    if(o.fn){
                        o.fn()
                    }
                }
            });
        });
    };
    if(isWebView()){
        window.location.href = 'dba://shareBtn?' + [
            'title=' + Base64.encode(o.title),
            '&desc=' + Base64.encode(o.desc),
            '&link=' + Base64.encode(o.link),
            '&imgUrl=' + Base64.encode(o.imgUrl),
        ].join('')
    }else if(isWeiXin()){
        let __this = this;
        mayAjax({
            method:'get',
            data:{
                url: window.location.href
            },
            url: '/public/wx/sign',
            success: function(e){
                fnShare(e.data.data);
                storage.set('appid',e.data.data.appId);
            }
        })
    }
}

export default Share
