'use strict';
import React,{ Component } from 'react';
import { View,ScrollView,Image} from 'react-native';
import Com from './common';
import {TopBar,RadioGroup,BlockBtn} from './components';
import o_styles from './order_technicianList.style';
const {container,submitBtnLabel,submitBtn,submitCon,itemLabel,imageBg} = o_styles;
const {baseContent,baseFlex,baseMT20} = Com;
const bgUrl = require("./normsSelect_bg.jpg");

class Order_technicianList extends Component {
    componentWillMount(){
        this._curTechIndex = Com.getPageParams('curTechIndex');//当前技师索引
        this._aTech = Com.getPageParams('a_tech') || [];//技师列表
    }
  	render() {
      let a_group = [];
      if(this._aTech){
        a_group = this._aTech.map((item,key)=>{
          return {s_label:item.name, style:baseMT20};
        });
      }
      let {submit} = this.props;
	    return (
           <Image style={imageBg} source={bgUrl}>
                <ScrollView>
                   <View style={[baseContent,container]}>
                      <RadioGroup ref={(component)=>{this._radio=component;}} s_curId={this._curTechIndex.toString()} a_group={a_group}/>
                   </View>
               </ScrollView>
              <View style={[submitCon]}>
                  <BlockBtn onPress={()=>submit(this)} text="确认" textStyle={submitBtnLabel}/>
              </View>
              <TopBar s_title="技师列表"/>
           </Image>
       );
   }
}
export default Order_technicianList;
