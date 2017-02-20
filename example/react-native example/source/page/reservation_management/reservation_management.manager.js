'use strict';
import Com from './common';
import Component from './reservation_management.component';
import BaseManager from './baseManager';

//actionType
const {ACTION_301,ACTION_302,ACTION_303,ACTION_304,ACTION_306,ACTION_307,ACTION_310} = Com;
const PAGESIZE = 5;
let o_componentRefs = null;
export default class Manager extends BaseManager{
	constructor(props){
		super(Component,'reservation_management');
		let _manager = this;
		//初始状态
		this.initialState = {
			tabIndex:0,
			a_data:[],
			a_hasMore:[]
		};
		//动作
		this.actions = {
			init(){
				return (dispatch, getState) => {
					Com.getVerify({act:"reserve",op:"getReserveOrder",status:1,pagesize:PAGESIZE},(res)=>{
						let {code,data,msg} = res;
						if(code===0){
							let {list} = data;
							let {hasmore} = data.page;
							let a_data = [{},,,];
							list.forEach((item,index)=>{
								let {add_time} = item;
								let s_time = new Date(parseInt(add_time)*1000);
								let curDate = `${s_time.getFullYear()}年${s_time.getMonth()+1}月${s_time.getDate()}号`;
								let curTime = `${s_time.getHours().toString().replace(/(^\d{1}$)/,"0"+"$1")}:${s_time.getMinutes().toString().replace(/(^\d{1}$)/,"0"+"$1")}`;
								a_data[0][curDate] = a_data[0][curDate] || [];
								item.trueTime = curTime;
								a_data[0][curDate].push(item);
							});
							dispatch({ type : ACTION_301 , a_data,hasmore});
						}else {
							Com.toast(msg);
						}
					});
				};
			},
			//tab切换回调
			tabViewChange(index,curEl){
				return (dispatch, getState) => {
					if(curEl){
						dispatch({ type : ACTION_302 ,curIndex:index});
					}else {
						//请求当前tab位置的数据
						Com.getVerify({act:"reserve",op:"getReserveOrder",status:(1+index),pagesize:PAGESIZE},(res)=>{
							let {code,data,msg} = res;
							if(code===0){
								let {list} = data;
								let curData = {};
								let {hasmore} = data.page;
								list.forEach((item,key)=>{
									let {add_time} = item;
									let s_time = new Date(parseInt(add_time)*1000);
									let curDate = `${s_time.getFullYear()}年${s_time.getMonth()+1}月${s_time.getDate()}号`;
									let curTime = `${s_time.getHours().toString().replace(/(^\d{1}$)/,"0"+"$1")}:${s_time.getMinutes().toString().replace(/(^\d{1}$)/,"0"+"$1")}`;
									curData[curDate] = curData[curDate] || [];
									item.trueTime = curTime;
									curData[curDate].push(item);
								});
								dispatch({ type : ACTION_302 , curData : curData,curIndex:index,hasmore});
							}else {
								Com.toast(msg);
							}
					});
				}};
			},
			//分页上拉加载回调
			f_paginate(page,callback){
				return (dispatch, getState) => {
					let {a_data,tabIndex,a_hasMore} = _manager.getCurState();
					let curData = a_data[tabIndex];
					Com.getVerify({act:"reserve",op:"getReserveOrder",status:(1+tabIndex),curpage:page},(res)=>{
						let {code,data,msg} = res;
							if(code===0){
								let {hasmore} = data.page;
								 let {list} = data;
								 list.forEach((item,key)=>{
									 let {add_time} = item;
									 let s_time = new Date(parseInt(add_time)*1000);
									 let curDate = `${s_time.getFullYear()}年${s_time.getMonth()+1}月${s_time.getDate()}号`;
									 let curTime = `${s_time.getHours().toString().replace(/(^\d{1}$)/,"0"+"$1")}:${s_time.getMinutes().toString().replace(/(^\d{1}$)/,"0"+"$1")}`;
									 curData[curDate] = curData[curDate] || [];
									 item.trueTime = curTime;
									 curData[curDate].push(item);
								 });
								a_hasMore[tabIndex] = hasmore;
								callback(curData,{allLoaded:!hasmore});
							}else {
							 	Com.toast(msg);
							}
					},true);
				};
			},
			//取消
			f_cancel(reserve_id,sectionID,rowID){
				return (dispatch, getState) => {
					Com.confirm("你确定要取消该订单吗?",()=>{
						Com.getVerify({act:"reserve",op:"reserve_del",reserve_id:reserve_id},(res)=>{
							let {code,msg} = res;
							if(code===0){
								dispatch({ type : ACTION_303,sectionID,rowID});
							}else {
								Com.toast(msg);
							}
						});
					});
				};
			},
			//新建预定
			f_addReservation(){
				return (dispatch, getState) => {
					Com.openWin("reservation_build");
				};
			},
			//订跳转单详情页
			f_openDetails(sectionID,rowID){
				return (dispatch, getState) => {
					let {a_data,tabIndex} = _manager.getCurState();
					Com.openWin("reservation_details",{...a_data[tabIndex][sectionID][rowID],sectionID,rowID,tabIndex});
					// dispatch({ type : ACTION_304,sectionID,rowID,tabIndex});
				};
			},
			//更新保存组件的refs
			f_updateRefs(refs){
				return (dispatch, getState) => {
					o_componentRefs = refs ;
				};
			}

		};
		//处理
		this.reducers = (state,action)=>{
			switch( action.type ){
				case ACTION_301:{
					let {a_data,hasmore} = action;
					let a_hasMore = [];
					a_hasMore[0] = hasmore;
					return { ...state , ...this.initialState , a_data,a_hasMore };
	           }
				case ACTION_302:{
					let {curData,curIndex,hasmore} = action;
					let {a_data,tabIndex,a_hasMore} = state;
					tabIndex = curIndex;
					if(curData){
						a_hasMore[tabIndex] = hasmore;
						a_data[tabIndex] = curData;
						return { ...state,a_data: a_data,tabIndex:curIndex,a_hasMore};
					}
					return { ...state,a_data: a_data.concat(),tabIndex:curIndex,a_hasMore};
				}
				case ACTION_303:{
					let {sectionID,rowID} = action;
					let {a_data,tabIndex} = state;
					let item = a_data[tabIndex][sectionID][rowID];
					a_data[tabIndex][sectionID].splice(rowID,1);
					if(a_data[tabIndex][sectionID].length===0){
						delete a_data[tabIndex][sectionID];
					}
					o_componentRefs[`myListView_${tabIndex}`].f_updateRows(a_data[tabIndex]);
					if(a_data[3]){
						item.status = 4;
						a_data[3][sectionID] = a_data[3][sectionID] || [];
						a_data[3][sectionID].push(item);
						a_data[3][sectionID].sort((a,b)=>{return a.add_time-b.add_time});
						o_componentRefs["myListView_3"].f_updateRows(a_data[tabIndex]);
					}
					return {...state,a_data: a_data.concat(),tabIndex:tabIndex};
				}
				case ACTION_304:{
					let {a_data} = state;
					let {index,groupIndex,tabIndex} = action;
					let orderList = a_data[tabIndex][groupIndex];
					Com.openWin("reservation_details",{...orderList[index],groupIndex:groupIndex,tabIndex:tabIndex,curIndex:index});
					return state;
				}
				case ACTION_306:{
					let {sectionID,rowID,tabIndex} = action;
					let {a_data} = state;
					let item = a_data[tabIndex][sectionID][rowID];
					a_data[tabIndex][sectionID].splice(rowID,1);
					if(a_data[tabIndex][sectionID].length===0){
						delete a_data[tabIndex][sectionID];
					}
					o_componentRefs[`myListView_${tabIndex}`].f_updateRows(a_data[tabIndex]);
					if(a_data[2]){
						item.status = 3;
						a_data[2][sectionID] = a_data[3][sectionID] || [];
						a_data[2][sectionID].push(item);
						a_data[2][sectionID].sort((a,b)=>{return a.add_time-b.add_time});
						o_componentRefs["myListView_2"].f_updateRows(a_data[tabIndex]);
					}
					return {...state,a_data: a_data.concat(),tabIndex:tabIndex};
				}
				case ACTION_307:{
					let {linkman,tel,remarks,tabIndex,sectionID,rowID} = action;
					let {a_data} = state;
					let item = a_data[tabIndex][sectionID][rowID];
					a_data[tabIndex][sectionID][rowID] = {...item,linkman,tel,remarks};
					o_componentRefs[`myListView_${tabIndex}`].f_updateRows(a_data[tabIndex]);
					return  {...state,a_data: a_data.concat(),tabIndex:tabIndex};
				}
				case ACTION_310:{
					let {curData} = action;
					let {a_data} = state;
					let s_time = new Date(parseInt(curData.add_time)*1000);
					let curDate = `${s_time.getFullYear()}年${s_time.getMonth()+1}月${s_time.getDate()}号`;
					let curTime = `${s_time.getHours().toString().replace(/(^\d{1}$)/,"0"+"$1")}:${s_time.getMinutes().toString().replace(/(^\d{1}$)/,"0"+"$1")}`;
					if(a_data[0]){
						curData.trueTime = curTime;
						a_data[0][curDate] = a_data[0][curDate] || [];
						a_data[0][curDate].unshift(curData);
						o_componentRefs["myListView_0"].f_updateRows(a_data[0]);
					}
					return {...state,a_data: a_data.concat()};
				}
				default:
					return state;
			}
		};
	}
}
