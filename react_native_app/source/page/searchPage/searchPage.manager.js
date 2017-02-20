/*
* @Author: 代汉桥
* @Date:   2016-05-18 13:22:47
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-19 15:15:11
*/

'use strict';
import SearchPage from './searchPage.entry';
import {createStore,bindActionCreators} from 'redux';
import { connect } from 'react-redux';

//初始化状态
let initialState = {
  	text:'搜索页'
};

//actionType
const SEARCHPAGE_SET_TEXT = 'searchPage_set_text';

//actions
//动作写在这里，包括ajax
const actions = {
	setText(aa){
		return (dispatch, getState) => {
			dispatch({type:SEARCHPAGE_SET_TEXT,text:aa});
		};
	},
	setTextYI(aa){
		return (dispatch) => {
		    setTimeout(() => {dispatch({type:SEARCHPAGE_SET_TEXT,text:aa});}, 3000);
	  	};
	}
};

//reducers
//不要修改state
//不要进行ajax请求
//这里的state是当前组件的state
export let reducers = {
	searchPageReducer(state=initialState,action){
		switch(action.type){
			case SEARCHPAGE_SET_TEXT:
				return {...state,text:state.text + action.text};
			default:
				return state;
		}
	}
};

function mapStateToProps(state) {
  	return state.searchPageReducer;
}
function mapDispatchToProps(dispatch) {
  	return bindActionCreators(actions, dispatch);
}

export let Component = connect(mapStateToProps,mapDispatchToProps)(SearchPage);
