'use strict';
import React,{ Component } from 'react';
import { View , Text } from 'react-native';
import Com from './common';
import TopBar from './topBar';
import BottomTab from './bottomTab';
import {o_components} from './indexConfig';
let a_list = [];
class Main extends Component {
	constructor(props){
		super(props);
		this.a_list = [];
		for (let i = 0; i <= 3; i++) {
			let ViewComponent = o_components[`home${i}`];
			this.a_list.push(<ViewComponent/>);
		}
		this.state = {
			e_curView : this.a_list[0]
	    };
	}
	selectItem(index){
		this.setState({e_curView:this.a_list[index]});
	}
  	render() {
	    return (
	    	<View style={{flex:1}}>
		    	<BottomTab
		    		a_tabs = {[{s_title:'首页1',s_icon:require('./tabicon_1.png'),s_activeIcon:require('./tabicon_active_1.png')},
		    			{s_title:'首页2',s_icon:require('./tabicon_2.png'),s_activeIcon:require('./tabicon_active_2.png')},
		    			{s_title:'首页3',s_icon:require('./tabicon_3.png'),s_activeIcon:require('./tabicon_active_3.png')},
		    			{s_title:'首页4',s_icon:require('./tabicon_4.png'),s_activeIcon:require('./tabicon_active_4.png')},
		    		]}
		    		f_callBack = {(index) => this.selectItem(index)}
		    	/>
		    	{this.state.e_curView}
	    	</View>
	    );
  	}
}
export default Main;
