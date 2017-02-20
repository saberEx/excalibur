'use strict';
import React,{ Component} from 'react';
import { View , Text , Image , ScrollView} from 'react-native';
import Com from './common';
import {TopBar,TitleView,RadioGroup,LabelInput,Input,Line,Button,NetImage} from './components';
import o_styles from './member_edit.style';
const {baseContent,baseRow,baseMT20,baseBgColorW,baseColCenter} = Com;
const {textInputStyle,fontStyle,inputLab,titleFontStyle,bgImgStyle,bgStyle,codeImgStyle,btnStyle,nameTextStyle} = o_styles;
const imgURL = require('./edit_codebgImg.png');
const n_line = Com.px2dp(30);
class Member_edit extends Component {
    constructor(props){
        super(props);
        this.state = {
            wxNickName:Com.getPageParams('wechat_nickname')
        };
    }
    componentDidMount(){
        this.props.init(this);
    }
    componentWillMount() {
        this.member_name = Com.getPageParams('member_name');
        this.member_mobile = Com.getPageParams('member_mobile');
        this.card_id = Com.getPageParams('card_id');
        this.member_sex = Com.getPageParams('member_sex');

    }
    componentWillUnmount() {
        Com.removeNativeAllEvent("wxNotice");
    }
    render() {
        let {wxNickName} = this.state;
        let wechat = wxNickName || '未绑定微信';
        return (
            <View style={{flex:1}}>
                <ScrollView style={[baseContent,{flex:1}]}>
                    <View style={[baseMT20,baseBgColorW]}>
                        <TitleView titleStyle={titleFontStyle} s_title='会员信息'>
                            <LabelInput n_line = {n_line} ref="member_name" s_label='会员名称:' s_default={this.member_name}  labelStyle={inputLab} textInputStyle={textInputStyle} disUnderline={true} tintColor='white'/>
                            <LabelInput n_line = {n_line} ref="member_mobile" s_label='手机号码:' s_default={this.member_mobile}  labelStyle={inputLab}  textInputStyle={textInputStyle} disUnderline={true} tintColor='white'/>
                            <LabelInput n_line = {n_line} ref="card_id" s_label='会员卡号:' s_default={this.card_id}  labelStyle={inputLab}  textInputStyle={textInputStyle} disUnderline={true} tintColor='white'/>
                            <View style={[baseBgColorW,baseColCenter,baseRow]}>
                                <Text style={fontStyle}>性        别:</Text>
                                <RadioGroup s_curId={this.member_sex} ref="member_sex" a_group={[{s_label:'男',s_onColor:"#FBC30A",s_id:"1",s_offColor:"#FBC30A",s_fillColor:"#FBC30A"},{s_label:'女',s_id:"2",s_onColor:"#FBC30A",s_offColor:"#FBC30A",s_fillColor:"#FBC30A"}]} style={baseRow}/>
                            </View>
                        </TitleView>
                    </View>
                    <View style={[baseMT20,baseBgColorW]}>
                        <TitleView titleStyle={titleFontStyle} s_title='绑定微信'/>
                            <Image style={bgImgStyle} source={imgURL}>
                                <Text ref='wechat' style={nameTextStyle}>{wechat}</Text>
                                <NetImage style={codeImgStyle} source={{uri:this.props.url}}/>
                            </Image>
                    </View>
                </ScrollView>
                <Button style={btnStyle} text='保存' onPress={()=>this.props.editMessage(this)}/>
                <TopBar s_title="会员编辑"/>
            </View>
        );
    }
}
export default Member_edit;
