/*
* @Author: 代汉桥
* @Date:   2016-06-23 15:17:37
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-23 15:38:32
*/

'use strict';
'use strict';
import Com from './common';
let o_styles = {
	content:{
		justifyContent :"space-around",
		alignItems:'center',
	},
	timeLabel:{
		borderRadius:5,
		borderWidth:Com.px2dp(1),
		borderColor:Com.mainColor,
		padding:Com.px2dp(10),
	},
	okBtn:{
		color:Com.mainColor,
	}
};
export default Com.genStyle(o_styles);
