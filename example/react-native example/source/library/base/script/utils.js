/*
* @Author: 代汉桥
* @Date:   2016-06-02 11:46:55
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-27 16:56:44
*/

'use strict';
import {StyleSheet,Platform,Dimensions,PixelRatio} from 'react-native';
//设备的像素密度
let density = PixelRatio.get() >= 2 ? 2 : PixelRatio.get();
//设备信息
const o_deviceSize = Dimensions.get('window');

let o_utils = {
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
	//px->dp
	px2dp(n_pxValue){
		return n_pxValue/density;
	},
	//校验手机号
    checkMobile(i_mobileNum){
        let re = new RegExp(/^1(3|4|5|7|8)\d{9}$/);
        return re.test(i_mobileNum);
    },
    //格式化数字，比如：0->0.00
    getNumFormat:function(n_num,i_len){
        n_num = parseFloat(n_num) || 0;
        i_len = i_len || 2;
        return n_num.toFixed(i_len);
    },
    //格式化时间日期,time:秒数,type:0,输出年月日,1.输出时分秒,2.全部输出
    getTimeFormat(s_time,i_type=0){
        s_time = s_time ? new Date(parseInt(s_time)*1000) : new Date();
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
        }
        return `${a_YMDList.join('-')} ${a_HMSList.join(':')}`;
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
        return `${s_newStr}...`;
    },
    isEmptyObject(e){
        let key;
        for(key in e){
            if(e.hasOwnProperty(key)){
                return !1;
            }
        }
        return !0;
    },
};
export default o_utils;
