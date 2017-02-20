'use strict';
import React,{ Component } from 'react';
import { View ,Text,TextInput,ScrollView} from 'react-native';
import Com from './common';
import {TopBar,TitleView,RadioGroup,Line,CheckBox,LabelInput,BlockBtn} from './components';
import o_styles from './member_add.style';
const {baseContent,baseMT20,baseBgColorW,baseRow,baseColCenter,baseFlex,baseP10,basePB10} = Com;
const {fontStyle,buttonSty,inputLab,labelBottom} = o_styles;
class Member_card extends Component {
    componentDidMount(){
       this.props.init();
    }
  	render() {
      const {a_data} = this.props;
      let a_group = [];
      if(a_data){
          const lastIndex = a_data.length - 1;
          let n_left = Com.px2dp(20);
          a_group = a_data.map((item,index)=>{
              if(index === lastIndex){
                  n_left = 0;
              }
              return {s_label:item.name,s_id:item.vid,n_left:n_left,style:{height:Com.px2dp(85)}};
          });
      }
	    return (
           <View style={baseFlex}>
             <ScrollView>
                  <View style={baseContent}>
                        <View style={[baseMT20,baseBgColorW]}>
                            <TitleView s_title='会员信息'>
                                <View style={baseP10}>
                                  <LabelInput style={labelBottom} ref="memberName" n_line={Com.px2dp(20)} s_label='会员名称:' labelStyle={inputLab} disUnderline={true} tintColor='white'/>
                                  <LabelInput style={labelBottom} ref="memberMobile" n_line={Com.px2dp(20)} s_label='手机号码:' labelStyle={inputLab} disUnderline={true} tintColor='white'/>
                                  <LabelInput style={labelBottom} ref="memberCard" n_line={Com.px2dp(20)} s_label='会员卡号:' labelStyle={inputLab} disUnderline={true} tintColor='white'/>
                                </View>
                            </TitleView>
                        </View>
                        <View style={[baseBgColorW,baseColCenter,baseRow]}>
                            <Text style={fontStyle}>性        别:</Text>
                            <RadioGroup s_curId='1' ref="memberSex" a_group={[{s_label:'男',s_onColor:"#FBC30A",s_offColor:"#FBC30A",s_fillColor:"#FBC30A",s_id:"1"},{s_label:'女',s_onColor:"#FBC30A",s_offColor:"#FBC30A",s_fillColor:"#FBC30A",s_id:"2"}]} style={baseRow}/>
                        </View>
                         <View style={[baseMT20,baseBgColorW]}><TitleView s_title='选择V客'></TitleView></View>
                         <View style={baseBgColorW}>
                            <RadioGroup ref="vid" a_group={a_group}/>
                         </View>
                   </View>
              </ScrollView>
            <TopBar s_title="会员售卡"/>
            <View style={buttonSty}>
              <BlockBtn text='确定' onPress={()=>this.props.getCardData(this)}></BlockBtn>
            </View>
          </View>
       );
   }
}
export default Member_card;
