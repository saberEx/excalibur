/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-19 10:05:02
* 搜索页面
*/
'use strict';
import React,{StyleSheet,Component} from 'react';
import {Text,TextInput,View,TouchableHighlight,ActivityIndicatorIOS,Image,TouchableOpacity} from 'react-native';
import Com from './common';
import TopBar from './topBar';
class SearchPage extends Component {
  	render() {
  		console.log(this.props);
	    return (
          	<View>
          	<TopBar s_title='搜索'/>
	        	<View style={Com.baseContent}>
		        	<TouchableOpacity onPress={()=>this.props.setText("aa")}>
		            	<Text>
		            		{this.props.text}
		            	</Text>
		        	</TouchableOpacity>
	        	</View>
        	</View>
	    );
  	}
}
export default SearchPage;
