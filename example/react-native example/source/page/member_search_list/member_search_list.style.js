'use strict';
import Com from './common';
let o_styles = {
    tabBarStyle:{
        height:Com.px2dp(80),
        paddingBottom:0,
    },
    scrollViewBg:{
        backgroundColor:"#F2EEEB",
    },
    scrollViewContent:{
        paddingBottom:Com.px2dp(70),
        backgroundColor:"#F2EEEB",
    },
};
export default Com.genStyle(o_styles);
