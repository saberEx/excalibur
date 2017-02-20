'use strict';
import Com from './common';
let o_styles = {
	inputLab:{
		color:'#999',
    },
    fontStyle:{
        marginLeft:Com.px2dp(20),
        color:'#999',
    },
    buttonSty:{
        paddingTop:Com.px2dp(20),
        paddingBottom:Com.px2dp(20),
        borderTopWidth:1,
        borderTopColor:"#D3D3D3",
        backgroundColor:'#fff'
    },
    labelBottom:{
        paddingBottom:Com.px2dp(5),
    }
};
export default Com.genStyle(o_styles);
