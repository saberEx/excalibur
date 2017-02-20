'use strict';
import Com from './common';
let o_styles = {
    nameTextStyle:{
    	marginTop:Com.px2dp(10),
    },
    containerPadding:{
		paddingLeft:Com.px2dp(20),
		paddingRight:Com.px2dp(20)
	},
	mBottomCom:{
		marginBottom:Com.px2dp(50),
		backgroundColor:'#EAE8E9',
		borderRadius:2,
	},
	titleStyle:{
		marginBottom:Com.px2dp(40),
	},
	bgStyle:{
		backgroundColor:'#fff',
	},
	buttonSty:{
        paddingTop:Com.px2dp(20),
        paddingBottom:Com.px2dp(20),
        paddingLeft:Com.px2dp(20),
		paddingRight:Com.px2dp(20),
        borderTopWidth:1,
        borderTopColor:"#D3D3D3",
        backgroundColor:'#fff'
    },
};
export default Com.genStyle(o_styles);
