/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { AppRegistry , View } from 'react-native';
import {Provider } from 'react-redux';
import {Root,store} from './output/root';
import Spinner from 'react-native-loading-spinner-overlay';
import Com from './output/common';

class ReactNative extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading:false
        };
    }
    componentDidMount() {
        Com.showProgress = () => {
            this.setState({loading:true});
        };
        Com.hideProgress = () => {
            this.setState({loading:false});
        };
    }
    render() {
        return (
          	<Provider store={store}>
          		<View style={{ flex: 1 }}>
	            	<Root />
            		<Spinner visible={this.state.loading} />
          		</View>
         	</Provider>
        );
    }
}
AppRegistry.registerComponent('reactNative', () => ReactNative);
