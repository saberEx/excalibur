/*
* @Author: 卢旺
* @Date:   2016-06-23 17:40:36
* @Last Modified by:   卢旺
* @Last Modified time: 2016-07-04 16:57:09
* 弹出框
*/
import React, { Component, PropTypes } from 'react';
import {Modal,Platform,Text,TextInput,TouchableWithoutFeedback,View} from 'react-native';
import o_styles from './prompt.styles';

export class Prompt extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onCancel: PropTypes.func,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    borderColor: PropTypes.string,
    promptStyle: PropTypes.any,
    titleStyle: PropTypes.any,
    buttonStyle: PropTypes.any,
    buttonTextStyle: PropTypes.any,
    submitButtonStyle: PropTypes.any,
    submitButtonTextStyle: PropTypes.any,
    cancelButtonStyle: PropTypes.any,
    cancelButtonTextStyle: PropTypes.any,
    inputStyle: PropTypes.any,
    b_input:PropTypes.bool,//判断中间为输入框还是text true为输入框 默认输入框
    s_text:PropTypes.string,//text的值
    o_textStyle:PropTypes.any,//text的style
    b_isCancle:PropTypes.bool,//判断是否需要取消按钮 true为不取消 默认不取消
  };

  static defaultProps = {
    visible: false,
    defaultValue: '',
    cancelText: '取消',
    submitText: '确定',
    borderColor:'#ccc',
    promptStyle: {},
    titleStyle: {},
    buttonStyle: {},
    buttonTextStyle: {},
    submitButtonStyle: {},
    submitButtonTextStyle: {},
    cancelButtonStyle: {},
    cancelButtonTextStyle: {},
    inputStyle: {},
    onChangeText: () => {},
    b_input:true,
    s_text:'',
    o_textStyle:{},
    b_isCancle:true,
  };

  state = {
    value: '',
    visible: false,
  };

  componentDidMount() {
    this.setState({value: this.props.defaultValue});
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({ visible });
  }

  _onChangeText = (value) => {
    this.setState({ value });
    this.props.onChangeText(value);
  };

  _onSubmitPress = () => {
    const { value } = this.state;
    this.props.onSubmit(value);
  };

  _onCancelPress = () => {
    this.props.onCancel();
  };

  close = () => {
    this.setState({visible: false});
  };

  _renderDialog = () => {
    const {
      title,
      placeholder,
      defaultValue,
      cancelText,
      submitText,
      borderColor,
      promptStyle,
      titleStyle,
      buttonStyle,
      buttonTextStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      inputStyle,
      b_input,
      s_text,
      o_textStyle,
      b_isCancle
    } = this.props;
    let v_input =
    <View>
      <Text
          style={[o_styles.dialogInput, o_textStyle]}
          underlineColorAndroid="white">{s_text}</Text>
      <View style={o_styles.pInputStyle}>
          <TextInput
            style={[o_styles.dialogInput, inputStyle]}
            defaultValue={defaultValue}
            onChangeText={this._onChangeText}
            placeholder={placeholder}
            autoFocus={true}
            keyboardType="numeric"
            secureTextEntry ={true}
            underlineColorAndroid="white"/>
      </View>
    </View>;

    let v_text =
    <View style={o_styles.dialogBodyText}>
       <Text
          style={[o_styles.dialogInput, o_textStyle]}
          underlineColorAndroid="white">{s_text}</Text>
    </View>;

    let cancelEl = null;
    if(b_isCancle){
      cancelEl =  <TouchableWithoutFeedback onPress={this._onCancelPress}>
                <View style={[o_styles.dialogAction, buttonStyle, cancelButtonStyle]}>
                  <Text style={[o_styles.dialogActionText, buttonTextStyle, cancelButtonTextStyle]}>
                    {cancelText}
                  </Text>
                </View>
              </TouchableWithoutFeedback>;
    }
    return (
      <View style={o_styles.dialog} key="prompt">
        <View style={o_styles.dialogOverlay}/>
        <View style={[o_styles.dialogContent, { borderColor }, promptStyle]}>
          <View style={[o_styles.dialogTitle, { borderColor }]}>
            <Text style={[o_styles.dialogTitleText, titleStyle]}>
              { title }
            </Text>
          </View>
          <View style={[o_styles.dialogBody, { borderColor }]}>
          {b_input?v_input:v_text}
          </View>
          <View style={[b_isCancle?o_styles.dialogFooter:null, { borderColor }]}>
            {cancelEl}
            <TouchableWithoutFeedback onPress={this._onSubmitPress}>
              <View style={[o_styles.dialogAction, buttonStyle, submitButtonStyle]}>
                <Text style={[o_styles.dialogActionText, buttonTextStyle, submitButtonTextStyle]}>
                  {submitText}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <Modal onRequestClose={() => this.close()} transparent={true} visible={this.props.visible}>
        {this._renderDialog()}
      </Modal>
    );
  }
};
