/*
* @Author: 代汉桥
* @Date:   2016-06-03 11:27:38
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-14 11:51:18
*/

'use strict';
import React, { Component , PropTypes } from 'react';
import ScrollableTabView , {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Base from './base';

export class TabView extends Component {
	constructor(props){
		super(props);
		this._change = ({i,ref})=>{
			let {f_change} = props;
			f_change && f_change(i,ref);
		};
	}
	static propTypes = {
		i_index : PropTypes.number,		//当前索引
        f_change : PropTypes.func,//切换回调
       	s_bgColor : PropTypes.string,//背景色
        s_position : PropTypes.string,//tab出现位置，top,bottom,overlayTop,overlayBottom
        b_locked : PropTypes.bool,//禁止手势滑动
        tabBar : PropTypes.any,	//tabBar组件
        titleStyle : PropTypes.object,//标题样式
        s_lineColor : PropTypes.string,//指示线颜色
        n_lineHeight : PropTypes.number,//指示线高度
        s_activeColor : PropTypes.string,//激活标题颜色
       	s_inactiveColor : PropTypes.string,//未激活标题颜色
		tabBarStyle:PropTypes.any,//tab头部样式
    };
    static defaultProps={
		s_lineColor:Base.mainColor,
		s_activeColor:Base.mainColor,
		s_inactiveColor:'#999',
		i_index:0,
		s_position:'top',
		n_lineHeight:1,
	};
	render() {
		let {style,tabBarStyle,n_lineHeight,tabBar,b_locked,children,i_index,s_lineColor,s_activeColor,titleStyle,s_inactiveColor,s_bgColor,s_position} = this.props;
		let TabBar = tabBar ? tabBar : <DefaultTabBar style={tabBarStyle}  underlineHeight={n_lineHeight}/>;
		return (
			<ScrollableTabView
				onChangeTab = {this._change}
				locked = {b_locked}
				tabBarPosition = {s_position}
				renderTabBar={() => TabBar}
				tabBarBackgroundColor = {s_bgColor}
				tabBarTextStyle = {[{fontWeight:'normal'},titleStyle]}
				tabBarActiveTextColor = {s_activeColor}
				tabBarInactiveTextColor = {s_inactiveColor}
			 	tabBarUnderlineColor={s_lineColor}
			 	initialPage={i_index}
			 	style={[style,Base.baseFlex]}>
		        {children}
	      	</ScrollableTabView>
		);
	}
}
