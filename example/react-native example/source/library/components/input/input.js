'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Text,TextInput} from 'react-native';
import Base from './base';
import  {MKTextField} from 'react-native-material-kit';
import o_styles from './input.style';
import {Line} from './line';
const {labelContainer,label,inputText} = o_styles;
export class Input extends Component {
    static propTypes = {
        ...TextInput.propTypes,//原生属性
        placeholder:PropTypes.string,//placeholder
        onChange: PropTypes.func,//文本改变回调
        password: PropTypes.bool,//是否为密码文本
        s_default:PropTypes.string,//文本默认值
        b_float:PropTypes.bool, //输入框上方是否显示文字
        textInputStyle: PropTypes.number,//输入文本样式
        disUnderline: PropTypes.bool,//是否禁用下划线
        underlineSize: PropTypes.number,//下划线尺寸
        highlightColor: PropTypes.string,//选中后下划线颜色
        tintColor: PropTypes.string,//默认下划线颜色
    };
    set value(v) {
        this.refs.textField.bufferedValue = v;
    }
    get value() {
        return (this.refs.textField.bufferedValue || '').trim();
    }
    render(){
        let {s_default,style,placeholder,textInputStyle,password,disUnderline,placeholderTextColor=Base.placeholderColor,
            tintColor=Base.tintColorColor,highlightColor=Base.mainColor,onChange,b_float,underlineSize} = this.props;
        return (
            <MKTextField ref="textField"
                style = {style}
                defaultValue={s_default}
                placeholder={placeholder}
                floatingLabelEnabled={b_float}
                tintColor={tintColor}
                password={password}
                textInputStyle={[inputText,textInputStyle]}
                underlineEnabled={!disUnderline}
                underlineSize = {underlineSize}
                placeholderTextColor ={placeholderTextColor}
                highlightColor={highlightColor}
                onChangeText = {(text)=>{
                    onChange && onChange(text);
                }}
            />
        );
    }
}
export class LabelInput extends Component {
    static propTypes = {
        ...Input.propTypes,
        s_label:PropTypes.string.isRequired, //左则label文本
        labelStyle:PropTypes.any, //左则label样式
        inputStyle:PropTypes.any, //右则input样式
        b_line:PropTypes.bool,//底部是否有线
        n_line:PropTypes.number,//底部线离左边距离
    };
    set value(v) {
        this.refs.labelInput.value = v;
    }
    get value() {
        return this.refs.labelInput.value;
    }
    render(){
        let {s_label,style,labelStyle,inputStyle,b_line,n_line} = this.props;
        return (
            <View style = {[labelContainer,style]}>
                <Text style ={[label,labelStyle]} >{s_label}</Text>
                <Input ref="labelInput" {...this.props} style={[Base.baseFlex,inputStyle]} />
                {b_line ? <Line n_left = {n_line}/> : null}
            </View>
        );
    }
}

