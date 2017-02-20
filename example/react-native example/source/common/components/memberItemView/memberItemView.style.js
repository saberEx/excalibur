/*
* @Author: 卢旺
* @Date:   2016-06-13 16:15:56
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-27 17:31:47
*/

'use strict';
import Com from './common';
let o_memberItemViewStyle = {
	item:{
		flexDirection:'row',
		justifyContent:"space-between",
	},
    titleStyle:{
    	color:'#333333',
    	fontSize:Com.px2dp(28),
    	marginLeft:Com.px2dp(20),
    	marginTop:Com.px2dp(20),
    },
    nameStyle:{
    	color:'#9A9999',
    	fontSize:Com.px2dp(26),
    	marginTop:Com.px2dp(10),
    	marginLeft:Com.px2dp(20),
    },
    timeStyle:{
    	color:'#9A9999',
    	fontSize:Com.px2dp(24),
    	marginTop:Com.px2dp(10),
    	marginLeft:Com.px2dp(20),
    	marginBottom:Com.px2dp(20)
    },
    couponStyle:{
    	color:'#1E7DFB',
    	fontSize:Com.px2dp(24),
    	marginRight:Com.px2dp(20),
    	marginTop:Com.px2dp(10),
    },
    totalMoneyStyle:{
    	// justifyContent:"flex-end",
    	color:'#FF6407',
    	fontSize:Com.px2dp(28),
    	marginRight:Com.px2dp(20),
    	marginTop:Com.px2dp(20),
    },
};
export default Com.genStyle(o_memberItemViewStyle);
