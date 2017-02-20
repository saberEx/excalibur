'use strict';
import Com from './common';
let o_styles = {
	bgColor:{
		backgroundColor:"#F2EEEB",
	},
	itemStyle:{
		backgroundColor:"#fff",
		padding:Com.px2dp(10),
	},
    imgStyle:{
    	width:Com.px2dp(100),
    	height:Com.px2dp(100),
    	margin:Com.px2dp(20),
    },
    priceStyle:{
    	color:'#ea3a28',
    },
    nameStyle:{
    	fontSize:Com.px2dp(30),
    	marginBottom:Com.px2dp(40),
    }
};
export default Com.genStyle(o_styles);
