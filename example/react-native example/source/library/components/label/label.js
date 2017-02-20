/*
* @Author: 代汉桥
* @Date:   2016-06-03 14:24:46
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-17 15:56:32
* 标签组件：标题+内容
*/

'use strict';

import React, { Component , PropTypes } from 'react';
import {View,Text} from 'react-native';
import Base from './base';
import {Line} from './line';
const {baseRow,baseBgColorW,baseP10,baseMR10,baseColorG,fzStyle,baseTVerCenter} = Base;

export class Label extends Component {
	static propTypes = {
		s_title : PropTypes.string,		//标题
        s_label : PropTypes.string,		//内容
        style : PropTypes.any,			//view样式
        o_titleStyle : PropTypes.any,	//标题样式
        o_labelStyle : PropTypes.any,	//内容样式
    	b_line : PropTypes.bool,//是否有线
        n_lineLeft : PropTypes.number,//线离左边距离
	};
	static defaultProps = {
		s_title:'',
		s_label:'',
	};
	render() {
		let {style,s_title,s_label,o_titleStyle,o_labelStyle,b_line,n_lineLeft} = this.props;
		if(n_lineLeft && n_lineLeft > 0){
			b_line = true;
		}
		return (
			<View style={[baseRow,baseBgColorW,style]}>
				<Text style={[baseColorG,baseMR10,fzStyle(26),baseTVerCenter,o_titleStyle]}>{s_title}</Text>
				<Text style={[fzStyle(26),baseTVerCenter,o_labelStyle]}>{s_label}</Text>
				{ b_line ?<Line n_left={n_lineLeft}/>:null }
			</View>
		);
	}
}
