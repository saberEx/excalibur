/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 11:06:33
* 头部导航组件
*/
'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Image,Text,TouchableOpacity} from 'react-native';
import Base from './base';
import o_topBarStyle from './topBar.style';
export default class TopBar extends Component {
	static propTypes = {
		s_title: PropTypes.string.isRequired, //标题
		s_leftIcon: PropTypes.number, //左边图标
		s_rightIcon: PropTypes.number, //右边图标
		s_leftLabel: PropTypes.string, //左边文字
		s_rightLabel: PropTypes.string, //右边文字
		f_leftHandler: PropTypes.func, //左边点击处理
		f_rightHandler: PropTypes.func, //右边点击处理
		s_bgColor: PropTypes.string, //背景颜色，默认mainColor
	}

	static defaultProps = {
		s_leftIcon: require('./topBar-backIcon.png'),
		s_bgColor: Base.mainColor,
		f_leftHandler: ()=>Base.closeWin(),
	}

	// componentWillMount(){
	// 	this.state = this._getStateFromProps(this.props);
	// }

	// componentWillReceiveProps(newProps){
	// 	let newState = this._getStateFromProps(newProps);
	// 	this.setState(newState);
	// }

	// shouldComponentUpdate(nextProps, nextState, context) {
	// 	return JSON.stringify([nextState, context]) !== JSON.stringify([this.state, context]);
	// }

	_onLeftButtonPressHandle(event) {
		let onPress = this.props.f_leftHandler;
		onPress && onPress(event);
	}

	_onRightButtonPressHandle(event) {
		let onPress = this.props.f_rightHandler;
		onPress && onPress(event);
	}

	render() {
		let props = this.props;
		//左按钮
		let e_leftBtn = props.s_leftIcon ? <Image style={o_topBarStyle.leftButtonIcon} resizeMode={'contain'} source={props.s_leftIcon} /> : null;
		//右按钮
		let e_rightBtn = props.s_rightIcon ? <Image style={o_topBarStyle.rightButtonIcon} resizeMode={'contain'} source={props.s_rightIcon} /> : null;
		return (< View style = {o_topBarStyle.container} >
					<TouchableOpacity onPress={()=>this._onLeftButtonPressHandle()}>
						<View style={o_topBarStyle.leftButton}>
							{e_leftBtn}
							<Text style={o_topBarStyle.leftButtonTitle}>
								{props.s_leftLabel}
							</Text>
						</View>
					</TouchableOpacity>
					< View style = {o_topBarStyle.title} >
						<Text style={o_topBarStyle.titleText} numberOfLines={1}>
							{props.s_title}
						</Text>
					< /View>
					< TouchableOpacity onPress = {()=>this._onRightButtonPressHandle()} >
					<View style={o_topBarStyle.rightButton}>
						{e_rightBtn}
						<Text style={o_topBarStyle.rightButtonTitle}>
							{props.s_rightLabel}
						</Text>
					</View>
				< /TouchableOpacity>
			< /View>
		);
	}
}
