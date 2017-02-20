'use strict';
import React,{ Component } from 'react';
import { View } from 'react-native';
import Com from './common';
import {TopBar,NetImage} from './components';
const {baseContent,baseBgColorW,baseFlex,baseCenter} = Com;
class Member_bindWechat extends Component {
    componentDidMount(){
        this.props.init();
    }
  	render() {
        console.log(this.props.url);
        return (
            <View style={[baseBgColorW,baseFlex]}>
                <View style={[baseContent,baseCenter]}>
                    <NetImage style={{width:Com.deviceWidth - 80,height:Com.deviceWidth - 80}} source={{uri:this.props.url}}/>
                </View>
                <TopBar s_title="绑定微信"/>
            </View>
        );
    }
}
export default Member_bindWechat;
