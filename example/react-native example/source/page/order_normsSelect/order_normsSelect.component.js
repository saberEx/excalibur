'use strict';
import React,{ Component } from 'react';
import { View,Text,ScrollView,Image,TouchableOpacity,TextInput} from 'react-native';
import Com from './common';
import {TopBar,RadioGroup,MediaItem,BlockBtn,LabelInput} from './components';
const rightArrowUrl = require("./rightSmallArrow.png");
const bgUrl = require("./normsSelect_bg.jpg");
import o_styles from './order_normsSelect.style';
const {inputText,container,imageBg,nameLable,nameListText,specPriceLabel,specPrice,inputPlaceholder,b3Text,c59Text,rightArrowImg,submitCon,specItem,specLable,submitBtnLabel,submitBtn} = o_styles;
const {baseContent,baseFlex,baseRow} = Com;
class SpecLabel extends Component {
  render(){
    return (
        <View style={specLable}>
            <Text style={specPriceLabel}>价格:</Text>
            <Text style={specPrice}>{this.props.price}元</Text>
          </View>
    );
  }
}
class Order_normsSelect extends Component {
    componentDidMount(){
        this.props.init();
    }
    componentWillMount() {
      this._aTech = Com.getPageParams('a_tech') || [];//技师列表
      this._aSpec = Com.getPageParams('goods_list') || [];//规格列表
      this._curSpecIndex = Com.getPageParams('curSpecIndex') || 0;//当前规格索引
      this._goods_name = Com.getPageParams('goods_name');//商品名
    }
  	render() {
      let {onOpenTech,submit,remark,curTechIndex,backPress,changeText} = this.props;
      let a_group = [];
      if(this._aSpec){
        a_group = this._aSpec.map((item,key)=>{
              let {goods_id,goods_price,goods_spec} = item;
              let specName = "";
              for (let prop in goods_spec) {
                if (goods_spec.hasOwnProperty(prop)) {
                    specName += goods_spec[prop];
                }
              }
              specName = specName || this._goods_name;
              return {s_label:specName,children:<SpecLabel price={goods_price}/>,style:specItem};
          }
        );
      }
      let techName = '请先选择技师';
      if(curTechIndex >= 0){
          techName = this._aTech[curTechIndex].name;
      }
	    return (
          <Image style={imageBg} source={bgUrl}>
            <ScrollView>
              <View style={[baseContent,container]}>
                <RadioGroup ref={(component)=>{this._radio=component;}} s_curId={this._curSpecIndex.toString()} a_group={a_group} />
                <TouchableOpacity  onPress={onOpenTech}>
                   <View style={nameLable} >
                      <View style={baseRow}>
                        <Text style={b3Text}>技师:</Text>
                        <Text style={c59Text}>{techName}</Text>
                      </View>
                      <View style={baseRow}>
                        <Text style={nameListText}>技师列表</Text>
                        <Image style={rightArrowImg} source={rightArrowUrl}/>
                      </View>
                    </View>
                </TouchableOpacity>
                  <View style={inputText}>
                    <TextInput onChangeText={changeText} placeholderTextColor="#b3b3b3" defaultValue={remark} placeholder ="备注"/>
                  </View>
              </View>
            </ScrollView>
            <TopBar s_title="选择规格" f_leftHandler={()=>backPress(this)}/>
            <View style={[submitCon]}>
                <BlockBtn onPress={()=>submit(this)} text="确认" textStyle={submitBtnLabel}/>
            </View>
          </Image>
       );
   }
}
export default Order_normsSelect;
