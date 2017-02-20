'use strict';
import React,{ Component } from 'react';
import { View ,Text } from 'react-native';
import Com from './common';
import TopBar from './topBar';
class Home1 extends Component {
  	render() {
	    return (
          	<View>
          		<TopBar s_title="首页1"/>
	         	<View style={Com.baseContent}>
					<Text>
						2
					</Text>
	        	</View>
        	</View>
	    );
  	}
}
export default Home1;
