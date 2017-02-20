'use strict';
import Com from './common';
import Component from './order_confirmSubmit.component';
import BaseManager from './baseManager';

//actionType
const {ACTION_208,ACTION_209,ACTION_210} = Com;

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'order_confirmSubmit');
		let _manager = this;
		//初始状态
		this.initialState = {
			a_checkedData:[],
			n_totalNum: 0,
			n_totalPrice: 0
		};
		//动作
		this.actions = {
			init( params ){
				return (dispatch, getState) => {
					let {a_checkedData,n_totalNum,n_totalPrice} = Com.getPageParams();
					dispatch({ type : ACTION_208 ,"params" : {a_checkedData,n_totalNum,n_totalPrice}});
				};
			},
			//修改数量
			changeNum(oldValue,newValue,index){
				return (dispatch, getState) => {
					dispatch({ type : ACTION_209 ,"data" : {oldValue,newValue,index}});
				};
			},
			//选中状态改变
			checkChange(index,checked){
				return (dispatch, getState) => {
					dispatch({ type : ACTION_210 ,"checkData" : {index,checked}});
				};
			},
			//结算
			submit(){
				return (dispatch, getState) => {
					let {a_checkedData} = _manager.getCurState();
					let a_checked = a_checkedData.map((item)=>{
						if(item.checked){
							return item;
						}
					});
					let s_datas = "";
					a_checked.map((item,index)=>{
						s_datas += `${item.goods_list[item.curSpecIndex].goods_id}#|#${item.num}#|#${item.goods_list[item.curSpecIndex].type_id}#|#${item.curTechIndex}#|#${item.remark}#,#`;
					});
					s_datas = s_datas.replace(/(#,#)$/, '');
					Com.getNormal({act:'member_pos',op:'get_v_list'},(res)=>{
						let {code,data} = res;
						if (parseInt(code) === 	0) {
							Com.getNormal({act:'pay',op:'pay_type'},(res)=>{
								let pay_data = res.data;
								Com.log("支付方式",pay_data);
								if (parseInt(res.code) === 0) {
									let {payment_list=[]} = pay_data;
									let price = _manager.getCurState("n_totalPrice");
									Com.openWin('pay_index',{payList:payment_list,vList:data,receivableMoney:price,totalMoney:price,data:s_datas},true);
								}else{
									Com.toast(res.msg);
								}
							},true);
						}else{
							Com.toast(res.msg);
						}
					},false,true);
				};
			}
		};
		//处理
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_208:
					return {...state,...this.initialState,...action.params};
				case ACTION_209:{
					let {n_totalNum,n_totalPrice,a_checkedData} = state;
					let {oldValue, newValue, index} = action.data;
					let {price,checked} = a_checkedData[index];
					let changeNum = newValue-oldValue;
					a_checkedData[index].num = newValue;
					if(checked) {
						return { ...state,n_totalNum : n_totalNum+changeNum, n_totalPrice:n_totalPrice+changeNum*price};
					}
					return state;
				}
				case ACTION_210:{
					let {n_totalNum,n_totalPrice,a_checkedData} = state;
					let {index,checked} = action.checkData;
					let {price,num} = a_checkedData[index];
					a_checkedData[index].checked = checked;
					if(checked){
						return { ...state,n_totalNum : n_totalNum+num, n_totalPrice:n_totalPrice+num*price};
					}
					return { ...state,n_totalNum : n_totalNum-num, n_totalPrice:n_totalPrice-num*price};
				}
				default:
					return state;
			}
		};
	}
}
