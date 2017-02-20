/*
* @Author: 代汉桥
* @Date:   2016-05-31 13:36:36
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-28 13:58:22
* 数量选择box
*/

'use strict';
import React, { PropTypes,Component } from 'react';
import {View,Image,TextInput} from 'react-native';
import Base from './base';
import {IconBtn} from './button';
import o_styles from './numBox.style';
const {container,inputView,input} = o_styles;

export class NumBox extends Base.Component{
	constructor(props){
		super(props);
		this.state = {
			i_value : this.props.i_value
	    };
	}
	static propTypes = {
		i_min:PropTypes.number,//最小值
		i_max:PropTypes.number,//最大值
		i_value:PropTypes.number,//当前值
    };
    static defaultProps = {
    	i_value:1,
    	i_min:0,
    	i_max:Number.MAX_SAFE_INTEGER
    };
    get value(){
    	return this.state.i_value;
    }
    componentWillReceiveProps(nextProps){
        let {i_value} = nextProps;
        if(i_value !== this.state.i_value){
            this.setState({i_value:i_value});
        }
    }
    subHandler(){
    	let i_value = parseInt(this.state.i_value);
        let i_newValue = Math.max(i_value - 1,this.props.i_min);
        this.setState({i_value:i_newValue});
        let {onChange} = this.props;
        onChange && onChange(i_value,i_newValue);
    }
    addHandler(){
    	let i_value = parseInt(this.state.i_value);
        let i_newValue = Math.min(i_value + 1,this.props.i_max);
        this.setState({i_value:i_newValue});
        let {onChange} = this.props;
        onChange && onChange(i_value,i_newValue);
    }
    changeTextHandler(value){
    	let {i_min,i_max} = this.props;
		let i_value = parseInt(value) || i_min;
        let i_newValue = Math.min(i_value,i_max);
        i_newValue = Math.max(i_value,i_min);
        let {onChange} = this.props;
        onChange && onChange(this.state.i_value,i_newValue);
        this.setState({i_value:i_newValue});
    }
    render(){
    	let {i_value} = this.state;
    	let {style,width=Base.px2dp(200),height=Base.px2dp(60)} = this.props;
    	let n_input_w = width - 2*height;
    	if(n_input_w <= 0){
    		throw 'numBox宽度设置错误';
    	}
    	return (
    		<View style={[container,this.props.style]}>
    			<IconBtn onPress={()=>this.subHandler()} width={height} height={height} s_icon={require('./numBox-sub.png')}/>
    			<View style={inputView}>
    				<TextInput onChangeText={(value)=>this.changeTextHandler(value)} value={i_value.toString()} underlineColorAndroid="transparent" keyboardType="numeric" style={[{width:n_input_w,height:height-1,fontSize:height/3},input]}/>
    			</View>
    			<IconBtn onPress={()=>this.addHandler()} width={height} height={height} s_icon={require('./numBox-add.png')}/>
    		</View>
    	);
    }
}
