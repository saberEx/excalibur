'use strict';
import Com from './common';
import Component from './member_recharge.component';
import BaseManager from './baseManager';
import BoxPay from './boxPay';

const{ACTION_502,ACTION_506} = Com;

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'index');
		//初始值
		this.initialState = {
		 	a_data:[],
	 		a_pay:[],
		};
		//动作
		this.actions = {
			init( params ){
				return (dispatch, getState) => {
					Com.getNormal({act:'member_pos',op:'get_recharge_rules'},(res)=>{
						let {code,data} = res;
						if (parseInt(code) === 	0) {
							Com.getNormal({act:'pay',op:'pay_type'},(res)=>{
								let pay_data = res.data;
								if (parseInt(res.code) === 0) {
									let {payment_list=[]} = pay_data;
									dispatch({type : ACTION_502,...{payList:payment_list,data}});
								}else{
									Com.toast(res.msg);
								}
							},true);
						}else{
							Com.toast(res.msg);
						}
					},false,true);
				};
			},
			chooseRecharge(member_id,payment_id,rule_id,payment_type,money,handsel){
				return (dispatch, getState) => {
					const submit = ()=>{
						const succ = (money,ticket)=>{
							dispatch({type:ACTION_506,data:{card_balance:money,card_presentation:handsel}});
							Com.closeWin();
						};
						Com.postVerify({act:'pay',op:'rechargePay',rule_id:rule_id,payment_id:payment_id,member_id:member_id},(res)=>{
							let {code,data} = res;
							console.log(res);
							if(code === 0){
								if(data){//pos支付
									let {amount,mCallBackUrl,mOrderTime,orderNo,outTradeNo,sign,transactionId,payment_code} = data;
									let payData = {amount:amount.toString(),mCallbackUrl:mCallBackUrl,orderNo:orderNo,mOrderTime:mOrderTime,outTradeNo:outTradeNo,transactionId:transactionId.toString(),sign:sign,type:payment_code};
									console.log(payData);
									BoxPay.pay(payData,(res)=>{
										if(parseInt(res.code) === 0){
											succ(money,handsel);
										}else{
											Com.toast(res.msg);
										}
									});
								}else{
									succ(money,handsel);
								}
							}else{
								Com.toast(res.msg);
							}
						});
					};
					if(parseInt(payment_type) === 1){
						Com.confirm(`确定是否充值${money}元`,()=>{
							submit();
						});
					}else{
						submit();
					}
				};
			},
		};
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_502:{
					return { ...state , ...this.initialState , a_data : action.data ,a_pay: action.payList};
	           	}
				default:
					return state;
			}
		};
	}
}
