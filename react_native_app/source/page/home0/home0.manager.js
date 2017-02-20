'use strict';
import { createStore , bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Com from './common';
import Home0 from './home0.entry';

//初始的redux state
let initialState = {
	text:'2222222222'
};

//actionType
//动作类型用常量表示
const HOME0_DO_SOMETHING = "home0_do_something";

//action
//动作写在这里，包括ajax
const actions = {
	test( params ){
		return (dispatch, getState) => {
			Com.openWin('index');
			// dispatch({ type : HOME0_DO_SOMETHING ,"text" : '22222'});
		};
	},
};

//reducer
//保证传入确定的参数，会输出一样的结果，这里的state是当前组件的redux state
export let reducers = {
   home0Reducer(state=initialState,action){
		switch( action.type ){
			case HOME0_DO_SOMETHING:
				return { ...state , text : action.text };
			default:
				return state;
		}
	}
};

//将redux state绑定到组件属性中
function mapStateToProps( state ) {
	console.log(state);
  	return state.home0Reducer;
}

//将actions绑定到组件属性中
function mapDispatchToProps( dispatch ) {
  	return bindActionCreators( actions, dispatch );
}

// 导出和redux连接后的组件
export let Component = connect( mapStateToProps , mapDispatchToProps )( Home0 );
