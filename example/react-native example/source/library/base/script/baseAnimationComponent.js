/*
* @Author: 代汉桥
* @Date:   2016-06-03 17:30:14
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-06-04 11:57:25
* 基础动画组件
*/

'use strict';
'use strict';

import React, { Component } from 'react';
import {Animated} from 'react-native';
import {isEqual} from 'lodash';

//[pros:{input,output,b_transform},pros:{input,output}]
export default class BaseAnimationComponent extends Component {
	constructor(props,params=[],time=500){
		super(props);
		if(params.length > 0){
			this.interpolates = {};
			let transforms = [];
			let _transformValue = new Animated.Value(0);
			params.map((item)=>{
				for (let prop in item) {
					if (item.hasOwnProperty(prop)) {
						let {input=[0,1],output,b_transform=false} = item[prop];
						let polate = _transformValue.interpolate({inputRange: input,outputRange: output});
						if(b_transform){
							transforms.push({[prop]:polate});
						}else{
							this.interpolates[prop] = polate;
						}
					}
				}
			});
			this.interpolates.transform = transforms;
	     	this.startAnimation = (value,toValue)=>{
	         	_transformValue.setValue(value);
		        this._animated = Animated.timing(_transformValue, {
		            toValue: toValue,
		            duration: time,
		        });
		        this._animated.start();
	     	};
		}
	}
}
