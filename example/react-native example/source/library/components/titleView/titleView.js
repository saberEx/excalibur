/*
* @Author: 代汉桥
* @Date:   2016-06-08 11:05:33
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-08 11:59:27
* 带标题的view
*/

'use strict';
import React, { Component , PropTypes } from 'react';
import {View,Text} from 'react-native';
import Base from './base';
import o_styles from './titleView.style';
const {title,titleFlag} = o_styles;
const {baseRow,basePTB10,baseFlex} = Base;
import {Line} from './line';

export class TitleView extends Component {
	static propTypes = {
		s_title : PropTypes.string, //标题
		style:PropTypes.any,//样式
		titleStyle:PropTypes.any,//文本样式
    };
	render() {
		let {style,children,s_title,titleStyle} = this.props;
		return (
			<View style={style}>
				<View style={[baseRow,basePTB10]}>
					<View style={[titleFlag]}></View>
					<Text style={[Base.fzStyle(28),titleStyle]}>{s_title}</Text>
					<Line n_left={Base.px2dp(25)}/>
				</View>
				{children}
			</View>
		);
	}
}
