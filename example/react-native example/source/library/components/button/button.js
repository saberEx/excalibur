'use strict';
import React, {PropTypes,Component} from 'react';
import {View,Text,Image} from 'react-native';
import  {MKButton,MKColor} from 'react-native-material-kit';
import o_styles from './button.style';
const {container,buttonText,blockBtnStyle} = o_styles;

export class Button extends Component {
    static propTypes = {
        text : PropTypes.string.isRequired,
        style : PropTypes.number,
        textStyle : PropTypes.number,
        onPress : PropTypes.func,
    };
    render(){
        let  {textStyle,style,text,onPress} = this.props;
        return (
            <MKButton
                shadowRadius={2}
                shadowOffset={{width:0, height:2}}
                shadowOpacity={0.7}
                shadowColor="black"
                onPress={() => {
                    onPress && onPress();
                }}
                style={[container,style]}
            >
                <Text pointerEvents="none"
                      style={[buttonText,textStyle]}>
                    {text}
                </Text>
            </MKButton>
        );
    }
}
//块级按钮
export class BlockBtn extends Component{
    render(){
        return(
            <Button {...this.props} style={blockBtnStyle}/>
        );
    }
}
//icon按钮
export class IconBtn extends Component{
    static propTypes = {
        width : PropTypes.number.isRequired,//按钮宽
        height : PropTypes.number.isRequired,//按钮高
        onPress : PropTypes.func,
    };
    render(){
        let {width,height,onPress,style} = this.props;
        let o_iconBtnStyle = {width,height};
        return(
            <MKButton style={[o_iconBtnStyle,style]} onPress={()=>{onPress && onPress();}}>
                <Image style={o_iconBtnStyle} pointerEvents="none" source={this.props.s_icon}/>
            </MKButton>
        );
    }
}

