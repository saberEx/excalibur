/*
* @Author: 代汉桥
* @Date:   2016-05-18 13:22:47
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 15:49:08
*/

'use strict';
import Index from './index.entry';
import {createStore,bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import Com from './common';

//初始化状态
let initialState = {
  	num:0,
  	list:["1","2","3","4","5","6"]
};

//actionType
const INDEX_ADD_NUM = 'index_add_num';
const INDEX_DEL_LAST = 'index_del_last';

//action
const actions = {
	setNum(aa){
		return (dispatch, getState) => {
			// dispatch({type:INDEX_ADD_NUM,num:aa});
			// Com.openWin('searchPage',{text:'呵呵'});
			Com.requestNormal({act:'login',op:'login_in',account:'18507558811',password:'123456'},function(res){
				// console.log(res);
			});
		};
	},
	setNumYI(aa){
		return (dispatch) => {
		    setTimeout(() => {dispatch({type:INDEX_ADD_NUM,num:aa});}, 3000);
	  	};
	},
	delLast(){
		return (dispatch , getState) => {
			dispatch({type:INDEX_DEL_LAST});
		};
	}
};

//reducer
//保证输入确定的数，会输出一样的结果
export let reducers = {
	indexReducer(state=initialState,action){
		switch(action.type){
			case INDEX_ADD_NUM:
				return {...state,num:state.num+1};
			case INDEX_DEL_LAST:
				return {...state,list:['2','4']};
			default:
				return state;
		}
	}
};

function mapStateToProps(state) {
  	return state.indexReducer;
}
function mapDispatchToProps(dispatch) {
  	return bindActionCreators(actions, dispatch);
}

export let Component = connect(mapStateToProps,mapDispatchToProps)(Index);
