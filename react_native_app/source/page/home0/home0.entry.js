'use strict';
import React,{ Component } from 'react';
import { View , Text , TouchableOpacity } from 'react-native';
import Com from './common';
class Home0 extends Component {
  	render() {
	    return (
          	<View>
	         	<View style={Com.baseContent}>
	         		<TouchableOpacity onPress = { () => this.props.test()}>
						<Text>
							{this.props.text}
						</Text>
	         		</TouchableOpacity>
	        	</View>
        	</View>
	    );
  	}
}
export default Home0;
