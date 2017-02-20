/*
* @Author: 代汉桥
* @Date:   2016-06-12 09:47:52
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-13 09:59:41
* manager基类
*/
'use strict';
import { createStore , bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Base from './base';

export default class BaseManager {
	constructor(Component,name){
		this._Component = Component;
		this._name = name;
		//初始状态
		this.initialState = {};
		//动作
		this._actions = {};
		//处理
		this._reducers = (state,action)=>{
			switch( action.type ){
				default:return state;
			}
		};
	}
	//获取当前组件redux中的状态,参数为getState
	getCurState(params){
		let state = Base.store.getState()[`${this._name}Reducers`];
		return params ? state[params] : state;
	}
	//设置actions
	set actions(value){
		this._actions = value;
	}
	//设置reducers
	set reducers(value){
		this._reducers = value;
	}
	get reducers(){
		let self = this;
		let {_name,initialState} = self;
		return {
			[`${_name}Reducers`](state=initialState,action){
				//关闭页面，触发重置state中的数据
				if(action.type === `closeWin_${_name}`){
					return {...state,...initialState};
				}
				return self._reducers(state,action);
			}
		};
	}
	//将redux state绑定到组件属性中
	mapStateToProps( state ) {
	  	return state[`${this._name}Reducers`];
	}
	//将actions绑定到组件属性中
	mapDispatchToProps( dispatch ) {
	  	return bindActionCreators( this._actions, dispatch );
	}
	//获取和redux连接后的组件
	get Component(){
		return connect( this.mapStateToProps.bind(this) , this.mapDispatchToProps.bind(this) )( this._Component );
	}
}
