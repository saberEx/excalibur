/*
* @Author: 代汉桥
* @Date:   2016-05-14 15:41:02
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-16 14:57:02
* 基础样式及基础样式配置
*/
import {Platform} from 'react-native';
//平台判断
let b_isAndroid = Platform.OS === 'android';
//基础样式配置
export let baseStyleConfig = {
    mainColor:'red',
    topHeight:b_isAndroid ? 44 : 64,
};
//基础样式
export let baseStyle = {
	//内容区样式
	baseContent:{
		paddingTop:baseStyleConfig.topHeight,
	}
};
