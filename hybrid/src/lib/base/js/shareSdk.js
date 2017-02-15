/*
 * @Author: {daihanqiao}
 * @Date:   2015-12-25 16:40:55
 * @Last Modified by:   {daihanqiao}
 * @Last Modified time: 2016-01-06 11:17:34
 * 分享SDK
 */

"use strict";
(function() {
	var shareSdk = {
        //分享参数，分享类型：1.微信
		share:function(o_params,i_type){
			i_type = i_type || 1;
            switch (i_type) {
                case 1:
                    //分享图片
					console.log(o_params);
                break;
                default:break;

            }
		},
	};

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		define(function(){
			return shareSdk;
		});
	} else if(typeof module !== 'undefined' && module.exports){
		module.exports = shareSdk;
	} else{
		window.ShareSdk = shareSdk;
	}
}());
