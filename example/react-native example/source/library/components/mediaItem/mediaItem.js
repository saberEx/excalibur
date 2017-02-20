/*
* @Author: 代汉桥
* @Date:   2016-05-30 16:45:10
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-04 12:32:17
* item项组件：图片-文字-右箭头
*/

'use strict';
import React, { PropTypes,Component } from 'react';
import {View,Text,Image,Animated} from 'react-native';
import {MKButton} from 'react-native-material-kit';
import {Line} from './line';
import o_styles from './mediaItem.style';
import Base from './base';
const {container,leftCon,rightArrows,icon,label} = o_styles;

export class MediaItem extends Base.AnimationComponent{
	constructor(props){
		super(props,[{rotate:{output:['0deg','90deg'],b_transform:true}}],300);
	}
	static propTypes = {
        s_icon : PropTypes.number,//左边icon
        b_line : PropTypes.bool,//是否有线
        n_lineLeft : PropTypes.number,//线离左边距离
        s_label : PropTypes.string,//文本内容
        s_right : PropTypes.number,//右边ICON，默认为箭头
        onPress : PropTypes.func,//点击回调
        n_open : PropTypes.number,//该属针对FoldMediaItem,默认0, 1为折叠面板打开，2为折叠面板关闭
    };
   	static defaultProps = {
		n_lineLeft: 0,
		s_right: require('./mediaItem-rightIcon.png'),
	};
	render(){
		let {n_lineLeft,s_icon,s_label,s_right,b_line,onPress,n_open} = this.props;
		let e_right = null;
		if(s_right){
			if(n_open){
				e_right = <Animated.Image style={[this.interpolates,rightArrows]} source={s_right}/>;
			}else{
				e_right = <Image style={rightArrows} source={s_right}/>;
			}
		}
		return (
			<MKButton
				style={[container,this.props.style]}
				onPress={() => {
                    onPress && onPress();
                    if(s_right){
	                    if(n_open === 1){
	                    	this.startAnimation(1,0);
	                    }else if(n_open === 2){
	                    	this.startAnimation(0,1);
	                    }
                    }
                }}
				>
				<View style={leftCon}>
					{ s_icon ? <Image style={icon} source={s_icon}/> : null }
					{ s_label ? <Text style={label}>{s_label}</Text> : null }
				</View>
				{ e_right }
				{ b_line ?<Line n_left={n_lineLeft}/>:null }
			</MKButton>
		);
	}
}

//支持折叠的Item
export class FoldMediaItem extends Base.AnimationComponent{
	constructor(props) {
        super(props,[{marginBottom:{output:[-props.n_height,0]}}],300);
        this.state = {
             b_open:this.props.b_open,
        };
    }
    static propTypes = {
        b_open : PropTypes.bool,//是否默认展开
        n_height : PropTypes.number,//子元素高度
    };
	_onPress(){
		let {b_open} = this.state;
		this.setState({b_open:!this.state.b_open});
		//有子元素时开启折叠动画
		let {children} = this.props;
		if(React.Children.count(children) > 0){
			if(this.state.b_open){
				this.startAnimation(1,0);
			}else{
				this.startAnimation(0,1);
			}
		}
	}
	render(){
		let {b_open} = this.state;
		let {children} = this.props;
		return (
			<View>
				<MediaItem onPress={()=>this._onPress()} {...this.props} n_open={b_open?1:2}/>
				<Animated.View style={this.interpolates}>
					{children}
				</Animated.View>
			</View>
		);
	}
}
