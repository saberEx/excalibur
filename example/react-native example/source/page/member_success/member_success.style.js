'use strict';
import Com from './common';
let btnWidth = (Com.deviceWidth - Com.px2dp(60)) / 2;
let o_styles = {
    imageStyle:{
    	marginTop:Com.px2dp(60),
		marginBottom:Com.px2dp(60),
    	height:Com.px2dp(140),
    	width:Com.px2dp(140),
    	alignSelf:'center',
    },
    textStyle:{
    	alignSelf:'center',
    	fontSize:Com.px2dp(28),
    },
    wechatBtnTextStyle:{
    	color:Com.mainColor,
    },
    cardNumSyle:{
    	alignSelf:'center',
    	color:Com.mainColor,
    	fontSize:Com.px2dp(32),
    	marginTop:Com.px2dp(10),
    	marginBottom:Com.px2dp(10),
    },
    bgImg:{
    	flex:1,
    	width:Com.deviceWidth,
    },
    rechargeBtn:{
        marginLeft:Com.px2dp(20),
        marginRight:Com.px2dp(10),
        width:btnWidth,
    },
    wechatBtn:{
        width:btnWidth - Com.px2dp(4),
        backgroundColor:'#fff',
        height:Com.px2dp(64),
    },
    wechatBtnView:{
        borderRadius:Com.px2dp(8),
        borderColor:Com.mainColor,
        borderWidth:Com.px2dp(2),
        marginRight:Com.px2dp(20),
        marginLeft:Com.px2dp(10),
    },
    viewStyle:{
    	borderTopWidth:1,
        borderTopColor:"#D3D3D3",
    },
};
export default Com.genStyle(o_styles);
