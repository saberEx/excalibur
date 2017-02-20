'use strict';
import Com from './common';
import Component from './reservation_details.component';
import BaseManager from './baseManager';
//actionType
const {ACTION_305,ACTION_306,ACTION_307,ACTION_308} = Com;

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'reservation_details');
		//初始状态
		this.initialState = {
			data:{},
			n_totalPrice:0,
			editStatus:false
		};
		//动作
		this.actions = {
			init(){
				return (dispatch, getState) => {
					let data = Com.getPageParams();
					dispatch({ type : ACTION_305 , params : data});
				};
			},
			//确定订单
			confirmOrder(reserve_id){
				return (dispatch, getState) => {
					Com.getVerify({act:"reserve",op:"reserve_save",reserve_id:reserve_id},(res)=>{
						let {code,msg} = res;
						if(code===0){
							let {sectionID,rowID,tabIndex} = Com.getPageParams();
							dispatch({ type : ACTION_306 , sectionID,rowID,tabIndex});
							Com.closeWin();
						}else {
							Com.toast(msg);
						}
					});
				};
			},
			//点击编辑
			f_changeEditStatus(){
				return (dispatch, getState) => {
					dispatch({ type : ACTION_308 });
				};
			},
			//编辑完成
			f_edit(reserve_id,linkman,tel,remarks){
				return (dispatch, getState) => {
					if(!linkman){
						return Com.toast("联系人不能为空");
					}
					if(!tel){
						return Com.toast("手机号不能为空");
					}
					Com.getVerify({act:"reserve",op:"up_reserve",reserve_id:reserve_id,linkman:linkman,tel:tel,remarks:remarks},(res)=>{
						let {code,msg} = res;
						if(code===0){
							let {sectionID,rowID,tabIndex} = Com.getPageParams();
							dispatch({ type : ACTION_307 ,linkman,tel,remarks,sectionID,tabIndex,rowID});
						}else {
							Com.toast(msg);
						}
					});
				};
			}
		};
		//处理
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_305:{
					return { ...state , ...this.initialState , ...action.params };
	           }
				case ACTION_307:{
					let {linkman,tel,remarks} = action;
					return {...state,editStatus:false,linkman,tel,remarks};
				}
				case ACTION_308:{
					return {...state,editStatus:true};
				}
				default:
					return state;
			}
		};
	}
}
