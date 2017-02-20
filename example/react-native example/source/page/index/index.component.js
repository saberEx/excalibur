'use strict';
import React,{ Component } from 'react';
import { View,Image,Text,ScrollView,Alert} from 'react-native';
import Com from './common';
import {TopBar,MediaItem,FoldMediaItem} from './components';

//logo图片
const logoUrl =  require("./index_logo.png");
//底部图片
const bottomImg = require('./index_bottomImage.png');
//样式
import o_styles from './index.style';
const {logoImage,subItemStyle,bottonImg} = o_styles;
const n_mediaLeft = Com.px2dp(120);
//页面组件
class Index extends Component {
  	render() {
  		let {onClick} = this.props;
	    return (
	    	<View style={Com.baseFlex}>
	    		<ScrollView>
	          		<View style={Com.baseContent}>
						<Image style={logoImage} source={logoUrl}/>
					</View>
					<View style={Com.baseMT20}>
						<MediaItem s_label="下单" s_icon={require('./index_order.png')} b_line={true} onPress = {()=>onClick("order_select")}/>
						<MediaItem s_label="线上预定" s_icon={require('./index_reserve.png')} b_line={true} onPress = {()=>onClick("reservation_management")} />
						<FoldMediaItem s_label="查询" s_icon={require('./index_search.png')} b_line={true} n_height={Com.px2dp(315)}>
							<MediaItem style={subItemStyle} n_lineLeft={n_mediaLeft} s_label="查询订单" s_icon={null} b_line={true} s_right={null} onPress = {()=>onClick("statistic_order")}/>
							<MediaItem style={subItemStyle} n_lineLeft={n_mediaLeft} s_label="查询结班" s_icon={null} b_line={true} s_right={null} onPress = {()=>onClick("statistic_summary")}/>
							<MediaItem style={subItemStyle} n_lineLeft={n_mediaLeft} s_label="查询销售情况" s_icon={null} b_line={true} s_right={null} onPress = {()=>onClick("statistic_sellInfo")}/>
						</FoldMediaItem>
						<FoldMediaItem s_label="会员操作" s_icon={require('./index_member.png')} b_line={true} n_height={Com.px2dp(315)}>
							<MediaItem style={subItemStyle} n_lineLeft={n_mediaLeft} s_label="售卡" s_icon={null} b_line={true} s_right={null} onPress = {()=>onClick("member_add")}/>
							<MediaItem style={subItemStyle} n_lineLeft={n_mediaLeft} s_label="操作" s_icon={null} b_line={true} s_right={null} onPress = {()=>onClick("member_search",{pageType:1})}/>
							<MediaItem style={subItemStyle} n_lineLeft={n_mediaLeft} s_label="查询" s_icon={null} b_line={true} s_right={null} onPress = {()=>onClick("member_search",{pageType:2})}/>
						</FoldMediaItem>
					</View>
        		</ScrollView>
        		<TopBar s_leftLabel={Com.getUserData('account')} s_rightLabel="退出" f_rightHandler={this.props.exit} s_title={Com.getUserData('shopName') || '首页'} o_rightLabelStyle={Com.baseColorG} s_leftIcon={null}/>
	        	<Image style={bottonImg} source={bottomImg}/>
	    	</View>
	    );
  	}
}
export default Index;
