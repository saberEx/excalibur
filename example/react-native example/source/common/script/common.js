/*
* @Author: 代汉桥
* @Date:   2016-05-16 09:29:20
* @Last Modified by:   卢旺
* @Last Modified time: 2016-07-08 09:31:38
* 公共库，包括对base.js的覆盖
*/
'use strict';
import Base from './base';
import {comStyleConfig,comStyle} from './common.style';
import Config from './config';
import { NativeModules,DeviceEventEmitter,Alert} from 'react-native';
import * as ActionType from './actionType';
let {DeviceInfo,EventAndroid} = NativeModules;


//用户本地信息常量
const USER_LOCALDATA = 'USERLOCALDATA';

//请求
function _request(s_method , o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress ){
    o_param = o_param ? o_param : {};
    let s_requesrUrl = `${Config.API_BASE_URL}`;
    Base.ajax(s_requesrUrl, o_param, (res)=>{
            if(res && res.code === -1){
                Base.removeLocalData(USER_LOCALDATA,null);
                Base.resetToWin('user_login');
            }else{
                f_callBack(res);
            }
        }, b_isNoShowProgress, b_isNoHideProgress,s_method,function(err){
        Base.log(err);
    });
}
let o_common = {
    //是否为调试模式
    DEBUG:false,
    //用户本地信息常量
    get USER_LOCALDATA(){
        return USER_LOCALDATA;
    },
    //获取用户本地存储信息
    getUserData(s_key = null){
        return (s_key && this.userInfo)?this.userInfo[s_key]:this.userInfo;
    },
    //获取设备ID
    getDeviceId(){
        return DeviceInfo.deviceId;
    },
    //获取版本号
    getBuildNumber(){
        return DeviceInfo.buildNumber;
    },
    setAlias(alias){//设置推送别名
        EventAndroid.setAlias(alias);
    },
    addNativeEvent(event,f_callBack){//添加事件监听
        //事件处理
        DeviceEventEmitter.addListener(event, function(e: Event) {
            f_callBack && f_callBack(e.data);
        });
    },
    removeNativeAllEvent(event){//移除事件监听
        DeviceEventEmitter.removeAllListeners(event);
    },
    //确定弹窗
    confirm(s_msg,f_conrirm,f_cancel,type=0,s_title=null){
        let btnGroup = [{text: '确定', onPress: () => {f_conrirm && f_conrirm();}}];
        if(type === 0){
            btnGroup.unshift({text: '取消', onPress: () => {f_cancel && f_cancel();}});
        }
        Alert.alert(
            s_title,
            s_msg,
            btnGroup
        );
    },
    //获取商品图片绝对路径
    getGoodsImagePath(imageName,size){
        let imagePath;
        if(imageName){
            //店铺ID(图片目录)
            let store_id = imageName.substring(imageName.lastIndexOf("/")+1,imageName.indexOf("_"));
            //图片尺寸
            let dotIndex = imageName.lastIndexOf(".");
            let sizeNum = size || 240;
            let imageName_new = `${imageName.substring(0,dotIndex)}_${sizeNum}${imageName.substring(dotIndex)}`;
            imagePath = `${Config.UPLOAD_PATH}shop/store/goods/${store_id}/${imageName_new}`;
        }else{
            imagePath = '';
        }
        return imagePath;
    },
    //post请求非校验接口
	postNormal(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param['shopId'] = this.getUserData('shopId');
        _request('post', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    },
    //get请求非校验接口
    getNormal(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param['shopId'] = this.getUserData('shopId');
        _request('get', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    },
    //post请求需校验身份的接口
    postVerify(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param['deviceId'] = this.getDeviceId();
        let {shopId,account,token} = this.getUserData();
        Object.assign(o_param,{shopId,account,token});
        _request('post', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    },
    //get请求需校验身份的接口
    getVerify(o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress) {
        o_param['deviceId'] = this.getDeviceId();
        let {shopId,account,token} = this.getUserData();
        Object.assign(o_param,{shopId,account,token});
        _request('get', o_param, f_callBack, b_isNoShowProgress, b_isNoHideProgress);
    }
};
//将actionType并入公共库
Object.assign(o_common,ActionType);
//将公共样式配置并入公共库
Object.assign(o_common,comStyleConfig);
//将公共样式并入公共库
Object.assign(o_common,Base.genStyle(comStyle));
Object.assign(Base,o_common);
export default Base;
