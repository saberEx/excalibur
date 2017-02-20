/*
* @Author: 代汉桥
* @Date:   2016-05-23 11:05:23
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-02 10:26:09
* 底部导航
*/

'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Image,Text,TouchableOpacity} from 'react-native';
import Base from './base';
import o_styles from './bottomTab.style';
const {container,nav,navItem,center,navImage,navText,horizonLine,badgeWithNumber,badgeText} = o_styles;

class BottomTabItem extends Base.Component {
	static propTypes = {
		s_title : PropTypes.string, //文字
		n_badge : PropTypes.number, //标记
        b_active : PropTypes.bool,  //是否选中
        s_icon : PropTypes.number,  //默认状态icon
        s_activeIcon : PropTypes.number, //选中状态icon
        s_avtiveColor : PropTypes.string, //选中文字颜色
        s_color : PropTypes.string, //默认状态文字颜色
        i_index : PropTypes.number, //当前Index
        onPress : PropTypes.func, //点击处理
    };
    getBadge() {
    	let { n_badge } = this.props;
        let value = typeof n_badge === 'number' ? n_badge : 0;
        if (value !== 0) {
            let valueStr = value > 99 ? '99+' : `${value}`;
            return (
                  <View style={[badgeWithNumber]}>
                      <Text style={badgeText}>{valueStr}</Text>
                  </View>
            );
        }
    }
	render() {
        let {b_active,s_title,s_icon,s_activeIcon,onPress,s_avtiveColor,s_color,i_index} = this.props;
        let s_titleColor = b_active ? s_avtiveColor : s_color;
        let s_fontsize = 14;
        return (
            <TouchableOpacity
                activeOpacity ={0.8}
                style={navItem}
                onPress={() => {
                    if (onPress) {
                        onPress(i_index);
                    }
                }}>
                <View style={center}>
                    <Image style={navImage} resizeMode='cover' source={b_active ? s_activeIcon : s_icon}/>
                    <Text style={[navText,{color: s_titleColor,fontSize: s_fontsize}]}>
                        {s_title}
                    </Text>
                    {this.getBadge()}
                </View>
            </TouchableOpacity>
        );
    }
}

export default class BottomTab extends Component {
	static defaultProps = {
		s_color : '#adadad',
		s_avtiveColor : Base.mainColor,
		s_bgColor : '#FFFFFF',
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
        this._selectHandler = this.onSelectItem.bind(this);
    }
    onSelectItem (index) {
    	let {n_curIndex} = this.state;
    	if(n_curIndex === index){
    		return;
    	}
    	this.setState({n_curIndex:index});
    	let {f_callBack} = this.props;
    	f_callBack && f_callBack(index);
    }
	render() {
        let {n_curIndex} = this.state;
        // 底部tab按钮组
        let {a_tabs , s_color , s_avtiveColor , s_bgColor} = this.props;
        let self = this;
        let navs = a_tabs.map((item , index) => {
        	return <BottomTabItem i_index = {index} key = {index} s_color = {s_color} s_avtiveColor = {s_avtiveColor} onPress = {self._selectHandler} s_title = {item.s_title} n_badge = {item.n_badge} b_active = {index === n_curIndex}  s_icon={item.s_icon} s_activeIcon = {item.s_activeIcon}/>;
        });

        return (
            <View style={[container,this.props.style]}>
                <View style={horizonLine}/>
                <View style={[nav,{backgroundColor:s_bgColor}]}>
                    {navs}
                </View>
            </View>
        );
    }
}
