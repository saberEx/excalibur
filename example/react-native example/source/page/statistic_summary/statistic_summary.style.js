'use strict';
import Com from './common';
let o_styles = {
    itemStyle:{
    	justifyContent :"space-between",
    	alignItems:'center',
    },
    groupItemStyle:{
    	justifyContent :"space-between",
    },
    paddingStyle:{
    	paddingLeft:Com.px2dp(26),
    	paddingRight:Com.px2dp(26),
    	paddingTop:Com.px2dp(16),
    	paddingBottom:Com.px2dp(16),
    },
    colorRed:{
        color:"#F95D5D",
    },
    buttonSty:{
        paddingTop:Com.px2dp(20),
        paddingBottom:Com.px2dp(20),
        borderTopWidth:1,
        borderTopColor:"#D3D3D3",
        backgroundColor:'#fff'
    },
};
export default Com.genStyle(o_styles);
