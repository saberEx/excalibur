'use strict';
import React,{ Component } from 'react';
import { View,ScrollView,Text,Image,TextInput,Animated} from 'react-native';
import Com from './common';
import {TopBar,TabView,BlockBtn,TitleView,NetImage,RadioGroup,Label} from './components';
import o_styles from './pay_index.style';
import {LumpGroup} from './lumpView';
import {Prompt} from './prompt';
const {baseFlex,baseMT20,baseContent,px2dp,baseBgColorW,baseRow,baseCenter,baseColorG,baseRowCenter} = Com;
const {topInfo,itemColumn,itemText,receivableItemMoney,totalItemMoney,verticalLine,verticalLine1,horizontalLine,img,midText
      ,submitCon,submitBtnLabel,clearingForm,clearingFormItem,clearingFormText,inputText,memberImg,vkeValueStyle,pTitleStyle
      ,pTextStyle,memberIconSty} = o_styles;
//优惠券图标
const privilegeUrl =  require("./pay_index_privilege.png");
//v客图标
const vUrl =  require("./pay_index_v.png");
//会员图标
const memberUrl =  require("./pay_index_member.png");
//会员头像
const memberHead = require("./pay_index_member_img.png");
//会员icon
const memberIcon = require("./pay_index_member_icon.png");

class Pay_index extends Com.AnimationComponent {
    constructor(props){
      super(props,[{translateY:{output:[0,px2dp(96)],b_transform:true}}],300);
      let _payIndex = this;
      this.state = {
          curType:-1,
          promptVisible:false,
          message:''
      };
    }
   componentWillMount(){
     this.startAnimation(0,1);
   }
   componentDidUpdate(prevProps, prevState) {
      if(this.state.curType === -1){
        this.startAnimation(0,1);
      }
   }
   componentDidMount(){
       this.props.init();
   }
    _chageGroup(index){
      if (index === 0) {
        this.startAnimation(1,0);
      }else if(index === 1){
        this.startAnimation(1,0);
      }else if(index === 2){
        this.startAnimation(1,0);
      }else{
        this.startAnimation(0,1);
      }
      this.setState({curType:index});
    }
    _submit(index){
        this.props.submit(index,this);
    }
  	render() {
      let {submit,receivableMoney,totalMoney,vList,payList,privilege,privilegeChange,posPay,vChange,accountChange,passwordChange,passwordSubmit,vName,m_name,m_url} = this.props;
      let {curType,promptVisible,message} = this.state;
      let e_view = null;
      if(curType === 0){
        e_view = <Privilege_item privilegeChange={privilegeChange}/>;
      }else if(curType === 1){
        e_view = <Member_item accountChange={accountChange} passwordChange={passwordChange}/>;
      }else if(curType === 2){
        e_view = <V_item vList={vList} vChange={vChange}/>;
      }else{
        e_view = <Pay_item payList={payList} posPay={posPay}/>;
      }
      if (!vName) {
        vName="暂无";
      }
      if (!m_name) {
        m_name="暂无";
      }
	    return (
           <View style={baseFlex} backgroundColor={baseColorG}>
           <ScrollView>
              <View style={[baseFlex,baseMT20]}>
                    <View style={[topInfo,baseContent]}>
                      <View style={itemColumn}>
                          <Text style={itemText}>应收合计（元）</Text>
                          <Text style={receivableItemMoney}>{Com.getNumFormat(receivableMoney)}</Text>
                      </View>
                      <View style={verticalLine}></View>
                      <View style={itemColumn}>
                          <Text style={itemText}>折前合计（元）</Text>
                          <Text style={totalItemMoney}>{Com.getNumFormat(totalMoney)}</Text>
                      </View>
                      <View style={verticalLine}></View>
                      <View style={[baseFlex,baseRow,baseCenter]}>
                          <NetImage source={{uri:m_url}} style={memberImg} s_default={memberHead}></NetImage>
                          <View>
                              <View style={[baseRow,baseCenter]}>
                                  <Text style={midText}>会员</Text>
                                  <Image source={memberIcon} style={memberIconSty}></Image>
                              </View>
                             <Text>{m_name}</Text>
                          </View>
                      </View>
                 </View>
                 <View style={topInfo}>
                      <LumpGroup f_callBack={this._chageGroup.bind(this)} a_group={[{s_url:privilegeUrl,s_label:privilege},{s_url:memberUrl,s_label:m_name},{s_url:vUrl,s_label:vName}]}/>
                 </View>
                {e_view}
              </View>
              </ScrollView>
             <TopBar s_title="支付"/>
             <Animated.View style={[this.interpolates,submitCon]}>
                <BlockBtn onPress={()=>this._submit(curType)} text="确认" textStyle={submitBtnLabel}/>
             </Animated.View>
             <Prompt
                b_input={true}
                s_text={message}
                b_isCancle={false}
                titleStyle={pTitleStyle}
                o_textStyle={pTextStyle}
                title="请输入支付密码"
                visible={promptVisible}
                onSubmit={(value) => passwordSubmit(value,this)}/>
           </View>
       );
   }
}

