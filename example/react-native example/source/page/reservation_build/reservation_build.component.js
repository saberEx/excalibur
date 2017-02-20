'use strict';
import React,{ Component } from 'react';
import { View,DatePickerAndroid,TouchableOpacity ,Image,Text,TextInput} from 'react-native';
import Com from './common';
import {TopBar,LabelInput,Label,BlockBtn,RadioGroup,Line} from './components';
import o_styles from './reservation_build.style';
import DateTimePicker from 'react-native-datetime';
import Picker from 'react-native-picker';
const {baseContent,fzStyle,baseFlex,baseRow,baseColorHG,baseBgColorW,baseMT20} = Com;
let {labelStyle,container,paddingCon,bottomBtnContainer,arrowImage,labelTitleStyle,o_labelStyle,rowHeight,radioItem,mulText} = o_styles;
const arrowPng = require('./mediaItem-rightIcon.png');
//格式化日期时间前加0
function format(value) {
    return value.toString().replace(/(^\d{1}$)/,"0"+"$1");
}
const i_maxPickerNum = 12;
let a_pickerNum = [];
for(let i=1;i<=i_maxPickerNum;i++){
    a_pickerNum.push(i);
}
class Reservation_build extends Component {
    constructor(props){
        super(props);
        this.state = {
            pickedValue:1,
            dateTime:""
        };
    }
   componentDidMount(){
       this.props.init();
   }
  	render() {
        let {f_addReservation} = this.props;
        let {pickedValue,dateTime} = this.state;
        this.number = pickedValue;
	    return (
           <View style={baseFlex}>
               <View style={[baseContent,baseFlex]}>
                   <TouchableOpacity onPress={()=>{
                    this.dateTimePicker.showDateTimePicker(new Date(), (date)=>{
                        this.dateTime = date;
                        let dateTime = `${date.getFullYear()}-${format(date.getMonth()+1)}-${format(date.getDate())}  ${format(date.getHours())}:${format(date.getMinutes())}`;
                        this.setState({dateTime:dateTime});
                    });
                   }} style={[baseRow,baseBgColorW,baseMT20,paddingCon,rowHeight]}>
                       <Label style={[baseFlex]} o_titleStyle={labelTitleStyle} o_labelStyle={dateTime?o_labelStyle:[o_labelStyle,{color:Com.placeholderColor}]} s_title="时　　间：" s_label={dateTime?dateTime:"请选择预约日期和时间"}/>
                       <Image style={arrowImage} source={arrowPng}></Image>
                       <Line n_left={20}/>
                   </TouchableOpacity>
                   <LabelInput ref="linkman" b_line={true} n_line={20} underlineSize={0} style={[baseBgColorW,paddingCon]} placeholder="请填写联系人" labelStyle={labelStyle} textInputStyle={baseColorHG}  s_label="联  系  人：" />
                   <LabelInput ref="tel" b_line={true} n_line={20} underlineSize={0} style={[baseBgColorW,paddingCon]} placeholder="请填写联系方式"  textInputStyle={baseColorHG} labelStyle={labelStyle} s_label="联系方式：" />
                   <View style={[baseRow,baseBgColorW,paddingCon,rowHeight]}>
                       <Text style={[fzStyle(26),labelTitleStyle]}>性　　别：</Text>
                       <RadioGroup ref="sex" s_curId="2" style={[baseFlex,baseRow]} a_group={[{s_label:"男",s_id:"2",style:radioItem},{s_label:"女",s_id:"3",style:radioItem}]}/>
                       <Line n_left={20}/>
                   </View>
                   <TouchableOpacity onPress={()=>{
                        this.picker.toggle();
                   }} style={[baseRow,baseBgColorW,paddingCon,rowHeight]}>
                       <Label style={[baseFlex]} o_titleStyle={labelTitleStyle} o_labelStyle={[o_labelStyle,{color:"#0086ED"}]} s_title="请选择人数：" s_label={`${pickedValue}人`}/>
                       <Image style={arrowImage} source={arrowPng}></Image>
                       <Line n_left={20}/>
                   </TouchableOpacity>
                   <View style={[baseBgColorW,baseMT20,paddingCon]}>
                       <TextInput placeholder="备注" onChangeText={(textValue)=>{this.remarks=textValue;}}  placeholderTextColor={Com.placeholderColor} multiline={true} numberOfLines={3} underlineColorAndroid="transparent" style={mulText} />
                   </View>
                   <DateTimePicker cancelText="取消" okText="确定" ref={(datePicker)=>{this.dateTimePicker=datePicker;}}/>
               </View>
               <View style={bottomBtnContainer}>
                   <BlockBtn  onPress={()=>{
                   let {linkman,tel,sex} = this.refs;
                   f_addReservation(this.dateTime,linkman.value,tel.value,sex.value,this.state.pickedValue,this.remarks);
                   }} text="确定"/>
               </View>
               <Picker
                   ref={picker => this.picker = picker}
                   pickerBtnText="确 定"
                   pickerCancelBtnText="取 消"
                   style={[baseBgColorW,{
                        height: 200,
                        }]}
                   pickerToolBarStyle={{paddingTop:20,paddingBottom:20}}
                   showDuration={300}
                   showMask={true}
                   pickerData={a_pickerNum}//picker`s value List
                   selectedValue={pickedValue}//default to be selected value
                   onPickerDone={(pickedValue) => {
                            this.setState({pickedValue:pickedValue});
                       }}
               />
               <TopBar s_title="新建预约"/>
           </View>
       );
   }
}
export default Reservation_build;
