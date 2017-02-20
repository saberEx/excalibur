'use strict';
import React,{ Component } from 'react';
import { View,Text ,Image,ScrollView,TouchableOpacity} from 'react-native';
import Com from './common';
import {TopBar,Button,TabView,BlockBtn,Label,Line,NetImage,LabelInput} from './components';
import o_styles from './reservation_details.style';
const {baseContent,baseFlex,baseRow,baseColCenter,baseBgColorW,baseMB20,basePT10} = Com;
const {container,textHeight,itemContainer,itemContent,itemTop,itemTopSpan,itemAddTime,priceText,goodsItemTotalPrice,goodsItemTextCon,
       cancelBtn,btnTextStyle,cancelBtnNone,goodsItem,goodsItemImage,goodsItemCon,goodsItemTopText,goodsItemConBottom,goodsItemTextNum,
       submitCon,submitText,textColorNum,submitBtnLabel,submitBtn,labelInputLabel,textInputStyle} = o_styles;
const o_labelColor = {color:"#333333",alignSelf:"center"};
const o_labelTitleStyle = {color:"#999999",alignSelf:"center",...Com.fzStyle(24)};
class Item extends Com.Component {
    render() {
        let {trueTime,reserve_sn,reserve_type,linkman,tel,remarks,itemLen,index,status,f_showEdit} = this.props;
        let o_mB = index < itemLen-1 ? baseMB20: {};
        let e_edit = null;
        if(parseInt(reserve_type)!==1 && parseInt(status)===1 ){
            e_edit = <Button style={cancelBtn} textStyle={btnTextStyle} onPress={f_showEdit} text="编辑"/>;
        }else {
            e_edit = <Button style={cancelBtnNone} textStyle={btnTextStyle}  text="编辑"/>;
        }
        return (
            <View style={[baseBgColorW,itemContainer,o_mB]}>
                <View style={[baseRow,baseColCenter,itemTop]}>
                    <View style={itemTopSpan}>
                    </View>
                    <Label style={baseFlex} o_titleStyle={{color:"#666666",alignSelf:"center"}} o_labelStyle={o_labelColor} s_title="预定单号：" s_label={reserve_sn}></Label>
                    {e_edit}
                    <Line n_left={20}/>
                </View>
                <View style={[itemContent]} >
                    <Label style={[textHeight,basePT10]} o_labelStyle={o_labelColor} o_titleStyle={o_labelTitleStyle} s_title="类　　型："
                            s_label={`线${parseInt(reserve_type)===1?"上":"下"}订单`}></Label>
                    <Label style={[baseFlex,textHeight]} o_titleStyle={o_labelTitleStyle} o_labelStyle={o_labelColor} s_title="联  系  人：" s_label={`${linkman}    ${tel}`}></Label>
                    <Label style={textHeight} o_titleStyle={o_labelTitleStyle} o_labelStyle={o_labelColor} s_title="备　　注：" s_label={remarks}></Label>
                    <Label style={textHeight} o_titleStyle={o_labelTitleStyle} o_labelStyle={o_labelColor} s_title="时　　间：" s_label={trueTime}></Label>
                </View>
            </View>
        );
    }
}
class Item1 extends Com.Component {
    render() {
        let {trueTime,reserve_sn,reserve_type,linkman,tel,id,remarks,itemLen,index,f_edit} = this.props;
        let o_mB = index < itemLen-1 ? baseMB20: {};
        return (
            <View style={[baseBgColorW,itemContainer,o_mB]}>
                <View style={[baseRow,baseColCenter,itemTop]}>
                    <View style={itemTopSpan}>
                    </View>
                    <Label style={baseFlex} o_titleStyle={{color:"#666666"}} o_labelStyle={o_labelColor} s_title="预定单号：" s_label={reserve_sn}></Label>
                    <Button style={cancelBtn} textStyle={btnTextStyle} onPress={()=>{
                    let {linkman,tel,remarks} = this.refs;
                        f_edit(id,linkman.value,tel.value,remarks.value);
                        }} text="完成"/>
                    <Line n_left={20}/>
                </View>
                <View style={[itemContent]} >
                    <Label style={[textHeight,basePT10]} o_labelStyle={o_labelColor} o_titleStyle={o_labelTitleStyle} s_title="类　　型："
                           s_label={`线${parseInt(reserve_type)===1?"上":"下"}订单`}></Label>
                    <LabelInput ref="linkman" underlineSize={0} style={textHeight} textInputStyle={textInputStyle} labelStyle={labelInputLabel} s_label="联  系  人：" s_default={linkman}/>
                    <LabelInput ref="tel" underlineSize={0} style={textHeight} textInputStyle={textInputStyle} labelStyle={labelInputLabel} s_label="手  机  号：" s_default={tel}/>
                    <LabelInput ref="remarks" underlineSize={0} style={textHeight} textInputStyle={textInputStyle} labelStyle={labelInputLabel} s_label="备　　注：" s_default={remarks}/>
                </View>
            </View>
        );
    }
}
class GoodsItem extends  Com.Component {
    render(){
        let {goods_image,goods_num,goods_price,goods_pay_price,goods_name} = this.props;
        return (
            <TouchableOpacity onPress={this._onPress}>
                <View style={[baseBgColorW,goodsItem]}>
                    <NetImage style={goodsItemImage} source={{uri:Com.getGoodsImagePath(goods_image)}}></NetImage>
                    <View style={goodsItemCon}>
                        <Text style={goodsItemTopText}>
                            {goods_name}
                        </Text>
                        <View style={goodsItemConBottom}>
                            <Text style={[goodsItemTextCon,priceText]}>{goods_price}元/份</Text>
                            <Text style={[goodsItemTextCon,goodsItemTextNum]}>数量:{goods_num}</Text>
                            <Text style={[baseFlex,goodsItemTextCon,goodsItemTotalPrice]}>{goods_pay_price}元</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
class Reservation_details extends Component {
   componentDidMount(){
       this.props.init();
   }
  	render() {
        let {goods_list,n_totalPrice,status,reserve_type,id,f_edit,editStatus,f_changeEditStatus} = this.props;
        let e_goodsItem = null;
        if(parseInt(reserve_type)===1 && goods_list){
            e_goodsItem = goods_list.map((item,key)=>{
                n_totalPrice = n_totalPrice + parseFloat(item.goods_pay_price);
                return <GoodsItem key={key} {...item} />;
            });
        }
        let e_btn = null;
        if(status && parseInt(status)===1){
            e_btn = <View style={[baseBgColorW,submitCon]}>
                        <Text style={submitText}>
                            总计：<Text style={textColorNum}>{n_totalPrice}元</Text>
                        </Text>
                        <Button onPress={()=>{this.props.confirmOrder(id);}} text="确认订单" textStyle={submitBtnLabel} style={submitBtn}/>
                    </View>;
        }
        let e_item = null;
        if(editStatus){
            e_item = <Item1 {...this.props} f_edit={f_edit}/>;
        }else if(status){
            e_item = <Item {...this.props} f_showEdit={()=>f_changeEditStatus()} />;
        }
	    return (
           <View style={baseFlex}>
               <View style={[baseContent,container,baseFlex]}>
                   {e_item}
                   {e_goodsItem}
                   {e_btn}
               </View>
               <TopBar s_title="订单详情"/>
           </View>
       );
   }
}
export default Reservation_details;
