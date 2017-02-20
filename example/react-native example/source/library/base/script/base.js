/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   卢旺
* @Last Modified time: 2016-07-01 11:26:44
* 基础库，将base.style.js并入base.js，对外调用只使用base
*/
'use strict';
import React from 'react';
import {baseStyleConfig,baseStyle} from './base.style';
import BaseComponent from './baseComponent';
import BaseAnimationComponent from './baseAnimationComponent';
import Storage from 'react-native-storage';
import axios from 'axios';
import Utils from './utils';
import { BackAndroid } from 'react-native';
//事件处理器
import EventEmitter from 'EventEmitter';
const _eventEmitter = new EventEmitter();

//本地数据存储
let storage = new Storage({
  	size: 1000,//最大容量，默认值1000条数据循环存储
  	defaultExpires: null,//数据过期时间，默认一整天（1000 * 3600 * 24秒），null为长期有效
  	enableCache: true, //读写时在内存中缓存数据。默认启用。
  	sync : {}//如果storage中没有相应数据，或数据已过期，则会调用相应的sync同步方法，无缝返回最新数据
});

let o_base =  {
	//是否为调试模式
    DEBUG:true,
    //复写log
    log(){
        if(this.DEBUG){
            console.log.apply(console,arguments);
        }
    },
    //生成字体样式
    fzStyle:(size)=>{
        return {fontSize : Utils.px2dp(size)};
    },
    //生成边框线样式n_type:0->上，1->右，2->下，3->左
    borderStyle(n_type){
    	let types = ['Top','Right','Bottom','Left'];
    	let s_type = types[n_type] || 'Top';
    	return {
    		[`border${s_type}Width`]:Utils.px2dp(1),
    		[`border${s_type}Color`]:'#ddd',
    	};
    },
    //保存redux-store的引用
    get store(){
    	if(!this._store){
    		throw '未设置store';
    	}
    	return this._store;
    },
    set store(value){
    	if(!this._store){
    		this._store = value;
    	}
    },
	//存储本地数据
	//请不要在key中使用_下划线符号!!!
	setLocalData(s_key,u_value){
		let [s_storageName,s_valueKey] = s_key.split('.');
		this.getLocalData(s_storageName,(data)=>{
			s_valueKey && (data = data || {});
			(data && s_valueKey) ? data[s_valueKey] = u_value : data = u_value;
			storage.save({
				key:s_storageName,
				rawData: data
			});
		});
	},
	//获取本地数据
	getLocalData(s_key,f_callback){
		let [s_storageName,s_valueKey] = s_key.split('.');
		storage.load({
			key:s_storageName
		}).then((ret) => {
			f_callback(s_valueKey && typeof ret === "object" ? ret[s_valueKey] : ret);
		}).catch(()=>{
			f_callback(null);
		});
	},
	//删除本地数据
	removeLocalData(s_storageName){
		storage.remove({key: s_storageName});
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
	//toast
	toast(s_message,s_alertType){

	},
	//显示loading
	showProgress(b_loading){

	},
	//路由名称字段名
	get routerKey(){
		return 'S_ROUTER_NAME_KEY';
	},
	//路由参数（页面参数)
	getPageParams(s_key = null){
		return (s_key && this.navigatorParams) ? this.navigatorParams[s_key] : this.navigatorParams;
	},
	//打开窗体,b_replace:是否替换当前场景,替换则当前场景无法返回
    openWin(s_name , o_params = null , b_replace = false){
    	let o_page = this.navigator.getCurrentRoutes().find((page)=>{
    		return page[this.routerKey] === s_name;
    	});
		this.navigatorParams = o_params;
    	if(o_page){
    		//该路由已存在于当前栈中
			this.navigator.jumpTo(Object.assign(o_page));
    	}else{
    		if(b_replace){
    			this.navigator.replace({[this.routerKey]:s_name});
    		}else{
    			this.navigator.push({[this.routerKey]:s_name});
    		}
    	}
    },
    //关闭窗体,b_reset:是否重置页面state
    closeWin(b_reset = true){
    	if(b_reset){
    		let _routes = this.navigator.getCurrentRoutes();
    		let s_curName = _routes[_routes.length - 1][this.routerKey];
    		this.store.dispatch({type:`closeWin_${s_curName}`});
    	}
        this.navigator.pop();
    },
    //打开窗体，并重置路由
    resetToWin(s_name , o_params){
    	let o_page = this.navigator.getCurrentRoutes().find((page)=>{
    		return page[this.routerKey] === s_name;
    	});
    	if(!o_page){
    		o_page = {[this.routerKey]:s_name};
    	}
    	this.navigatorParams = o_params;
    	this.navigator.resetTo(o_page);
    },
    //ajax
    ajax:function(s_requestUrl,o_param,f_callBack,b_isNoShowProgress,b_isNoHideProgress,s_method,f_errorCallBack){
        s_method = s_method.toLowerCase() || "get";
        let self = this;
        if(!b_isNoShowProgress){
            self.showProgress(true);
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
		let requestData = {
		  	method: s_method,
		  	timeout: 10000,
		};
		if(s_method !== 'post'){
		  	requestData['url'] = `${s_requestUrl}?${toQueryString(o_param)}`;
		}else{
		  	requestData['url'] = s_requestUrl;
		  	requestData['data'] = toQueryString(o_param);
		}
		axios(requestData).then(function (response) {
		    self.log(response.data);
		    f_callBack && f_callBack(response.data);
		    !b_isNoHideProgress && self.showProgress(false);
		}).catch(function (response) {
		    self.log(response);
		    !b_isNoHideProgress && self.showProgress(false);
		    f_errorCallBack && f_errorCallBack(response);
		});
    },
    //全局事件处理：监听事件，thisObject：监听主体
    addEvt(s_evtName,f_listener,thisObject){
    	if(!thisObject){
    		this.log(`${s_evtName}事件主体为空`);
    	}else if(thisObject[`_evtName_$(s_evtName)`] === s_evtName){
    		return;
    	}else{
    		thisObject[`_evtName_$(s_evtName)`] = s_evtName;
    	}
    	_eventEmitter.addListener(s_evtName,f_listener,thisObject);
    },
    //全局事件处理：移除事件
    removeEvt(s_evtName,thisObject){
    	//移除所有该类型事件监听
    	if(!thisObject){
    		_eventEmitter.removeAllListeners(s_evtName);
    	}else{
    		//该主体上没有该类型事件监听
	    	if(thisObject[`_evtName_$(s_evtName)`] !== s_evtName){
	    		return;
	    	}
	    	//移除该主体上所有该类型事件监听
	    	_eventEmitter._subscriber.getSubscriptionsForType(s_evtName).map((item,index)=>{
	    		console.log(item);
	    		if(item.context === thisObject && item.eventType === s_evtName){
	    			return _eventEmitter._subscriber.removeSubscription(item);
	    		}
	    	});
    	}
    },
    //全局事件处理：派发事件
    sendEvt(s_evtName,o_data){
    	_eventEmitter.emit(s_evtName,o_data);
    }
};
//将工具库并入base
Object.assign(o_base,Utils);
//将基础样式配置并入基础库，保证对外调用使用Base.configName
Object.assign(o_base,baseStyleConfig);
//将基础样式并入基础库，保证对外调用使用Base.styleName
Object.assign(o_base,o_base.genStyle(baseStyle));
//基础组件，实现了shouldComponentUpdate
o_base.Component = BaseComponent;
//基础组件，实现了动画设置
o_base.AnimationComponent = BaseAnimationComponent;

//处理back键
BackAndroid.addEventListener('hardwareBackPress', function() {
    o_base.closeWin();
    return true;
});
export default o_base;
