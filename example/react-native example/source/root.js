/*
* @Author: 代汉桥
* @Date:   2016-05-19 09:30:13
* @Last Modified by:   代汉桥
* @Last Modified time: 2016-07-07 15:24:31
*/

'use strict';
import React, { Component } from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider} from 'react-redux';
import thunk from 'redux-thunk';
import { Navigator , View  ,Linking } from 'react-native';
import Com from './common';
//由脚本自动生成的页面文件索引
import {o_components,o_reducers} from './indexConfig';
//全局loading
import AppLoader from './appLoader';
import {Prompt} from './components';
//消息提示框
import {MessageBar,MessageBarManager} from 'react-native-message-bar';
//热更新
import codePush from "react-native-code-push";

const middlewares = [thunk];

// if (Com.DEBUG) {
//     const createLogger = require('redux-logger');
//     const logger = createLogger();
//     const diffLogger = require('redux-diff-logger');
//     middlewares.push(logger,diffLogger);
// }

//获取store
const createStoreWithMiddleware = compose(
    applyMiddleware(...middlewares),
    f => f
)(createStore);
const store = createStoreWithMiddleware(combineReducers(o_reducers));
Com.store = store;

//页面导航
class PageNavigator extends Component {
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
        return <Component/>;
    }
	render() {
		return (
			<Navigator
                initialRoute={{[Com.routerKey]: 'user_login'}}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
            />
		);
	}
}

//根组件
export default class Root extends Component {
    constructor(props){
        super(props);
        this.state = {
            b_loading:false,
            promptEl:null,
        };
    }
    componentDidMount() {
        Com.showProgress = (b_loading) => {
            this.setState({b_loading:b_loading});
        };
        Com.toast = (s_message,s_alertType)=>{
            s_alertType = s_alertType || 'info';
            MessageBarManager.showAlert({
                message: s_message,
                alertType: s_alertType,
                stylesheetInfo:{backgroundColor:Com.mainColor,strokeColor:Com.mainColor,},
                messageStyle:{textAlign:"center"},
                viewTopInset:Com.px2dp(24),
                position:"top"
            });
        };
        MessageBarManager.registerMessageBar(this.refs.alert);

        //大版本更新
        let self = this;
        Com.getNormal({act:'account',op:'get_version'},(res)=>{
            //增量更新
            codePush.sync();
            const buildNumber = parseFloat(Com.getBuildNumber());
            if(res.code === 0){
                let {version,url,is_forced} = res.data;
                version = parseFloat(version);
                if(buildNumber < version){
                    let down = ()=>{
                        Linking.openURL(url).catch(err => console.error('An error occurred', err));
                    };
                    let params = {
                        b_input:false,
                        s_text:'有新版本，是否更新',
                        visible:true,
                        onSubmit:down,
                        b_isCancle:false,
                        title:'提示'
                    };
                    let close = ()=>{
                        self.setState({promptEl:<Prompt {...params} visible={false}/>});
                    };
                    let promptEl = null;
                    if(parseInt(is_forced) === 0){
                        promptEl = <Prompt {...params} onCancel={close} b_isCancle={true}/>;
                    }else{
                        promptEl = <Prompt {...params} s_text='有新版本需要更新哦！'/>;
                    }
                    self.setState({promptEl:promptEl});
                }
            }
        });
    }
    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }
    render() {
        return (
            <Provider store={store}>
                <View style={[{ flex: 1 },Com.baseBgColorW]}>
                    <PageNavigator />
                    <AppLoader b_isShow={this.state.b_loading}/>
                    <MessageBar ref="alert"/>
                    {this.state.promptEl}
                </View>
            </Provider>
        );
    }
}
