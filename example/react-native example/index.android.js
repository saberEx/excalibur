/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Root from './output/root';


class ReactNative extends Component {
    render() {
        return (
          	<Root/>
        );
    }
}

AppRegistry.registerComponent('twelveKangsheng', () => ReactNative);