//支付方式
class Pay_item extends Component{
    render(){
      let a_group = [];
      let {posPay,payList} = this.props;
      if (payList) {
         a_group = payList.map((item,key) =>{
            let {payment_name,payment_id} = item;
            if (key === 0) {
              return {s_label:payment_name,s_curId:payment_id};
            }else{
              return {s_label:payment_name,s_curId:payment_id,style:clearingFormItem};
            }
         });
      }
      return(
         <View>
            <TitleView s_title="结算方式" style={clearingForm} titleStyle={clearingFormText}/>
            <ScrollView>
               <View >
                  <RadioGroup f_change={(value)=>{posPay(value)}}  a_group={a_group}/>
               </View>
            </ScrollView>
        </View>
        );
    }
}

//优惠
class Privilege_item extends Component{
    render(){
      let {privilegeChange} = this.props;
      return(
          <View>
            <TitleView s_title="抹零金额" style={clearingForm} titleStyle={clearingFormText}/>
            <View style={inputText}>
                <TextInput onChangeText={privilegeChange} placeholderTextColor="#b3b3b3" placeholder ="输入您的手工优惠金额" keyboardType="numeric"/>
            </View>
          </View>
        );
    }
}

//会员
class Member_item extends Component{
    render(){
      let {accountChange,passwordChange} = this.props;
      return(
          <View>
            <TitleView s_title="会员卡号" style={clearingForm} titleStyle={clearingFormText}/>
            <View style={inputText}>
                <TextInput onChangeText={accountChange} placeholderTextColor="#b3b3b3" placeholder ="卡号、手机号" keyboardType="numeric"/>
            </View>
          </View>
        );
    }
}

//V客
class V_item extends Component{
   constructor(props){
      super(props);
      this.state = {
          curType:-1
      };
    }
    _chageGroup(index){
        this.setState({curType:index});
        this.props.vChange(this.props.vList[index].vid,this.props.vList[index].name);
      }
    render(){
     let a_group = [];
     let s_label = "请选择";
     let {vList} = this.props;
     let {curType} = this.state;
      if (vList) {
         a_group = this.props.vList.map((item,key) =>{
            let {name} = item;
            if (key === 0) {
              return {s_label:name};
            }else{
              return {s_label:name,style:clearingFormItem};
            }
         });
       }
       if (curType != -1) {
         s_label = vList[curType].name;
       }
      return(
         <View>
            <TitleView s_title="已选V客" style={clearingForm} titleStyle={clearingFormText}/>
            <ScrollView>
               <View style={[baseBgColorW,baseRowCenter]}>
                  <Label s_label={s_label} o_labelStyle={vkeValueStyle}/>
               </View>
            <TitleView s_title="可选V客" style={clearingForm} titleStyle={clearingFormText}/>
               <View >
                  <RadioGroup f_change={(index)=>{this._chageGroup(index)}} a_group={a_group}/>
               </View>
            </ScrollView>
        </View>
        );
    }
}
export default Pay_index;
