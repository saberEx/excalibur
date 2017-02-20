/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 15:59:40
* 基础库，将base.style.js并入base.js，对外调用只使用base
*/
'use strict';
import React from 'react';
import {StyleSheet,Platform,Dimensions} from 'react-native';
import {baseStyleConfig,baseStyle} from './base.style';
//设备信息
const o_deviceSize = Dimensions.get('window');
let o_base =  {
	//是否为安卓平台
	isAndroid:Platform.OS === 'android',
	//是否为IOS平台
	isIos:Platform.OS === 'ios',
	//获取设备宽
	deviceWidth:o_deviceSize.width,
	//获取设备高
	deviceHeight:o_deviceSize.height,
	//生成样式表
	genStyle(o_style){
		return StyleSheet.create(o_style);
	},
	//设置导航器
	set navigator(_navigator){
		if(!this._navigator){
			this._navigator = _navigator;
		}
	},
	//获取导航器
	get navigator(){
		if(!this._navigator){
    		throw "未设置导航器";
    	}
		return this._navigator;
	},
	//路由名称字段名
	get routerKey(){
		return 'S_ROUTER_NAME_KEY';
	},
	//显示loading
	showProgress(){

	},
	hideProgress(){

	},
	//打开窗体
    openWin(s_name , o_params){
    	let o_page = this.navigator.getCurrentRoutes().find((page)=>{
    		return page[this.routerKey] === s_name;
    	});
    	if(o_page){
    		//该路由已存在于当前栈中
			this.navigator.jumpTo(Object.assign(o_page,o_params));
    	}else{
    		this.navigator.push({[this.routerKey]:s_name,...o_params});
    	}
    },
    //关闭窗体
    closeWin(){
        this.navigator.pop();
    },
    //ajax
    ajax:function(s_requestUrl,o_param,f_callBack,b_isNoShowProgress,b_isNoHideProgress,s_method,f_errorCallBack){
        s_method = s_method || "post";
        let self = this;
        if(!b_isNoShowProgress){
            self.showProgress();
        }
        //将请求参数转换为字符串
        function toQueryString(obj) {
		    return obj ? Object.keys(obj).sort().map((key) => {
		        let val = obj[key];
		        if (Array.isArray(val)) {
		            return val.sort().map((val2) => {
		                return `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`;
		            }).join('&');
		        }
		        return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
		    }).join('&') : '';
		}
		fetch(`${s_requestUrl}?${toQueryString(o_param)}`,{
	    	method: s_method,
	    })
        .then((response) => {
        	!b_isNoHideProgress && self.hideProgress();
    		if(response.status !== 200){
    			f_errorCallBack && f_errorCallBack();
	        	console.warn(`请求错误，状态码：${response.status}`);
	            return;
	        }
	        response.json().then((data)=>{
	        	f_callBack && f_callBack(data);
	        	console.log(data);
	        });
    	})
  		.catch((error) => {
  			!b_isNoHideProgress && self.hideProgress();
  			f_errorCallBack && f_errorCallBack();
		    console.warn(error);
	  	});
    },
};
//将基础样式配置并入基础库，保证对外调用使用Base.configName
Object.assign(o_base,baseStyleConfig);
//将基础样式并入基础库，保证对外调用使用Base.styleName
Object.assign(o_base,o_base.genStyle(baseStyle));
export default o_base;
