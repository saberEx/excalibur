/*
* @Author: 代汉桥
* @Date:   2016-05-19 09:30:13
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-05-23 14:56:52
*/

'use strict';
import React, { Component } from 'react';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import { Navigator } from 'react-native';
import Com from './common';
//由脚本自动生成的页面文件索引
import {o_components,o_reducers} from './indexConfig';
console.log(o_components);
//根组件
export class Root extends Component {
 	configureScene(route) {
        return Navigator.SceneConfigs.FadeAndroid;
    }
    renderScene(router,navigator){
        Com.navigator = navigator;
        let s_routerName = router[Com.routerKey];
        if(!o_components[s_routerName]){
            throw `未定义页面组件：${s_routerName}`;
        }
        let Component = o_components[s_routerName];
        return <Component {...router}/>;
    }
	render() {
		return (
			<Navigator
                initialRoute={{[Com.routerKey]: 'main'}}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
            />
		);
	}
}

//获取store
const createStoreWithMiddleware = compose(
    applyMiddleware(
        thunk
    ),
    f => f
)(createStore);
export const store = createStoreWithMiddleware(combineReducers(o_reducers));
