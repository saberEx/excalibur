'use strict';
import Com from './common';
import Component from './reservation_build.component';
import BaseManager from './baseManager';

//将redux state绑定到组件属性中
function mapStateToProps( state ) {
	return state.reservation_buildReducer;
}
//动作类型用常量表示
const {ACTION_309,ACTION_310} = Com;
export default class Manager extends BaseManager {
	constructor(props) {
		super(Component, 'reservation_build');
		//初始状态
		this.initialState = {};
		//动作
		this.actions = {
			init( params ){
				return (dispatch, getState) => {
					dispatch({ type : ACTION_309 , params : params});
				};
			},
			//新建预约确定
			f_addReservation(date,linkman,tel,sex,number,remarks=""){
				return (dispatch, getState) => {
					if(!date){
						Com.toast("请选择预约日期和时间");
						return;
					}
					if(!linkman){
						Com.toast("联系人不能为空");
						return;
					}
					if(!tel){
						Com.toast("联系方式不能为空");
						return;
					}
					if(!sex){
						Com.toast("请选择性别");
						return;
					}
					Com.getVerify({act:"reserve",op:"reserve_add",reserve_time:date.getTime(),linkman,tel,sex,number,remarks},(res)=>{
						let {code,msg} = res;
						if(code===0){
							dispatch({ type : ACTION_310 ,curData:res.data});
							Com.closeWin();
						}else {
							Com.toast(msg);
						}
					});
				};
			}
		};
		//处理
		this.reducers = (state, action)=> {
			switch( action.type ){
				case ACTION_309:{
					return { ...state , ...this.initialState  , params : action.params };
				}
				default:
					return state;
			}
		};
	}
}
