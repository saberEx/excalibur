'use strict';
import Com from './common';
let inputW = Com.deviceWidth - Com.px2dp(190);
let o_styles = {
    inputStype:{
    	width:inputW,
    	// borderColor:"red",
    	// borderRadius:Com.px2dp(20),
    	// borderWidth:Com.px2dp(1),
    	marginLeft:Com.px2dp(30),
    	marginRight:Com.px2dp(30),
    },
    textStyle:{
    	height:Com.px2dp(65),
    	fontSize:Com.px2dp(20),
    	backgroundColor:"#F2F2F2",
    },
    bottomItem:{
    	height:Com.px2dp(80)
    },
    bottomBorderStyle:{
    	borderRightColor:'#ddd',
    	borderRightWidth:Com.px2dp(1),
    },
    bottomIcon:{
    	transform : [{scale:0.5}],
    	marginLeft:Com.px2dp(16),
    },
    memberImg:{
        width:Com.px2dp(160),
        height:Com.px2dp(160),
        borderRadius:Com.px2dp(20)
    },
    colorMoney:{
        color:"#ff4242"
    },
    colorCard:{
        color:'#00b7ff'
    },
    colorInte:{
        color:"#ff910a"
    }
};
export default Com.genStyle(o_styles);
