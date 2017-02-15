/*
 * @Author: {daihanqiao}
 * @Date:   2015-12-25 16:40:55
 * @Last Modified by:   {daihanqiao}
 * @Last Modified time: 2016-01-06 11:17:34
 * 支付SDK
 */

"use strict";
(function() {
	var paySdk = {
        //调起APP支付，支付参数，支付类型：1.微信
		pay:function(o_params,i_type){
			i_type = i_type || 1;
            switch (i_type) {
                case 1:
                    console.log(o_params);
                    break;
                default:break;
            }
		},
        //扫码支付，支付参数，支付类型：1.微信
        scannerPay:function(o_params,i_type){
            i_type = i_type || 1;
            switch (i_type) {
                case 1:
                    console.log(o_params);
                    break;
                default:break;
            }
        }
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
