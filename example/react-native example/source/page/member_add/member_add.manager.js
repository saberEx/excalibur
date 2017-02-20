'use strict';
import Com from './common';
import Component from './member_add.component';
import BaseManager from './baseManager';

const {ACTION_501} = Com;

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'member_add');
		//初始状态
		this.initialState = {
			a_data:[],
		};
		//动作
		this.actions = {
			init(){
				return (dispatch, getState) => {
					Com.getNormal({act:'member_pos',op:'get_v_list'},(res)=>{
						let {code,data} = res;
						if (parseInt(code) === 	0) {
							dispatch({ type : ACTION_501 ,params : data});
						}else{
							Com.toast(res.msg);
						}
					});
				};
			},
			getCardData(self){
				return (dispatch, getState) => {
					let item = self.refs;
					let memberName = item.memberName.value;
					let memberCard = item.memberCard.value;
					let memberMobile = item.memberMobile.value;
					let vid = (parseInt(item.vid.value) ===-1)?0:item.vid.value;
					if (!memberName) {
						Com.toast('请输入会员名称');
					}else if (!Com.checkMobile(memberMobile)) {
						Com.toast('请输入正确的手机号');
					}else if (!memberCard) {
						Com.toast('请输入会员卡号');
					}else{
						Com.postNormal({act:'member_pos',op:'put_card',memberName:memberName,memberMobile:memberMobile,cardId:memberCard,memberSex:item.memberSex.value,vid:vid},(res)=>{
							if(res.code === 0){
								let member_id = res.data.member_id;
								Com.openWin('member_success',{memberCard,member_id});
							}else{
								Com.toast(res.msg);
							}
						});
					}
				};
			}
		};
		//处理
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_501:{
					return {...state,...this.initialState,a_data: action.params};
				}
				default:
					return state;
			}
		};
	}
}
