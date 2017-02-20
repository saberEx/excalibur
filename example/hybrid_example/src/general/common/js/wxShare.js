/*
 * @Author: 黄权
 * @Date:   2016-11-10 13:11:00
 * @Last Modified by:   卢旺
 * @Last Modified time: 2017-01-19 15:53:00
 */
/**
 * 通用分享组件
 * @type:不传默认为0，传1为分享带门店详细信息
 * @hide:不传默认为true,传false为屏蔽分享功能
*/
'use strict';
let Base = require('base');
let store_alias = Base.getPageParams("store_alias");
let shop_id = Base.getPageParams("shop_id") || 0;

function init(f_callBack){
    Base.loadJs("http://res.wx.qq.com/open/js/jweixin-1.0.0.js",()=>{
            Base.postNormal({act: 'normal_base', op: 'wx_share' }, (ret)=>{
                if(parseInt(ret.code)===0){
                    f_callBack(ret);
                }else{
                    f_callBack(null);
                }
            },true,true);
        })
}

module.exports = {
    showShare(shareParams,type=0){
        init((ret)=>{
            let {baseURL,title,desc,imgUrl} = shareParams;
            if(type === 1){
                Base.postNormal({act:"goods",op:"get_shop_store_info",mod:"openapi",store_alias:store_alias,shop_id:shop_id},(res)=>{
                    if(parseInt(res.code) === 0){
                        desc = res.data.name;
                    }
                },true,true);
            }
            wx.config({
                debug : false,
                appId: ret.data.appId,
                timestamp: ret.data.timestamp,
                nonceStr: ret.data.noncestr,
                signature: ret.data.signature,
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
            });
            wx.ready(function(){
                wx.onMenuShareTimeline({//分享到朋友圈
                    title: title,
                    link: baseURL,
                    imgUrl: imgUrl,
                    success: function(){//接口调用成功时执行的回调函数
                    },
                    fail: function(){//接口调用失败时执行的回调函数
                    },
                    complete: function(){//接口调用完成时执行的回调函数，无论成功或失败都会执行
                    },
                    cancel: function(){//用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
                    }
                });
                wx.onMenuShareAppMessage({//分享给朋友
                    title: title,
                    desc: desc,
                    link: baseURL,
                    imgUrl: imgUrl,
                    type: '',//分享类型,music、video或link，不填默认为link
                    dataUrl: '',// 如果type是music或video，则要提供数据链接，默认为空
                });
                wx.onMenuShareQQ({//分享到QQ
                    title: title,
                    desc: desc,
                    link: baseURL,
                    imgUrl: imgUrl
                });
                wx.onMenuShareWeibo({//分享到腾讯微博
                    title: title,
                    desc: desc,
                    link: baseURL,
                    imgUrl: imgUrl
                });
                wx.onMenuShareQZone({//分享到QQ空间
                    title: title,
                    desc: desc,
                    link: baseURL,
                    imgUrl: imgUrl
                });
            });
            wx.error(function(res){//错误上报
                // alert('wx.error: '+JSON.stringify(res));
            });
        })
    },
    hideShare(){
        init((ret)=>{
            console.log("禁用");
            wx.config({
                debug : false,
                appId: ret.data.appId,
                timestamp: ret.data.timestamp,
                nonceStr: ret.data.noncestr,
                signature: ret.data.signature,
                jsApiList: ['hideMenuItems']
            });
            wx.ready(function(){
                wx.hideMenuItems({
                    menuList:["menuItem:share:appMessage",//发送给朋友
                              "menuItem:share:timeline",//分享到朋友圈
                              "menuItem:share:qq",//分享到QQ
                              "menuItem:share:weiboApp",//分享到微博
                              "menuItem:share:facebook",//分享到fecebook
                              "menuItem:share:QZone"]//分享到QQ空间
                });
            });
            wx.error(function(res){//错误上报
                console.log("=====",res);
                // alert('wx.error: '+JSON.stringify(res));
            });
        })
    }
}
