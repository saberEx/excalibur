'use strict';
import React,{ Component } from 'react';
import { View ,Image,Text} from 'react-native';
import Com from './common';
import {TopBar,Button} from './components';
import o_styles from './member_success.style';
const {baseContent,baseBgColorW,baseRow,baseFlex,basePTB10} = Com;
const {imageStyle,textStyle,cardNumSyle,bgImg,viewStyle,rechargeBtn,wechatBtnView,wechatBtn,wechatBtnTextStyle} = o_styles;
const successUrl =  require('./memberSuccess.png');
const bgUrl = require('./normsSelect_bg.jpg');
class Member_success extends Component {
    componentWillMount() {
        this._memberCard = Com.getPageParams('memberCard') || "";
        this._member_id = Com.getPageParams('member_id') || "";
    }
    render() {
	    return (
        <View style={baseFlex}>
          <Image style={bgImg} source={bgUrl}>
             <View style={baseContent}>
                  <Image style={imageStyle} source={successUrl}/>
                  <Text style={textStyle}>新建会员卡成功</Text>
                  <Text style={cardNumSyle}>卡号 : {this._memberCard}</Text>
                  <Text style={textStyle}>请您选择您的操作</Text>
            </View>
          </Image>
          <TopBar s_title="会员售卡"/>
          <View style={[baseBgColorW,baseRow,basePTB10,viewStyle]}>
              <Button style={rechargeBtn} text='充值' onPress={()=>this.props.rechargeHandler(this._member_id,this._memberCard)}/>
              <View style={wechatBtnView}>
                  <Button style={wechatBtn} onPress={()=>this.props.wechatHandler(this._member_id)} textStyle={wechatBtnTextStyle} text='绑定微信'/>
              </View>
          </View>
        </View>
       );
   }
}
export default Member_success;
