'use strict';
import React,{ Component } from 'react';
import { View } from 'react-native';
import Com from './common';
import TopBar from './topBar';
class Home3 extends Component {
  	render() {
	    return (
          	<View>
          		<TopBar s_title="首页3"/>
	         	<View style={Com.baseContent}>
					
	        	</View>
        	</View>
	    );
  	}
}
export default Home3;