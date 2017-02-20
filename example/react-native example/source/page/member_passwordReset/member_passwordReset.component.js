'use strict';
import React,{ Component } from 'react';
import { View , Text , ScrollView} from 'react-native';
import Com from './common';
import {TopBar,TitleView,Input,Button} from './components';
import o_styles from './member_passwordReset.style';
const {baseContent,baseRow,baseBgColorW,baseMB10,baseFlex} = Com;
const {nameTextStyle,containerPadding,mBottomCom,titleStyle,buttonSty,bgStyle} = o_styles;
class Member_passwordReset extends Component {
	render() {
        let memberName = Com.getPageParams('member_name');
        return (
            <View style={baseFlex}>
                <ScrollView style={bgStyle}>
                    <View style={[baseContent]}>
                        <View style={[baseRow,titleStyle]}>
                            <TitleView s_title='会员名称：' />
                            <Text style={nameTextStyle}>{memberName}</Text>
                        </View>
                        <View style={[containerPadding]}>
                            <Input ref='password' style={[mBottomCom]} underlineSize={0} placeholder='输入新密码'/>
                            <Input ref='repassword' style={[mBottomCom]} disUnderline={true} underlineSize={0} placeholder='再次输入'/>
                        </View>
                    </View>
                </ScrollView>
                <TopBar s_title="重置密码"/>
                <View style={buttonSty}>
                  <Button text='确定' onPress={()=>this.props.updatePwd(this)}/>
                </View>
            </View>
        );
    }
}
export default Member_passwordReset;
