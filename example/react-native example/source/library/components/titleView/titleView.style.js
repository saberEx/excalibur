/*
* @Author: 代汉桥
* @Date:   2016-06-08 11:07:31
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-08 11:52:36
*/

'use strict';
import Base from './base';
let o_styles = {
    container: {
        flexDirection:'row',
        // backgroundColor: '#fff',
        // paddingTop:Base.px2dp(15),
        // paddingBottom:Base.px2dp(15),
        // paddingLeft:Base.px2dp(20),
        // height:Base.px2dp(105),
        // alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title:{
    	// fz
    },
    titleFlag:{
    	backgroundColor:Base.mainColor,
    	width:Base.px2dp(5),
    	marginRight:Base.px2dp(10),
    }
};
export default Base.genStyle(o_styles);
