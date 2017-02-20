'use strict';
import Com from './common';
import Component from './order_normsSelect.component';
import BaseManager from './baseManager';
import {isEqual} from 'lodash';

// actionType
const {ACTION_204,ACTION_205,ACTION_206,ACTION_207} = Com;

let old_specInfo = {};//上个页面传递过来的规格信息
let goods_flag = 0;//上个页面传递过来的商品标识

//提交数据
function _submitData(dispatch,specInfo){
	dispatch({type:ACTION_205,"specInfo":specInfo,goods_flag});
	Com.closeWin();
}

export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'order_normsSelect');
		let _manager = this;
		//初始数据
		this.initialState = {
			curTechIndex:-1,//当前选择技师index
			remark:'',//备注
		};
		//动作
		this.actions = {
			//初始化
			init(){
				return (dispatch, getState) => {
					let a_spec = Com.getPageParams('goods_list');
					let {curSpecIndex,curTechIndex,remark} = Com.getPageParams();
					goods_flag = Com.getPageParams('goods_flag');
					//缓存当前规格信息，用于对比是否更改
					old_specInfo = {curSpecIndex,curTechIndex,remark};
					dispatch({ type : ACTION_204 ,...{curTechIndex,remark}});
				};
			},
			//更改留言信息
			changeText(value){
				return (dispatch,getState)=>{
					dispatch({type : ACTION_207 , remark:value});
				};
			},
			//打开技师页面
			onOpenTech(){
				return(dispatch,getState) =>{
					const curTechIndex = _manager.getCurState("curTechIndex");
					let a_tech = Com.getPageParams('a_tech');
					Com.openWin("order_technicianList",{a_tech,curTechIndex});
				};
			},
			//返回操作
			backPress(self){
				return(dispatch,getState) =>{
					let {curTechIndex,remark} = _manager.getCurState();
					let curSpecIndex = parseInt(self._radio.value);
					let new_specInfo = {curSpecIndex,curTechIndex,remark};
					if (isEqual(old_specInfo,new_specInfo)){
						Com.closeWin();
					}else{
						Com.confirm("是否保存当前操作",()=>{
							_submitData(dispatch,new_specInfo);
						},()=>{
							Com.closeWin();
						});
					}
				};
			},
			//提交操作
			submit(self){
				return(dispatch,getState) =>{
					let curSpecIndex = parseInt(self._radio.value);
					let {remark,curTechIndex} = _manager.getCurState();
					_submitData(dispatch,{curSpecIndex,curTechIndex,remark});
				};
			}
		};
		//处理
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_204:{//初始化
					let {curSpecIndex,curTechIndex,remark} = action;
					return { ...state , ...this.initialState , ...{curSpecIndex,curTechIndex,remark}};
				}
				case ACTION_206:{//选择技师
					return { ...state , curTechIndex:action.curTechIndex};
				}
				case ACTION_207:{//更改留言
					return {...state , remark:action.remark};
				}
				default:
					return state;
			}
		};
	}
}
