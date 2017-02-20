'use strict';
import { createStore , bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Com from './common';
import Home2 from './home2.entry';

//初始的redux state
let initialState = {
	
};

//actionType
//动作类型用常量表示
const HOME2_DO_SOMETHING = "home2_do_something";

//action
//动作写在这里，包括ajax
const actions = {
	doSomeThing( params ){
		return (dispatch, getState) => {
			dispatch({ type : HOME2_DO_SOMETHING ," params " : params});
		};
	},
};

//reducer
//保证传入确定的参数，会输出一样的结果，这里的state是当前组件的redux state
export let reducers = {
   home2Reducer(state=initialState,action){
		switch( action.type ){
			case HOME2_DO_SOMETHING:
				return { ...state , params : state.params };
			default:
				return state;
		}
	}
};

//将redux state绑定到组件属性中
function mapStateToProps( state ) {
  	return state.home2Reducer;
}

//将actions绑定到组件属性中
function mapDispatchToProps( dispatch ) {
  	return bindActionCreators( actions, dispatch );
}

// 导出和redux连接后的组件
export let Component = connect( mapStateToProps , mapDispatchToProps )( Home2 );
