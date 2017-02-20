/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 16:03:42
* 搜索页面
*/
'use strict';
import React,{StyleSheet,Component} from 'react';
import {Text,TextInput,View,TouchableHighlight,ActivityIndicatorIOS,Image,TouchableOpacity} from 'react-native';
import Com from './common';
import TopBar from './topBar';

class Item extends Component {
	shouldComponentUpdate(nextProps={}){
		return true;
	}
	render() {
		return (
			<Text>{this.props.text}</Text>
		);
	}
}

class Index extends Component {
  	render() {
  		let e_Items = this.props.list.map(function(item,key){
  			return <Item key={key} text={item}/>;
  		});
    	console.log(this.state);
	    return (
          	<View>
          		<TopBar f_leftHandler={()=>Com.openWin('searchPage')} s_title='首页'/>
	         	<View style={Com.baseContent}>
		        	<TouchableOpacity onPress={()=>this.props.setNum()}>
		            	<Text>
		            		{this.props.num}
		            	</Text>
		        	</TouchableOpacity>
		        	{ e_Items }
	        	</View>
        	</View>
	    );
  	}
}
export default Index;
