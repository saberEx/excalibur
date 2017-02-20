/*
* @Author: 卢旺
* @Date:   2016-06-13 16:15:56
* @Last Modified by:   卢旺
* @Last Modified time: 2016-06-15 15:45:09
*/

'use strict';
import Com from './common';
let o_lumpViewStyle = {
	leftLine:{
		borderLeftWidth : Com.px2dp(1),
		borderLeftColor : '#D7D7D7',
	},
	itemColumn:{
    	// flexDirection:"column",
		flex:1,
		justifyContent: 'space-between',
    },
    horizontalLine:{
    	height:Com.px2dp(1),
    	width:Com.px2dp(140),
    	backgroundColor:'#D7D7D7',
    	marginTop:Com.px2dp(5),
    },
    img:{
    	width:Com.px2dp(80),
    	height:Com.px2dp(80),
    },
    midText:{
    	color:'#AAAAAA',
    	fontSize:Com.px2dp(24),
    	marginTop:Com.px2dp(5),
    	marginBottom:Com.px2dp(5),
    },
};
export default Com.genStyle(o_lumpViewStyle);
