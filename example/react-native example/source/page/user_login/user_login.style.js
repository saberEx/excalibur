/*
* @Author: 代汉桥
* @Date:   2016-05-26 11:57:11
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-01 18:00:21
*/

'use strict';
import Com from './common';
let o_styles = {
	labelStyle: {
	    height: 48,  // have to do it on iOS
	    marginTop: 10,
  	},
	logoImage:{
		height:Com.px2dp(280),
		resizeMode :"contain",
		marginTop:Com.px2dp(50),
		marginBottom:Com.px2dp(50)
	},
	btnStyle:{
		height:Com.px2dp(70)
	},
	containerPadding:{
		paddingLeft:Com.px2dp(20),
		paddingRight:Com.px2dp(20)
	},
	mBottomCom:{
		marginBottom:Com.px2dp(60)
	},
	bottonImg:{
		position: 'absolute',
		bottom: 0,
		left: 0,
		height:Com.px2dp(10),
		width:Com.deviceWidth,
		resizeMode :"cover",
	},
};
export default Com.genStyle(o_styles);
