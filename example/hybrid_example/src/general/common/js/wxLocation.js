/*
* @Author: 代汉桥
* @Date:   2016-08-16 13:51:39
* @Last Modified by:   卢旺
* @Last Modified time: 2017-01-20 14:34:04
*/

'use strict';
module.exports = {
	init(f_getLocationCallBack){
		if(Com.b_wechat){
			Com.loadJs("http://res.wx.qq.com/open/js/jweixin-1.0.0.js",()=>{
			    Com.getNormal({act: 'normal_base', op: 'wx_share' }, (ret)=>{
			    	wx.config({
			    	    debug : false,
			    	    appId: ret.data.appId,
			    	    timestamp: ret.data.timestamp,
			    	    nonceStr: ret.data.noncestr,
			    	    signature: ret.data.signature,
			    	    jsApiList: ['getLocation']
			    	});
			    },true,true);
			    wx.ready(function(){
			        if(f_getLocationCallBack){
				        wx.getLocation({
				            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				            success: function (res) {
				                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
				                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
				                var accuracy = res.accuracy; // 位置精度
				                f_getLocationCallBack({lat:latitude,lon:longitude});
				            },
				            cancel: function(res){
				                f_getLocationCallBack(null);
				            },
				            fail: function(res){
				                f_getLocationCallBack(null);
				            }
				        });
			        }
			    });
			    wx.error(function(res){//错误上报
			        // alert('wx.error: '+JSON.stringify(res));
			    });
			})
		}else{
			f_getLocationCallBack(null);
		}
	}
}
