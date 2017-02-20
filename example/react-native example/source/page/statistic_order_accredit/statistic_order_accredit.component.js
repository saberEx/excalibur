'use strict';
import React,{ Component } from 'react';
import { View } from 'react-native';
import Com from './common';
import {TopBar,TitleView,Input,BlockBtn} from './components';
import o_styles from './statistic_order_accredit.style';
const {baseContent,baseMT20,baseFlex,baseBgColorW} = Com;
const {buttonSty,bgColor} = o_styles;
class Statistic_order_accredit extends Component {
    componentWillMount() {
        this._orderId = Com.getPageParams('order_id');
        this._rowId = Com.getPageParams('rowID');
        this._sectionID = Com.getPageParams('sectionID');
    }
  	render() {
        console.log(this._orderId);
	    return (
            <View style={[baseFlex,bgColor]}>
                <View style={[baseContent,baseFlex,bgColor]}>
                    <TitleView style={[baseMT20,baseBgColorW]} s_title="输入密码">
                        <Input ref={(component)=>this._password = component} underlineSize={0} password={true} placeholder="请输入店长密码"  />
                    </TitleView>
                </View>
                <View style={buttonSty}>
                    <BlockBtn text='确定' onPress={()=>this.props.okHandler(this)}></BlockBtn>
                </View>
                <TopBar s_title="授权"/>
            </View>
        );
    }
}
export default Statistic_order_accredit;
