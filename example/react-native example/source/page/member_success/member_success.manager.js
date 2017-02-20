'use strict';
import Com from './common';
import Component from './member_success.component';
import BaseManager from './baseManager';

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'member_success');
		//动作
		this.actions = {
			rechargeHandler(member_id,card_id){
				return (dispatch, getState) => {
					Com.openWin('member_recharge',{member_id,card_id});
				};
			},
			wechatHandler(member_id){
				return (dispatch, getState) => {
					Com.openWin('member_bindWechat',{member_id});
				};
			}
		};
	}
}
