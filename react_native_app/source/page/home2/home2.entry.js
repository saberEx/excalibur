'use strict';
import React,{ Component } from 'react';
import { View } from 'react-native';
import Com from './common';
import TopBar from './topBar';
class Home2 extends Component {
  	render() {
	    return (
          	<View>
          		<TopBar s_title="首页2"/>
	         	<View style={Com.baseContent}>
					
	        	</View>
        	</View>
	    );
  	}
}
export default Home2;