/*
* @Author: 代汉桥
* @Date:   2016-05-30 16:45:20
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-04 12:16:54
*/

'use strict';
import Base from './base';
let o_styles = {
    container: {
        flex: 1,
        flexDirection:'row',
        backgroundColor: '#fff',
        paddingTop:Base.px2dp(15),
        paddingBottom:Base.px2dp(15),
        paddingLeft:Base.px2dp(20),
        paddingRight:Base.px2dp(20),
        height:Base.px2dp(105),
        justifyContent : 'space-between',
        alignItems: 'center',
    },
    leftCon:{
        flexDirection:'row',
        alignItems: 'center',
    },
    label:{
        fontSize:Base.px2dp(26),
    },
    icon:{
        width:Base.px2dp(70),
        height:Base.px2dp(70),
        marginRight: Base.px2dp(20),
    },
    rightArrows:{
        width:Base.px2dp(15),
        height:Base.px2dp(30),
    },
};
export default Base.genStyle(o_styles);
