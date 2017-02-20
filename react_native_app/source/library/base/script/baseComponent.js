/*
* @Author: 代汉桥
* @Date:   2016-05-19 14:26:24
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-19 14:33:15
* 组件基础类，提供了shouldComponentUpdate实现
*/
'use strict';

import React, { Component } from 'react';
import { is } from 'immutable';

export class BaseComponent extends Component {
	shouldComponentUpdate(nextProps = {}, nextState = {}){
		const thisProps = this.props || {};
		//使用redux，去掉state的比较
		if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
			return true;
		}
		for (const key in nextProps) {
			if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
				return true;
			}
		}
		return false;
	}
}
