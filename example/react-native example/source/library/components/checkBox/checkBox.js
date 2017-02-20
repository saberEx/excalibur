/*
* @Author: 代汉桥
* @Date:   2016-06-01 13:37:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-01 16:21:27
*/

'use strict';
import React, { Component , PropTypes } from 'react';
import {MKCheckbox} from 'react-native-material-kit';
import Base from './base';

export class CheckBox extends Base.Component {
	static propTypes = {
		f_change:PropTypes.func,//点击回调
		s_onColor:PropTypes.string,//选中边框
		s_offColor:PropTypes.string,//未选中边框
		s_fillColor:PropTypes.string,//填充色
	};
	static defaultProps={
		s_onColor:Base.mainColor,
		s_fillColor:Base.mainColor,
	};
	render() {
		let {checked,s_onColor,s_offColor,s_fillColor,f_change,style={width:Base.px2dp(20),height:Base.px2dp(20)}} = this.props;
		return (
			<MKCheckbox
				borderOnColor = {s_onColor}
				borderOffColor = {s_offColor}
				fillColor = {s_fillColor}
				editable={true}
				checked={checked}
				onCheckedChange={(obj)=>{
					f_change && f_change(obj.checked);
				}}
			/>
		);
	}
}
