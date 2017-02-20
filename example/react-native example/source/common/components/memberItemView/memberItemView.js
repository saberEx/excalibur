/*
* @Author: 卢旺
* @Date:   2016-06-13 16:15:56
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-27 17:23:30
*/

'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Text} from 'react-native';
import Common from './common';
import o_styles from './memberItemView.style';
import {Line} from './components';
const {midText,titleStyle,totalMoneyStyle,item,nameStyle,timeStyle,couponStyle} = o_styles;
const {baseCenter,baseFlex,baseBgColorW} = Common;

export class MemberItemView extends Component{
	static propTypes = {
		s_typeName : PropTypes.string,//类型名称
		s_money : PropTypes.string,//消费金额
        s_shopName : PropTypes.string,//门店名称
        s_orderSn : PropTypes.string,//订单号
        s_ticketMoney : PropTypes.string,//卡券金额
        s_time: PropTypes.string,//时间
        b_point:PropTypes.bool,//为积分数据
	};
	render(){
		let {s_typeName,s_money,s_shopName,s_orderSn,s_ticketMoney,s_time} = this.props;
		let e_shopName = s_shopName?<Text style={nameStyle}>{s_shopName}</Text>:null;
		return(
			<View style={baseBgColorW}>
				<View style={item}>
					<Text style={titleStyle}>{s_typeName}</Text>
                  	<Text style={totalMoneyStyle}>{s_money}</Text>
				</View>
				<View style={item}>
					{e_shopName}
                  	<Text style={nameStyle}>{s_orderSn}</Text>
                  	<Text style={couponStyle}>{s_ticketMoney}</Text>
				</View>
				<Text style={timeStyle}>{s_time}</Text>
				<Line/>
			</View>
		);
	}
}
