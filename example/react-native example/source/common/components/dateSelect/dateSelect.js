/*
* @Author: 代汉桥
* @Date:   2016-06-23 15:12:05
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-23 16:03:21
* 日期选择
*/
'use strict';

import React,{Component,PropTypes} from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-datetime';
import Com from './common';
import o_styles from './dateSelect.style';
import {Line} from './components';
const {content,timeLabel,okBtn} = o_styles;
const labelFz = Com.fzStyle(26);
const {baseRow,basePTB20,baseCenter} = Com;
export class DateSelect extends Component{
	constructor(props){
		super(props);
		this.state = {
			startTime:props.startTime,
			endTime:props.endTime
	    };
	}
	static propTypes = {
		startTime : PropTypes.number.isRequired,//开始时间
        endTime : PropTypes.number.isRequired,//结束时间
        onPress : PropTypes.func.isRequired,//确定点击回调
	};
	_okHandler(){
		let {onPress} = this.props;
		let {startTime,endTime} = this.state;
		onPress && onPress(startTime,endTime);
	}
	render(){
		let {onPress} = this.props;
		let {startTime,endTime} = this.state;
		let _startLabel = Com.getTimeFormat(startTime,2).replace(/\:\d{2}$/,"");
		let _endLabel = Com.getTimeFormat(endTime,2).replace(/\:\d{2}$/,"");
		return (
			<View>
				<View style={[baseRow,basePTB20,content]}>
					<Text style={labelFz}>时间：</Text>
					<View style={[baseRow,baseCenter]}>
						<TouchableOpacity onPress={()=>{
							this._dateTimePicker.showDateTimePicker(new Date(startTime*1000), (date)=>{
		                        this.setState({startTime:date.getTime()/1000});
		                    });
						}}>
							<View style={timeLabel}>
								<Text style={labelFz}>{_startLabel}</Text>
							</View>
						</TouchableOpacity>
						<Text>  到  </Text>
						<TouchableOpacity onPress={()=>{
							this._dateTimePicker.showDateTimePicker(new Date(endTime*1000), (date)=>{
		                        this.setState({endTime:date.getTime()/1000});
		                    });
						}}>
							<View style={timeLabel}>
								<Text style={labelFz}>{_endLabel}</Text>
							</View>
						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={()=>this._okHandler()}>
						<Text style={[labelFz,okBtn]}>确定</Text>
					</TouchableOpacity>
				</View>
				<Line n_left={Com.px2dp(30)}/>
				<DateTimePicker cancelText="取消" okText="确定" ref={(datePicker)=>{this._dateTimePicker=datePicker;}}/>
			</View>
		);
	}
}
