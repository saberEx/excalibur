/*
* @Author: 代汉桥
* @Date:   2016-05-16 09:29:20
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 16:03:03
* 公共库，包括对base.js的覆盖
*/
'use strict';
import Base from './base';
import {comStyleConfig,comStyle} from './common.style';
let o_common = {
	requestNormal(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param = o_param ? o_param : {};
        let s_requesrUrl = `http://shouyintai.bdhongshan.com/app/${o_param.act}/${o_param.op}`;
        Base.ajax(s_requesrUrl, o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress,'post',function(err){
            console.log(err);
        });
    },
};
//将公共样式配置并入公共库
Object.assign(o_common,comStyleConfig);
//将公共样式并入公共库
Object.assign(o_common,Base.genStyle(comStyle));
Object.assign(Base,o_common);
export default Base;
