'use strict';
import Com from './common';
import Component from './index.component';
import BaseManager from './baseManager';
import BoxPay from './boxPay';

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'index');
		//动作
		this.actions = {
			onClick( s_pageName , o_param = null){
				return (dispatch, getState) => {
					Com.openWin(s_pageName,o_param);
					// let data = {amount:"10000",transactionId:"1469522628000",sign:"611E0EE28106BD9AF0C34FE433AC5E52",tradeNo:"99283146395995435123",outTradeNo:"14695136598000000037578001"};
					// BoxPay.cancle(data,(res)=>{
					// 	console.log(res);
					// });
				};
			},
			exit(){
				return (dispatch)=>{
					Com.removeLocalData(Com.USER_LOCALDATA,null);
					Com.resetToWin('user_login');
				};
			}
		};
	}
}
