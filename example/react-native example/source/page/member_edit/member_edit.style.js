'use strict';
import Com from './common';
let deviceW = Com.deviceWidth;
const bgImgW = deviceW - Com.px2dp(40);
const bgImgH = bgImgW*40/60;
let o_styles = {
    textInputStyle:{
        color:"#333333",
    },
    fontStyle:{
        marginLeft:Com.px2dp(15),
        color:'#999',
    },
    inputLab:{
		color:'#999',
    },
    titleFontStyle:{
    	fontSize:Com.px2dp(22),
    },
    bgImgStyle:{
    	alignSelf:'center',
		width:bgImgW,
		height:bgImgH,
		marginTop:Com.px2dp(20),
		marginBottom:Com.px2dp(20),
    },
    codeImgStyle:{
    	marginTop:Com.px2dp(50),
    	alignSelf:'center',
    	width:Com.px2dp(280),
    	height:Com.px2dp(280),
    },
    btnStyle:{
    	width:bgImgW,
    	marginLeft:Com.px2dp(20),
        marginBottom:Com.px2dp(20),
    },
    nameTextStyle:{
    	alignSelf:'center',
    	color:'#fff',
    	marginTop:Com.px2dp(20),
    },
};
export default Com.genStyle(o_styles);
