/*
 * @Author: daihanqiao
 * @Date:   2016-02-23 11:02:38
 * Copyright (c) 2016 by daihanqiao. All Rights Reserved.
 * JS基础库，wap端使用
 */

"use strict";
require('normalizeCss');
require('baseCss');
import Storage from 'storage';
let storage = new Storage();
let Loader = require('loader');
let Notie = require('notie');
let reqwest = require('reqwest');
require('flexible');

//枚举：安卓系统
const ENUM_SYS_ANDROID = 0;
//枚举：IOS系统
const ENUM_SYS_IOS = 1;
//枚举：PC端浏览器
const ENUM_BROWSER_PC = 0;
//枚举：微信浏览器
const ENUM_BROWSER_WX = 1;

let _eventList = null;

const Base = {
    //是否为APP
    get isApp(){
        return false;
    },
    get b_wechat(){
        return this.getBrowserType() === ENUM_BROWSER_WX;
    },
    get b_pc(){
        return this.getBrowserType() === ENUM_BROWSER_PC;
    },
    //ready方法
    ready(f_callback){
        let callFunc = function(){
            let FastClick = require('fastclick');
            FastClick.attach(document.body);
            f_callback();
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
    //是否需要设置沉浸式
    get isNeedImmerse(){
        return false;
    },
    //设置沉浸式
    setImmerseBar(){
        return false;
    },
    //显示确认弹窗
    confirm(s_msg,f_callback){
        Notie.confirm(s_msg,'确定','取消',()=>{
            f_callback && f_callback();
        })
    },
    //显示输入弹窗
    inputNotie(s_title,s_placeholder,f_okHandler,s_okLabel,s_cancelLabel){
        s_okLabel = s_okLabel || "确定";
        s_cancelLabel = s_cancelLabel || "取消";
        Notie.input(s_title, s_okLabel, s_cancelLabel, '', s_placeholder, f_okHandler);
        this.setImmerseBar("#notie-input-outer");
    },
    //显示loading
    showProgress(b_show){
        if(b_show){
            Loader.show();
        }else{
            Loader.hide();
        }
    },
    //显示toast
    toast(s_msg,f_callBack,i_type,n_seconds){
        i_type = i_type || 3;
        n_seconds = n_seconds || 3;
        Notie.alert(i_type,s_msg,n_seconds);
        if(f_callBack){
            setTimeout(f_callBack,n_seconds*1000);
        }
    },
    ajax(s_requestUrl,o_param,f_callBack,b_isNoShowProgress,b_isNoHideProgress,s_method,f_errorCallBack){
        s_method = s_method || "POST";
        let self = this;
        if(!b_isNoShowProgress){
            self.showProgress(true);
        }
        if(self.B_HASREQUESTWECHATLOGIN && self.b_wechatShowProgress){
            self.b_wechatShowProgress = false;
        }
        reqwest({
            withCredentials: true,
            crossOrigin: true,
            url: s_requestUrl,
            method: s_method,
            data: o_param,
            type: 'json',
            processData:!(o_param instanceof FormData),//传文件流
            timeout: 10000,
            success: function(res) {
                if(__DEBUG__){
                    console.log(res);
                }
                if(f_callBack){
                    if(self.b_wechatShowProgress === false){
                        self.b_wechatShowProgress = true;
                    }
                    f_callBack(res);
                }
                if(self.B_HASREQUESTWECHATLOGIN){
                    self.B_HASREQUESTWECHATLOGIN = false;
                    if(self.b_wechatShowProgress){
                        self.b_wechatShowProgress = null;
                        self.showProgress(false);
                    }
                }else {
                    if(!b_isNoHideProgress || self.b_wechatShowProgress){
                        self.b_wechatShowProgress = null;
                        self.showProgress(false);
                    }
                }
            },
            error: function(err) {
                if(f_errorCallBack){
                    f_errorCallBack(err);
                }
                if(!b_isNoHideProgress || self.b_wechatShowProgress === false){
                    self.b_wechatShowProgress = null;
                    self.showProgress(false);
                }
            }
        });
    },
    //获取cookie值
    getCookie(s_key){
        let a_cookies = document.cookie.split('; ');
        let result = null;
        for(let i = 0,len = a_cookies.length;i<len;i++){
            let value = a_cookies[i].split('=');
            if(value[0] === s_key && value[1]){
                return result = value[1];
            }
        }
        return result;
    },
    //获取页面传来的参数
    getPageParams(s_keyStr,s_url){
        s_url = s_url || window.document.location.href;
        let s_str = s_url.split("?")[1];
        if(typeof(s_str) === 'undefined'){
            return s_keyStr?null:{};
        }
        let a_items = s_str.split("&");
        let o_result = {};
        let a_arr;
        for(let i in a_items){
            if(a_items.hasOwnProperty(i)){
                a_arr = a_items[i].split("=");
                o_result[a_arr[0]] = unescape(a_arr[1]);
            }
        }
        return s_keyStr?o_result[s_keyStr]:o_result;
    },
    reload(){
        //安卓微信端刷新方法
        if(this.b_wechat && this.getSysType() === ENUM_SYS_ANDROID){
            let symbol = /\?/.test(window.location.href) ? '&':'?';
            window.location.href = window.location.href + symbol + 'random_id=' + (new Date()).getTime();
        }else{
            window.location.reload();
        }
    },
    //获取页面名称
    getPageName(){
        let a_page = window.document.location.pathname.match(/(\/)([a-zA-Z0-9_]+)(\.)/);
        return a_page[2];
    },
    //打开页面
    openWin(s_name,o_pageParam,o_winParams){
        if(!s_name){
            return;
        }
        o_pageParam = o_pageParam || {}
        if(!/(http:\/\/|https:\/\/)/.test(s_name)){
            s_name = './'+s_name+'.html';
        }else{
            let o_params = this.getPageParams(null,s_name);
            o_pageParam = this.spliceObj(o_params,o_pageParam);
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
        window.location.href = s_name;
    },
    //关闭页面
    closeWin(s_winName){
        if(_eventList){
            //做上一页面往下一页面传参时，关闭页面清空本地数据
            let self = this;
            _eventList.map((s_name)=>{
                self.setLocalData(s_name,null);
            })
        }
        window.history.go(-1);
    },
    //发送事件
    sendEvt(s_name,o_params){
        this.setLocalData(s_name,o_params);
    },
    //给上一个页面传值，safari中返回上一页时页面不刷新，ios微信中页面刷新
    addEvt(s_name,f_callBack){
        //针对上一页面刷新
        let data = this.getLocalData(s_name);
        _eventList = _eventList || [];
        if(_eventList.indexOf(s_name) === -1){
            _eventList.push(s_name);
        }
        if(data){
            f_callBack && f_callBack(data);
        }

        //针对上一页面不刷新
        if(window.addEventListener){
            window.addEventListener("storage",handleStorage,false);
        }else if(window.attachEvent){
            window.attachEvent("onstorage",handleStorage);
        }
        let self = this;
        function handleStorage(e){
            e = e || window.event;
            if(e.key == s_name){
                let data = self.getLocalData(s_name);
                f_callBack && f_callBack(data);
            }
        }
    },
    //获取本地数据
    getLocalData(s_storageName,s_key){
        let o_data = storage.get(s_storageName);
        return (o_data && s_key) ? o_data[s_key] : o_data;
    },
    //设置本地数据
    setLocalData(s_storageName,u_value,s_key){
        let o_data = storage.get(s_storageName);
        if(s_key){
            o_data = o_data || {};
            o_data[s_key] = u_value;
        }else{
            o_data = u_value;
        }
        storage.set(s_storageName,o_data);
    },
    //清除本地数据
    removeLocalData(s_storageName){
        storage.remove(s_storageName);
    },
    //获取设备ID
    getDeviceId(){
        let s_str = storage.get('userDeviceId');
        if(!s_str){
            let s_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
            let i_maxPos = s_chars.length;
            s_str = '';
            for (let i = 0; i < 16; i++) {
                s_str += s_chars.charAt(Math.floor(Math.random() * i_maxPos));
            }
            storage.set('userDeviceId',s_str);
        }
        return s_str;
    },
    //校验手机号
    checkMobile(i_mobileNum){
        let re = new RegExp(/^1(3|4|5|7|8)\d{9}$/);
        return re.test(i_mobileNum);
    },
    //隐藏手机号
    hideMobile(i_mobileNum){
        return i_mobileNum.toString().replace(/(^\d{3})(\d){7}(\d{1}$)/,'$1*******$3');
    },
    download(s_path,f_callback){
        return false;
    },
    //保存图片视频到本地
    saveMediaToAlbum(s_path,f_callBack){
        return false;
    },
    //获取APP版本
    getAppVersion(){
        return "1.0.0";
    },
    //通过系统相册或拍照获取图片
    getPicture(s_sourceType,f_callback){
        return false;
    },
    getFNScanner(){
        return {closeView:function(){}};
    },
    //生成二维码
    genQrCode(s_url,f_callBack){
        return false;
    },
    //打开扫描仪
    openScanner(f_callBack){
        return false;
    },
    openScannerView(f_callBack){
        return false;
    },
    //打开手机上其他应用
    openApp(s_iosUrl,androidPkg,o_appParam,s_uri){
        return false;
    },
    //复制内容
    setClipBoard(s_content){
        return false;
    },
    //格式化数字，比如：0->0.00
    getNumFormat(n_num,i_len){
        n_num = parseFloat(n_num) || 0;
        i_len = i_len || 2;
        return n_num.toFixed(i_len);
    },
    //格式化时间日期,time:秒数,type:0,输出年月日,1.输出时分秒,2.全部输出
    getTimeFormat(s_time,i_type){
        s_time = s_time ? new Date(parseInt(s_time)*1000) : new Date();
        i_type = i_type || 0;
        let a_YMDList = [s_time.getFullYear(),s_time.getMonth()+1,s_time.getDate()];
        let a_HMSList = [s_time.getHours(),s_time.getMinutes(),s_time.getSeconds()];
        a_YMDList.map(function(value,index){
            a_YMDList[index] = value.toString().replace(/(^\d{1}$)/,"0"+"$1");
        });
        a_HMSList.map(function(value,index){
            a_HMSList[index] = value.toString().replace(/(^\d{1}$)/,"0"+"$1");
        });
        if(i_type === 0){
            return a_YMDList.join('-');
        }else if(i_type === 1){
            return a_HMSList.join(':');
        }else{
            return a_YMDList.join('-') + " "+ a_HMSList.join(':');
        }
        return a_YMDList.join('-');
    },
    //拼接object
    spliceObj(o_a,o_b){
        for (let variable in o_b) {
            if (o_b.hasOwnProperty(variable)) {
                o_a[variable] = o_b[variable];
            }
        }
        return o_a;
    },
    //截取字符串长度,超出部分显示...，一个中文算两个字符
    getSpliceStr(s_str,i_len){
        s_str = s_str || "";
        if(i_len >= s_str.replace(/[^\x00-\xff]/g, 'xx').length){
            return s_str;
        }
        let s_newStr='',i_newLen = 0,i_index = 0,i_charCode = 0;
        while (i_newLen<i_len){
            s_newStr += s_str[i_index];
            i_charCode = s_str.charCodeAt(i_index);
            i_newLen += (i_charCode >= 0 && i_charCode <= 128)? 1 : 2;
            i_index++;
        }
        return s_newStr + '...';
    },
    //获取系统类型：安卓为0，其他为1
    getSysType(){
        if((/android/gi).test(navigator.appVersion)){
            return ENUM_SYS_ANDROID;
        }
        return ENUM_SYS_IOS;
    },
    //获取浏览器类型：0:PC端，1:微信浏览器
    getBrowserType(){
        let ua = window.navigator.userAgent.toLowerCase();
        let browserList = ['','micromessenger','qq','ucbrowser','safari'];
        if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE|Android|Adr/.test(navigator.userAgent))){
            for (let i = 0; i < browserList.length; i++) {
                if(browserList[i] && (ua.indexOf(browserList[i]) !== -1)){
                    return i;
                }
            }
        }
        return 0;
    },
    //获取屏幕宽
    getScreenWidth(){
        return document.body.offsetWidth;
    },
    //拨打电话
    call(mobile){
        return false;
    },
    //设置窗口属性
    setWinAttr(o_params){
        return false;
    },
    //取消物理返回
    setBackDisable(){
        return false;
    },
    //打开系统通讯录选择联系人
    openContacts(f_callBack){
        return false;
    },
    //获取实际像素(设计稿像素转为实际像素)
    getPxReality(n_pxValue){
        return n_pxValue/32 * parseFloat(document.querySelector("html").style.fontSize);
    },
    //加载js
    loadJs(s_url,f_callback){
        let dom = document.createElement('script');
        dom.type = "text/javascript";
        dom.src = s_url;
        if (document.documentMode == 10 || document.documentMode == 9) {
            dom.onerror = dom.onload = loaded;
        } else {
            dom.onreadystatechange = ready;
            dom.onerror = dom.onload = loaded;
        }
        document.getElementsByTagName('head')[0].appendChild(dom);
        function ready() {
            if (s.readyState == 'loaded' || s.readyState == 'complete') {
                f_callback();
            }
        }
        function loaded() {
            f_callback();
        }
    },
    jsonP(s_url) {
        var JSONP=document.createElement("script");
        JSONP.type="text/javascript";
        JSONP.src=s_url;
        document.getElementsByTagName("head")[0].appendChild(JSONP);
    },
    replaceHtml(s_str){
        return s_str.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"'").replace(/&amp;/g,"&");
    }
}
module.exports = Base;
