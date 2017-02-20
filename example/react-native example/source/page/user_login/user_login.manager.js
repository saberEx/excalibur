'use strict';
import Com from './common';
import Component from './user_login.component';
import BoxPay from './boxPay';
import BaseManager from './baseManager';

//登录成功处理
function _loginSucc(data,account){
	let o_userData = {...data,account:account};
	Com.userInfo = o_userData;
	Com.setLocalData(Com.USER_LOCALDATA,o_userData);
	BoxPay.cashBoxInit(data.appCode,data.merchantNo,(res)=>{
		if(res.code === 0){
			Com.openWin('index',null,true);
		}else{
			Com.toast(res.msg);
		}
	});
}

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'user_login');
		this.actions = {
			login(self ){
				let account = self.refs.name.value;
				let password = self.refs.password.value;
				if(!account){
					return Com.toast('请输入正确的用户名');
				}
				if(!password){
					return Com.toast('请输入正确的密码');
				}
				return (dispatch, getState) => {
					Com.postNormal({act:'account',op:'login',deviceId:Com.getDeviceId(),account:account,password:password},(res)=>{
						let {code,data} = res;
						if(code===0){
							_loginSucc(data,account);
						}else {
							Com.toast(res.msg);
						}
					});
				};
			},
			//自动登录
			autoLogin(){
				return (dispatch, getState) => {
					Com.getLocalData(Com.USER_LOCALDATA,(value)=>{
						if(value){
							Com.postNormal({act:'account',op:'auto_login',deviceId:Com.getDeviceId(),account:value.account,token:value.token},(res)=>{
								if(res.code===0){
									_loginSucc(res.data,value.account);
								}else {
									Com.toast(res.msg);
								}
							});
						}
					});
				};
			}
		};
	}
}
