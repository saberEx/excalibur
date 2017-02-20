/*
* @Author: 卢旺
* @Date:   2016-05-31 15:20:22
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-21 17:55:07
*/

'use strict';
import Base from './base';
let o_radioStyle = {
    container: {
        flexDirection:'row',
        backgroundColor: '#fff',
        paddingTop:Base.px2dp(15),
        paddingBottom:Base.px2dp(15),
        paddingLeft:Base.px2dp(20),
        height:Base.px2dp(105),
        alignItems: 'center',
    },
};
export default Base.genStyle(o_radioStyle);
