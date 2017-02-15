/*
 * @Author: {daihanqiao}
 * @Date:   2015-12-25 16:40:55
 * @Last Modified by:   {daihanqiao}
 * @Last Modified time: 2016-01-06 11:17:34
 * 支付SDK
 * 需要引入WeixinJSBridge
 */

"use strict";
(function() {
	var paySdk = {
        //支付参数，支付类型：1.微信
		pay:function(o_params,i_type,callBack){
			i_type = i_type || 1;
            switch (i_type) {
                case 1:
                    console.log(o_params);
					if(Base.getBrowserType() === 1){
						WeixinJSBridge.invoke(
							'getBrandWCPayRequest',
							{
								'appId': o_params.appId,
								'timeStamp': o_params.timeStamp,
								'nonceStr': o_params.nonceStr,
								'package': o_params.package,
								'signType': o_params.signType,
								'paySign': o_params.paySign
							},
							function(res){
								switch (res.err_msg) {
									case "get_brand_wcpay_request:ok":
										if(callBack){
											callBack();
										}
									break;
									case "get_brand_wcpay_request:cancel":
									break;
									case "get_brand_wcpay_request:fail":
										Com.toast('支付失败');
									break;
									default:
									Com.toast(res.err_msg);
									break;
								}
							}
						);
					}
                    break;
                default:break;
            }
		},
	};

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		define(function(){
			return paySdk;
		});
	} else if(typeof module !== 'undefined' && module.exports){
		module.exports = paySdk;
	} else{
		window.PaySdk = paySdk;
	}
}());
