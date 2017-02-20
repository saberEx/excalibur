/*
* @Author: 代汉桥
* @Date:   2016-06-29 10:50:11
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-07-01 14:03:46
*/
'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Image,Text,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import o_styles from './orderItemView.style';
import Com from './common';
import {Line} from './components';
const {baseBgColorW,baseMB20,baseMT20,baseRow,baseBetween,baseColCenter,baseMB10,baseFlex,baseCenter,baseColorG} = Com;
const {title,titleLeft,mainColorStyle,logoStyle,memberContent,numColorStyle,flagImg,lineStyle} = o_styles;
const logoImg = require('./pay_index_member_img.png');
//优惠券图标
const privilegeUrl =  require("./pay_index_privilege.png");
//v客图标
const vUrl =  require("./pay_index_v.png");
//会员图标
const memberUrl =  require("./pay_index_member.png");
const labelFz = Com.fzStyle(22);
const numFz = Com.fzStyle(34);
export class OrderItemView extends Component {
	static propTypes = {
		order_sn : PropTypes.string, //订单编号
		titleStyle:PropTypes.any,//文本样式
    };
    _itemHandler(){
    	Com.openWin('statistic_order_details',{data:this.props});
    }
    _cancelHandler(){
    	let {order_id,rowID,sectionID} = this.props;
    	Com.openWin('statistic_order_accredit',{order_id,sectionID,rowID});
    }
	render(){
		let {rowID,order_sn,shop_order_state,add_time,order_amount,goods_amount,buyer_name,pageType} = this.props;
		let style = parseInt(rowID) === 0 ? {} : baseMT20;
		let cancelEl = null;
		if(parseInt(shop_order_state) === 0){
			cancelEl = 	<TouchableOpacity onPress={()=>this._cancelHandler()}>
							<Text style={mainColorStyle}>取消</Text>
						</TouchableOpacity>;
		}
		let memberEl = null;
		if(buyer_name){
			memberEl = 	<View style={[baseFlex,baseRow,baseCenter,Com.borderStyle(3)]}>
							<Image style={logoStyle} source={logoImg}/>
							<View>
								<Text style={[labelFz,baseMB20]}>会员</Text>
								<Text style={labelFz}>{buyer_name || ''}</Text>
							</View>
						</View>;
		}
		let _handler = null;
		let s_time = '';
		if(pageType !== 1){
			_handler = ()=>this._itemHandler();
			s_time = `${Com.getTimeFormat(add_time,1).replace(/\:\d{2}/,'')}          `;
		}else{
			s_time = `${Com.getTimeFormat(add_time,2).replace(/\:\d{2}/,'')}`;
			cancelEl = null;
			style = {};
		}
		return (
			<TouchableWithoutFeedback onPress={_handler}>
				<View style={[baseBgColorW,style]}>
					<View style={[baseRow,baseBetween,title]}>
						<View style={baseRow}>
							<View style={titleLeft}></View>
							<Text>订单号：</Text>
							<Text>{order_sn}</Text>
						</View>
						<View style={baseRow}>
							<Text style={baseColorG}>{s_time}</Text>
							{cancelEl}
						</View>
						<Line n_left={20}/>
					</View>
					<View style={[baseRow,baseColCenter,baseBetween,memberContent,Com.borderStyle(2)]}>
						<View style={[baseFlex,baseCenter]}>
							<Text style={[labelFz,baseMB10]}>应收合计（元）</Text>
							<Text style={[numFz,numColorStyle]}>{Com.getNumFormat(order_amount)}</Text>
						</View>
						<View style={[baseFlex,baseCenter,Com.borderStyle(3)]}>
							<Text style={[labelFz,baseMB10]}>折前合计（元）</Text>
							<Text style={[numFz,mainColorStyle]}>{Com.getNumFormat(goods_amount)}</Text>
						</View>
						{memberEl}
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

// <View style={[baseRow,baseMB10]}>
// 	<View style={[baseFlex,baseCenter]}>
// 		<Image style={flagImg} source={privilegeUrl}/>
// 		<View style={lineStyle}>
// 		</View>
// 		<Text>85折-120.00</Text>
// 	</View>
// 	<View style={[baseFlex,baseCenter,Com.borderStyle(3)]}>
// 		<Image style={flagImg} source={memberUrl}/>
// 		<View style={lineStyle}>
// 		</View>
// 		<Text>85折-120.00</Text>
// 	</View>
// 	<View style={[baseFlex,baseCenter,Com.borderStyle(3)]}>
// 		<Image style={flagImg} source={vUrl}/>
// 		<View style={lineStyle}>
// 		</View>
// 		<Text>{vname || ' '}</Text>
// 	</View>
// </View>
