'use strict';
import Com from './common';
import BoxPay from './boxPay';
import Component from './pay_index.component';
import BaseManager from './baseManager';

//actionType
const {ACTION_401,ACTION_402,ACTION_403,ACTION_404} = Com;

let s_data;//商品数据


export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'pay_index');
		let _manager = this;
		this.initialState = {
			receivableMoney:"0",//应收款项
			totalMoney:"0",//折前款项
			payList:[],//支付列表
			vList:[],//V客列表
		};
		//动作
		this.actions = {
			init(){
				_manager.accountInput = "";
				_manager.passwordInput = "";
				return (dispatch, getState) => {
					let {receivableMoney,totalMoney,payList,vList,data} = Com.getPageParams();
					s_data = data;
					dispatch({type : ACTION_401,...{receivableMoney,totalMoney,vList,payList}});
				};
			},
			submit(value,self){
				return (dispatch, getState) => {
					if(value === 0){//修改优惠金额
						dispatch({type : ACTION_402,privilege:_manager.moneyInput});
						self.setState({curType:-1});
						_manager.moneyInput = 0;
					}else if (value === 1) {//会员账号密码
						if (!_manager.accountInput) {
							Com.toast("请输入账号");
						}else{
							let money = _manager.getCurState('receivableMoney');
							//会员支付
							Com.postVerify({act:'pay',op:'member_pay',order_amount:money,key:_manager.accountInput},(res)=>{
								let {code,data} =res;
								console.log("会员支付",res);
								if (parseInt(code) === 0) {
									let {isPresentation,member_info} = data;
									let {card_id,member_id,member_name,member_avatar} = member_info;
									dispatch({type:ACTION_403,m_name:member_name,m_url:member_avatar});
									if (parseInt(isPresentation) === 0) {//余额足够支付
										//生成订单
										Com.postVerify({act:'pay',op:'pay_index',data:s_data,rebate_amount:_manager.moneyInput,order_amount:money,payment_id:"12",vid:_manager.vListid,member_id:member_id},(res)=>{
											let {code,data} = res;
											Com.log("生成订单",res);
											if (parseInt(code) === 0) {
												let {order_sn} = data;
												_manager.cardId = card_id;
												_manager.orderSn = order_sn;
												//弹窗输入密码
												self.setState({promptVisible:true,message:"¥:"+money});
											}else{
												Com.toast(res.msg);
											}
										},true);
									}else{//余额不足
										Com.confirm("余额不足，当前余额:"+member_info.card_balance,()=>{
											Com.showProgress(false);
										},()=>{},1);
									}
								}else{
									Com.showProgress(false);
									Com.toast(res.msg);
								}
							},false,true);
						}
					}else if (value === 2) {//v客
						dispatch({type : ACTION_404,vName:_manager.vName});
						self.setState({curType:-1});
					}
				};
			},
			passwordSubmit(value,self){
				return (dispatch, getState) => {
					let money = _manager.getCurState('receivableMoney');
					if (value) {
						Com.postVerify({act:'pay',op:'confirm_pay',order_sn:_manager.orderSn,order_amount:money,card_id:_manager.cardId,member_paypwd:value},(res)=>{
							let {code,data} =res;
							Com.log(res);
							if (parseInt(code) === 0) {
								self.setState({promptVisible:false});
								Com.toast("支付成功");
							}else{
								self.setState({promptVisible:false});
								Com.toast(res.msg);
							}
						});
					}else{
						Com.toast("请输入密码");
					}
				};
			},
			privilegeChange(value){//修改优惠金额
				return (dispatch, getState) => {
					_manager.moneyInput = value;
				};
			},
			accountChange(value){//修改账号
				return (dispatch, getState) => {
					_manager.accountInput = value;
				};
			},
			passwordChange(value){//修改密码
				return (dispatch, getState) => {
					_manager.passwordInput = value;
				};
			},
			vChange(value,name){//修改v客
				return (dispatch, getState) => {
					_manager.vListid = value;
					_manager.vName = name;
				};
			},
			posPay(value){//请求支付数据
				return (dispatch, getState) =>{
					let payList = _manager.getCurState("payList");
					let money = _manager.getCurState('receivableMoney');
					let payment_type = payList[value].payment_type;
					const submit = ()=>{
						const succ = ()=>{
							Com.showProgress(false);
							Com.toast("支付成功");
						};
						//生成订单
						Com.postVerify({act:'pay',op:'pay_index',data:s_data,rebate_amount:_manager.moneyInput,order_amount:money,payment_id:payList[value].payment_id,vid:_manager.vListid,member_id:0},(res)=>{
							let {code,data} = res;
							if (parseInt(code) === 0) {
								console.log("生存订单",data);
								if (data) {
									let {order_sn,payment_code} = data;
									console.log(":2222");
									Com.postVerify({act:'pay',op:'dopay',order_sn:order_sn,money:money},(res)=>{
											let {code,data} = res;
											console.log(res);
											if(code === 0){
												let {amount,mCallBackUrl,mOrderTime,orderNo,outTradeNo,sign,transactionId} = data;
												let payData = {amount:amount.toString(),mCallbackUrl:mCallBackUrl,orderNo:orderNo,mOrderTime:mOrderTime,
													outTradeNo:outTradeNo,transactionId:transactionId.toString(),sign:sign,type:payment_code};
												BoxPay.pay(payData,(res)=>{
													let {code,data} = res;
													if (code === 0) {
														succ();
													}else{
														Com.toast("支付失败");
													}
												});
											}else{
												Com.toast(res.msg);
											}
										},true);
								}else{
									succ();
								}
							}else{
								Com.toast(res.msg);
							}
						},false,true);
					};
					if(parseInt(payment_type) === 1){
						Com.confirm(`确定是否充值${money}元`,()=>{
							submit();
						});
					}else{
						submit();
					}
				};
			}
		};
		//处理
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_401:{//初始化
					let {receivableMoney,totalMoney,vList,payList} = action;
					return { ...state , ...this.initialState , ...{receivableMoney,totalMoney,vList,payList}};
				}
				case ACTION_402:{//修改优惠金额
					if (action.privilege <= state.receivableMoney) {
						return { ...state , ...{privilege:action.privilege,receivableMoney:state.receivableMoney-action.privilege}};
					}else{
						Com.toast("不能太优惠了，要亏本了");
					}
				}
				case ACTION_403:{//会员支付
					let {m_name,m_url} = action;
					return {...state,...{m_name,m_url}};
				}
				case ACTION_404:{//修改v客
					return {...state,vName:action.vName};
				}

				default:
					return state;
			}
		};
	}
}
