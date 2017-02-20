/*
* @Author: 代汉桥
* @Date:   2016-05-30 17:54:44
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-02 16:58:21
*/

'use strict';
import Base from './base';
let o_styles = {
	container:{
		width:Base.deviceWidth,
		position:"absolute",
		backgroundColor:'#ddd',
		height:Base.px2dp(1),
		bottom:0,
		left:0
	},
};
export default Base.genStyle(o_styles);
