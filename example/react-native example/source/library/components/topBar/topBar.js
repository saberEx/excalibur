/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-20 14:35:08
* 头部导航组件
*/
'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Image,Text,TouchableOpacity} from 'react-native';
import Base from './base';
import o_styles from './topBar.style';
const {container,leftButton,leftButtonIcon,leftButtonTitle,title,titleText,rightButton,rightButtonIcon,rightButtonTitle} = o_styles;
export default class TopBar extends Component {
	constructor(props){
		super(props);
		this._onLeftButtonPressHandle = (event)=>{
			let {f_leftHandler} = props;
			f_leftHandler && f_leftHandler(event);
		};
		this._onRightButtonPressHandle = (event)=>{
			let {f_rightHandler} = props;
			f_rightHandler && f_rightHandler(event);
		};
	}
	static propTypes = {
		s_title: PropTypes.string.isRequired, //标题
		s_leftIcon: PropTypes.number, //左边图标
		s_rightIcon: PropTypes.number, //右边图标
		s_leftLabel: PropTypes.string, //左边文字
		s_rightLabel: PropTypes.string, //右边文字
		f_leftHandler: PropTypes.func, //左边点击处理
		f_rightHandler: PropTypes.func, //右边点击处理
		s_bgColor: PropTypes.string, //背景颜色，默认mainColor
		o_rightLabelStyle: PropTypes.number,//右边文字样式
	};
	static defaultProps = {
		s_leftIcon: require('./topBar-backIcon.png'),
		s_bgColor: Base.mainColor,
		f_leftHandler: ()=>Base.closeWin(),
	};
	render() {
		let {s_leftIcon,s_rightIcon,s_leftLabel,s_title,s_rightLabel,o_rightLabelStyle} = this.props;
		//左按钮
		let e_leftBtn = s_leftIcon ? <Image style={leftButtonIcon} resizeMode={'contain'} source={s_leftIcon} /> : null;
		//右按钮
		let e_rightBtn = s_rightIcon ? <Image style={rightButtonIcon} resizeMode={'contain'} source={s_rightIcon} /> : null;
		return (<View style = {container} >
					<TouchableOpacity onPress={this._onLeftButtonPressHandle}>
						<View style={leftButton}>
							{e_leftBtn}
							<Text style={leftButtonTitle}>
								{s_leftLabel}
							</Text>
						</View>
					</TouchableOpacity>
					<View style = {title}>
						<Text style={[titleText,Base.topBarTitleStyle]} numberOfLines={1}>
							{s_title}
						</Text>
					</View>
					<TouchableOpacity onPress = {this._onRightButtonPressHandle}>
						<View style={rightButton}>
							{e_rightBtn}
							<Text style={[rightButtonTitle,o_rightLabelStyle]}>
								{s_rightLabel}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
		);
	}
}
