/*
* @Author: 代汉桥
* @Date:   2016-06-02 17:15:26
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-07-06 09:46:44
*/

'use strict';
import React, { Component , PropTypes } from 'react';
import Image from 'react-native-image-progress';
import {MKProgressBar} from 'react-native-material-kit';

export class NetImage extends Component {
	static propTypes = {
		source:PropTypes.object,//图片资源
		s_default:PropTypes.number,//默认图片
    };
	render() {
		let {style,source,s_default} = this.props;
		if(!source.uri){
			return s_default ? <Image style={style} source={s_default}></Image> : null;
		}
		return (
			<Image indicator={MKProgressBar} style={style} source={source}></Image>
		);
	}
}
