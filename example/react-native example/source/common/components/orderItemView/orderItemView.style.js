/*
* @Author: ด๚บบวล
* @Date:   2016-06-29 10:50:23
* @Last Modified by:   ด๚บบวล
* @Last Modified time: 2016-06-29 14:39:41
*/

'use strict';
import Com from './common';
let o_styles = {
	title:{
		paddingTop:Com.px2dp(10),
		paddingBottom:Com.px2dp(10),
		paddingRight:Com.px2dp(20),
	},
	titleLeft:{
		backgroundColor:Com.mainColor,
    	width:Com.px2dp(5),
    	marginRight:Com.px2dp(20),
	},
	logoStyle:{
		width:Com.px2dp(70),
		height:Com.px2dp(70),
		marginRight:Com.px2dp(10),
	},
	memberContent:{
		paddingTop:Com.px2dp(26),
		paddingBottom:Com.px2dp(26),
	},
	mainColorStyle:{
		color:Com.mainColor,
	},
	numColorStyle:{
		color:"#e74c3c",
	},
	flagImg:{
		width:Com.px2dp(80),
		height:Com.px2dp(80),
		marginTop:Com.px2dp(10),
	},
	lineStyle:{
		height : Com.px2dp(1),
		width : Com.px2dp(140),
		backgroundColor:'#ddd',
		marginTop:Com.px2dp(10),
		marginBottom:Com.px2dp(10),
	}
};
export default Com.genStyle(o_styles);
