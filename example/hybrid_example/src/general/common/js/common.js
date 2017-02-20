/*
* @Author: daihanqiao
* @Date:   2016-02-23 11:02:38
* Copyright (c) 2016 by daihanqiao. All Rights Reserved.
* JS通用库
*/

"use strict";
require('commonCss');
let Config = require(__CONFIG__);
let reqwest = require('reqwest');
let WxShare = require('wxShare');
let notShowPage = ['order_detail','user_center'];
// let showPage = ['apps_luckDraw_index','apps_luckRock_index','apps_payvote_ranking','apps_payvote_running','apps_payvote_vote_detail','apps_red_envelope',
//             'apps_registration_index','apps_registration_join','apps_sign','apps_vote_index','apps_vote_userInfo','goodDetails','group_goodDetails',
//              'storeIndex','group_detail','goods_all','order_detail'];
import Login from 'login';
const Com = {
    API_URL:Config.API_URL,
    USER_DEFAULT:require('commonDefaultImg'),
    UPLOAD_PATH:Config.UPLOAD_PATH,
    XBOX_UPLOAD_PATH:Config.XBOX_UPLOAD_PATH,
    //地图key
    MAP_KEY:"J7UBZ-NYAKX-DMU45-7RB6T-4V7H6-OSBCY",
    //设置error商品图
    setErrorImg(el){
        el.src = this.USER_DEFAULT;
    },
    //获取商品图片
    getGoodsImg(imageName,size){
        var imagePath;
        if(imageName){
            //店铺ID(图片目录)
            var store_id = imageName.substring(imageName.lastIndexOf("/")+1,imageName.indexOf("_"));
            //图片尺寸
            var dotIndex = imageName.lastIndexOf(".");
            var sizeNum = size || 640;
            var imageName_new = imageName.substring(0,dotIndex) + "_" + sizeNum + imageName.substring(dotIndex);
            imagePath = Config.UPLOAD_PATH + "shop/store/goods/"+store_id + "/" + imageName_new;
        }else{
            imagePath = require('commonDefaultImg');
        }
        return imagePath;
    },
    //ready方法
    ready(f_callback){
        let self = this;
        let callFunc = function(){
            let FastClick = require('fastclick');
            FastClick.attach(document.body);
            // 检测未使用泛域名
            // if(window.location.href.indexOf('://'+self.getPageParams('store_alias')+'.') === -1){
            //     alert("该页面未使用泛域名");
            // }
            //检测是否启用分享
            if (notShowPage.indexOf(self.getPageName()) !== -1) {
                WxShare.hideShare();
            }
            if(Base.b_wechat && window.self === window.top){
                /*微信自动登录*/
                Base.B_HASREQUESTWECHATLOGIN = true;
                self.getNormal({act:'page_init',op:'wechat_login'},(res)=>{
                    Base.b_wechatShowProgress = true;
                    document.cookie = `member_id=${res.member_id}`;
                    if(res.code === 0 && res.data.url){
                        self.openWin(res.data.url);
                    }else{
                        f_callback();
                    }
                })
            }else{
                f_callback();
            }
        };
        let r_readyRE = /complete|loaded|interactive/;
        if (r_readyRE.test(document.readyState)) {
            callFunc();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                callFunc();
            }, false);
        }
    },
    openWin(s_name,o_pageParam,o_winParams){
        if(!s_name){
            return;
        }
        o_pageParam = o_pageParam || {}
        if(!/(http:\/\/|https:\/\/)/.test(s_name) && !/\.html/.test(s_name)){
            s_name = './'+s_name+'.html';
        }else{
            s_name = Base.replaceHtml(s_name);
            let o_params = Base.getPageParams(null,s_name);
            o_pageParam = Base.spliceObj(o_params,o_pageParam);
        }
        /*自动拼接店铺别名和门店ID*/
        if(!o_pageParam.hasOwnProperty('store_alias')){
            o_pageParam['store_alias'] = Base.getPageParams('store_alias');
        }
        if(!o_pageParam.hasOwnProperty('shop_id')){
            let self_shop_id = Base.getPageParams('shop_id') || 0;
            if(window.self !== window.top){
                //为iframe页面，取父页面shop_id
                self_shop_id = self_shop_id || this.getPageParams('shop_id',window.parent.location.href);
            }
            o_pageParam['shop_id']  = self_shop_id || 0;
        }
        let s_urlParam = "";
        for (let s_key in o_pageParam) {
            if (o_pageParam.hasOwnProperty(s_key)) {
                let value = o_pageParam[s_key];
                s_urlParam += (s_key+"="+escape(value)+"&");
            }
        }
        s_urlParam = s_urlParam.replace(/&$/,"");
        let s_division = /\?/.test(s_name) ? '&' : '?';
        s_name = s_urlParam?(s_name+s_division+s_urlParam):s_name;
        window.parent.location.href = s_name;
    },
      /**
     * @description 打开地图
     * @param  {String} 经度
     * @param  {String} 纬度
     * @param  {String} 标题
     * @param  {String} 地址
     * @return null
     */
    openMap(lat,lon,title,address){
        var url = `http://3gimg.qq.com/lightmap/v1/marker/?marker=coord:${lat},${lon};title:${title};addr:${address}&key=${this.MAP_KEY}`;
        window.location.href = url;
    },
    //地址转坐标
    getLocation(address,fucName){
        this.jsonP("http://apis.map.qq.com/ws/geocoder/v1/?address="+decodeURIComponent(address)+"&key="+this.MAP_KEY+"&output=jsonp&callback="+fucName);
    },
    //根据经纬度获取地址
    getAddress(lat,lon,f_callBack,b_isNoShowProgress,b_isNoHideProgress){
        if (!lat || !lon) {
            return;
        }
        let s_callBackName = 'jsonP'+(new Date()).getTime();
        window[s_callBackName] = function(res){
            if(__DEBUG__){
                console.log(res);
            }
            f_callBack(res);
            if(!b_isNoHideProgress){
                Base.showProgress(false);
            }
        }
        let s_urlParam = "http://apis.map.qq.com/ws/geocoder/v1/?location="+lat+","+lon+"&coord_type=1&key="+Com.MAP_KEY+"&callback="+s_callBackName+"&output=jsonp";
        Base.jsonP(s_urlParam);
        if(!b_isNoShowProgress){
            Base.showProgress(true);
        }
    },
    //关键字搜索
    searchKey(keyword,region,f_callBack,b_isNoShowProgress,b_isNoHideProgress){
        let s_callBackName = 'jsonP'+(new Date()).getTime();
        window[s_callBackName] = function(res){
            if(__DEBUG__){
                console.log(res);
            }
            f_callBack(res);
            if(!b_isNoHideProgress){
                Base.showProgress(false);
            }
        }
        let s_urlParam = "http://apis.map.qq.com/ws/place/v1/suggestion?keyword="+decodeURIComponent(keyword)+"&key="+this.MAP_KEY+"&region="+region+"&policy=0&output=jsonp&callback="+s_callBackName;
        Base.jsonP(s_urlParam);
        if(!b_isNoShowProgress){
            Base.showProgress(true);
        }
    },
    //post请求非校验接口
    postNormal(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param = o_param || {};
        //设置post非校验接口公共数据
        _request('post', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    },
    //get请求非校验接口
    getNormal(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param = o_param || {};
        //设置get非校验接口公共数据
        _request('get', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    },
    //post请求需校验身份的接口
    postVerify(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param = o_param || {};
        let member_id = Base.getCookie("member_id");
        if(!member_id){
            return Login.show();
        }
        o_param["member_id"] = member_id;
        _request('post', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    },
    //get请求需校验身份的接口
    getVerify(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param = o_param || {};
        let member_id = Base.getCookie("member_id");
        if(!member_id){
            return Login.show();
        }
        o_param["member_id"] = member_id;
        _request('get', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    },
    //有回调重复调用的可能
    getJsonP(o_param, f_callBack,b_isNoShowProgress,b_isNoHideProgress){
        if(!o_param || !o_param['act'] || !o_param['op']){
            throw "未传入act或op";
        }
        let s_callBackName = 'jsonP'+(new Date()).getTime();
        window[s_callBackName] = function(res){
            if(__DEBUG__){
                console.log(res);
            }
            f_callBack(res);
            if(!b_isNoHideProgress){
                Base.showProgress(false);
            }
        }
        let s_urlParam = this.API_URL+'?callback='+s_callBackName+'&';
        for (let s_key in o_param) {
            if (o_param.hasOwnProperty(s_key)) {
                let value = o_param[s_key];
                s_urlParam += (s_key+"="+escape(value)+"&");
            }
        }
        s_urlParam = s_urlParam.replace(/&$/,"");
        Base.jsonP(s_urlParam);
        if(!b_isNoShowProgress){
            Base.showProgress(true);
        }
    },
    sendFile(o_param, f_callback, b_isNoShowProgress, b_isNoHideProgress){
        if(!o_param['act'] || ! o_param['op']){
            throw "未传入act或op";
        }
        o_param.store_alias = Base.getPageParams('store_alias');
        let shop_id = Base.getPageParams('shop_id');
        o_param.shop_id = shop_id ? parseInt(shop_id) : 0;
        let requestUrl = Config.API_URL + '?';
        let form = new FormData();
        for(let i in o_param){
            if(o_param.hasOwnProperty(i)){
                if(o_param[i] instanceof File){
                    form.append(i, o_param[i]);
                }else{
                    requestUrl += i + '=' + o_param[i] + '&';
                }
            }
        }
        requestUrl = requestUrl.replace(/&$/,'');
        Base.ajax(requestUrl,form,f_callback, b_isNoShowProgress, b_isNoHideProgress,'post',function(err){
            console.log(err);
        });
    },
    //将名称后五位数字去掉
    replaceName(s_name){
        s_name = s_name || "";
        return s_name.replace(/_\d{5}$/,'');
    }
}

//请求
//b_isNoShowProgress 是否开始请求不显示loading
//b_isNoHideProgress 是否请求完成不隐藏loading
function _request(s_method , o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress){
    function callBack(res){
        if(res){
            if(parseInt(res.code) === 0){
                if(res.data && res.data.com && res.data.com.mid){
                    // Base.setLocalData(o_com.USER_VERIFY_DATA,res.data.com);
                }
            }
            f_callBack && f_callBack(res);
        }
    }
    if(!o_param['act'] || ! o_param['op']){
        throw "未传入act或op";
    }
    o_param.store_alias = Base.getPageParams('store_alias');
    let shop_id = Base.getPageParams('shop_id');
    o_param.shop_id = shop_id ? parseInt(shop_id) : 0;
    let api_url = Config.API_URL;
    if(o_param['b_box']){
        api_url = Config.XBOX_API_URL + '/' + o_param['act'] +'/' + o_param['op'];
        delete o_param['act'];
        delete o_param['op'];
        delete o_param['b_box'];
    }
    Base.ajax(api_url, o_param, callBack, b_isNoShowProgress, b_isNoHideProgress,s_method,function(err){
        console.log(err);
    });
}
let o_com = Base.spliceObj(Base,Com);
module.exports = o_com;
