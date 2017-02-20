/*
* @Author: 代汉桥
* @Date:   2016-05-19 14:26:24
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-21 13:46:46
* 组件基础类，提供了shouldComponentUpdate实现
* 因为对象深度遍历对比效率并不理想，不建议页面组件继承该基础组件，推荐针对列表Item组件和页面子组件使用
* props中少写匿名函数，参考bottomTab.js的_selectHandler
*/
'use strict';

import React, { Component } from 'react';
import {isEqual} from 'lodash';

export default class BaseComponent extends Component {
	shouldComponentUpdate(nextProps, nextState){
		const thisProps = this.props;
		const thisState = this.state;
		if(isEqual(nextProps,thisProps) && isEqual(nextState,thisState)){
			return false;
		}
		return true;
	}
}
