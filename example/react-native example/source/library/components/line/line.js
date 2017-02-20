/*
* @Author: 代汉桥
* @Date:   2016-05-30 17:47:27
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-02 10:29:39
*/

'use strict';
import React, {PropTypes,Component} from 'react';
import {View} from 'react-native';
import Base from './base';
import o_styles from './line.style';
const {container} = o_styles;
export class Line extends Base.Component{
	static propTypes = {
        n_left : PropTypes.number,
    };
   	static defaultProps = {
		n_left: 0,
	};
	render(){
		let {n_left} = this.props;
		let o_styleLeft = {left:Base.px2dp(n_left)};
		return (
			<View style={[container,o_styleLeft]}/>
		);
	}
}

