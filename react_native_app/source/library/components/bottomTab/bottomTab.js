/*
* @Author: 代汉桥
* @Date:   2016-05-23 11:05:23
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 14:00:07
* 底部导航
*/

'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Image,Text,TouchableHighlight} from 'react-native';
import Base from './base';
import o_bottomTab from './bottomTab.style';

class BottomTabItem extends Component {
	static propTypes = {
		s_title : PropTypes.string,
		n_badge : PropTypes.number,
        b_active : PropTypes.bool,
        s_icon : PropTypes.number,
        s_activeIcon : PropTypes.number,
        s_avtiveColor : PropTypes.string,
        s_color : PropTypes.string,
        i_index : PropTypes.number,
    };
    getBadge() {
    	let { n_badge } = this.props;
        let value = typeof n_badge === 'number' ? n_badge : 0;
        if (value !== 0) {
          let valueStr = value > 99 ? '99+' : `${value}`;
          return (
              <View style={[o_bottomTab.badgeWithNumber]}>
                  <Text style={o_bottomTab.badgeText}>{valueStr}</Text>
              </View>
          );
        }
    }
	render() {
        let {b_active,s_title,s_icon,s_activeIcon,onPress,s_avtiveColor,s_color,i_index} = this.props;
        let s_titleColor = b_active ? s_avtiveColor : s_color;
        let s_fontsize = 14;
        return (
            <TouchableHighlight
                underlayColor={'transparent'}
                style={o_bottomTab.navItem}
                onPress={() => {
                    if (onPress) {
                        onPress(i_index);
                    }
                }}>
                <View style={o_bottomTab.center}>
                    <Image style={o_bottomTab.navImage} resizeMode='cover' source={b_active ? s_activeIcon : s_icon}/>
                    <Text style={[o_bottomTab.navText,{color: s_titleColor,fontSize: s_fontsize}]}>
                        {s_title}
                    </Text>
                    {() =>this.getBadge()}
                </View>
            </TouchableHighlight>
        );
    }
}

export default class BottomTab extends Component {
	static defaultProps = {
		s_color : '#adadad',
		s_avtiveColor : Base.mainColor,
		s_bgColor : '#f3f3f3',
	};
    static propTypes = {
        a_tabs : PropTypes.array.isRequired,//item数据
        f_callBack : PropTypes.func,//回调函数
        s_color : PropTypes.string,//文字颜色
        s_avtiveColor : PropTypes.string,//文字激活颜色
        s_bgColor : PropTypes.string,//背景色
    };
    constructor(props) {
        super(props);
        this.state = {
            n_curIndex: props.n_curIndex || 0,
        };
    }
    onSelectItem (index) {
    	let {n_curIndex} = this.state;
    	if(n_curIndex === index){
    		return;
    	}
    	this.setState({n_curIndex:index});
    	console.log(index);
    	let {f_callBack} = this.props;
    	f_callBack && f_callBack(index);
    }
	render() {
        let {n_curIndex} = this.state;
        // 底部tab按钮组
        let {a_tabs , s_color , s_avtiveColor , s_bgColor} = this.props;
        let navs = a_tabs.map((item , index) => {
        	return <BottomTabItem i_index = {index} key = {index} s_color = {s_color} s_avtiveColor = {s_avtiveColor} onPress = {()=> this.onSelectItem(index)} s_title = {item.s_title} n_badge = {item.n_badge} b_active = {index === n_curIndex}  s_icon={item.s_icon} s_activeIcon = {item.s_activeIcon}/>;
        });

        return (
            <View style={[o_bottomTab.container,this.props.style]}>
                <View style={o_bottomTab.horizonLine}/>
                <View style={[o_bottomTab.nav,{backgroundColor:s_bgColor}]}>
                    {navs}
                </View>
            </View>
        );
    }
}
