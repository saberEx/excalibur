/*
* @Author: 代汉桥
* @Date:   2016-05-16 11:26:00
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-16 14:36:17
* 头部导航组件样式，项目中有定制样式，可在common.style中覆盖
*/

'use strict';
import Base from './base';
let o_topBarStyle = {
	container: {
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		flexDirection: 'row',
		width: Base.deviceWidth,
		height: Base.topHeight,
		backgroundColor: Base.mainColor,
	},
	leftButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: 90,
		paddingTop: 1,
		paddingLeft: 8
	},
	leftButtonIcon: {
		width: 12,
		height: 15,
		marginRight: 6
	},
	leftButtonTitle: {
		fontSize: 15,
		color:'#333'
	},
	title: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 1,
		justifyContent: 'center',
		width: Base.deviceWidth - 200,
		overflow: 'hidden'
	},
	titleText: {
		fontSize: 18,
		fontWeight: '400',
		color: '#000'
	},
	rightButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: 90,
		paddingTop: 1,
		paddingRight: 8
	},
	rightButtonIcon: {
		width: 10,
		height: 15
	},
	rightButtonTitle: {
		fontSize: 15,
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
			paddingTop: 20
		},
		rightButton: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'center',
			width: 90,
			paddingTop: 1,
			paddingRight: 8
		}
	});
}
export default Base.genStyle(o_topBarStyle);
