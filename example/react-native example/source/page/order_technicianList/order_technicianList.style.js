'use strict';
import Com from './common';
import Base from './base';
let o_styles = {
    container: {
        backgroundColor: '#f1f1f1',
        height:Com.DeviceHeight,
        flex:1
    },
    itemLabel:{
    	marginTop:Base.px2dp(20),
    },
    submitBtn:{
        width:Com.deviceWidth,
        height:Com.px2dp(70),
        backgroundColor:Com.mainColor,
      	paddingLeft:Com.px2dp(20),
		paddingRight:Com.px2dp(20)
    },
    submitBtnLabel:{
        fontSize:Com.px2dp(24)
    },
    submitCon:{
        paddingTop:Com.px2dp(20),
        paddingBottom:Com.px2dp(20),
        borderTopWidth:1,
        borderTopColor:"#D3D3D3",
        backgroundColor:'#fff'

    },
    imageBg:{
        flex:1,
        width:Com.deviceWidth,
    }
};
export default Com.genStyle(o_styles);
