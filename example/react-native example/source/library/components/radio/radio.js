/*
* @Author: 卢旺
* @Date:   2016-05-31 15:17:44
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-28 10:32:16
*/

'use strict';
import React, { Component,PropTypes} from 'react';
import {View,Text,TouchableWithoutFeedback} from 'react-native';
import Base from './base';
import o_styles from './radio.style';
import  {MKRadioButton} from 'react-native-material-kit';
import {Line} from './line';

export class Radio extends Base.Component {
	static propTypes = {
        s_onColor : PropTypes.string,
        s_offColor : PropTypes.string,
        s_fillColor : PropTypes.string,
        b_checked : PropTypes.bool,
        f_change : PropTypes.func,
        s_id : PropTypes.string,
    };
    static defaultProps = {
    	s_onColor:Base.mainColor,
    	s_offColor:Base.mainColor,
    	s_fillColor:Base.mainColor,
    };
	render() {
		let  {b_checked,f_change,s_id,s_onColor,s_offColor,s_fillColor} = this.props;
		return (
			<MKRadioButton
				onCheckedChange={() => {
               	 f_change && f_change(s_id);
            	}}
            	checked = {b_checked}
            	borderOnColor = {s_onColor}
            	borderOffColor = {s_offColor}
            	fillColor = {s_fillColor}
			>
			</MKRadioButton>
		);
	}
}

class RadioItem extends Base.Component {
	_onPress(){
		let {f_change,s_id} = this.props;
		f_change && f_change(s_id);
	}
	render() {
		let {s_label,b_line,n_left = 0,style,children} = this.props;
		if(n_left > 0){
			b_line = true;
		}
		return (
			<TouchableWithoutFeedback onPress={()=>this._onPress()}>
				<View style={[o_styles.container,style]}>
					<View style={[Base.baseRow,Base.baseCenter]}>
						<Radio {...this.props}/>
						{ b_line ?<Line n_left={n_left}/>:null }
						<Text >{s_label}</Text>
					</View>
					{children}
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

export class RadioGroup extends Component {
	constructor(props){
		super(props);
		this.state = {
			cur_id:props.s_curId
	    };
	    this._change = (value)=>{
	    	if(value !== this.state.cur_id){
		    	this.setState({cur_id:value});
		    	let {f_change} = props;
		    	f_change && f_change(value);
	    	}
	    };
	}
	componentWillReceiveProps(nextProps) {
		const {s_curId} = nextProps;
		const curId = this.props.s_curId;
		const {cur_id} = this.state;
		if(curId !== s_curId && s_curId !== cur_id){
			this.setState({cur_id:s_curId});
		}
	}
    static propTypes = {
        a_group: PropTypes.array,
        f_change: PropTypes.func,//选中回调
        s_curId: PropTypes.string,//当前s_id
    };
    get value(){
    	return this.state.cur_id;
    }
	render() {
		let {a_group,style} = this.props;
		let e_items = a_group.map((item,key)=>{
			let s_id = item.s_id || key.toString();
			return <RadioItem key={key} {...item} b_checked={this.state.cur_id === s_id} s_id={s_id} f_change={this._change}/>;
		});
		return (
			<View style={style}>
				{e_items}
			</View>
		);
	}
}
