'use strict';
import { createStore , bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Com from './common';
import Main from './main.entry';

//初始的redux state
let initialState = {

};

//actionType
//动作类型用常量表示
const MAIN_DO_SOMETHING = "main_do_something";

//action
//动作写在这里，包括ajax
const actions = {
	doSomeThing( params ){
		return (dispatch, getState) => {
			dispatch({ type : MAIN_DO_SOMETHING ," params " : params});
		};
	},
};

//reducer
//保证传入确定的参数，会输出一样的结果，这里的state是当前组件的redux state
export let reducers = {
   mainReducer(state=initialState,action){
		switch( action.type ){
			case MAIN_DO_SOMETHING:
				return { ...state , params : state.params };
			default:
				return state;
		}
	}
};

//将redux state绑定到组件属性中
function mapStateToProps( state ) {
  	return state.mainReducer;
}

//将actions绑定到组件属性中
function mapDispatchToProps( dispatch ) {
  	return bindActionCreators( actions, dispatch );
}

// 导出和redux连接后的组件
export let Component = connect( mapStateToProps , mapDispatchToProps )( Main );
