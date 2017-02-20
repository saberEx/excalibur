/*
* @Author: 代汉桥
* @Date:   2016-05-16 11:26:00
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-20 14:32:16
* 头部导航组件样式，项目中有定制样式，可在common.style中覆盖
*/

'use strict';
import Base from './base';
let o_topBarStyle = {
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		flexDirection: 'row',
		width: Base.deviceWidth,
		height: Base.topHeight,
		backgroundColor: Base.topBarBgColor,
		borderBottomColor :'#D9D9D9',
		borderBottomWidth : 0.3
	},
	leftButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: Base.px2dp(90),
		paddingTop: 1,
		paddingLeft: 8
	},
	leftButtonIcon: {
		width: Base.px2dp(20),
		height: Base.px2dp(25),
		marginRight: Base.px2dp(6)
	},
	leftButtonTitle: {
		fontSize: Base.px2dp(24),
		color:'#333'
	},
	title: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 1,
		justifyContent: 'center',
		width: Base.deviceWidth - Base.px2dp(200),
		overflow: 'hidden'
	},
	titleText: {
		fontSize: Base.px2dp(26),
		color: Base.topBarTitleColor
	},
	rightButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: Base.px2dp(90),
		paddingTop: 1,
		paddingRight: Base.px2dp(16)
	},
	rightButtonIcon: {
		width: Base.px2dp(20),
		height: Base.px2dp(25)
	},
	rightButtonTitle: {
		fontSize: Base.px2dp(24),
		color:'#333'
	},
};
if(Base.isIos){
	Object.assign(o_topBarStyle, {
		container: {
			flex: 1,
			position: 'absolute',
			top: 0,
			left: 0,
			flexDirection: 'row',
			width: Base.deviceWidth,
			paddingTop: Base.px2dp(20)
		},
		rightButton: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'center',
			width: Base.px2dp(90),
			paddingTop: 1,
			paddingRight: Base.px2dp(8)
		}
	});
}
export default Base.genStyle(o_topBarStyle);
