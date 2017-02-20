/*
* @Author: 卢旺
* @Date:   2016-05-26 11:57:11
* @Last Modified by:   卢旺
* @Last Modified time: 2016-05-31 17:35:41
*/
'use strict';
import Com from './common';
let o_styles = {
    logoImage:{
    	width:Com.deviceWidth,
		height:Com.px2dp(280),
	},
	subItemStyle:{
		paddingLeft: Com.px2dp(100),
		backgroundColor: '#FAFAFA',
	},
	bottonImg:{
		position: 'absolute',
		bottom: 0,
		left: 0,
		height:Com.px2dp(10),
		width:Com.deviceWidth,
		resizeMode :"contain",
	},
};
export default Com.genStyle(o_styles);
